import type { DeliverableKind } from "../deliverables";
import { getJson } from "./api";
import { PROPS } from "./map";

// ─────────────────────────────────────────────────────────────────────────────
// Le contrôle de schéma : les colonnes sont-elles encore là ?
//
// `properties.ts` rend `null` sur une colonne absente ou d'un autre type, pour
// qu'un renommage dégrade un livrable au lieu d'arrêter le balayage. Le revers :
// renommer « Motif » dans l'atelier réécrit TOUTES les décisions avec un motif
// vide, et le client lit « corrigé le… » sur chacune. Le garde-fou de retrait de
// masse ne voit rien, puisque la base rend toujours ses lignes.
//
// D'où ce contrôle, fait AVANT de lire les lignes : le schéma de la base est
// comparé aux colonnes que le code lit. Une colonne manquante ou changée de
// type, et la base n'est ni écrite ni retirée ce tour-ci. Le rapport nomme la
// colonne ; l'espace reste tel qu'il était la veille.
//
// Seules les colonnes LUES sont déclarées. Ajouter une colonne dans l'atelier
// ne demande rien ici ; en lire une nouvelle dans `map.ts` demande de la
// déclarer (le test `schema.test.ts` le rappelle).
// ─────────────────────────────────────────────────────────────────────────────

/** Les types de propriété de l'API Notion que `properties.ts` sait lire. */
export type ColumnType =
  | "title"
  | "rich_text"
  | "select"
  | "multi_select"
  | "date"
  | "number"
  | "url"
  | "email"
  | "checkbox"
  | "relation"
  | "files";

export interface Column {
  name: string;
  /** Les types que le lecteur de cette colonne accepte. */
  types: readonly ColumnType[];
  /**
   * Vrai pour une colonne dont l'absence ne change rien à l'espace (raccord
   * d'avant `notion_page_id`, liaison manuelle). Présente, elle doit quand
   * même être du bon type.
   */
  optional?: boolean;
}

export function column(name: string, ...types: ColumnType[]): Column {
  return { name, types };
}

function facultative(name: string, ...types: ColumnType[]): Column {
  return { name, types, optional: true };
}

/** Les bases dont les noms de colonnes vivent dans `PROPS` (`map.ts`). */
export type SchemaBase = DeliverableKind | "clients" | "persons" | "paiement" | "editions";

/**
 * Présentes sur chaque base de contenu, sous le même nom.
 *
 * `Affichage` est facultative : sans elle, tout part en archive — le défaut
 * documenté (`isFeatured`), et celui de la base Documents, qui ne l'a jamais
 * eue. Le placement n'étant pas versionné, son absence ne fait écrire aucune
 * fausse correction.
 */
const CONTENT: Column[] = [
  column(PROPS.client, "relation"),
  column(PROPS.published, "checkbox"),
  facultative(PROPS.placement, "select"),
];

export const COLUMNS: Record<SchemaBase, Column[]> = {
  clients: [
    column(PROPS.clients.company, "title"),
    column(PROPS.clients.status, "select"),
    column(PROPS.clients.tier, "select"),
    column(PROPS.clients.services, "multi_select"),
    column(PROPS.clients.organisation, "relation"),
    column(PROPS.clients.veilleOrganisation, "relation"),
    column(PROPS.clients.wpUmbrellaProjectId, "number"),
    column(PROPS.clients.watchedSite, "url"),
    column(PROPS.clients.watchContact, "email"),
    facultative(PROPS.clients.spaceId, "rich_text"),
    facultative(PROPS.clients.sentinelleClientId, "rich_text"),
    // « Votre accompagnement » et « Prochaine étape » : facultatives, une fiche
    // sans elles s'affiche simplement sans engagement ni suggestion datée.
    facultative(PROPS.clients.contractStart, "date"),
    facultative(PROPS.clients.suiviFormule, "select"),
    facultative(PROPS.clients.suiviInclus, "date"),
    facultative(PROPS.clients.sansSuggestions, "checkbox"),
  ],
  persons: [
    column(PROPS.persons.name, "title"),
    column(PROPS.persons.email, "email"),
    column(PROPS.persons.role, "rich_text"),
    column(PROPS.persons.revoked, "checkbox"),
    column(PROPS.client, "relation"),
  ],
  decision: [
    ...CONTENT,
    column(PROPS.decision.title, "title"),
    column(PROPS.decision.nature, "select"),
    column(PROPS.decision.date, "date"),
    column(PROPS.decision.motif, "rich_text"),
    column(PROPS.decision.ruledOut, "rich_text"),
    column(PROPS.decision.scope, "multi_select"),
  ],
  roadmap: [
    ...CONTENT,
    column(PROPS.roadmap.title, "title"),
    column(PROPS.roadmap.nature, "select"),
    column(PROPS.roadmap.status, "select"),
    column(PROPS.roadmap.due, "date"),
    column(PROPS.roadmap.budget, "number"),
    column(PROPS.roadmap.effort, "select"),
    column(PROPS.roadmap.effect, "select"),
    column(PROPS.roadmap.detail, "rich_text"),
    column(PROPS.roadmap.source, "url"),
  ],
  cartographie: [
    ...CONTENT,
    column(PROPS.cartographie.title, "title"),
    column(PROPS.cartographie.type, "select"),
    column(PROPS.cartographie.holder, "rich_text"),
    column(PROPS.cartographie.yearlyCost, "number"),
    column(PROPS.cartographie.due, "date"),
    column(PROPS.cartographie.criticality, "select"),
    column(PROPS.cartographie.risk, "rich_text"),
  ],
  veille: [
    ...CONTENT,
    column(PROPS.veille.title, "title"),
    column(PROPS.veille.nature, "select"),
    column(PROPS.veille.date, "date"),
    column(PROPS.veille.fact, "rich_text"),
    column(PROPS.veille.impact, "rich_text"),
    column(PROPS.veille.source, "url"),
    column(PROPS.veille.themes, "multi_select"),
  ],
  document: [
    ...CONTENT,
    column(PROPS.document.title, "title"),
    column(PROPS.document.type, "select"),
    column(PROPS.document.date, "date"),
    column(PROPS.document.vendor, "rich_text"),
    column(PROPS.document.amount, "number"),
    column(PROPS.document.verdict, "select"),
    column(PROPS.document.alternative, "rich_text"),
    column(PROPS.document.file, "files"),
  ],
  prestation: [
    ...CONTENT,
    column(PROPS.prestation.title, "title"),
    column(PROPS.prestation.status, "select"),
    column(PROPS.prestation.start, "date"),
    column(PROPS.prestation.due, "date"),
    column(PROPS.prestation.amount, "number"),
    column(PROPS.prestation.progress, "number"),
    column(PROPS.prestation.quote, "url"),
    column(PROPS.prestation.detail, "rich_text"),
  ],
  paiement: [
    column(PROPS.paiement.title, "title"),
    column(PROPS.paiement.prestation, "relation"),
    column(PROPS.paiement.amount, "number"),
    column(PROPS.paiement.date, "date"),
    column(PROPS.paiement.status, "select"),
  ],
  audit: [
    ...CONTENT,
    column(PROPS.audit.title, "title"),
    // Un lien collé : la colonne est lue en URL, à défaut en texte (`auditPageId`).
    column(PROPS.audit.page, "url", "rich_text"),
    column(PROPS.audit.date, "date"),
    column(PROPS.audit.site, "url"),
    column(PROPS.audit.annex, "files"),
    // Facultative : sans elle, aucun audit n'est validé et aucun scénario ne devient proposition.
    facultative(PROPS.audit.validated, "checkbox"),
  ],
  proposition: [
    ...CONTENT,
    column(PROPS.proposition.title, "title"),
    column(PROPS.proposition.page, "url", "rich_text"),
    column(PROPS.proposition.date, "date"),
    column(PROPS.proposition.status, "select"),
  ],
  // La base du pipeline « Veilles clients » : seules les colonnes reprises dans
  // une lettre personnalisée. Le reste appartient au pipeline.
  editions: [
    column(PROPS.editions.title, "title"),
    column(PROPS.editions.status, "select"),
    column(PROPS.editions.date, "date"),
    column(PROPS.editions.organisation, "relation"),
    column(PROPS.editions.veille, "select"),
    column(PROPS.editions.action, "rich_text"),
  ],
};

