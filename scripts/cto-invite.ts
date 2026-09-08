/**
 * Invitation d'une personne à l'espace direction technique.
 *
 *   npm run cto:invite -- --entreprise "Fédération X" --email a@x.fr --nom "Alain Roux" --role Dirigeant
 *   npm run cto:invite -- --client <uuid> --email b@x.fr --nom "Claire Nom" --role "Direction financière"
 *
 * Volontairement une commande et non un écran d'administration. Tant qu'il y a
 * quatre accompagnements au maximum (CTO_TERMS) et deux ou trois personnes
 * chacun, construire un back-office pour une dizaine de lignes reviendrait à
 * écrire plus d'interface que de produit. Le jour où ça devient pénible, ce
 * fichier dit exactement ce que l'écran devra faire.
 *
 * C'est TOI qui invites, jamais le client : il n'existe aucun parcours
 * d'auto-inscription, et c'est ce qui garantit que la liste des personnes ayant
 * accès aux contrats et aux budgets reste une décision, pas une conséquence.
 */

import { eq } from "drizzle-orm";
import { db } from "../src/cto/db/client";
import { ctoClients, ctoPersons } from "../src/cto/db/schema";
import { issueMagicLink, sendLoginLink } from "../src/cto/access";

type Args = Record<string, string>;

function parseArgs(argv: string[]): Args {
  const args: Args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const value = argv[i + 1];
    if (value === undefined || value.startsWith("--")) {
      throw new Error(`Valeur manquante pour --${key}`);
    }
    args[key] = value;
    i += 1;
  }
  return args;
}

function require_(args: Args, key: string): string {
  const value = args[key]?.trim();
  if (!value) throw new Error(`--${key} est obligatoire.`);
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
