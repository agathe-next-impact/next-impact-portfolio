import type { Config } from "drizzle-kit";

// Migrations générées puis commitées (`npm run db:generate`), jamais de push
// direct en production — voir docs/sentinelle/CLAUDE.md, « Conventions ».
export default {
  schema: "./src/sentinelle/db/schema.ts",
  out: "./src/sentinelle/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  // Le schéma Sentinelle est seul dans la base : pas de filtre de table à poser.
  verbose: true,
  strict: true,
} satisfies Config;
