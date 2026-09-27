import type { AlertStatus, Verdict } from "@sentinelle/types";

// ─────────────────────────────────────────────────────────────────────────────
// Le schéma attendu de la base Notion « Sentinelle — Alertes ».
//
// Documenté en détail dans docs/sentinelle/notion-alertes.md — Agathe crée la
// base à la main, ce fichier ne fait que nommer les colonnes que le code lit et
// écrit. Une colonne renommée dans Notion ne fait pas planter la synchro : elle
// lit `null` (voir properties.ts) et le rapport le signale.
// ─────────────────────────────────────────────────────────────────────────────

export const PROPS = {
  title: "Nom",
  client: "Client",
  site: "Site",
  component: "Composant",
  verdict: "Verdict",
  status: "Statut",
  body: "Corps",
  whatItChanges: "Ce que ça change",
  recommendedAction: "Action recommandée",
  diyPossible: "Faisable seul",
  effortEstimate: "Effort estimé",
  source: "Source",
  severity: "Sévérité",
  sentAt: "Envoyée le",
  /** Clé de rapprochement `${clientId}:${intelItemId}` — lecture humaine, pas d'écran dédié. */
  key: "Clé",
  /** UUID du client Sentinelle (Postgres) — nécessaire à l'envoi, invisible pour un humain. */
  clientId: "Id Client",
} as const;

/**
 * Statuts, tels qu'ils s'écrivent dans la colonne `Statut` de Notion.
 *
 * Quatre valeurs, pas cinq : `resolved` (le suivi « recos passées ») n'a pas
 * d'équivalent Notion — il ne concernait déjà presque aucune alerte, et lui
 * donner une option de plus dans le select n'aiderait personne à choisir.
 */
export const STATUS_LABEL: Record<Exclude<AlertStatus, "resolved">, string> = {
  draft: "Brouillon",
  validated: "Validée",
  sent: "Envoyée",
  // Sans accent sur le E : c'est ainsi que l'option existe réellement dans la
  // base Notion. Le code compare du texte, pas un identifiant — mieux vaut se
  // plier à l'orthographe déjà choisie que la faire deviner à chaque relecture.
  dismissed: "Ecartée",
};

const STATUS_BY_LABEL = new Map(
  Object.entries(STATUS_LABEL).map(([status, label]) => [label, status as AlertStatus]),
);

/** Statut Postgres depuis le libellé Notion. `draft` si le select est vide ou méconnu. */
export function statusFromLabel(label: string | null): AlertStatus {
  return (label && STATUS_BY_LABEL.get(label)) || "draft";
}

export const VERDICT_LABEL: Record<Verdict, string> = {
  red: "Rouge",
  orange: "Orange",
  green: "Vert",
  info: "Info",
};

const VERDICT_BY_LABEL = new Map(
  Object.entries(VERDICT_LABEL).map(([verdict, label]) => [label, verdict as Verdict]),
);

/** Verdict Postgres depuis le libellé Notion, ou null si le select est vide ou méconnu. */
export function verdictFromLabel(label: string | null): Verdict | null {
  if (!label) return null;
  return VERDICT_BY_LABEL.get(label) ?? null;
}

/** Clé de rapprochement d'une alerte — stable, indépendante de l'ordre d'écriture. */
export function alertKey(clientId: string, intelItemId: string): string {
  return `${clientId}:${intelItemId}`;
}
