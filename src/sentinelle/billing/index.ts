// API publique du module billing.
// Abonnement à la lettre d'info Sentinelle via un Payment Link Stripe : la page
// d'offre envoie vers la page de paiement hébergée, le webhook crée la fiche
// client, puis émet `sentinelle/client.subscribed` — c'est là que commencent
// l'amorçage de la fiche et l'e-mail de bienvenue.
// Le portail de facturation (résiliation par l'abonné) vit dans
// `@sentinelle/espace/portal` : il appartient à l'espace client, pas à
// l'encaissement.
export {
  OFFER_AMOUNT_CENTS,
  OFFER_CURRENCY,
  OFFER_ISSUES_PER_MONTH,
  OFFER_PRICE_LABEL,
  checkAmount,
  paymentLinkUrl,
} from "./offer";

export {
  clientFromCheckoutSession,
  fallbackName,
  normalizeSiteUrl,
  scanReference,
  type CheckoutSessionLike,
  type SubscriptionOutcome,
} from "./subscription";

export { stripe, verifyWebhook, type WebhookVerification } from "./stripe";
export { deactivateSubscription, upsertSubscriber } from "./store";
