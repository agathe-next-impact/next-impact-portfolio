import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import type {
  AuthenticationResponseJSON,
  AuthenticatorTransportFuture,
  RegistrationResponseJSON,
} from "@simplewebauthn/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "../db/client";
import { ctoChallenges, ctoCredentials, ctoPersons } from "../db/schema";
import { CHALLENGE_TTL_MS } from "./token";
import { expectedOrigins, rpId, suggestLabel, RP_NAME } from "./webauthn";

// ─────────────────────────────────────────────────────────────────────────────
// Passkeys : enrôlement et connexion.
//
// Le protocole se joue en deux temps, et le serveur doit se souvenir du premier
// pour valider le second. D'où la table des défis : sans elle, une réponse
// capturée pourrait être rejouée indéfiniment.
//
// Deux choix qui commandent l'expérience :
//
//  1. **Justificatifs découvrables** (`residentKey: "required"`). C'est ce qui
//     permet au client de cliquer « Se connecter » et de choisir sa passkey sans
//     avoir saisi son adresse. Sans cela il faudrait d'abord identifier la
//     personne pour lui proposer ses justificatifs, et la connexion en un clic
//     disparaîtrait.
//  2. **Vérification de l'utilisateur exigée** (`userVerification: "required"`).
//     L'appareil demande le visage, l'empreinte ou le code. Sur un espace qui
//     porte des contrats et des budgets, un téléphone déverrouillé posé sur une
//     table ne doit pas suffire.
// ─────────────────────────────────────────────────────────────────────────────

/** Nombre maximum de passkeys par personne. Hygiène de liste, pas sécurité. */
export const MAX_CREDENTIALS_PER_PERSON = 10;

function toBase64Url(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64url");
}

/**
 * Décodage base64url vers un tampon adossé à un ArrayBuffer PROPRE.
 *
 * `new Uint8Array(Buffer.from(...))` partagerait le tampon interne de Node, dont
 * le type est `ArrayBufferLike` — la bibliothèque, elle, attend un `ArrayBuffer`.
 * On recopie donc dans un tampon neuf : c'est aussi plus sûr, un Buffer de Node
 * étant une vue sur un pool réutilisé.
 */
function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const decoded = Buffer.from(value, "base64url");
  const bytes = new Uint8Array(new ArrayBuffer(decoded.byteLength));
  bytes.set(decoded);
  return bytes;
}

/** Même précaution pour l'identifiant transmis à l'authentificateur. */
function toBytes(value: string): Uint8Array<ArrayBuffer> {
  const encoded = Buffer.from(value, "utf8");
  const bytes = new Uint8Array(new ArrayBuffer(encoded.byteLength));
  bytes.set(encoded);
  return bytes;
}

function parseTransports(value: string | null): AuthenticatorTransportFuture[] {
  if (!value) return [];
  return value.split(",").filter(Boolean) as AuthenticatorTransportFuture[];
}

async function storeChallenge(
  challenge: string,
  kind: "registration" | "authentication",
  personId: string | null,
  now: Date,
): Promise<string> {
  const [row] = await db()
    .insert(ctoChallenges)
    .values({
      personId,
      challenge,
      kind,
      expiresAt: new Date(now.getTime() + CHALLENGE_TTL_MS),
    })
    .returning({ id: ctoChallenges.id });

  return row.id;
}

/**
 * Récupère un défi ET le supprime.
 *
 * La suppression est ce qui rend le défi à usage unique : la vérification
 * échouerait de toute façon une seconde fois, mais autant que la table le dise.
 */
async function takeChallenge(
  challengeId: string,
  kind: "registration" | "authentication",
  now: Date,
): Promise<{ challenge: string; personId: string | null } | null> {
  const deleted = await db()
    .delete(ctoChallenges)
    .where(and(eq(ctoChallenges.id, challengeId), eq(ctoChallenges.kind, kind)))
    .returning({
      challenge: ctoChallenges.challenge,
      personId: ctoChallenges.personId,
      expiresAt: ctoChallenges.expiresAt,
    });

  const row = deleted[0];
  if (!row) return null;
  if (row.expiresAt.getTime() <= now.getTime()) return null;

  return { challenge: row.challenge, personId: row.personId };
}

// ─── Enrôlement ───────────────────────────────────────────────────────────

export interface RegistrationStart {
  challengeId: string;
  options: Awaited<ReturnType<typeof generateRegistrationOptions>>;
}

/**
 * Prépare l'enrôlement d'une nouvelle passkey pour une personne déjà connectée.
 *
 * `excludeCredentials` évite qu'un appareil déjà enrôlé se réinscrive en double :
 * le navigateur affiche alors « vous avez déjà une clé pour ce site » au lieu de
 * créer une seconde ligne indiscernable de la première.
 */
