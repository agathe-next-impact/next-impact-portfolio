import { and, asc, desc, eq, gte, inArray, isNull, lt, or, sql } from "drizzle-orm";
import { db } from "../db/client";
import {
  ctoClients,
  ctoCredentials,
  ctoMagicLinks,
  ctoPersons,
  ctoSessions,
  ctoChallenges,
} from "../db/schema";
import {
  accessSecret,
  createLoginCode,
  createMagicToken,
  createSessionToken,
  hashLoginCode,
  hashToken,
  normalizeLoginCode,
  sameHash,
  shouldSlide,
  verifyMagicToken,
  MAGIC_LINK_TTL_MS,
  MAX_CODE_ATTEMPTS,
  SESSION_TTL_MS,
} from "./token";

// ─────────────────────────────────────────────────────────────────────────────
// Émission et consommation des accès — le côté base.
//
// La logique de jeton vit dans `token.ts`, pure et testée. Ici, uniquement ce
// qui a besoin de la base : retrouver une personne, ouvrir et fermer des
// sessions, et refuser poliment quand quelqu'un demande dix liens.
//
// Une règle traverse tout le fichier : **l'état du client est vérifié à chaque
// résolution de session, jamais seulement à la connexion.** Sans cela, clore un
// accompagnement laisserait les sessions déjà ouvertes courir jusqu'à leur
// échéance — c'est exactement le défaut constaté sur l'espace Sentinelle, et il
// n'a pas sa place sur un espace qui porte des contrats et des budgets.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Nombre de liens de secours qu'une même personne peut demander par quart
 * d'heure.
 *
 * Ce n'est pas une protection contre une attaque : il n'existe pas de compteur
 * fiable en serverless. C'est une protection contre l'usage — un formulaire
 * cliqué cinq fois d'affilée ne doit pas envoyer cinq e-mails dont quatre
 * annulent l'accès du cinquième dans l'esprit de celui qui les reçoit.
 */
export const MAX_LINKS_PER_WINDOW = 3;

export type ClientStatus = "actif" | "suspendu" | "restitution" | "clos";

export interface AccessDecision {
  /** La porte s'ouvre-t-elle ? */
  allowed: boolean;
  /** L'espace est-il consultable sans plus rien y publier ? */
  readOnly: boolean;
  /** Message affichable, ou null si tout est normal. */
  notice: string | null;
}

/**
 * Ce que l'état d'un accompagnement autorise.
 *
 * Fonction pure exportée à part : la couche livrables s'en servira telle quelle
 * pour décider quoi afficher, sans redéclarer sa propre grille — deux grilles
 * finiraient par diverger, et l'une des deux serait trop permissive.
 */
export function accessDecision(status: ClientStatus): AccessDecision {
  switch (status) {
    case "actif":
      return { allowed: true, readOnly: false, notice: null };
    case "suspendu":
      return {
        allowed: true,
        readOnly: true,
        notice:
          "Votre accompagnement est suspendu. Votre espace reste consultable ; aucune nouvelle publication n'est en cours.",
      };
    case "restitution":
      return {
        allowed: true,
        readOnly: true,
        notice:
          "Votre accompagnement est terminé. Votre espace reste ouvert le temps de la restitution : vous pouvez tout consulter et tout exporter.",
      };
    case "clos":
      return { allowed: false, readOnly: true, notice: "Cet espace est clos." };
  }
}

export interface Person {
  id: string;
  clientId: string;
  email: string;
  name: string;
  role: string | null;
  company: string;
  status: ClientStatus;
}

function personSelection() {
  return {
    id: ctoPersons.id,
    clientId: ctoPersons.clientId,
    email: ctoPersons.email,
    name: ctoPersons.name,
    role: ctoPersons.role,
    revokedAt: ctoPersons.revokedAt,
    company: ctoClients.company,
    status: ctoClients.status,
  };
}

