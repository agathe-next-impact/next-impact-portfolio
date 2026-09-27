import { sendSentinelleMail } from "@sentinelle/emails/send";
import { sentinelleBaseUrl } from "@sentinelle/url";
import type { SubscriptionRequestInput } from "./request";

// ─────────────────────────────────────────────────────────────────────────────
// Nouvelle demande d'inscription : prévenir Agathe.
//
// Un e-mail sobre dont le « répondre à » est le demandeur lui-même, avec le
// lien vers la file des inscriptions de l'admin, où se fait l'activation. Rien
// ne part vers le demandeur tant que la demande n'est pas validée.
// ─────────────────────────────────────────────────────────────────────────────

/** Destinataire : l'adresse dédiée, à défaut le « répondre à » de Sentinelle. */
export function destinataire(env: Record<string, string | undefined> = process.env): string | null {
  return env.SENTINELLE_LEADS_TO?.trim() || env.SENTINELLE_MAIL_REPLY_TO?.trim() || null;
}

function echapper(texte: string): string {
  return texte.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

/** Le message, sans I/O : sujet, texte brut et HTML. */
export function composerNotification(
  demande: SubscriptionRequestInput,
  liens: { admin: string; rapport: string | null },
) {
  const lignes: Array<[string, string]> = [
    ["Nom", demande.name],
    ["Organisation", demande.organisation],
    ["E-mail", demande.email],
    ["Site", demande.siteUrl],
    ["Origine", liens.rapport ? `rapport d'analyse ${liens.rapport}` : "page Sentinelle"],
    ["À valider", liens.admin],
  ];

  return {
    subject: `Inscription Sentinelle à valider : ${demande.organisation}`,
    text: [
      "Une demande d'inscription à Sentinelle attend votre validation.",
      "",
      ...lignes.map(([cle, valeur]) => `${cle} : ${valeur}`),
      "",
      "Répondre à ce message écrit directement au demandeur.",
    ].join("\n"),
    html: [
      "<p>Une demande d'inscription à Sentinelle attend votre validation.</p>",
      "<table cellpadding=\"4\">",
      ...lignes.map(
        ([cle, valeur]) => `<tr><td><strong>${echapper(cle)}</strong></td><td>${echapper(valeur)}</td></tr>`,
      ),
      "</table>",
      "<p>Répondre à ce message écrit directement au demandeur.</p>",
    ].join("\n"),
  };
}

/**
 * Envoie la notification. Ne lève jamais : la demande est déjà enregistrée en
 * base, un e-mail qui échoue ne doit pas la faire échouer.
 */
export async function notifierDemande(
  demande: SubscriptionRequestInput,
): Promise<{ sent: boolean; reason?: string }> {
  const to = destinataire();
  if (!to) return { sent: false, reason: "aucun destinataire configuré" };

  const base = sentinelleBaseUrl();
  const liens = {
    admin: `${base}/admin/sentinelle/inscriptions`,
    rapport: demande.originScanId ? `${base}/scan/${demande.originScanId}` : null,
  };
  try {
    await sendSentinelleMail({ to, replyTo: demande.email, ...composerNotification(demande, liens) });
    return { sent: true };
  } catch (error) {
    console.error("[sentinelle] notification d'inscription impossible", error);
    return { sent: false, reason: "envoi impossible" };
  }
}
