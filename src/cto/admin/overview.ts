import { and, desc, eq, gte, inArray, isNull, sql } from "drizzle-orm";
import { db } from "../db/client";
import { ctoAccessLog, ctoClients, ctoPersons, ctoSessions } from "../db/schema";
import type { AccessEvent, ClientStatus } from "../access";

// ─────────────────────────────────────────────────────────────────────────────
// Vue d'ensemble de tous les accompagnements — lecture seule, délibérément.
//
// `scripts/cto-invite.ts` explique pourquoi l'espace n'a pas de back-office de
// création : à l'échelle actuelle (quatre accompagnements au maximum,
// CTO_TERMS), un écran de saisie coûterait plus d'interface que le produit n'en
// vaut. Ce module répond à un besoin différent — voir d'un coup d'œil l'état de
// tous les accompagnements sans ouvrir Neon — et s'arrête à la lecture : changer
// un statut ou révoquer une personne reste un geste SQL délibéré
// (`docs/cto-externalise/espace-client-mise-en-place.md` § 3), pas un bouton
// qu'on presse par réflexe.
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_ORDER: Record<ClientStatus, number> = {
  actif: 0,
  suspendu: 1,
  restitution: 2,
  clos: 3,
};

export interface ClientOverviewRow {
  id: string;
  company: string;
  tier: string;
  status: ClientStatus;
  statusChangedAt: Date;
  sector: string | null;
  syncEnabled: boolean;
  activePersons: number;
  revokedPersons: number;
  openSessions: number;
  lastAccessAt: Date | null;
}

/**
 * L'état de tous les accompagnements, trié par urgence puis par nom.
 *
 * Quatre requêtes indépendantes plutôt qu'une seule jointure tentaculaire :
 * chacune se lit seule, et le driver HTTP de Neon n'a de toute façon pas de
 * transaction interactive à faire tenir entre elles.
 */
export async function listClients(now: Date = new Date()): Promise<ClientOverviewRow[]> {
  const [clients, personCounts, sessionCounts, lastAccess] = await Promise.all([
    db().select().from(ctoClients),

    db()
      .select({
        clientId: ctoPersons.clientId,
        active: sql<number>`count(*) filter (where ${ctoPersons.revokedAt} is null)::int`,
        revoked: sql<number>`count(*) filter (where ${ctoPersons.revokedAt} is not null)::int`,
      })
      .from(ctoPersons)
      .groupBy(ctoPersons.clientId),

    db()
      .select({
        clientId: ctoPersons.clientId,
        count: sql<number>`count(*)::int`,
      })
      .from(ctoSessions)
      .innerJoin(ctoPersons, eq(ctoSessions.personId, ctoPersons.id))
      .where(and(isNull(ctoSessions.revokedAt), gte(ctoSessions.expiresAt, now)))
      .groupBy(ctoPersons.clientId),

    db()
      .select({
        clientId: ctoAccessLog.clientId,
        // Le générique `sql<Date>` ne CONVERTIT rien : c'est une promesse de
        // typage, pas un cast. Un agrégat brut (`max(...)`) sort du chemin de
        // mapping automatique des colonnes de Drizzle et revient du driver
        // `neon-http` en texte Postgres (« 2026-09-23 05:59:16.047727 »), pas en
        // `Date` — d'où le `new Date(...)` explicite plus bas, seul endroit où
        // ce module lit une date issue d'un `sql<...>` plutôt que d'une colonne.
        last: sql<string>`max(${ctoAccessLog.at})`,
      })
      .from(ctoAccessLog)
      .where(inArray(ctoAccessLog.event, ["connexion_lien", "connexion_passkey"]))
      .groupBy(ctoAccessLog.clientId),
  ]);

  const persons = new Map(personCounts.map((row) => [row.clientId, row]));
  const sessions = new Map(sessionCounts.map((row) => [row.clientId, row.count]));
  const access = new Map(lastAccess.map((row) => [row.clientId, new Date(row.last)]));

  return clients
    .map((client) => ({
      id: client.id,
      company: client.company,
      tier: client.tier,
      status: client.status as ClientStatus,
      statusChangedAt: client.statusChangedAt,
      sector: client.sector,
      syncEnabled: client.syncEnabled,
      activePersons: persons.get(client.id)?.active ?? 0,
      revokedPersons: persons.get(client.id)?.revoked ?? 0,
      openSessions: sessions.get(client.id) ?? 0,
      lastAccessAt: access.get(client.id) ?? null,
    }))
    .sort(
      (a, b) =>
        STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || a.company.localeCompare(b.company, "fr"),
    );
}

