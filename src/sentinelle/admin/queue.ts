import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "@sentinelle/db/client";
import { alerts, clients, intelItems, stackItems } from "@sentinelle/db/schema";
import type { AlertStatus, DraftedAlert, Verdict } from "@sentinelle/types";
import { initialContent } from "./content";

// ─────────────────────────────────────────────────────────────────────────────
// Lectures de la file de validation.
//
// Le lot 2 a montré le vrai sujet de cette phase : un client Drupal accumule
// vingt-six alertes, un client Next.js vingt-neuf, presque toutes légitimes.
// Une file qui les présente une par une, à plat, est inutilisable — on ne relit
// pas trente fois « une CVE de plus sur le même composant ».
//
// D'où deux niveaux de lecture, et un seul principe : **jamais une liste
// d'alertes, toujours une liste de composants**. Le regroupement se fait ici,
// pas dans la page : c'est une règle de produit, pas de présentation.
// ─────────────────────────────────────────────────────────────────────────────

/** Statuts qui attendent quelque chose d'un humain. */
export const OPEN_STATUSES = ["draft", "validated"] as const satisfies readonly AlertStatus[];

export interface ClientQueue {
  clientId: string;
  name: string;
  company: string | null;
  siteUrl: string;
  email: string;
  active: boolean;
  /** Alertes en attente d'une décision (brouillon + validées non envoyées). */
  pending: number;
  /** Validées, donc prêtes à partir : c'est ce qui reste à faire, pas à lire. */
  ready: number;
  /** Brouillons encore sans texte — la rédaction n'est pas passée, ou a échoué. */
  withoutText: number;
  verdicts: Record<Verdict, number>;
  oldestPendingAt: Date | null;
}

const EMPTY_VERDICTS: Record<Verdict, number> = { red: 0, orange: 0, green: 0, info: 0 };

/**
 * Vue d'ensemble : un client par ligne, ce qui l'attend en colonnes.
 *
 * Les clients sans rien en attente n'apparaissent pas. Un tableau de bord qui
 * liste trente clients à zéro ne montre plus les deux qui attendent.
 */
export async function listQueue(): Promise<ClientQueue[]> {
  const rows = await db()
    .select({
      clientId: clients.id,
      name: clients.name,
      company: clients.company,
      siteUrl: clients.siteUrl,
      email: clients.email,
      active: clients.active,
      status: alerts.status,
      verdict: alerts.verdict,
      hasText: sql<boolean>`(${alerts.generatedText} is not null or ${alerts.finalText} is not null)`,
      createdAt: alerts.createdAt,
    })
    .from(alerts)
    .innerJoin(clients, eq(alerts.clientId, clients.id))
    .where(inArray(alerts.status, [...OPEN_STATUSES]))
    .orderBy(asc(alerts.createdAt));

  const byClient = new Map<string, ClientQueue>();

  for (const row of rows) {
    const entry =
      byClient.get(row.clientId) ??
      ({
        clientId: row.clientId,
        name: row.name,
        company: row.company,
        siteUrl: row.siteUrl,
        email: row.email,
        active: row.active,
        pending: 0,
        ready: 0,
        withoutText: 0,
        verdicts: { ...EMPTY_VERDICTS },
        oldestPendingAt: null,
      } satisfies ClientQueue);

    entry.pending++;
    if (row.status === "validated") entry.ready++;
    if (row.status === "draft" && !row.hasText) entry.withoutText++;
    if (row.verdict) entry.verdicts[row.verdict]++;
    if (!entry.oldestPendingAt || row.createdAt < entry.oldestPendingAt) {
      entry.oldestPendingAt = row.createdAt;
    }

    byClient.set(row.clientId, entry);
  }

  // Les plus urgents d'abord : le rouge commande, puis le volume.
  return [...byClient.values()].sort(
    (a, b) => b.verdicts.red - a.verdicts.red || b.pending - a.pending,
  );
}

