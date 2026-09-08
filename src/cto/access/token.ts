import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

// ─────────────────────────────────────────────────────────────────────────────
// Jetons d'accès à l'espace CTO — module PUR (ni base, ni cookie, ni requête).
//
// Deux objets distincts vivent ici, et les confondre est l'erreur classique :
//
//  1. **Le jeton de lien magique.** Courte durée, usage unique, signé. Il voyage
//     dans une URL, donc dans des historiques de navigateur, des journaux de
//     serveur mandataire et des e-mails transférés. Sa signature permet de
//     rejeter un jeton forgé ou périmé SANS toucher la base : une URL au hasard
//     ne coûte pas un aller-retour SQL.
//  2. **Le jeton de session.** Simple aléa de 32 octets, non signé, dont seul le
//     condensat est stocké. Il n'a rien à porter parce que la ligne en base EST
//     l'autorisation : c'est ce qui rend la révocation immédiate possible.
//     Signer un jeton de session le rendrait au contraire irrévocable jusqu'à
//     son échéance, ce qui est précisément le défaut qu'on corrige ici.
//
// Ce module ne partage RIEN avec `src/sentinelle/access/` : ni secret, ni
// préfixe de signature. Une session Sentinelle ne doit jamais valoir session
// CTO, et la rotation d'un secret ne doit pas déconnecter les abonnés de
// l'autre produit.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Quinze minutes. Assez pour ouvrir sa boîte et cliquer, trop court pour qu'un
 * lien oublié dans un historique ou transféré par erreur serve encore.
 */
export const MAGIC_LINK_TTL_MS = 15 * 60 * 1000;

/**
 * Sept jours de session, contre trente chez Sentinelle.
 *
 * L'écart est délibéré et tient au contenu : l'espace CTO porte la cartographie
 * du système, les détenteurs d'accès, les contrats et les budgets. Chez une
 * structure de 20 à 250 salariés, l'adresse du contact est parfois relevée à
 * plusieurs. La session étant GLISSANTE (repoussée à chaque visite), sept jours
 * ne coûtent aucune reconnexion à qui consulte son espace ne serait-ce qu'une
 * fois par semaine, et referment la porte sur un appareil abandonné.
 */
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Marge en deçà de laquelle on ne repousse pas l'échéance d'une session.
 *
 * Sans ce seuil, chaque chargement de page provoquerait une écriture. Avec lui,
 * on écrit au plus une fois par heure et par appareil, et la session reste
 * glissante à l'échelle qui compte (le jour, pas la minute).
 */
export const SESSION_SLIDE_THRESHOLD_MS = 60 * 60 * 1000;

/** Durée de vie d'un défi WebAuthn. Le protocole se joue en quelques secondes. */
export const CHALLENGE_TTL_MS = 5 * 60 * 1000;

/**
 * Longueur minimale du secret de signature.
 *
 * Ce secret protège l'accès à tous les espaces clients : il se génère au hasard,
 * il ne se choisit pas. Trop court, le module refuse de démarrer plutôt que de
 * signer avec quelque chose de devinable.
 */
export const MIN_SECRET_LENGTH = 24;

/** Préfixe signé, propre au lien magique de l'espace CTO. */
const MAGIC_DOMAIN = "cto-magic-link-v1";

export type AccessEnv = Record<string, string | undefined>;

/**
 * Secret de signature des liens, lu dans l'environnement.
 *
 * Lève si la variable manque ou est trop courte. Conséquence assumée : sans
 * `CTO_ACCESS_SECRET`, l'espace ne s'ouvre pas du tout, plutôt que de s'ouvrir
 * avec une clé de repli — ce qui reviendrait à ne pas en avoir.
 *
 * Corollaire utile : changer ce secret invalide d'un coup tous les liens en
 * circulation. Il n'invalide PAS les sessions, qui vivent en base et se
 * révoquent une par une ; c'est la différence de traitement entre les deux
 * objets, et elle est voulue.
 */
export function accessSecret(env: AccessEnv = process.env): string {
  const value = env.CTO_ACCESS_SECRET?.trim();

  if (!value) {
    throw new Error(
      "CTO_ACCESS_SECRET manquante. Renseignez-la dans .env.local (voir .env.example) : " +
        `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`,
    );
  }

  if (value.length < MIN_SECRET_LENGTH) {
    throw new Error(
      `CTO_ACCESS_SECRET trop courte (${value.length} caractères, ${MIN_SECRET_LENGTH} minimum).`,
    );
  }

  return value;
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(`${MAGIC_DOMAIN}:${payload}`).digest("hex");
}

