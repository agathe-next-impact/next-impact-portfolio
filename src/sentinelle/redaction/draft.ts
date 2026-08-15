import Anthropic from "@anthropic-ai/sdk";
import type { DraftedAlert } from "@sentinelle/types";
import { renderContext, type RedactionContext } from "./context";
import { guardDraft, type GuardOutcome } from "./guards";
import { systemPrompt } from "./prompts";
import { DraftSchema, DRAFT_JSON_SCHEMA, toDraftedAlert } from "./schema";

// ─────────────────────────────────────────────────────────────────────────────
// Appel à l'API Claude.
//
// Sortie structurée plutôt que « réponds en JSON » : le schéma est transmis
// dans la requête, le JSON revient valide par construction, et zod ne sert plus
// qu'à vérifier que schéma et code ne divergent pas.
//
// Effort « medium » : la tâche est courte et le verdict est déjà calculé par du
// code déterministe ; ce qu'on demande au modèle, c'est d'écrire clairement,
// pas de trancher. Réglable par ANTHROPIC_EFFORT si l'usage prouve le contraire.
//
// Ne lève jamais : une API indisponible laisse une alerte sans texte — qu'un
// humain écrira, ou que la passe du lendemain reprendra. Aucune alerte ne part
// sans validation humaine de toute façon (règle 4).
// ─────────────────────────────────────────────────────────────────────────────

export const DEFAULT_MODEL = "claude-opus-5";

/**
 * Marge large : sur Claude Opus 5 la réflexion est active par défaut et
 * `max_tokens` plafonne réflexion + réponse. Un plafond serré tronquerait la
 * réponse au milieu d'une phrase plutôt que d'économiser quoi que ce soit.
 */
const MAX_TOKENS = 8_000;

export type DraftOutcome =
  | { ok: true; draft: DraftedAlert; raw: string; corrections: string[] }
  | { ok: false; reason: string; raw?: string; violations?: string[] };

let client: Anthropic | undefined;

function anthropic(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error(
        "ANTHROPIC_API_KEY manquante. Renseignez-la dans .env.local (voir .env.example).",
      );
    }
    client = new Anthropic({ apiKey });
  }
  return client;
}

function textOf(message: Anthropic.Message): string {
  return message.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("");
}

export interface DraftOptions {
  model?: string;
  effort?: "low" | "medium" | "high";
}

/**
 * Rédige une alerte à partir de son contexte.
 *
 * Le contexte ne contient ni nom ni e-mail du client : c'est `buildContext` qui
 * s'en assure, et c'est testé.
 */
export async function draftAlert(
  context: RedactionContext,
  options: DraftOptions = {},
): Promise<DraftOutcome> {
  const model = options.model ?? process.env.ANTHROPIC_MODEL ?? DEFAULT_MODEL;
  const effort = options.effort ?? "medium";

  let message: Anthropic.Message;
  try {
    message = await anthropic().messages.create({
      model,
      max_tokens: MAX_TOKENS,
      system: systemPrompt(),
      output_config: {
        effort,
        format: { type: "json_schema", schema: DRAFT_JSON_SCHEMA },
      },
      messages: [{ role: "user", content: renderContext(context) }],
    });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return { ok: false, reason: "quota Anthropic atteint — reprise à la prochaine passe" };
    }
    if (error instanceof Anthropic.APIError) {
      return { ok: false, reason: `API Anthropic : ${error.status ?? "?"} ${error.message}` };
    }
    return {
      ok: false,
      reason: error instanceof Error ? error.message : "appel à l'API impossible",
    };
  }

  if (message.stop_reason === "refusal") {
    return { ok: false, reason: "requête déclinée par le modèle" };
  }
  if (message.stop_reason === "max_tokens") {
    return { ok: false, reason: "réponse tronquée (max_tokens)" };
  }

  const raw = textOf(message);

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return { ok: false, reason: "réponse illisible : JSON invalide", raw };
  }

  const parsed = DraftSchema.safeParse(payload);
  if (!parsed.success) {
    return { ok: false, reason: `réponse hors schéma : ${parsed.error.issues[0]?.message}`, raw };
  }

  const guarded: GuardOutcome = guardDraft(toDraftedAlert(parsed.data), context);
  if (!guarded.ok) {
    return {
      ok: false,
      reason: guarded.violations.join(" · "),
      raw,
      violations: guarded.violations,
    };
  }

  return { ok: true, draft: guarded.draft, raw, corrections: guarded.corrections };
}
