// API publique du module rétention (plan §9).
//
// La règle est dans `policy.ts` — pure, testée, source unique des durées.
// L'exécution est dans `purge.ts` — c'est le seul endroit qui touche la base.

export {
  anonymizableAlerts,
  cutoffs,
  expiredClients,
  expiredScans,
  minus,
  RETENTION,
  type ClientRow,
  type ClientVerdict,
  type Cutoffs,
  type Duration,
  type ScanRow,
  type ScanVerdict,
  type WrittenRow,
} from "./policy";

export {
  anonymousEmail,
  isAnonymizedEmail,
  ANONYMOUS_EMAIL_DOMAIN,
  deleteAllDataFor,
  EMPTY_REPORT,
  isEmptyReport,
  purgeCancelledClients,
  purgeIntelRaw,
  purgeScans,
  purgeWrittenTexts,
  runRetention,
  type PurgeReport,
} from "./purge";
