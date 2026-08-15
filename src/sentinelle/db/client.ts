import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Driver HTTP de Neon : une requête HTTP par requête SQL, sans pool à maintenir.
// C'est le bon choix en serverless (routes Next, fonctions Inngest), où un pool
// de connexions serait recréé à chaque invocation à froid.
//
// Limite à connaître : le driver HTTP ne fait pas de transactions multi-requêtes
// interactives. Toutes les garanties d'unicité du schéma passent donc par des
// index uniques et des `onConflictDoNothing`, jamais par un verrou applicatif.

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
 * Accès à la base Sentinelle.
 *
 * Fonction et non constante exportée : le module peut être importé (typage,
 * tests) sans exiger DATABASE_URL. L'erreur ne survient qu'à la première
 * requête réelle, et non au build du site vitrine.
 */
export function db() {
  if (!cached) cached = createClient();
  return cached;
}

export type SentinelleDb = ReturnType<typeof db>;
export { schema };
