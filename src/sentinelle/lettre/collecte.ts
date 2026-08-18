import Anthropic from "@anthropic-ai/sdk";
import { loadPrompt } from "@sentinelle/redaction/prompts";
import { DOSSIER_JSON_SCHEMA, DossierSchema, type Dossier } from "./schema";
import { renderCollecteBrief, type LettreContext } from "./context";

// ─────────────────────────────────────────────────────────────────────────────
// Passe 1 — la collecte.
//
// La seule passe du produit qui a des outils : recherche et lecture web, côté
// Anthropic. Elle n'écrit pas la lettre ; elle rapporte des faits datés et
// sourcés, et c'est cette séparation qui permet à du code de vérifier le
// sourçage avant qu'une phrase soit écrite.
//
// Deux contraintes de la vraie vie, invisibles en test :
//
//  1. **Une boucle d'outils serveur s'arrête toute seule.** Au bout de dix
//     itérations l'API rend `stop_reason: "pause_turn"` : ce n'est pas une
//     erreur, c'est une pause. Il faut renvoyer la conversation telle quelle
//     pour qu'elle reprenne — sans ajouter de message « continue », que l'API
//     n'attend pas. Avec un budget de trente recherches, on la rencontre à
//     chaque numéro.
//  2. **Le budget doit être borné côté serveur, pas espéré côté prompt.**
//     `max_uses` plafonne les recherches et les lectures. Un prompt qui demande
//     « ne dépasse pas 30 » est une consigne ; `max_uses` est une limite.
// ─────────────────────────────────────────────────────────────────────────────

export const COLLECTE_PROMPT = "lettre-collecte-system-prompt.md";

/** Budget de la collecte, aligné sur le prompt : 30 recherches, 8 lectures. */
export const SEARCH_BUDGET = 30;
export const FETCH_BUDGET = 8;

/**
 * Plafond de lecture d'une page web (jetons). Sans lui, une page obèse entre
 * entière dans le contexte, puis est refacturée à chaque reprise. 12 000 jetons
 * ≈ 9 000 mots : aucun article utile n'est coupé, les catalogues et les pages
 * infinies, si.
 */
export const FETCH_MAX_CONTENT_TOKENS = 12_000;

/** Une passe qui n'aboutit pas en huit reprises ne tourne pas rond. */
const MAX_CONTINUATIONS = 8;

const MAX_TOKENS = 32_000;

export interface CollecteTelemetry {
  searches: number;
  fetches: number;
  /** Reprises après `pause_turn` — utile pour régler le budget. */
  continuations: number;
  inputTokens: number;
  outputTokens: number;
  /** Jetons relus depuis le cache — la mesure de ce que les reprises coûtent. */
  cachedTokens: number;
}

export type CollecteOutcome =
  | { ok: true; dossier: Dossier; telemetry: CollecteTelemetry; raw: string }
  | { ok: false; reason: string; telemetry: CollecteTelemetry; raw?: string };

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
export function setCollecteClient(injected: Anthropic | undefined): void {
  client = injected;
}

function textOf(message: Anthropic.Message): string {
  return message.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("");
}

function countFetches(message: Anthropic.Message): number {
  return message.content.filter((block) => block.type === "web_fetch_tool_result").length;
}

