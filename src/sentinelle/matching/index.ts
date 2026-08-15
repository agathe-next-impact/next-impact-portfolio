// API publique du module matching.
//
// `versions.ts` compare — c'est le code le plus critique du produit, écrit et
// testé dès la phase 1. `match.ts` décide, purement. `run.ts` pilote la passe
// sur la base. Les trois sont volontairement séparés : on doit pouvoir relire
// la règle sans lire le SQL, et l'inverse.

export {
  compareVersions,
  isAffected,
  isVersionInRange,
  parseRange,
  parseVersion,
  type AffectionInput,
  type Comparator,
  type VersionConstraint,
} from "./versions";

export {
  decide,
  targets,
  versionConfidenceOf,
  RADAR_MONTHS,
  type MatchableIntel,
  type MatchableStackItem,
  type MatchDecision,
} from "./match";

export { runMatching, MAX_ALERTS_PER_RUN, type MatchReport } from "./run";
