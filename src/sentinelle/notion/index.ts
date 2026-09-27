// API publique du module Notion de Sentinelle.
//
// Où les alertes se rédigent et se valident depuis le passage à Notion
// (2026-09) — voir docs/sentinelle/notion-alertes.md pour le schéma de la base
// et README.md pour la doctrine d'isolation (jeton et base propres à
// Sentinelle, jamais ceux du CTO).

export { alertsDatabaseId, configurationIssue, pageUrl, type NotionPage } from "./client";

export {
  alertKey,
  createAlertPage,
  listAlertPages,
  markSent,
  parseAlertPage,
  writeDraftContent,
  type AlertPageInput,
  type AlertPageRecord,
} from "./alerts";

export {
  PROPS,
  STATUS_LABEL,
  VERDICT_LABEL,
  statusFromLabel,
  verdictFromLabel,
} from "./schema";

export {
  backfillMissingPages,
  syncAlertsFromNotion,
  type AlertSyncReport,
} from "./sync";
