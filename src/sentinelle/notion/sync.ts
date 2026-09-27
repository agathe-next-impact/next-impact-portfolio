import { and, eq, isNull } from "drizzle-orm";
import { db } from "@sentinelle/db/client";
import { alerts, clients, intelItems, stackItems } from "@sentinelle/db/schema";
import { missingForValidation, parseAlertContent, serializeAlertContent } from "@sentinelle/admin/content";
import { renderAlertEmail } from "@sentinelle/emails/render";
import { sendSentinelleMail, undeliverableReason } from "@sentinelle/emails";
import { configurationIssue } from "./client";
import {
  createAlertPage,
  listAlertPages,
  markSent,
  writeDraftContent,
  type AlertPageRecord,
} from "./alerts";
import { alertKey, VERDICT_LABEL } from "./schema";

// ─────────────────────────────────────────────────────────────────────────────
// La synchro Notion → Postgres, et son seul effet de bord : l'envoi.
//
// Depuis que la relecture vit dans Notion, ce module remplace ce qu'étaient
// `admin/actions.ts` pour les alertes : c'est ici, pas dans un clic d'admin,
// que « Statut = Validée » devient un e-mail parti. Même règle 4 qu'avant —
// rien ne part qui n'ait été validé par un humain — simplement, l'endroit où
// l'humain valide a changé.
//
// Deux passes à chaque exécution :
//
//  1. `backfillMissingPages` — répare les brouillons Postgres qu'une panne
//     Notion a empêché de recevoir leur page (le matching crée la page tout de
//     suite ; ceci est le filet, pas le chemin normal).
//  2. `syncAlertsFromNotion` — relit TOUTE la base, mirroir chaque page dans
//     Postgres (pour le digest et la lettre, qui ne doivent pas dépendre de
//     Notion), et envoie ce qui est Validée et pas encore parti.
// ─────────────────────────────────────────────────────────────────────────────

export interface AlertSyncReport {
  mirrored: number;
  sent: number;
  blocked: number;
  backfilled: number;
  orphans: number;
  warnings: string[];
}

/**
 * Recrée la page Notion des brouillons qui n'en ont pas.
 *
 * Le cas normal est qu'il n'y en ait aucun : le matching crée la page au moment
 * même où il écrit le brouillon. Celui-ci n'existe que pour l'incident Notion
 * qui aurait fait échouer cette création — sans lui, un tel brouillon resterait
 * invisible pour toujours, `onConflictDoNothing` empêchant le matching de le
 * retenter au passage suivant.
 *
 * Sert aussi, une fois, au passage de tout le stock d'alertes antérieur à
 * Notion (2026-09) : celles qui portaient déjà un texte (`generatedText`) le
 * reçoivent tout de suite, pour ne pas les faire réapparaître « à rédiger »
 * dans Notion alors que la rédaction est déjà passée.
 */
export async function backfillMissingPages(): Promise<{ backfilled: number; warnings: string[] }> {
  const warnings: string[] = [];

  // Constaté en réel (2026-09) : la page se crée, puis l'écriture de
  // `notion_page_id` échoue (coupure réseau entre les deux appels). Sans ce
  // rattrapage, le passage suivant retrouverait la ligne toujours sans page et
  // en recréerait une seconde — la même alerte en double dans Notion.
  const existantes = new Map((await listAlertPages()).map((page) => [page.key, page.pageId]));

  const rows = await db()
    .select({
      alertId: alerts.id,
      clientId: clients.id,
      clientLabel: clients.company,
      clientName: clients.name,
      siteUrl: clients.siteUrl,
      verdict: alerts.verdict,
      generatedText: alerts.generatedText,
      component: stackItems.label,
      componentVersion: stackItems.version,
      intelSource: intelItems.source,
      severity: intelItems.severity,
      intelItemId: intelItems.id,
    })
    .from(alerts)
    .innerJoin(clients, eq(alerts.clientId, clients.id))
    .innerJoin(stackItems, eq(alerts.stackItemId, stackItems.id))
    .innerJoin(intelItems, eq(alerts.intelItemId, intelItems.id))
    .where(isNull(alerts.notionPageId));

  let backfilled = 0;

  for (const row of rows) {
    const key = alertKey(row.clientId, row.intelItemId);

    try {
      const deja = existantes.get(key);
      const pageId =
        deja ??
        (await createAlertPage({
          clientId: row.clientId,
          clientLabel: row.clientLabel ?? row.clientName,
          siteUrl: row.siteUrl,
          component: row.componentVersion ? `${row.component} v${row.componentVersion}` : row.component,
          verdict: row.verdict ?? "info",
          source: row.intelSource,
          severity: row.severity,
          key,
        }));

      if (!deja) {
        const preexistant = parseAlertContent(row.generatedText);
        if (preexistant) await writeDraftContent(pageId, preexistant);
      }

      await db().update(alerts).set({ notionPageId: pageId }).where(eq(alerts.id, row.alertId));
      backfilled++;
    } catch (error) {
      const message = error instanceof Error ? error.message : "erreur";
      warnings.push(`alerte ${row.alertId} : page Notion toujours pas créée (${message})`);
    }
  }

  return { backfilled, warnings };
}

/** Ce qu'il faut, en plus du contenu Notion, pour envoyer une alerte. */
async function loadSendable(notionPageId: string) {
  const [row] = await db()
    .select({
      alertId: alerts.id,
      sentAt: alerts.sentAt,
      clientEmail: clients.email,
      clientActive: clients.active,
      clientSite: clients.siteUrl,
      componentLabel: stackItems.label,
      componentVersion: stackItems.version,
    })
    .from(alerts)
    .innerJoin(clients, eq(alerts.clientId, clients.id))
    .innerJoin(stackItems, eq(alerts.stackItemId, stackItems.id))
    .where(eq(alerts.notionPageId, notionPageId))
    .limit(1);

  return row ?? null;
}

