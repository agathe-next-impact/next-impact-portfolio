import type { DraftedAlert, Verdict } from "@sentinelle/types";
import { alertsDatabaseId, createPage, pageUrl, queryDatabase, updatePage, type NotionPage } from "./client";
import * as p from "./properties";
import {
  alertKey,
  PROPS,
  statusFromLabel,
  STATUS_LABEL,
  verdictFromLabel,
  VERDICT_LABEL,
} from "./schema";

// ─────────────────────────────────────────────────────────────────────────────
// Les pages de la base « Sentinelle — Alertes ».
//
// Deux moments d'écriture, comme avant :
//
//  1. `createAlertPage` — le matching crée la page dès qu'un fait matche, avec
//     ce qu'il sait déjà (client, composant, source, verdict proposé). Statut
//     Brouillon, pas encore de texte.
//  2. `writeDraftContent` — la rédaction y dépose le texte du modèle une fois
//     prêt.
//
// Entre les deux et après, c'est Notion qui commande : un humain relit,
// corrige, et fait passer `Statut` à Validée directement dans la page. Rien
// n'est écrit dans Notion sans passer par ici — c'est le seul endroit qui
// connaît la forme exacte des propriétés.
// ─────────────────────────────────────────────────────────────────────────────

export interface AlertPageInput {
  clientId: string;
  clientLabel: string;
  siteUrl: string;
  component: string;
  verdict: Verdict;
  source: string;
  severity: string | null;
  key: string;
}

/** Crée la page d'une alerte tout juste matchée, statut Brouillon. */
export async function createAlertPage(input: AlertPageInput): Promise<string> {
  const page = await createPage(alertsDatabaseId(), {
    [PROPS.title]: p.titleProp("(à rédiger)"),
    [PROPS.client]: p.richTextProp(input.clientLabel),
    [PROPS.site]: p.urlProp(input.siteUrl),
    [PROPS.component]: p.richTextProp(input.component),
    [PROPS.verdict]: p.selectProp(VERDICT_LABEL[input.verdict]),
    [PROPS.status]: p.selectProp(STATUS_LABEL.draft),
    [PROPS.source]: p.urlProp(input.source.startsWith("http") ? input.source : null),
    [PROPS.severity]: p.richTextProp(input.severity ?? ""),
    [PROPS.key]: p.richTextProp(input.key),
    [PROPS.clientId]: p.richTextProp(input.clientId),
  });

  return page.id;
}

/** Dépose le texte rédigé dans une page déjà créée. Le verdict peut avoir été abaissé par les garde-fous. */
export async function writeDraftContent(pageId: string, draft: DraftedAlert): Promise<void> {
  await updatePage(pageId, {
    [PROPS.title]: p.titleProp(draft.title || "(à rédiger)"),
    [PROPS.verdict]: p.selectProp(VERDICT_LABEL[draft.verdict]),
    [PROPS.body]: p.richTextProp(draft.body),
    [PROPS.whatItChanges]: p.richTextProp(draft.whatItChanges),
    [PROPS.recommendedAction]: p.richTextProp(draft.recommendedAction),
    [PROPS.diyPossible]: p.checkboxProp(draft.diyPossible),
    [PROPS.effortEstimate]: p.richTextProp(draft.effortEstimate),
  });
}

/** Statut Envoyée, datée — jamais l'inverse : voir `sync.ts`. */
export async function markSent(pageId: string, sentAt: Date): Promise<void> {
  await updatePage(pageId, {
    [PROPS.status]: p.selectProp(STATUS_LABEL.sent),
    [PROPS.sentAt]: p.dateProp(sentAt),
  });
}

/** Une alerte telle que la synchro la lit — le miroir Postgres en dérive. */
export interface AlertPageRecord {
  pageId: string;
  key: string | null;
  clientId: string | null;
  status: ReturnType<typeof statusFromLabel>;
  verdict: Verdict | null;
  content: DraftedAlert;
  sentAt: Date | null;
}

/** Relit une page — jamais d'exception : un champ manquant ou vide rend une valeur neutre. */
export function parseAlertPage(page: NotionPage): AlertPageRecord {
  return {
    pageId: page.id,
    key: p.text(page, PROPS.key),
    clientId: p.text(page, PROPS.clientId),
    status: statusFromLabel(p.select(page, PROPS.status)),
    verdict: verdictFromLabel(p.select(page, PROPS.verdict)),
    content: {
      verdict: verdictFromLabel(p.select(page, PROPS.verdict)) ?? "info",
      title: p.text(page, PROPS.title) ?? "",
      body: p.text(page, PROPS.body) ?? "",
      whatItChanges: p.text(page, PROPS.whatItChanges) ?? "",
      recommendedAction: p.text(page, PROPS.recommendedAction) ?? "",
      diyPossible: p.checkbox(page, PROPS.diyPossible),
      effortEstimate: p.text(page, PROPS.effortEstimate) ?? "",
    },
    sentAt: p.date(page, PROPS.sentAt),
  };
}

/** Toutes les pages de la base. Volume attendu : quelques dizaines à quelques centaines. */
export async function listAlertPages(): Promise<AlertPageRecord[]> {
  const pages = await queryDatabase(alertsDatabaseId());
  return pages.map(parseAlertPage);
}

export { alertKey, pageUrl };
