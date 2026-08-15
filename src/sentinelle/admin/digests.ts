import { desc, eq } from "drizzle-orm";
import { db } from "@sentinelle/db/client";
import { clients, digests } from "@sentinelle/db/schema";
import { renderNewsletterEmail } from "@sentinelle/emails/render";
import { sendSentinelleMail, undeliverableReason } from "@sentinelle/emails";
import {
  missingForIssue,
  parseIssue,
  type IssueContent,
  type Lettre,
} from "@sentinelle/lettre";
import { LettreSchema } from "@sentinelle/lettre/schema";
import { guardLettre } from "@sentinelle/lettre/guards";
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
  /** La lettre est-elle écrite ? Un numéro sans lettre n'est pas relisible. */
  written: boolean;
  /** Signalements du garde-fou laissés par la fabrication. */
  signalements: number;
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
    const issue = parseIssue(row.blocks);
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
      written: issue ? missingForIssue(issue).length === 0 : false,
      signalements: issue?.production.signalements.length ?? 0,
    };
  });
}

export interface DigestDetail {
  id: string;
  period: string;
  status: AlertStatus;
  issue: IssueContent | null;
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
    issue: parseIssue(row.blocks),
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
  if (!detail.issue) return { error: "Numéro sans contenu exploitable." as const };
  return { detail, issue: detail.issue };
}

/**
 * Relit une lettre corrigée à la main.
 *
 * Le texte saisi passe par le même schéma que la sortie du modèle : une
 * correction humaine peut casser la structure aussi sûrement qu'un modèle, et un
 * numéro à onze axes n'est pas un numéro. Les garde-fous de sourçage sont
 * réappliqués eux aussi — coller une URL trouvée ailleurs pendant la relecture
 * est exactement le geste qu'ils sont là pour attraper.
 */
export function parseLettreDraft(raw: string): { ok: true; lettre: Lettre } | { ok: false; reason: string } {
  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return { ok: false, reason: "Le contenu n'est pas un JSON valide." };
  }

  const parsed = LettreSchema.safeParse(payload);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      ok: false,
      reason: `Structure invalide : ${issue?.path.join(".") ?? "?"} — ${issue?.message ?? ""}`,
    };
  }

  return { ok: true, lettre: parsed.data };
}

/** Enregistre la lettre relue. Le constaté et le dossier ne s'éditent pas. */
export async function saveDigestLettre(
  digestId: string,
  lettre: Lettre,
): Promise<ActionResult> {
  const loaded = await loadEditable(digestId);
  if (loaded.error) return refuse(loaded.error);

  const issue: IssueContent = { ...loaded.issue, lettre };

  await db()
    .update(digests)
    // Le HTML validé redevient nul : il ne correspondrait plus au contenu, et un
    // aperçu périmé est pire qu'une absence d'aperçu.
    .set({ blocks: issue, status: "draft", finalHtml: null })
    .where(eq(digests.id, digestId));

  return { ok: true };
}

/** Valide un numéro : le HTML est figé, il devient envoyable. */
export async function validateDigest(
  digestId: string,
  lettre?: Lettre,
): Promise<ActionResult> {
  const loaded = await loadEditable(digestId);
  if (loaded.error) return refuse(loaded.error);

  const issue: IssueContent = lettre ? { ...loaded.issue, lettre } : loaded.issue;

  const manques = missingForIssue(issue);
  if (manques.length > 0) return refuse(`Il manque ${manques.join(", ")}.`);
  if (!issue.lettre) return refuse("Il manque la lettre elle-même.");

  // Le garde-fou repasse sur la version relue, et il est bloquant : une source
  // ajoutée à la main qui ne figure pas au dossier ne doit pas devenir
  // envoyable parce qu'un humain l'a tapée.
  if (issue.dossier) {
    const garde = guardLettre(issue.lettre, {
      dossier: issue.dossier,
      ficheNames: issue.constate.health.components.map((component) => component.label),
      quiet: false,
    });
    if (!garde.ok) return refuse(`Refusé : ${garde.violations.join(" · ")}`);
  }

  const mail = await renderNewsletterEmail({
    lettre: issue.lettre,
    siteUrl: loaded.detail.client.siteUrl,
    issueDate: new Date(issue.constate.issueDate),
  });

  await db()
    .update(digests)
    .set({ blocks: issue, status: "validated", finalHtml: mail.html })
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
  if (!detail.issue?.lettre) return refuse("Numéro sans lettre : rien à envoyer.");
  const injoignable = undeliverableReason(detail.client.email);
  if (injoignable) return refuse(injoignable);

  const mail = await renderNewsletterEmail({
    lettre: detail.issue.lettre,
    siteUrl: detail.client.siteUrl,
    issueDate: new Date(detail.issue.constate.issueDate),
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