const TYPE_LABELS: Record<ColumnType, string> = {
  title: "titre",
  rich_text: "texte",
  select: "sélection",
  multi_select: "sélection multiple",
  date: "date",
  number: "nombre",
  url: "URL",
  email: "e-mail",
  checkbox: "case à cocher",
  relation: "relation",
  files: "fichiers",
};

function typeLabel(type: string | undefined): string {
  return TYPE_LABELS[type as ColumnType] ?? `« ${type ?? "inconnu"} »`;
}

export interface SchemaProperty {
  type?: string;
}

/**
 * Pur : ce qui manque à une base pour être lue sans perte, une phrase par
 * colonne. Liste vide : le schéma convient.
 *
 * Une colonne absente est presque toujours une colonne renommée. Quand la base
 * porte UNE seule colonne du bon type que le code ne lit pas, elle est citée :
 * c'est le plus souvent la réponse, et elle épargne l'aller-retour dans Notion.
 */
export function schemaIssues(
  columns: readonly Column[],
  properties: Record<string, SchemaProperty>,
): string[] {
  const issues: string[] = [];
  const lues = new Set(columns.map((expected) => expected.name));
  const inconnues = Object.entries(properties).filter(([name]) => !lues.has(name));

  for (const expected of columns) {
    const found = properties[expected.name];

    if (!found) {
      if (expected.optional) continue;
      const candidates = inconnues
        .filter(([, property]) => expected.types.includes(property?.type as ColumnType))
        .map(([name]) => name);
      issues.push(
        `colonne « ${expected.name} » absente` +
          (candidates.length === 1 ? ` (renommée en « ${candidates[0]} » ?)` : ""),
      );
      continue;
    }

    if (!expected.types.includes(found.type as ColumnType)) {
      issues.push(
        `colonne « ${expected.name} » de type ${typeLabel(found.type)}, ` +
          `attendu ${expected.types.map(typeLabel).join(" ou ")}`,
      );
    }
  }

  return issues;
}

/**
 * Lit le schéma d'une base et le compare aux colonnes attendues.
 *
 * Une requête de plus par base et par balayage. Une base illisible lève, comme
 * le ferait la lecture de ses lignes juste après.
 */
export async function checkColumns(databaseId: string, columns: readonly Column[]): Promise<string[]> {
  const schema = (await getJson(`/databases/${databaseId}`)) as {
    properties?: Record<string, SchemaProperty>;
  };
  return schemaIssues(columns, schema.properties ?? {});
}

/** La phrase du rapport pour une base écartée, ou `null` si son schéma convient. */
export function schemaWarning(label: string, issues: string[]): string | null {
  if (issues.length === 0) return null;
  return (
    `${label} : ${issues.join(" ; ")}. Base ni écrite ni retirée ce tour-ci — ` +
    "rétablir la colonne dans Notion, ou aligner `map.ts` si le changement est voulu."
  );
}
