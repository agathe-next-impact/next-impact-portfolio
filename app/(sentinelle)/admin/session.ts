import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  adminPassword,
  createSessionToken,
  maxAgeSeconds,
  safeEqual,
  SESSION_COOKIE,
  verifySessionToken,
} from "@sentinelle/admin";

// ─────────────────────────────────────────────────────────────────────────────
// Glue Next de la session admin : cookies et redirections.
//
// Toute la logique (signature, expiration, comparaison à temps constant) vit
// dans `@sentinelle/admin/session`, qui est pur et testé. Ce fichier ne fait que
// la brancher sur la requête — c'est la seule raison de sa non-testabilité.
//
// La garde s'applique dans un **layout serveur** (`sentinelle/layout.tsx`) et
// jamais dans un composant client : une protection qui s'exécute dans le
// navigateur ne protège rien, elle cache.
// ─────────────────────────────────────────────────────────────────────────────

export const LOGIN_PATH = "/admin/login";
export const HOME_PATH = "/admin/sentinelle";

/** Le cookie n'est envoyé que sur /admin : il n'a rien à faire ailleurs. */
const COOKIE_PATH = "/admin";

/** La session est-elle ouverte et valide ? Ne redirige pas. */
export async function hasSession(): Promise<boolean> {
  let password: string;
  try {
    password = adminPassword();
  } catch {
    // Variable absente ou trop courte : personne n'entre. Le message explicite
    // est affiché par la page de connexion, qui, elle, sait s'adresser à un
    // humain.
    return false;
  }

  const token = (await cookies()).get(SESSION_COOKIE)?.value ?? null;
  return verifySessionToken(token, password).valid;
}

/** Exige une session ouverte. Redirige vers la connexion sinon. */
export async function requireSession(): Promise<void> {
  if (!(await hasSession())) redirect(LOGIN_PATH);
}

/**
 * Ouvre une session si le mot de passe est le bon.
 *
 * Le délai en cas d'échec n'est pas un rate limit — il n'en existe pas de fiable
 * en serverless — mais il rend l'essai en ligne coûteux, et il ne coûte rien à
 * l'utilisatrice légitime qui se trompe une fois.
 */
export async function openSession(submitted: string): Promise<boolean> {
  const password = adminPassword();

  if (!safeEqual(submitted, password)) {
    await new Promise((resolve) => setTimeout(resolve, 700));
    return false;
  }

  (await cookies()).set(SESSION_COOKIE, createSessionToken(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: COOKIE_PATH,
    maxAge: maxAgeSeconds(),
  });

  return true;
}

export async function closeSession(): Promise<void> {
  (await cookies()).delete({ name: SESSION_COOKIE, path: COOKIE_PATH });
}

/** Message de configuration à afficher, ou null si tout est en place. */
export function configurationIssue(): string | null {
  try {
    adminPassword();
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : "configuration incomplète";
  }
}
