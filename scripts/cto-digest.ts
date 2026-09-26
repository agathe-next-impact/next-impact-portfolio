/**
 * Digest hebdomadaire de la veille — assemblage et envoi, en ligne de commande.
 *
 *   npm run cto:digest                          # assemble les brouillons de la dernière semaine complète
 *   npm run cto:digest -- --semaine 2026-W39    # … d'une semaine donnée
 *   npm run cto:digest -- --a-blanc             # dit ce qui serait assemblé, n'écrit rien
 *   npm run cto:digest -- --envoyer             # valide ET envoie les brouillons de la semaine
 *
 * Le balayage quotidien (`/api/cto/cron`) assemble déjà les brouillons ; la
 * relecture et l'envoi se font normalement depuis `/admin-cto/digests`. Cette
 * commande sert de voie de secours, et à tester un assemblage sur une semaine
 * passée. Lancer `npm run cto:sync` avant si les éditions viennent de paraître.
 */

import "./load-env";

import { assembleWeek, parseWeek, previousWeek, validateAndSend } from "../src/cto/digest";
import { syncSentinelle } from "../src/cto/sentinelle";

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--a-blanc");
  const envoyer = args.includes("--envoyer");
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

  if (envoyer && !dryRun) {
    const base = process.env.CTO_ORIGIN?.split(",")[0]?.trim() || "https://next-impact.digital";
    const sent = await validateAndSend(week, { url: `${base}/espace-direction/veille?semaine=${week}` });
    console.log(`\nEnvoi : ${sent.validated} validé(s), ${sent.sent} envoyé(s).`);
    for (const warning of sent.warnings) console.log(`  · ${warning}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(`\n${error instanceof Error ? error.message : error}`);
    process.exit(1);
  });
