import { desc, eq, lt } from "drizzle-orm";
import { db } from "../db/client";
import { ctoSyncRuns } from "../db/schema";
import type { SyncReport } from "../notion";
import { sendSyncAlert } from "./notify";
import { newAlerts, summarizeSync } from "./rapport";

// ─────────────────────────────────────────────────────────────────────────────
// Le journal des balayages.
//
// Trois portes lancent la synchro — le Cron de 4 h, l'écran de pilotage, la
// commande — et toutes laissent ici leur rapport. Celui du Cron est le seul que
// personne ne regarde au moment où il est écrit : c'est pour lui que le journal
// existe, et c'est le seul qui peut déclencher un e-mail.
//
// **Le journal ne fait jamais échouer un balayage.** La synchro a déjà écrit ce
// qu'elle avait à écrire quand on arrive ici ; une table absente (migration pas
// encore appliquée) ou un envoi refusé se dit dans les logs, rien de plus.
// ─────────────────────────────────────────────────────────────────────────────

export type SyncRunSource = "cron" | "admin" | "commande";

export interface SyncRun {
  at: Date;
  source: string;
  ok: boolean;
  lines: string[];
  warnings: string[];
  alerts: string[];
  error: string | null;
  alertedAt: Date | null;
}

/** Au-delà, un rapport n'explique plus rien de l'état présent. */
const RETENTION_DAYS = 90;

function supervisionUrl(): string {
  const base = process.env.CTO_ORIGIN?.split(",")[0]?.trim() || "https://next-impact.digital";
  return `${base}/admin-cto/pilotage`;
}

/** Le dernier balayage réel, ou `null` s'il n'y en a pas encore (ou pas de journal). */
export async function lastSyncRun(): Promise<SyncRun | null> {
  try {
    const [row] = await db()
      .select({
        at: ctoSyncRuns.at,
        source: ctoSyncRuns.source,
        ok: ctoSyncRuns.ok,
        lines: ctoSyncRuns.lines,
        warnings: ctoSyncRuns.warnings,
        alerts: ctoSyncRuns.alerts,
        error: ctoSyncRuns.error,
        alertedAt: ctoSyncRuns.alertedAt,
      })
      .from(ctoSyncRuns)
      .orderBy(desc(ctoSyncRuns.at))
      .limit(1);
    return row ?? null;
  } catch (error) {
    console.error("[cto] journal des balayages illisible", error);
    return null;
  }
}

/**
 * Inscrit un balayage au journal, et prévient si `notify` le demande et qu'il
 * porte une alerte que le précédent ne portait pas.
 *
 * Un balayage à blanc n'est pas inscrit : il n'a rien écrit, et son rapport
 * remplacerait à l'écran celui du dernier balayage qui compte.
 */
export async function recordSyncRun(input: {
  source: SyncRunSource;
  report?: SyncReport;
  error?: string;
  notify?: boolean;
}): Promise<void> {
  if (input.report?.dryRun) return;

  try {
    const summary = input.report ? summarizeSync(input.report) : { lines: [], warnings: [], alerts: [] };
    const failed = input.error !== undefined;
    // Un échec est une alerte comme une autre : la même erreur deux nuits de
    // suite n'écrit qu'une fois.
    const alerts = failed ? [`Le balayage a échoué : ${input.error}`] : summary.alerts;

    const previous = await lastSyncRun();
    const [created] = await db()
      .insert(ctoSyncRuns)
      .values({
        source: input.source,
        ok: !failed,
        lines: summary.lines,
        warnings: summary.warnings,
        alerts,
        error: input.error ?? null,
      })
      .returning({ id: ctoSyncRuns.id });

    const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);
    await db().delete(ctoSyncRuns).where(lt(ctoSyncRuns.at, cutoff));

    const nouvelles = newAlerts(alerts, previous?.alerts ?? []);
    if (!input.notify || nouvelles.length === 0) return;

    await sendSyncAlert(nouvelles.length, failed, supervisionUrl());
    await db().update(ctoSyncRuns).set({ alertedAt: new Date() }).where(eq(ctoSyncRuns.id, created.id));
  } catch (error) {
    console.error("[cto] journal des balayages : écriture ou alerte impossible", error);
  }
}
