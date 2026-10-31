// API publique du digest hebdomadaire : la veille technique (Sentinelle)
// réunie en quelques lignes, assemblée sans modèle de langage.

export {
  assembleDigest,
  assembleSentinelle,
} from "./assemble";
export { appliquerRetouches, retouchesDuFormulaire, type DigestEdits } from "./edit";
export { digestEmailHtml, sendDigestEmail } from "./email";
export {
  assembleWeek,
  digestsForClient,
  digestsOfWeek,
  dismissDigest,
  editDigest,
  reopenDigest,
  resetDigest,
  sendDigest,
  validateDigest,
  type AdminDigest,
  type ClientDigest,
  type DigestAssembleReport,
  type SendReport,
} from "./store";
export {
  DIGEST_VERSION,
  LINE_CHARS,
  SENTINELLE_LINES,
  type DigestContent,
  type DigestLine,
  type DigestSentinelle,
  type DigestTone,
} from "./types";
export { parseWeek, previousWeek, weekLabel, weekOf, weekRange } from "./week";
