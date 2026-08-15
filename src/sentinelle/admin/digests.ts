import { desc, eq } from "drizzle-orm";
import { db } from "@sentinelle/db/client";
import { clients, digests } from "@sentinelle/db/schema";
import { renderNewsletterEmail } from "@sentinelle/emails/render";
import { sendSentinelleMail } from "@sentinelle/emails";
import { missingForIssue, type NewsletterBlocks } from "@sentinelle/newsletter/blocks";
import { isAnonymizedEmail } from "@sentinelle/retention";
import type { AlertStatus } from "@sentinelle/types";
import type { ActionResult } from "./actions";

// ─────────────────────────────────────────────────────────────────────────────
// Relecture et envoi des numéros.
//
// Même cycle que les alertes — draft → validated → sent — et pour la même
// raison : la règle 4 ne fait pas d'exception pour la lettre d'information.
//
// Une différence, volontaire : **c'est le HTML validé qui part**, pas un rendu
// refait au moment de l'envoi. Le numéro est daté par sa période (le 1er ou le
// 15) et non par l'instant d'expédition, donc le rendu est déterministe ; figer
// `final_html` à la validation garantit que ce qui a été relu est exactement ce
// qui est parti. C'est aussi la pièce que la purge efface à douze mois.
// ─────────────────────────────────────────────────────────────────────────────

function refuse(reason: string): { ok: false; reason: string } {
  return { ok: false, reason };
}

export interface DigestSummary {
  id: string;
  period: string;
  status: AlertStatus;
  clientId: string;
  clientName: string;
  company: string | null;
  active: boolean;
  sentAt: Date | null;
  createdAt: Date;
  /** Les deux blocs rédigés sont-ils écrits ? */
  written: boolean;
}

export async function listDigests(limit = 60): Promise<DigestSummary[]> {
  const rows = await db()
    .select({
      id: digests.id,
      period: digests.period,
      status: digests.status,
      blocks: digests.blocks,
      sentAt: digests.sentAt,
      createdAt: digests.createdAt,
      clientId: clients.id,
      clientName: clients.name,
      company: clients.company,
      active: clients.active,
    })
    .from(digests)
    .innerJoin(clients, eq(digests.clientId, clients.id))
    .orderBy(desc(digests.period), desc(digests.createdAt))
    .limit(limit);

  return rows.map((row) => {
    const blocks = row.blocks as NewsletterBlocks;
    return {
      id: row.id,
      period: row.period,
      status: row.status,
      clientId: row.clientId,
      clientName: row.clientName,
      company: row.company,
      active: row.active,
      sentAt: row.sentAt,
      createdAt: row.createdAt,
      written: missingForIssue(blocks).length === 0,
    };
  });
}

export interface DigestDetail {
  id: string;
  period: string;
  status: AlertStatus;
  blocks: NewsletterBlocks;
  finalHtml: string | null;
  sentAt: Date | null;
  client: { id: string; name: string; company: string | null; email: string; siteUrl: string; active: boolean };
}

export async function getDigestDetail(digestId: string): Promise<DigestDetail | null> {
  const [row] = await db()
    .select({
      id: digests.id,
      period: digests.period,
      status: digests.status,
      blocks: digests.blocks,
      finalHtml: digests.finalHtml,
      sentAt: digests.sentAt,
      clientId: clients.id,
      clientName: clients.name,
      company: clients.company,
      email: clients.email,
      siteUrl: clients.siteUrl,
      active: clients.active,
    })
    .from(digests)
    .innerJoin(clients, eq(digests.clientId, clients.id))
    .where(eq(digests.id, digestId))
    .limit(1);

  if (!row) return null;

  return {
    id: row.id,
    period: row.period,
    status: row.status,
    blocks: row.blocks as NewsletterBlocks,
    finalHtml: row.finalHtml,
    sentAt: row.sentAt,
    client: {
      id: row.clientId,
      name: row.clientName,
      company: row.company,
      email: row.email,
      siteUrl: row.siteUrl,
      active: row.active,
    },
  };
}

