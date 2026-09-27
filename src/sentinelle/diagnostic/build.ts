import Anthropic from "@anthropic-ai/sdk";
import { plafondDepasse } from "@sentinelle/apercu";
import { scanSite } from "@sentinelle/scanner";
import { DEFAULT_MODEL } from "@sentinelle/redaction/draft";
import { loadPrompt } from "@sentinelle/redaction/prompts";
import type { DiagnosticConcurrent, ScanDiagnostic, ScanResult } from "@sentinelle/types";
import { retenirConcurrents, retenirSecteur, sansDoublons, versConcurrent } from "./concurrents";
import { renderCollecteBrief, renderRedactionBrief } from "./context";
import { bornerGrille, retenirFaits, urlsObtenues } from "./guards";
import {
  FAITS_JSON_SCHEMA,
  FaitsSchema,
  GRILLE_JSON_SCHEMA,
  GrilleSchema,
  type Fait,
  type Faits,
} from "./schema";

// ─────────────────────────────────────────────────────────────────────────────
// Le diagnostic en quatre cases d'un scan public.
//
// Deux passes, comme la lettre (règle 3, docs/sentinelle/CLAUDE.md) :
//
//  1. **Collecte** — recherche web, budget serré. Elle n'écrit pas la grille ;
//     elle établit le SECTEUR, nomme les CONCURRENTS directs et leur site, et
//     rapporte quelques faits, chacun avec l'URL d'un résultat obtenu.
//  1 bis. **Mesure des concurrents** — leur site est lu par le même scanner
//     passif que le site analysé. La comparaison est faite par du code.
//  2. **Rédaction** — aucun outil. Elle reçoit les signaux de la page
//     d'accueil, la stack détectée et les seuls faits qui ont passé
//     `retenirFaits()`, et rend la grille. `bornerGrille()` la tient à cinq
//     lignes par case.
//
// Une collecte qui échoue n'arrête pas le diagnostic : la rédaction écrit alors
// avec les seuls signaux du site, et la case écosystème le dira. Ne lève jamais :
// un échec rend `status: "none"`, le rapport de scan reste intact.
// ─────────────────────────────────────────────────────────────────────────────

export const DIAGNOSTIC_COLLECTE_PROMPT = "diagnostic-collecte-system-prompt.md";
export const DIAGNOSTIC_REDACTION_PROMPT = "diagnostic-redaction-system-prompt.md";

/**
 * Huit recherches : le nom, le secteur, puis surtout la concurrence (requêtes
 * d'activité, comparatifs, classements) — c'est elle qui structure la grille.
 */
export const DIAGNOSTIC_RECHERCHES = 8;

const MAX_CONTINUATIONS = 4;
const MAX_TOKENS_COLLECTE = 16_000;
const MAX_TOKENS_REDACTION = 8_000;

let client: Anthropic | undefined;

function anthropic(): Anthropic {
  if (!client) client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return client;
}

function model(): string {
  return process.env.ANTHROPIC_MODEL ?? DEFAULT_MODEL;
}

function textOf(message: Anthropic.Message): string {
  return message.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("");
}

interface Compteur {
  recherches: number;
  jetonsEntree: number;
  jetonsSortie: number;
}

function compter(compteur: Compteur, message: Anthropic.Message): void {
  compteur.recherches += message.usage.server_tool_use?.web_search_requests ?? 0;
  compteur.jetonsEntree += message.usage.input_tokens;
  compteur.jetonsSortie += message.usage.output_tokens;
}

/** Passe 1. Rend les faits bruts et toutes les réponses, pour la garde. */
async function collecter(
  brief: string,
  compteur: Compteur,
): Promise<{ collecte: Faits; reponses: Anthropic.Message[] } | { erreur: string }> {
  const messages: Anthropic.MessageParam[] = [{ role: "user", content: brief }];
  const reponses: Anthropic.Message[] = [];
  let message: Anthropic.Message | undefined;

  for (let reprise = 0; reprise <= MAX_CONTINUATIONS; reprise++) {
    const stream = anthropic().messages.stream({
      model: model(),
      max_tokens: MAX_TOKENS_COLLECTE,
      system: loadPrompt(DIAGNOSTIC_COLLECTE_PROMPT),
      cache_control: { type: "ephemeral" },
      output_config: {
        effort: "medium",
        format: { type: "json_schema", schema: FAITS_JSON_SCHEMA },
      },
      // Le budget est une limite serveur, pas une consigne de prompt.
      tools: [{ type: "web_search_20260209", name: "web_search", max_uses: DIAGNOSTIC_RECHERCHES }],
      messages,
    });

    message = await stream.finalMessage();
    reponses.push(message);
    compter(compteur, message);

    if (message.stop_reason !== "pause_turn") break;
    // Pause, pas erreur : la conversation reprend telle quelle (lettre/collecte.ts).
    messages.push({ role: "assistant", content: message.content });
  }

  if (!message || message.stop_reason === "pause_turn") return { erreur: "collecte inachevée" };
  if (message.stop_reason === "refusal") return { erreur: "collecte refusée" };
  if (message.stop_reason === "max_tokens") return { erreur: "collecte tronquée" };

  let payload: unknown;
  try {
    payload = JSON.parse(textOf(message));
  } catch {
    return { erreur: "faits illisibles" };
  }

  const parsed = FaitsSchema.safeParse(payload);
  if (!parsed.success) return { erreur: "faits hors schéma" };
  return { collecte: parsed.data, reponses };
}

