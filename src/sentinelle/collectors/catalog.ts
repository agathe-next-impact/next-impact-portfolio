import type { StackItemType } from "@sentinelle/types";

// ─────────────────────────────────────────────────────────────────────────────
// Où chercher la veille d'un composant — DES DONNÉES, PAS DU CODE.
//
// Même parti pris que le catalogue d'empreintes du scanner : ajouter une
// technologie surveillée doit être une entrée dans une table, pas une branche
// dans un `switch`. C'est la condition de la promesse « toute technologie ».
//
// Le couple `(type, ecosystem)` d'un stack_item suffit dans la plupart des cas
// à déduire la source ; ce fichier ne porte que les exceptions, c'est-à-dire
// les endroits où l'identifiant chez la source diffère de notre slug :
// « apache » se cherche sous « apache-http-server », Laravel sous
// « laravel/framework ». Deviner ces noms est impossible, les inventer est pire.
// ─────────────────────────────────────────────────────────────────────────────

/** Écosystèmes de paquets connus d'OSV.dev, écrits comme l'API les attend. */
export type OsvEcosystem = "npm" | "Packagist" | "PyPI";

export interface OsvCoordinates {
  ecosystem: OsvEcosystem;
  /** Nom du paquet DANS cet écosystème (« jquery », « drupal/core »). */
  name: string;
}

export interface SourceMap {
  /** Produit endoflife.date — fins de support et dernières versions de branche. */
  endoflife?: string;
  /** Paquet OSV.dev — vulnérabilités. */
  osv?: OsvCoordinates;
  /** Rôle dans l'écosystème WordPress — WPScan et api.wordpress.org. */
  wordpress?: "core" | "plugin" | "theme";
}

/**
 * Exceptions, par slug canonique.
 *
 * Un slug absent d'ici n'est pas pour autant non surveillé : les règles par
 * défaut (voir `sourcesFor`) couvrent npm, PyPI et endoflife, où le nom du
 * produit est le plus souvent notre slug.
 */
export const SOURCES: Record<string, SourceMap> = {
  // ── CMS ───────────────────────────────────────────────────────────────────
  wordpress: { endoflife: "wordpress", wordpress: "core" },
  drupal: { endoflife: "drupal", osv: { ecosystem: "Packagist", name: "drupal/core" } },
  joomla: { endoflife: "joomla" },
  typo3: { endoflife: "typo3", osv: { ecosystem: "Packagist", name: "typo3/cms-core" } },
  "craft-cms": { endoflife: "craft-cms", osv: { ecosystem: "Packagist", name: "craftcms/cms" } },
  ghost: { osv: { ecosystem: "npm", name: "ghost" } },

  // ── E-commerce ────────────────────────────────────────────────────────────
  magento: {
    endoflife: "magento",
    osv: { ecosystem: "Packagist", name: "magento/product-community-edition" },
  },
  prestashop: { osv: { ecosystem: "Packagist", name: "prestashop/prestashop" } },
  woocommerce: { wordpress: "plugin" },

  // ── Frameworks ────────────────────────────────────────────────────────────
  next: { endoflife: "nextjs", osv: { ecosystem: "npm", name: "next" } },
  nuxt: { endoflife: "nuxt", osv: { ecosystem: "npm", name: "nuxt" } },
  sveltekit: { osv: { ecosystem: "npm", name: "@sveltejs/kit" } },
  remix: { osv: { ecosystem: "npm", name: "@remix-run/react" } },
  astro: { osv: { ecosystem: "npm", name: "astro" } },
  gatsby: { osv: { ecosystem: "npm", name: "gatsby" } },
  angular: { endoflife: "angular", osv: { ecosystem: "npm", name: "@angular/core" } },
  vue: { endoflife: "vue", osv: { ecosystem: "npm", name: "vue" } },
  react: { endoflife: "react", osv: { ecosystem: "npm", name: "react" } },
  laravel: { endoflife: "laravel", osv: { ecosystem: "Packagist", name: "laravel/framework" } },
  symfony: { endoflife: "symfony", osv: { ecosystem: "Packagist", name: "symfony/symfony" } },
  django: { endoflife: "django", osv: { ecosystem: "PyPI", name: "django" } },
  express: { endoflife: "express", osv: { ecosystem: "npm", name: "express" } },

  // ── Serveurs et exécutions ────────────────────────────────────────────────
  php: { endoflife: "php" },
  nginx: { endoflife: "nginx" },
  apache: { endoflife: "apache-http-server" },
  iis: {}, // aucun catalogue public exploitable — affiché, non surveillé

  // ── Bibliothèques ─────────────────────────────────────────────────────────
  jquery: { endoflife: "jquery", osv: { ecosystem: "npm", name: "jquery" } },
  bootstrap: { endoflife: "bootstrap", osv: { ecosystem: "npm", name: "bootstrap" } },
};

