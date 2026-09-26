// API publique de la veille technique dans l'espace : lecture de l'export
// Sentinelle par HTTP. Jamais d'import de `src/sentinelle/`.

export { fetchSentinelleExport, sentinelleExportConfig, SentinelleExportError } from "./api";
export {
  SENTINELLE_VERDICTS,
  SentinelleExportSchema,
  type SentinelleAlert,
  type SentinelleExport,
  type SentinelleLetter,
  type SentinelleRadar,
  type SentinelleVerdict,
} from "./contract";
export {
  letterInputFrom,
  sentinelleLetterKey,
  sentinelleStateFor,
  syncSentinelle,
  type SentinelleSyncReport,
} from "./store";
