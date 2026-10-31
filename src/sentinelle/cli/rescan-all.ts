import { and, eq, sql } from "drizzle-orm";
import { db } from "../db/client";
import { clients, stackItems } from "../db/schema";
import { dropScannedOutsideSites, importScannedStack } from "../onboarding";
import { siteList } from "../provision";
import { scanSite } from "../scanner";

// ─────────────────────────────────────────────────────────────────────────────
// Scan initial (ou relance) de tous les sites suivis.
//
//   npm run sentinelle:rescan -- [--client <uuid>] [--a-blanc]
//
// Pour chaque client ACTIF : scan passif du site principal, puis de chaque site
// supplémentaire (`clients.extra_sites`), et import des composants détectés avec
// l'adresse du site où ils ont été vus. C'est ce que fait l'événement Inngest
// `sentinelle/client.subscribed`, rejoué ici pour toute la base d'un coup.
//
// Sans danger à rejouer : l'import est un upsert, un composant déclaré par le
// client n'est jamais écrasé, et les composants détectés sur un site qui n'est
// plus suivi sont retirés.
//
// `--a-blanc` : AUCUNE requête vers les sites, AUCUNE écriture. Liste les
// clients et les sites qui seraient scannés. C'est aussi un contrôle de
// migration : si `0009_sites_multiples` n'est pas appliquée, la lecture le dit.
// ─────────────────────────────────────────────────────────────────────────────

interface Options {
  client: string | null;
  dryRun: boolean;
}

function readOptions(argv: string[]): Options {
  const index = argv.indexOf("--client");
  const next = index >= 0 ? argv[index + 1] : undefined;
  return {
    client: next && !next.startsWith("--") ? next.trim() : null,
    dryRun: argv.includes("--a-blanc"),
  };
}

async function main(): Promise<void> {
  const options = readOptions(process.argv.slice(2));

  let rows;
  try {
    rows = await db()
      .select({
        id: clients.id,
        email: clients.email,
        company: clients.company,
        siteUrl: clients.siteUrl,
        extraSites: clients.extraSites,
      })
      .from(clients)
      .where(options.client ? and(eq(clients.active, true), eq(clients.id, options.client)) : eq(clients.active, true));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Lecture des clients impossible : ${message}\n` +
        "Si le message cite `extra_sites` ou `site_url`, la migration 0009_sites_multiples n'est pas appliquée à cette base (npm run db:migrate).",
    );
  }

  if (rows.length === 0) {
    console.log(options.client ? "Aucun client actif avec cet identifiant." : "Aucun client actif.");
    return;
  }

  console.log(`${options.dryRun ? "[à blanc] " : ""}${rows.length} client(s) actif(s).\n`);

  let sites = 0;
  let scanned = 0;
  let failed = 0;
  let components = 0;

  for (const client of rows) {
    const extras = siteList(client.extraSites);
    console.log(`${client.company ?? client.email} (${client.id})`);

    const targets = [{ url: client.siteUrl, siteUrl: "", label: "principal" }].concat(
      extras.map((site) => ({ url: site.url, siteUrl: site.url, label: site.name ?? "supplémentaire" })),
    );

    for (const target of targets) {
      sites += 1;
      if (options.dryRun) {
        console.log(`  · ${target.label} : ${target.url}`);
        continue;
      }

      const outcome = await scanSite(target.url);
      if (!outcome.ok) {
        failed += 1;
        console.log(`  · ${target.label} : ${target.url} — analyse impossible (${outcome.reason})`);
        continue;
      }
      const { written } = await importScannedStack(client.id, outcome.result, target.siteUrl);
      scanned += 1;
      components += written;
      console.log(`  · ${target.label} : ${target.url} — ${written} composant(s)`);
    }

    if (!options.dryRun) {
      const removed = await dropScannedOutsideSites(client.id, extras.map((site) => site.url));
      if (removed > 0) console.log(`  · ${removed} composant(s) retiré(s) (site qui n'est plus suivi)`);
    }
  }

  if (options.dryRun) {
    const [count] = await db()
      .select({ n: sql<number>`count(*)` })
      .from(stackItems);
    console.log(
      `\n[à blanc] ${sites} site(s) seraient scannés, rien n'a été envoyé ni écrit. ` +
        `La table des composants compte ${Number(count?.n ?? 0)} ligne(s).`,
    );
    return;
  }

  console.log(`\n${scanned}/${sites} site(s) analysés, ${failed} échec(s), ${components} composant(s) écrits ou mis à jour.`);
}

// Exécution directe uniquement : `npm run sentinelle:rescan -- …`.
if (process.argv[1]?.replace(/\\/g, "/").endsWith("src/sentinelle/cli/rescan-all.ts")) {
  try {
    process.loadEnvFile(".env.local");
  } catch {
    // Absent en CI et sur Vercel, qui passent les variables autrement.
  }

  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(`\n${error instanceof Error ? error.message : error}`);
      process.exit(1);
    });
}

export { readOptions };