async function loadEditable(digestId: string) {
  const detail = await getDigestDetail(digestId);
  if (!detail) return { error: "Numéro introuvable." as const };
  if (detail.status === "sent") return { error: "Numéro déjà envoyé." as const };
  if (detail.status !== "draft" && detail.status !== "validated") {
    return { error: "Numéro clos." as const };
  }
  return { detail };
}

/** Enregistre les deux blocs rédigés. Les blocs factuels ne s'éditent pas. */
export async function saveDigestBlocks(
  digestId: string,
  written: { watch: string; reco: string },
): Promise<ActionResult> {
  const loaded = await loadEditable(digestId);
  if (loaded.error) return refuse(loaded.error);

  const blocks: NewsletterBlocks = {
    ...loaded.detail.blocks,
    watch: written.watch.trim(),
    reco: written.reco.trim(),
  };

  await db()
    .update(digests)
    // Le HTML validé redevient nul : il ne correspondrait plus au contenu, et un
    // aperçu périmé est pire qu'une absence d'aperçu.
    .set({ blocks, status: "draft", finalHtml: null })
    .where(eq(digests.id, digestId));

  return { ok: true };
}

/** Valide un numéro : le HTML est figé, il devient envoyable. */
export async function validateDigest(
  digestId: string,
  written?: { watch: string; reco: string },
): Promise<ActionResult> {
  const loaded = await loadEditable(digestId);
  if (loaded.error) return refuse(loaded.error);

  const blocks: NewsletterBlocks = written
    ? { ...loaded.detail.blocks, watch: written.watch.trim(), reco: written.reco.trim() }
    : loaded.detail.blocks;

  const manques = missingForIssue(blocks);
  if (manques.length > 0) return refuse(`Il manque ${manques.join(", ")}.`);

  const mail = await renderNewsletterEmail({ blocks, siteUrl: loaded.detail.client.siteUrl });

  await db()
    .update(digests)
    .set({ blocks, status: "validated", finalHtml: mail.html })
    .where(eq(digests.id, digestId));

  return { ok: true };
}

export interface DigestSendOutcome {
  messageId: string | null;
  to: string;
  subject: string;
}

/**
 * Envoie un numéro validé.
 *
 * Le HTML part tel qu'il a été figé à la validation ; seule la version texte est
 * dérivée à l'envoi, du même contenu et par le même gabarit. Comme pour les
 * alertes, le statut `sent` s'écrit après l'envoi : un doublon visible vaut
 * mieux qu'un silence invisible.
 */
export async function sendDigest(
  digestId: string,
  now: Date = new Date(),
): Promise<ActionResult<DigestSendOutcome>> {
  const detail = await getDigestDetail(digestId);
  if (!detail) return refuse("Numéro introuvable.");

  if (detail.status === "sent") return refuse("Numéro déjà envoyé.");
  if (detail.status !== "validated") {
    return refuse("Numéro non validé : la relecture humaine est obligatoire avant l'envoi.");
  }
  if (!detail.finalHtml) return refuse("Aucun rendu validé : revalidez le numéro.");
  if (!detail.client.active) return refuse("Abonnement résilié : aucun envoi.");
  if (isAnonymizedEmail(detail.client.email)) {
    return refuse("Fiche anonymisée par la purge : plus d'adresse de destination.");
  }
  if (/\.invalid$/i.test(detail.client.email.trim())) {
    return refuse("Adresse de démonstration (.invalid) : aucun envoi possible.");
  }

  const mail = await renderNewsletterEmail({
    blocks: detail.blocks,
    siteUrl: detail.client.siteUrl,
  });

  const { messageId } = await sendSentinelleMail({
    to: detail.client.email,
    subject: mail.subject,
    html: detail.finalHtml,
    text: mail.text,
  });

  await db()
    .update(digests)
    .set({ status: "sent", sentAt: now })
    .where(eq(digests.id, digestId));

  console.info(
    `[sentinelle] numéro ${detail.period} envoyé à ${detail.client.email} (${messageId ?? "sans id"})`,
  );

  return { ok: true, value: { messageId, to: detail.client.email, subject: mail.subject } };
}
