// API publique de la couche rédaction.
//
// La règle 3 du CLAUDE.md gouverne le module : « le LLM ne connaît rien, il
// reçoit tout ». `context.ts` décide de ce qu'il reçoit — jamais le nom ni
// l'e-mail du client. `guards.ts` vérifie ce qu'il rend : un schéma garantit la
// forme, pas le fond.

export {
  allowedComponents,
  buildContext,
  renderContext,
  type ContextSources,
  type RedactionContext,
} from "./context";

export {
  DEFAULT_MODEL,
  draftAlert,
  type DraftOptions,
  type DraftOutcome,
} from "./draft";

export {
  allowedNames,
  citedOutsideContext,
  guardDraft,
  redIsJustified,
  type GuardOutcome,
} from "./guards";

export { resetPromptCache, systemPrompt, SYSTEM_PROMPT_PATH } from "./prompts";

export {
  DraftSchema,
  DRAFT_JSON_SCHEMA,
  toDraftedAlert,
  VERDICTS,
  type DraftPayload,
} from "./schema";

export { runRedaction, MAX_DRAFTS_PER_RUN, type RedactionReport } from "./run";