export async function startRegistration(
  personId: string,
  now: Date = new Date(),
): Promise<RegistrationStart> {
  const [person] = await db()
    .select({ id: ctoPersons.id, email: ctoPersons.email, name: ctoPersons.name })
    .from(ctoPersons)
    .where(eq(ctoPersons.id, personId))
    .limit(1);

  if (!person) throw new Error("Personne inconnue.");

  const existing = await db()
    .select({
      credentialId: ctoCredentials.credentialId,
      transports: ctoCredentials.transports,
    })
    .from(ctoCredentials)
    .where(eq(ctoCredentials.personId, personId));

  const options = await generateRegistrationOptions({
    rpName: RP_NAME,
    rpID: rpId(),
    userName: person.email,
    userDisplayName: person.name,
    // L'identifiant transmis à l'authentificateur est celui de la PERSONNE, pas
    // du client : c'est ce qui permet à trois personnes d'une même entreprise
    // d'enrôler chacune sa passkey sans écraser celle des autres.
    userID: toBytes(person.id),
    attestationType: "none",
    excludeCredentials: existing.map((row) => ({
      id: row.credentialId,
      transports: parseTransports(row.transports),
    })),
    authenticatorSelection: {
      residentKey: "required",
      userVerification: "required",
    },
  });

  const challengeId = await storeChallenge(options.challenge, "registration", personId, now);

  return { challengeId, options };
}

export type RegistrationOutcome =
  | { ok: true; credentialId: string; label: string }
  | { ok: false; reason: string };

/**
 * Vérifie et enregistre une nouvelle passkey.
 *
 * Ce qui est stocké est une clé PUBLIQUE : elle ne permet pas de se connecter,
 * seulement de vérifier une signature. Une fuite de cette table ne donne accès à
 * rien.
 */
export async function finishRegistration(
  personId: string,
  challengeId: string,
  response: RegistrationResponseJSON,
  now: Date = new Date(),
): Promise<RegistrationOutcome> {
  const pending = await takeChallenge(challengeId, "registration", now);
  if (!pending) return { ok: false, reason: "Demande expirée. Recommencez." };

  // Le défi a été émis pour une personne précise : réutiliser celui d'un autre
  // reviendrait à poser sa passkey sur le compte d'un tiers.
  if (pending.personId !== personId) {
    return { ok: false, reason: "Demande invalide." };
  }

  const count = await db()
    .select({ total: ctoCredentials.id })
    .from(ctoCredentials)
    .where(eq(ctoCredentials.personId, personId));

  if (count.length >= MAX_CREDENTIALS_PER_PERSON) {
    return {
      ok: false,
      reason: `Vous avez déjà ${MAX_CREDENTIALS_PER_PERSON} appareils enregistrés. Supprimez-en un avant d'en ajouter.`,
    };
  }

  let verification;
  try {
    verification = await verifyRegistrationResponse({
      response,
      expectedChallenge: pending.challenge,
      expectedOrigin: expectedOrigins(),
      expectedRPID: rpId(),
      requireUserVerification: true,
    });
  } catch (error) {
    console.error("[cto] enrôlement de passkey refusé", error);
    return { ok: false, reason: "Cet appareil n'a pas pu être vérifié." };
  }

  if (!verification.verified || !verification.registrationInfo) {
    return { ok: false, reason: "Cet appareil n'a pas pu être vérifié." };
  }

  const { credential, aaguid } = verification.registrationInfo;
  const transports = credential.transports ?? [];
  const label = suggestLabel(aaguid, transports);

  await db()
    .insert(ctoCredentials)
    .values({
      personId,
      credentialId: credential.id,
      publicKey: toBase64Url(credential.publicKey),
      counter: credential.counter,
      transports: transports.join(",") || null,
      label,
      aaguid: aaguid || null,
    });

  return { ok: true, credentialId: credential.id, label };
}

// ─── Connexion ────────────────────────────────────────────────────────────

export interface AuthenticationStart {
  challengeId: string;
  options: Awaited<ReturnType<typeof generateAuthenticationOptions>>;
}

/**
 * Prépare une connexion.
 *
 * Aucun `allowCredentials` : on ne sait pas encore qui se présente, et c'est
 * volontaire. Le navigateur propose au client les passkeys qu'il détient pour ce
 * domaine, l'identité se déduit ensuite du justificatif rendu. C'est ce qui rend
 * la connexion possible en un clic, sans saisir d'adresse.
 *
 * Effet secondaire appréciable : cet écran ne révèle jamais si une adresse est
 * cliente ou non, puisqu'on n'en demande aucune.
 */
export async function startAuthentication(
  now: Date = new Date(),
): Promise<AuthenticationStart> {
  const options = await generateAuthenticationOptions({
    rpID: rpId(),
    userVerification: "required",
  });

  const challengeId = await storeChallenge(options.challenge, "authentication", null, now);

  return { challengeId, options };
}

