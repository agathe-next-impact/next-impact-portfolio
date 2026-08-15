import { stripe } from "@sentinelle/billing/stripe";
import { sentinelleBaseUrl } from "@sentinelle/url";

// ─────────────────────────────────────────────────────────────────────────────
// Portail de facturation Stripe.
//
// Résilier, changer de carte, récupérer une facture : rien de tout ça n'est
// codé ici, et c'est délibéré. Un abonné doit pouvoir partir en deux clics sans
// écrire à personne — c'est la contrepartie honnête d'un abonnement mensuel, et
// ça évite de faire transiter des données bancaires par le produit.
// ─────────────────────────────────────────────────────────────────────────────

export type PortalOutcome =
  | { ok: true; url: string }
  | { ok: false; reason: string };

/**
 * Ouvre une session de portail pour un client Stripe.
 *
 * Deux échecs attendus, et ils ne se confondent pas :
 *  - pas d'identifiant Stripe sur la fiche (abonnement créé à la main, ou
 *    webhook incomplet) : il n'y a rien à ouvrir ;
 *  - portail non configuré dans le tableau de bord Stripe : l'API répond une
 *    erreur explicite qu'on rend telle quelle plutôt que de la traduire en
 *    « une erreur est survenue ».
 */
export async function openBillingPortal(
  stripeCustomerId: string | null,
): Promise<PortalOutcome> {
  if (!stripeCustomerId) {
    return {
      ok: false,
      reason:
        "Votre abonnement n'est pas rattaché à un compte de facturation. Écrivez-moi, je m'en occupe.",
    };
  }

  try {
    const session = await stripe().billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${sentinelleBaseUrl()}/espace`,
    });

    return { ok: true, url: session.url };
  } catch (error) {
    console.error("[sentinelle] ouverture du portail Stripe impossible", error);
    return {
      ok: false,
      reason: "La page de facturation est momentanément indisponible. Réessayez plus tard.",
    };
  }
}
