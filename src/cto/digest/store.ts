import { and, desc, eq, gte, inArray, isNull, lt } from "drizzle-orm";
import { db } from "../db/client";
import { ctoClients, ctoDigests, ctoLetters } from "../db/schema";
import { activePersons } from "../access";
import type { Block } from "../notion/blocks";
import { sentinelleLetterKey, sentinelleStateFor } from "../sentinelle";
import { assembleDigest, type EditionInput } from "./assemble";
import { sendDigestEmail } from "./email";
import { DIGEST_VERSION, type DigestContent } from "./types";
import { weekRange } from "./week";

// ─────────────────────────────────────────────────────────────────────────────
// Le digest en base : assemblage, validation, envoi, lecture.
//
// Trois gestes séparés, comme pour les alertes Sentinelle :
//  - l'ASSEMBLAGE tourne avec le balayage quotidien et réécrit les brouillons
//    de la semaine écoulée (une édition parue en retard les rejoint) ;
//  - la VALIDATION est un geste humain, depuis l'admin ;
//  - l'ENVOI suit la validation, et l'index (client, semaine) garantit qu'un
//    rejeu n'envoie rien deux fois.
// ─────────────────────────────────────────────────────────────────────────────

const ARCHIVE_MONTHS = 6;

export interface DigestAssembleReport {
  week: string;
  clients: number;
  created: number;
  refreshed: number;
  /** Déjà validés ou envoyés : on n'y touche plus. */
  frozen: number;
  /** Rien à dire pour cet accompagnement cette semaine. */
  empty: number;
}

function monthsAgo(months: number, now = new Date()): Date {
  const date = new Date(now);
  date.setMonth(date.getMonth() - months);
  return date;
}

async function editionsOf(clientId: string, range: { from: Date; to: Date }): Promise<EditionInput[]> {
  const rows = await db()
    .select({
      notionPageId: ctoLetters.notionPageId,
      title: ctoLetters.title,
      label: ctoLetters.label,
      action: ctoLetters.action,
      period: ctoLetters.period,
      body: ctoLetters.body,
    })
    .from(ctoLetters)
    .where(
      and(
        eq(ctoLetters.source, "signaux-faibles"),
        eq(ctoLetters.clientId, clientId),
        isNull(ctoLetters.withdrawnAt),
        gte(ctoLetters.period, range.from),
        lt(ctoLetters.period, range.to),
      ),
    );

  return rows
    .filter((row) => row.period !== null)
    .map((row) => ({
      letterKey: row.notionPageId,
      title: row.title,
      label: row.label,
      action: row.action,
      period: row.period as Date,
      body: row.body as Block[],
    }));
}

async function receivesSignals(clientId: string): Promise<boolean> {
  const [row] = await db()
    .select({ id: ctoLetters.id })
    .from(ctoLetters)
    .where(
      and(
        eq(ctoLetters.source, "signaux-faibles"),
        eq(ctoLetters.clientId, clientId),
        gte(ctoLetters.period, monthsAgo(ARCHIVE_MONTHS)),
      ),
    )
    .limit(1);
  return Boolean(row);
}

/** Assemble (ou réassemble) les brouillons d'une semaine pour tous les accompagnements actifs. */
export async function assembleWeek(
  week: string,
  options: { dryRun?: boolean } = {},
): Promise<DigestAssembleReport> {
  const range = weekRange(week);
  const report: DigestAssembleReport = { week, clients: 0, created: 0, refreshed: 0, frozen: 0, empty: 0 };

  const clients = await db()
    .select({ id: ctoClients.id, sentinelleClientId: ctoClients.sentinelleClientId })
    .from(ctoClients)
    .where(eq(ctoClients.status, "actif"));

  for (const client of clients) {
    report.clients += 1;

    const [existing] = await db()
      .select({ id: ctoDigests.id, status: ctoDigests.status })
      .from(ctoDigests)
      .where(and(eq(ctoDigests.clientId, client.id), eq(ctoDigests.week, week)))
      .limit(1);
    if (existing && existing.status !== "draft") {
      report.frozen += 1;
      continue;
    }

    const sentinelle = client.sentinelleClientId ? await sentinelleStateFor(client.id) : null;
    const content = assembleDigest({
      week,
      range,
      sentinelle: sentinelle?.data ?? null,
      sentinelleLetterKey,
      editions: await editionsOf(client.id, range),
      signauxAttendus: await receivesSignals(client.id),
    });

    if (!content) {
      report.empty += 1;
      if (existing && !options.dryRun) await db().delete(ctoDigests).where(eq(ctoDigests.id, existing.id));
      continue;
    }

    if (options.dryRun) {
      if (existing) report.refreshed += 1;
      else report.created += 1;
      continue;
    }

    if (existing) {
      await db()
        .update(ctoDigests)
        .set({ content, updatedAt: new Date() })
        .where(and(eq(ctoDigests.id, existing.id), eq(ctoDigests.status, "draft")));
      report.refreshed += 1;
    } else {
      await db()
        .insert(ctoDigests)
        .values({ clientId: client.id, week, content })
        .onConflictDoNothing({ target: [ctoDigests.clientId, ctoDigests.week] });
      report.created += 1;
    }
  }

  return report;
}

