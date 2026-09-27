import { and, eq, isNull, sql } from "drizzle-orm";
import { db } from "@sentinelle/db/client";
import { scans } from "@sentinelle/db/schema";
import { renderAuditEmail } from "@sentinelle/emails/render";
import { sendSentinelleMail, undeliverableReason } from "@sentinelle/emails/send";
import type { ScanResult } from "@sentinelle/types";
import { sentinelleBaseUrl } from "@sentinelle/url";

// ─────────────────────────────────────────────────────────────────────────────
// Envoi de l'audit (diagnostic en quatre cases) à l'adresse laissée sur la
// page d'attente ou dans le popup de fin.
//
// Deux déclencheurs, dans n'importe quel ordre : la saisie de l'adresse (POST
// /api/sentinelle/scan/[id]/audit) et la fin de rédaction du diagnostic
// (Inngest). Chacun appelle cette fonction ; la mise à jour conditionnelle de
// `audit_sent_at` (is null) fait office de verrou : un seul envoi.
//
// Même écart assumé à la règle 4 que la lettre-échantillon (décision du
// 2026-08-18, étendue à l'audit le 2026-09-27) : ce contenu part sans relecture,
// parce que le visiteur l'a déjà sous les yeux en ligne et que l'e-mail le dit
// « non relu ». Ne concerne jamais les alertes ni les numéros abonnés.
// ─────────────────────────────────────────────────────────────────────────────

export type AuditEnvoiOutcome =
  | { sent: true }
  | {
      sent: false;
      /** Pour le journal, jamais affiché au visiteur. */
      reason:
        | "scan introuvable"
        | "pas d'adresse"
        | "adresse injoignable"
        | "audit pas prêt"
        | "pas d'audit"
        | "déjà envoyé"
        | "envoi impossible";
    };

function nomDuSite(result: ScanResult): string {
  if (result.site?.siteName) return result.site.siteName;
  try {
    return new URL(result.url).hostname.replace(/^www\./, "");
  } catch {
    return result.url;
  }
}

/** Envoie l'audit d'un scan à l'adresse demandée, une seule fois. */
export async function envoyerAudit(scanId: string): Promise<AuditEnvoiOutcome> {
  const [scan] = await db()
    .select({
      status: scans.status,
      result: scans.result,
      auditEmail: scans.auditEmail,
      auditSentAt: scans.auditSentAt,
    })
    .from(scans)
    .where(eq(scans.id, scanId));

  if (!scan) return { sent: false, reason: "scan introuvable" };
  if (!scan.auditEmail) return { sent: false, reason: "pas d'adresse" };
  if (scan.auditSentAt) return { sent: false, reason: "déjà envoyé" };
  if (undeliverableReason(scan.auditEmail)) {
    return { sent: false, reason: "adresse injoignable" };
  }

  const result = scan.result as ScanResult | null;
  const diagnostic = result?.diagnostic;
  if (scan.status === "failed" || diagnostic?.status === "none") {
    return { sent: false, reason: "pas d'audit" };
  }
  if (scan.status !== "done" || !result || diagnostic?.status !== "done") {
    return { sent: false, reason: "audit pas prêt" };
  }

  const claimed = await db()
    .update(scans)
    .set({ auditSentAt: sql`now()` })
    .where(and(eq(scans.id, scanId), isNull(scans.auditSentAt)))
    .returning({ id: scans.id });

  if (claimed.length === 0) return { sent: false, reason: "déjà envoyé" };

  try {
    const mail = await renderAuditEmail({
      diagnostic,
      siteUrl: result.url,
      nom: nomDuSite(result),
      genereLe: new Date(diagnostic.genereLe),
      rapportUrl: `${sentinelleBaseUrl()}/scan/${scanId}`,
    });

    await sendSentinelleMail({
      to: scan.auditEmail,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
    });

    return { sent: true };
  } catch (error) {
    // Échec après la prise du verrou : on le rend, sans quoi l'audit ne
    // partirait jamais malgré un SMTP revenu à la vie.
    await db().update(scans).set({ auditSentAt: null }).where(eq(scans.id, scanId));

    console.error("[sentinelle] envoi de l'audit impossible", error);
    return { sent: false, reason: "envoi impossible" };
  }
}
