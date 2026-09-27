import type { NotionPage, NotionProperty } from "./client";

// ─────────────────────────────────────────────────────────────────────────────
// Lecture et écriture des propriétés d'une page Notion.
//
// La lecture reprend la règle de `@cto/notion/properties.ts`, dupliquée pour la
// même raison d'isolation que `client.ts` : **une propriété absente, vide ou
// d'un type inattendu rend `null`, jamais une exception.** Une colonne renommée
// dans l'atelier doit faire échouer PROPREMENT la relecture d'une ligne (elle
// remonte dans le rapport de synchro), jamais interrompre le balayage des
// autres.
//
// L'écriture est nouvelle : la base CTO n'est lue que dans un sens (Notion →
// Postgres), la base Sentinelle est écrite dans les deux — c'est elle qui crée
// et rédige les pages, avant qu'un humain les relise.
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

export function date(page: NotionPage, name: string): Date | null {
  const property = prop(page, name);
  if (!property || property.type !== "date") return null;
  const value = property.date as { start?: string } | null;
  if (!value?.start) return null;
  const parsed = new Date(value.start);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

// ── Écriture ──────────────────────────────────────────────────────────────
//
// Une fonction par type de propriété, chacune produisant exactement la forme
// que l'API Notion attend en écriture — pas la même que celle qu'elle rend en
// lecture (`select` en lecture porte `{ name }`, en écriture aussi, mais
// `rich_text` en écriture est un tableau à un seul fragment, pas le texte nu).

export function titleProp(value: string): unknown {
  return { title: [{ text: { content: value.slice(0, 2000) } }] };
}

export function richTextProp(value: string): unknown {
  return { rich_text: [{ text: { content: value.slice(0, 2000) } }] };
}

export function selectProp(value: string): unknown {
  return { select: { name: value } };
}

export function urlProp(value: string | null): unknown {
  return { url: value };
}

export function checkboxProp(value: boolean): unknown {
  return { checkbox: value };
}

export function dateProp(value: Date): unknown {
  return { date: { start: value.toISOString() } };
}
