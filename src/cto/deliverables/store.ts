import { createHash } from "node:crypto";
import { desc, eq, inArray } from "drizzle-orm";
import { db } from "../db/client";
import { ctoDeliverables } from "../db/schema";
import type {
  Deliverable,
  DeliverableInput,
  DeliverableKind,
  DeliverablePayload,
} from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Lecture et écriture des livrables — le côté base.
//
// **Aucune fonction de ce fichier ne fait d'UPDATE ni de DELETE.** C'est une
// contrainte, pas une observation : la table est append-only (parti pris 4 de
// `db/schema.ts`), et une seule mise à jour bien intentionnée suffirait à
// détruire la propriété qui la justifie. Publier, corriger, retirer, republier :
// quatre gestes, quatre insertions.
//
// La version courante d'un livrable est celle de plus haut numéro pour un même
// `notionPageId`. Elle se calcule, elle ne se marque pas — un drapeau
// « courant » à maintenir finit par mentir le jour d'une écriture partielle.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * État courant d'un livrable, du strict point de vue de la synchro.
 *
 * Volontairement plus pauvre que `Deliverable` : la synchro a besoin de savoir
 * où en est l'histoire, pas de relire le contenu.
 */
export interface DeliverableState {
  notionPageId: string;
  clientId: string;
  version: number;
  digest: string;
  withdrawn: boolean;
}

/**
 * Empreinte du contenu publié.
 *
 * Calculée sur les clés triées, pour qu'un réordonnancement des propriétés côté
 * Notion ne passe pas pour une correction. Le titre et la date en font partie :
 * ce sont des éléments du livrable, pas des métadonnées de transport.
 */
export function digestOf(input: {
  title: string;
  occurredAt: Date | null;
  payload: DeliverablePayload | Record<string, never>;
}): string {
  const canonical = JSON.stringify({
    title: input.title,
    occurredAt: input.occurredAt ? input.occurredAt.toISOString() : null,
    payload: sortKeys(input.payload),
  });
  return createHash("sha256").update(canonical).digest("hex");
}

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === "object") {
    const source = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(source).sort()) out[key] = sortKeys(source[key]);
    return out;
  }
  return value;
}

/**
 * Les versions courantes d'un type de livrable, tous accompagnements confondus.
 *
 * `distinct on` plutôt qu'une jointure sur un maximum : Postgres rend une ligne
 * par `notionPageId` en un seul balayage, et la requête reste lisible.
 * Contrainte de la clause, à ne pas contourner : l'ordre DOIT commencer par la
 * colonne distinguée.
 */
export async function currentStates(kind: DeliverableKind): Promise<DeliverableState[]> {
  const rows = await db()
    .selectDistinctOn([ctoDeliverables.notionPageId], {
      notionPageId: ctoDeliverables.notionPageId,
      clientId: ctoDeliverables.clientId,
      version: ctoDeliverables.version,
      digest: ctoDeliverables.digest,
      withdrawnAt: ctoDeliverables.withdrawnAt,
    })
    .from(ctoDeliverables)
    .where(eq(ctoDeliverables.kind, kind))
    .orderBy(ctoDeliverables.notionPageId, desc(ctoDeliverables.version));

  return rows.map((row) => ({
    notionPageId: row.notionPageId,
    clientId: row.clientId,
    version: row.version,
    digest: row.digest,
    withdrawn: row.withdrawnAt !== null,
  }));
}

/**
 * Écrit une nouvelle version d'un livrable.
 *
 * `previousVersion` vient de l'appelant plutôt que d'une relecture : la synchro
 * a déjà l'état complet en mémoire, et le relire ferait une requête de plus par
 * livrable pour un renseignement qu'elle possède.
 */
export async function appendVersion(
  input: DeliverableInput,
  previousVersion: number,
): Promise<void> {
  await db().insert(ctoDeliverables).values({
    clientId: input.clientId,
    notionPageId: input.notionPageId,
    kind: input.kind,
    version: previousVersion + 1,
    title: input.title,
    payload: input.payload,
    digest: digestOf(input),
    occurredAt: input.occurredAt,
  });
}

