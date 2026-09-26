import { and, eq, isNotNull, ne } from "drizzle-orm";
import { db } from "../db/client";
import { ctoClients, ctoSentinelleSnapshots } from "../db/schema";
import {
  currentLetters,
  digestOfLetter,
  upsertLetter,
  withdrawLetter,
  type LetterInput,
} from "../letters";
import type { Block } from "../notion/blocks";
import { fetchSentinelleExport, sentinelleExportConfig } from "./api";
import { SentinelleExportSchema, type SentinelleExport, type SentinelleLetter } from "./contract";

// ─────────────────────────────────────────────────────────────────────────────
// Synchro de la veille technique : l'export Sentinelle de chaque
// accompagnement relié, rangé en deux endroits.
//
//  - le relevé (fiche, alertes, radar) dans `cto_sentinelle_snapshots`, qui
//    sert au digest ;
//  - chaque numéro validé, en entier, dans `cto_letters` (source
//    `sentinelle`), où il se lit à côté des éditions Signaux Faibles.
//
// Un export illisible ne retire rien : le relevé précédent reste, les lettres
// déjà rangées aussi, et l'erreur est notée sur le relevé. Un retrait à tort se
// voit chez le client ; un retrait différé d'un jour ne se voit pas.
// ─────────────────────────────────────────────────────────────────────────────

export interface SentinelleSyncReport {
  clients: number;
  refreshed: number;
  failed: number;
  letters: { created: number; updated: number; unchanged: number; withdrawn: number };
  warnings: string[];
}

/** Clé de rapprochement d'un numéro Sentinelle dans `cto_letters`. */
export function sentinelleLetterKey(letterId: string): string {
  return `sentinelle-${letterId}`;
}

/** Les blocs de l'export ont déjà la forme de ceux de l'espace : on les reprend tels quels. */
export function letterInputFrom(letter: SentinelleLetter, clientId: string): LetterInput {
  return {
    notionPageId: sentinelleLetterKey(letter.id),
    source: "sentinelle",
    label: "Veille technique",
    action: letter.actions[0]?.action ?? null,
    scope: "personnalisee",
    sector: null,
    clientId,
    title: letter.title,
    period: new Date(letter.issueDate),
    chapo: letter.chapeau || null,
    body: letter.blocks as Block[],
  };
}

export async function syncSentinelle(options: { dryRun?: boolean } = {}): Promise<SentinelleSyncReport> {
  const dryRun = options.dryRun === true;
  const report: SentinelleSyncReport = {
    clients: 0,
    refreshed: 0,
    failed: 0,
    letters: { created: 0, updated: 0, unchanged: 0, withdrawn: 0 },
    warnings: [],
  };

  if (!sentinelleExportConfig()) {
    report.warnings.push(
      "SENTINELLE_EXPORT_URL ou SENTINELLE_EXPORT_SECRET absente : veille technique non balayée.",
    );
    return report;
  }

  const clients = await db()
    .select({
      id: ctoClients.id,
      company: ctoClients.company,
      sentinelleClientId: ctoClients.sentinelleClientId,
    })
    .from(ctoClients)
    .where(and(isNotNull(ctoClients.sentinelleClientId), ne(ctoClients.status, "clos")));

  const known = (await currentLetters()).filter((letter) => letter.source === "sentinelle");

  for (const client of clients) {
    if (!client.sentinelleClientId) continue;
    report.clients += 1;

    let data: SentinelleExport;
    try {
      data = await fetchSentinelleExport(client.sentinelleClientId);
    } catch (error) {
      report.failed += 1;
      const message = error instanceof Error ? error.message : "échec";
      report.warnings.push(`« ${client.company} » : ${message}`);
      if (!dryRun) {
        await db()
          .insert(ctoSentinelleSnapshots)
          .values({ clientId: client.id, data: {}, error: message, errorAt: new Date() })
          .onConflictDoUpdate({
            target: ctoSentinelleSnapshots.clientId,
            set: { error: message, errorAt: new Date() },
          });
      }
      continue;
    }

    report.refreshed += 1;
    if (!dryRun) {
      await db()
        .insert(ctoSentinelleSnapshots)
        .values({ clientId: client.id, data, fetchedAt: new Date(), error: null, errorAt: null })
        .onConflictDoUpdate({
          target: ctoSentinelleSnapshots.clientId,
          set: { data, fetchedAt: new Date(), error: null, errorAt: null },
        });
    }

    const mine = new Map(
      known.filter((letter) => letter.clientId === client.id).map((l) => [l.notionPageId, l]),
    );
    const kept = new Set<string>();

    for (const letter of data.letters) {
      const input = letterInputFrom(letter, client.id);
      kept.add(input.notionPageId);
      const etat = mine.get(input.notionPageId);
      if (etat && !etat.withdrawn && etat.digest === digestOfLetter(input)) {
        report.letters.unchanged += 1;
        continue;
      }
      if (!dryRun) await upsertLetter(input);
      if (etat) report.letters.updated += 1;
      else report.letters.created += 1;
    }

    // Sorti de l'export (fenêtre de six mois, ou numéro dévalidé) : retiré.
    for (const [key, etat] of mine) {
      if (etat.withdrawn || kept.has(key)) continue;
      if (!dryRun) await withdrawLetter(key);
      report.letters.withdrawn += 1;
    }
  }

  return report;
}

/** Le dernier export valide d'un accompagnement, ou null. */
export async function sentinelleStateFor(
  clientId: string,
): Promise<{ data: SentinelleExport; fetchedAt: Date; error: string | null } | null> {
  const [row] = await db()
    .select()
    .from(ctoSentinelleSnapshots)
    .where(eq(ctoSentinelleSnapshots.clientId, clientId))
    .limit(1);
  if (!row) return null;
  // Une ligne écrite sur échec avant tout succès porte `{}` : pas d'export.
  const parsed = SentinelleExportSchema.safeParse(row.data);
  if (!parsed.success) return null;
  return { data: parsed.data, fetchedAt: row.fetchedAt, error: row.error };
}
