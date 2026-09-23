import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { accessSecret, sessionMaxAgeSeconds } from "@cto/access";
import { closeAdminSession, openAdminSession, resolveAdminSession, type ResolvedAdminSession } from "@cto/admin";

// ─────────────────────────────────────────────────────────────────────────────
// Glue Next de la session admin : cookies et redirections.
//
// Toute la logique (jetons, expiration, glissement) vit dans `@cto/admin`, qui
// s'appuie sur les primitives pures et testées de `@cto/access` — voir
// `src/cto/admin/store.ts`. Ce fichier ne fait que la brancher sur la requête.
//
// La garde s'applique dans un **layout serveur** (`pilotage/layout.tsx`) et
// jamais dans un composant client : une protection qui s'exécute dans le
// navigateur ne protège rien, elle cache.
// ─────────────────────────────────────────────────────────────────────────────

export const LOGIN_PATH = "/admin-cto/connexion";
export const HOME_PATH = "/admin-cto/pilotage";

/** Préfixe `__Secure-` en production, comme le cookie de l'espace client. */
const SESSION_COOKIE = process.env.NODE_ENV === "production" ? "__Secure-cto_admin" : "cto_admin";

/** Le cookie ne circule que sous l'admin : il n'a rien à faire ailleurs. */
const COOKIE_PATH = "/admin-cto";

export async function sessionToken(): Promise<string | null> {
  return (await cookies()).get(SESSION_COOKIE)?.value ?? null;
}

/**
 * La session courante, ou null.
 *
 * Interroge la base à chaque appel : c'est ce qui rend une révocation (faire
 * tourner `CTO_ACCESS_SECRET` ne suffit pas ici, voir plus bas) effective
 * immédiatement plutôt qu'à l'expiration du cookie.
 */
export async function currentSession(): Promise<ResolvedAdminSession | null> {
  const token = await sessionToken();
  if (!token) return null;

  try {
    return await resolveAdminSession(token);
  } catch (error) {
    console.error("[cto] résolution de session admin impossible", error);
    return null;
  }
}

/** La session est-elle ouverte et valide ? Ne redirige pas. */
export async function hasSession(): Promise<boolean> {
  return (await currentSession()) !== null;
}

/** Exige une session ouverte. Redirige vers la connexion sinon. */
export async function requireSession(): Promise<void> {
  if (!(await currentSession())) redirect(LOGIN_PATH);
}

/**
 * Ouvre une session et rend le cookie à poser, sans le poser lui-même.
 *
 * Séparation nécessaire, comme côté client : Next n'autorise l'écriture d'un
 * cookie que dans une action serveur ou un Route Handler, jamais pendant le
 * rendu d'une page.
 */
export async function openSessionCookie(): Promise<{
  name: string;
  value: string;
  options: { httpOnly: true; sameSite: "lax"; secure: boolean; path: string; maxAge: number };
}> {
  const userAgent = (await headers()).get("user-agent");
  const session = await openAdminSession(userAgent);

  return {
    name: SESSION_COOKIE,
    value: session.token,
    options: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: COOKIE_PATH,
      maxAge: sessionMaxAgeSeconds(),
    },
  };
}

/** Ouvre une session et pose le cookie sur la requête courante (action serveur ou Route Handler). */
export async function startSession(): Promise<void> {
  const cookie = await openSessionCookie();
  (await cookies()).set(cookie.name, cookie.value, cookie.options);
}

export async function closeSession(): Promise<void> {
  const token = await sessionToken();
  await closeAdminSession(token);
  (await cookies()).delete({ name: SESSION_COOKIE, path: COOKIE_PATH });
}

/** Message de configuration à afficher, ou null si tout est en place. */
export function configurationIssue(): string | null {
  try {
    accessSecret();
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : "configuration incomplète";
  }
}
