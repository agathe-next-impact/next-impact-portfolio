// API publique de la composition de l'espace client : sections selon les
// services, calendrier, profil d'accompagnement.

export {
  buildEvents,
  dayKey,
  monthGrid,
  upcoming,
  type CalendarEvent,
  type EventKind,
  type MonthDay,
} from "./calendar";
export { clientProfile, type ClientProfile } from "./profile";
export {
  actionsFor,
  actionsVerdict,
  ANTICIPATION_DAYS,
  BACKUP_MAX_AGE_DAYS,
  buildFrise,
  byPhase,
  isOpenOpportunity,
  lastSuccessfulBackup,
  missionsOf,
  missionsVerdict,
  sitePoints,
  siteVerdict,
  type Action,
  type ActionKind,
  type Actions,
  type Frise,
  type FriseLane,
  type FriseMark,
  type FriseTone,
  type Mission,
  type MissionKind,
  type Phase,
  type SitePoint,
  type Verdict,
} from "./pilotage";
export {
  GROUP_LABELS,
  hasPersonalisedWatch,
  LEGACY_SLUGS,
  sectionByKey,
  SECTIONS,
  visibleSections,
  type Contents,
  type Section,
  type SectionGroup,
  type SectionKey,
  type ServiceCode,
} from "./sections";
export {
  lirePhase,
  lireSeverites,
  lireSynthese,
  type Fiche,
  type Gravite,
  type Phase as PhaseAudit,
  type Point,
  type Rubrique,
  type Severites,
  type Synthese,
} from "./synthese";