export async function collectDossier(
  context: LettreContext,
  options: {
    model?: string;
    effort?: "medium" | "high" | "xhigh";
    /** Budgets réduits pour la lettre-échantillon ; défauts = lettre abonnée. */
    searchBudget?: number;
    fetchBudget?: number;
  } = {},
): Promise<CollecteOutcome> {
  const model = options.model ?? process.env.ANTHROPIC_MODEL ?? "claude-opus-5";
  const searchBudget = options.searchBudget ?? SEARCH_BUDGET;
  const fetchBudget = options.fetchBudget ?? FETCH_BUDGET;

  const telemetry: CollecteTelemetry = {
    searches: 0,
    fetches: 0,
    continuations: 0,
    inputTokens: 0,
    outputTokens: 0,
    cachedTokens: 0,
  };

  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: renderCollecteBrief(context) },
  ];

  let message: Anthropic.Message | undefined;

  for (let attempt = 0; attempt <= MAX_CONTINUATIONS; attempt++) {
    try {
      const stream = anthropic().messages.stream({
        model,
        max_tokens: MAX_TOKENS,
        system: loadPrompt(COLLECTE_PROMPT),
        // Borne de cache automatique sur le dernier bloc de la requête : à
        // chaque reprise `pause_turn`, tout l'historique (prompt, brief,
        // résultats de recherche déjà lus) se relit à ×0,1 au lieu de se
        // refacturer plein tarif. C'était le premier poste de coût de la
        // collecte — mesuré via `telemetry.cachedTokens`.
        cache_control: { type: "ephemeral" },
        output_config: {
          effort: options.effort ?? "high",
          format: { type: "json_schema", schema: DOSSIER_JSON_SCHEMA },
        },
        tools: [
          { type: "web_search_20260209", name: "web_search", max_uses: searchBudget },
          {
            type: "web_fetch_20260209",
            name: "web_fetch",
            max_uses: fetchBudget,
            max_content_tokens: FETCH_MAX_CONTENT_TOKENS,
          },
        ],
        messages,
      });

      message = await stream.finalMessage();
    } catch (error) {
      if (error instanceof Anthropic.RateLimitError) {
        return {
          ok: false,
          reason: "quota Anthropic atteint — reprise à la prochaine passe",
          telemetry,
        };
      }
      if (error instanceof Anthropic.APIError) {
        return {
          ok: false,
          reason: `API Anthropic : ${error.status ?? "?"} ${error.message}`,
          telemetry,
        };
      }
      return {
        ok: false,
        reason: error instanceof Error ? error.message : "collecte impossible",
        telemetry,
      };
    }

    telemetry.searches += message.usage.server_tool_use?.web_search_requests ?? 0;
    telemetry.fetches += countFetches(message);
    telemetry.inputTokens += message.usage.input_tokens;
    telemetry.outputTokens += message.usage.output_tokens;
    telemetry.cachedTokens += message.usage.cache_read_input_tokens ?? 0;

    if (message.stop_reason !== "pause_turn") break;

    // Pause, pas erreur : on rend la main à la même conversation. Aucun message
    // utilisateur ajouté — l'API reprend sur la présence du bloc d'outil.
    messages.push({ role: "assistant", content: message.content });
    telemetry.continuations++;
  }

  if (!message) {
    return { ok: false, reason: "aucune réponse de l'API", telemetry };
  }

  if (message.stop_reason === "pause_turn") {
    return {
      ok: false,
      reason: `collecte inachevée après ${MAX_CONTINUATIONS} reprises`,
      telemetry,
    };
  }

  if (message.stop_reason === "refusal") {
    return { ok: false, reason: "collecte refusée par les garde-fous du modèle", telemetry };
  }

  if (message.stop_reason === "max_tokens") {
    return { ok: false, reason: "dossier tronqué (max_tokens)", telemetry };
  }

  const raw = textOf(message);

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return { ok: false, reason: "dossier illisible : JSON invalide", telemetry, raw };
  }

  const parsed = DossierSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      ok: false,
      reason: `dossier hors schéma : ${parsed.error.issues[0]?.message}`,
      telemetry,
      raw,
    };
  }

  // Une collecte sans aucun fait n'est pas une erreur technique — c'est une
  // période creuse, ou un site injoignable. Elle produit une lettre courte, et
  // la lettre le dira.
  if (parsed.data.faits.length === 0) {
    console.info(
      `[sentinelle] collecte : aucun fait retenu (${telemetry.searches} recherches) — numéro allégé`,
    );
  }

  return { ok: true, dossier: parsed.data, telemetry, raw };
}
