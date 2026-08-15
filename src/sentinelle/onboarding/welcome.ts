import { eq } from "drizzle-orm";
import { db } from "@sentinelle/db/client";
import { clients } from "@sentinelle/db/schema";
import { issueMagicLink } from "@sentinelle/access";
import { sourcesFor } from "@sentinelle/collectors/catalog";
import { renderWelcomeEmail } from "@sentinelle/emails/render";
import { sendSentinelleMail, undeliverableReason } from "@sentinelle/emails/send";
import { sentinelleBaseUrl } from "@sentinelle/url";
import { getFiche, markWelcomeSent, type FicheComponent } from "./store";

// ─────────────────────────────────────────────────────────────────────────────
// E-mail de bienvenue.
//
// C'est le seul e-mail Sentinelle qui part sans relecture humaine, et c'est
// volontaire : la règle 4 du CLAUDE.md porte sur les **alertes** — sur ce que
// le produit affirme d'un site. Un accusé de réception qui ne fait que compter
// des composants et donner un lien de connexion n'affirme rien qui puisse être
// faux, et le faire attendre une validation manuelle ferait patienter quelqu'un
// qui vient de payer.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Combien de composants d'une fiche sont réellement couverts par une source.
 *
 * La question est posée au catalogue de collecte, pas déduite de la présence
 * d'un écosystème : c'est lui qui sait qu'un paquet Packagist sans coordonnée
 * explicite ne se cherche nulle part. Annoncer « 14 composants surveillés »
 * quand trois d'entre eux ne sont interrogeables chez personne serait la
 * première promesse non tenue du produit.
 */
export function watchedCount(components: FicheComponent[]): number {
  return components.filter((component) => {
    const sources = sourcesFor({
      slug: component.slug,
      type: component.type,
      ecosystem: component.ecosystem,
    });
    return Boolean(sources.endoflife || sources.osv || sources.wordpress);
  }).length;
}

export type WelcomeOutcome =
  | { sent: true; messageId: string | null }
  | { sent: false; reason: string };

/**
 * Envoie la bienvenue, une fois et une seule.
 *
 * La marque part **avant** l'envoi : deux instances qui traitent le même rejeu
 * de webhook au même instant ne peuvent pas gagner toutes les deux, c'est
 * l'écriture conditionnelle qui arbitre. Si l'envoi échoue ensuite, la marque
 * est relâchée et l'erreur remonte — sans quoi une panne SMTP passagère
 * priverait définitivement un abonné de son message d'accueil.
 */
export async function sendWelcome(
  clientId: string,
  now: Date = new Date(),
): Promise<WelcomeOutcome> {
  const fiche = await getFiche(clientId);
  if (!fiche) return { sent: false, reason: "fiche introuvable" };

  if (fiche.client.welcomeSentAt) {
    return { sent: false, reason: "bienvenue déjà envoyée" };
  }

  // Vérifié **avant** de marquer : une adresse injoignable n'est pas une panne
  // passagère, il n'y a rien à réessayer. Marquer puis relâcher ferait deux
  // écritures pour un envoi qui n'aura jamais lieu.
  const injoignable = undeliverableReason(fiche.client.email);
  if (injoignable) return { sent: false, reason: injoignable };

  const claimed = await markWelcomeSent(clientId, now);
  if (!claimed) return { sent: false, reason: "bienvenue déjà envoyée" };

  try {
    const link = await issueMagicLink(clientId, now);
    if (!link.ok) throw new Error(`lien de connexion refusé : ${link.reason}`);

    const mail = await renderWelcomeEmail({
      name: fiche.client.name,
      siteUrl: fiche.client.siteUrl,
      components: fiche.components.map((component) => ({
        label: component.label,
        version: component.version,
      })),
      watchedCount: watchedCount(fiche.components),
      loginUrl: link.url,
      espaceUrl: `${sentinelleBaseUrl()}/espace`,
      sentAt: now,
    });

    const { messageId } = await sendSentinelleMail({
      to: fiche.client.email,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
    });

    return { sent: true, messageId };
  } catch (error) {
    // Relâchement de la marque : l'envoi n'a pas eu lieu, la prochaine tentative
    // doit pouvoir reprendre la main.
    await db()
      .update(clients)
      .set({ welcomeSentAt: null })
      .where(eq(clients.id, clientId));

    throw error;
  }
}