export interface QueueAlert {
  id: string;
  status: AlertStatus;
  verdict: Verdict | null;
  /** Titre relu s'il existe, sinon celui de la source. Jamais vide. */
  title: string;
  hasText: boolean;
  /** Le texte a été relu et enregistré — pas seulement généré. */
  reviewed: boolean;
  createdAt: Date;
  sentAt: Date | null;
  intelTitle: string;
  intelKind: string;
  intelSource: string;
  severity: string | null;
}

export interface ComponentGroup {
  stackItemId: string;
  label: string;
  slug: string;
  version: string | null;
  type: string;
  ecosystem: string | null;
  alerts: QueueAlert[];
}

export interface ClientDossier {
  client: {
    id: string;
    name: string;
    company: string | null;
    siteUrl: string;
    email: string;
    sector: string | null;
    notes: string | null;
    active: boolean;
  };
  groups: ComponentGroup[];
  /** Envoyées ou écartées — l'historique, replié dans la page. */
  closed: QueueAlert[];
}

const VERDICT_RANK: Record<Verdict, number> = { red: 0, orange: 1, info: 2, green: 3 };

/**
 * Dossier d'un client : ses alertes ouvertes, groupées par composant.
 *
 * Charge aussi les alertes closes (envoyées, écartées) : sans elles, impossible
 * de savoir si on vient d'écrire trois fois la même chose au même client.
 */
