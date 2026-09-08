import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Client base de l'espace CTO.
//
// Volontairement distinct de celui de Sentinelle, bien qu'il pointe sur la même
// base Neon et lui ressemble ligne pour ligne. La règle d'isolation interdit à
// tout code hors `src/sentinelle/` d'importer ce périmètre ; recopier vingt
// lignes de branchement est le prix, assumé, pour que les deux produits restent
// séparables. Ce qu'ils partagent, c'est une base de données, pas du code.
//
// Driver HTTP : une requête HTTP par requête SQL, sans pool à maintenir. Le bon
// choix en serverless, où un pool serait recréé à chaque démarrage à froid.
// Limite à connaître : pas de transaction interactive multi-requêtes. Toutes les
// garanties d'unicité passent donc par des index uniques et des suppressions
// conditionnées, jamais par un verrou applicatif.

function connectionString(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL manquante. Renseignez-la dans .env.local (voir .env.example).",
    );
  }
  return url;
}

let cached: ReturnType<typeof createClient> | undefined;

function createClient() {
  return drizzle(neon(connectionString()), { schema });
}

/**
 * Accès à la base de l'espace CTO.
 *
 * Fonction et non constante exportée : le module peut être importé (typage,
 * tests) sans exiger DATABASE_URL. L'erreur ne survient qu'à la première requête
 * réelle, et non au build du site vitrine.
 */
export function db() {
  if (!cached) cached = createClient();
  return cached;
}

export type CtoDb = ReturnType<typeof db>;
export { schema };
