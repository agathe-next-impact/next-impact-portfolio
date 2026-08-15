import { and, eq, isNotNull, sql } from "drizzle-orm";
import { db } from "@sentinelle/db/client";
import { alerts, clients, intelItems, stackItems } from "@sentinelle/db/schema";
import type { NewAlert } from "@sentinelle/types";
import { decide, type MatchableIntel, type MatchableStackItem } from "./match";

// ─────────────────────────────────────────────────────────────────────────────
// Passe de matching — le pilote. Il ne décide rien : il charge les paires
// candidates, applique `decide()` et écrit les brouillons.
//
// L'unicité `(client_id, intel_item_id)` fait le travail d'idempotence : deux
// passes le même jour, ou un cron rejoué, ne peuvent pas produire deux alertes
// sur le même fait. La garantie est dans le moteur de base, pas dans du code
// applicatif qui pourrait l'oublier.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Plafond d'alertes créées par passe.
 *
 * Il ne s'agit pas d'économiser des écritures mais de rendre visible une
 * anomalie : le jour où une passe voudrait créer six cents alertes, c'est
 * qu'un collecteur ou une plage déraille, et il vaut mieux le voir dans un
 * journal que dans la boîte mail d'un client. Le dépassement est journalisé,
 * jamais silencieux.
 */
export const MAX_ALERTS_PER_RUN = 500;

export interface MatchReport {
  /** Paires (composant, fait) examinées. */
  pairs: number;
  /** Alertes créées — les doublons ne comptent pas. */
  created: number;
  /** Paires écartées, comptées par raison. Un silence doit s'expliquer. */
  skipped: Record<string, number>;
  /** Verdicts proposés, pour surveiller la proportion de rouges. */
  verdicts: Record<string, number>;
  truncated: boolean;
}

export async function runMatching(now: Date = new Date()): Promise<MatchReport> {
  const rows = await db()
    .select({
      stack: {
        id: stackItems.id,
        clientId: stackItems.clientId,
        slug: stackItems.slug,
        type: stackItems.type,
        ecosystem: stackItems.ecosystem,
        version: stackItems.version,
        label: stackItems.label,
        source: stackItems.source,
        meta: stackItems.meta,
      },
      intel: {
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
      },
    })
    .from(stackItems)
    .innerJoin(clients, and(eq(clients.id, stackItems.clientId), eq(clients.active, true)))
    .innerJoin(
      intelItems,
      and(
        eq(intelItems.targetSlug, stackItems.slug),
        eq(intelItems.targetType, stackItems.type),
        // `is not distinct from` et non `=` : un écosystème nul des deux côtés
        // est une égalité, ce que `=` ne dit pas en SQL.
        sql`${intelItems.targetEcosystem} is not distinct from ${stackItems.ecosystem}`,
      ),
    )
    .where(and(eq(stackItems.watchEnabled, true), isNotNull(stackItems.version)));

  const report: MatchReport = {
    pairs: rows.length,
    created: 0,
    skipped: {},
    verdicts: {},
    truncated: false,
  };

  const drafts: NewAlert[] = [];

  for (const row of rows) {
    const decision = decide(
      row.stack as MatchableStackItem,
      row.intel as MatchableIntel,
      now,
    );

    if (!decision.matched) {
      report.skipped[decision.reason] = (report.skipped[decision.reason] ?? 0) + 1;
      continue;
    }

    report.verdicts[decision.verdict] = (report.verdicts[decision.verdict] ?? 0) + 1;

    if (drafts.length >= MAX_ALERTS_PER_RUN) {
      report.truncated = true;
      continue;
    }

    drafts.push({
      clientId: row.stack.clientId,
      stackItemId: row.stack.id,
      intelItemId: row.intel.id,
      status: "draft",
      verdict: decision.verdict,
    });
  }

  if (drafts.length > 0) {
    const created = await db()
      .insert(alerts)
      .values(drafts)
      // Un client n'est alerté qu'une fois par fait : le rejeu ne produit rien.
      .onConflictDoNothing({ target: [alerts.clientId, alerts.intelItemId] })
      .returning({ id: alerts.id });

    report.created = created.length;
  }

  if (report.truncated) {
    console.warn(
      `[sentinelle] matching : plafond de ${MAX_ALERTS_PER_RUN} alertes atteint — ` +
        "des correspondances n'ont pas été écrites, vérifier les collecteurs",
    );
  }

  console.info(
    `[sentinelle] matching : ${report.pairs} paires examinées, ${report.created} alertes créées ` +
      `(${Object.entries(report.verdicts)
        .map(([verdict, count]) => `${verdict}=${count}`)
        .join(" ") || "aucune"})`,
  );

  return report;
}