export interface AdminDigest {
  id: string;
  clientId: string;
  company: string;
  week: string;
  status: "draft" | "validated" | "sent";
  content: DigestContent;
  updatedAt: Date;
  sentAt: Date | null;
}

function asContent(value: unknown): DigestContent | null {
  if (typeof value !== "object" || value === null) return null;
  const content = value as DigestContent;
  return content.version === DIGEST_VERSION ? content : null;
}

/** Les digests d'une semaine, pour la relecture dans l'admin. */
export async function digestsOfWeek(week: string): Promise<AdminDigest[]> {
  const rows = await db()
    .select({
      id: ctoDigests.id,
      clientId: ctoDigests.clientId,
      company: ctoClients.company,
      week: ctoDigests.week,
      status: ctoDigests.status,
      content: ctoDigests.content,
      updatedAt: ctoDigests.updatedAt,
      sentAt: ctoDigests.sentAt,
    })
    .from(ctoDigests)
    .innerJoin(ctoClients, eq(ctoDigests.clientId, ctoClients.id))
    .where(eq(ctoDigests.week, week))
    .orderBy(ctoClients.company);

  return rows.flatMap((row) => {
    const content = asContent(row.content);
    return content ? [{ ...row, content }] : [];
  });
}

export interface SendReport {
  validated: number;
  sent: number;
  warnings: string[];
}

/**
 * Valide et envoie les brouillons désignés (tous ceux de la semaine si `ids`
 * est absent). Un brouillon sans personne active est validé mais pas envoyé :
 * il partira au prochain appel, quand quelqu'un aura rejoint l'espace.
 */
export async function validateAndSend(
  week: string,
  options: { ids?: string[]; url: string },
): Promise<SendReport> {
  const report: SendReport = { validated: 0, sent: 0, warnings: [] };

  const conditions = [eq(ctoDigests.week, week), inArray(ctoDigests.status, ["draft", "validated"])];
  if (options.ids && options.ids.length > 0) conditions.push(inArray(ctoDigests.id, options.ids));

  const rows = await db()
    .select({ id: ctoDigests.id, clientId: ctoDigests.clientId, status: ctoDigests.status, content: ctoDigests.content })
    .from(ctoDigests)
    .where(and(...conditions));

  for (const row of rows) {
    const content = asContent(row.content);
    if (!content) {
      report.warnings.push(`Digest ${row.id} : contenu illisible, ignoré.`);
      continue;
    }

    if (row.status === "draft") {
      await db()
        .update(ctoDigests)
        .set({ status: "validated", validatedAt: new Date() })
        .where(and(eq(ctoDigests.id, row.id), eq(ctoDigests.status, "draft")));
      report.validated += 1;
    }

    const persons = await activePersons(row.clientId);
    if (persons.length === 0) {
      report.warnings.push(`Digest ${row.id} : aucune personne active, validé sans envoi.`);
      continue;
    }

    let delivered = 0;
    for (const person of persons) {
      try {
        await sendDigestEmail(person, content, options.url);
        delivered += 1;
      } catch (error) {
        console.error("[cto] envoi du digest impossible", error);
        report.warnings.push(`Digest non envoyé à ${person.email} : l'envoi a échoué.`);
      }
    }

    if (delivered > 0) {
      await db()
        .update(ctoDigests)
        .set({ status: "sent", sentAt: new Date() })
        .where(eq(ctoDigests.id, row.id));
      report.sent += 1;
    }
  }

  return report;
}

export interface ClientDigest {
  week: string;
  content: DigestContent;
  sentAt: Date | null;
}

/** Les digests envoyés à un accompagnement, le plus récent en tête — ce que le client a reçu. */
export async function digestsForClient(clientId: string): Promise<ClientDigest[]> {
  const rows = await db()
    .select({ week: ctoDigests.week, content: ctoDigests.content, sentAt: ctoDigests.sentAt })
    .from(ctoDigests)
    .where(
      and(
        eq(ctoDigests.clientId, clientId),
        eq(ctoDigests.status, "sent"),
        gte(ctoDigests.createdAt, monthsAgo(ARCHIVE_MONTHS)),
      ),
    )
    .orderBy(desc(ctoDigests.week));

  return rows.flatMap((row) => {
    const content = asContent(row.content);
    return content ? [{ week: row.week, content, sentAt: row.sentAt }] : [];
  });
}
