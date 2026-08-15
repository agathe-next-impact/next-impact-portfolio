import { and, eq, gte, isNotNull, lt, sql } from "drizzle-orm";
import { db } from "@sentinelle/db/client";
import { alerts, digests, intelItems, stackItems } from "@sentinelle/db/schema";
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
import { type NewsletterPeriod } from "./period";

// ─────────────────────────────────────────────────────────────────────────────
// Le constaté d'un numéro : ce que Sentinelle sait déjà du site.
//
// La fabrication elle-même a déménagé dans `@sentinelle/lettre` le jour où le
// numéro est devenu une lettre de veille. Ce qui reste ici est ce que ce module
// est seul à savoir produire : la fiche suivie, les alertes réellement envoyées
// sur la période, et le radar des fins de support déjà confrontées à la version
// du client.
//
// C'est la matière que la lettre reçoit comme acquise. Elle ne la recollecte
// pas, et elle n'a pas le droit de la contredire.
// ─────────────────────────────────────────────────────────────────────────────

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

/**
 * Le constaté d'un client pour une période : sa fiche, ce qui lui a été envoyé,
 * son radar.
 *
 * Extrait de `buildIssueFor` parce que la lettre de veille s'en sert aussi — et
 * s'en sert comme socle : ce sont les seuls faits du numéro qui ne viennent ni
 * d'une recherche ni d'un modèle. Les recalculer ailleurs les ferait diverger.
 */
export async function loadConstate(
  clientId: string,
  period: NewsletterPeriod,
  now: Date,
): Promise<{ blocks: NewsletterBlocks; names: string[] }> {
  const window = periodWindow(period);
  const [{ lines, names }, sentAlerts, newComponents, candidates, previous] = await Promise.all([
    loadComponents(clientId),
    loadSentAlerts(clientId, window.from, window.to),
    loadNewComponents(clientId, window.from, window.to),
    loadRadarCandidates(clientId),
    hasPreviousIssue(clientId),
  ]);

  const blocks = assembleBlocks({
    period,
    components: lines,
    sentAlerts,
    newComponents,
    radar: buildRadar(candidates, now),
    isFirstIssue: !previous,
  });

  return { blocks, names };
}
