import type Stripe from "stripe";
import {
  clientFromCheckoutSession,
  deactivateSubscription,
  upsertSubscriber,
  verifyWebhook,
  type CheckoutSessionLike,
} from "@sentinelle/billing";
import { clientSubscribed, inngest } from "@sentinelle/inngest";

// Runtime Node et corps brut : la vérification de signature Stripe porte sur les
// octets exacts du corps. Toute désérialisation préalable (req.json()) casse la
// signature — d'où `await req.text()`.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Webhook Stripe — abonnement à la lettre d'info Sentinelle.
 *
 * Codes de retour, qui pilotent les nouvelles tentatives de Stripe :
 *   400 → signature invalide : ne jamais retenter, la requête n'est pas de Stripe.
 *   500 → écriture en base échouée : Stripe retente, et c'est ce qu'on veut.
 *   200 → traité, ou volontairement ignoré (type d'événement non géré).
 *
 * Un événement inconnu renvoie 200 : sinon Stripe retente indéfiniment un
 * message qu'on n'a aucune intention de traiter.
 */
export async function POST(req: Request) {
  const rawBody = await req.text();
  const verification = await verifyWebhook(rawBody, req.headers.get("stripe-signature"));

  if (!verification.ok) {
    console.warn(`[sentinelle] webhook Stripe rejeté : ${verification.reason}`);
    return new Response("signature invalide", { status: 400 });
  }

  const event = verification.event;

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as unknown as CheckoutSessionLike;
        const outcome = clientFromCheckoutSession(session);

        if (!outcome.ok) {
          // Pas une erreur technique : session hors périmètre (paiement unique,
          // session non réglée). On l'acquitte pour clore la boucle.
          console.info(`[sentinelle] ${event.id} ignoré — ${outcome.reason}`);
          break;
        }

        const row = await upsertSubscriber(outcome.client);

        for (const warning of outcome.warnings) {
          console.warn(`[sentinelle] abonné ${row?.email ?? outcome.client.email} — ${warning}`);
        }
        console.info(`[sentinelle] abonnement enregistré : ${row?.email ?? "?"}`);

        // Suite du parcours (fiche amorcée, e-mail de bienvenue) : hors de la
        // requête webhook, qui doit rendre la main vite. Si la mise en file
        // échoue, on répond 500 pour que Stripe retente — l'upsert ci-dessus
        // est idempotent, et un abonné sans message d'accueil est pire qu'un
        // événement rejoué.
        if (row) {
          await inngest.send(
            clientSubscribed.create({
              clientId: row.id,
              ...(outcome.scanId ? { scanId: outcome.scanId } : {}),
            }),
          );
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const rows = await deactivateSubscription(subscription.id);

        if (rows.length === 0) {
          console.warn(
            `[sentinelle] résiliation ${subscription.id} sans fiche correspondante`,
          );
        } else {
          console.info(`[sentinelle] abonnement désactivé : ${rows[0].email}`);
        }
        break;
      }

      default:
        // Acquitté sans traitement.
        break;
    }
  } catch (error) {
    // 500 volontaire : Stripe retentera. Le message reste dans les journaux,
    // la réponse ne dit rien de l'interne.
    console.error(`[sentinelle] échec du traitement de ${event.id}`, error);
    return new Response("traitement impossible", { status: 500 });
  }

  return Response.json({ received: true });
}
