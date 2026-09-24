import type { DeliverableKind } from "../deliverables";

// ─────────────────────────────────────────────────────────────────────────────
// Où vivent les huit bases de l'atelier.
//
// Les identifiants passent par l'environnement et non par une constante du
// dépôt. Ce ne sont pas des secrets — sans le jeton ils n'ouvrent rien — mais
// les figer dans le code obligerait à un déploiement pour changer d'atelier, et
// empêcherait d'en pointer un autre depuis une branche Neon de test.
//
// Leurs valeurs sont notées au bas de la page Notion « Direction technique —
// clients », prêtes à coller dans `.env.local` puis dans Vercel.
// ─────────────────────────────────────────────────────────────────────────────

/** Les bases de contenu, dans l'ordre où la synchro les balaie. */
export const SYNCED_KINDS: DeliverableKind[] = [
  "decision",
  "roadmap",
  "cartographie",
  "veille",
];

const ENV_BY_KIND: Record<DeliverableKind, string> = {
  decision: "CTO_NOTION_DB_DECISIONS",
  roadmap: "CTO_NOTION_DB_ROADMAP",
  cartographie: "CTO_NOTION_DB_CARTOGRAPHIE",
  veille: "CTO_NOTION_DB_VEILLE",
  document: "CTO_NOTION_DB_DOCUMENTS",
};

const ENV_CLIENTS = "CTO_NOTION_DB_CLIENTS";
const ENV_LETTRES = "CTO_NOTION_DB_LETTRES";
const ENV_PERSONNES = "CTO_NOTION_DB_PERSONNES";

function read(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(
      `${name} manquante. Les identifiants des huit bases figurent au bas de la page Notion ` +
        "« Direction technique — clients ».",
    );
  }
  return value;
}

/** Identifiant de la base Clients — la charnière avec `cto_clients`. */
export function clientsDatabaseId(): string {
  return read(ENV_CLIENTS);
}

/** Identifiant de la base Lettres. Hors `SYNCED_KINDS` : ce n'est pas un livrable. */
export function lettersDatabaseId(): string {
  return read(ENV_LETTRES);
}

/** Identifiant de la base Personnes. Hors `SYNCED_KINDS` : ce n'est pas un livrable non plus. */
export function personsDatabaseId(): string {
  return read(ENV_PERSONNES);
}

export function databaseIdFor(kind: DeliverableKind): string {
  return read(ENV_BY_KIND[kind]);
}

/**
 * Ce qui manque pour que la synchro puisse tourner, en une phrase, ou null.
 *
 * Rendue plutôt que levée : la commande de synchro doit pouvoir dire ce qui
 * manque AVANT de commencer, et les nommer toutes d'un coup plutôt que de faire
 * découvrir les variables une par une, à un échec par exécution.
 */
export function configurationIssue(): string | null {
  const missing = [
    "CTO_NOTION_TOKEN",
    ENV_CLIENTS,
    ENV_LETTRES,
    ENV_PERSONNES,
    ...SYNCED_KINDS.map((kind) => ENV_BY_KIND[kind]),
  ].filter((name) => !process.env[name]?.trim());

  if (missing.length === 0) return null;
  return `Variables manquantes : ${missing.join(", ")}.`;
}