/**
 * Les personnes actives qui portent une adresse — zéro, une ou plusieurs.
 *
 * Plusieurs, parce qu'une adresse n'est pas une identité (décision du
 * 2026-09-29) : un consultant suivi chez deux clients, une boîte partagée par
 * deux personnes d'une même entreprise. Chacune est une ligne à part, avec ses
 * passkeys et ses sessions ; l'écran de connexion envoie un lien par ligne.
 * Ordre stable (entreprise, nom) : c'est celui de l'e-mail qui les liste.
 *
 * Les personnes révoquées ne sont PAS renvoyées : contrairement à Sentinelle,
 * qui laisse volontairement un abonné résilié consulter son espace pendant la
 * fenêtre de réactivation, une personne révoquée ici a quitté l'entreprise
 * cliente. L'accompagnement, lui, peut très bien continuer sans elle.
 *
 * L'état du client n'est pas filtré ici : un espace `clos` doit produire un
 * refus explicite et journalisé, pas une adresse « inconnue ».
 */
export async function findPersonsByEmail(email: string): Promise<Person[]> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return [];

  const rows = await db()
    .select(personSelection())
    .from(ctoPersons)
    .innerJoin(ctoClients, eq(ctoPersons.clientId, ctoClients.id))
    .where(
      and(eq(sql`lower(${ctoPersons.email})`, normalized), isNull(ctoPersons.revokedAt)),
    )
    .orderBy(asc(ctoClients.company), asc(ctoPersons.name));

  return rows.map(({ revokedAt: _revoked, ...person }) => person as Person);
}

export async function findPersonById(personId: string): Promise<Person | null> {
  const [row] = await db()
    .select(personSelection())
    .from(ctoPersons)
    .innerJoin(ctoClients, eq(ctoPersons.clientId, ctoClients.id))
    .where(and(eq(ctoPersons.id, personId), isNull(ctoPersons.revokedAt)))
    .limit(1);

  if (!row) return null;
  const { revokedAt: _revoked, ...person } = row;
  return person as Person;
}

// ─── Liens de secours ─────────────────────────────────────────────────────

export type IssueOutcome =
  | { ok: true; token: string; code: string; expiresAt: Date }
  | { ok: false; reason: "trop de demandes" };

/**
 * Émet un lien de secours pour une personne.
 *
 * Le jeton n'est jamais journalisé ni renvoyé ailleurs que vers l'appelant, qui
 * l'envoie par e-mail et l'oublie : il vaut accès.
 */
export async function issueMagicLink(
  personId: string,
  now: Date = new Date(),
): Promise<IssueOutcome> {
  const since = new Date(now.getTime() - MAGIC_LINK_TTL_MS);

  const [{ count }] = await db()
    .select({ count: sql<number>`count(*)::int` })
    .from(ctoMagicLinks)
    .where(and(eq(ctoMagicLinks.personId, personId), gte(ctoMagicLinks.createdAt, since)));

  if (count >= MAX_LINKS_PER_WINDOW) return { ok: false, reason: "trop de demandes" };

  const secret = accessSecret();
  const issued = createMagicToken(personId, secret, now);
  const code = createLoginCode();

  await db().insert(ctoMagicLinks).values({
    personId,
    tokenHash: issued.tokenHash,
    codeHash: hashLoginCode(issued.tokenHash, code, secret),
    expiresAt: issued.expiresAt,
  });

  return { ok: true, token: issued.token, code, expiresAt: issued.expiresAt };
}

export type ConsumeOutcome =
  | { ok: true; personId: string }
  | { ok: false; reason: "absent" | "malformé" | "signature" | "expiré" | "consommé" };

/**
 * Consomme un lien : vérifie hors ligne, puis supprime la ligne.
 *
 * La suppression CONDITIONNÉE (`used_at is null`) et le compte de lignes rendues
 * font office de verrou : deux requêtes simultanées sur le même jeton, une seule
 * obtient la ligne. C'est la base qui arbitre, pas le code, et c'est ce qui rend
 * l'usage unique vrai même sur deux instances serverless.
 */
