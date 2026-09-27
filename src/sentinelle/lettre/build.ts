import { and, desc, eq, lt, sql } from "drizzle-orm";
import { db } from "@sentinelle/db/client";
import { clients, digests } from "@sentinelle/db/schema";
import { loadConstate } from "@sentinelle/newsletter/build";
import {
  formatNewsletterPeriod,
  parseNewsletterPeriod,
  previousNewsletterPeriod,
  type NewsletterPeriod,
} from "@sentinelle/newsletter/period";
import { collectDossier } from "./collecte";
import { previousIssueFrom, type LettreContext, type PreviousIssue } from "./context";
import {
  emptyProduction,
  isQuietIssue,
  parseIssue,
  rebuildRefusal,
  ISSUE_VERSION,
  type IssueContent,
} from "./issue";
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
// le rejeu du cron ne doit pas effacer une relecture en cours. La seule
// réécriture admise est celle d'un numéro resté sans lettre, demandée depuis
// l'admin (`rebuildIssue`) : il n'y a là aucune relecture à perdre.
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

/**
 * Le numéro précédent de ce client, pour la continuité.
 *
 * « Précédent » se lit sur la période, pas sur la date d'écriture : un numéro
 * refabriqué après coup a des successeurs en base, et prendre le plus récent
 * lui donnerait pour passé un numéro de son avenir. Les clés « AAAA-MM-N » se
 * comparent comme du texte.
 */
async function loadPreviousIssue(
  clientId: string,
  period: NewsletterPeriod,
): Promise<PreviousIssue | null> {
  const key = formatNewsletterPeriod(period);

  const [row] = await db()
    .select({ period: digests.period, blocks: digests.blocks })
    .from(digests)
    .where(and(eq(digests.clientId, clientId), lt(digests.period, key)))
    .orderBy(desc(digests.period))
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

  const fabrique = await fabricate(client, period, now);

  return store(client.id, key, fabrique.issue, fabrique.reason, fabrique.words);
}

/**
 * Refabrique un numéro dont la fabrication n'a pas abouti.
 *
 * Le cron ne repasse jamais sur une période écoulée : sans ce geste, un numéro
 * raté le reste, et la seule issue serait d'aller effacer la ligne en base.
 *
 * La ligne n'est pas supprimée, elle est réécrite en place. Un échec de la
 * seconde tentative laisse donc un numéro raté avec sa nouvelle raison, jamais
 * un trou. Et elle n'est réécrite que si elle est toujours un brouillon sans
 * lettre **au moment d'écrire** : la fabrication dure des minutes, pendant
 * lesquelles une autre refabrication a pu aboutir.
 */
export async function rebuildIssue(digestId: string, now: Date = new Date()): Promise<IssueOutcome> {
  const [row] = await db()
    .select({
      status: digests.status,
      period: digests.period,
      blocks: digests.blocks,
      clientId: clients.id,
      siteUrl: clients.siteUrl,
      sector: clients.sector,
      notes: clients.notes,
      clientActive: clients.active,
    })
    .from(digests)
    .innerJoin(clients, eq(digests.clientId, clients.id))
    .where(eq(digests.id, digestId))
    .limit(1);

  if (!row) {
    return { clientId: "", created: false, written: false, reason: "numéro introuvable", words: 0 };
  }

  const refus = rebuildRefusal(row);
  const period = parseNewsletterPeriod(row.period);
  if (refus || !period) {
    return {
      clientId: row.clientId,
      created: false,
      written: false,
      reason: refus ?? "période illisible",
      words: 0,
    };
  }

  const client: ClientRow = {
    id: row.clientId,
    siteUrl: row.siteUrl,
    sector: row.sector,
    notes: row.notes,
  };
  const fabrique = await fabricate(client, period, now);

  const ecrits = await db()
    .update(digests)
    .set({ blocks: fabrique.issue, finalHtml: null })
    .where(
      and(
        eq(digests.id, digestId),
        eq(digests.status, "draft"),
        sql`jsonb_typeof(${digests.blocks} -> 'lettre') is distinct from 'object'`,
      ),
    )
    .returning({ id: digests.id });

  if (ecrits.length === 0) {
    return {
      clientId: client.id,
      created: false,
      written: false,
      reason: "numéro modifié pendant la refabrication : rien n'a été écrit",
      words: 0,
    };
  }

  return {
    clientId: client.id,
    created: false,
    written: Boolean(fabrique.issue.lettre),
    reason: fabrique.reason,
    words: fabrique.words,
  };
}

/** Les deux passes, sans rien écrire en base : constaté → collecte → rédaction. */
async function fabricate(
  client: ClientRow,
  period: NewsletterPeriod,
  now: Date,
): Promise<{ issue: IssueContent; reason?: string; words: number }> {
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
    return { issue, reason: collecte.reason, words: 0 };
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
    return { issue, reason: redaction.reason, words: 0 };
  }

  issue.lettre = redaction.lettre;
  issue.production.notesRedaction = redaction.lettre.notesDeProduction;
  issue.production.signalements = redaction.guard.warnings;

  return { issue, words: redaction.guard.wordCount };
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
