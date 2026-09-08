// API publique de la passerelle Notion.
//
// Un seul consommateur aujourd'hui — `scripts/cto-sync.ts` — et c'est voulu :
// rien du site ni de l'espace client ne doit importer ce module. L'espace lit
// Postgres, jamais Notion.

export { NotionError, queryDatabase, type NotionPage } from "./api";
export { clientsDatabaseId, configurationIssue, databaseIdFor, SYNCED_KINDS } from "./config";
export { PROPS, mapPage, UNTITLED } from "./map";
export {
  syncFromNotion,
  MASS_WITHDRAWAL_THRESHOLD,
  type KindReport,
  type SyncReport,
} from "./sync";
