import {
  buildPlan,
  createCallBudget,
  runEndoflife,
  runOsv,
  runReleases,
  runWpscan,
  type CollectorRun,
} from "@sentinelle/collectors";
import { runMatching } from "@sentinelle/matching";
import { runRedaction } from "@sentinelle/redaction";
import { inngest } from "../client";

/**
 * Collecte quotidienne de la veille, puis croisement avec les stacks surveillées.
 *
 * 06 h 00 Europe/Paris : après la purge de 03 h 00 — un cron qui écrit ne doit
 * pas croiser un cron qui supprime — et avant les heures de bureau, pour qu'une
 * alerte du jour soit relisible le matin même.
 *
 * Un step par source, pour que le retry soit indépendant : OSV indisponible ne
 * doit pas faire recommencer les vingt requêtes endoflife qui viennent de
 * réussir. Le matching arrive en dernier, une fois tous les faits écrits, et
 * n'écrit que des brouillons : **aucune alerte ne part sans validation
 * humaine** (règle 4 du CLAUDE.md).
 *
 * Le budget d'appels est partagé par toute la passe et journalisé : le jour où
 * un client aura soixante composants, ce cron ne doit pas partir en soixante
 * requêtes par source.
 */
export const collectDaily = inngest.createFunction(
  {
    id: "sentinelle-collect-daily",
    name: "Sentinelle — collecte de veille",
    triggers: [{ cron: "TZ=Europe/Paris 0 6 * * *" }],
    retries: 2,
  },
  async ({ step }) => {
    const now = new Date();
    const budget = createCallBudget();

    const plan = await step.run("plan", async () => buildPlan());

    const runs: CollectorRun[] = [
      await step.run("collect-endoflife", async () => runEndoflife(plan, budget, now)),
      await step.run("collect-osv", async () => runOsv(plan, budget)),
      await step.run("collect-wpscan", async () => runWpscan(plan, budget)),
      await step.run("collect-releases", async () => runReleases(plan, budget)),
    ];

    for (const run of runs) {
      for (const failure of run.failures) {
        console.warn(`[sentinelle] ${run.source} : ${failure.product} — ${failure.reason}`);
      }
      for (const note of run.notes ?? []) {
        console.info(`[sentinelle] ${run.source} : ${note}`);
      }
    }

    const inserted = runs.reduce((total, run) => total + run.inserted, 0);
    const updated = runs.reduce((total, run) => total + run.updated, 0);
    console.info(
      `[sentinelle] collecte terminée : ${inserted} nouveaux faits, ${updated} mis à jour, ` +
        `${budget.spent()} appels sortants`,
    );

    const matching = await step.run("match", async () => runMatching(now));

    // La rédaction en dernier, dans son propre step : elle appelle une API
    // payante et un échec ne doit pas faire recommencer la collecte. Elle
    // n'écrit que des brouillons — c'est un humain qui validera.
    const redaction = await step.run("draft", async () => runRedaction(undefined, now));

    return {
      collectedAt: now.toISOString(),
      calls: budget.spent(),
      inserted,
      updated,
      alerts: matching.created,
      drafted: redaction.drafted,
      sources: runs,
    };
  },
);
