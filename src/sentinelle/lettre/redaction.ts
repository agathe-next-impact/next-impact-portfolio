import Anthropic from "@anthropic-ai/sdk";
import { loadPrompt } from "@sentinelle/redaction/prompts";
import {
  LETTRE_AXES_SCHEMA,
  LETTRE_SYNTHESE_SCHEMA,
  LETTRE_TENDANCES_SCHEMA,
  LettreSchema,
  type Dossier,
  type Lettre,
} from "./schema";
import { renderRedactionBrief, type LettreContext } from "./context";
import { extractJsonObject } from "./collecte";
import { guardLettre, type LettreGuardOutcome } from "./guards";

// ─────────────────────────────────────────────────────────────────────────────
// Passe 2 — la rédaction, en trois appels.
//
// **Aucun outil.** C'est la moitié du dispositif : sans accès au web, le modèle
// ne peut affirmer que ce que le dossier contient, et le garde-fou n'a plus qu'à
// vérifier une correspondance. Lui laisser la recherche ici reviendrait à écrire
// et à sourcer dans le même geste, sans que rien ne puisse être contrôlé entre
// les deux.
//
// **Pourquoi trois appels et non un.** Le schéma complet de la lettre fait
// répondre 400 à l'API — « The compiled grammar is too large » (constaté en réel
// le 2026-08-15). La sortie structurée compile le schéma en grammaire, et celle
// d'une lettre à douze axes dépassait ce que le compilateur accepte (la lettre
// est passée à cinq axes depuis, mais le découpage garde sa marge de max_tokens
// par appel). Le découpage suit les étapes du prompt (3, 4, 5).
//
// **Le brief est mis en cache.** Il est identique aux trois appels et pèse le
// dossier entier ; sans `cache_control`, on le paierait trois fois plein tarif.
// Les consignes qui varient sont placées APRÈS la borne de cache, sinon le
// préfixe change et rien ne se relit.
// ─────────────────────────────────────────────────────────────────────────────

export const REDACTION_PROMPT = "lettre-redaction-system-prompt.md";

/**
 * Chaque appel écrit un tiers de lettre. Marge large : sur Sonnet 5 la réflexion
 * adaptative est active par défaut et compte dans `max_tokens`. À 16 000, la
 * synthèse (trois scénarios, budget, échéancier, questions, sources) était
 * tronquée par la réflexion. Le streaming est en place — pas de risque de timeout.
 */
const MAX_TOKENS = 32_000;

export interface RedactionTelemetry {
  inputTokens: number;
  outputTokens: number;
  /** Jetons relus depuis le cache — la mesure qui dit si le découpage coûte. */
  cachedTokens: number;
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

const CONSIGNES = {
  axes:
    "Écris maintenant **l'ouverture et les cinq axes** (étape 3) : le titre, la ligne de " +
    "contexte, le chapeau, « votre site en une phrase », puis les cinq axes dans l'ordre, " +
    "chacun avec sa question en exergue, son analyse et son statut conclusif. N'écris rien " +
    "d'autre : les tendances et la synthèse font l'objet d'appels séparés.",
  tendances:
    "Écris maintenant **les tendances** (étape 4) : les tendances du mois, le marché des " +
    "solutions par famille, les signaux de demande, les tendances de fond et ce qui ne " +
    "change pas. Chaque tendance est qualifiée pour CE site, à partir du profil que tes " +
    "axes viennent d'établir.",
  synthese:
    "Écris maintenant **la synthèse et la clôture** (étape 5) : les trois actions au plus, " +
    "les trois scénarios, ce qu'il faut différer, la méthode de budget, comment décider, " +
    "l'échéancier à six mois, les trois questions au prestataire, les sources regroupées " +
    "par thème, la ligne de clôture et tes notes de production. Les actions se choisissent " +
    "parmi les axes que tu as conclus en « agir ».",
} as const;

/** Ce que les appels 2 et 3 doivent savoir des axes déjà écrits, en dix lignes. */
function resumeDesAxes(partie: { axes: Lettre["axes"] }): string {
  return [
    "# Ce que tu as déjà écrit — les axes et leur statut",
    ...partie.axes.map((axe) => `- Axe ${axe.numero} · ${axe.nom} : ${axe.statut}${axe.horizon ? ` (${axe.horizon})` : ""}`),
  ].join("\n");
}

async function demanderPartie(
  model: string,
  effort: "medium" | "high" | "xhigh",
  brief: string,
  consigne: string,
  schema: Record<string, unknown>,
  telemetry: RedactionTelemetry,
): Promise<{ ok: true; payload: unknown; raw: string } | { ok: false; reason: string; raw?: string }> {
  let message: Anthropic.Message;

  try {
    const stream = anthropic().messages.stream({
      model,
      max_tokens: MAX_TOKENS,
      system: loadPrompt(REDACTION_PROMPT),
      output_config: { effort, format: { type: "json_schema", schema } },
      messages: [
        {
          role: "user",
          content: [
            // Borne de cache : le brief est identique aux trois appels.
            { type: "text", text: brief, cache_control: { type: "ephemeral" } },
            { type: "text", text: consigne },
          ],
        },
      ],
    });

    message = await stream.finalMessage();
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return { ok: false, reason: "quota Anthropic atteint — reprise à la prochaine passe" };
    }
    if (error instanceof Anthropic.APIError) {
      return { ok: false, reason: `API Anthropic : ${error.status ?? "?"} ${error.message}` };
    }
    return { ok: false, reason: error instanceof Error ? error.message : "rédaction impossible" };
  }

