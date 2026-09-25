import type { NotionPage, NotionProperty } from "./api";

// ─────────────────────────────────────────────────────────────────────────────
// Lecture des propriétés d'une page Notion.
//
// Fonctions pures, sans réseau : c'est ici que se concentre tout ce qui peut
// casser silencieusement le jour où une colonne est renommée dans l'atelier, et
// c'est donc ici que portent les tests.
//
// Règle unique et sans exception : **une propriété absente, vide ou d'un type
// inattendu rend `null`, jamais une exception.** Une colonne renommée doit
// dégrader un livrable, pas interrompre le balayage des trois autres bases.
// Les manques remontent dans le rapport de synchro, où ils se voient.
// ─────────────────────────────────────────────────────────────────────────────

function prop(page: NotionPage, name: string): NotionProperty | null {
  const value = page.properties?.[name];
  return value && typeof value === "object" ? value : null;
}

interface RichTextFragment {
  plain_text?: string;
}

function joinRichText(value: unknown): string | null {
  if (!Array.isArray(value)) return null;
  const text = (value as RichTextFragment[])
    .map((fragment) => fragment?.plain_text ?? "")
    .join("")
    .trim();
  return text.length > 0 ? text : null;
}

/** Titre ou texte enrichi, rendu à plat. Le formatage Notion n'est pas conservé. */
export function text(page: NotionPage, name: string): string | null {
  const property = prop(page, name);
  if (!property) return null;
  if (property.type === "title") return joinRichText(property.title);
  if (property.type === "rich_text") return joinRichText(property.rich_text);
  return null;
}

export function select(page: NotionPage, name: string): string | null {
  const property = prop(page, name);
  if (!property || property.type !== "select") return null;
  const option = property.select as { name?: string } | null;
  return option?.name?.trim() || null;
}

export function multiSelect(page: NotionPage, name: string): string[] {
  const property = prop(page, name);
  if (!property || property.type !== "multi_select") return [];
  const options = property.multi_select as { name?: string }[] | null;
  if (!Array.isArray(options)) return [];
  return options.map((option) => option?.name?.trim()).filter((v): v is string => Boolean(v));
}

/**
 * Début d'une propriété date.
 *
 * Seule la borne de début est lue. Les colonnes de l'atelier sont des dates
 * simples ; le jour où l'une devient une plage, c'est son début qui reste la
 * date qui compte pour le client.
 */
export function date(page: NotionPage, name: string): Date | null {
  const property = prop(page, name);
  if (!property || property.type !== "date") return null;
  const value = property.date as { start?: string } | null;
  if (!value?.start) return null;
  const parsed = new Date(value.start);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function number(page: NotionPage, name: string): number | null {
  const property = prop(page, name);
  if (!property || property.type !== "number") return null;
  const value = property.number;
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

/**
 * Propriété URL.
 *
 * Rendue telle quelle, sans validation : c'est un lien que TU as saisi, pas une
 * entrée d'utilisateur. Le vérifier ici donnerait l'illusion d'un contrôle que
 * seule la relecture avant publication exerce vraiment.
 */
export function url(page: NotionPage, name: string): string | null {
  const property = prop(page, name);
  if (!property || property.type !== "url") return null;
  const value = property.url;
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

/** Propriété e-mail. Rendue telle quelle, en minuscules et sans espaces de bord. */
export function email(page: NotionPage, name: string): string | null {
  const property = prop(page, name);
  if (!property || property.type !== "email") return null;
  const value = property.email;
  return typeof value === "string" && value.trim().length > 0 ? value.trim().toLowerCase() : null;
}

export function checkbox(page: NotionPage, name: string): boolean {
  const property = prop(page, name);
  if (!property || property.type !== "checkbox") return false;
  return property.checkbox === true;
}

/**
 * Identifiants des pages liées par une relation.
 *
 * Toujours un tableau, y compris pour une relation qui n'en accepte qu'une :
 * Notion ne distingue pas les deux, et faire semblant du contraire produirait
 * une erreur de type le jour où deux clients seraient cochés par mégarde.
 */
export function relation(page: NotionPage, name: string): string[] {
  const property = prop(page, name);
  if (!property || property.type !== "relation") return [];
  const links = property.relation as { id?: string }[] | null;
  if (!Array.isArray(links)) return [];
  return links.map((link) => link?.id).filter((v): v is string => Boolean(v));
}

/** Nombre à la française, espace fine insécable comprise : c'est ainsi qu'il s'affiche. */
function formatNumber(value: number): string {
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(value);
}

/**
 * N'importe quelle propriété, rendue en texte lisible.
 *
 * Sert aux bases inline d'un audit, dont la synchro ne connaît pas le schéma à
 * l'avance : chaque cellule s'affiche telle que l'atelier la montre. Les types
 * qui n'ont rien à dire à un client (relation, personne, date de création…)
 * rendent une chaîne vide plutôt qu'un identifiant.
 */
export function cellText(property: NotionProperty | null | undefined): string {
  if (!property || typeof property !== "object") return "";
  const value = property[property.type] as unknown;

  switch (property.type) {
    case "title":
    case "rich_text":
      return joinRichText(value) ?? "";
    case "number":
      return typeof value === "number" && Number.isFinite(value) ? formatNumber(value) : "";
    case "select":
    case "status":
      return (value as { name?: string } | null)?.name?.trim() ?? "";
    case "multi_select":
      return Array.isArray(value)
        ? (value as { name?: string }[]).map((option) => option?.name?.trim() ?? "").filter(Boolean).join(", ")
        : "";
    case "date": {
      const start = (value as { start?: string } | null)?.start;
      if (!start) return "";
      const parsed = new Date(start);
      return Number.isNaN(parsed.getTime())
        ? ""
        : new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeZone: "Europe/Paris" }).format(parsed);
    }
    case "checkbox":
      return value === true ? "Oui" : "Non";
    case "url":
    case "email":
    case "phone_number":
      return typeof value === "string" ? value.trim() : "";
    case "formula": {
      const formula = value as { type?: string; string?: string; number?: number; boolean?: boolean } | null;
      if (!formula) return "";
      if (formula.type === "string") return formula.string?.trim() ?? "";
      if (formula.type === "number" && typeof formula.number === "number") return formatNumber(formula.number);
      if (formula.type === "boolean") return formula.boolean ? "Oui" : "Non";
      return "";
    }
    default:
      return "";
  }
}

/** Une pièce jointe d'une colonne « Fichiers et médias ». */
export interface NotionFile {
  name: string;
  /** URL de téléchargement. Signée et valable UNE HEURE pour un fichier hébergé par Notion. */
  url: string;
  /** Vrai si le fichier est hébergé par Notion (lien éphémère), faux pour un lien externe. */
  hosted: boolean;
}

/**
 * Les pièces d'une colonne fichiers, dans l'ordre de l'atelier.
 *
 * Le lien d'un fichier hébergé par Notion expire au bout d'une heure : il ne
 * sert qu'à le télécharger tout de suite, jamais à être stocké.
 */
export function files(page: NotionPage, name: string): NotionFile[] {
  const property = prop(page, name);
  if (!property || property.type !== "files") return [];
  const list = property.files as
    | { name?: string; type?: string; file?: { url?: string }; external?: { url?: string } }[]
    | null;
  if (!Array.isArray(list)) return [];

  const out: NotionFile[] = [];
  for (const item of list) {
    const hosted = item?.type === "file";
    const url = hosted ? item.file?.url : item?.external?.url;
    if (!url) continue;
    out.push({ name: item.name?.trim() || "document", url, hosted });
  }
  return out;
}
