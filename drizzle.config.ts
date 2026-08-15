import type { Config } from "drizzle-kit";

// Migrations générées puis commitées (`npm run db:generate`), jamais de push
// direct en production — voir docs/sentinelle/CLAUDE.md, « Conventions ».

// drizzle-kit charge `.env`, jamais `.env.local` : sans cette ligne la
// migration partirait avec une URL vide et l'erreur ne dirait pas pourquoi.
// Le try/catch couvre les environnements qui n'ont pas de fichier local et
// passent les variables autrement (CI, Vercel).
try {
  process.loadEnvFile(".env.local");
} catch {
  // Pas de .env.local : on s'en remet à l'environnement du process.
}

// Le DDL passe par la connexion directe, pas par le pooler. Celui de Neon est
// en mode transaction : il ne tient pas les commandes de schéma.
const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL ?? "";

export default {
  schema: "./src/sentinelle/db/schema.ts",
  out: "./src/sentinelle/db/migrations",
  dialect: "postgresql",
  dbCredentials: { url },
  // Le schéma Sentinelle est seul dans la base : pas de filtre de table à poser.
  verbose: true,
  strict: true,
} satisfies Config;
