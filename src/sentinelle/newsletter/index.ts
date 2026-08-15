// Newsletter bimensuelle (deux envois par mois) — palier unique à 19 €.
//
// `blocks.ts` assemble les trois blocs factuels (état, delta, radar) sans
// modèle ; `draft.ts` écrit les deux blocs rédigés ; `build.ts` fabrique un
// numéro par client actif, en brouillon. La relecture et l'envoi vivent dans
// `admin/digests.ts` — règle 4.
export {
  assembleBlocks,
  buildRadar,
  daysBetween,
  isQuietIssue,
  missingForIssue,
  periodStart,
  periodWindow,
  RADAR_MONTHS,
  type DeltaEntry,
  type HealthLine,
  type NewsletterBlocks,
  type RadarCandidate,
  type RadarEntry,
} from "./blocks";

export {
  draftNewsletterBlocks,
  renderNewsletterContext,
  DEFAULT_MODEL,
  type NewsletterContext,
  type NewsletterDraftOutcome,
} from "./draft";

export { buildIssueFor, runNewsletterBuild, type BuildReport } from "./build";

export {
  NEWSLETTER_TIMEZONE,
  SECOND_ISSUE_DAY,
  formatNewsletterPeriod,
  newsletterPeriodAt,
  newsletterPeriodKey,
  parseNewsletterPeriod,
  previousNewsletterPeriod,
  type NewsletterPeriod,
} from "./period";
