// Filtre anti-spam des formulaires, en complément du reCAPTCHA.
//
// Pourquoi un second filtre : en septembre 2026, des robots pilotant un vrai
// navigateur obtenaient un score reCAPTCHA suffisant (≥ 0.5) et envoyaient via
// /api/contact des messages vides signés de noms aléatoires
// (« roFRiMzMxsOzdNmOlmqJCJw »). Leur but n'était pas le message reçu par
// Agathe, mais l'ACCUSÉ DE RÉCEPTION envoyé à l'adresse saisie — celle de
// tiers : le site servait à inonder des boîtes étrangères depuis
// next-impact.digital, ce qui abîme la réputation du domaine.
//
// Principes :
//  - des règles étroites, qui décrivent CE robot, plutôt qu'un score maison
//    qui finirait par bloquer un vrai prospect ;
//  - un rejet SILENCIEUX : la route répond comme si tout était parti. Un robot
//    qui reçoit une erreur apprend à la contourner ; un robot qui croit avoir
//    réussi continue à se tromper.

export type SpamReason =
  | "honeypot"
  | "trop-rapide"
  | "nom-aleatoire"
  | "message-vide"
  | "organisation-aleatoire";

/**
 * Une chaîne qui ressemble à un identifiant tiré au hasard : un seul mot,
 * au moins dix lettres, et au moins trois majuscules après la première
 * lettre. « roFRiMzMxsOzdNmOlmqJCJw » l'est ; « Jean-Baptiste »,
 * « McDonald » ou « DELACROIX » ne le sont pas.
 */
export function looksRandom(value: string | null | undefined): boolean {
  const v = (value ?? "").trim();
  if (!/^[A-Za-z]{10,}$/.test(v)) return false;
  // Tout en majuscules ou tout en minuscules : un vrai nom saisi ainsi existe.
  if (v === v.toUpperCase() || v === v.toLowerCase()) return false;
  const internalUppers = (v.slice(1).match(/[A-Z]/g) ?? []).length;
  return internalUppers >= 3;
}

/**
 * Le texte réellement écrit par la personne, sans l'en-tête que le formulaire
 * de contact ajoute (« [Objet : …] · Organisation : … »).
 */
export function freeText(message: string | null | undefined): string {
  return (message ?? "")
    .replace(/^\s*\[(?:Objet|Subject) : [^\]]*\]/, "")
    .replace(/^\s*·\s*(?:Organisation|Organization) : [^\n]*/, "")
    .trim();
}

/** L'organisation déclarée dans l'en-tête du message, si présente. */
function declaredOrganisation(message: string | null | undefined): string | null {
  const match = (message ?? "").match(/·\s*(?:Organisation|Organization) : ([^\n]*)/);
  return match ? match[1].trim() : null;
}

export interface ContactSubmission {
  name?: unknown;
  message?: unknown;
  /** Champ piège, invisible pour un humain : doit rester vide. */
  website?: unknown;
  /** Millisecondes écoulées entre l'affichage du formulaire et l'envoi. */
  elapsedMs?: unknown;
  /** Vrai pour le cahier des charges, dont le message est généré, pas saisi. */
  generated?: boolean;
}

/** Délai minimal entre l'ouverture du formulaire et l'envoi. */
export const MIN_FILL_MS = 3000;

/** La raison de rejeter la soumission, ou null si elle semble humaine. */
export function spamReason(input: ContactSubmission): SpamReason | null {
  if (typeof input.website === "string" && input.website.trim() !== "") return "honeypot";

  // Le délai n'est vérifié que s'il est fourni : les formulaires qui ne
  // l'envoient pas encore ne doivent pas être bloqués pour autant.
  if (typeof input.elapsedMs === "number" && input.elapsedMs < MIN_FILL_MS) return "trop-rapide";

  const name = typeof input.name === "string" ? input.name : "";
  if (looksRandom(name)) return "nom-aleatoire";

  const message = typeof input.message === "string" ? input.message : "";
  if (!input.generated) {
    if (freeText(message).length < 2) return "message-vide";
    const org = declaredOrganisation(message);
    if (org && org.split(/\s+/).some((part) => looksRandom(part))) return "organisation-aleatoire";
  }

  return null;
}
