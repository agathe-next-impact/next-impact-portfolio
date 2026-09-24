/**
 * Notification des accompagnements CTO — séparée de la synchro.
 *
 *   npm run cto:notify               # envoie, avance la date de chaque client notifié
 *   npm run cto:notify -- --a-blanc  # dit qui serait notifié, n'envoie rien, n'avance rien
 *
 * À lancer quand le contenu déjà synchronisé (`npm run cto:sync`) est prêt à
 * être annoncé — pas automatiquement à chaque balayage. Voir
 * `src/cto/notify/store.ts` pour comment elle retrouve, après coup, ce qui a
 * été publié depuis la dernière notification de chaque client.
 */

import "./load-env";

import { notifyPendingPublications, type NotifyReport } from "../src/cto/notify";

function printReport(report: NotifyReport, dryRun: boolean): void {
  if (dryRun) console.log("\n— À BLANC : rien n'a été envoyé, aucune date n'a avancé. —");

  const verbe = dryRun ? "seraient notifiés" : "notifiés";
  console.log(`\n${report.notified} accompagnement(s) ${verbe}, ${report.upToDate} déjà à jour.`);

  if (report.warnings.length > 0) {
    console.log(`\n${report.warnings.length} point(s) à regarder :`);
    for (const warning of report.warnings) console.log(`  · ${warning}`);
  } else {
    console.log("\nRien à signaler.");
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--a-blanc");

  const report = await notifyPendingPublications({ dryRun });
  printReport(report, dryRun);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(`\n${error instanceof Error ? error.message : error}`);
    process.exit(1);
  });
