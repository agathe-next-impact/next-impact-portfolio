/**
 * Digest hebdomadaire de la veille — assemblage, en ligne de commande.
 *
 *   npm run cto:digest                          # assemble les brouillons de la dernière semaine complète
 *   npm run cto:digest -- --semaine 2026-W39    # … d'une semaine donnée
 *   npm run cto:digest -- --a-blanc             # dit ce qui serait assemblé, n'écrit rien
 *
 * Le balayage quotidien (`/api/cto/cron`) assemble déjà les brouillons. La
 * retouche, la validation et l'envoi se font UNIQUEMENT depuis
 * `/admin-cto/pilotage/digests`, un digest à la fois : aucun envoi en lot, ni
 * d'ici ni d'ailleurs. Cette commande sert à tester un assemblage sur une
 * semaine passée. Lancer `npm run cto:sync` avant si les éditions viennent de
 * paraître.
 */

import "./load-env";

import { assembleWeek, parseWeek, previousWeek } from "../src/cto/digest";
import { syncSentinelle } from "../src/cto/sentinelle";

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--a-blanc");
  if (args.includes("--envoyer")) {
    throw new Error(
      "L'envoi en ligne de commande est retiré : chaque digest se relit, se valide et s'envoie " +
        "un par un depuis /admin-cto/pilotage/digests.",
    );
  }
  const index = args.indexOf("--semaine");
  const week = index >= 0 ? args[index + 1] : previousWeek(new Date());
  if (!parseWeek(week)) throw new Error(`Semaine invalide : ${week} (attendu : 2026-W39).`);

  if (!dryRun) {
    const veille = await syncSentinelle();
    console.log(
      `Veille technique : ${veille.refreshed}/${veille.clients} export(s) relu(s), ` +
        `${veille.letters.created} lettre(s) nouvelle(s), ${veille.letters.updated} mise(s) à jour.`,
    );
    for (const warning of veille.warnings) console.log(`  · ${warning}`);
  }

  const report = await assembleWeek(week, { dryRun });
  console.log(
    `\n${week}${dryRun ? " (à blanc)" : ""} : ${report.created} créé(s), ${report.refreshed} réassemblé(s), ` +
      `${report.frozen} déjà validé(s), ${report.empty} sans contenu, sur ${report.clients} accompagnement(s) actif(s).`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(`\n${error instanceof Error ? error.message : error}`);
    process.exit(1);
  });
