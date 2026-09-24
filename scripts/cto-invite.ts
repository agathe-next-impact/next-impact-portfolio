/**
 * Invitation d'une personne à l'espace direction technique — voie de SECOURS.
 *
 *   npm run cto:invite -- --entreprise "Fédération X" --email a@x.fr --nom "Alain Roux" --role Dirigeant
 *   npm run cto:invite -- --client <uuid> --email b@x.fr --nom "Claire Nom" --role "Direction financière"
 *
 * Options : --palier referent|direction (défaut : direction) · --sans-envoi
 * (imprime le lien au lieu de l'envoyer, pour un essai en local).
 *
 * Toute valeur en plusieurs mots se met entre guillemets. Sans eux, le shell
 * découpe et la commande s'arrête sur « Argument inattendu ».
 *
 * **La voie normale, depuis la base Personnes de l'atelier Notion, plus cette
 * commande.** Ajouter une ligne (Nom, Email, Rôle, Client) y crée l'accès au
 * balayage suivant — voir `src/cto/notion/persons.ts` et
 * `docs/cto-externalise/notion-livrables.md` § 7. Cette commande reste utile
 * pour deux choses que la synchro ne fait jamais : envoyer le premier lien de
 * connexion (la synchro n'envoie aucun e-mail, voir l'en-tête de
 * `src/cto/notion/sync.ts`) et créer un accès en local sans toucher Notion.
 *
 * Un accompagnement créé ici (`--entreprise`) sans fiche Notion correspondante
 * reste un accompagnement à part entière ; la synchro l'ADOPTE si une fiche
 * Notion le rejoint ensuite (`resolveClients`, `sync.ts`), elle n'en recrée
 * jamais un second.
 */

// EN PREMIER, avant tout module qui lit `process.env` au chargement :
// `lib/sendMail.ts`, atteint via `access/notify.ts`, construit son transport
// SMTP à l'import. Voir `scripts/load-env.ts` pour le détail de l'ordre.
import "./load-env";

import { eq } from "drizzle-orm";
import { db } from "../src/cto/db/client";
import { ctoClients, ctoPersons } from "../src/cto/db/schema";
import { issueMagicLink, sendLoginLink } from "../src/cto/access";

type Args = Record<string, string>;

/**
 * Analyse la ligne de commande.
 *
 * Deux règles, chacune contre une erreur de frappe réelle :
 *
 *  - **Un drapeau sans valeur est un drapeau, pas une erreur.** `--sans-envoi`
 *    n'attend rien après lui ; il vaut la chaîne vide, donc présent pour
 *    `!== undefined` et refusé par `require_` s'il tenait lieu de valeur.
 *  - **Un mot isolé est une erreur, pas un mot ignoré.** `--entreprise Agathe
 *    test` sans guillemets créerait « Agathe » et perdrait « test » en silence.
 *    Une raison sociale tronquée s'affiche en tête de l'espace du client.
 */
function parseArgs(argv: string[]): Args {
  const args: Args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];

    if (!token.startsWith("--")) {
      throw new Error(
        `Argument inattendu « ${token} ». Une valeur en plusieurs mots se met entre guillemets : --entreprise "Ma Fédération".`,
      );
    }

    const key = token.slice(2);
    const value = argv[i + 1];

    if (value === undefined || value.startsWith("--")) {
      args[key] = "";
      continue;
    }

    args[key] = value;
    i += 1;
  }
  return args;
}

function require_(args: Args, key: string): string {
  const value = args[key]?.trim();
  if (!value) throw new Error(`--${key} est obligatoire, et attend une valeur.`);
  return value;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const email = require_(args, "email").toLowerCase();
  const name = require_(args, "nom");
  const role = args.role?.trim() || null;

  // Deux façons de rattacher : à un accompagnement existant par son
  // identifiant, ou en en créant un par sa raison sociale. La première est celle
  // qu'on utilise pour les deuxième et troisième personnes d'un même client.
  let clientId = args.client?.trim();

  if (!clientId) {
    const company = require_(args, "entreprise");
    const tier = args.palier?.trim() || "direction";

    const [created] = await db()
      .insert(ctoClients)
      .values({ company, tier })
      .returning({ id: ctoClients.id, company: ctoClients.company });

    clientId = created.id;
    console.log(`Accompagnement créé : ${created.company} (${created.id})`);
  } else {
    const [existing] = await db()
      .select({ id: ctoClients.id, company: ctoClients.company })
      .from(ctoClients)
      .where(eq(ctoClients.id, clientId))
      .limit(1);

    if (!existing) throw new Error(`Aucun accompagnement avec l'identifiant ${clientId}.`);
    console.log(`Accompagnement : ${existing.company}`);
  }

  const [person] = await db()
    .insert(ctoPersons)
    .values({ clientId, email, name, role })
    .returning({ id: ctoPersons.id, email: ctoPersons.email });

  console.log(`Personne créée : ${person.email} (${person.id})`);

  const issued = await issueMagicLink(person.id);
  if (!issued.ok) throw new Error("Trop de liens demandés pour cette personne.");

  const base = process.env.CTO_ORIGIN?.split(",")[0]?.trim() || "https://next-impact.digital";
  const url = `${base}/espace-direction/connexion?jeton=${encodeURIComponent(issued.token)}`;

  if (args["sans-envoi"] !== undefined || process.env.CTO_INVITE_DRY_RUN) {
    console.log(`\nLien de connexion (non envoyé) :\n${url}\n`);
    return;
  }

  await sendLoginLink({ email: person.email, name }, url);
  console.log(`Lien de connexion envoyé à ${person.email}.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
