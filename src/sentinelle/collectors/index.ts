import { and, eq } from "drizzle-orm";
import { db } from "@sentinelle/db/client";
import { clients, stackItems } from "@sentinelle/db/schema";
import { collectEndoflife } from "./endoflife";
import type { CallBudget } from "./http";
import { collectOsv } from "./osv";
import { collectReleases } from "./releases";
import { knownExternalIds, saveIntel } from "./store";
import { collectWpscan } from "./wpscan";
import { estimateCalls, planCollection, type CollectionPlan, type WatchedComponent } from "./targets";

// ─────────────────────────────────────────────────────────────────────────────
// API publique des collecteurs, et routage par écosystème.
//
// Le principe tient en une phrase : **le couple (type, ecosystem) d'un
// stack_item dit où chercher**. Le plan est calculé une fois par passe, il est
// dédupliqué entre clients, et chaque source n'est appelée que si quelque chose
// la concerne. Un écosystème sans collecteur ne produit rien et le journalise —
// jamais une erreur : le jour où un abonné arrive sous une technologie qu'aucune
// base publique ne couvre, sa veille est partielle, pas cassée.
// ─────────────────────────────────────────────────────────────────────────────

export { collectEndoflife, intelFromProduct, nextBranch } from "./endoflife";
export { createCallBudget, CALL_BUDGET, type CallBudget } from "./http";
export { collectOsv, intelFromVulnerability, segmentsFor, MAX_VULNS_PER_PACKAGE } from "./osv";
export { collectReleases, intelFromInfo } from "./releases";
export { collectWpscan, intelFromWpscan } from "./wpscan";
export { knownExternalIds, saveIntel, type SaveReport } from "./store";
export {
  canonicalOf,
  estimateCalls,
  planCollection,
  type CollectionPlan,
  type OsvTarget,
  type WatchedComponent,
  type WordPressTarget,
} from "./targets";
export {
  ENDOFLIFE_BASELINE,
  SOURCES,
  slugForEndoflifeProduct,
  sourcesFor,
  type SourceMap,
} from "./catalog";

/**
 * Composants effectivement surveillés : ceux des clients actifs, avec la veille
 * activée. Un abonnement résilié cesse d'engendrer des appels sortants le jour
 * même — c'est une économie, et c'est cohérent avec la politique d'effacement.
 */
export async function loadWatchedComponents(): Promise<WatchedComponent[]> {
  const rows = await db()
    .select({
      slug: stackItems.slug,
      type: stackItems.type,
      ecosystem: stackItems.ecosystem,
      version: stackItems.version,
    })
    .from(stackItems)
    .innerJoin(clients, eq(stackItems.clientId, clients.id))
    .where(and(eq(stackItems.watchEnabled, true), eq(clients.active, true)));

  return rows;
}

export interface CollectorRun {
  source: string;
  inserted: number;
  updated: number;
  failures: Array<{ product: string; reason: string }>;
  /** Ce que la passe a volontairement laissé de côté — jamais silencieux. */
  notes?: string[];
}

/** Interroge endoflife.date pour tout le plan, et écrit ce qui en sort. */
export async function runEndoflife(
  plan: CollectionPlan,
  budget: CallBudget,
  now: Date = new Date(),
): Promise<CollectorRun> {
  const collected = await collectEndoflife(plan.endoflife, budget, now);
  const saved = await saveIntel(collected.items);

  return {
    source: "endoflife.date",
    inserted: saved.inserted,
    updated: saved.updated,
    failures: collected.failures,
  };
}

/** Vulnérabilités des paquets npm, Packagist et PyPI. */
export async function runOsv(
  plan: CollectionPlan,
  budget: CallBudget,
): Promise<CollectorRun> {
  const collected = await collectOsv(plan.osv, budget, (ids) =>
    knownExternalIds("osv.dev", ids),
  );
  const saved = await saveIntel(collected.items);

  return {
    source: "osv.dev",
    inserted: saved.inserted,
    updated: saved.updated,
    failures: collected.failures,
    notes: collected.deferred.map(
      ({ product, count }) =>
        `${product} : ${count} failles reportées à une prochaine passe (plafond par paquet)`,
    ),
  };
}

/** Vulnérabilités WordPress — sans clé WPScan, ne produit rien et le dit. */
export async function runWpscan(
  plan: CollectionPlan,
  budget: CallBudget,
): Promise<CollectorRun> {
  const collected = await collectWpscan(plan.wordpress, budget);
  const saved = await saveIntel(collected.items);

  return {
    source: "wpscan",
    inserted: saved.inserted,
    updated: saved.updated,
    failures: collected.failures,
    notes: collected.unavailable ? [collected.unavailable] : [],
  };
}

/** Dernières versions des extensions et thèmes WordPress. */
export async function runReleases(
  plan: CollectionPlan,
  budget: CallBudget,
): Promise<CollectorRun> {
  const collected = await collectReleases(plan.wordpress, budget);
  const saved = await saveIntel(collected.items);

  return {
    source: "api.wordpress.org",
    inserted: saved.inserted,
    updated: saved.updated,
    failures: collected.failures,
  };
}

/**
 * Plan de collecte du jour, journalisé.
 *
 * Le journal est ici et pas ailleurs : c'est le seul endroit où l'on sait à la
 * fois ce qu'on va interroger et ce qu'on a décidé d'ignorer.
 */
export async function buildPlan(): Promise<CollectionPlan> {
  const components = await loadWatchedComponents();
  const plan = planCollection(components);

  console.info(
    `[sentinelle] collecte : ${plan.endoflife.length} produits endoflife, ` +
      `${plan.osv.length} paquets OSV, ${plan.wordpress.length} composants WordPress ` +
      `(~${estimateCalls(plan)} appels)`,
  );

  for (const skip of plan.skipped) {
    console.info(`[sentinelle] collecte : ${skip.slug} ignoré — ${skip.reason}`);
  }

  return plan;
}
