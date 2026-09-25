import { getJson, type NotionRichText } from "./api";

// ─────────────────────────────────────────────────────────────────────────────
// Le corps d'une page Notion, rendu en blocs typés.
//
// **Ni HTML ni Markdown, à dessein.** Du HTML obligerait la page cliente à
// injecter une chaîne venue d'ailleurs ; du Markdown ajouterait un analyseur au
// rendu, et donc une dépendance de plus dans un espace qui n'en a aucune. Des
// blocs typés se rendent en composants React, sans confiance à accorder ni
// bibliothèque à suivre.
//
// Le vocabulaire est délibérément court — sept formes de bloc. Une lettre écrite
// selon les directives éditoriales n'utilise ni tableau, ni colonne, ni bloc
// synchronisé ; un type inconnu est donc ignoré en silence plutôt que rendu de
// travers. Le jour où une forme manque, elle s'ajoute ici et nulle part ailleurs.
// ─────────────────────────────────────────────────────────────────────────────

/** Un fragment de texte et son style. Clés courtes : une lettre pèse en base. */
export interface Span {
  /** Le texte. */
  t: string;
  /** Gras. */
  b?: true;
  /** Italique. */
  i?: true;
  /** Code. */
  c?: true;
  /** Lien. */
  h?: string;
}

export type Block =
  | { k: "h1" | "h2" | "h3" | "p" | "quote" | "callout"; s: Span[] }
  | { k: "li" | "oli"; s: Span[] }
  | { k: "hr" }
  | { k: "code"; t: string }
  // Les trois formes suivantes ne sortent que de la lecture d'un audit
  // (`audit.ts`) : une lettre n'en contient pas, et `pageBody` ne les produit
  // jamais. Elles vivent dans le même type pour qu'un seul rendu serve aux deux.
  /** Un encadré et ce qu'il contient : un callout Notion à enfants. `s` peut être vide. */
  | { k: "box"; s: Span[]; c: Block[] }
  /**
   * Un tableau : bloc tableau Notion, ou base inline mise à plat. `title` porte
   * le nom de la base ; `head` est null quand le tableau n'a pas d'en-tête.
   */
  | { k: "table"; title?: string; head: Span[][] | null; rows: Span[][][] }
  /** Une image rapatriée, par l'empreinte de son contenu (`cto_files`). */
  | { k: "img"; f: string; alt: string };

/** Profondeur maximale de descente dans les blocs imbriqués. */
const MAX_DEPTH = 3;

export interface RawBlock {
  id: string;
  type: string;
  has_children?: boolean;
  [key: string]: unknown;
}

export function spans(rich: NotionRichText[] | undefined): Span[] {
  if (!Array.isArray(rich)) return [];
  const out: Span[] = [];

  for (const fragment of rich) {
    const texte = fragment?.plain_text ?? "";
    if (texte === "") continue;

    const span: Span = { t: texte };
    const annotations = fragment.annotations;
    if (annotations?.bold) span.b = true;
    if (annotations?.italic) span.i = true;
    if (annotations?.code) span.c = true;
    if (fragment.href) span.h = fragment.href;
    out.push(span);
  }

  return out;
}

export function convert(raw: RawBlock): Block | null {
  const contenu = raw[raw.type] as { rich_text?: NotionRichText[] } | undefined;
  const s = spans(contenu?.rich_text);

  switch (raw.type) {
    case "heading_1":
      return s.length > 0 ? { k: "h1", s } : null;
    case "heading_2":
      return s.length > 0 ? { k: "h2", s } : null;
    case "heading_3":
      return s.length > 0 ? { k: "h3", s } : null;
    case "paragraph":
      // Un paragraphe vide est un espacement d'auteur, pas un contenu : le
      // garder produirait des trous que la mise en page gère déjà.
      return s.length > 0 ? { k: "p", s } : null;
    case "bulleted_list_item":
    case "to_do":
      return s.length > 0 ? { k: "li", s } : null;
    case "numbered_list_item":
      return s.length > 0 ? { k: "oli", s } : null;
    case "quote":
      return s.length > 0 ? { k: "quote", s } : null;
    case "callout":
      return s.length > 0 ? { k: "callout", s } : null;
    case "divider":
      return { k: "hr" };
    case "code":
      return s.length > 0 ? { k: "code", t: s.map((span) => span.t).join("") } : null;
    default:
      return null;
  }
}

export async function children(blockId: string): Promise<RawBlock[]> {
  const blocks: RawBlock[] = [];
  let cursor: string | null = null;

  do {
    const params = new URLSearchParams({ page_size: "100" });
    if (cursor) params.set("start_cursor", cursor);

    const data = (await getJson(`/blocks/${blockId}/children?${params}`)) as {
      results: RawBlock[];
      next_cursor: string | null;
      has_more: boolean;
    };
    blocks.push(...data.results);
    cursor = data.has_more ? data.next_cursor : null;
  } while (cursor);

  return blocks;
}

async function collect(blockId: string, depth: number): Promise<Block[]> {
  const out: Block[] = [];

  for (const raw of await children(blockId)) {
    const bloc = convert(raw);
    if (bloc) out.push(bloc);

    // Les enfants sont mis À PLAT, sans niveau d'indentation. Une lettre n'a pas
    // de listes à trois niveaux, et représenter l'imbrication coûterait un
    // modèle récursif au rendu pour un cas qui ne se présente pas.
    if (raw.has_children && depth < MAX_DEPTH) {
      out.push(...(await collect(raw.id, depth + 1)));
    }
  }

  return out;
}

/**
 * Le corps d'une page Notion.
 *
 * Coûteux : une requête par bloc porteur d'enfants, chacune espacée par la
 * limite de débit de l'API. Sur une lettre mensuelle, c'est quelques secondes,
 * une fois par mois — d'où la comparaison d'empreinte en amont, qui évite de
 * repayer ce prix à chaque balayage quotidien.
 */
export async function pageBody(pageId: string): Promise<Block[]> {
  return collect(pageId, 0);
}

/** Le premier paragraphe, pour servir d'accroche quand aucune n'est saisie. */
export function firstParagraph(body: Block[]): string | null {
  for (const bloc of body) {
    if (bloc.k === "p") {
      const texte = bloc.s.map((span) => span.t).join("").trim();
      if (texte.length > 0) return texte;
    }
  }
  return null;
}