export interface AdminPersonRow {
  id: string;
  email: string;
  name: string;
  role: string | null;
  revokedAt: Date | null;
  createdAt: Date;
  openSessions: number;
}

export interface ClientDetail {
  id: string;
  company: string;
  tier: string;
  status: ClientStatus;
  statusChangedAt: Date;
  sector: string | null;
  syncEnabled: boolean;
  createdAt: Date;
  persons: AdminPersonRow[];
}

/** Un accompagnement et ses personnes, révoquées comprises — `null` si l'identifiant n'existe pas. */
export async function clientDetail(
  clientId: string,
  now: Date = new Date(),
): Promise<ClientDetail | null> {
  const [client] = await db().select().from(ctoClients).where(eq(ctoClients.id, clientId)).limit(1);
  if (!client) return null;

  const [persons, sessionCounts] = await Promise.all([
    db()
      .select({
        id: ctoPersons.id,
        email: ctoPersons.email,
        name: ctoPersons.name,
        role: ctoPersons.role,
        revokedAt: ctoPersons.revokedAt,
        createdAt: ctoPersons.createdAt,
      })
      .from(ctoPersons)
      .where(eq(ctoPersons.clientId, clientId))
      .orderBy(ctoPersons.createdAt),

    db()
      .select({
        personId: ctoSessions.personId,
        count: sql<number>`count(*)::int`,
      })
      .from(ctoSessions)
      .innerJoin(ctoPersons, eq(ctoSessions.personId, ctoPersons.id))
      .where(
        and(
          eq(ctoPersons.clientId, clientId),
          isNull(ctoSessions.revokedAt),
          gte(ctoSessions.expiresAt, now),
        ),
      )
      .groupBy(ctoSessions.personId),
  ]);

  const sessions = new Map(sessionCounts.map((row) => [row.personId, row.count]));

  return {
    id: client.id,
    company: client.company,
    tier: client.tier,
    status: client.status as ClientStatus,
    statusChangedAt: client.statusChangedAt,
    sector: client.sector,
    syncEnabled: client.syncEnabled,
    createdAt: client.createdAt,
    persons: persons.map((person) => ({
      ...person,
      openSessions: sessions.get(person.id) ?? 0,
    })),
  };
}

export interface JournalOverviewRow {
  id: string;
  event: AccessEvent;
  detail: string | null;
  at: Date;
  company: string | null;
  personName: string | null;
}

/**
 * Les derniers événements, toutes personnes et tous accompagnements confondus.
 *
 * Jointures externes (`leftJoin`) : un événement dont la personne ou le client
 * a depuis été effacé reste lisible, `company`/`personName` valant `null` plutôt
 * que de faire disparaître la ligne.
 */
export async function recentAccessLog(limit = 50): Promise<JournalOverviewRow[]> {
  const rows = await db()
    .select({
      id: ctoAccessLog.id,
      event: ctoAccessLog.event,
      detail: ctoAccessLog.detail,
      at: ctoAccessLog.at,
      company: ctoClients.company,
      personName: ctoPersons.name,
    })
    .from(ctoAccessLog)
    .leftJoin(ctoPersons, eq(ctoAccessLog.personId, ctoPersons.id))
    .leftJoin(ctoClients, eq(ctoAccessLog.clientId, ctoClients.id))
    .orderBy(desc(ctoAccessLog.at))
    .limit(limit);

  return rows.map((row) => ({ ...row, company: row.company ?? null, personName: row.personName ?? null }));
}
