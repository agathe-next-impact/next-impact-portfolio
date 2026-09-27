import { syncAlertsFromNotion } from "@sentinelle/notion";
import { inngest } from "../client";

/**
 * Synchro des alertes depuis Notion, et leur envoi.
 *
 * Depuis que la relecture d'une alerte vit dans Notion (2026-09), c'est cette
 * fonction — pas un clic dans l'admin — qui transforme un Statut passé à
 * « Validée » en e-mail parti. Toutes les demi-heures : assez tôt pour qu'une
 * validation en fin de matinée parte avant la pause déjeuner, sans réveiller
 * l'API Notion à chaque minute pour un volume qui se compte en dizaines par
 * jour au plus.
 *
 * Un seul exemplaire à la fois (`concurrency: 1`) : l'envoi est un effet de
 * bord, deux passes qui se chevaucheraient pourraient lire la même alerte
 * Validée avant que la première n'ait eu le temps d'écrire `sentAt`.
 */
export const alertSync = inngest.createFunction(
  {
    id: "sentinelle-alert-sync",
    name: "Sentinelle — synchro et envoi des alertes",
    triggers: [{ cron: "*/30 * * * *" }],
    concurrency: { limit: 1 },
    retries: 1,
  },
  async ({ step }) => {
    return step.run("sync", async () => syncAlertsFromNotion());
  },
);
