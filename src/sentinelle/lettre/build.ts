import { and, desc, eq, ne } from "drizzle-orm";
import { db } from "@sentinelle/db/client";
import { clients, digests } from "@sentinelle/db/schema";
import { loadConstate } from "@sentinelle/newsletter/build";
import {
  formatNewsletterPeriod,
  previousNewsletterPeriod,
  type NewsletterPeriod,
} from "@sentinelle/newsletter/period";
import { collectDossier } from "./collecte";
import { previousIssueFrom, type LettreContext, type PreviousIssue } from "./context";
import { emptyProduction, isQuietIssue, parseIssue, ISSUE_VERSION, type IssueContent } from "./issue";
import { writeLettre } from "./redaction";

// ─────────────────────────────────────────────────────────────────────────────
// Fabrication d'un numéro : constaté → collecte → rédaction.
//
// Un client à la fois, et **une fonction par client** : c'est l'unité que
// l'appelant Inngest transforme en step, donc en invocation HTTP séparée. Sans
// ce découpage, vingt clients partageraient un seul `maxDuration` et le
// vingtième ne serait jamais écrit.
//
// ⚠️ **La contrainte de durée est réelle et elle est côté plateforme.** Une
// collecte à trente recherches se compte en minutes ; `maxDuration` sur la route
// Inngest la borne. Si les collectes dépassent régulièrement, le geste suivant
// n'est pas de raccourcir la recherche — c'est de passer la collecte sur l'API
// Batches, où la latence n'a aucune importance pour un numéro bimensuel et où
// le coût est divisé par deux.
//
// Un numéro déjà écrit n'est jamais réécrit, même en brouillon (règle du lot 3) :
// le rejeu du cron ne doit pas effacer une relecture en cours.
// ─────────────────────────────────────────────────────────────────────────────

export interface ClientRow {
  id: string;
  siteUrl: string;
  sector: string | null;
  notes: string | null;
}

export interface IssueOutcome {
  clientId: string;
  created: boolean;
  /** La lettre a-t-elle été écrite et acceptée par les garde-fous ? */
  written: boolean;
  reason?: string;
  words: number;
}

/** Le numéro précédent de ce client, pour la continuité. */
async function loadPreviousIssue(
  clientId: string,
  period: NewsletterPeriod,
): Promise<PreviousIssue | null> {
  const key = formatNewsletterPeriod(period);

  const [row] = await db()
    .select({ period: digests.period, blocks: digests.blocks })
    .from(digests)
    .where(and(eq(digests.clientId, clientId), ne(digests.period, key)))
    .orderBy(desc(digests.createdAt))
    .limit(1);

  if (!row) return null;

  const issue = parseIssue(row.blocks);
  if (!issue?.lettre) return null;

  return previousIssueFrom(issue.lettre, row.period);
}

/**
 * Fabrique le numéro d'un client et l'écrit en base.
 *
 * Écrit **toujours** une ligne, même quand la collecte ou la rédaction échoue :
 * un numéro raté qui apparaît dans la file de relecture avec sa raison vaut
 * mieux qu'un client silencieusement sauté. C'est le même principe que le
 * webhook de paiement — perdre la trace est le pire résultat.
 */
export async function buildAndStoreIssue(
  client: ClientRow,
  period: NewsletterPeriod,
  now: Date = new Date(),
): Promise<IssueOutcome> {
  const key = formatNewsletterPeriod(period);

  const [existant] = await db()
    .select({ id: digests.id })
    .from(digests)
    .where(and(eq(digests.clientId, client.id), eq(digests.period, key)))
    .limit(1);

  if (existant) {
    return { clientId: client.id, created: false, written: false, reason: "déjà en place", words: 0 };
  }

  const { blocks, names } = await loadConstate(client.id, period, now);
  const previousIssue = await loadPreviousIssue(client.id, period);

  const context: LettreContext = {
    periodLabel: formatNewsletterPeriod(period),
    siteUrl: client.siteUrl,
    sector: client.sector,
    notes: client.notes,
    blocks,
    previousIssue,
  };

  const issue: IssueContent = {
    version: ISSUE_VERSION,
    constate: blocks,
    dossier: null,
    lettre: null,
    production: emptyProduction(),
  };

  // ── Passe 1 — collecte ────────────────────────────────────────────────
  const collecte = await collectDossier(context);

  issue.production.consommation.recherches = collecte.telemetry.searches;
  issue.production.consommation.lectures = collecte.telemetry.fetches;
  issue.production.consommation.reprises = collecte.telemetry.continuations;
  issue.production.consommation.jetonsEntree = collecte.telemetry.inputTokens;
  issue.production.consommation.jetonsSortie = collecte.telemetry.outputTokens;

  if (!collecte.ok) {
    issue.production.erreurs.push(`collecte : ${collecte.reason}`);
    return store(client.id, key, issue, collecte.reason);
  }

  issue.dossier = collecte.dossier;
  issue.production.pagesAnalysees = collecte.dossier.pagesAnalysees;
  issue.production.pagesNonAnalysees = collecte.dossier.pagesNonAnalysees;
  issue.production.aConfirmer = collecte.dossier.aConfirmer;
  issue.production.notesCollecte = collecte.dossier.notesDeProduction;

  // ── Passe 2 — rédaction ───────────────────────────────────────────────
  const redaction = await writeLettre(context, collecte.dossier, {
    ficheNames: names,
    quiet: isQuietIssue(blocks),
  });

  issue.production.consommation.jetonsEntree += redaction.telemetry.inputTokens;
  issue.production.consommation.jetonsSortie += redaction.telemetry.outputTokens;

  if (!redaction.ok) {
    issue.production.erreurs.push(`rédaction : ${redaction.reason}`);
    if (redaction.guard) issue.production.signalements = redaction.guard.warnings;
    return store(client.id, key, issue, redaction.reason);
  }

  issue.lettre = redaction.lettre;
  issue.production.notesRedaction = redaction.lettre.notesDeProduction;
  issue.production.signalements = redaction.guard.warnings;

  return store(client.id, key, issue, undefined, redaction.guard.wordCount);
}

async function store(
  clientId: string,
  period: string,
  issue: IssueContent,
  reason?: string,
  words = 0,
): Promise<IssueOutcome> {
  const inserted = await db()
    .insert(digests)
    .values({ clientId, period, status: "draft", blocks: issue })
    // L'unicité est dans le moteur : un rejeu n'écrit pas un second numéro.
    .onConflictDoNothing({ target: [digests.clientId, digests.period] })
    .returning({ id: digests.id });

  return {
    clientId,
    created: inserted.length > 0,
    written: Boolean(issue.lettre),
    reason,
    words,
  };
}

/** Les abonnés actifs à servir pour cette période. */
export async function listClientsForIssue(): Promise<ClientRow[]> {
  return db()
    .select({
      id: clients.id,
      siteUrl: clients.siteUrl,
      sector: clients.sector,
      notes: clients.notes,
    })
    .from(clients)
    .where(eq(clients.active, true));
}

export { formatNewsletterPeriod, previousNewsletterPeriod };
