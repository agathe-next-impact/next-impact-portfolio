import { and, asc, eq, isNull, sql } from "drizzle-orm";
import { db } from "@sentinelle/db/client";
import { alerts, clients, intelItems, stackItems } from "@sentinelle/db/schema";
import { decide, type MatchableIntel, type MatchableStackItem } from "@sentinelle/matching";
import { buildContext } from "./context";
import { draftAlert } from "./draft";

// ─────────────────────────────────────────────────────────────────────────────
// Passe de rédaction : les alertes en brouillon qui n'ont pas encore de texte.
//
// Rien de ce qui sort d'ici ne part chez un client. Le texte est écrit dans
// `generated_text` — la sortie brute, pour l'audit — et `final_text` reste vide
// jusqu'à ce qu'un humain valide (règle 4). Le verdict, lui, peut être abaissé
// par les garde-fous : c'est la seule chose que la rédaction a le droit de
// modifier dans la décision du matching.
//
// Les rouges d'abord : si le quota d'une passe est atteint, ce sont les alertes
// les plus urgentes qui doivent avoir leur texte prêt pour la relecture.
// ─────────────────────────────────────────────────────────────────────────────

export const MAX_DRAFTS_PER_RUN = 20;

export interface RedactionReport {
  /** Alertes effectivement traitées par cette passe. */
  candidates: number;
  /** Reste-t-il des alertes sans texte après la passe ? */
  more: boolean;
  drafted: number;
  failed: number;
  /** Verdicts abaissés par les garde-fous. */
  corrected: number;
  /** Raisons d'échec, comptées — un silence doit s'expliquer. */
  failures: Record<string, number>;
}

export async function runRedaction(
  limit: number = MAX_DRAFTS_PER_RUN,
  now: Date = new Date(),
): Promise<RedactionReport> {
  const rows = await db()
    .select({
      alertId: alerts.id,
      client: { sector: clients.sector, notes: clients.notes },
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
      verdict: alerts.verdict,
    })
    .from(alerts)
    .innerJoin(clients, and(eq(alerts.clientId, clients.id), eq(clients.active, true)))
    .innerJoin(stackItems, eq(alerts.stackItemId, stackItems.id))
    .innerJoin(intelItems, eq(alerts.intelItemId, intelItems.id))
    .where(and(eq(alerts.status, "draft"), isNull(alerts.generatedText)))
    // Rouge, puis orange, puis le reste ; à égalité, les plus anciennes.
    .orderBy(
      sql`case ${alerts.verdict} when 'red' then 0 when 'orange' then 1 else 2 end`,
      asc(alerts.createdAt),
    )
    .limit(limit + 1);

  // Une ligne de plus que la limite a été demandée : sa présence dit qu'il en
  // reste, sans coûter un second comptage.
  const batch = rows.slice(0, limit);
  const report: RedactionReport = {
    candidates: batch.length,
    more: rows.length > limit,
    drafted: 0,
    failed: 0,
    corrected: 0,
    failures: {},
  };

  if (report.more) {
    console.info(
      `[sentinelle] rédaction : plafond de ${limit} atteint, les alertes suivantes passeront demain`,
    );
  }

  for (const row of batch) {
    // La raison du verdict n'est pas stockée : on la recalcule. La fonction est
    // pure et la décision est la même — autant ne pas dupliquer l'information
    // en base pour la voir diverger ensuite.
    const decision = decide(
      row.stack as MatchableStackItem,
      row.intel as MatchableIntel,
      now,
    );

    const context = buildContext({
      client: row.client,
      stackItem: row.stack,
      intelItem: row.intel,
      verdict: row.verdict ?? (decision.matched ? decision.verdict : "info"),
      reason: decision.reason,
    });

    const outcome = await draftAlert(context);

    if (!outcome.ok) {
      report.failed++;
      report.failures[outcome.reason] = (report.failures[outcome.reason] ?? 0) + 1;
      console.warn(`[sentinelle] rédaction refusée (${row.alertId}) — ${outcome.reason}`);
      continue;
    }

    for (const correction of outcome.corrections) {
      report.corrected++;
      console.warn(`[sentinelle] rédaction corrigée (${row.alertId}) — ${correction}`);
    }

    await db()
      .update(alerts)
      .set({
        verdict: outcome.draft.verdict,
        generatedText: outcome.raw,
        recommendedAction: outcome.draft.recommendedAction,
      })
      .where(eq(alerts.id, row.alertId));

    report.drafted++;
  }

  console.info(
    `[sentinelle] rédaction : ${report.drafted} textes écrits, ${report.failed} échecs, ` +
      `${report.corrected} verdicts abaissés`,
  );

  return report;
}
