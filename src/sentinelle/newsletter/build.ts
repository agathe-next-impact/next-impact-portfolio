import { and, eq, gte, isNotNull, lt, sql } from "drizzle-orm";
import { db } from "@sentinelle/db/client";
import { alerts, clients, digests, intelItems, stackItems } from "@sentinelle/db/schema";
import { initialContent } from "@sentinelle/admin/content";
import type { Verdict } from "@sentinelle/types";
import {
  assembleBlocks,
  buildRadar,
  periodWindow,
  type DeltaEntry,
  type HealthLine,
  type NewsletterBlocks,
  type RadarCandidate,
} from "./blocks";
import { draftNewsletterBlocks } from "./draft";
import { formatNewsletterPeriod, newsletterPeriodAt, type NewsletterPeriod } from "./period";

// ─────────────────────────────────────────────────────────────────────────────
// Fabrication des numéros — le 1er et le 15.
//
// Un numéro par client actif et par période. L'index unique `(client_id,
// period)` porte l'idempotence : le cron peut être rejoué, il ne fabriquera pas
// un second numéro d'août.
//
// **Un numéro déjà écrit n'est jamais réécrit**, même en brouillon. Le rejeu ne
// doit pas effacer une relecture en cours — et si un numéro doit être refait, le
// geste conscient est de le supprimer, pas de laisser un cron l'écraser.
//
// Tout est écrit en `draft` : la règle 4 vaut pour les numéros comme pour les
// alertes.
// ─────────────────────────────────────────────────────────────────────────────

export interface BuildReport {
  period: string;
  /** Clients actifs examinés. */
  clients: number;
  /** Numéros créés — les périodes déjà couvertes ne comptent pas. */
  created: number;
  /** Numéros dont les deux blocs rédigés ont été écrits par le modèle. */
  drafted: number;
  /** Raisons pour lesquelles un numéro est parti sans blocs rédigés. */
  failures: Record<string, number>;
  skipped: number;
}

interface ClientRow {
  id: string;
  sector: string | null;
  notes: string | null;
}

/** Composants suivis, avec le compte d'alertes ouvertes de chacun. */
async function loadComponents(clientId: string): Promise<{
  lines: HealthLine[];
  names: string[];
}> {
  const rows = await db()
    .select({
      id: stackItems.id,
      label: stackItems.label,
      slug: stackItems.slug,
      version: stackItems.version,
      type: stackItems.type,
      openAlerts: sql<number>`(
        select count(*) from ${alerts}
        where ${alerts.stackItemId} = ${stackItems.id}
          and ${alerts.status} in ('draft', 'validated')
      )`,
    })
    .from(stackItems)
    .where(and(eq(stackItems.clientId, clientId), eq(stackItems.watchEnabled, true)))
    .orderBy(stackItems.label);

  return {
    lines: rows.map((row) => ({
      label: row.label,
      version: row.version,
      type: row.type,
      openAlerts: Number(row.openAlerts),
    })),
    // Le vocabulaire autorisé du numéro : ce que le client a, rien d'autre.
    names: rows.flatMap((row) => [row.label, row.slug]),
  };
}

async function loadSentAlerts(
  clientId: string,
  from: Date,
  to: Date,
): Promise<DeltaEntry[]> {
  const rows = await db()
    .select({
      verdict: alerts.verdict,
      finalText: alerts.finalText,
      generatedText: alerts.generatedText,
      sentAt: alerts.sentAt,
      intelTitle: intelItems.title,
    })
    .from(alerts)
    .innerJoin(intelItems, eq(alerts.intelItemId, intelItems.id))
    .where(
      and(
        eq(alerts.clientId, clientId),
        eq(alerts.status, "sent"),
        isNotNull(alerts.sentAt),
        gte(alerts.sentAt, from),
        lt(alerts.sentAt, to),
      ),
    )
    .orderBy(alerts.sentAt);

  return rows.map((row) => ({
    // Le titre relu, celui que le client a lu dans sa boîte — pas celui de la
    // source, qu'il n'a jamais vu.
    title: initialContent(row).title.trim() || row.intelTitle,
    verdict: row.verdict as Verdict | null,
    at: (row.sentAt ?? from).toISOString(),
  }));
}

async function loadNewComponents(clientId: string, from: Date, to: Date) {
  return db()
    .select({ label: stackItems.label, version: stackItems.version })
    .from(stackItems)
    .where(
      and(
        eq(stackItems.clientId, clientId),
        gte(stackItems.createdAt, from),
        lt(stackItems.createdAt, to),
      ),
    )
    .orderBy(stackItems.label);
}

