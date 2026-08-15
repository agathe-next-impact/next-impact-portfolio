import { createHmac, timingSafeEqual } from "node:crypto";

// ─────────────────────────────────────────────────────────────────────────────
// Session de l'espace client.
//
// Même principe que la session admin (`admin/session.ts`) : le cookie ne porte
// aucun secret, seulement un identifiant, une date d'expiration et leur
// signature. Deux différences, et elles ont des raisons :
//
//  1. **La clé est `MAGIC_LINK_SECRET`, pas un mot de passe.** Il n'y a pas de
//     mot de passe côté client. Conséquence utile : le jour où ce secret
//     tourne, tous les liens et toutes les sessions tombent ensemble.
//  2. **Le préfixe signé diffère de celui du lien magique.** Sans ça, un jeton
//     de lien — qui voyage dans une URL, donc dans des journaux et des
//     historiques — vaudrait cookie de session. Deux usages, deux domaines de
//     signature.
//
// Module pur, testé. La glue Next vit dans `app/(sentinelle)/espace/session.ts`.
// ─────────────────────────────────────────────────────────────────────────────

export const CLIENT_SESSION_COOKIE = "sentinelle_espace";

/**
 * Trente jours. Un abonné consulte son espace rarement : une session de douze
 * heures le renverrait chercher un lien à chaque visite, ce qui finirait par
 * transformer sa boîte e-mail en gestionnaire de mots de passe.
 */
export const CLIENT_SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

const DOMAIN = "sentinelle-espace-v1";

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(`${DOMAIN}:${payload}`).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const digest = (value: string) =>
    createHmac("sha256", DOMAIN).update(Buffer.from(value, "utf8")).digest();

  return timingSafeEqual(digest(a), digest(b));
}

/** Jeton de session : `clientId.expiration.signature`. */
export function createClientSessionToken(
  clientId: string,
  secret: string,
  now: Date = new Date(),
  ttlMs: number = CLIENT_SESSION_TTL_MS,
): string {
  const expiresAt = now.getTime() + ttlMs;
  const payload = `${clientId}.${expiresAt}`;
  return `${payload}.${sign(payload, secret)}`;
}

export type ClientSessionCheck =
  | { valid: true; clientId: string; expiresAt: Date }
  | { valid: false; reason: "absent" | "malformé" | "signature" | "expiré" };

/** Vérifie un cookie de session. Ne lève jamais, ne touche pas la base. */
export function verifyClientSessionToken(
  token: string | null | undefined,
  secret: string,
  now: Date = new Date(),
): ClientSessionCheck {
  if (!token) return { valid: false, reason: "absent" };

  const parts = token.split(".");
  if (parts.length !== 3) return { valid: false, reason: "malformé" };

  const [clientId, rawExpiry, signature] = parts;
  const expiresAt = Number.parseInt(rawExpiry, 10);

  if (!clientId || !signature || !Number.isSafeInteger(expiresAt)) {
    return { valid: false, reason: "malformé" };
  }

  if (!safeEqual(signature, sign(`${clientId}.${expiresAt}`, secret))) {
    return { valid: false, reason: "signature" };
  }

  if (expiresAt <= now.getTime()) return { valid: false, reason: "expiré" };

  return { valid: true, clientId, expiresAt: new Date(expiresAt) };
}

/** Durée de vie en secondes — pour l'attribut `Max-Age` du cookie. */
export function sessionMaxAgeSeconds(ttlMs: number = CLIENT_SESSION_TTL_MS): number {
  return Math.floor(ttlMs / 1000);
}
