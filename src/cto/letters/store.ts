import { createHash } from "node:crypto";
import { and, desc, eq, gte, isNull, or, sql } from "drizzle-orm";
import { db } from "../db/client";
import { ctoClients, ctoLetters } from "../db/schema";
import type { Block } from "../notion/blocks";

// ─────────────────────────────────────────────────────────────────────────────
// Les lettres de veille — lecture et écriture.
//
// Deux différences avec `deliverables/`, et elles découlent toutes deux de la
// nature d'une lettre :
//
//  1. **Elle se remplace, elle ne s'empile pas.** Un relevé de décisions engage
//     dans la durée ; une lettre est une publication datée. On ne corrige pas
//     l'édition d'août en février, on publie celle de février.
//  2. **Elle n'appartient à personne en particulier.** La générale existe en un
//     exemplaire pour tous les accompagnements. C'est à la LECTURE que se décide
//     qui la voit, pas à l'écriture — sans quoi une correction obligerait à
//     repasser sur autant de copies que de clients.
// ─────────────────────────────────────────────────────────────────────────────

export type LetterScope = "generale" | "sectorielle" | "personnalisee";

/** Une lettre en liste : tout sauf le corps, qui pèse et ne sert qu'à la lecture. */
export interface LetterSummary {
  notionPageId: string;
  scope: LetterScope;
  sector: string | null;
  title: string;
  period: Date | null;
  chapo: string | null;
  syncedAt: Date;
}

export interface Letter extends LetterSummary {
  body: Block[];
}

export interface LetterInput {
  notionPageId: string;
  scope: LetterScope;
  sector: string | null;
  clientId: string | null;
  title: string;
  period: Date | null;
  chapo: string | null;
  body: Block[];
}

/**
 * Fenêtre d'archives ouverte au client, en mois.
 *
 * Six, parce que c'est la durée d'engagement initiale de l'offre : le client
 * dispose de l'intégralité de ce qu'il a payé, et pas d'une bibliothèque qui
 * grossit indéfiniment. Au-delà, la lettre sort de l'espace sans être effacée —
 * elle redeviendrait visible si la fenêtre s'élargissait.
 */
export const ARCHIVE_MONTHS = 6;

export function digestOfLetter(input: {
  title: string;
  chapo: string | null;
  body: Block[];
}): string {
  return createHash("sha256")
    .update(JSON.stringify({ title: input.title, chapo: input.chapo, body: input.body }))
    .digest("hex");
}

/** L'état de chaque lettre déjà connue. Sert à ne réécrire que ce qui a bougé. */
export async function currentLetters(): Promise<
  { notionPageId: string; digest: string; withdrawn: boolean }[]
> {
  const rows = await db()
    .select({
      notionPageId: ctoLetters.notionPageId,
      digest: ctoLetters.digest,
      withdrawnAt: ctoLetters.withdrawnAt,
    })
    .from(ctoLetters);

  return rows.map((row) => ({
    notionPageId: row.notionPageId,
    digest: row.digest,
    withdrawn: row.withdrawnAt !== null,
  }));
}

/**
 * Écrit ou remplace une lettre.
 *
 * `withdrawnAt` est remis à null : republier une lettre retirée doit la faire
 * revenir, sans quoi une sortie de fenêtre suivie d'un élargissement laisserait
 * une archive invisible pour toujours.
 */
export async function upsertLetter(input: LetterInput): Promise<void> {
  const digest = digestOfLetter(input);

  await db()
    .insert(ctoLetters)
    .values({
      notionPageId: input.notionPageId,
      scope: input.scope,
      sector: input.sector,
      clientId: input.clientId,
      title: input.title,
      period: input.period,
      chapo: input.chapo,
      body: input.body,
      digest,
      withdrawnAt: null,
    })
    .onConflictDoUpdate({
      target: ctoLetters.notionPageId,
      set: {
        scope: input.scope,
        sector: input.sector,
        clientId: input.clientId,
        title: input.title,
        period: input.period,
        chapo: input.chapo,
        body: input.body,
        digest,
        withdrawnAt: null,
        syncedAt: new Date(),
      },
    });
}

/** Retire une lettre de l'espace. Le contenu reste, la visibilité tombe. */
export async function withdrawLetter(notionPageId: string): Promise<void> {
  await db()
    .update(ctoLetters)
    .set({ withdrawnAt: new Date() })
    .where(
      and(eq(ctoLetters.notionPageId, notionPageId), isNull(ctoLetters.withdrawnAt)),
    );
}

/**
 * La condition de visibilité d'une lettre pour un accompagnement.
 *
 * Trois cas dans une seule expression, réutilisée par la liste et par la lecture
 * d'une lettre isolée. Les écrire deux fois serait la garantie qu'un jour l'une
 * des deux soit plus permissive que l'autre.
 */
function visibleTo(clientId: string) {
  return or(
    eq(ctoLetters.scope, "generale"),
    and(
      eq(ctoLetters.scope, "sectorielle"),
      sql`${ctoLetters.sector} is not null and ${ctoLetters.sector} = (
        select ${ctoClients.sector} from ${ctoClients} where ${ctoClients.id} = ${clientId}
      )`,
    ),
    and(eq(ctoLetters.scope, "personnalisee"), eq(ctoLetters.clientId, clientId)),
  );
}

function windowStart(months = ARCHIVE_MONTHS): Date {
  const debut = new Date();
  debut.setMonth(debut.getMonth() - months);
  return debut;
}

/** Les lettres accessibles à un accompagnement, la plus récente en tête. */
export async function lettersForClient(
  clientId: string,
  months = ARCHIVE_MONTHS,
): Promise<LetterSummary[]> {
  const rows = await db()
    .select({
      notionPageId: ctoLetters.notionPageId,
      scope: ctoLetters.scope,
      sector: ctoLetters.sector,
      title: ctoLetters.title,
      period: ctoLetters.period,
      chapo: ctoLetters.chapo,
      syncedAt: ctoLetters.syncedAt,
    })
    .from(ctoLetters)
    .where(
      and(
        isNull(ctoLetters.withdrawnAt),
        gte(ctoLetters.period, windowStart(months)),
        visibleTo(clientId),
      ),
    )
    .orderBy(desc(ctoLetters.period));

  return rows;
}

/**
 * Une lettre et son corps, si cet accompagnement y a droit.
 *
 * La visibilité est vérifiée DANS la requête, comme pour l'historique d'un
 * livrable : l'identifiant voyage dans l'URL, et un contrôle laissé à la page
 * finit par être oublié par la page suivante.
 */
export async function letterForClient(
  notionPageId: string,
  clientId: string,
  months = ARCHIVE_MONTHS,
): Promise<Letter | null> {
  const [row] = await db()
    .select({
      notionPageId: ctoLetters.notionPageId,
      scope: ctoLetters.scope,
      sector: ctoLetters.sector,
      title: ctoLetters.title,
      period: ctoLetters.period,
      chapo: ctoLetters.chapo,
      syncedAt: ctoLetters.syncedAt,
      body: ctoLetters.body,
    })
    .from(ctoLetters)
    .where(
      and(
        eq(ctoLetters.notionPageId, notionPageId),
        isNull(ctoLetters.withdrawnAt),
        gte(ctoLetters.period, windowStart(months)),
        visibleTo(clientId),
      ),
    )
    .limit(1);

  if (!row) return null;
  return { ...row, body: row.body as Block[] };
}
