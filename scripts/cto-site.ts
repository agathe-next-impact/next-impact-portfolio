/**
 * Relevé technique des sites (WP Umbrella) — la même chose que le Cron de 4 h,
 * à la demande.
 *
 *   npm run cto:site               # relève et écrit
 *   npm run cto:site -- --a-blanc  # interroge WP Umbrella, n'écrit rien
 *
 * Utile après avoir renseigné « ID projet WP Umbrella » sur une fiche (puis
 * `npm run cto:sync` pour que l'identifiant arrive en base), pour voir le
 * relevé sans attendre la nuit.
 */

// EN PREMIER, avant tout module qui lit `process.env` au chargement.
import "./load-env";

import { syncSites } from "../src/cto/site";

async function main() {
  const dryRun = process.argv.slice(2).includes("--a-blanc");
  const report = await syncSites({ dryRun });

  if (dryRun) console.log("\n— À BLANC : WP Umbrella a été interrogé, rien n'a été écrit. —");
  console.log(
    `\n${report.projects} projet(s) suivi(s) : ${report.refreshed} relevé(s), ` +
      `${report.failed} échec(s), ${report.reportsArchived} rapport(s) ${dryRun ? "à rapatrier" : "rapatrié(s)"}.`,
  );

  if (report.warnings.length > 0) {
    console.log(`\n${report.warnings.length} point(s) à regarder :`);
    for (const warning of report.warnings) console.log(`  · ${warning}`);
  } else {
    console.log("\nRien à signaler.");
  }

  if (report.failed > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