export async function consumeMagicLink(
  token: string | null | undefined,
  now: Date = new Date(),
): Promise<ConsumeOutcome> {
  const check = verifyMagicToken(token, accessSecret(), now);
  if (!check.valid) return { ok: false, reason: check.reason };

  const deleted = await db()
    .delete(ctoMagicLinks)
    .where(
      and(
        eq(ctoMagicLinks.tokenHash, check.tokenHash),
        isNull(ctoMagicLinks.usedAt),
        gte(ctoMagicLinks.expiresAt, now),
      ),
    )
    .returning({ personId: ctoMagicLinks.personId });

  if (deleted.length === 0) return { ok: false, reason: "consommé" };

  return { ok: true, personId: deleted[0].personId };
}

export type CodeOutcome =
  | { ok: true; personId: string }
  | { ok: false; reason: "malformé" | "invalide" };

/**
 * Consomme un lien par son CODE, saisi dans l'application installée.
 *
 * Même règle d'usage unique que le lien (suppression conditionnée, arbitrée par
 * la base) : le code et le lien sont deux clés de la même ligne, la première
 * qui sert brûle l'autre. Un code faux compte un essai sur CHACUN des liens
 * vivants des personnes visées, et un lien qui atteint `MAX_CODE_ATTEMPTS`
 * disparaît : au pire trois liens × cinq essais par quart d'heure et par
 * personne, contre un million de codes possibles.
 *
 * `personIds` : toutes les personnes de l'adresse saisie. C'est le code qui
 * désigne l'espace — chaque lien envoyé porte le sien — et la personne rendue
 * est celle du lien qu'il ouvre.
 */
export async function consumeLoginCode(
  personIds: string[],
  input: string | null | undefined,
  now: Date = new Date(),
): Promise<CodeOutcome> {
  const code = normalizeLoginCode(input);
  if (!code) return { ok: false, reason: "malformé" };
  if (personIds.length === 0) return { ok: false, reason: "invalide" };

  const secret = accessSecret();
  const vivants = await db()
    .select({ id: ctoMagicLinks.id, tokenHash: ctoMagicLinks.tokenHash, codeHash: ctoMagicLinks.codeHash })
    .from(ctoMagicLinks)
    .where(
      and(
        inArray(ctoMagicLinks.personId, personIds),
        isNull(ctoMagicLinks.usedAt),
        gte(ctoMagicLinks.expiresAt, now),
        lt(ctoMagicLinks.codeAttempts, MAX_CODE_ATTEMPTS),
      ),
    );

  const trouve = vivants.find(
    (ligne) => ligne.codeHash !== null && sameHash(ligne.codeHash, hashLoginCode(ligne.tokenHash, code, secret)),
  );

  if (trouve) {
    const deleted = await db()
      .delete(ctoMagicLinks)
      .where(and(eq(ctoMagicLinks.id, trouve.id), isNull(ctoMagicLinks.usedAt)))
      .returning({ personId: ctoMagicLinks.personId });
    if (deleted.length > 0) return { ok: true, personId: deleted[0].personId };
    return { ok: false, reason: "invalide" };
  }

  if (vivants.length > 0) {
    await db()
      .update(ctoMagicLinks)
      .set({ codeAttempts: sql`${ctoMagicLinks.codeAttempts} + 1` })
      .where(inArray(ctoMagicLinks.personId, personIds));
    await db()
      .delete(ctoMagicLinks)
      .where(and(inArray(ctoMagicLinks.personId, personIds), gte(ctoMagicLinks.codeAttempts, MAX_CODE_ATTEMPTS)));
  }

  return { ok: false, reason: "invalide" };
}

// ─── Sessions ─────────────────────────────────────────────────────────────

export interface OpenedSession {
  token: string;
  expiresAt: Date;
}

/** Ouvre une session pour une personne, et renvoie le jeton à poser en cookie. */
export async function openSession(
  personId: string,
  userAgent: string | null,
  now: Date = new Date(),
): Promise<OpenedSession> {
  const issued = createSessionToken(now);

  await db().insert(ctoSessions).values({
    personId,
    tokenHash: issued.tokenHash,
    expiresAt: issued.expiresAt,
    lastSeenAt: now,
    userAgent: userAgent?.slice(0, 400) ?? null,
  });

  return { token: issued.token, expiresAt: issued.expiresAt };
}