/**
 * Retire un livrable de l'espace en écrivant une version de retrait.
 *
 * Le contenu n'est pas recopié : une version de retrait n'a rien à dire de plus
 * que « à partir d'ici, ce livrable n'est plus publié ». Son empreinte est celle
 * de l'état retiré, pour qu'un second balayage ne réécrive pas un retrait déjà
 * écrit.
 */
export async function appendWithdrawal(
  state: DeliverableState,
  kind: DeliverableKind,
  title: string,
): Promise<void> {
  await db().insert(ctoDeliverables).values({
    clientId: state.clientId,
    notionPageId: state.notionPageId,
    kind,
    version: state.version + 1,
    title,
    payload: {},
    digest: state.digest,
    withdrawnAt: new Date(),
  });
}

/**
 * Les livrables visibles par un accompagnement, dans leur version courante.
 *
 * Le tri d'affichage se fait en mémoire : `distinct on` impose son propre ordre
 * en SQL, et à quelques dizaines de lignes par client, ordonner ici coûte moins
 * cher qu'une sous-requête à relire dans six mois.
 */
export async function listForClient(clientId: string): Promise<Deliverable[]> {
  const rows = await db()
    .selectDistinctOn([ctoDeliverables.notionPageId], {
      id: ctoDeliverables.id,
      clientId: ctoDeliverables.clientId,
      notionPageId: ctoDeliverables.notionPageId,
      kind: ctoDeliverables.kind,
      version: ctoDeliverables.version,
      title: ctoDeliverables.title,
      payload: ctoDeliverables.payload,
      occurredAt: ctoDeliverables.occurredAt,
      withdrawnAt: ctoDeliverables.withdrawnAt,
      recordedAt: ctoDeliverables.recordedAt,
    })
    .from(ctoDeliverables)
    .where(eq(ctoDeliverables.clientId, clientId))
    .orderBy(ctoDeliverables.notionPageId, desc(ctoDeliverables.version));

  return rows.filter((row) => row.withdrawnAt === null).map(toDeliverable);
}

/**
 * L'historique complet d'un livrable, de la dernière version à la première.
 *
 * Pas encore affiché : c'est la couche que l'écran « ce qui a changé » et
 * l'export de restitution consommeront. Exposée dès maintenant parce que c'est
 * elle qui justifie la table — une archive qu'on ne sait pas relire n'en est
 * pas une.
 */
export async function history(notionPageId: string): Promise<Deliverable[]> {
  const rows = await db()
    .select()
    .from(ctoDeliverables)
    .where(eq(ctoDeliverables.notionPageId, notionPageId))
    .orderBy(desc(ctoDeliverables.version));

  return rows.map(toDeliverable);
}

/** Compte les livrables visibles, par accompagnement. Sert au rapport de synchro. */
export async function countsByClient(clientIds: string[]): Promise<Map<string, number>> {
  const counts = new Map<string, number>();
  if (clientIds.length === 0) return counts;

  const rows = await db()
    .selectDistinctOn([ctoDeliverables.notionPageId], {
      clientId: ctoDeliverables.clientId,
      notionPageId: ctoDeliverables.notionPageId,
      version: ctoDeliverables.version,
      withdrawnAt: ctoDeliverables.withdrawnAt,
    })
    .from(ctoDeliverables)
    .where(inArray(ctoDeliverables.clientId, clientIds))
    .orderBy(ctoDeliverables.notionPageId, desc(ctoDeliverables.version));

  for (const row of rows) {
    if (row.withdrawnAt !== null) continue;
    counts.set(row.clientId, (counts.get(row.clientId) ?? 0) + 1);
  }
  return counts;
}

function toDeliverable(row: {
  id: string;
  clientId: string;
  notionPageId: string;
  kind: DeliverableKind;
  version: number;
  title: string;
  payload: unknown;
  occurredAt: Date | null;
  recordedAt: Date;
}): Deliverable {
  return {
    id: row.id,
    clientId: row.clientId,
    notionPageId: row.notionPageId,
    kind: row.kind,
    version: row.version,
    title: row.title,
    payload: row.payload as DeliverablePayload,
    occurredAt: row.occurredAt,
    recordedAt: row.recordedAt,
  };
}
