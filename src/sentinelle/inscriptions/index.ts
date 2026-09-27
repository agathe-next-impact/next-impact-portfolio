// API publique du module inscriptions — l'abonnement à Sentinelle depuis le
// 2026-09-27 : un opt-in (nom, organisation, e-mail, site) validé par Agathe
// depuis l'admin. Plus de paiement en ligne ; la facturation se fait à part.

export {
  parseSubscriptionRequest,
  type ParsedRequest,
  type SubscriptionRequestInput,
} from "./request";
export { composerNotification, destinataire, notifierDemande } from "./notify";
export {
  activateSubscriptionRequest,
  deactivateClient,
  dismissSubscriptionRequest,
  listSubscriptionRequests,
  recordSubscriptionRequest,
  upsertSubscriber,
  type StoreResult,
  type SubscriptionRequestRow,
} from "./store";
