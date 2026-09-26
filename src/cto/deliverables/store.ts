import { createHash } from "node:crypto";
import { and, desc, eq, inArray, notInArray, sql, type SQL } from "drizzle-orm";
import { db } from "../db/client";
import { ctoDeliverablePlacements, ctoDeliverables } from "../db/schema";
import type {
  Deliverable,
  DeliverableInput,
  DeliverableKind,
  DeliverablePayload,
  Livraison,
} from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Lecture et écriture des livrables — le côté base.
//
// **Rien n'est jamais mis à jour ni supprimé dans `cto_deliverables`.** C'est
// une contrainte, pas une observation : la table est append-only (parti pris 4
// de `db/schema.ts`), et une seule mise à jour bien intentionnée suffirait à
// détruire la propriété qui la justifie. Publier, corriger, retirer, republier :
// quatre gestes, quatre insertions.
//
// `setPlacement` est la seule écriture mutable de ce fichier, et elle vise une
// AUTRE table : le placement n'est pas un livrable, il n'a pas d'histoire à
// tenir. Le mélanger au contenu obligerait à choisir entre polluer l'historique
// et ne jamais voir un rangement remonter.
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
 * Enregistre où un livrable s'affiche.
 *
 * **Seule écriture mutable de cette couche, et assumée.** Le placement n'est pas
 * un livrable : le corriger ne corrige rien pour le client (cf.
 * `cto_deliverable_placements`). L'écrire à chaque balayage, même inchangé, coûte
 * une requête et évite d'avoir à comparer — la synchro le fait déjà pour le
 * contenu, qui, lui, le mérite.
 */
export async function setPlacement(notionPageId: string, featured: boolean): Promise<void> {
  await db()
    .insert(ctoDeliverablePlacements)
    .values({ notionPageId, featured })
    .onConflictDoUpdate({
      target: ctoDeliverablePlacements.notionPageId,
      set: { featured, updatedAt: new Date() },
    });
}

/**
 * Les types de livrables que seule l'administration lit.
 *
 * Une prestation porte son tarif : c'est du suivi commercial, pas un livrable
 * à montrer au client. Elle est synchronisée comme les autres (même table, même
 * historique), mais aucune lecture côté client ne la rend — ni l'espace, ni
 * les notifications, ni le dossier de restitution, qui passent tous par
 * `listForClient` ou `history`. Le filtre est ici, et pas dans chaque écran,
 * pour la même raison que la garde `clientId` de `history()`.
 */
export const ADMIN_ONLY_KINDS: readonly DeliverableKind[] = ["prestation"];

/**
 * Les livrables visibles par un accompagnement, dans leur version courante.
 *
 * Le tri d'affichage se fait en mémoire : `distinct on` impose son propre ordre
 * en SQL, et à quelques dizaines de lignes par client, ordonner ici coûte moins
 * cher qu'une sous-requête à relire dans six mois.
 */
export async function listForClient(clientId: string): Promise<Deliverable[]> {
  return currentDeliverables(
    and(eq(ctoDeliverables.clientId, clientId), notInArray(ctoDeliverables.kind, [...ADMIN_ONLY_KINDS])),
  );
}

/**
 * Les prestations de tous les accompagnements, dans leur version courante.
 * Réservé à l'administration (cf. `ADMIN_ONLY_KINDS`).
 */
export async function listPrestations(): Promise<Deliverable<"prestation">[]> {
  return (await currentDeliverables(eq(ctoDeliverables.kind, "prestation"))) as Deliverable<"prestation">[];
}

/**
 * Les dates de livraison des prestations d'un accompagnement, pour son
 * calendrier. La requête ne lit que le titre, la date et le statut : le tarif
 * ne quitte pas la base, il n'y a donc rien à oublier de filtrer à l'affichage.
 */
export async function livraisonsForClient(clientId: string): Promise<Livraison[]> {
  const rows = await db()
    .selectDistinctOn([ctoDeliverables.notionPageId], {
      title: ctoDeliverables.title,
      occurredAt: ctoDeliverables.occurredAt,
      statut: sql<string | null>`${ctoDeliverables.payload}->>'statut'`,
      withdrawnAt: ctoDeliverables.withdrawnAt,
    })
    .from(ctoDeliverables)
    .where(and(eq(ctoDeliverables.clientId, clientId), eq(ctoDeliverables.kind, "prestation")))
    .orderBy(ctoDeliverables.notionPageId, desc(ctoDeliverables.version));

  return rows.flatMap((row) =>
    row.withdrawnAt === null && row.occurredAt
      ? [{ title: row.title, date: row.occurredAt, statut: row.statut }]
      : [],
  );
}

async function currentDeliverables(where: SQL | undefined): Promise<Deliverable[]> {
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
      featured: ctoDeliverablePlacements.featured,
    })
    .from(ctoDeliverables)
    // Jointure GAUCHE : un livrable dont le placement n'a jamais été écrit
    // reste affichable, en archive. Une jointure stricte le ferait disparaître
    // de l'espace pour une donnée qui ne le concerne pas.
    .leftJoin(
      ctoDeliverablePlacements,
      eq(ctoDeliverablePlacements.notionPageId, ctoDeliverables.notionPageId),
    )
    .where(where)
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
export async function history(
  notionPageId: string,
  clientId: string,
): Promise<Deliverable[]> {
  const rows = await db()
    .select()
    .from(ctoDeliverables)
    // `clientId` n'est PAS un confort de requête : c'est la garde. L'identifiant
    // d'une page Notion voyage dans l'URL, et sans ce filtre une personne
    // pourrait lire l'historique d'un autre accompagnement en changeant un
    // segment. Le vérifier après coup dans la page marcherait aussi — mais un
    // jour quelqu'un appellerait `history()` sans refaire le contrôle.
    .where(
      and(
        eq(ctoDeliverables.notionPageId, notionPageId),
        eq(ctoDeliverables.clientId, clientId),
        // Même garde pour le type : l'identifiant d'une prestation dans l'URL
        // d'une autre catégorie ne doit pas en rendre le tarif.
        notInArray(ctoDeliverables.kind, [...ADMIN_ONLY_KINDS]),
      ),
    )
    .orderBy(desc(ctoDeliverables.version));

  // Les versions de retrait portent un payload vide : elles disent « à partir
  // d'ici, plus publié », et c'est une information de l'histoire, pas un trou.
  return rows.map((row) => ({ ...toDeliverable(row), withdrawn: row.withdrawnAt !== null }));
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
  featured?: boolean | null;
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
    featured: row.featured === true,
  };
}
