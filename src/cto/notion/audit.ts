import type { AuditSection, AttachedFile } from "../deliverables";
import { FileTooLargeError, importFile } from "../files";
import { fetchPage, getJson, queryDatabase, type NotionPage, type NotionRichText } from "./api";
import { children, convert, spans, type Block, type RawBlock, type Span } from "./blocks";
import { PROPS } from "./map";
import * as p from "./properties";

// ─────────────────────────────────────────────────────────────────────────────
// La lecture d'une page d'audit.
//
// Un audit n'est pas une ligne de base : c'est une page de mission (copie du
// modèle « Audit technique WordPress » du kit d'audit), sa synthèse, ses
// sous-pages et leurs bases inline. Ce module descend tout l'arbre et le rend
// en blocs typés, le même vocabulaire que les lettres, augmenté de trois
// formes que les lettres n'ont pas : l'encadré à enfants, le tableau, l'image.
//
// **Le modèle n'est pas figé dans le code.** Aucune sous-page n'est attendue
// par son nom, aucune base inline par son schéma — sauf ROADMAP, lue en plus
// pour relier les actions validées à la roadmap de l'espace. Toute base inline
// devient un tableau à l'endroit où elle se trouve, colonnes telles que
// l'atelier les nomme. Ajouter une section au modèle n'oblige donc à rien ici.
//
// **Ce que ça coûte.** Une requête par bloc porteur d'enfants, plus une par base
// inline et par sous-page : une centaine d'appels pour un audit complet, soit
// une trentaine de secondes à trois requêtes par seconde. C'est le prix de la
// fidélité, payé par balayage et par audit publié.
// ─────────────────────────────────────────────────────────────────────────────

/** Profondeur de descente. Plus large que pour une lettre : colonnes, encadrés, listes. */
const MAX_DEPTH = 8;

/** Ce que la lecture d'un audit produit, en plus des blocs. */
export interface AuditTree {
  synthese: Block[];
  sections: AuditSection[];
  /** Empreintes des images rapatriées. */
  fichiers: string[];
  /** Les lignes de la base inline ROADMAP, brutes, pour le pont vers la roadmap. */
  roadmapRows: NotionPage[];
  /**
   * Faux si une sous-page ou une base n'a pas pu être lue. La synchro ne
   * retire alors aucune action de la roadmap : une action absente de la
   * lecture n'est peut-être qu'une action pas vue.
   */
  complete: boolean;
  warnings: string[];
}

interface Context {
  title: string;
  dryRun: boolean;
  fichiers: Set<string>;
  roadmapRows: NotionPage[];
  sousPages: { id: string; titre: string }[];
  complete: boolean;
  warnings: string[];
}

