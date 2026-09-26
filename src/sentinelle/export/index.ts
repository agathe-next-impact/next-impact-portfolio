// Export en lecture seule des constats validés d'un client.
// Consommé par HTTP uniquement (espace de direction technique, tâches Cowork de
// Signaux Faibles) : aucun code hors de `src/sentinelle/` n'importe ce module.

export {
  EXPORT_AXES,
  EXPORT_VERSION,
  SentinelleExportSchema,
  type ExportAlert,
  type ExportBlock,
  type ExportLetter,
  type SentinelleExport,
} from "./contract";
export { buildExport, EXPORT_MONTHS } from "./build";
export { checkExportAuth, type ExportAuth } from "./auth";
export { renderLettre } from "./render";