/**
 * Lit le site de chaque concurrent retenu, en parallèle, avec le scanner du
 * produit. Un site qui ne répond pas est écarté, sans faire échouer le reste.
 */
async function mesurerConcurrents(
  retenus: ReturnType<typeof retenirConcurrents>,
): Promise<DiagnosticConcurrent[]> {
  const mesures = await Promise.all(
    retenus.map(async (concurrent) => {
      const outcome = await scanSite(concurrent.url);
      return outcome.ok ? versConcurrent(concurrent, outcome.result) : null;
    }),
  );
  return sansDoublons(mesures.filter((m): m is DiagnosticConcurrent => m !== null));
}

export async function buildDiagnostic(
  result: ScanResult,
  now: Date = new Date(),
): Promise<ScanDiagnostic> {
  const site = result.site;
  if (!site) return { status: "none", reason: "signaux de la page absents" };
  if (!process.env.ANTHROPIC_API_KEY) return { status: "none", reason: "ANTHROPIC_API_KEY absente" };

  const refus = await plafondDepasse(now);
  if (refus) {
    console.warn(`[sentinelle] diagnostic : ${refus}`);
    return { status: "none", reason: refus };
  }

  const debut = Date.now();
  const compteur: Compteur = { recherches: 0, jetonsEntree: 0, jetonsSortie: 0 };

  try {
    let faits: Fait[] = [];
    let secteur: string | null = null;
    let concurrents: DiagnosticConcurrent[] = [];
    try {
      const sortie = await collecter(renderCollecteBrief(result, site), compteur);
      if ("erreur" in sortie) {
        console.warn(`[sentinelle] diagnostic : ${sortie.erreur}, rédaction sans faits externes`);
      } else {
        const obtenues = urlsObtenues(sortie.reponses);
        faits = retenirFaits(sortie.collecte.faits, obtenues, result.url);
        secteur = retenirSecteur(sortie.collecte.secteur, obtenues, result.url);
        concurrents = await mesurerConcurrents(
          retenirConcurrents(sortie.collecte.concurrents, obtenues, result.url),
        );
        const ecartes = sortie.collecte.faits.length - faits.length;
        if (ecartes > 0) console.info(`[sentinelle] diagnostic : ${ecartes} fait(s) sans source vérifiable écarté(s)`);
      }
    } catch (error) {
      const reason =
        error instanceof Anthropic.APIError ? `API Anthropic : ${error.status ?? "?"}` : "collecte impossible";
      console.warn(`[sentinelle] diagnostic : ${reason}, rédaction sans faits externes`);
    }

    // Passe 2 — sans outils : la grille ne peut s'appuyer que sur ce brief.
    const message = await anthropic().messages.create({
      model: model(),
      max_tokens: MAX_TOKENS_REDACTION,
      system: loadPrompt(DIAGNOSTIC_REDACTION_PROMPT),
      output_config: {
        effort: "medium",
        format: { type: "json_schema", schema: GRILLE_JSON_SCHEMA },
      },
      messages: [{ role: "user", content: renderRedactionBrief(result, site, faits, secteur, concurrents) }],
    });
    compter(compteur, message);

    if (message.stop_reason === "refusal" || message.stop_reason === "max_tokens") {
      return { status: "none", reason: `rédaction : ${message.stop_reason}` };
    }

    let payload: unknown;
    try {
      payload = JSON.parse(textOf(message));
    } catch {
      return { status: "none", reason: "grille illisible" };
    }

    const parsed = GrilleSchema.safeParse(payload);
    if (!parsed.success) return { status: "none", reason: "grille hors schéma" };

    const grille = bornerGrille(parsed.data);
    if (!grille) return { status: "none", reason: "grille incomplète" };

    const consommation = { ...compteur, dureeMs: Date.now() - debut };
    console.info(
      "[sentinelle] diagnostic fabriqué :",
      `${consommation.recherches} recherches, ${faits.length} faits, ${concurrents.length} concurrents mesurés,`,
      `${consommation.jetonsEntree} jetons entrée, ${consommation.jetonsSortie} sortie,`,
      `${Math.round(consommation.dureeMs / 1000)} s`,
    );

    return {
      status: "done",
      secteur,
      concurrents,
      ...grille,
      sources: [...new Set(faits.map((fait) => fait.source))],
      genereLe: now.toISOString(),
      consommation,
    };
  } catch (error) {
    const reason =
      error instanceof Anthropic.APIError ? `API Anthropic : ${error.status ?? "?"}` : "fabrication impossible";
    console.error(`[sentinelle] diagnostic : ${reason}`, error);
    return { status: "none", reason };
  }
}
