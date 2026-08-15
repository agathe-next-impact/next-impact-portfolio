// Cadence et faits internes de la lettre bimensuelle (deux envois par mois).
//
// Ce module ne fabrique plus les numéros : depuis la refonte en lettre de veille,
// c'est `@sentinelle/lettre` qui les écrit, en deux passes. Il reste ici ce dont
// la lettre a besoin et qui n'appartient qu'à Sentinelle :
//
//   `period.ts` — la cadence du 1er et du 15, et sa clé de période ;
//   `blocks.ts` — le constaté : fiche suivie, alertes envoyées, radar des fins
//                  de support, tous déjà vérifiés contre la version du client ;
//   `build.ts`  — `loadConstate`, qui l'assemble pour un client et une période.
//
// Ce sont les seuls faits d'un numéro qui ne viennent ni d'une recherche ni d'un
// modèle. La lettre les reçoit comme acquis et n'a pas le droit de les contredire.
export {
  assembleBlocks,
  buildRadar,
  daysBetween,
  periodStart,
  periodWindow,
  RADAR_MONTHS,
  type DeltaEntry,
  type HealthLine,
  type NewsletterBlocks,
  type RadarCandidate,
  type RadarEntry,
} from "./blocks";

export { loadConstate } from "./build";

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
