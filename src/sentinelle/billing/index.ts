// API publique du module billing.
// Abonnement à la lettre d'info Sentinelle via un Payment Link Stripe :
// la page d'offre envoie vers la page de paiement hébergée, le webhook crée la
// fiche client. Le portail client (gestion/résiliation par l'abonné) arrive en
// phase 5 avec l'espace client.
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
  type CheckoutSessionLike,
  type SubscriptionOutcome,
} from "./subscription";

export { stripe, verifyWebhook, type WebhookVerification } from "./stripe";
export { deactivateSubscription, upsertSubscriber } from "./store";
