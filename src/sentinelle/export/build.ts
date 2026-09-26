import { and, desc, eq, gte, inArray } from "drizzle-orm";
import { db } from "@sentinelle/db/client";
import { alerts, clients, digests, intelItems, stackItems } from "@sentinelle/db/schema";
import { initialContent } from "@sentinelle/admin/content";
import { parseIssue } from "@sentinelle/lettre/issue";
import { loadConstate } from "@sentinelle/newsletter/build";
import { newsletterPeriodAt } from "@sentinelle/newsletter/period";
import {
  EXPORT_AXES,
  EXPORT_VERSION,
  SentinelleExportSchema,
  VERDICTS,
  type ExportAlert,
  type ExportLetter,
  type SentinelleExport,
} from "./contract";
import { renderLettre } from "./render";

// ─────────────────────────────────────────────────────────────────────────────
// Construction de l'export d'un client.
//
// Six mois de profondeur, comme la fenêtre d'archives de l'espace client : un
// consommateur n'a pas besoin de plus, et un export qui grossirait sans fin
// finirait par dépasser le temps de réponse d'une fonction.
// ─────────────────────────────────────────────────────────────────────────────

export const EXPORT_MONTHS = 6;

function monthsAgo(now: Date, months: number): Date {
  const since = new Date(now);
  since.setMonth(since.getMonth() - months);
  return since;
}

function verdictOf(value: string | null): ExportAlert["verdict"] {
  return (VERDICTS as readonly string[]).includes(value ?? "")
    ? (value as ExportAlert["verdict"])
    : null;
}

async function loadAlerts(clientId: string, since: Date): Promise<ExportAlert[]> {
  const rows = await db()
    .select({
      id: alerts.id,
      status: alerts.status,
      verdict: alerts.verdict,
      finalText: alerts.finalText,
      generatedText: alerts.generatedText,
      recommendedAction: alerts.recommendedAction,
      sentAt: alerts.sentAt,
      createdAt: alerts.createdAt,
      component: stackItems.label,
      source: intelItems.source,
      externalId: intelItems.externalId,
      intelTitle: intelItems.title,
    })
    .from(alerts)
    .innerJoin(intelItems, eq(alerts.intelItemId, intelItems.id))
    .innerJoin(stackItems, eq(alerts.stackItemId, stackItems.id))
    .where(
      and(
        eq(alerts.clientId, clientId),
        // Règle 4 : seul ce qu'un humain a validé quitte Sentinelle.
        inArray(alerts.status, ["validated", "sent"]),
        gte(alerts.createdAt, since),
      ),
    )
    .orderBy(desc(alerts.createdAt));

  return rows.map((row) => {
    const content = initialContent(row);
    return {
      id: row.id,
      ref: `${row.source}:${row.externalId}`,
      title: content.title.trim() || row.intelTitle,
      verdict: verdictOf(row.verdict),
      status: row.status as ExportAlert["status"],
      component: row.component,
      recommendedAction: (row.recommendedAction ?? content.recommendedAction ?? "").trim(),
      at: (row.sentAt ?? row.createdAt).toISOString(),
    };
  });
}

async function loadLetters(clientId: string, since: Date): Promise<ExportLetter[]> {
  const rows = await db()
    .select({
      id: digests.id,
      period: digests.period,
      status: digests.status,
      blocks: digests.blocks,
      sentAt: digests.sentAt,
    })
    .from(digests)
    .where(
      and(
        eq(digests.clientId, clientId),
        inArray(digests.status, ["validated", "sent"]),
        gte(digests.createdAt, since),
      ),
    )
    .orderBy(desc(digests.createdAt));

  const letters: ExportLetter[] = [];
  for (const row of rows) {
    const issue = parseIssue(row.blocks);
    // Un numéro de l'ancienne forme (sans lettre) n'a rien à montrer en entier.
    if (!issue?.lettre) continue;
    const { lettre } = issue;
    letters.push({
      id: row.id,
      period: row.period,
      issueDate: issue.constate.issueDate,
      status: row.status as ExportLetter["status"],
      sentAt: row.sentAt?.toISOString() ?? null,
      title: lettre.titre,
      chapeau: lettre.chapeau,
      axesAAgir: lettre.axes.filter((axe) => axe.statut === "agir").length,
      actions: lettre.synthese.actions.map(({ action, horizon }) => ({ action, horizon })),
      blocks: renderLettre(lettre),
    });
  }
  return letters;
}

/** L'export d'un client, ou null s'il n'existe pas. Validé avant de sortir. */
export async function buildExport(clientId: string, now = new Date()): Promise<SentinelleExport | null> {
  const [client] = await db()
    .select({ id: clients.id, siteUrl: clients.siteUrl })
    .from(clients)
    .where(eq(clients.id, clientId))
    .limit(1);
  if (!client) return null;

  const since = monthsAgo(now, EXPORT_MONTHS);
  const [constate, alertRows, letters, slugs] = await Promise.all([
    loadConstate(client.id, newsletterPeriodAt(now), now),
    loadAlerts(client.id, since),
    loadLetters(client.id, since),
    db()
      .select({ label: stackItems.label, slug: stackItems.slug })
      .from(stackItems)
      .where(and(eq(stackItems.clientId, client.id), eq(stackItems.watchEnabled, true))),
  ]);

  const slugByLabel = new Map(slugs.map((row) => [row.label, row.slug]));
  const { health, radar } = constate.blocks;

  // Validé en sortie comme en entrée : un export qui ne respecte pas son propre
  // contrat est un bug d'ici, pas un problème à laisser au consommateur.
  return SentinelleExportSchema.parse({
    version: EXPORT_VERSION,
    generatedAt: now.toISOString(),
    client: { id: client.id, siteUrl: client.siteUrl },
    axes: [...EXPORT_AXES],
    stack: {
      components: health.components.map((line) => ({
        label: line.label,
        slug: slugByLabel.get(line.label) ?? line.label,
        type: line.type,
        version: line.version,
        openAlerts: line.openAlerts,
      })),
      withoutVersion: health.withoutVersion,
    },
    alerts: alertRows,
    radar: radar.map((entry) => ({ ...entry })),
    letters,
  });
}
