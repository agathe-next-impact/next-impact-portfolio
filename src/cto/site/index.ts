// API publique du suivi technique (WP Umbrella). Un seul point d'entrée :
// l'espace, le Cron et la commande importent d'ici.

export { wpUmbrellaToken, WpUmbrellaError } from "./api";
export { buildSnapshot, performanceScore } from "./normalize";
export {
  fetchSnapshot,
  siteReportsFor,
  siteStateFor,
  syncSites,
  type SiteSyncReport,
} from "./store";
export type {
  SiteBackup,
  SiteIncident,
  SiteIntervention,
  SiteReport,
  SiteSnapshot,
  SiteState,
  SiteUpdate,
  SiteVulnerability,
} from "./types";
