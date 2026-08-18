import { gte, inArray, sql } from "drizzle-orm";
import { db } from "@sentinelle/db/client";
import { intelItems, scans } from "@sentinelle/db/schema";
import {
  collectDossier,
  isQuietIssue,
  writeLettre,
  type LettreContext,
} from "@sentinelle/lettre";
import {
  buildRadar,
  type HealthLine,
  type NewsletterBlocks,
  type RadarCandidate,
} from "@sentinelle/newsletter/blocks";
import type { ScanApercu, ScanResult } from "@sentinelle/types";

// ─────────────────────────────────────────────────────────────────────────────
// La lettre-échantillon d'un scan public — le vrai pipeline, pas un résumé.
//
// Décision du 2026-08-18 (seconde itération) : le scan utilise **le prompt de
// la veille personnalisée** — les deux passes de la lettre abonnée (collecte
// avec outils web, rédaction douze axes, garde-fous de sourçage) — appliqué à
// la **dernière semaine** et à la fiche technique issue de l'analyse de stack.
// C'est ce qui rend la démo probante : le prospect lit un numéro, pas un
// prospectus. Le plafond d'un scan par heure et par adresse rend ce coût
// possible.
//
// Ce qui distingue ce numéro d'un numéro abonné :
//   · la fiche vient d'une analyse externe (versions parfois déduites), pas
//     d'un onboarding — le contexte le dit au modèle ;
//   · la période est la semaine écoulée, pas la quinzaine ;
//   · pas de numéro précédent, pas d'alertes envoyées (premier regard) ;
//   · il part sans relecture humaine — écart à la règle 4 assumé et affiché.
// ─────────────────────────────────────────────────────────────────────────────

/** Fenêtre de l'échantillon : la semaine écoulée. */
export const ECHANTILLON_JOURS = 7;

/**
 * Budgets de collecte de l'échantillon, réduits par rapport à la lettre
 * abonnée (30 recherches, 8 lectures) : une semaine d'actualité sur une fiche
 * externe n'a pas besoin du budget d'une quinzaine sur une fiche complète, et
 * chaque scan public paie ce budget. Avec l'effort `medium`, c'est ce qui
 * ramène la collecte de ~20 minutes à quelques-unes.
 */
export const ECHANTILLON_RECHERCHES = 10;
export const ECHANTILLON_LECTURES = 4;

/**
 * Plafond GLOBAL de lettres-échantillons par 24 h — la borne de dépense.
 * La limite d'un scan/heure est par adresse : cent adresses la contournent.
 * Compté sur les scans créés (chaque scan ≤ 1 lettre), surchargé par
 * `SENTINELLE_LETTRES_PAR_JOUR`.
 */
export const LETTRES_PAR_JOUR = 20;

function plafondQuotidien(): number {
  const value = Number.parseInt(process.env.SENTINELLE_LETTRES_PAR_JOUR ?? "", 10);
  return Number.isFinite(value) && value > 0 ? value : LETTRES_PAR_JOUR;
}

function partiesParis(date: Date): { day: string; month: string; year: string } {
  const parts = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).formatToParts(date);

  const read = (type: "day" | "month" | "year") =>
    parts.find((part) => part.type === type)?.value ?? "";
  return { day: read("day"), month: read("month"), year: read("year") };
}

/**
 * « la semaine du 11 au 18 août 2026 » — chaque partie n'est écrite que si elle
 * diffère : « du 27 juillet au 3 août 2026 », « du 28 décembre 2026 au
 * 4 janvier 2027 ».
 */
export function periodeSemaine(now: Date): string {
  const debut = partiesParis(new Date(now.getTime() - ECHANTILLON_JOURS * 86_400_000));
  const fin = partiesParis(now);

  const debutLabel =
    debut.year !== fin.year
      ? `${debut.day} ${debut.month} ${debut.year}`
      : debut.month !== fin.month
        ? `${debut.day} ${debut.month}`
        : debut.day;

  return `la semaine du ${debutLabel} au ${fin.day} ${fin.month} ${fin.year}`;
}

/** La fiche technique du constaté, depuis les composants du scan. */
export function healthFromScan(result: ScanResult): HealthLine[] {
  return result.components.map((component) => ({
    label: component.label,
    version: component.version,
    type: component.type,
    openAlerts: 0,
  }));
}

/**
 * Le constaté d'un scan : fiche issue de l'analyse, aucun historique (premier
 * regard — pas d'alertes envoyées, pas de composants « apparus »), radar des
 * fins de support déjà vérifiées contre les versions détectées.
 */
export function blocksFromScan(
  result: ScanResult,
  radarCandidates: RadarCandidate[],
  now: Date,
): NewsletterBlocks {
  return {
    period: `scan-${result.scannedAt.slice(0, 10)}`,
    issueDate: now.toISOString(),
    health: {
      components: healthFromScan(result),
      withoutVersion: result.components.filter((component) => !component.version).length,
    },
    delta: { since: null, alerts: [], newComponents: [] },
    watch: "",
    reco: "",
    radar: buildRadar(radarCandidates, now),
  };
}

export function contextFromScan(
  result: ScanResult,
  radarCandidates: RadarCandidate[],
  now: Date,
): LettreContext {
  return {
    periodLabel: periodeSemaine(now),
    siteUrl: result.url,
    sector: null,
    notes:
      `Fiche établie par une analyse externe publique du ${result.scannedAt.slice(0, 10)} ` +
      "(scan Sentinelle) : composants visibles depuis l'extérieur uniquement, versions " +
      "parfois déduites, rien n'a été confirmé avec le propriétaire du site. " +
      `Plateforme reconnue : ${result.platform ?? "aucune"}.`,
    blocks: blocksFromScan(result, radarCandidates, now),
    previousIssue: null,
  };
}

