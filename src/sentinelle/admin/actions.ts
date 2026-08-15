import { and, eq, inArray } from "drizzle-orm";
import { db } from "@sentinelle/db/client";
import { alerts, clients, intelItems, stackItems } from "@sentinelle/db/schema";
import { renderAlertEmail } from "@sentinelle/emails/render";
import { sendSentinelleMail } from "@sentinelle/emails";
import { isAnonymizedEmail } from "@sentinelle/retention";
import type { AlertStatus, DraftedAlert } from "@sentinelle/types";
import { initialContent, missingForValidation, serializeAlertContent } from "./content";

// ─────────────────────────────────────────────────────────────────────────────
// Écritures de l'admin — le cycle draft → validated → sent.
//
// C'est le module où vit la règle 4 (« aucune alerte ne part sans validation
// humaine »). Elle n'est pas une consigne : elle est une suite de refus.
//
//   · on ne valide pas un contenu incomplet ;
//   · on n'envoie que ce qui est `validated` — jamais un brouillon ;
//   · on n'envoie jamais deux fois (le statut `sent` est terminal) ;
//   · on n'envoie pas à une fiche résiliée ni à une fiche anonymisée par la
//     purge — ce serait écrire à quelqu'un qui a demandé l'effacement.
//
// Aucune de ces fonctions ne lève sur une règle métier : elles renvoient une
// raison en français, que l'admin affiche telle quelle. Une exception est
// réservée à ce qui est vraiment cassé (base injoignable, SMTP en panne).
// ─────────────────────────────────────────────────────────────────────────────

export type ActionResult<T = undefined> =
  | ({ ok: true } & (T extends undefined ? { value?: never } : { value: T }))
  | { ok: false; reason: string };

function refuse(reason: string): { ok: false; reason: string } {
  return { ok: false, reason };
}

/** Statuts depuis lesquels un texte peut encore être modifié. */
const EDITABLE: AlertStatus[] = ["draft", "validated"];

async function loadAlert(alertId: string) {
  const [row] = await db()
    .select({
      id: alerts.id,
      status: alerts.status,
      verdict: alerts.verdict,
      finalText: alerts.finalText,
      generatedText: alerts.generatedText,
      clientId: clients.id,
      clientEmail: clients.email,
      clientActive: clients.active,
      clientSite: clients.siteUrl,
      componentLabel: stackItems.label,
      componentVersion: stackItems.version,
      intelTitle: intelItems.title,
    })
    .from(alerts)
    .innerJoin(clients, eq(alerts.clientId, clients.id))
    .innerJoin(stackItems, eq(alerts.stackItemId, stackItems.id))
    .innerJoin(intelItems, eq(alerts.intelItemId, intelItems.id))
    .where(eq(alerts.id, alertId))
    .limit(1);

  return row ?? null;
}

/**
 * Enregistre le texte relu.
 *
 * N'avance pas le statut : relire et valider sont deux gestes distincts, et
 * l'admin doit pouvoir sauvegarder une relecture en cours sans engager d'envoi.
 * Le verdict, lui, suit le contenu — c'est celui qui partira.
 */
export async function saveAlertContent(
  alertId: string,
  content: DraftedAlert,
): Promise<ActionResult> {
  const alert = await loadAlert(alertId);
  if (!alert) return refuse("Alerte introuvable.");
  if (!EDITABLE.includes(alert.status)) {
    return refuse(`Alerte ${alert.status === "sent" ? "déjà envoyée" : "close"} : non modifiable.`);
  }

  await db()
    .update(alerts)
    .set({
      finalText: serializeAlertContent(content),
      verdict: content.verdict,
      recommendedAction: content.recommendedAction.trim() || null,
    })
    .where(eq(alerts.id, alertId));

  return { ok: true };
}

/**
 * Valide une alerte : elle devient envoyable.
 *
 * Le contenu passé en paramètre est enregistré au passage, pour que « valider »
 * depuis le formulaire ne demande pas deux clics. Sans contenu fourni, c'est
 * celui de la base qui est vérifié — c'est le cas de la validation en lot depuis
 * la liste d'un client.
 */
export async function validateAlert(
  alertId: string,
  content?: DraftedAlert,
): Promise<ActionResult> {
  const alert = await loadAlert(alertId);
  if (!alert) return refuse("Alerte introuvable.");
  if (alert.status === "sent") return refuse("Alerte déjà envoyée.");
  if (!EDITABLE.includes(alert.status)) return refuse("Alerte close : rouvrez-la d'abord.");

  const retenu = content ?? initialContent(alert);
  const manques = missingForValidation(retenu);
  if (manques.length > 0) {
    return refuse(`Il manque ${manques.join(", ")}.`);
  }

  await db()
    .update(alerts)
    .set({
      status: "validated",
      finalText: serializeAlertContent(retenu),
      verdict: retenu.verdict,
      recommendedAction: retenu.recommendedAction.trim(),
    })
    .where(eq(alerts.id, alertId));

  return { ok: true };
}

