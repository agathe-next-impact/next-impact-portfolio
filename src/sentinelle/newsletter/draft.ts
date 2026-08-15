import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { citedOutside, loadPrompt, NEWSLETTER_PROMPT } from "@sentinelle/redaction";
import { daysBetween, type NewsletterBlocks } from "./blocks";

// ─────────────────────────────────────────────────────────────────────────────
// Les deux blocs rédigés d'un numéro.
//
// Même doctrine que la rédaction d'alerte, pour les mêmes raisons :
//
//   · sortie structurée — le JSON est valide par construction, zod ne vérifie
//     plus que la cohérence entre le schéma et le code ;
//   · le modèle ne reçoit **ni nom ni e-mail** du client (règle 3 + minimisation
//     : Anthropic est sous-traitant, plan §9) ;
//   · un garde-fou de code, pas une consigne : si le texte nomme une technologie
//     absente de la fiche, il est refusé. Un numéro qui parle d'un composant que
//     le client n'a pas n'est pas corrigible, il est faux.
//
// Ne lève jamais : un numéro sans blocs rédigés reste relisible et complétable à
// la main dans l'admin. Rien ne part sans relecture de toute façon (règle 4).
// ─────────────────────────────────────────────────────────────────────────────

export const DEFAULT_MODEL = "claude-opus-5";
const MAX_TOKENS = 8_000;

const NEWSLETTER_JSON_SCHEMA = {
  type: "object",
  properties: {
    watch: {
      type: "string",
      description: "La veille du moment, 3 à 5 phrases, sans Markdown.",
    },
    reco: {
      type: "string",
      description: "Une recommandation, 1 à 3 phrases, commençant par un verbe.",
    },
  },
  required: ["watch", "reco"],
  additionalProperties: false,
} as const;

const NewsletterDraftSchema = z.object({
  watch: z.string().min(1),
  reco: z.string().min(1),
});

export interface NewsletterContext {
  sector: string | null;
  notes: string | null;
  blocks: NewsletterBlocks;
  /** Noms que le texte a le droit d'employer : le stack du client, et rien d'autre. */
  allowedNames: string[];
}

function line(label: string, value: string | null): string {
  return value ? `${label} : ${value}` : `${label} : non renseigné`;
}

/**
 * Rend le contexte en texte.
 *
 * Volontairement pauvre : ce qui n'y figure pas ne peut pas être écrit. C'est
 * cette pauvreté qui rend le garde-fou applicable.
 */
export function renderNewsletterContext(context: NewsletterContext): string {
  const { blocks } = context;
  const issue = new Date(blocks.issueDate);

  const composants = blocks.health.components.map(
    (component) =>
      `- ${component.label}${component.version ? ` ${component.version}` : " (version inconnue)"}`,
  );

  const alertes = blocks.delta.alerts.map(
    (alert) => `- [${alert.verdict ?? "info"}] ${alert.title}`,
  );

  const nouveaux = blocks.delta.newComponents.map(
    (component) => `- ${component.label}${component.version ? ` ${component.version}` : ""}`,
  );

  const radar = blocks.radar.map(
    (entry) => `- ${entry.title} (dans ${entry.daysLeft} jours)`,
  );

  return [
    "# Le client",
    line("Secteur", context.sector),
    line("Notes de contexte", context.notes),
    "",
    "# Son site, tel qu'il est suivi",
    ...(composants.length > 0 ? composants : ["- aucun composant suivi"]),
    blocks.health.withoutVersion > 0
      ? `(${blocks.health.withoutVersion} composant(s) sans version connue)`
      : "",
    "",
    blocks.delta.since
      ? `# Ce qui lui a été envoyé depuis le numéro du ${blocks.delta.since.slice(0, 10)}`
      : "# Premier numéro : rien ne lui a encore été envoyé",
    ...(alertes.length > 0 ? alertes : ["- aucune alerte envoyée sur la période"]),
    "",
    "# Composants apparus sur la période",
    ...(nouveaux.length > 0 ? nouveaux : ["- aucun"]),
    "",
    "# Fins de support à venir dans les six mois",
    ...(radar.length > 0 ? radar : ["- aucune"]),
    "",
    `Numéro daté du ${issue.toISOString().slice(0, 10)}. Rédige les deux blocs.`,
  ]
    .filter((entry) => entry !== "")
    .join("\n");
}

export type NewsletterDraftOutcome =
  | { ok: true; watch: string; reco: string; raw: string }
  | { ok: false; reason: string; raw?: string };

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

export async function draftNewsletterBlocks(
  context: NewsletterContext,
  options: { model?: string; effort?: "low" | "medium" | "high" } = {},
): Promise<NewsletterDraftOutcome> {
  const model = options.model ?? process.env.ANTHROPIC_MODEL ?? DEFAULT_MODEL;

  let message: Anthropic.Message;
  try {
    message = await anthropic().messages.create({
      model,
      max_tokens: MAX_TOKENS,
      system: loadPrompt(NEWSLETTER_PROMPT),
      output_config: {
        effort: options.effort ?? "medium",
        format: { type: "json_schema", schema: NEWSLETTER_JSON_SCHEMA },
      },
      messages: [{ role: "user", content: renderNewsletterContext(context) }],
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

  if (message.stop_reason === "max_tokens") {
    return { ok: false, reason: "réponse tronquée (max_tokens)" };
  }

  const raw = message.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("");

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return { ok: false, reason: "réponse illisible : JSON invalide", raw };
  }

  const parsed = NewsletterDraftSchema.safeParse(payload);
  if (!parsed.success) {
    return { ok: false, reason: `réponse hors schéma : ${parsed.error.issues[0]?.message}`, raw };
  }

  const invented = citedOutside(
    `${parsed.data.watch}\n${parsed.data.reco}`,
    context.allowedNames,
  );
  if (invented.length > 0) {
    return {
      ok: false,
      reason: `technologies citées hors fiche : ${invented.join(", ")}`,
      raw,
    };
  }

  return { ok: true, watch: parsed.data.watch, reco: parsed.data.reco, raw };
}

/** Jours restants avant une échéance — utilisé par les gabarits et les tests. */
export { daysBetween };