export type AuthenticationOutcome =
  | { ok: true; personId: string; label: string }
  | { ok: false; reason: string };

/**
 * Vérifie une connexion par passkey et renvoie la personne reconnue.
 *
 * Le compteur de signatures est remonté à chaque passage : une régression
 * trahirait un clonage. La plupart des passkeys synchronisées renvoient 0 en
 * permanence — le contrôle ne dit alors rien, et c'est le comportement attendu,
 * pas un défaut.
 */
export async function finishAuthentication(
  challengeId: string,
  response: AuthenticationResponseJSON,
  now: Date = new Date(),
): Promise<AuthenticationOutcome> {
  const pending = await takeChallenge(challengeId, "authentication", now);
  if (!pending) return { ok: false, reason: "Demande expirée. Recommencez." };

  const [row] = await db()
    .select({
      id: ctoCredentials.id,
      credentialId: ctoCredentials.credentialId,
      publicKey: ctoCredentials.publicKey,
      counter: ctoCredentials.counter,
      transports: ctoCredentials.transports,
      label: ctoCredentials.label,
      personId: ctoCredentials.personId,
      revokedAt: ctoPersons.revokedAt,
    })
    .from(ctoCredentials)
    .innerJoin(ctoPersons, eq(ctoCredentials.personId, ctoPersons.id))
    .where(eq(ctoCredentials.credentialId, response.id))
    .limit(1);

  if (!row) return { ok: false, reason: "Cet appareil n'est pas reconnu." };

  // Personne révoquée : ses passkeys existent encore en base mais ne valent
  // plus rien. On ne les supprime pas — le journal doit pouvoir dire qu'une
  // tentative a eu lieu après le départ.
  if (row.revokedAt) return { ok: false, reason: "Cet accès a été révoqué." };

  let verification;
  try {
    verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge: pending.challenge,
      expectedOrigin: expectedOrigins(),
      expectedRPID: rpId(),
      requireUserVerification: true,
      credential: {
        id: row.credentialId,
        publicKey: fromBase64Url(row.publicKey),
        counter: row.counter,
        transports: parseTransports(row.transports),
      },
    });
  } catch (error) {
    console.error("[cto] connexion par passkey refusée", error);
    return { ok: false, reason: "Cet appareil n'a pas pu être vérifié." };
  }

  if (!verification.verified) {
    return { ok: false, reason: "Cet appareil n'a pas pu être vérifié." };
  }

  await db()
    .update(ctoCredentials)
    .set({ counter: verification.authenticationInfo.newCounter, lastUsedAt: now })
    .where(eq(ctoCredentials.id, row.id));

  return { ok: true, personId: row.personId, label: row.label };
}

// ─── Gestion des appareils ────────────────────────────────────────────────

export interface CredentialRow {
  id: string;
  label: string;
  createdAt: Date;
  lastUsedAt: Date | null;
}

export async function listCredentials(personId: string): Promise<CredentialRow[]> {
  return db()
    .select({
      id: ctoCredentials.id,
      label: ctoCredentials.label,
      createdAt: ctoCredentials.createdAt,
      lastUsedAt: ctoCredentials.lastUsedAt,
    })
    .from(ctoCredentials)
    .where(eq(ctoCredentials.personId, personId))
    .orderBy(desc(ctoCredentials.createdAt));
}

/** Renomme une passkey. Le filtre sur `personId` empêche de toucher celle d'un autre. */
export async function renameCredential(
  credentialRowId: string,
  personId: string,
  label: string,
): Promise<boolean> {
  const clean = label.trim().slice(0, 60);
  if (!clean) return false;

  const updated = await db()
    .update(ctoCredentials)
    .set({ label: clean })
    .where(and(eq(ctoCredentials.id, credentialRowId), eq(ctoCredentials.personId, personId)))
    .returning({ id: ctoCredentials.id });

  return updated.length > 0;
}

/**
 * Supprime une passkey.
 *
 * On autorise la suppression de la DERNIÈRE, contrairement à ce que font
 * beaucoup de services : le lien de secours reste actif en permanence, donc se
 * retrouver sans passkey n'enferme personne dehors. Interdire ce geste
 * obligerait à garder un appareil perdu dans sa liste, ce qui est exactement
 * l'inverse du but.
 */
export async function deleteCredential(
  credentialRowId: string,
  personId: string,
): Promise<{ deleted: boolean; label: string | null }> {
  const removed = await db()
    .delete(ctoCredentials)
    .where(and(eq(ctoCredentials.id, credentialRowId), eq(ctoCredentials.personId, personId)))
    .returning({ label: ctoCredentials.label });

  return { deleted: removed.length > 0, label: removed[0]?.label ?? null };
}
