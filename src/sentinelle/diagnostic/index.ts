// API publique du module diagnostic — la grille en quatre cases du rapport de
// scan : organisation et positionnement stratégique, positionnement web dans
// l'écosystème, dispositif site web, puis la recommandation : quel pack du
// catalogue, nécessaire, utile ou pas prioritaire, et pour quel objectif.
//
// Deux passes (collecte web sourcée, rédaction sans outils) séparées par des
// garde-fous de code : voir build.ts et guards.ts.

export {
  buildDiagnostic,
  DIAGNOSTIC_COLLECTE_PROMPT,
  DIAGNOSTIC_RECHERCHES,
  DIAGNOSTIC_REDACTION_PROMPT,
} from "./build";
export {
  renderCollecteBrief,
  renderConcurrents,
  renderDiscours,
  renderDispositif,
  renderRedactionBrief,
} from "./context";
export {
  retenirConcurrents,
  retenirSecteur,
  sansDoublons,
  sourceVerifiee,
  versConcurrent,
} from "./concurrents";
export {
  accorderConclusion,
  bornerExamens,
  bornerGrille,
  bornerLignes,
  bornerMots,
  retenirFaits,
  sansTiret,
  selonCharte,
  urlsObtenues,
} from "./guards";
export {
  FAITS_JSON_SCHEMA,
  FaitsSchema,
  GRILLE_JSON_SCHEMA,
  GrilleSchema,
  BESOINS,
  ISSUES,
  MAX_CARACTERES,
  MAX_LIGNES,
  MAX_MOTS,
  TONALITES,
  type Fait,
  type Grille,
} from "./schema";
