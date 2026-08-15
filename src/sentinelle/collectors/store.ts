import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "@sentinelle/db/client";
import { intelItems } from "@sentinelle/db/schema";
import type { NewIntelItem } from "@sentinelle/types";

// ─────────────────────────────────────────────────────────────────────────────
// Écriture des faits de veille — le seul endroit du module qui touche la base.
//
// L'idempotence est portée par l'index unique `(source, external_id)`, pas par
// du code applicatif : relancer un collecteur dix fois écrit exactement le même
// état. C'est ce que le pilote HTTP ne peut pas garantir (une requête peut
// partir deux fois) et ce qu'un moteur de base de données garantit gratuitement.
//
// Conflit = mise à jour, pas ignorance : une fin de support repoussée, une
// sévérité révisée ou un titre corrigé doivent se propager. Rejouer reste sans
// effet tant que la source n'a pas changé.
// ─────────────────────────────────────────────────────────────────────────────

/** Au-delà, on découpe : une requête d'insertion ne doit pas peser un mégaoctet. */
const CHUNK = 200;

export interface SaveReport {
  inserted: number;
  updated: number;
}

/**
 * Faits déjà connus parmi une liste d'identifiants source.
 *
 * Sert à ne pas redemander à OSV le détail de failles qu'on possède déjà : sur
 * un paquet à trente vulnérabilités connues, c'est la différence entre trente
 * appels par jour et zéro. L'index unique reste le garde-fou ; ceci n'est qu'une
 * économie, et elle doit rester une économie — jamais une condition de
 * correction.
 *
 * La comparaison porte sur la partie avant `#` : une faille à plusieurs plages
 * disjointes est stockée en autant de lignes suffixées `#1`, `#2`, et il faut
 * la reconnaître à partir de son identifiant nu. Pour les autres collecteurs,
 * qui n'utilisent pas ce suffixe, l'opération est neutre.
 */
export async function knownExternalIds(
  source: string,
  ids: string[],
): Promise<Set<string>> {
  if (ids.length === 0) return new Set();

  const base = sql<string>`split_part(${intelItems.externalId}, '#', 1)`;

  const rows = await db()
    .select({ id: base })
    .from(intelItems)
    .where(and(eq(intelItems.source, source), inArray(base, ids)));

  return new Set(rows.map((row) => row.id));
}

export async function saveIntel(items: NewIntelItem[]): Promise<SaveReport> {
  const report: SaveReport = { inserted: 0, updated: 0 };
  if (items.length === 0) return report;

  for (let start = 0; start < items.length; start += CHUNK) {
    const chunk = items.slice(start, start + CHUNK);

    const rows = await db()
      .insert(intelItems)
      .values(chunk)
      .onConflictDoUpdate({
        target: [intelItems.source, intelItems.externalId],
        set: {
          kind: sql`excluded.kind`,
          targetSlug: sql`excluded.target_slug`,
          targetType: sql`excluded.target_type`,
          targetEcosystem: sql`excluded.target_ecosystem`,
          affectedRange: sql`excluded.affected_range`,
          fixedIn: sql`excluded.fixed_in`,
          severity: sql`excluded.severity`,
          title: sql`excluded.title`,
          raw: sql`excluded.raw`,
          publishedAt: sql`excluded.published_at`,
          collectedAt: sql`now()`,
        },
      })
      // `xmax = 0` distingue l'insertion de la mise à jour dans un upsert
      // Postgres : c'est la seule façon de journaliser « 3 nouveaux faits »
      // plutôt que « 40 lignes touchées », qui ne veut rien dire.
      .returning({ inserted: sql<boolean>`(xmax = 0)` });

    for (const row of rows) {
      if (row.inserted) report.inserted++;
      else report.updated++;
    }
  }

  return report;
}
