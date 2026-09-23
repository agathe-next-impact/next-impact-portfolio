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
import { desc, eq } from "drizzle-orm";
import { db } from "../db/client";
import { ctoAdminChallenges, ctoAdminCredentials } from "../db/schema";
import { CHALLENGE_TTL_MS, expectedOrigins, rpId, suggestLabel, RP_NAME } from "@cto/access";
import { ADMIN_EMAIL, ADMIN_NAME, ADMIN_USER_ID } from "./identity";

// ─────────────────────────────────────────────────────────────────────────────
// Passkeys de l'admin : enrôlement et connexion.
//
// Copie réduite de `src/cto/access/passkeys.ts` — même protocole, même choix
// (justificatifs découvrables, vérification de l'utilisateur exigée), sans la
// dimension « plusieurs personnes » : il n'y a ici qu'une identité fixe
// (`identity.ts`), donc pas de vérification « ce défi appartient-il à la bonne
// personne » — un défi de cette table appartient forcément à la seule identité
// qui peut en émettre un, puisque l'enrôlement exige déjà une session ouverte.
// ─────────────────────────────────────────────────────────────────────────────

/** Hygiène de liste, comme côté client : une seule identité, mais plusieurs appareils. */
export const MAX_CREDENTIALS = 10;

function toBase64Url(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64url");
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const decoded = Buffer.from(value, "base64url");
  const bytes = new Uint8Array(new ArrayBuffer(decoded.byteLength));
  bytes.set(decoded);
  return bytes;
}

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
  now: Date,
): Promise<string> {
  const [row] = await db()
    .insert(ctoAdminChallenges)
    .values({ challenge, kind, expiresAt: new Date(now.getTime() + CHALLENGE_TTL_MS) })
    .returning({ id: ctoAdminChallenges.id });

  return row.id;
}

async function takeChallenge(
  challengeId: string,
  kind: "registration" | "authentication",
  now: Date,
): Promise<{ challenge: string } | null> {
  const deleted = await db()
    .delete(ctoAdminChallenges)
    .where(eq(ctoAdminChallenges.id, challengeId))
    .returning({ challenge: ctoAdminChallenges.challenge, kind: ctoAdminChallenges.kind, expiresAt: ctoAdminChallenges.expiresAt });

  const row = deleted[0];
  if (!row || row.kind !== kind) return null;
  if (row.expiresAt.getTime() <= now.getTime()) return null;

  return { challenge: row.challenge };
}

// ─── Enrôlement ───────────────────────────────────────────────────────────

export interface RegistrationStart {
  challengeId: string;
  options: Awaited<ReturnType<typeof generateRegistrationOptions>>;
}

/** Prépare l'enrôlement d'une nouvelle passkey. Route appelante déjà protégée par session. */
export async function startAdminRegistration(now: Date = new Date()): Promise<RegistrationStart> {
  const existing = await db()
    .select({ credentialId: ctoAdminCredentials.credentialId, transports: ctoAdminCredentials.transports })
    .from(ctoAdminCredentials);

  const options = await generateRegistrationOptions({
    rpName: RP_NAME,
    rpID: rpId(),
    userName: ADMIN_EMAIL,
    userDisplayName: ADMIN_NAME,
    userID: toBytes(ADMIN_USER_ID),
    attestationType: "none",
    excludeCredentials: existing.map((row) => ({
      id: row.credentialId,
      transports: parseTransports(row.transports),
    })),
    authenticatorSelection: { residentKey: "required", userVerification: "required" },
  });

  const challengeId = await storeChallenge(options.challenge, "registration", now);

  return { challengeId, options };
}

export type RegistrationOutcome =
  | { ok: true; credentialId: string; label: string }
  | { ok: false; reason: string };

/** Vérifie et enregistre une nouvelle passkey admin. */
export async function finishAdminRegistration(
  challengeId: string,
  response: RegistrationResponseJSON,
  now: Date = new Date(),
): Promise<RegistrationOutcome> {
  const pending = await takeChallenge(challengeId, "registration", now);
  if (!pending) return { ok: false, reason: "Demande expirée. Recommencez." };

  const count = await db().select({ total: ctoAdminCredentials.id }).from(ctoAdminCredentials);
  if (count.length >= MAX_CREDENTIALS) {
    return {
      ok: false,
      reason: `Vous avez déjà ${MAX_CREDENTIALS} appareils enregistrés. Supprimez-en un avant d'en ajouter.`,
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
    console.error("[cto] enrôlement de passkey admin refusé", error);
    return { ok: false, reason: "Cet appareil n'a pas pu être vérifié." };
  }

  if (!verification.verified || !verification.registrationInfo) {
    return { ok: false, reason: "Cet appareil n'a pas pu être vérifié." };
  }

  const { credential, aaguid } = verification.registrationInfo;
  const transports = credential.transports ?? [];
  const label = suggestLabel(aaguid, transports);

  await db().insert(ctoAdminCredentials).values({
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

export async function startAdminAuthentication(now: Date = new Date()): Promise<AuthenticationStart> {
  const options = await generateAuthenticationOptions({ rpID: rpId(), userVerification: "required" });
  const challengeId = await storeChallenge(options.challenge, "authentication", now);

  return { challengeId, options };
}

export type AuthenticationOutcome = { ok: true; label: string } | { ok: false; reason: string };

export async function finishAdminAuthentication(
  challengeId: string,
  response: AuthenticationResponseJSON,
  now: Date = new Date(),
): Promise<AuthenticationOutcome> {
  const pending = await takeChallenge(challengeId, "authentication", now);
  if (!pending) return { ok: false, reason: "Demande expirée. Recommencez." };

  const [row] = await db()
    .select({
      id: ctoAdminCredentials.id,
      credentialId: ctoAdminCredentials.credentialId,
      publicKey: ctoAdminCredentials.publicKey,
      counter: ctoAdminCredentials.counter,
      transports: ctoAdminCredentials.transports,
      label: ctoAdminCredentials.label,
    })
    .from(ctoAdminCredentials)
    .where(eq(ctoAdminCredentials.credentialId, response.id))
    .limit(1);

  if (!row) return { ok: false, reason: "Cet appareil n'est pas reconnu." };

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
    console.error("[cto] connexion par passkey admin refusée", error);
    return { ok: false, reason: "Cet appareil n'a pas pu être vérifié." };
  }

  if (!verification.verified) return { ok: false, reason: "Cet appareil n'a pas pu être vérifié." };

  await db()
    .update(ctoAdminCredentials)
    .set({ counter: verification.authenticationInfo.newCounter, lastUsedAt: now })
    .where(eq(ctoAdminCredentials.id, row.id));

  return { ok: true, label: row.label };
}

// ─── Liste ────────────────────────────────────────────────────────────────

export interface AdminCredentialRow {
  id: string;
  label: string;
  createdAt: Date;
  lastUsedAt: Date | null;
}

/**
 * Les appareils enregistrés. Lecture seule, à dessein : renommer ou
 * supprimer une passkey admin reste un geste SQL délibéré, comme toute autre
 * écriture de cet espace de supervision (voir `src/cto/admin/overview.ts`) —
 * il n'y a qu'un appareil ou deux à gérer, jamais une liste à faire défiler.
 */
export async function listAdminCredentials(): Promise<AdminCredentialRow[]> {
  return db()
    .select({ id: ctoAdminCredentials.id, label: ctoAdminCredentials.label, createdAt: ctoAdminCredentials.createdAt, lastUsedAt: ctoAdminCredentials.lastUsedAt })
    .from(ctoAdminCredentials)
    .orderBy(desc(ctoAdminCredentials.createdAt));
}
