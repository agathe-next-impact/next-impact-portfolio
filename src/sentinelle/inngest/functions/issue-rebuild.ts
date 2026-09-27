import { rebuildIssue } from "@sentinelle/lettre";
import { inngest } from "../client";
import { issueRebuildRequested } from "../events";

/**
 * Refabrication d'un numéro resté sans lettre, à la demande de l'admin.
 *
 * Le cron du 1er et du 15 ne fabrique que la période en cours : un numéro dont
 * la collecte ou la rédaction a échoué ne serait jamais retenté. Cette fonction
 * est ce second essai, et rien d'autre — elle refuse tout numéro qui porte déjà
 * une lettre, et n'écrit que des brouillons (règle 4).
 *
 * Un numéro à la fois par identifiant : deux clics ne lancent pas deux collectes
 * en parallèle. La seconde attend la première, trouve la lettre écrite et
 * s'arrête avant de rien dépenser.
 */
export const issueRebuild = inngest.createFunction(
  {
    id: "sentinelle-issue-rebuild",
    name: "Sentinelle — refabrication d'un numéro",
    triggers: [issueRebuildRequested],
    concurrency: { key: "event.data.digestId", limit: 1 },
    retries: 1,
  },
  async ({ event, step }) => {
    const { digestId } = event.data;

    const outcome = await step.run(`rebuild-${digestId}`, async () => rebuildIssue(digestId));

    if (outcome.reason) {
      console.warn(`[sentinelle] refabrication ${digestId} incomplète — ${outcome.reason}`);
    } else {
      console.info(`[sentinelle] refabrication ${digestId} : lettre écrite, ${outcome.words} mots`);
    }

    return outcome;
  },
);