/**
 * Envoie une alerte validée dans Notion, si rien ne s'y oppose.
 *
 * Miroir exact des refus qu'`admin/actions.ts` opposait avant : abonnement
 * résilié, adresse injoignable, déjà envoyée. Un refus ne change ni Notion ni
 * Postgres — l'alerte reste Validée, et sera retentée à la prochaine passe.
 * C'est le même choix qu'avant pour l'ordre d'écriture : `sentAt` ne s'écrit
 * qu'après l'envoi réel.
 */
async function trySend(
  record: AlertPageRecord,
  now: Date,
): Promise<{ sent: true } | { sent: false; blocked: true } | { sent: false; blocked: false }> {
  const loaded = await loadSendable(record.pageId);
  if (!loaded) return { sent: false, blocked: false };
  if (loaded.sentAt) return { sent: false, blocked: false }; // déjà envoyée côté miroir : rien à faire ici

  // Un humain peut passer Statut à Validée avant que la rédaction ait rempli la
  // page (ou après l'avoir vidée par erreur) : même contrôle qu'avant dans
  // l'admin, pour la même raison — sans action recommandée, l'e-mail laisse le
  // client devant un problème sans issue.
  const manques = missingForValidation(record.content);
  if (manques.length > 0) {
    console.warn(
      `[sentinelle] alerte ${record.pageId} validée mais incomplète — il manque ${manques.join(", ")}`,
    );
    return { sent: false, blocked: true };
  }

  if (!loaded.clientActive) {
    console.warn(`[sentinelle] alerte ${record.pageId} validée mais abonnement résilié : envoi bloqué`);
    return { sent: false, blocked: true };
  }
  const injoignable = undeliverableReason(loaded.clientEmail);
  if (injoignable) {
    console.warn(`[sentinelle] alerte ${record.pageId} validée mais envoi bloqué — ${injoignable}`);
    return { sent: false, blocked: true };
  }

  const mail = await renderAlertEmail({
    content: record.content,
    component: { label: loaded.componentLabel, version: loaded.componentVersion },
    siteUrl: loaded.clientSite,
    sentAt: now,
  });

  const { messageId } = await sendSentinelleMail({
    to: loaded.clientEmail,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
  });

  await markSent(record.pageId, now);

  await db()
    .update(alerts)
    .set({
      status: "sent",
      verdict: record.verdict,
      finalText: serializeAlertContent(record.content),
      recommendedAction: record.content.recommendedAction.trim() || null,
      sentAt: now,
    })
    .where(eq(alerts.notionPageId, record.pageId));

  console.info(`[sentinelle] alerte ${record.pageId} envoyée à ${loaded.clientEmail} (${messageId ?? "sans id"})`);
  return { sent: true };
}

/**
 * Mirroir une page dans Postgres, sans effet de bord.
 *
 * Sert au digest et à la lettre bimensuelle, qui lisaient déjà `alerts` avant
 * ce chantier et n'ont pas à changer : ils continuent de lire une table
 * Postgres, à jour depuis quelques minutes au plus, jamais depuis Notion en
 * direct.
 */
async function mirror(record: AlertPageRecord): Promise<boolean> {
  const result = await db()
    .update(alerts)
    .set({
      status: record.status,
      verdict: record.verdict,
      finalText: serializeAlertContent(record.content),
      recommendedAction: record.content.recommendedAction.trim() || null,
    })
    .where(eq(alerts.notionPageId, record.pageId))
    .returning({ id: alerts.id });

  return result.length > 0;
}

/** Solde ce qu'une exécution vient de faire — utilisé par le cron et par `npm run cto:*`-like scripts. */
export async function syncAlertsFromNotion(now: Date = new Date()): Promise<AlertSyncReport> {
  const issue = configurationIssue();
  if (issue) {
    return { mirrored: 0, sent: 0, blocked: 0, backfilled: 0, orphans: 0, warnings: [issue] };
  }

  const report: AlertSyncReport = {
    mirrored: 0,
    sent: 0,
    blocked: 0,
    backfilled: 0,
    orphans: 0,
    warnings: [],
  };

  const backfill = await backfillMissingPages();
  report.backfilled = backfill.backfilled;
  report.warnings.push(...backfill.warnings);

  const records = await listAlertPages();

  for (const record of records) {
    if (record.status === "validated") {
      const outcome = await trySend(record, now);
      if (outcome.sent) {
        report.sent++;
        continue;
      }
      if (outcome.blocked) report.blocked++;
    }

    const mirrored = await mirror(record);
    if (mirrored) report.mirrored++;
    else report.orphans++; // page Notion sans ligne `alerts` — créée à la main, hors du produit
  }

  if (report.orphans > 0) {
    report.warnings.push(
      `${report.orphans} page(s) de la base « Sentinelle — Alertes » sans alerte correspondante en base ` +
        "— créée(s) à la main ? Le produit ne les envoie ni ne les affiche ailleurs.",
    );
  }

  console.info(
    `[sentinelle] synchro alertes : ${report.mirrored} mirrorée(s), ${report.sent} envoyée(s), ` +
      `${report.blocked} bloquée(s), ${report.backfilled} page(s) réparée(s)${
        report.orphans > 0 ? `, ${report.orphans} orpheline(s)` : ""
      }`,
  );

  return report;
}

export { VERDICT_LABEL };
