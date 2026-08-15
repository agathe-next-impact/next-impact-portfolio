// Lettre de veille bimensuelle (phase 4, refondue) — deux passes et un contrat.
//
// La lettre n'est plus un relevé de surveillance : c'est une lettre de
// consultant, qui croise l'actualité de la période et l'observation du site
// selon douze axes, puis conclut par des scénarios et une fenêtre de décision.
//
// Le découpage en deux passes est le cœur du dispositif :
//
//   collecte  — a des outils (recherche et lecture web), n'écrit rien ;
//   rédaction — n'a aucun outil, n'écrit que ce que le dossier contient.
//
// Entre les deux, `guards.ts` vérifie mécaniquement ce qu'un prompt ne peut que
// demander : aucune source inventée, aucune technologie attribuée au site hors
// de sa fiche, et la structure que la sortie structurée ne sait pas exprimer.
// Ce que le code ne peut pas vérifier — l'attribution, « votre site utilise X »
// contre « X progresse » — reste le travail de la relecture humaine (règle 4).

export {
  AXES,
  AXIS_STATUSES,
  DossierSchema,
  LettreSchema,
  MARKET_TRAJECTORIES,
  OBSERVATION_STATUSES,
  TREND_DIRECTIONS,
  type Axe,
  type Dossier,
  type Fait,
  type Lettre,
  type Scenario,
} from "./schema";

export {
  previousIssueFrom,
  renderCollecteBrief,
  renderConstate,
  renderRedactionBrief,
  type LettreContext,
  type PreviousIssue,
} from "./context";

export {
  allowedVocabulary,
  clientText,
  guardLettre,
  normalizeUrl,
  wordCount,
  FULL_LENGTH,
  SHORT_LENGTH,
  type LettreGuardOutcome,
} from "./guards";

export {
  collectDossier,
  setCollecteClient,
  COLLECTE_PROMPT,
  FETCH_BUDGET,
  SEARCH_BUDGET,
  type CollecteOutcome,
  type CollecteTelemetry,
} from "./collecte";

export {
  setRedactionClient,
  writeLettre,
  REDACTION_PROMPT,
  type LettreOutcome,
} from "./redaction";

export {
  emptyProduction,
  isQuietIssue,
  missingForIssue,
  parseIssue,
  ISSUE_VERSION,
  type IssueContent,
  type ProductionNote,
} from "./issue";

export {
  buildAndStoreIssue,
  listClientsForIssue,
  type ClientRow,
  type IssueOutcome,
} from "./build";
