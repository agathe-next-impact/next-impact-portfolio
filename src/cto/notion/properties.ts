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