/** Écosystèmes de paquets dont le nom OSV est, par défaut, notre slug. */
const OSV_BY_ECOSYSTEM: Record<string, OsvEcosystem> = {
  npm: "npm",
  pypi: "PyPI",
};

/**
 * Sources à interroger pour un composant.
 *
 * Ordre de résolution : l'exception nommée d'abord, les règles d'écosystème
 * ensuite. Un composant sans aucune source n'est pas une erreur — c'est un
 * hébergeur, un CDN, une plateforme SaaS. Le routeur le journalise et passe.
 */
export function sourcesFor(component: {
  slug: string;
  type: StackItemType;
  ecosystem: string | null;
}): SourceMap {
  const explicit = SOURCES[component.slug];
  if (explicit) {
    // Un plugin ou un thème WordPress ne figure jamais nommément dans le
    // catalogue — il y en a soixante mille. Le rôle vient du type.
    return explicit;
  }

  const ecosystem = component.ecosystem?.toLowerCase() ?? null;
  if (!ecosystem) return {};

  if (ecosystem === "wordpress") {
    if (component.type === "cms") return { wordpress: "core", endoflife: "wordpress" };
    if (component.type === "cms_theme") return { wordpress: "theme" };
    // Extensions et modules e-commerce WordPress : même API, même catalogue.
    return { wordpress: "plugin" };
  }

  if (ecosystem === "endoflife") return { endoflife: component.slug };

  const osvEcosystem = OSV_BY_ECOSYSTEM[ecosystem];
  if (osvEcosystem) return { osv: { ecosystem: osvEcosystem, name: component.slug } };

  // Packagist sans coordonnée explicite : un nom Packagist est « vendor/paquet »,
  // il ne se devine pas depuis un slug. Mieux vaut ne rien collecter que de
  // fabriquer des requêtes sur des paquets qui n'existent pas.
  return {};
}

/**
 * Produits endoflife.date suivis en permanence, indépendamment des clients.
 *
 * Deux raisons de ne pas attendre qu'un client les amène : la veille a de la
 * valeur dès le premier jour, et un nouvel abonné est couvert à la seconde où
 * sa fiche est créée plutôt qu'au lendemain de la première collecte. Vingt
 * requêtes quotidiennes sur une API gratuite et sans clé : le coût est nul.
 */
export const ENDOFLIFE_BASELINE = [
  "php",
  "nodejs",
  "nginx",
  "apache-http-server",
  "wordpress",
  "drupal",
  "joomla",
  "typo3",
  "laravel",
  "symfony",
  "django",
  "angular",
  "vue",
  "react",
  "jquery",
  "bootstrap",
  "nextjs",
  "nuxt",
  "magento",
  "craft-cms",
];

/**
 * Slug canonique correspondant à un produit endoflife.date.
 *
 * L'inverse de `SOURCES` : la collecte parle le vocabulaire de la source, le
 * matching celui du scanner. C'est ici que les deux se rejoignent.
 */
export function slugForEndoflifeProduct(product: string): string {
  for (const [slug, sources] of Object.entries(SOURCES)) {
    if (sources.endoflife === product) return slug;
  }
  return product;
}
