import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  accessSecret,
  closeSession,
  openSession,
  resolveSession,
  sessionMaxAgeSeconds,
  type ResolvedSession,
} from "@cto/access";

// ─────────────────────────────────────────────────────────────────────────────
// Glue Next de la session : cookies, en-têtes, redirections.
//
// Toute la logique vit dans `@cto/access`, qui est pur ou testé. Ce fichier ne
// fait que la brancher sur la requête, ce qui est la seule raison de sa
// non-testabilité.
//
// Discipline, la même que partout dans ce dépôt : la garde s'applique côté
// serveur, dans la page ou dans l'action, jamais dans un composant client. Une
// action serveur est une URL publique — chacune revérifie la session pour son
// propre compte plutôt que de faire confiance à l'écran qui l'a affichée.
// ─────────────────────────────────────────────────────────────────────────────

export const ESPACE_PATH = "/espace-direction";

/**
 * Préfixe `__Secure-` : le navigateur refuse alors d'accepter ce cookie s'il
 * n'arrive pas par HTTPS avec l'attribut Secure. Il est retiré en développement,
 * où l'on sert en clair sur localhost et où le préfixe empêcherait toute
 * connexion.
 */
export const SESSION_COOKIE =
  process.env.NODE_ENV === "production" ? "__Secure-cto_espace" : "cto_espace";

/** Le cookie ne circule que sous l'espace : il n'a rien à faire ailleurs. */
const COOKIE_PATH = ESPACE_PATH;

export async function sessionToken(): Promise<string | null> {
  return (await cookies()).get(SESSION_COOKIE)?.value ?? null;
}

/**
 * La session courante, ou null.
 *
 * Interroge la base à chaque appel, et c'est le but : c'est ce qui rend une
 * révocation, une suspension ou une clôture immédiates plutôt qu'effectives à
 * l'expiration du cookie.
 */
export async function currentSession(): Promise<ResolvedSession | null> {
  const token = await sessionToken();
  if (!token) return null;

  try {
    return await resolveSession(token);
  } catch (error) {
    // Base injoignable : on n'ouvre pas la porte par défaut. L'écran de
    // connexion sait s'adresser à un humain, une exception non rattrapée non.
    console.error("[cto] résolution de session impossible", error);
    return null;
  }
}

/** Exige une session ouverte. Renvoie à l'accueil de l'espace sinon. */
export async function requireSession(): Promise<ResolvedSession> {
  const session = await currentSession();
  if (!session) redirect(ESPACE_PATH);
  return session;
}

/** Ouvre une session et pose le cookie. Appelée après un lien ou une passkey. */
export async function startSession(personId: string): Promise<void> {
  const userAgent = (await headers()).get("user-agent");
  const session = await openSession(personId, userAgent);

  (await cookies()).set(SESSION_COOKIE, session.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: COOKIE_PATH,
    maxAge: sessionMaxAgeSeconds(),
  });
}

/**
 * Ferme la session courante des deux côtés.
 *
 * L'ordre importe peu, mais les deux gestes sont nécessaires : supprimer le
 * cookie sans supprimer la ligne laisserait un jeton valide dans la nature ;
 * supprimer la ligne sans le cookie afficherait un écran de connexion à chaque
 * visite sans jamais expliquer pourquoi.
 */
export async function endSession(): Promise<void> {
  const token = await sessionToken();
  await closeSession(token);
  (await cookies()).delete({ name: SESSION_COOKIE, path: COOKIE_PATH });
}

/**
 * Message de configuration à afficher, ou null si tout est en place.
 *
 * Sans `CTO_ACCESS_SECRET`, l'espace ne s'ouvre pas du tout. Mieux vaut le dire
 * franchement sur l'écran de connexion qu'échouer en silence sur un envoi
 * d'e-mail.
 */
export function configurationIssue(): string | null {
  try {
    accessSecret();
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : "configuration incomplète";
  }
}