function normalize(value: string): string {
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

function texte(rich: NotionRichText[] | undefined): Span[] {
  return spans(rich);
}

/**
 * Descend un bloc et rend ses enfants.
 *
 * `racine` vaut vrai sur la page d'audit elle-même : c'est là, et seulement là,
 * qu'une sous-page devient une section. Une sous-page de sous-page est signalée
 * et ignorée — le modèle n'en a pas, et la rendre à plat mélangerait deux
 * niveaux de lecture.
 */
async function walk(blockId: string, depth: number, ctx: Context, racine: boolean): Promise<Block[]> {
  const out: Block[] = [];

  for (const raw of await children(blockId)) {
    switch (raw.type) {
      case "child_page": {
        const titre = (raw.child_page as { title?: string } | undefined)?.title?.trim() || "Sans titre";
        if (racine) ctx.sousPages.push({ id: raw.id, titre });
        else ctx.warnings.push(`audit « ${ctx.title} » : sous-page imbriquée « ${titre} » ignorée.`);
        continue;
      }

      case "child_database": {
        const titre = (raw.child_database as { title?: string } | undefined)?.title?.trim() ?? "";
        const table = await databaseTable(raw.id, titre, ctx);
        if (table) out.push(table);
        continue;
      }

      case "table": {
        out.push(await tableBlock(raw));
        continue;
      }

      case "column_list":
      case "column":
      case "synced_block":
        // Des conteneurs de mise en page : leur contenu se lit dans l'ordre,
        // sans les colonnes, qui n'existent pas sur un téléphone.
        if (raw.has_children && depth < MAX_DEPTH) out.push(...(await walk(raw.id, depth + 1, ctx, racine)));
        continue;

      case "callout":
      case "toggle": {
        const contenu = raw[raw.type] as { rich_text?: NotionRichText[] } | undefined;
        const s = texte(contenu?.rich_text);
        if (raw.has_children && depth < MAX_DEPTH) {
          out.push({ k: "box", s, c: await walk(raw.id, depth + 1, ctx, racine) });
        } else if (s.length > 0) {
          out.push({ k: "callout", s });
        }
        continue;
      }

      case "image": {
        const image = await imageBlock(raw, ctx);
        if (image) out.push(image);
        continue;
      }

      case "bookmark":
      case "embed":
      case "link_preview": {
        const url = (raw[raw.type] as { url?: string } | undefined)?.url;
        if (url) out.push({ k: "p", s: [{ t: url, h: url }] });
        continue;
      }

      default: {
        const bloc = convert(raw);
        if (bloc) out.push(bloc);
        if (raw.has_children && depth < MAX_DEPTH) out.push(...(await walk(raw.id, depth + 1, ctx, racine)));
      }
    }
  }

  return out;
}

/** Un bloc tableau Notion : ses lignes sont ses enfants, ses cellules du texte enrichi. */
async function tableBlock(raw: RawBlock): Promise<Block> {
  const reglage = raw.table as { has_column_header?: boolean } | undefined;
  const lignes: Span[][][] = [];

  for (const ligne of await children(raw.id)) {
    if (ligne.type !== "table_row") continue;
    const cellules = (ligne.table_row as { cells?: NotionRichText[][] } | undefined)?.cells ?? [];
    lignes.push(cellules.map((cellule) => texte(cellule)));
  }

  if (reglage?.has_column_header && lignes.length > 0) {
    return { k: "table", head: lignes[0], rows: lignes.slice(1) };
  }
  return { k: "table", head: null, rows: lignes };
}

interface DatabaseSchema {
  properties?: Record<string, { name?: string; type?: string }>;
}

/**
 * Une base inline, mise à plat en tableau.
 *
 * Colonne titre d'abord, puis les autres dans l'ordre où l'API les rend —
 * l'ordre des vues Notion n'est pas exposé. Les lignes suivent leur ordre de
 * création, qui est celui dans lequel `/publier-notion` les a écrites.
 *
 * Illisible (non partagée, supprimée) : signalée, et remplacée par rien. Un
 * audit publié avec un trou vaut mieux qu'un audit pas publié du tout, et le
 * rapport dit lequel.
 */
async function databaseTable(databaseId: string, titre: string, ctx: Context): Promise<Block | null> {
  let schema: DatabaseSchema;
  let rows: NotionPage[];
  try {
    schema = (await getJson(`/databases/${databaseId}`)) as DatabaseSchema;
    rows = await queryDatabase(databaseId, undefined, [
      { timestamp: "created_time", direction: "ascending" },
    ]);
  } catch (error) {
    ctx.complete = false;
    ctx.warnings.push(
      `audit « ${ctx.title} » : base « ${titre || "sans titre"} » illisible (${
        error instanceof Error ? error.message : "erreur"
      }), omise.`,
    );
    return null;
  }

  if (normalize(titre) === normalize(PROPS.auditRoadmap.database)) ctx.roadmapRows.push(...rows);

  const colonnes = Object.values(schema.properties ?? {})
    .filter((colonne): colonne is { name: string; type?: string } => Boolean(colonne?.name))
    .sort((a, b) => Number(b.type === "title") - Number(a.type === "title"));

  return {
    k: "table",
    title: titre || undefined,
    head: colonnes.map((colonne) => [{ t: colonne.name }]),
    rows: rows.map((row) =>
      colonnes.map((colonne) => {
        const valeur = p.cellText(row.properties?.[colonne.name]);
        return valeur ? [{ t: valeur }] : [];
      }),
    ),
  };
}

/**
 * Une image, rapatriée comme une pièce jointe.
 *
 * Le lien d'une image hébergée par Notion expire au bout d'une heure : elle
 * doit être copiée en base, sinon l'audit perd ses visuels le lendemain. Une
 * image externe reste un lien — elle n'est pas à nous.
 */
async function imageBlock(raw: RawBlock, ctx: Context): Promise<Block | null> {
  const image = raw.image as
    | { type?: string; file?: { url?: string }; external?: { url?: string }; caption?: NotionRichText[] }
    | undefined;
  const legende = texte(image?.caption).map((span) => span.t).join("");

  if (image?.type === "external" && image.external?.url) {
    const url = image.external.url;
    return { k: "p", s: [{ t: legende || url, h: url }] };
  }
  if (!image?.file?.url) return null;

  const nom = decodeURIComponent(new URL(image.file.url).pathname.split("/").pop() || "image.png");
  try {
    const ref = await importFile(image.file.url, nom, { dryRun: ctx.dryRun });
    ctx.fichiers.add(ref.id);
    return { k: "img", f: ref.id, alt: legende };
  } catch (error) {
    ctx.warnings.push(
      `audit « ${ctx.title} » : image « ${nom} » non rapatriée (${
        error instanceof FileTooLargeError ? error.message : error instanceof Error ? error.message : "erreur"
      }).`,
    );
    return null;
  }
}

/** L'émoji d'une page, s'il y en a un. Une icône image ne se recopie pas. */
async function pageIcon(pageId: string): Promise<string | null> {
  const page = (await fetchPage(pageId)) as NotionPage & { icon?: { type?: string; emoji?: string } | null };
  return page.icon?.type === "emoji" ? (page.icon.emoji ?? null) : null;
}

/**
 * Lit toute une page d'audit.
 *
 * Lève si la page elle-même est illisible (non partagée avec l'intégration,
 * supprimée) : l'appelant garde alors la version déjà publiée, plutôt que de
 * publier un audit vide. Une sous-page ou une base illisible, elle, dégrade
 * l'audit sans l'arrêter, et le rapport le dit.
 */
export async function readAuditTree(
  pageId: string,
  title: string,
  options: { dryRun: boolean },
): Promise<AuditTree> {
  const ctx: Context = {
    title,
    dryRun: options.dryRun,
    fichiers: new Set(),
    roadmapRows: [],
    sousPages: [],
    complete: true,
    warnings: [],
  };

  const synthese = await walk(pageId, 0, ctx, true);
  const sections: AuditSection[] = [];

  for (const sousPage of ctx.sousPages) {
    try {
      // En séquence, pas en parallèle : l'espacement des appels (`api.ts`) ne
      // tient que si un seul appel part à la fois.
      const icone = await pageIcon(sousPage.id);
      const corps = await walk(sousPage.id, 0, ctx, false);
      sections.push({ id: sousPage.id, titre: sousPage.titre, icone, corps });
    } catch (error) {
      ctx.complete = false;
      ctx.warnings.push(
        `audit « ${title} » : partie « ${sousPage.titre} » illisible (${
          error instanceof Error ? error.message : "erreur"
        }), omise.`,
      );
    }
  }

  return {
    synthese,
    sections,
    fichiers: [...ctx.fichiers].sort(),
    roadmapRows: ctx.roadmapRows,
    complete: ctx.complete,
    warnings: ctx.warnings,
  };
}

/** Rapatrie l'annexe d'un audit. `null` et un signalement si elle ne passe pas. */
export async function importAnnex(
  file: { url: string; name: string },
  title: string,
  options: { dryRun: boolean },
  warnings: string[],
): Promise<AttachedFile | null> {
  try {
    return await importFile(file.url, file.name, { dryRun: options.dryRun });
  } catch (error) {
    warnings.push(
      `audit « ${title} » : annexe ${
        error instanceof FileTooLargeError
          ? `trop lourde (${error.message})`
          : `impossible à rapatrier (${error instanceof Error ? error.message : "erreur"})`
      }, publiée sans elle.`,
    );
    return null;
  }
}
