import { render } from "@react-email/render";
import type { DraftedAlert } from "@sentinelle/types";
// Le sujet se déduit du contenu relu : la règle vit avec le contrat de contenu
// (`admin/content.ts`), où elle est testée, plutôt que d'être réécrite ici.
import { alertSubject } from "@sentinelle/admin/content";
import { AlertEmail, type AlertEmailProps } from "./AlertEmail";
import { NewsletterEmail, type NewsletterEmailProps } from "./NewsletterEmail";

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

  return { subject: newsletterSubject(props.blocks.issueDate), html, text };
}

export async function renderAlertEmail(props: AlertEmailProps): Promise<RenderedMail> {
  const element = AlertEmail(props);

  const [html, text] = await Promise.all([
    render(element),
    render(element, { plainText: true }),
  ]);

  return { subject: alertSubject(props.content), html, text };
}

/** Aperçu HTML seul — l'admin n'a pas besoin de la version texte pour relire. */
export async function previewAlertEmail(props: AlertEmailProps): Promise<string> {
  return render(AlertEmail(props));
}

export async function previewNewsletterEmail(props: NewsletterEmailProps): Promise<string> {
  return render(NewsletterEmail(props));
}

export type { DraftedAlert };
