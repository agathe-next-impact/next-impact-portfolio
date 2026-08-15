import { and, eq, inArray, lt, sql } from "drizzle-orm";
import { db } from "@sentinelle/db/client";
import { alerts, clients, digests, intelItems, scans, stackItems } from "@sentinelle/db/schema";
import {
  anonymizableAlerts,
  cutoffs,
  expiredClients,
  expiredScans,
  type ClientRow,
  type ScanRow,
  type WrittenRow,
} from "./policy";

// ─────────────────────────────────────────────────────────────────────────────
// Exécution de la politique de conservation.
//
// Le SQL ne décide de rien : il présélectionne des candidats sur la date limite,
// et c'est `policy.ts` — testé — qui tranche ligne par ligne. Deux raisons :
//
//  1. Une suppression pilotée par une liste d'identifiants explicites se
//     journalise honnêtement (« ces 12 lignes »), là où un DELETE … WHERE ne
//     rend qu'un nombre.
//  2. La règle reste lisible et testable à un seul endroit. Un jour où la
//     durée changera, elle changera dans `RETENTION` et nulle part ailleurs.
//
// Toutes les fonctions sont idempotentes : relancer la passe une heure plus tard
// ne trouve plus rien à faire, et rien ne casse si deux crons se chevauchent.
// ─────────────────────────────────────────────────────────────────────────────

export interface PurgeReport {
  /** Ce qui a été fait, catégorie par catégorie. Toujours renvoyé, même à zéro. */
  scansDeleted: number;
  scanIdentifiersCleared: number;
  scanResultsPurged: number;
  clientsAnonymized: number;
  stackItemsErased: number;
  alertTextsPurged: number;
  digestTextsPurged: number;
  intelRawPurged: number;
}

export const EMPTY_REPORT: PurgeReport = {
  scansDeleted: 0,
  scanIdentifiersCleared: 0,
  scanResultsPurged: 0,
  clientsAnonymized: 0,
  stackItemsErased: 0,
  alertTextsPurged: 0,
  digestTextsPurged: 0,
  intelRawPurged: 0,
};

/**
 * Scans : empreintes d'IP à 24 h, lignes anonymes à 30 jours, résultats à
 * 12 mois, prospects à 3 ans.
 */
export async function purgeScans(now: Date): Promise<Partial<PurgeReport>> {
  const limits = cutoffs(now);

  // Présélection : tout ce qui a dépassé le plus court des seuils. Au-delà, la
  // décision revient à la politique.
  const candidates: ScanRow[] = await db()
    .select({
      id: scans.id,
      createdAt: scans.createdAt,
      leadEmail: scans.leadEmail,
      ipHash: scans.ipHash,
      userAgent: scans.userAgent,
      result: scans.result,
    })
    .from(scans)
    .where(lt(scans.createdAt, limits.scanIdentifiers));

  const verdict = expiredScans(candidates, now);

  if (verdict.rowsToDelete.length > 0) {
    await db().delete(scans).where(inArray(scans.id, verdict.rowsToDelete));
  }

  if (verdict.identifiersToClear.length > 0) {
    await db()
      .update(scans)
      .set({ ipHash: null, userAgent: null })
      .where(inArray(scans.id, verdict.identifiersToClear));
  }

  if (verdict.resultsToPurge.length > 0) {
    await db()
      .update(scans)
      .set({ result: null })
      .where(inArray(scans.id, verdict.resultsToPurge));
  }

  return {
    scansDeleted: verdict.rowsToDelete.length,
    scanIdentifiersCleared: verdict.identifiersToClear.length,
    scanResultsPurged: verdict.resultsToPurge.length,
  };
}

/**
 * Domaine réservé aux fiches effacées.
 *
 * `.invalid` est réservé par la RFC 2606 : aucune adresse de ce domaine ne peut
 * exister, donc rien ne peut y être envoyé par accident. C'est ce qui permet à
 * l'envoi (`admin/actions.ts`) de refuser une fiche anonymisée sans se demander
 * si l'adresse est « vraie ».
 */
export const ANONYMOUS_EMAIL_DOMAIN = "sentinelle.invalid";

/** Préfixe des adresses écrites par la purge. */
const ANONYMOUS_PREFIX = "efface-";

/** Identité de remplacement d'un client effacé — unique, et visiblement factice. */
export function anonymousEmail(clientId: string): string {
  return `${ANONYMOUS_PREFIX}${clientId}@${ANONYMOUS_EMAIL_DOMAIN}`;
}

/**
 * Cette adresse est-elle celle d'une fiche effacée ?
 *
 * Le préfixe compte autant que le domaine : les fiches de démonstration du seed
 * vivent sur le même domaine `.invalid` sans avoir été effacées, et leur
 * refuser un envoi en invoquant la purge donnerait une explication fausse.
 */
export function isAnonymizedEmail(email: string): boolean {
  const value = email.trim().toLowerCase();
  return value.startsWith(ANONYMOUS_PREFIX) && value.endsWith(`@${ANONYMOUS_EMAIL_DOMAIN}`);
}

/**
 * Clients résiliés depuis trois mois : stack supprimé, identité effacée.
 *
 * La ligne survit sans rien qui désigne quelqu'un. C'est ce qui permet de tenir
 * les deux promesses du §9 à la fois : plus de donnée personnelle passé le délai
 * de réactivation, et des alertes qui restent rattachables jusqu'à leur propre
 * échéance (preuve de la prestation rendue).
 */
