import { and, eq, gte, lt, or, sql } from "drizzle-orm";
import { db } from "../db/client";
import { ctoAdminChallenges, ctoAdminMagicLinks, ctoAdminSessions } from "../db/schema";
import {
  accessSecret,
  createMagicToken,
  createSessionToken,
  hashToken,
  shouldSlide,
  verifyMagicToken,
  MAGIC_LINK_TTL_MS,
  SESSION_TTL_MS,
} from "@cto/access";
import { ADMIN_USER_ID } from "./identity";

// ─────────────────────────────────────────────────────────────────────────────
// Émission et consommation des accès admin — le côté base.
//
// Copie volontaire, réduite, de `src/cto/access/store.ts` : même mécanique
// (lien de secours signé + session vivante en base), mais sans la couche
// « personne/client » qui n'a pas de sens ici — voir `identity.ts`. Les
// primitives de signature et de hachage (`@cto/access`) sont, elles,
// réutilisées telles quelles : elles ne connaissent ni client ni personne, les
// dupliquer n'achèterait rien.
// ─────────────────────────────────────────────────────────────────────────────

/** Même seuil que côté client : un formulaire cliqué plusieurs fois ne doit pas invalider ses propres liens. */
export const MAX_LINKS_PER_WINDOW = 3;

export type IssueOutcome =
  | { ok: true; token: string; expiresAt: Date }
  | { ok: false; reason: "trop de demandes" };

/** Émet un lien de secours pour l'unique identité admin. */
export async function issueAdminMagicLink(now: Date = new Date()): Promise<IssueOutcome> {
  const since = new Date(now.getTime() - MAGIC_LINK_TTL_MS);

  const [{ count }] = await db()
    .select({ count: sql<number>`count(*)::int` })
    .from(ctoAdminMagicLinks)
    .where(gte(ctoAdminMagicLinks.createdAt, since));

  if (count >= MAX_LINKS_PER_WINDOW) return { ok: false, reason: "trop de demandes" };

  // Le sujet du jeton doit être un identifiant SANS point : `verifyMagicToken`
  // découpe le jeton sur "." en exactement 4 morceaux (voir @cto/access/token.ts),
  // et l'adresse admin en contient un (next-impact.digital) — un jeton émis avec
  // `ADMIN_EMAIL` ici échouerait donc TOUJOURS à la vérification, y compris
  // fraîchement émis. `consumeAdminMagicLink` ignore de toute façon ce champ, la
  // seule identité qui compte est le login unique de cet espace.
  const issued = createMagicToken(ADMIN_USER_ID, accessSecret(), now);

  await db().insert(ctoAdminMagicLinks).values({
    tokenHash: issued.tokenHash,
    expiresAt: issued.expiresAt,
  });

  return { ok: true, token: issued.token, expiresAt: issued.expiresAt };
}

export type ConsumeOutcome =
  | { ok: true }
  | { ok: false; reason: "absent" | "malformé" | "signature" | "expiré" | "consommé" };

/** Consomme un lien : vérifie hors ligne, puis supprime la ligne (usage unique). */
export async function consumeAdminMagicLink(
  token: string | null | undefined,
  now: Date = new Date(),
): Promise<ConsumeOutcome> {
  const check = verifyMagicToken(token, accessSecret(), now);
  if (!check.valid) return { ok: false, reason: check.reason };

  const deleted = await db()
    .delete(ctoAdminMagicLinks)
    .where(and(eq(ctoAdminMagicLinks.tokenHash, check.tokenHash), gte(ctoAdminMagicLinks.expiresAt, now)))
    .returning({ id: ctoAdminMagicLinks.id });

  if (deleted.length === 0) return { ok: false, reason: "consommé" };

  return { ok: true };
}

// ─── Sessions ─────────────────────────────────────────────────────────────

export interface OpenedSession {
  token: string;
  expiresAt: Date;
}

/** Ouvre une session admin, et renvoie le jeton à poser en cookie. */
export async function openAdminSession(
  userAgent: string | null,
  now: Date = new Date(),
): Promise<OpenedSession> {
  const issued = createSessionToken(now);

  await db().insert(ctoAdminSessions).values({
    tokenHash: issued.tokenHash,
    expiresAt: issued.expiresAt,
    lastSeenAt: now,
    userAgent: userAgent?.slice(0, 400) ?? null,
  });

  return { token: issued.token, expiresAt: issued.expiresAt };
}

export interface ResolvedAdminSession {
  sessionId: string;
}

/** Résout un cookie de session admin. Glissante, comme côté client. */
export async function resolveAdminSession(
  token: string | null | undefined,
  now: Date = new Date(),
): Promise<ResolvedAdminSession | null> {
  if (!token) return null;

  const [row] = await db()
    .select({
      sessionId: ctoAdminSessions.id,
      expiresAt: ctoAdminSessions.expiresAt,
      revokedAt: ctoAdminSessions.revokedAt,
    })
    .from(ctoAdminSessions)
    .where(eq(ctoAdminSessions.tokenHash, hashToken(token)))
    .limit(1);

  if (!row) return null;
  if (row.revokedAt) return null;
  if (row.expiresAt.getTime() <= now.getTime()) return null;

  if (shouldSlide(row.expiresAt, now)) {
    await db()
      .update(ctoAdminSessions)
      .set({ expiresAt: new Date(now.getTime() + SESSION_TTL_MS), lastSeenAt: now })
      .where(eq(ctoAdminSessions.id, row.sessionId));
  }

  return { sessionId: row.sessionId };
}

/** Ferme la session courante. */
export async function closeAdminSession(token: string | null | undefined): Promise<void> {
  if (!token) return;
  await db().delete(ctoAdminSessions).where(eq(ctoAdminSessions.tokenHash, hashToken(token)));
}

// ─── Balayage ─────────────────────────────────────────────────────────────

export interface AdminPurgeReport {
  magicLinks: number;
  challenges: number;
  sessions: number;
}

/** Même ménage que `purgeExpiredAccess`, sur les quatre tables admin. */
export async function purgeExpiredAdminAccess(now: Date = new Date()): Promise<AdminPurgeReport> {
  const links = await db()
    .delete(ctoAdminMagicLinks)
    .where(lt(ctoAdminMagicLinks.expiresAt, now))
    .returning({ id: ctoAdminMagicLinks.id });

  const challenges = await db()
    .delete(ctoAdminChallenges)
    .where(lt(ctoAdminChallenges.expiresAt, now))
    .returning({ id: ctoAdminChallenges.id });

  const sessions = await db()
    .delete(ctoAdminSessions)
    .where(or(lt(ctoAdminSessions.expiresAt, now), sql`${ctoAdminSessions.revokedAt} is not null`))
    .returning({ id: ctoAdminSessions.id });

  return { magicLinks: links.length, challenges: challenges.length, sessions: sessions.length };
}