export async function getClientDossier(clientId: string): Promise<ClientDossier | null> {
  const [client] = await db()
    .select({
      id: clients.id,
      name: clients.name,
      company: clients.company,
      siteUrl: clients.siteUrl,
      email: clients.email,
      sector: clients.sector,
      notes: clients.notes,
      active: clients.active,
    })
    .from(clients)
    .where(eq(clients.id, clientId))
    .limit(1);

  if (!client) return null;

  const rows = await db()
    .select({
      id: alerts.id,
      status: alerts.status,
      verdict: alerts.verdict,
      finalText: alerts.finalText,
      generatedText: alerts.generatedText,
      createdAt: alerts.createdAt,
      sentAt: alerts.sentAt,
      stackItemId: stackItems.id,
      label: stackItems.label,
      slug: stackItems.slug,
      version: stackItems.version,
      type: stackItems.type,
      ecosystem: stackItems.ecosystem,
      intelTitle: intelItems.title,
      intelKind: intelItems.kind,
      intelSource: intelItems.source,
      severity: intelItems.severity,
    })
    .from(alerts)
    .innerJoin(stackItems, eq(alerts.stackItemId, stackItems.id))
    .innerJoin(intelItems, eq(alerts.intelItemId, intelItems.id))
    .where(eq(alerts.clientId, clientId))
    .orderBy(desc(alerts.createdAt));

  const groups = new Map<string, ComponentGroup>();
  const closed: QueueAlert[] = [];

  for (const row of rows) {
    const content = initialContent(row);
    const alert: QueueAlert = {
      id: row.id,
      status: row.status,
      verdict: row.verdict,
      title: content.title.trim() || row.intelTitle,
      hasText: Boolean(row.generatedText ?? row.finalText),
      reviewed: Boolean(row.finalText),
      createdAt: row.createdAt,
      sentAt: row.sentAt,
      intelTitle: row.intelTitle,
      intelKind: row.intelKind,
      intelSource: row.intelSource,
      severity: row.severity,
    };

    if (row.status !== "draft" && row.status !== "validated") {
      closed.push(alert);
      continue;
    }

    const group =
      groups.get(row.stackItemId) ??
      ({
        stackItemId: row.stackItemId,
        label: row.label,
        slug: row.slug,
        version: row.version,
        type: row.type,
        ecosystem: row.ecosystem,
        alerts: [],
      } satisfies ComponentGroup);

    group.alerts.push(alert);
    groups.set(row.stackItemId, group);
  }

  const ordered = [...groups.values()].sort((a, b) => {
    const rank = (group: ComponentGroup) =>
      Math.min(...group.alerts.map((alert) => (alert.verdict ? VERDICT_RANK[alert.verdict] : 4)));
    return rank(a) - rank(b) || b.alerts.length - a.alerts.length;
  });

  for (const group of ordered) {
    group.alerts.sort(
      (a, b) =>
        (a.verdict ? VERDICT_RANK[a.verdict] : 4) - (b.verdict ? VERDICT_RANK[b.verdict] : 4) ||
        b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  return { client, groups: ordered, closed };
}

export interface AlertDetail {
  id: string;
  status: AlertStatus;
  verdict: Verdict | null;
  content: DraftedAlert;
  /** Sortie brute du modèle, telle quelle — la trace d'audit de la rédaction. */
  generatedText: string | null;
  reviewed: boolean;
  createdAt: Date;
  sentAt: Date | null;
  client: {
    id: string;
    name: string;
    email: string;
    siteUrl: string;
    company: string | null;
    active: boolean;
  };
  component: { label: string; slug: string; version: string | null; type: string };
  intel: {
    title: string;
    kind: string;
    source: string;
    severity: string | null;
    affectedRange: string | null;
    fixedIn: string | null;
    publishedAt: Date | null;
  };
}

/** Une alerte, tout ce qu'il faut pour la relire et la comprendre. */
export async function getAlertDetail(alertId: string): Promise<AlertDetail | null> {
  const [row] = await db()
    .select({
      id: alerts.id,
      status: alerts.status,
      verdict: alerts.verdict,
      finalText: alerts.finalText,
      generatedText: alerts.generatedText,
      createdAt: alerts.createdAt,
      sentAt: alerts.sentAt,
      clientId: clients.id,
      clientName: clients.name,
      clientEmail: clients.email,
      clientSite: clients.siteUrl,
      clientCompany: clients.company,
      clientActive: clients.active,
      label: stackItems.label,
      slug: stackItems.slug,
      version: stackItems.version,
      type: stackItems.type,
      intelTitle: intelItems.title,
      intelKind: intelItems.kind,
      intelSource: intelItems.source,
      severity: intelItems.severity,
      affectedRange: intelItems.affectedRange,
      fixedIn: intelItems.fixedIn,
      publishedAt: intelItems.publishedAt,
    })
    .from(alerts)
    .innerJoin(clients, eq(alerts.clientId, clients.id))
    .innerJoin(stackItems, eq(alerts.stackItemId, stackItems.id))
    .innerJoin(intelItems, eq(alerts.intelItemId, intelItems.id))
    .where(eq(alerts.id, alertId))
    .limit(1);

  if (!row) return null;

  return {
    id: row.id,
    status: row.status,
    verdict: row.verdict,
    content: initialContent(row),
    generatedText: row.generatedText,
    reviewed: Boolean(row.finalText),
    createdAt: row.createdAt,
    sentAt: row.sentAt,
    client: {
      id: row.clientId,
      name: row.clientName,
      email: row.clientEmail,
      siteUrl: row.clientSite,
      company: row.clientCompany,
      active: row.clientActive,
    },
    component: {
      label: row.label,
      slug: row.slug,
      version: row.version,
      type: row.type,
    },
    intel: {
      title: row.intelTitle,
      kind: row.intelKind,
      source: row.intelSource,
      severity: row.severity,
      affectedRange: row.affectedRange,
      fixedIn: row.fixedIn,
      publishedAt: row.publishedAt,
    },
  };
}

/** Identifiant de l'alerte ouverte suivante du même client — enchaîner sans revenir. */
export async function nextOpenAlertId(
  clientId: string,
  currentId: string,
): Promise<string | null> {
  const [row] = await db()
    .select({ id: alerts.id })
    .from(alerts)
    .where(
      and(
        eq(alerts.clientId, clientId),
        inArray(alerts.status, [...OPEN_STATUSES]),
        sql`${alerts.id} <> ${currentId}`,
      ),
    )
    .orderBy(
      sql`case ${alerts.verdict} when 'red' then 0 when 'orange' then 1 else 2 end`,
      asc(alerts.createdAt),
    )
    .limit(1);

  return row?.id ?? null;
}
