import { buildAndStoreIssue, listClientsForIssue } from "@sentinelle/lettre";
import { formatNewsletterPeriod, newsletterPeriodAt } from "@sentinelle/newsletter/period";
import { inngest } from "../client";

/**
 * Fabrication des numéros de la lettre bimensuelle.
 *
 * Le 1er et le 15 à 07 h 00 Europe/Paris — l'offre est bimensuelle, pas
 * mensuelle : un cron mensuel aurait produit un numéro sur deux, et l'index
 * unique `(client_id, period)` aurait rejeté le second en silence si la clé de
 * période n'avait pas été conçue pour (voir `newsletter/period.ts`).
 *
 * **Un step par client**, et c'est structurel : chaque step est une invocation
 * HTTP distincte, donc son propre `maxDuration`. Un numéro se paie en minutes
 * (jusqu'à trente recherches web par client), et vingt clients dans un seul step
 * ne verraient jamais le vingtième. Le découpage donne aussi la reprise : un
 * client qui échoue est retenté seul, les autres restent acquis.
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
    const period = newsletterPeriodAt(now);
    const key = formatNewsletterPeriod(period);
    const stamp = now.toISOString();

    const clients = await step.run("load-clients", async () => listClientsForIssue());

    const report = { period: key, clients: clients.length, created: 0, written: 0, failed: 0 };
    const failures: Record<string, number> = {};

    for (const client of clients) {
      // L'identifiant du step porte la période : deux numéros du même client
      // dans la même exécution ne peuvent pas exister, mais un rejeu du cron sur
      // une autre période ne doit pas réutiliser un résultat mémorisé.
      const outcome = await step.run(`issue-${key}-${client.id}`, async () =>
        // L'horloge est passée explicitement : un step rejoué des heures plus
        // tard doit fabriquer le numéro de SA période, pas celui du jour.
        buildAndStoreIssue(client, period, new Date(stamp)),
      );

      if (outcome.created) report.created++;
      if (outcome.written) report.written++;

      if (outcome.reason && outcome.reason !== "déjà en place") {
        report.failed++;
        failures[outcome.reason] = (failures[outcome.reason] ?? 0) + 1;
        console.warn(`[sentinelle] numéro ${key} incomplet (${client.id}) — ${outcome.reason}`);
      }
    }

    for (const [reason, count] of Object.entries(failures)) {
      console.warn(`[sentinelle] numéros ${key} : ${count} × ${reason}`);
    }

    console.info(
      `[sentinelle] numéros ${key} : ${report.created} créés, ${report.written} lettres écrites, ` +
        `${report.failed} incomplets`,
    );

    return report;
  },
);