/**
 * Comparaison à temps constant de deux chaînes de longueurs quelconques.
 *
 * `timingSafeEqual` exige des tampons de même taille et fuiterait la longueur ;
 * on compare donc des condensats, toujours de 32 octets.
 */
function safeEqual(a: string, b: string): boolean {
  const digest = (value: string) =>
    createHmac("sha256", MAGIC_DOMAIN).update(Buffer.from(value, "utf8")).digest();

  return timingSafeEqual(digest(a), digest(b));
}

/** Condensat stocké en base. Jamais le jeton lui-même. */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export interface IssuedMagicToken {
  token: string;
  tokenHash: string;
  expiresAt: Date;
}

/**
 * Fabrique un jeton de lien magique : `personId.expiration.aléa.signature`.
 *
 * L'aléa est ce qui rend deux jetons émis dans la même milliseconde pour la même
 * personne différents l'un de l'autre — sans lui, leurs condensats
 * entreraient en collision sur l'index unique et la seconde demande échouerait.
 */
export function createMagicToken(
  personId: string,
  secret: string,
  now: Date = new Date(),
  ttlMs: number = MAGIC_LINK_TTL_MS,
): IssuedMagicToken {
  const expiresAt = new Date(now.getTime() + ttlMs);
  const nonce = randomBytes(16).toString("base64url");
  const payload = `${personId}.${expiresAt.getTime()}.${nonce}`;
  const token = `${payload}.${sign(payload, secret)}`;

  return { token, tokenHash: hashToken(token), expiresAt };
}

export type MagicTokenCheck =
  | { valid: true; personId: string; tokenHash: string; expiresAt: Date }
  | { valid: false; reason: "absent" | "malformé" | "signature" | "expiré" };

/**
 * Vérifie un jeton de lien sans toucher la base.
 *
 * Ne lève jamais : une entrée hostile est une réponse, pas une exception. La
 * vérification hors ligne est le seul rempart bon marché contre quelqu'un qui
 * essaierait des URL au hasard — la base n'est interrogée que pour un jeton dont
 * la signature est déjà bonne.
 */
export function verifyMagicToken(
  token: string | null | undefined,
  secret: string,
  now: Date = new Date(),
): MagicTokenCheck {
  if (!token) return { valid: false, reason: "absent" };

  const parts = token.split(".");
  if (parts.length !== 4) return { valid: false, reason: "malformé" };

  const [personId, rawExpiry, nonce, signature] = parts;
  const payload = `${personId}.${rawExpiry}.${nonce}`;

  if (!safeEqual(signature, sign(payload, secret))) {
    return { valid: false, reason: "signature" };
  }

  const expiresAt = Number(rawExpiry);
  if (!Number.isFinite(expiresAt)) return { valid: false, reason: "malformé" };
  if (expiresAt <= now.getTime()) return { valid: false, reason: "expiré" };

  return {
    valid: true,
    personId,
    tokenHash: hashToken(token),
    expiresAt: new Date(expiresAt),
  };
}

export interface IssuedSession {
  token: string;
  tokenHash: string;
  expiresAt: Date;
}

/**
 * Fabrique un jeton de session : 32 octets d'aléa, rien d'autre.
 *
 * Pas de signature, pas de charge utile, pas d'identifiant lisible. Un jeton
 * volé ne révèle même pas à qui il appartient, et sa validité se décide
 * uniquement par la présence d'une ligne vivante en base.
 */
export function createSessionToken(
  now: Date = new Date(),
  ttlMs: number = SESSION_TTL_MS,
): IssuedSession {
  const token = randomBytes(32).toString("base64url");
  return {
    token,
    tokenHash: hashToken(token),
    expiresAt: new Date(now.getTime() + ttlMs),
  };
}

/**
 * Faut-il repousser l'échéance de cette session ?
 *
 * Vrai seulement si la nouvelle échéance gagnerait plus que le seuil : la
 * session est glissante sans écrire à chaque page.
 */
export function shouldSlide(
  expiresAt: Date,
  now: Date = new Date(),
  ttlMs: number = SESSION_TTL_MS,
  thresholdMs: number = SESSION_SLIDE_THRESHOLD_MS,
): boolean {
  return now.getTime() + ttlMs - expiresAt.getTime() > thresholdMs;
}

/** Échéance en secondes, pour le `maxAge` du cookie. */
export function sessionMaxAgeSeconds(ttlMs: number = SESSION_TTL_MS): number {
  return Math.floor(ttlMs / 1000);
}