  telemetry.inputTokens += message.usage.input_tokens;
  telemetry.outputTokens += message.usage.output_tokens;
  telemetry.cachedTokens += message.usage.cache_read_input_tokens ?? 0;

  if (message.stop_reason === "refusal") {
    return { ok: false, reason: "rédaction refusée par les garde-fous du modèle" };
  }
  if (message.stop_reason === "max_tokens") {
    return { ok: false, reason: "partie de lettre tronquée (max_tokens)" };
  }

  const raw = message.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("");

  try {
    return { ok: true, payload: JSON.parse(raw), raw };
  } catch {
    try {
      return { ok: true, payload: JSON.parse(extractJsonObject(raw)), raw };
    } catch {
      return { ok: false, reason: "partie illisible : JSON invalide", raw };
    }
  }
}

export async function writeLettre(
  context: LettreContext,
  dossier: Dossier,
  input: { ficheNames: string[]; quiet: boolean },
  options: { model?: string; effort?: "medium" | "high" | "xhigh" } = {},
): Promise<LettreOutcome> {
  const model = options.model ?? process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5";
  const effort = options.effort ?? "high";
  const telemetry: RedactionTelemetry = { inputTokens: 0, outputTokens: 0, cachedTokens: 0 };
  const brief = renderRedactionBrief(context, dossier);

  const partieAxes = await demanderPartie(
    model,
    effort,
    brief,
    CONSIGNES.axes,
    LETTRE_AXES_SCHEMA,
    telemetry,
  );
  if (!partieAxes.ok) {
    return { ok: false, reason: `axes — ${partieAxes.reason}`, telemetry, raw: partieAxes.raw };
  }

  // Les deux appels suivants voient ce que le premier a conclu : sans ça, une
  // synthèse pourrait recommander une action sur un axe conclu « non concerné ».
  const resume = resumeDesAxes(partieAxes.payload as { axes: Lettre["axes"] });

  const [partieTendances, partieSynthese] = [
    await demanderPartie(
      model,
      effort,
      brief,
      `${resume}\n\n${CONSIGNES.tendances}`,
      LETTRE_TENDANCES_SCHEMA,
      telemetry,
    ),
    await demanderPartie(
      model,
      effort,
      brief,
      `${resume}\n\n${CONSIGNES.synthese}`,
      LETTRE_SYNTHESE_SCHEMA,
      telemetry,
    ),
  ];

  if (!partieTendances.ok) {
    return { ok: false, reason: `tendances — ${partieTendances.reason}`, telemetry, raw: partieTendances.raw };
  }
  if (!partieSynthese.ok) {
    return { ok: false, reason: `synthèse — ${partieSynthese.reason}`, telemetry, raw: partieSynthese.raw };
  }

  const assemble = {
    ...(partieAxes.payload as object),
    ...(partieTendances.payload as object),
    ...(partieSynthese.payload as object),
  };
  const raw = JSON.stringify(assemble);

  const parsed = LettreSchema.safeParse(assemble);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      ok: false,
      reason: `lettre hors schéma : ${issue?.path.join(".") ?? "?"} — ${issue?.message ?? ""}`,
      telemetry,
      raw,
    };
  }

  const guard = guardLettre(parsed.data, {
    dossier,
    ficheNames: input.ficheNames,
    quiet: input.quiet,
    // Le secteur et les notes du client font partie de son vocabulaire
    // légitime : un studio a le droit de parler du parc de ses clients.
    clientContext: [context.sector, context.notes].filter(Boolean).join(" "),
    // L'URL du site n'est pas une source du dossier, mais la lettre peut la citer.
    siteUrl: context.siteUrl,
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
