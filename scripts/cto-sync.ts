/**
 * Synchronisation de l'atelier Notion vers l'espace client.
 *
 *   npm run cto:sync                 # balaie et applique
 *   npm run cto:sync -- --a-blanc    # dit ce qu'il ferait, n'écrit rien
 *   npm run cto:sync -- --forcer     # autorise un retrait de masse
 *
 * Commande et non route web, pour l'instant : tant qu'elle se lance à la main
 * après un comité, elle n'a besoin ni d'authentification ni d'ordonnanceur, et
 * son rapport se lit dans le terminal de celui qui vient de publier. Le Cron
 * quotidien appellera la même fonction, une fois la route écrite.
 */

// EN PREMIER : `src/cto/db/client.ts` et la passerelle Notion lisent
// `process.env` dès leur premier appel. Voir `scripts/load-env.ts`.
import "./load-env";

import { configurationIssue, syncFromNotion, type SyncReport } from "../src/cto/notion";

function pad(value: number): string {
  return String(value).padStart(3, " ");
}

function printReport(report: SyncReport): void {
  if (report.dryRun) console.log("\n— À BLANC : tout a été lu, rien n'a été écrit. —");
  console.log(`\nAccompagnements rattachés : ${report.clientsMapped}`);
  console.log("\n  base            publiés  à la une  créés  màj  restaurés  inchangés  retirés");
  console.log("  ─────────────── ───────  ────────  ─────  ───  ─────────  ─────────  ───────");

  for (const kind of report.kinds) {
    console.log(
      `  ${kind.kind.padEnd(15)} ${pad(kind.published)}      ${pad(kind.featured)}     ` +
        `${pad(kind.created)}  ${pad(kind.updated)}  ${pad(kind.restored)}        ` +
        `${pad(kind.unchanged)}        ${pad(kind.withdrawn)}`,
    );
  }

  if (report.warnings.length > 0) {
    console.log(`\n${report.warnings.length} point(s) à regarder :`);
    for (const warning of report.warnings) console.log(`  · ${warning}`);
  } else {
    console.log("\nRien à signaler.");
  }
}

async function main() {
  const args = process.argv.slice(2);

  // Le défaut de configuration se dit AVANT toute requête, et nomme toutes les
  // variables manquantes d'un coup : les découvrir une par une coûterait une
  // exécution par variable.
  const issue = configurationIssue();
  if (issue) {
    console.error(
      `${issue}\nLeurs valeurs figurent au bas de la page Notion « Direction technique — clients ».`,
    );
    process.exit(1);
  }

  const report = await syncFromNotion({
    force: args.includes("--forcer"),
    dryRun: args.includes("--a-blanc"),
  });
  printReport(report);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(`\n${error instanceof Error ? error.message : error}`);
    process.exit(1);
  });
