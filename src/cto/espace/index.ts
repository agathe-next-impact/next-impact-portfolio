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
  hasPersonalisedWatch,
  sectionByKey,
  SECTIONS,
  visibleSections,
  type Contents,
  type Section,
  type SectionKey,
  type ServiceCode,
} from "./sections";
