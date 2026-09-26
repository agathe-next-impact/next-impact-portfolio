// API publique du digest hebdomadaire : veille technique (Sentinelle) et
// Signaux Faibles réunis en quelques lignes, assemblés sans modèle de langage.

export {
  assembleDigest,
  assembleSentinelle,
  assembleSignal,
  citedRefs,
  extractAxes,
  extractEssentiel,
  pickEditions,
  readAxisTitle,
  type EditionInput,
} from "./assemble";
export { digestEmailHtml, sendDigestEmail } from "./email";
export {
  assembleWeek,
  digestsForClient,
  digestsOfWeek,
  validateAndSend,
  type AdminDigest,
  type ClientDigest,
  type DigestAssembleReport,
  type SendReport,
} from "./store";
export {
  DIGEST_VERSION,
  LINE_CHARS,
  SENTINELLE_LINES,
  SIGNAL_EDITIONS,
  SIGNAL_LINES,
  type DigestContent,
  type DigestLine,
  type DigestSentinelle,
  type DigestSignal,
  type DigestTone,
  type SignalLevel,
} from "./types";
export { parseWeek, previousWeek, weekLabel, weekOf, weekRange } from "./week";
