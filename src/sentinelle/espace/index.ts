// Espace client (phase 5) — lectures et facturation.
//
// Ce module ne montre que ce qui a été envoyé : ni brouillon, ni alerte
// écartée, ni numéro en attente de relecture. La règle 4 (« rien ne part sans
// relecture humaine ») serait vidée de son sens si l'espace donnait à lire ce
// que le produit n'assume pas encore.
//
// L'authentification vit dans `@sentinelle/access`, la fiche dans
// `@sentinelle/onboarding`, la glue Next dans `app/(sentinelle)/espace/`.

export {
  getReceivedIssueHtml,
  listReceivedAlerts,
  listReceivedIssues,
  periodLabel,
  type ReceivedAlert,
  type ReceivedIssue,
} from "./history";

export { openBillingPortal, type PortalOutcome } from "./portal";