/** Les fins de support candidates pour les composants détectés. */
async function radarCandidatesFor(result: ScanResult): Promise<RadarCandidate[]> {
  const slugs = [...new Set(result.components.map((component) => component.slug))];
  if (slugs.length === 0) return [];

  const rows = await db()
    .select({
      targetSlug: intelItems.targetSlug,
      kind: intelItems.kind,
      title: intelItems.title,
      affectedRange: intelItems.affectedRange,
      fixedIn: intelItems.fixedIn,
      publishedAt: intelItems.publishedAt,
    })
    .from(intelItems)
    .where(inArray(intelItems.targetSlug, slugs));

  const bySlug = new Map(result.components.map((component) => [component.slug, component]));

  return rows.flatMap((row) => {
    const component = bySlug.get(row.targetSlug ?? "");
    if (!component) return [];
    return [
      {
        label: component.label,
        version: component.version,
        intelKind: row.kind,
        intelTitle: row.title,
        affectedRange: row.affectedRange,
        fixedIn: row.fixedIn,
        endsOn: row.publishedAt,
      },
    ];
  });
}

/**
 * Fabrique le numéro-échantillon d'un scan : contexte → collecte → rédaction.
 *
 * Ne lève jamais : chaque échec rend un aperçu `none` motivé, le rapport de
 * scan reste intact (même contrat que l'ancien `buildApercu`). La durée se
 * compte en minutes — l'appelant Inngest lui réserve son propre step, et le
 * front prévient que la lettre arrive par e-mail.
 */
export async function buildLettreEchantillon(
  result: ScanResult,
  now: Date = new Date(),
): Promise<ScanApercu> {
  if (result.components.length === 0) {
    return { status: "none", reason: "aucun composant détecté" };
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return { status: "none", reason: "ANTHROPIC_API_KEY absente" };
  }

  // Le plafond global avant tout appel payant. Le rapport de scan, lui, est
  // déjà servi — seule la lettre est refusée.
  try {
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const [row] = await db()
      .select({ count: sql<number>`count(*)::int` })
      .from(scans)
      .where(gte(scans.createdAt, dayAgo));

    if ((row?.count ?? 0) > plafondQuotidien()) {
      console.warn(
        `[sentinelle] échantillon : plafond quotidien atteint (${row?.count} scans / 24 h)`,
      );
      return { status: "none", reason: "plafond quotidien de lettres atteint" };
    }
  } catch (error) {
    console.error("[sentinelle] échantillon : plafond invérifiable", error);
    return { status: "none", reason: "plafond invérifiable" };
  }

  let context: LettreContext;
  try {
    context = contextFromScan(result, await radarCandidatesFor(result), now);
  } catch (error) {
    console.error("[sentinelle] échantillon : constaté impossible", error);
    return { status: "none", reason: "constaté impossible" };
  }

  const debut = Date.now();

  try {
    // Effort `medium` et budgets réduits : la collecte est le poste de coût et
    // de durée dominant, et l'échantillon couvre une semaine, pas une
    // quinzaine. La rédaction, elle, reste à l'effort par défaut (`high`) —
    // c'est le texte que lit le prospect, et il pèse peu dans le total.
    const collecte = await collectDossier(context, {
      effort: "medium",
      searchBudget: ECHANTILLON_RECHERCHES,
      fetchBudget: ECHANTILLON_LECTURES,
    });
    if (!collecte.ok) {
      console.warn(`[sentinelle] échantillon : collecte — ${collecte.reason}`);
      return { status: "none", reason: `collecte : ${collecte.reason}` };
    }

    const redaction = await writeLettre(context, collecte.dossier, {
      ficheNames: result.components.map((component) => component.label),
      quiet: isQuietIssue(context.blocks),
    });

    if (!redaction.ok) {
      console.warn(`[sentinelle] échantillon : rédaction — ${redaction.reason}`);
      return { status: "none", reason: `rédaction : ${redaction.reason}` };
    }

    const consommation = {
      recherches: collecte.telemetry.searches,
      lectures: collecte.telemetry.fetches,
      reprises: collecte.telemetry.continuations,
      jetonsEntree: collecte.telemetry.inputTokens + redaction.telemetry.inputTokens,
      jetonsSortie: collecte.telemetry.outputTokens + redaction.telemetry.outputTokens,
      jetonsCacheLecture: collecte.telemetry.cachedTokens + redaction.telemetry.cachedTokens,
      dureeMs: Date.now() - debut,
    };

    console.info(
      "[sentinelle] échantillon fabriqué :",
      `${consommation.recherches} recherches, ${consommation.lectures} lectures,`,
      `${consommation.jetonsEntree} jetons entrée (+${consommation.jetonsCacheLecture} cache),`,
      `${consommation.jetonsSortie} sortie, ${Math.round(consommation.dureeMs / 1000)} s`,
    );

    return {
      status: "done",
      lettre: redaction.lettre,
      periodLabel: context.periodLabel,
      genereLe: now.toISOString(),
      consommation,
    };
  } catch (error) {
    // Le contrat de l'ancien buildApercu tient toujours : une exception ici
    // laisserait le scan en « pending » pour toujours, jamais.
    console.error("[sentinelle] échantillon : échec inattendu", error);
    return { status: "none", reason: "fabrication impossible" };
  }
}
