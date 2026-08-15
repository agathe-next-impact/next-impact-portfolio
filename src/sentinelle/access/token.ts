import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

// ─────────────────────────────────────────────────────────────────────────────
// Lien magique — l'unique porte d'entrée de l'espace client.
//
// Pas de mot de passe, et ce n'est pas une facilité : un abonné se connecte
// quelques fois par an, un mot de passe de plus serait oublié, réutilisé, ou
// noté quelque part. La possession de la boîte e-mail est déjà ce qui permet
// de réinitialiser n'importe quel mot de passe ; autant s'en tenir là.
//
// Trois propriétés, et ce qui les porte :
//
//  1. **Vérifiable sans la base.** Le jeton contient l'identifiant du client et
//     sa date d'expiration, signés en HMAC. Un jeton forgé, tronqué ou périmé
//     est rejeté avant toute requête — une URL au hasard ne coûte pas un aller
//     en base.
//  2. **Inutilisable depuis une base lue.** Seul le condensat SHA-256 est
//     stocké. Une fuite de la table `magic_links` ne donne aucun accès.
//  3. **À usage unique.** La ligne disparaît à la consommation. C'est la base
//     qui porte cette garantie, pas la signature : un jeton signé reste
//     valide tant qu'il n'est pas expiré, seule la disparition de sa ligne le
//     rend inopérant.
//
// Module pur : ni base, ni cookie, ni requête. La glue vit dans `store.ts` (base)
// et `app/(sentinelle)/espace/` (cookies, redirections).
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Quinze minutes. Assez pour ouvrir sa boîte et cliquer, trop court pour qu'un
 * lien oublié dans un historique ou transféré par erreur serve encore.
 */
export const MAGIC_LINK_TTL_MS = 15 * 60 * 1000;

/**
 * Longueur minimale du secret de signature.
 *
 * Ce secret protège l'accès à toutes les fiches clientes : il se génère au
 * hasard, il ne se choisit pas. Trop court, le module refuse de démarrer plutôt
 * que de signer avec quelque chose de devinable.
 */
export const MIN_SECRET_LENGTH = 24;

/** Préfixe signé — une signature de lien ne doit pas valoir signature de session. */
const DOMAIN = "sentinelle-magic-link-v1";

export type AccessEnv = Record<string, string | undefined>;

/**
 * Secret de signature, lu dans l'environnement.
 *
 * Lève si la variable manque ou est trop courte. Conséquence assumée : sans
 * `MAGIC_LINK_SECRET`, l'espace client ne s'ouvre pas du tout — plutôt que de
 * s'ouvrir avec une clé de repli, ce qui reviendrait à ne pas en avoir.
 *
 * Corollaire utile : changer ce secret invalide d'un coup tous les liens et
 * toutes les sessions en cours, sans rien toucher en base.
 */
export function magicLinkSecret(env: AccessEnv = process.env): string {
  const value = env.MAGIC_LINK_SECRET?.trim();

  if (!value) {
    throw new Error(
      "MAGIC_LINK_SECRET manquante. Renseignez-la dans .env.local (voir .env.example) : " +
        `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`,
    );
  }

  if (value.length < MIN_SECRET_LENGTH) {
    throw new Error(
      `MAGIC_LINK_SECRET trop courte (${value.length} caractères, ${MIN_SECRET_LENGTH} minimum). ` +
        "Ce secret protège l'accès à toutes les fiches clientes : il se génère, il ne se choisit pas.",
    );
  }

  return value;
}

/** Comparaison à temps constant — sur une signature, `===` fuit le préfixe. */
function safeEqual(a: string, b: string): boolean {
  const digest = (value: string) =>
    createHmac("sha256", DOMAIN).update(Buffer.from(value, "utf8")).digest();

  return timingSafeEqual(digest(a), digest(b));
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(`${DOMAIN}:${payload}`).digest("hex");
}

/**
 * Condensat stocké en base.
 *
 * SHA-256 nu, sans sel : le jeton est déjà 144 bits d'aléa, un sel n'ajouterait
 * rien contre une attaque par dictionnaire qui n'a pas de dictionnaire.
 */
export function hashToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export interface IssuedToken {
  /** Le jeton à mettre dans l'URL. N'existe qu'ici et dans l'e-mail. */
  token: string;
  /** Ce qui va en base. */
  tokenHash: string;
  expiresAt: Date;
}

/**
 * Fabrique un jeton pour un client.
 *
 * Le nonce n'est pas décoratif : sans lui, deux liens demandés dans la même
 * milliseconde pour le même client seraient identiques, et l'index unique sur
 * le condensat ferait échouer le second.
 */
export function createMagicToken(
  clientId: string,
  secret: string,
  now: Date = new Date(),
  ttlMs: number = MAGIC_LINK_TTL_MS,
): IssuedToken {
  const expiresAt = now.getTime() + ttlMs;
  const nonce = randomBytes(18).toString("base64url");
  const payload = `${clientId}.${expiresAt}.${nonce}`;
  const token = `${payload}.${sign(payload, secret)}`;

  return { token, tokenHash: hashToken(token), expiresAt: new Date(expiresAt) };
}

export type TokenCheck =
  | { valid: true; clientId: string; expiresAt: Date; tokenHash: string }
  | { valid: false; reason: "absent" | "malformé" | "signature" | "expiré" };

/**
 * Vérifie un jeton hors ligne : forme, signature, expiration.
 *
 * Ne dit pas si le jeton a déjà servi — ça, seule la base le sait. Ne lève
 * jamais : un lien périmé est un cas normal, pas une panne.
 */
export function verifyMagicToken(
  token: string | null | undefined,
  secret: string,
  now: Date = new Date(),
): TokenCheck {
  if (!token) return { valid: false, reason: "absent" };

  const parts = token.split(".");
  if (parts.length !== 4) return { valid: false, reason: "malformé" };

  const [clientId, rawExpiry, nonce, signature] = parts;
  const expiresAt = Number.parseInt(rawExpiry, 10);

  if (!clientId || !nonce || !signature || !Number.isSafeInteger(expiresAt)) {
    return { valid: false, reason: "malformé" };
  }

  // La signature se vérifie avant l'expiration : sinon un jeton forgé avec une
  // date passée recevrait la réponse « expiré », qui dit qu'il a été valide.
  if (!safeEqual(signature, sign(`${clientId}.${expiresAt}.${nonce}`, secret))) {
    return { valid: false, reason: "signature" };
  }

  if (expiresAt <= now.getTime()) return { valid: false, reason: "expiré" };

  return {
    valid: true,
    clientId,
    expiresAt: new Date(expiresAt),
    tokenHash: hashToken(token),
  };
}

/** Message affichable pour chaque motif de refus — jamais de code technique. */
export const TOKEN_REFUSAL: Record<
  Exclude<TokenCheck, { valid: true }>["reason"] | "consommé",
  string
> = {
  absent: "Ce lien est incomplet. Demandez-en un nouveau ci-dessous.",
  malformé:
    "Ce lien a été abîmé en chemin — certains logiciels de messagerie coupent les adresses longues. Demandez-en un nouveau ci-dessous.",
  signature: "Ce lien n'est pas valide. Demandez-en un nouveau ci-dessous.",
  expiré:
    "Ce lien a expiré : il ne vaut que quinze minutes. Demandez-en un nouveau ci-dessous, il arrive tout de suite.",
  consommé:
    "Ce lien a déjà servi. Chaque lien ne fonctionne qu'une fois — demandez-en un nouveau ci-dessous.",
};
