import { and, desc, eq } from "drizzle-orm";
import { db } from "@sentinelle/db/client";
import { alerts, digests, intelItems, stackItems } from "@sentinelle/db/schema";
import { initialContent } from "@sentinelle/admin/content";
import type { DraftedAlert, Verdict } from "@sentinelle/types";

// ─────────────────────────────────────────────────────────────────────────────
// Ce qu'un abonné a le droit de lire dans son espace.
//
// Une seule règle, et elle est structurante : **l'espace ne montre que ce qui a
// été envoyé**. Pas les brouillons, pas les alertes écartées, pas ce qui attend
// une relecture. Un client qui verrait la file de validation lirait des textes
// que le produit n'assume pas encore — et la règle 4 (« rien ne part sans
// relecture ») deviendrait un détail d'implémentation au lieu d'une promesse.
//
// Corollaire pratique : toutes les requêtes de ce fichier filtrent sur
// `clientId` ET sur le statut. Le filtre par client n'est jamais implicite.
// ─────────────────────────────────────────────────────────────────────────────

export interface ReceivedAlert {
  id: string;
  verdict: Verdict | null;
  content: DraftedAlert;
  sentAt: Date | null;
  component: { label: string; version: string | null };
  intel: { title: string; source: string; severity: string | null };
}

/** Les alertes réellement reçues par ce client, la plus récente d'abord. */
export async function listReceivedAlerts(clientId: string): Promise<ReceivedAlert[]> {
  const rows = await db()
    .select({
      id: alerts.id,
      verdict: alerts.verdict,
      finalText: alerts.finalText,
      generatedText: alerts.generatedText,
      sentAt: alerts.sentAt,
      label: stackItems.label,
      version: stackItems.version,
      intelTitle: intelItems.title,
      intelSource: intelItems.source,
      severity: intelItems.severity,
    })
    .from(alerts)
    .innerJoin(stackItems, eq(alerts.stackItemId, stackItems.id))
    .innerJoin(intelItems, eq(alerts.intelItemId, intelItems.id))
    .where(and(eq(alerts.clientId, clientId), eq(alerts.status, "sent")))
    .orderBy(desc(alerts.sentAt));

  return rows.map((row) => ({
    id: row.id,
    verdict: row.verdict,
    // Le texte affiché est celui qui a été relu puis envoyé — jamais la sortie
    // brute du modèle. `initialContent` retombe sur `generatedText` pour l'admin,
    // mais ici `finalText` existe toujours : on n'envoie pas sans relecture.
    content: initialContent(row),
    sentAt: row.sentAt,
    component: { label: row.label, version: row.version },
    intel: { title: row.intelTitle, source: row.intelSource, severity: row.severity },
  }));
}

export interface ReceivedIssue {
  id: string;
  period: string;
  sentAt: Date | null;
}

/** Les numéros de la lettre effectivement envoyés à ce client. */
export async function listReceivedIssues(clientId: string): Promise<ReceivedIssue[]> {
  const rows = await db()
    .select({ id: digests.id, period: digests.period, sentAt: digests.sentAt })
    .from(digests)
    .where(and(eq(digests.clientId, clientId), eq(digests.status, "sent")))
    .orderBy(desc(digests.sentAt));

  return rows;
}

/**
 * Le HTML d'un numéro, si — et seulement si — il appartient à ce client.
 *
 * Le `clientId` fait partie de la clause `where` et non d'une vérification
 * faite après coup : une lecture qui ne peut pas rendre la ligne d'un autre est
 * plus sûre qu'une lecture suivie d'un `if`.
 */
export async function getReceivedIssueHtml(
  clientId: string,
  digestId: string,
): Promise<{ period: string; html: string; sentAt: Date | null } | null> {
  const [row] = await db()
    .select({ period: digests.period, finalHtml: digests.finalHtml, sentAt: digests.sentAt })
    .from(digests)
    .where(
      and(
        eq(digests.id, digestId),
        eq(digests.clientId, clientId),
        eq(digests.status, "sent"),
      ),
    )
    .limit(1);

  if (!row?.finalHtml) return null;

  return { period: row.period, html: row.finalHtml, sentAt: row.sentAt };
}

/** Libellé lisible d'une période « 2026-08-1 » → « 1er août 2026 ». */
export function periodLabel(period: string): string {
  const match = /^(\d{4})-(\d{2})-(1|2)$/.exec(period);
  if (!match) return period;

  const [, year, month, half] = match;
  const day = half === "1" ? 1 : 15;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, day));

  const formatted = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);

  return day === 1 ? formatted.replace(/^1 /, "1er ") : formatted;
}