export async function purgeCancelledClients(now: Date): Promise<Partial<PurgeReport>> {
  const limits = cutoffs(now);

  const candidates: ClientRow[] = await db()
    .select({ id: clients.id, active: clients.active, deactivatedAt: clients.deactivatedAt })
    .from(clients)
    .where(and(eq(clients.active, false), lt(clients.deactivatedAt, limits.cancellation)));

  const { toAnonymize } = expiredClients(candidates, now);
  if (toAnonymize.length === 0) return { clientsAnonymized: 0, stackItemsErased: 0 };

  const erased = await db()
    .delete(stackItems)
    .where(inArray(stackItems.clientId, toAnonymize))
    .returning({ id: stackItems.id });

  for (const clientId of toAnonymize) {
    await db()
      .update(clients)
      .set({
        email: anonymousEmail(clientId),
        name: "Client effacé",
        company: null,
        siteUrl: "",
        sector: null,
        notes: null,
        stripeCustomerId: null,
        stripeSubscriptionId: null,
      })
      .where(eq(clients.id, clientId));
  }

  return { clientsAnonymized: toAnonymize.length, stackItemsErased: erased.length };
}

/**
 * Textes d'alertes et de numéros, douze mois après la résiliation.
 * Le verdict et les dates restent : sans texte ni client, ils ne désignent plus
 * personne.
 */
export async function purgeWrittenTexts(now: Date): Promise<Partial<PurgeReport>> {
  const limits = cutoffs(now);

  const alertRows: WrittenRow[] = await db()
    .select({
      id: alerts.id,
      clientDeactivatedAt: clients.deactivatedAt,
      hasText: sql<boolean>`(${alerts.generatedText} is not null or ${alerts.finalText} is not null or ${alerts.recommendedAction} is not null)`,
    })
    .from(alerts)
    .innerJoin(clients, eq(alerts.clientId, clients.id))
    .where(lt(clients.deactivatedAt, limits.cancellationTexts));

  const alertIds = anonymizableAlerts(alertRows, now);
  if (alertIds.length > 0) {
    await db()
      .update(alerts)
      .set({ generatedText: null, finalText: null, recommendedAction: null })
      .where(inArray(alerts.id, alertIds));
  }

  const digestRows: WrittenRow[] = await db()
    .select({
      id: digests.id,
      clientDeactivatedAt: clients.deactivatedAt,
      hasText: sql<boolean>`(${digests.finalHtml} is not null or ${digests.blocks}::text <> '{}')`,
    })
    .from(digests)
    .innerJoin(clients, eq(digests.clientId, clients.id))
    .where(lt(clients.deactivatedAt, limits.cancellationTexts));

  const digestIds = anonymizableAlerts(digestRows, now);
  if (digestIds.length > 0) {
    await db()
      .update(digests)
      .set({ finalHtml: null, blocks: {} })
      .where(inArray(digests.id, digestIds));
  }

  return { alertTextsPurged: alertIds.length, digestTextsPurged: digestIds.length };
}

/**
 * Payload source des faits de veille, à 24 mois.
 *
 * Aucune donnée personnelle là-dedans : c'est de l'hygiène de volume, pas du
 * RGPD. Le fait lui-même (titre, plage affectée, sévérité) reste — c'est le
 * patrimoine du produit.
 */
export async function purgeIntelRaw(now: Date): Promise<Partial<PurgeReport>> {
  const limits = cutoffs(now);

  const purged = await db()
    .update(intelItems)
    .set({ raw: {} })
    .where(
      and(
        lt(intelItems.collectedAt, limits.intelRaw),
        sql`${intelItems.raw}::text <> '{}'`,
      ),
    )
    .returning({ id: intelItems.id });

  return { intelRawPurged: purged.length };
}

/**
 * Effacement sur demande — droit à l'effacement du RGPD, en une minute plutôt
 * qu'en écrivant du SQL à la main un dimanche.
 *
 * Par e-mail : le prospect (ses scans) et le client (sa fiche et, par cascade,
 * son stack, ses alertes et ses numéros). Par identifiant : le client seul.
 *
 * Ce que cette fonction ne peut pas faire, et qu'il faut dire à la personne qui
 * la demande : les sauvegardes ponctuelles de Neon survivent à la suppression
 * logique. L'effacement est effectif sous sept jours.
 */
export async function deleteAllDataFor(
  target: { email: string } | { clientId: string },
): Promise<{ scans: number; clients: number }> {
  if ("clientId" in target) {
    const removed = await db()
      .delete(clients)
      .where(eq(clients.id, target.clientId))
      .returning({ id: clients.id });

    return { scans: 0, clients: removed.length };
  }

  const email = target.email.trim().toLowerCase();

  const removedScans = await db()
    .delete(scans)
    .where(eq(sql`lower(${scans.leadEmail})`, email))
    .returning({ id: scans.id });

  // Cascade sur stack_items, alerts et digests : voir les clés étrangères du
  // schéma. C'est voulu — un effacement demandé n'est pas un effacement partiel.
  const removedClients = await db()
    .delete(clients)
    .where(eq(sql`lower(${clients.email})`, email))
    .returning({ id: clients.id });

  return { scans: removedScans.length, clients: removedClients.length };
}

/** Passe complète, dans l'ordre. Utilisée par le cron `retention-daily`. */
export async function runRetention(now: Date = new Date()): Promise<PurgeReport> {
  return {
    ...EMPTY_REPORT,
    ...(await purgeScans(now)),
    ...(await purgeCancelledClients(now)),
    ...(await purgeWrittenTexts(now)),
    ...(await purgeIntelRaw(now)),
  };
}

/** Reste-t-il quelque chose à dire dans le journal ? */
export function isEmptyReport(report: PurgeReport): boolean {
  return Object.values(report).every((count) => count === 0);
}