/**
 * Les personnes joignables d'un accompagnement.
 *
 * Les révoquées sont exclues : quelqu'un qui a quitté l'entreprise cliente ne
 * doit plus rien recevoir, pas même une notification qui ne dit rien du
 * contenu. C'est le même geste d'offboarding que pour l'accès, appliqué au
 * courrier.
 */
export async function activePersons(
  clientId: string,
): Promise<{ id: string; email: string; name: string }[]> {
  return db()
    .select({ id: ctoPersons.id, email: ctoPersons.email, name: ctoPersons.name })
    .from(ctoPersons)
    .where(and(eq(ctoPersons.clientId, clientId), isNull(ctoPersons.revokedAt)));
}

/**
 * Les personnes d'un accompagnement à accueillir : actives, jamais invitées,
 * sans session ni passkey. Les deux dernières conditions protègent une
 * personne entrée par l'écran de connexion sans être passée par l'invitation.
 */
export async function personsToWelcome(
  clientId: string,
): Promise<{ id: string; email: string; name: string }[]> {
  return db()
    .select({ id: ctoPersons.id, email: ctoPersons.email, name: ctoPersons.name })
    .from(ctoPersons)
    .where(
      and(
        eq(ctoPersons.clientId, clientId),
        isNull(ctoPersons.revokedAt),
        isNull(ctoPersons.invitedAt),
        sql`not exists (select 1 from ${ctoSessions} where ${ctoSessions.personId} = ${ctoPersons.id})`,
        sql`not exists (select 1 from ${ctoCredentials} where ${ctoCredentials.personId} = ${ctoPersons.id})`,
      ),
    );
}

/** Marque une personne comme invitée : bienvenue ou invitation manuelle. */
export async function markInvited(personId: string, now: Date = new Date()): Promise<void> {
  await db().update(ctoPersons).set({ invitedAt: now }).where(eq(ctoPersons.id, personId));
}

export interface ResolvedSession {
  sessionId: string;
  person: Person;
  decision: AccessDecision;
}

/**
 * Résout un cookie de session en identité.
 *
 * Quatre contrôles, dans cet ordre, et aucun n'est facultatif : la ligne existe,
 * elle n'est pas révoquée, elle n'est pas échue, et la personne comme
 * l'accompagnement autorisent encore l'accès. Le dernier est celui qui rend
 * « mettre en pause » et « clore » instantanés.
 *
 * Effet de bord assumé : l'échéance est repoussée et `last_seen_at` mis à jour,
 * au plus une fois par heure (cf. `shouldSlide`). C'est ce qui fait qu'un client
 * qui passe une fois par mois n'est jamais déconnecté.
 */
export async function resolveSession(
  token: string | null | undefined,
  now: Date = new Date(),
): Promise<ResolvedSession | null> {
  if (!token) return null;

  const [row] = await db()
    .select({
      sessionId: ctoSessions.id,
      expiresAt: ctoSessions.expiresAt,
      revokedAt: ctoSessions.revokedAt,
      person: personSelection(),
    })
    .from(ctoSessions)
    .innerJoin(ctoPersons, eq(ctoSessions.personId, ctoPersons.id))
    .innerJoin(ctoClients, eq(ctoPersons.clientId, ctoClients.id))
    .where(eq(ctoSessions.tokenHash, hashToken(token)))
    .limit(1);

  if (!row) return null;
  if (row.revokedAt) return null;
  if (row.expiresAt.getTime() <= now.getTime()) return null;
  if (row.person.revokedAt) return null;

  const decision = accessDecision(row.person.status as ClientStatus);
  if (!decision.allowed) return null;

  if (shouldSlide(row.expiresAt, now)) {
    await db()
      .update(ctoSessions)
      .set({ expiresAt: new Date(now.getTime() + SESSION_TTL_MS), lastSeenAt: now })
      .where(eq(ctoSessions.id, row.sessionId));
  }

  const { revokedAt: _revoked, ...person } = row.person;

  return { sessionId: row.sessionId, person: person as Person, decision };
}

