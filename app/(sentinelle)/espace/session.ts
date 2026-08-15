import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createClientSessionToken,
  magicLinkSecret,
  sessionMaxAgeSeconds,
  verifyClientSessionToken,
  CLIENT_SESSION_COOKIE,
} from "@sentinelle/access";

// ─────────────────────────────────────────────────────────────────────────────
// Glue Next de la session client : cookies et redirections.
//
// Toute la logique (signature, expiration) vit dans `@sentinelle/access`, qui
// est pur et testé. Ce fichier ne fait que la brancher sur la requête — c'est
// la seule raison de sa non-testabilité.
//
// Même discipline que l'admin : la garde s'applique côté serveur, dans la page
// ou l'action, jamais dans un composant client. Et comme une action serveur est
// une URL publique, chaque action revérifie la session pour son propre compte
// plutôt que de faire confiance à l'écran qui l'a affichée.
// ─────────────────────────────────────────────────────────────────────────────

export const ESPACE_PATH = "/espace";

/** Le cookie ne circule que sous /espace : il n'a rien à faire ailleurs. */
const COOKIE_PATH = "/espace";

/** Identifiant du client connecté, ou null. Ne redirige pas. */
export async function currentClientId(): Promise<string | null> {
  let secret: string;
  try {
    secret = magicLinkSecret();
  } catch {
    // Secret absent : personne n'entre. Le message explicite est affiché par la
    // page de connexion, qui, elle, sait s'adresser à un humain.
    return null;
  }

  const token = (await cookies()).get(CLIENT_SESSION_COOKIE)?.value ?? null;
  const check = verifyClientSessionToken(token, secret);

  return check.valid ? check.clientId : null;
}

/** Exige une session ouverte. Renvoie à l'accueil de l'espace sinon. */
export async function requireClientId(): Promise<string> {
  const clientId = await currentClientId();
  if (!clientId) redirect(ESPACE_PATH);
  return clientId;
}

/** Ouvre la session d'un client — appelée après consommation d'un lien magique. */
export async function openClientSession(clientId: string): Promise<void> {
  (await cookies()).set(CLIENT_SESSION_COOKIE, createClientSessionToken(clientId, magicLinkSecret()), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: COOKIE_PATH,
    maxAge: sessionMaxAgeSeconds(),
  });
}

export async function closeClientSession(): Promise<void> {
  (await cookies()).delete({ name: CLIENT_SESSION_COOKIE, path: COOKIE_PATH });
}

/** Message de configuration à afficher, ou null si tout est en place. */
export function configurationIssue(): string | null {
  try {
    magicLinkSecret();
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : "configuration incomplète";
  }
}