/** Candidats au radar : les fins de support qui visent un composant du client. */
async function loadRadarCandidates(clientId: string): Promise<RadarCandidate[]> {
  const rows = await db()
    .select({
      label: stackItems.label,
      version: stackItems.version,
      intelKind: intelItems.kind,
      intelTitle: intelItems.title,
      affectedRange: intelItems.affectedRange,
      fixedIn: intelItems.fixedIn,
      endsOn: intelItems.publishedAt,
    })
    .from(stackItems)
    .innerJoin(
      intelItems,
      and(
        eq(intelItems.targetSlug, stackItems.slug),
        eq(intelItems.targetType, stackItems.type),
        sql`${intelItems.targetEcosystem} is not distinct from ${stackItems.ecosystem}`,
        eq(intelItems.kind, "eol"),
      ),
    )
    .where(and(eq(stackItems.clientId, clientId), eq(stackItems.watchEnabled, true)));

  return rows;
}

/** Ce client a-t-il déjà reçu un numéro ? */
async function hasPreviousIssue(clientId: string): Promise<boolean> {
  const [row] = await db()
    .select({ id: digests.id })
    .from(digests)
    .where(eq(digests.clientId, clientId))
    .limit(1);

  return Boolean(row);
}

/** Assemble le numéro d'un client, blocs rédigés compris. */
export async function buildIssueFor(
  client: ClientRow,
  period: NewsletterPeriod,
  now: Date,
): Promise<{ blocks: NewsletterBlocks; drafted: boolean; failure?: string }> {
  const window = periodWindow(period);
  const [{ lines, names }, sentAlerts, newComponents, candidates, previous] = await Promise.all([
    loadComponents(client.id),
    loadSentAlerts(client.id, window.from, window.to),
    loadNewComponents(client.id, window.from, window.to),
    loadRadarCandidates(client.id),
    hasPreviousIssue(client.id),
  ]);

  const blocks = assembleBlocks({
    period,
    components: lines,
    sentAlerts,
    newComponents,
    radar: buildRadar(candidates, now),
    isFirstIssue: !previous,
  });

  const outcome = await draftNewsletterBlocks({
    sector: client.sector,
    notes: client.notes,
    blocks,
    allowedNames: names,
  });

  if (!outcome.ok) {
    return { blocks, drafted: false, failure: outcome.reason };
  }

  return { blocks: { ...blocks, watch: outcome.watch, reco: outcome.reco }, drafted: true };
}

/**
 * Fabrique les numéros de la période courante.
 *
 * Palier unique : tous les blocs pour tout le monde. Aucun branchement sur
 * `plan` — ce serait du code mort, et un code mort sur une colonne de facturation
 * est le genre de chose qu'on croit vraie deux ans plus tard.
 */
export async function runNewsletterBuild(now: Date = new Date()): Promise<BuildReport> {
  const period = newsletterPeriodAt(now);
  const key = formatNewsletterPeriod(period);

  const actifs: ClientRow[] = await db()
    .select({ id: clients.id, sector: clients.sector, notes: clients.notes })
    .from(clients)
    .where(eq(clients.active, true));

  const report: BuildReport = {
    period: key,
    clients: actifs.length,
    created: 0,
    drafted: 0,
    failures: {},
    skipped: 0,
  };

  for (const client of actifs) {
    const [existant] = await db()
      .select({ id: digests.id })
      .from(digests)
      .where(and(eq(digests.clientId, client.id), eq(digests.period, key)))
      .limit(1);

    if (existant) {
      report.skipped++;
      continue;
    }

    const issue = await buildIssueFor(client, period, now);

    if (issue.failure) {
      report.failures[issue.failure] = (report.failures[issue.failure] ?? 0) + 1;
      console.warn(`[sentinelle] numéro ${key} sans blocs rédigés (${client.id}) — ${issue.failure}`);
    }

    const inserted = await db()
      .insert(digests)
      .values({ clientId: client.id, period: key, status: "draft", blocks: issue.blocks })
      // Le rejeu ne réécrit rien : l'unicité est dans le moteur, pas dans le code.
      .onConflictDoNothing({ target: [digests.clientId, digests.period] })
      .returning({ id: digests.id });

    if (inserted.length > 0) {
      report.created++;
      if (issue.drafted) report.drafted++;
    } else {
      report.skipped++;
    }
  }

  console.info(
    `[sentinelle] numéros ${key} : ${report.created} créés (${report.drafted} rédigés), ` +
      `${report.skipped} déjà en place`,
  );

  return report;
}
