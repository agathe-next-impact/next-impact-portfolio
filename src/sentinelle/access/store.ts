import { and, eq, gte, lt, or, sql } from "drizzle-orm";
import { db } from "@sentinelle/db/client";
import { clients, magicLinks } from "@sentinelle/db/schema";
import { sentinelleBaseUrl } from "@sentinelle/url";
import {
  createMagicToken,
  hashToken,
  magicLinkSecret,
  verifyMagicToken,
  MAGIC_LINK_TTL_MS,
} from "./token";

// ─────────────────────────────────────────────────────────────────────────────
// Émission et consommation des liens de connexion — le côté base.
//
// La logique de jeton est dans `token.ts`, pure et testée. Ici, uniquement ce
// qui a besoin de la base : retrouver un abonné, écrire un condensat, le
// consommer une fois, et refuser poliment quand quelqu'un en demande dix.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Nombre de liens qu'un même abonné peut demander par quart d'heure.
 *
 * Ce n'est pas une protection contre une attaque — il n'existe pas de compteur
 * fiable en serverless, et c'est déjà le constat du rate limit du scanner
 * (plan §2, E5). C'est une protection contre l'usage : un formulaire cliqué
 * cinq fois d'affilée ne doit pas envoyer cinq e-mails, dont quatre annulent
 * l'accès du cinquième dans l'esprit de celui qui les reçoit.
 */
export const MAX_LINKS_PER_WINDOW = 3;
const WINDOW_MS = MAGIC_LINK_TTL_MS;

export interface Recipient {
  id: string;
  email: string;
  name: string;
  active: boolean;
}

/**
 * Retrouve l'abonné derrière une adresse.
 *
 * Renvoie aussi les fiches résiliées : quelqu'un qui a payé six mois a le droit
 * de consulter son espace pendant la fenêtre de réactivation, et c'est là qu'il
 * retrouvera le lien pour se réabonner.
 */
export async function findRecipient(email: string): Promise<Recipient | null> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return null;

  const [row] = await db()
    .select({
      id: clients.id,
      email: clients.email,
      name: clients.name,
      active: clients.active,
    })
    .from(clients)
    .where(eq(sql`lower(${clients.email})`, normalized))
    .limit(1);

  return row ?? null;
}

export type IssueOutcome =
  | { ok: true; url: string; expiresAt: Date }
  | { ok: false; reason: "trop de demandes" };

/**
 * Émet un lien de connexion pour un client.
 *
 * Le jeton n'est jamais journalisé ni renvoyé ailleurs que dans l'URL rendue :
 * il vaut accès. L'appelant l'envoie par e-mail et l'oublie.
 */
export async function issueMagicLink(
  clientId: string,
  now: Date = new Date(),
): Promise<IssueOutcome> {
  const since = new Date(now.getTime() - WINDOW_MS);

  const [{ count }] = await db()
    .select({ count: sql<number>`count(*)::int` })
    .from(magicLinks)
    .where(and(eq(magicLinks.clientId, clientId), gte(magicLinks.createdAt, since)));

  if (count >= MAX_LINKS_PER_WINDOW) return { ok: false, reason: "trop de demandes" };

  const issued = createMagicToken(clientId, magicLinkSecret(), now);

  await db().insert(magicLinks).values({
    clientId,
    tokenHash: issued.tokenHash,
    expiresAt: issued.expiresAt,
  });

  return {
    ok: true,
    url: `${sentinelleBaseUrl()}/espace/connexion?jeton=${encodeURIComponent(issued.token)}`,
    expiresAt: issued.expiresAt,
  };
}

export type ConsumeOutcome =
  | { ok: true; clientId: string }
  | { ok: false; reason: "absent" | "malformé" | "signature" | "expiré" | "consommé" };

/**
 * Consomme un lien : vérifie, puis supprime la ligne.
 *
 * La suppression **conditionnée** (`usedAt is null`) et le compte de lignes
 * rendues font office de verrou : deux requêtes simultanées sur le même jeton,
 * une seule obtient la ligne. C'est la base qui arbitre, pas le code — et c'est
 * ce qui rend l'usage unique vrai même sur deux instances serverless.
 */
export async function consumeMagicLink(
  token: string | null | undefined,
  now: Date = new Date(),
): Promise<ConsumeOutcome> {
  const check = verifyMagicToken(token, magicLinkSecret(), now);
  if (!check.valid) return { ok: false, reason: check.reason };

  const deleted = await db()
    .delete(magicLinks)
    .where(
      and(
        eq(magicLinks.tokenHash, check.tokenHash),
        sql`${magicLinks.usedAt} is null`,
        gte(magicLinks.expiresAt, now),
      ),
    )
    .returning({ clientId: magicLinks.clientId });

  if (deleted.length === 0) return { ok: false, reason: "consommé" };

  return { ok: true, clientId: deleted[0].clientId };
}

/**
 * Supprime les jetons échus ou déjà servis.
 *
 * Appelée par le cron de rétention. La politique (§9 du plan) annonce quinze
 * minutes et une suppression à l'usage : sans ce balayage, les jetons jamais
 * cliqués resteraient indéfiniment — inoffensifs, mais contraires à ce qui est
 * écrit sur la page de confidentialité.
 */
export async function purgeExpiredMagicLinks(now: Date = new Date()): Promise<number> {
  const removed = await db()
    .delete(magicLinks)
    .where(or(lt(magicLinks.expiresAt, now), sql`${magicLinks.usedAt} is not null`))
    .returning({ id: magicLinks.id });

  return removed.length;
}

export { hashToken };
