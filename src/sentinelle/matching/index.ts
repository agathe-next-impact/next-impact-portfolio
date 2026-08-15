// API publique du module matching.
// Le croisement intel × stack (matchIntelToStacks) arrive en phase 3 ; la
// comparaison de versions, elle, existe et est testée dès la phase 1 parce que
// tout le reste en dépend.
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
