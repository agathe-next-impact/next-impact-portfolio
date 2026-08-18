import Anthropic from "@anthropic-ai/sdk";
import { inArray } from "drizzle-orm";
import { db } from "@sentinelle/db/client";
import { intelItems } from "@sentinelle/db/schema";
import type { MatchableIntel } from "@sentinelle/matching";
import { DEFAULT_MODEL, loadPrompt } from "@sentinelle/redaction";
import type { ApercuTheme, ScanApercu, ScanResult } from "@sentinelle/types";
import { croiser, renderDossier, type ApercuConstat } from "./dossier";
import { ApercuSchema, APERCU_JSON_SCHEMA } from "./schema";

// ─────────────────────────────────────────────────────────────────────────────
// Fabrication de l'aperçu de veille d'un scan public.
//
// Une seule passe, sans outils : le modèle reçoit le dossier (composants
// détectés × faits déjà collectés par les crons) et rien d'autre. Pas de passe
// de collecte ici — un scan gratuit n'a pas le budget de la lettre abonnée, et
// l'intel du jour est déjà en base.
//
// Ne lève jamais : un aperçu qui échoue laisse un rapport de scan complet sans
// aperçu (`status: "none"`), jamais un scan en échec.
// ─────────────────────────────────────────────────────────────────────────────

export const APERCU_PROMPT = "apercu-system-prompt.md";

/** Plafond de réflexion + réponse : l'aperçu est court par contrat de schéma. */
const MAX_TOKENS = 8_000;

let client: Anthropic | undefined;

function anthropic(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  if (!client) client = new Anthropic({ apiKey });
  return client;
}

function textOf(message: Anthropic.Message): string {
  return message.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("");
}

/**
 * Garde mécanique, dans l'esprit de redaction/guards.ts : un thème « agir »
 * n'est permis que si le croisement déterministe a retenu au moins un fait
 * sérieux (verdict red ou orange). Le modèle écrit, le code borne — l'aperçu
 * ne peut pas être plus alarmiste que le dossier qui l'alimente.
 */
export function borner(themes: ApercuTheme[], constats: ApercuConstat[]): ApercuTheme[] {
  const justifie = constats.some((c) => c.verdict === "red" || c.verdict === "orange");
  if (justifie) return themes;
  return themes.map((theme) =>
    theme.statut === "agir" ? { ...theme, statut: "surveiller" } : theme,
  );
}

export async function buildApercu(result: ScanResult): Promise<ScanApercu> {
  if (result.components.length === 0) {
    return { status: "none", reason: "aucun composant détecté" };
  }

  const api = anthropic();
  if (!api) {
    return { status: "none", reason: "ANTHROPIC_API_KEY absente" };
  }

  // L'intel candidate : les faits qui visent un slug détecté. Le filtrage fin
  // (type, écosystème, plages de versions) appartient à `decide()`.
  const slugs = [...new Set(result.components.map((c) => c.slug))];
  const rows = await db()
    .select({
      id: intelItems.id,
      kind: intelItems.kind,
      source: intelItems.source,
      targetSlug: intelItems.targetSlug,
      targetType: intelItems.targetType,
      targetEcosystem: intelItems.targetEcosystem,
      affectedRange: intelItems.affectedRange,
      fixedIn: intelItems.fixedIn,
      severity: intelItems.severity,
      title: intelItems.title,
      publishedAt: intelItems.publishedAt,
    })
    .from(intelItems)
    .where(inArray(intelItems.targetSlug, slugs));

  const constats = croiser(result, rows as MatchableIntel[], new Date());
  const dossier = renderDossier(result, constats);

  let message: Anthropic.Message;
  try {
    message = await api.messages.create({
      model: process.env.ANTHROPIC_MODEL ?? DEFAULT_MODEL,
      max_tokens: MAX_TOKENS,
      system: loadPrompt(APERCU_PROMPT),
      output_config: {
        effort: "medium",
        format: { type: "json_schema", schema: APERCU_JSON_SCHEMA },
      },
      messages: [{ role: "user", content: dossier }],
    });
  } catch (error) {
    const reason =
      error instanceof Anthropic.APIError
        ? `API Anthropic : ${error.status ?? "?"}`
        : "appel à l'API impossible";
    console.warn(`[sentinelle] aperçu de veille : ${reason}`);
    return { status: "none", reason };
  }

  if (message.stop_reason === "refusal" || message.stop_reason === "max_tokens") {
    return { status: "none", reason: `réponse ${message.stop_reason}` };
  }

  let payload: unknown;
  try {
    payload = JSON.parse(textOf(message));
  } catch {
    return { status: "none", reason: "réponse illisible" };
  }

  const parsed = ApercuSchema.safeParse(payload);
  if (!parsed.success) {
    return { status: "none", reason: "réponse hors schéma" };
  }

  return {
    status: "done",
    titre: parsed.data.titre,
    chapeau: parsed.data.chapeau,
    siteEnUnePhrase: parsed.data.siteEnUnePhrase,
    ligneCloture: parsed.data.ligneCloture,
    themes: borner(parsed.data.themes as ApercuTheme[], constats),
    cap: parsed.data.cap,
    genereLe: new Date().toISOString(),
  };
}