/** Écarte une alerte : elle ne partira pas, et ne reviendra pas dans la file. */
export async function dismissAlert(alertId: string): Promise<ActionResult> {
  const alert = await loadAlert(alertId);
  if (!alert) return refuse("Alerte introuvable.");
  if (alert.status === "sent") return refuse("Alerte déjà envoyée : elle ne peut plus être écartée.");

  await db().update(alerts).set({ status: "dismissed" }).where(eq(alerts.id, alertId));
  return { ok: true };
}

/** Remet une alerte écartée dans la file. */
export async function reopenAlert(alertId: string): Promise<ActionResult> {
  const alert = await loadAlert(alertId);
  if (!alert) return refuse("Alerte introuvable.");
  if (alert.status !== "dismissed" && alert.status !== "resolved") {
    return refuse("Cette alerte est déjà dans la file.");
  }

  await db().update(alerts).set({ status: "draft" }).where(eq(alerts.id, alertId));
  return { ok: true };
}

/**
 * Écarte d'un coup toutes les alertes ouvertes d'un composant.
 *
 * Le geste que réclame le constat du lot 2 : vingt-neuf alertes sur un même
 * paquet npm se traitent en une décision, pas en vingt-neuf. Ne touche jamais
 * une alerte envoyée.
 */
export async function dismissComponent(
  clientId: string,
  stackItemId: string,
): Promise<ActionResult<number>> {
  const closed = await db()
    .update(alerts)
    .set({ status: "dismissed" })
    .where(
      and(
        eq(alerts.clientId, clientId),
        eq(alerts.stackItemId, stackItemId),
        inArray(alerts.status, ["draft", "validated"]),
      ),
    )
    .returning({ id: alerts.id });

  return { ok: true, value: closed.length };
}

export interface SendOutcome {
  messageId: string | null;
  to: string;
  subject: string;
}

/**
 * Envoie une alerte validée, puis la marque envoyée.
 *
 * L'ordre compte : on écrit `sent` **après** l'envoi. L'inverse donnerait une
 * alerte marquée envoyée que le client n'a jamais reçue, ce qu'aucune relecture
 * ne rattrape. Le risque symétrique — envoi réussi, écriture perdue — se voit,
 * lui, dans la file : l'alerte y reste validée et un second envoi est possible.
 * Entre un doublon visible et un silence invisible, on choisit le doublon.
 */
export async function sendAlert(
  alertId: string,
  now: Date = new Date(),
): Promise<ActionResult<SendOutcome>> {
  const alert = await loadAlert(alertId);
  if (!alert) return refuse("Alerte introuvable.");

  if (alert.status === "sent") return refuse("Alerte déjà envoyée.");
  if (alert.status !== "validated") {
    return refuse("Alerte non validée : la relecture humaine est obligatoire avant l'envoi.");
  }
  if (!alert.clientActive) {
    return refuse("Abonnement résilié : aucun envoi.");
  }
  if (isAnonymizedEmail(alert.clientEmail)) {
    return refuse("Fiche anonymisée par la purge : plus d'adresse de destination.");
  }
  // `.invalid` est réservé par la RFC 2606 : aucune adresse de ce domaine
  // n'existe. C'est ce qu'utilisent les fiches de démonstration du seed — leur
  // envoi ne doit pas partir chercher un serveur SMTP pour rien, ni ressembler
  // à une panne quand il échouera.
  if (/\.invalid$/i.test(alert.clientEmail.trim())) {
    return refuse("Adresse de démonstration (.invalid) : aucun envoi possible.");
  }

  const content = initialContent(alert);
  const manques = missingForValidation(content);
  if (manques.length > 0) return refuse(`Il manque ${manques.join(", ")}.`);

  const mail = await renderAlertEmail({
    content,
    component: { label: alert.componentLabel, version: alert.componentVersion },
    siteUrl: alert.clientSite,
    sentAt: now,
  });

  const { messageId } = await sendSentinelleMail({
    to: alert.clientEmail,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
  });

  await db()
    .update(alerts)
    .set({ status: "sent", sentAt: now })
    .where(eq(alerts.id, alertId));

  console.info(
    `[sentinelle] alerte ${alertId} envoyée à ${alert.clientEmail} (${messageId ?? "sans id"})`,
  );

  return { ok: true, value: { messageId, to: alert.clientEmail, subject: mail.subject } };
}
