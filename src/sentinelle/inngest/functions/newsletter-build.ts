import { runNewsletterBuild } from "@sentinelle/newsletter";
import { inngest } from "../client";

/**
 * Fabrication des numéros de la lettre bimensuelle.
 *
 * Le 1er et le 15 à 07 h 00 Europe/Paris — l'offre est bimensuelle, pas
 * mensuelle : un cron mensuel aurait produit un numéro sur deux, et l'index
 * unique `(client_id, period)` aurait rejeté le second en silence si la clé de
 * période n'avait pas été conçue pour (voir `newsletter/period.ts`).
 *
 * Rien ne part d'ici. La fonction n'écrit que des brouillons ; c'est l'admin qui
 * relit, valide et envoie (règle 4). Un rejeu ne réécrit aucun numéro existant.
 */
export const newsletterBuild = inngest.createFunction(
  {
    id: "sentinelle-newsletter-build",
    name: "Sentinelle — fabrication des numéros",
    triggers: [{ cron: "TZ=Europe/Paris 0 7 1,15 * *" }],
    retries: 1,
  },
  async ({ step }) => {
    const now = new Date();

    // Un seul step : la fabrication est déjà idempotente par période, et un
    // retry qui reprend tout ne produit aucun doublon.
    const report = await step.run("build", async () => runNewsletterBuild(now));

    for (const [reason, count] of Object.entries(report.failures)) {
      console.warn(`[sentinelle] numéros ${report.period} : ${count} × ${reason}`);
    }

    return report;
  },
);
