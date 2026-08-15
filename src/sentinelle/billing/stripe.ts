import Stripe from "stripe";

// Client Stripe paresseux : le module peut être importé (typage, tests) sans
// clé configurée. L'erreur ne survient qu'au premier appel réel.
let cached: Stripe | undefined;

export function stripe(): Stripe {
  if (!cached) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error(
        "STRIPE_SECRET_KEY manquante. Renseignez-la dans .env.local (voir .env.example).",
      );
    }
    cached = new Stripe(key);
  }
  return cached;
}

export type WebhookVerification =
  | { ok: true; event: Stripe.Event }
  | { ok: false; reason: string };

/**
 * Vérifie la signature d'un webhook Stripe.
 *
 * Obligatoire : sans cette vérification, n'importe qui connaissant l'URL peut
 * créer des clients en envoyant un faux événement de paiement.
 *
 * `constructEventAsync` plutôt que `constructEvent` : la variante asynchrone
 * s'appuie sur la Web Crypto API, disponible dans tous les runtimes.
 */
export async function verifyWebhook(
  rawBody: string,
  signature: string | null,
): Promise<WebhookVerification> {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return { ok: false, reason: "STRIPE_WEBHOOK_SECRET non configuré" };
  if (!signature) return { ok: false, reason: "en-tête stripe-signature absent" };

  try {
    const event = await stripe().webhooks.constructEventAsync(rawBody, signature, secret);
    return { ok: true, event };
  } catch (error) {
    return {
      ok: false,
      reason: error instanceof Error ? error.message : "signature invalide",
    };
  }
}
