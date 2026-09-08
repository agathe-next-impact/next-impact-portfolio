import type { Config } from "drizzle-kit";

// Migrations de l'espace CTO — fichier SÉPARÉ de `drizzle.config.ts`.
//
// Les deux produits partagent la même base Neon mais pas leur schéma : un seul
// fichier de configuration obligerait drizzle-kit à voir les deux, et une
// migration de l'un emporterait l'autre dans son instantané. Deux configs, deux
// dossiers de migrations, deux journaux : chacun se déploie et se relit seul.
//
// Les tables `cto_*` étant préfixées, la cohabitation dans le même schéma
// Postgres ne pose aucun problème d'unicité.

try {
  process.loadEnvFile(".env.local");
} catch {
  // Pas de .env.local : on s'en remet à l'environnement du process (CI, Vercel).
}

// Le DDL passe par la connexion directe, pas par le pooler : celui de Neon est
// en mode transaction et ne tient pas les commandes de schéma.
const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL ?? "";

export default {
  schema: "./src/cto/db/schema.ts",
  out: "./src/cto/db/migrations",
  dialect: "postgresql",
  dbCredentials: { url },
  // Sans ce filtre, `drizzle-kit generate` verrait les tables Sentinelle déjà
  // présentes en base comme des tables « à supprimer », puisqu'elles n'existent
  // pas dans CE schéma. Le filtre borne son champ de vision aux tables et types
  // de l'espace CTO.
  tablesFilter: ["cto_*"],
  verbose: true,
  strict: true,
} satisfies Config;
