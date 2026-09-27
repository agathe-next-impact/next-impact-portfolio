import { and, desc, eq, ne, sql } from "drizzle-orm";
import { db } from "@sentinelle/db/client";
import { clients, subscriptionRequests } from "@sentinelle/db/schema";
import { clientSubscribed, inngest } from "@sentinelle/inngest";
import type { NewClient } from "@sentinelle/types";
import type { SubscriptionRequestInput } from "./request";

// ─────────────────────────────────────────────────────────────────────────────
// Demandes d'inscription et fiches abonnées.
//
// Le cycle : pending → activated | dismissed. Seule l'activation, faite par
// Agathe depuis l'admin, crée une fiche `clients` ; elle émet ensuite
// `sentinelle/client.subscribed`, qui analyse le site, amorce la fiche et envoie
// la bienvenue (avec le lien vers l'espace). La facturation se fait hors ligne.
// ─────────────────────────────────────────────────────────────────────────────

export type StoreResult<T = undefined> = { ok: true; value: T } | { ok: false; reason: string };

/**
 * Enregistre une demande, ou met à jour celle qui attend déjà pour la même
 * adresse (index unique partiel sur les demandes en attente). `isNew` dit s'il
 * faut prévenir Agathe : un second envoi du formulaire ne la relance pas.
 */
export async function recordSubscriptionRequest(
  input: SubscriptionRequestInput,
): Promise<{ id: string; isNew: boolean }> {
  const [row] = await db()
    .insert(subscriptionRequests)
    .values(input)
    .onConflictDoUpdate({
      target: subscriptionRequests.email,
      targetWhere: sql`${subscriptionRequests.status} = 'pending'`,
      set: {
        name: input.name,
        organisation: input.organisation,
        siteUrl: input.siteUrl,
        originScanId: sql`coalesce(excluded.origin_scan_id, ${subscriptionRequests.originScanId})`,
      },
    })
    // `xmax = 0` : la ligne vient d'être insérée, pas mise à jour.
    .returning({ id: subscriptionRequests.id, isNew: sql<boolean>`(xmax = 0)` });

  return { id: row.id, isNew: Boolean(row.isNew) };
}

export type SubscriptionRequestRow = typeof subscriptionRequests.$inferSelect;

/** Les demandes en attente, les plus anciennes d'abord, puis les dernières traitées. */
export async function listSubscriptionRequests(): Promise<{
  pending: SubscriptionRequestRow[];
  decided: SubscriptionRequestRow[];
}> {
  const [pending, decided] = await Promise.all([
    db()
      .select()
      .from(subscriptionRequests)
      .where(eq(subscriptionRequests.status, "pending"))
      .orderBy(subscriptionRequests.createdAt),
    db()
      .select()
      .from(subscriptionRequests)
      .where(ne(subscriptionRequests.status, "pending"))
      .orderBy(desc(subscriptionRequests.decidedAt))
      .limit(20),
  ]);
  return { pending, decided };
}

/**
 * Crée la fiche client, ou la remet en service si l'adresse existe déjà
 * (réabonnement après résiliation). Ce que l'onboarding a appris — secteur,
 * notes, versions déclarées — n'est jamais écrasé par une valeur vide.
 */
export async function upsertSubscriber(client: NewClient) {
  const [row] = await db()
    .insert(clients)
    .values(client)
    .onConflictDoUpdate({
      target: clients.email,
      set: {
        active: true,
        // Réabonnement : la date de résiliation s'efface, sans quoi la purge de
        // rétention effacerait dans trois mois les données d'un client actif.
        deactivatedAt: null,
        // La formule suit l'appelant : `veille` à l'activation d'une demande,
        // `accompagnement` depuis la commande de création manuelle.
        plan: sql`excluded.plan`,
        siteUrl: sql`coalesce(nullif(excluded.site_url, ''), ${clients.siteUrl})`,
        name: sql`coalesce(nullif(excluded.name, ''), ${clients.name})`,
        company: sql`coalesce(nullif(excluded.company, ''), ${clients.company})`,
      },
    })
    .returning({ id: clients.id, email: clients.email });

  return row;
}

/**
 * Active une demande : fiche créée (ou réactivée), demande marquée, puis
 * ouverture de l'abonnement en tâche de fond.
 *
 * La demande est réservée d'abord par une écriture conditionnelle : deux clics
 * sur « Activer » ne créent pas deux ouvertures. Si l'écriture de la fiche
 * échoue, la réservation est relâchée et la demande reste à activer.
 */
export async function activateSubscriptionRequest(
  requestId: string,
  now: Date = new Date(),
): Promise<StoreResult<{ clientId: string; email: string }>> {
  const [claimed] = await db()
    .update(subscriptionRequests)
    .set({ status: "activated", decidedAt: now })
    .where(and(eq(subscriptionRequests.id, requestId), eq(subscriptionRequests.status, "pending")))
    .returning();
  if (!claimed) return { ok: false, reason: "Demande introuvable ou déjà traitée." };

  let clientId: string;
  try {
    const row = await upsertSubscriber({
      email: claimed.email,
      name: claimed.name,
      company: claimed.organisation,
      siteUrl: claimed.siteUrl,
      plan: "veille",
      active: true,
    });
    clientId = row.id;
  } catch (error) {
    await db()
      .update(subscriptionRequests)
      .set({ status: "pending", decidedAt: null })
      .where(eq(subscriptionRequests.id, requestId));
    console.error("[sentinelle] activation impossible", error);
    return { ok: false, reason: "La fiche n'a pas pu être écrite : la demande reste à activer." };
  }

  await db()
    .update(subscriptionRequests)
    .set({ clientId })
    .where(eq(subscriptionRequests.id, requestId));

  // Analyse, amorçage de la fiche et bienvenue : hors de la requête, avec
  // reprises. Le rapport d'origine évite une seconde analyse.
  await inngest.send(
    clientSubscribed.create({
      clientId,
      scanId: claimed.originScanId ?? undefined,
      welcome: true,
    }),
  );

  return { ok: true, value: { clientId, email: claimed.email } };
}

/** Écarte une demande en attente (doublon, adresse fantaisiste, refus). */
export async function dismissSubscriptionRequest(
  requestId: string,
  now: Date = new Date(),
): Promise<StoreResult> {
  const [row] = await db()
    .update(subscriptionRequests)
    .set({ status: "dismissed", decidedAt: now })
    .where(and(eq(subscriptionRequests.id, requestId), eq(subscriptionRequests.status, "pending")))
    .returning({ id: subscriptionRequests.id });
  return row ? { ok: true, value: undefined } : { ok: false, reason: "Demande introuvable ou déjà traitée." };
}

/**
 * Résilie une fiche. On ne la supprime pas : la date fait courir la fenêtre de
 * réactivation puis l'effacement (retention/policy.ts).
 */
export async function deactivateClient(clientId: string, now: Date = new Date()): Promise<StoreResult> {
  const [row] = await db()
    .update(clients)
    .set({ active: false, deactivatedAt: now })
    .where(and(eq(clients.id, clientId), eq(clients.active, true)))
    .returning({ id: clients.id });
  return row ? { ok: true, value: undefined } : { ok: false, reason: "Fiche introuvable ou déjà résiliée." };
}
