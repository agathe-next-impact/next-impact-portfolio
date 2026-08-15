import { z } from "zod";
import type { NewIntelItem } from "@sentinelle/types";
import { fetchJson, type CallBudget } from "./http";
import { slugForEndoflifeProduct } from "./catalog";
import { canonicalOf } from "./targets";

// ─────────────────────────────────────────────────────────────────────────────
// endoflife.date — la source agnostique, et la seule qui serve un client sans CMS.
//
// Gratuite, sans clé, elle couvre PHP, Node, nginx, Apache, WordPress, Drupal,
// Laravel, Symfony, Django, Angular, Vue, Bootstrap, jQuery… Elle produit les
// deux faits les plus utiles et les moins anxiogènes du produit :
//
//   · `eol`     — cette branche n'est plus corrigée (ou ne le sera plus le …) ;
//   · `release` — cette branche a une version plus récente que la vôtre.
//
// Le tour de force du format : les deux se ramènent à une PLAGE DE VERSIONS, ce
// qui permet au matching de traiter une fin de support exactement comme une
// faille — même code, même prudence, aucune branche particulière.
//
//   branche 8.1, fin de support   → affecte  >= 8.1 < 8.2
//   branche 8.1, dernière 8.1.29  → affecte  >= 8.1 < 8.1.29
// ─────────────────────────────────────────────────────────────────────────────

export const SOURCE = "endoflife.date";

const API = "https://endoflife.date/api/v1/products";

// Schéma volontairement tolérant : l'API ajoute des champs sans prévenir, et
// une addition amont ne doit pas faire tomber la collecte du jour.
const Release = z
  .object({
    name: z.string(),
    label: z.string().nullish(),
    releaseDate: z.string().nullish(),
    isEol: z.boolean().nullish(),
    eolFrom: z.string().nullish(),
    isMaintained: z.boolean().nullish(),
    latest: z
      .object({
        name: z.string(),
        date: z.string().nullish(),
        link: z.string().nullish(),
      })
      .nullish(),
  })
  .passthrough();

const Product = z
  .object({
    result: z
      .object({
        name: z.string(),
        label: z.string().nullish(),
        releases: z.array(Release),
      })
      .passthrough(),
  })
  .passthrough();

/**
 * Branche suivante, pour borner la plage d'une branche.
 *
 * « 8.1 » → « 8.2 », « 10 » → « 11 ». Renvoie null si la branche n'est pas
 * numérique (« lts », « stable ») : sans borne haute fiable, on préfère ne rien
 * produire plutôt qu'une plage qui déborderait sur des versions saines.
 */
export function nextBranch(branch: string): string | null {
  const cleaned = branch.trim().replace(/^v/i, "");
  if (!/^\d+(\.\d+)*$/.test(cleaned)) return null;

  const segments = cleaned.split(".").map((segment) => Number.parseInt(segment, 10));
  segments[segments.length - 1] += 1;
  return segments.join(".");
}

function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Convertit la fiche d'un produit en faits de veille.
 *
 * Fonction pure : c'est elle qui se teste, le réseau n'est qu'un tuyau.
 */
export function intelFromProduct(
  payload: unknown,
  now: Date = new Date(),
): NewIntelItem[] {
  const parsed = Product.safeParse(payload);
  if (!parsed.success) return [];

  const product = parsed.data.result;
  const slug = slugForEndoflifeProduct(product.name);
  const canonical = canonicalOf(slug);
  // Sans identité canonique, le fait ne pourrait se rattacher à aucun stack :
  // le collecter serait du bruit. On garde le type le plus neutre plutôt que
  // d'inventer, et le matching ne le trouvera simplement jamais.
  const targetType = canonical?.type ?? "framework";
  const targetEcosystem = canonical?.ecosystem ?? "endoflife";
  const label = product.label ?? product.name;

  // Version de repli conseillée : la plus récente des branches encore
  // maintenues. C'est la réponse à « je fais quoi ? » d'une fin de support.
  const recommended =
    product.releases.find((release) => release.isMaintained && release.latest?.name)?.latest
      ?.name ?? null;

  const items: NewIntelItem[] = [];

  for (const release of product.releases) {
    const branch = release.name;
    const upper = nextBranch(branch);
    const eolDate = parseDate(release.eolFrom);

    if (upper && eolDate) {
      const past = eolDate.getTime() <= now.getTime();
      items.push({
        kind: "eol",
        source: SOURCE,
        externalId: `${product.name}:${branch}:eol`,
        targetSlug: slug,
        targetType,
        targetEcosystem,
        affectedRange: `>= ${branch} < ${upper}`,
        fixedIn: recommended,
        severity: null,
        title: past
          ? `${label} ${branch} n'est plus corrigé depuis le ${eolDate.toISOString().slice(0, 10)}`
          : `${label} ${branch} cesse d'être corrigé le ${eolDate.toISOString().slice(0, 10)}`,
        raw: release,
        publishedAt: eolDate,
      });
    }

    const latest = release.latest?.name;
    if (upper && latest) {
      items.push({
        kind: "release",
        source: SOURCE,
        externalId: `${product.name}:${branch}:release`,
        targetSlug: slug,
        targetType,
        targetEcosystem,
        // Affecte les versions de la branche antérieures à la dernière publiée.
        affectedRange: `>= ${branch} < ${latest}`,
        fixedIn: latest,
        severity: null,
        title: `${label} ${latest} est disponible sur la branche ${branch}`,
        raw: release,
        publishedAt: parseDate(release.latest?.date),
      });
    }
  }

  return items;
}

export interface CollectReport {
  items: NewIntelItem[];
  /** Produits interrogés sans succès, avec la raison — journalisés, jamais tus. */
  failures: Array<{ product: string; reason: string }>;
}

/**
 * Interroge endoflife.date pour une liste de produits.
 *
 * Une requête par produit, budget partagé avec les autres collecteurs. Un
 * produit inconnu de la source (404) est une information, pas une panne : le
 * catalogue local a peut-être une entrée périmée, et il faut le voir passer
 * dans le journal sans que la collecte s'arrête.
 */
export async function collectEndoflife(
  products: string[],
  budget: CallBudget,
  now: Date = new Date(),
): Promise<CollectReport> {
  const items: NewIntelItem[] = [];
  const failures: CollectReport["failures"] = [];

  for (const product of products) {
    const outcome = await fetchJson<unknown>({ url: `${API}/${product}` }, budget);

    if (!outcome.ok) {
      failures.push({ product, reason: outcome.reason });
      continue;
    }

    const produced = intelFromProduct(outcome.data, now);
    if (produced.length === 0) {
      failures.push({ product, reason: "réponse illisible ou sans branche exploitable" });
      continue;
    }

    items.push(...produced);
  }

  return { items, failures };
}
