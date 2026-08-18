import { and, eq, isNull, sql } from "drizzle-orm";
import { db } from "@sentinelle/db/client";
import { scans } from "@sentinelle/db/schema";
import { renderApercuEmail, renderEchantillonEmail } from "@sentinelle/emails/render";
import { sendSentinelleMail, undeliverableReason } from "@sentinelle/emails/send";
import { isApercuLettre, type ScanResult } from "@sentinelle/types";
import { sentinelleBaseUrl } from "@sentinelle/url";

// ─────────────────────────────────────────────────────────────────────────────
// Envoi de la lettre-échantillon au visiteur qui a laissé son adresse.
//
// Deux déclencheurs peuvent arriver dans n'importe quel ordre : la capture
// d'e-mail sur le rapport (PATCH) et la fin de rédaction de l'aperçu (Inngest).
// Chacun appelle cette fonction ; la mise à jour conditionnelle de
// `lead_sent_at` (is null) fait office de verrou entre les deux — un seul
// envoi, même si les déclencheurs se croisent.
//
// Écart assumé à la règle 4 (décision d'Agathe, 2026-08-18) : ce contenu part
// sans relecture humaine. Il est borné au périmètre de l'aperçu — mentions
// « échantillon non relu » dans le gabarit, garde `borner()` en amont — et ne
// concerne jamais les alertes ni les numéros abonnés.
// ─────────────────────────────────────────────────────────────────────────────

export type EnvoiOutcome =
  | { sent: true }
  | {
      sent: false;
      /** Pour le journal — jamais affiché au visiteur. */
      reason:
        | "scan introuvable"
        | "pas d'adresse"
        | "adresse injoignable"
        | "lettre pas prête"
        | "déjà envoyée"
        | "envoi impossible";
    };

/** Envoie la lettre-échantillon d'un scan à l'adresse capturée, une seule fois. */
export async function envoyerLettreEchantillon(scanId: string): Promise<EnvoiOutcome> {
  const [scan] = await db()
    .select({
      id: scans.id,
      status: scans.status,
      result: scans.result,
      leadEmail: scans.leadEmail,
      leadSentAt: scans.leadSentAt,
    })
    .from(scans)
    .where(eq(scans.id, scanId));

  if (!scan) return { sent: false, reason: "scan introuvable" };
  if (!scan.leadEmail) return { sent: false, reason: "pas d'adresse" };
  if (scan.leadSentAt) return { sent: false, reason: "déjà envoyée" };
  if (undeliverableReason(scan.leadEmail)) {
    return { sent: false, reason: "adresse injoignable" };
  }

  const result = scan.result as ScanResult | null;
  const apercu = result?.apercu;
  if (scan.status !== "done" || !result || !apercu || apercu.status !== "done") {
    return { sent: false, reason: "lettre pas prête" };
  }

  // Le verrou : celui qui pose la date possède l'envoi. Si rien n'est mis à
  // jour, l'autre déclencheur est passé en premier.
  const claimed = await db()
    .update(scans)
    .set({ leadSentAt: sql`now()` })
    .where(and(eq(scans.id, scanId), isNull(scans.leadSentAt)))
    .returning({ id: scans.id });

  if (claimed.length === 0) return { sent: false, reason: "déjà envoyée" };

  try {
    const rapportUrl = `${sentinelleBaseUrl()}/scan/${scanId}`;
    const mail = isApercuLettre(apercu)
      ? await renderEchantillonEmail({
          lettre: apercu.lettre,
          siteUrl: result.url,
          issueDate: new Date(apercu.genereLe),
          echantillon: { rapportUrl },
        })
      : await renderApercuEmail({
          apercu,
          siteUrl: result.url,
          genereLe: new Date(apercu.genereLe),
          rapportUrl,
        });

    await sendSentinelleMail({
      to: scan.leadEmail,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
    });

    return { sent: true };
  } catch (error) {
    // L'envoi a échoué après la prise du verrou : on le rend, sans quoi la
    // lettre ne partirait jamais malgré un SMTP revenu à la vie.
    await db()
      .update(scans)
      .set({ leadSentAt: null })
      .where(eq(scans.id, scanId));

    console.error("[sentinelle] envoi de la lettre-échantillon impossible", error);
    return { sent: false, reason: "envoi impossible" };
  }
}
