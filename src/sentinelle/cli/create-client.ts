import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { clients, stackItems } from "../db/schema";
import { upsertSubscriber } from "../billing";
import { importScannedStack, sendWelcome } from "../onboarding";
import { scanSite } from "../scanner";
import { normalizeSiteUrl } from "../url";

// ─────────────────────────────────────────────────────────────────────────────
// Création manuelle d'un client Sentinelle, sans passer par Stripe.
//
//   npm run sentinelle:client -- --email dsi@client.fr --nom "Prénom Nom" \
//     --site https://client.fr [--entreprise "Client SAS"] [--secteur "…"] \
//     [--notes "…"] [--sans-scan] [--avec-bienvenue] [--a-blanc]
//
// Sert aux accompagnements Expert technique externalisé : leur veille technique
// est comprise dans l'accompagnement, il n'y a pas d'abonnement à payer. La
// commande fait ce que le parcours Stripe fait après un paiement, moins le
// paiement :
//
//   1. la fiche `clients` (même écriture que le webhook, `upsertSubscriber`),
//      sans identifiant Stripe ;
//   2. le scan passif du site, puis l'import des composants détectés dans
//      `stack_items` (comme `onClientSubscribed`) ;
//   3. l'e-mail de bienvenue Sentinelle, SEULEMENT avec `--avec-bienvenue` :
//      un client d'accompagnement lit sa veille dans l'espace de direction
//      technique, un second espace et un second e-mail d'accueil le perdraient.
//
// Elle imprime l'UUID à coller dans la colonne « ID Sentinelle » de sa fiche
// Notion Clients.
//
// Vit dans `src/sentinelle/` et non dans `scripts/` : la règle d'isolation
// n° 2 interdit à tout code hors du périmètre d'importer Sentinelle (garde
// `scripts/check-sentinelle-isolation.mjs`). Même régime que `db:seed`.
// ─────────────────────────────────────────────────────────────────────────────

interface Options {
  email: string;
  name: string;
  siteUrl: string;
  company: string | null;
  sector: string | null;
  notes: string | null;
  scan: boolean;
  welcome: boolean;
  dryRun: boolean;
}

function readOptions(argv: string[]): Options {
  const value = (flag: string): string | null => {
    const index = argv.indexOf(flag);
    const next = index >= 0 ? argv[index + 1] : undefined;
    return next && !next.startsWith("--") ? next.trim() : null;
  };

  const email = value("--email")?.toLowerCase() ?? "";
  const name = value("--nom") ?? "";
  const site = normalizeSiteUrl(value("--site"));

  const missing = [
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "--email (adresse valide)" : null,
    !name ? "--nom" : null,
    !site ? "--site (adresse http(s) du site)" : null,
  ].filter(Boolean);
  if (missing.length > 0) {
    throw new Error(
      `Paramètre(s) manquant(s) : ${missing.join(", ")}.\n` +
        'Exemple : npm run sentinelle:client -- --email dsi@client.fr --nom "Prénom Nom" --site https://client.fr',
    );
  }

  return {
    email,
    name,
    siteUrl: site as string,
    company: value("--entreprise"),
    sector: value("--secteur"),
    notes: value("--notes"),
    scan: !argv.includes("--sans-scan"),
    welcome: argv.includes("--avec-bienvenue"),
    dryRun: argv.includes("--a-blanc"),
  };
}

async function main(): Promise<void> {
  const options = readOptions(process.argv.slice(2));

  const [existing] = await db()
    .select({ id: clients.id, active: clients.active, siteUrl: clients.siteUrl })
    .from(clients)
    .where(eq(clients.email, options.email))
    .limit(1);

  if (options.dryRun) {
    console.log("\n— À BLANC : rien n'a été écrit, aucun site n'a été analysé. —\n");
    console.log(
      existing
        ? `La fiche ${existing.id} existe déjà pour ${options.email} : elle serait réactivée et complétée.`
        : `Une fiche serait créée pour ${options.email} (${options.siteUrl}), sans abonnement Stripe.`,
    );
    return;
  }

  // 1. La fiche. Même écriture que le webhook : un rejeu ne duplique rien, une
  //    fiche existante est réactivée sans perdre ce qui a été déclaré.
  const row = await upsertSubscriber({
    email: options.email,
    name: options.name,
    company: options.company,
    siteUrl: options.siteUrl,
    sector: options.sector,
    notes: options.notes,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
  });
  if (!row) throw new Error("La fiche n'a pas pu être écrite.");

  console.log(
    existing
      ? `\nFiche existante réactivée : ${row.email}`
      : `\nFiche créée : ${row.email}`,
  );

  // 2. Le scan passif et l'import de ce qu'il voit.
  let imported = 0;
  if (options.scan) {
    console.log(`Analyse de ${options.siteUrl}…`);
    const outcome = await scanSite(options.siteUrl);
    if (outcome.ok) {
      imported = (await importScannedStack(row.id, outcome.result)).written;
      console.log(`${imported} composant(s) détecté(s) et suivi(s).`);
    } else {
      console.log(`Analyse impossible (${outcome.reason}) : la fiche reste sans composant détecté.`);
    }
  }

  const components = await db()
    .select({ label: stackItems.label, version: stackItems.version })
    .from(stackItems)
    .where(eq(stackItems.clientId, row.id))
    .orderBy(stackItems.label);
  for (const component of components) {
    console.log(`  · ${component.label}${component.version ? ` ${component.version}` : " (version inconnue)"}`);
  }

  // 3. La bienvenue Sentinelle, seulement sur demande.
  if (options.welcome) {
    const outcome = await sendWelcome(row.id);
    console.log(outcome.sent ? "E-mail de bienvenue envoyé." : `Bienvenue non envoyée : ${outcome.reason}`);
  }

  console.log(`\nID Sentinelle : ${row.id}`);
  console.log(
    "À coller dans la colonne « ID Sentinelle » de la fiche Notion Clients, puis `npm run cto:sync`.\n" +
      "Les alertes suivent au prochain passage des collecteurs ; la première lettre paraît le 1er ou le 15.",
  );
}

// Exécution directe uniquement : `npm run sentinelle:client -- …`.
if (process.argv[1]?.replace(/\\/g, "/").endsWith("src/sentinelle/cli/create-client.ts")) {
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
