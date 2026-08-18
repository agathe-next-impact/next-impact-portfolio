import { render } from "@react-email/render";
import type { DraftedAlert } from "@sentinelle/types";
// Le sujet se déduit du contenu relu : la règle vit avec le contrat de contenu
// (`admin/content.ts`), où elle est testée, plutôt que d'être réécrite ici.
import { alertSubject } from "@sentinelle/admin/content";
import { AlertEmail, type AlertEmailProps } from "./AlertEmail";
import { ApercuEmail, type ApercuEmailProps } from "./ApercuEmail";
import { NewsletterEmail, type NewsletterEmailProps } from "./NewsletterEmail";
import { WelcomeEmail, type WelcomeEmailProps } from "./WelcomeEmail";
import { LoginEmail, type LoginEmailProps } from "./LoginEmail";

// ─────────────────────────────────────────────────────────────────────────────
// Rendu des gabarits en HTML + texte.
//
// Deux versions et pas une : un e-mail sans partie texte part avec un score de
// spam plus élevé, et certains clients (montres, terminaux, lecteurs d'écran mal
// configurés) n'affichent que celle-là. `@react-email/render` la dérive du même
// arbre React, donc les deux ne peuvent pas diverger.
//
// Le rendu est **asynchrone** et fait du travail (mise en forme, conversion) :
// il se fait une fois, au moment de l'envoi ou de l'aperçu, jamais dans une
// boucle.
// ─────────────────────────────────────────────────────────────────────────────

export interface RenderedMail {
  subject: string;
  html: string;
  text: string;
}

/** Objet d'un numéro — la date suffit à le situer, c'est un rendez-vous. */
export function newsletterSubject(issueDate: string): string {
  const jour = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    timeZone: "Europe/Paris",
  }).format(new Date(issueDate));

  return `Sentinelle — votre veille du ${jour}`;
}

export async function renderNewsletterEmail(
  props: NewsletterEmailProps,
): Promise<RenderedMail> {
  const element = NewsletterEmail(props);

  const [html, text] = await Promise.all([
    render(element),
    render(element, { plainText: true }),
  ]);

  // Le titre de la lettre est déjà écrit pour être lu en tête de boîte
  // (« <période> — Ce que l'actualité change pour <site> ») : le reprendre en
  // objet évite d'annoncer une chose et d'en titrer une autre. La date sert de
  // repli si le titre est vide.
  const subject =
    props.lettre.titre.trim() !== ""
      ? `Sentinelle — ${props.lettre.titre.trim()}`
      : newsletterSubject(props.issueDate.toISOString());

  return { subject, html, text };
}

export async function renderAlertEmail(props: AlertEmailProps): Promise<RenderedMail> {
  const element = AlertEmail(props);

  const [html, text] = await Promise.all([
    render(element),
    render(element, { plainText: true }),
  ]);

  return { subject: alertSubject(props.content), html, text };
}

/**
 * Bienvenue — envoyé une seule fois, juste après le paiement.
 *
 * L'objet nomme le site : c'est la seule chose que le destinataire cherche des
 * yeux dans une boîte pleine, et ça prouve du premier coup d'œil qu'on parle
 * bien du sien.
 */
export async function renderWelcomeEmail(props: WelcomeEmailProps): Promise<RenderedMail> {
  const element = WelcomeEmail(props);

  const [html, text] = await Promise.all([
    render(element),
    render(element, { plainText: true }),
  ]);

  const host = props.siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return { subject: `Sentinelle — la surveillance de ${host} a commencé`, html, text };
}

/** Lien de connexion à l'espace client. */
export async function renderLoginEmail(props: LoginEmailProps): Promise<RenderedMail> {
  const element = LoginEmail(props);

  const [html, text] = await Promise.all([
    render(element),
    render(element, { plainText: true }),
  ]);

  return { subject: "Sentinelle — votre lien de connexion", html, text };
}

/** Aperçu HTML seul — l'admin n'a pas besoin de la version texte pour relire. */
export async function previewAlertEmail(props: AlertEmailProps): Promise<string> {
  return render(AlertEmail(props));
}

export async function previewNewsletterEmail(props: NewsletterEmailProps): Promise<string> {
  return render(NewsletterEmail(props));
}

/**
 * Lettre-échantillon du scan public, en HTML seul — l'iframe du rapport.
 */
export async function previewApercuEmail(props: ApercuEmailProps): Promise<string> {
  return render(ApercuEmail(props));
}

/** L'objet d'une lettre-échantillon dit ce que c'est et nomme le site. */
function echantillonSubject(siteUrl: string): string {
  const host = siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return `Sentinelle — l'échantillon de votre lettre de veille pour ${host}`;
}

/**
 * Lettre-échantillon héritée (cinq thèmes) prête à l'envoi — encore utile pour
 * les scans d'avant le passage au pipeline complet.
 */
export async function renderApercuEmail(props: ApercuEmailProps): Promise<RenderedMail> {
  const element = ApercuEmail(props);

  const [html, text] = await Promise.all([
    render(element),
    render(element, { plainText: true }),
  ]);

  return { subject: echantillonSubject(props.siteUrl), html, text };
}

/**
 * Lettre-échantillon actuelle : un vrai numéro (pipeline de la veille
 * personnalisée sur la semaine écoulée), rendu dans le gabarit abonné en mode
 * échantillon.
 */
export async function renderEchantillonEmail(
  props: NewsletterEmailProps & { siteUrl: string },
): Promise<RenderedMail> {
  const element = NewsletterEmail(props);

  const [html, text] = await Promise.all([
    render(element),
    render(element, { plainText: true }),
  ]);

  return { subject: echantillonSubject(props.siteUrl), html, text };
}

export type { DraftedAlert, LoginEmailProps, WelcomeEmailProps };