/** Ferme la session courante (déconnexion volontaire). */
export async function closeSession(token: string | null | undefined): Promise<void> {
  if (!token) return;
  await db().delete(ctoSessions).where(eq(ctoSessions.tokenHash, hashToken(token)));
}

export interface SessionRow {
  id: string;
  userAgent: string | null;
  lastSeenAt: Date;
  createdAt: Date;
  current: boolean;
}

/** Les appareils actuellement connectés pour une personne. */
export async function listSessions(
  personId: string,
  currentToken: string | null | undefined,
  now: Date = new Date(),
): Promise<SessionRow[]> {
  const currentHash = currentToken ? hashToken(currentToken) : null;

  const rows = await db()
    .select({
      id: ctoSessions.id,
      tokenHash: ctoSessions.tokenHash,
      userAgent: ctoSessions.userAgent,
      lastSeenAt: ctoSessions.lastSeenAt,
      createdAt: ctoSessions.createdAt,
    })
    .from(ctoSessions)
    .where(
      and(
        eq(ctoSessions.personId, personId),
        isNull(ctoSessions.revokedAt),
        gte(ctoSessions.expiresAt, now),
      ),
    )
    .orderBy(desc(ctoSessions.lastSeenAt));

  return rows.map(({ tokenHash, ...row }) => ({
    ...row,
    current: currentHash !== null && tokenHash === currentHash,
  }));
}

/**
 * Révoque une session précise.
 *
 * Le filtre sur `personId` n'est pas décoratif : sans lui, connaître
 * l'identifiant d'une session suffirait à déconnecter n'importe qui. Une action
 * serveur est une URL publique, elle ne fait jamais confiance à l'écran qui l'a
 * affichée.
 */
export async function revokeSession(
  sessionId: string,
  personId: string,
  now: Date = new Date(),
): Promise<boolean> {
  const updated = await db()
    .update(ctoSessions)
    .set({ revokedAt: now })
    .where(and(eq(ctoSessions.id, sessionId), eq(ctoSessions.personId, personId)))
    .returning({ id: ctoSessions.id });

  return updated.length > 0;
}

/**
 * Coupe toutes les sessions d'une personne.
 *
 * C'est le geste d'offboarding, et celui qu'on veut avoir sous la main en cas de
 * doute. Appelé aussi lors d'une révocation de personne.
 */
export async function revokeAllSessions(
  personId: string,
  now: Date = new Date(),
): Promise<number> {
  const updated = await db()
    .update(ctoSessions)
    .set({ revokedAt: now })
    .where(and(eq(ctoSessions.personId, personId), isNull(ctoSessions.revokedAt)))
    .returning({ id: ctoSessions.id });

  return updated.length;
}

// ─── Balayage ─────────────────────────────────────────────────────────────

export interface PurgeReport {
  magicLinks: number;
  challenges: number;
  sessions: number;
}

/**
 * Supprime ce qui n'a plus cours : liens échus ou servis, défis expirés,
 * sessions mortes.
 *
 * Rien de tout cela n'est dangereux à conserver ; c'est la page de
 * confidentialité qui l'exige, et une table qui ne fait que grossir finit par
 * rendre la liste des appareils illisible.
 */
export async function purgeExpiredAccess(now: Date = new Date()): Promise<PurgeReport> {
  const links = await db()
    .delete(ctoMagicLinks)
    .where(
      or(lt(ctoMagicLinks.expiresAt, now), sql`${ctoMagicLinks.usedAt} is not null`),
    )
    .returning({ id: ctoMagicLinks.id });

  const challenges = await db()
    .delete(ctoChallenges)
    .where(lt(ctoChallenges.expiresAt, now))
    .returning({ id: ctoChallenges.id });

  const sessions = await db()
    .delete(ctoSessions)
    .where(
      or(lt(ctoSessions.expiresAt, now), sql`${ctoSessions.revokedAt} is not null`),
    )
    .returning({ id: ctoSessions.id });

  return {
    magicLinks: links.length,
    challenges: challenges.length,
    sessions: sessions.length,
  };
}
