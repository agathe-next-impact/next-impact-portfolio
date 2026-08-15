import { createHmac, timingSafeEqual } from "node:crypto";

// ─────────────────────────────────────────────────────────────────────────────
// Session de l'admin Sentinelle.
//
// Un seul utilisateur, un seul mot de passe : pas de table d'utilisateurs, pas
// de librairie d'authentification. Ce qui suit est le minimum honnête pour que
// la file de validation ne soit pas ouverte à tous les vents.
//
// Trois décisions, et leurs raisons :
//
//  1. **Le cookie ne contient jamais le mot de passe.** Il porte une date
//     d'expiration et sa signature HMAC, clé = le mot de passe. Un cookie volé
//     expire donc tout seul, et changer le mot de passe invalide d'un coup
//     toutes les sessions ouvertes — sans rien stocker en base.
//  2. **Toutes les comparaisons sont à temps constant.** Comparer deux chaînes
//     avec `===` fuit leur préfixe commun ; sur un secret, c'est une fuite.
//  3. **Le mot de passe est refusé s'il est court.** Il n'y a ni verrouillage de
//     compte ni compteur d'essais utilisable en serverless (une instance par
//     lambda ne compte rien — c'est le même constat que pour le rate limit du
//     scanner, voir plan §2 E5). La seule défense qui tienne contre un essai
//     répété, c'est la longueur du secret. `MIN_PASSWORD_LENGTH` est donc une
//     règle, pas un conseil.
//
// Module pur : il ne lit ni cookie ni requête. La glue Next (`cookies()`,
// redirections) vit dans `app/(sentinelle)/admin/` — c'est ce qui permet de
// tester la logique de session sans serveur.
// ─────────────────────────────────────────────────────────────────────────────

export const SESSION_COOKIE = "sentinelle_admin";

/** Douze heures : une journée de relecture, pas plus. */
export const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

/**
 * Longueur minimale du mot de passe d'admin.
 *
 * 16 caractères aléatoires, c'est ce qui rend un essai en ligne sans objet.
 * Un mot de passe plus court fait échouer le démarrage de l'admin plutôt que de
 * protéger à moitié.
 */
export const MIN_PASSWORD_LENGTH = 16;

/** Préfixe signé — évite qu'une signature serve à autre chose un jour. */
const DOMAIN = "sentinelle-admin-v1";

export type AdminEnv = Record<string, string | undefined>;

/**
 * Mot de passe attendu, lu dans l'environnement.
 *
 * Lève si la variable manque ou est trop courte : une admin sans mot de passe
 * ne doit pas démarrer « ouverte », elle doit tomber.
 */
export function adminPassword(env: AdminEnv = process.env): string {
  const value = env.SENTINELLE_ADMIN_PASSWORD?.trim();

  if (!value) {
    throw new Error(
      "SENTINELLE_ADMIN_PASSWORD manquante. Renseignez-la dans .env.local (voir .env.example).",
    );
  }

  if (value.length < MIN_PASSWORD_LENGTH) {
    throw new Error(
      `SENTINELLE_ADMIN_PASSWORD trop courte (${value.length} caractères, ${MIN_PASSWORD_LENGTH} minimum). ` +
        "Aucun compteur d'essais n'est possible en serverless : la longueur est la seule protection.",
    );
  }

  return value;
}

/** Comparaison à temps constant de deux chaînes, longueurs comprises. */
export function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");

  // `timingSafeEqual` exige des longueurs égales — comparer les longueurs
  // d'abord fuiterait l'information. On hache donc les deux côtés : deux
  // condensats font toujours la même taille.
  const digest = (value: Buffer) => createHmac("sha256", DOMAIN).update(value).digest();

  return timingSafeEqual(digest(left), digest(right));
}

function sign(expiresAt: number, password: string): string {
  return createHmac("sha256", password).update(`${DOMAIN}:${expiresAt}`).digest("hex");
}

/**
 * Jeton de session : `expiration.signature`.
 *
 * L'expiration voyage en clair — elle n'est pas un secret — mais elle est
 * signée : la modifier invalide le jeton.
 */
export function createSessionToken(
  password: string,
  now: Date = new Date(),
  ttlMs: number = SESSION_TTL_MS,
): string {
  const expiresAt = now.getTime() + ttlMs;
  return `${expiresAt}.${sign(expiresAt, password)}`;
}

export type SessionCheck =
  | { valid: true; expiresAt: Date }
  | { valid: false; reason: "absent" | "malformé" | "expiré" | "signature" };

/** Vérifie un jeton. Ne lève jamais : une session invalide est un cas normal. */
export function verifySessionToken(
  token: string | null | undefined,
  password: string,
  now: Date = new Date(),
): SessionCheck {
  if (!token) return { valid: false, reason: "absent" };

  const separator = token.indexOf(".");
  if (separator <= 0) return { valid: false, reason: "malformé" };

  const expiresAt = Number.parseInt(token.slice(0, separator), 10);
  const signature = token.slice(separator + 1);
  if (!Number.isSafeInteger(expiresAt) || signature.length === 0) {
    return { valid: false, reason: "malformé" };
  }

  // La signature se vérifie avant l'expiration : sans quoi un jeton forgé avec
  // une date passée recevrait la réponse « expiré », qui dit qu'il était valide.
  if (!safeEqual(signature, sign(expiresAt, password))) {
    return { valid: false, reason: "signature" };
  }

  if (expiresAt <= now.getTime()) return { valid: false, reason: "expiré" };

  return { valid: true, expiresAt: new Date(expiresAt) };
}

/** Durée de vie restante d'un jeton, en secondes — pour l'attribut `Max-Age`. */
export function maxAgeSeconds(ttlMs: number = SESSION_TTL_MS): number {
  return Math.floor(ttlMs / 1000);
}
