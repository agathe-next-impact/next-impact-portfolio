import { renderLoginEmail } from "@sentinelle/emails/render";
import { sendSentinelleMail, undeliverableReason } from "@sentinelle/emails/send";
import { MAGIC_LINK_TTL_MS } from "./token";
import { findRecipient, issueMagicLink } from "./store";

// ─────────────────────────────────────────────────────────────────────────────
// Envoi d'un lien de connexion.
//
// Un principe gouverne la forme de ce module : **le formulaire de connexion ne
// dit jamais si une adresse est cliente**. Saisir dix adresses pour découvrir
// lesquelles sont abonnées serait une fuite gratuite — et le message affiché est
// donc le même dans tous les cas. C'est pour ça que la fonction ne renvoie pas
// « adresse inconnue » à l'appelant sous une forme affichable : elle renvoie ce
// qui s'est passé, pour le journal, et la page en tire toujours la même phrase.
// ─────────────────────────────────────────────────────────────────────────────

export type LoginLinkOutcome =
  | { sent: true }
  /** Rien n'est parti — la page affiche malgré tout le même message. */
  | { sent: false; reason: "inconnue" | "injoignable" | "trop de demandes" };

/** Émet et envoie un lien de connexion à l'adresse saisie, si elle est cliente. */
export async function sendLoginLink(
  email: string,
  now: Date = new Date(),
): Promise<LoginLinkOutcome> {
  const recipient = await findRecipient(email);
  if (!recipient) return { sent: false, reason: "inconnue" };

  if (undeliverableReason(recipient.email)) return { sent: false, reason: "injoignable" };

  const link = await issueMagicLink(recipient.id, now);
  if (!link.ok) return { sent: false, reason: link.reason };

  const mail = await renderLoginEmail({
    loginUrl: link.url,
    validityMinutes: Math.round(MAGIC_LINK_TTL_MS / 60_000),
    sentAt: now,
  });

  await sendSentinelleMail({
    to: recipient.email,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
  });

  return { sent: true };
}
