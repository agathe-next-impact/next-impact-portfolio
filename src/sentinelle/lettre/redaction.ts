import Anthropic from "@anthropic-ai/sdk";
import { loadPrompt } from "@sentinelle/redaction/prompts";
import { LETTRE_JSON_SCHEMA, LettreSchema, type Dossier, type Lettre } from "./schema";
import { renderRedactionBrief, type LettreContext } from "./context";
import { guardLettre, type LettreGuardOutcome } from "./guards";

// ─────────────────────────────────────────────────────────────────────────────
// Passe 2 — la rédaction.
//
// **Aucun outil.** C'est la moitié du dispositif : sans accès au web, le modèle
// ne peut affirmer que ce que le dossier contient, et le garde-fou n'a plus qu'à
// vérifier une correspondance. Lui laisser la recherche ici reviendrait à
// écrire et à sourcer dans le même geste, sans que rien ne puisse être contrôlé
// entre les deux.
//
// Le refus est assumé : une lettre qui cite une source absente du dossier n'est
// pas corrigeable par une substitution — elle est fausse. Elle repart au tour
// suivant plutôt que d'atterrir dans une file de relecture où elle passerait
// pour relue.
// ─────────────────────────────────────────────────────────────────────────────

export const REDACTION_PROMPT = "lettre-redaction-system-prompt.md";

/** 4 500 mots ≈ 7 000 jetons, plus la réflexion : de la marge, et du streaming. */
const MAX_TOKENS = 32_000;

export interface RedactionTelemetry {
  inputTokens: number;
  outputTokens: number;
}

export type LettreOutcome =
  | { ok: true; lettre: Lettre; guard: LettreGuardOutcome; telemetry: RedactionTelemetry; raw: string }
  | { ok: false; reason: string; guard?: LettreGuardOutcome; telemetry: RedactionTelemetry; raw?: string };

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

/** Pour les tests : rend le client réinjectable sans toucher au module. */
export function setRedactionClient(injected: Anthropic | undefined): void {
  client = injected;
}

export async function writeLettre(
  context: LettreContext,
  dossier: Dossier,
  input: { ficheNames: string[]; quiet: boolean },
  options: { model?: string; effort?: "medium" | "high" | "xhigh" } = {},
): Promise<LettreOutcome> {
  const model = options.model ?? process.env.ANTHROPIC_MODEL ?? "claude-opus-5";
  const telemetry: RedactionTelemetry = { inputTokens: 0, outputTokens: 0 };

  let message: Anthropic.Message;
  try {
    const stream = anthropic().messages.stream({
      model,
      max_tokens: MAX_TOKENS,
      system: loadPrompt(REDACTION_PROMPT),
      output_config: {
        effort: options.effort ?? "high",
        format: { type: "json_schema", schema: LETTRE_JSON_SCHEMA },
      },
      messages: [{ role: "user", content: renderRedactionBrief(context, dossier) }],
    });

    message = await stream.finalMessage();
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return { ok: false, reason: "quota Anthropic atteint — reprise à la prochaine passe", telemetry };
    }
    if (error instanceof Anthropic.APIError) {
      return { ok: false, reason: `API Anthropic : ${error.status ?? "?"} ${error.message}`, telemetry };
    }
    return {
      ok: false,
      reason: error instanceof Error ? error.message : "rédaction impossible",
      telemetry,
    };
  }

  telemetry.inputTokens = message.usage.input_tokens;
  telemetry.outputTokens = message.usage.output_tokens;

  if (message.stop_reason === "refusal") {
    return { ok: false, reason: "rédaction refusée par les garde-fous du modèle", telemetry };
  }
  if (message.stop_reason === "max_tokens") {
    return { ok: false, reason: "lettre tronquée (max_tokens)", telemetry };
  }

  const raw = message.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("");

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return { ok: false, reason: "lettre illisible : JSON invalide", telemetry, raw };
  }

  const parsed = LettreSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      ok: false,
      reason: `lettre hors schéma : ${parsed.error.issues[0]?.message}`,
      telemetry,
      raw,
    };
  }

  const guard = guardLettre(parsed.data, {
    dossier,
    ficheNames: input.ficheNames,
    quiet: input.quiet,
  });

  if (!guard.ok) {
    return {
      ok: false,
      reason: `lettre refusée — ${guard.violations.join(" · ")}`,
      guard,
      telemetry,
      raw,
    };
  }

  return { ok: true, lettre: parsed.data, guard, telemetry, raw };
}
