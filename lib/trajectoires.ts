// ─────────────────────────────────────────────────────────────────────────────
// Les trois prestations de développement : source unique de leur NOM et de leur
// MONTANT (charte v1.6, ADR-014).
//
// Noms arbitrés par Agathe le 2026-09-27, à la place de ceux de l'ADR-013 ;
// périmètres revus le 2026-09-28 (ADR-031) :
//   – Optimisation (ex-Consolider) : le WordPress existant, gardé et remis à
//     niveau, sans reconstruction ;
//   – Refonte      (ex-Découpler)  : WordPress sur mesure OU WordPress headless,
//     deux variantes à égalité, choisies selon la situation ; la prestation
//     recommandée ;
//   – Évolution    (ex-Refonder)   : web app ou plateforme.
// Un seul nom par prestation ; la technique vient en sous-titre, jamais à la
// place du nom. Les identifiants techniques (`forfait-classique`,
// `forfait-headless`, `forfait-webapp`) et les ancres de /solutions-web ne
// changent pas.
//
// Sur une carte de prestation (ADR-015), le nom est le titre, très visible, et
// la carte dit aussitôt ce que c'est techniquement : `technique` (le nom
// technique), puis `enClair` (une phrase, sans jargon). Les deux se lisent ici.
//
// Le montant est numérique : le budget d'un pack (lib/situations.ts) se
// calcule, il ne se recopie pas. Les cartes, le menu, /tarifs et les packs
// lisent ce fichier ; components/services/PricingCards.tsx garde le détail
// rédactionnel de chaque prestation.
//
// Module sans dépendance, importable côté serveur comme côté client.
// ─────────────────────────────────────────────────────────────────────────────

export type Lang = "fr" | "en";

export type TrajectoireSlug = "forfait-classique" | "forfait-headless" | "forfait-webapp";

/** Type de site livré : il fixe la grille du suivi et maintenance. */
export type SiteKind = "wordpress" | "headless" | "webapp";

export type VarianteSlug = "sur-mesure" | "headless";

/**
 * Une variante d'une prestation (ADR-031) : la Refonte se livre en WordPress
 * sur mesure ou en WordPress headless. Les deux sont à égalité ; le choix se
 * fait selon la situation, jamais par défaut.
 */
export interface Variante {
  slug: VarianteSlug;
  technique: Record<Lang, string>;
  enClair: Record<Lang, string>;
  /** Quand choisir cette variante, en une phrase. */
  quand: Record<Lang, string>;
  priceValue: number;
  siteKind: SiteKind;
}

export interface Trajectoire {
  slug: TrajectoireSlug;
  /** Le seul nom de la prestation. */
  name: Record<Lang, string>;
  /** Nom technique, en sous-titre. */
  technique: Record<Lang, string>;
  /** Ce que c'est techniquement, en une phrase lisible par un non-développeur. */
  enClair: Record<Lang, string>;
  /** Plancher du forfait, en euros hors taxes (la variante la moins chère). */
  priceValue: number;
  /** Type de site du plancher : fixe le suivi du budget « à partir de ». */
  siteKind: SiteKind;
  /** Les variantes, quand la prestation en a (la Refonte). */
  variantes?: Variante[];
  /** Ancre de la section détaillée sur /solutions-web. */
  href: string;
  recommended?: boolean;
}

export const TRAJECTOIRES: Record<TrajectoireSlug, Trajectoire> = {
  "forfait-classique": {
    slug: "forfait-classique",
    name: { fr: "Optimisation", en: "Optimization" },
    technique: { fr: "WordPress optimisé", en: "Optimized WordPress" },
    enClair: {
      fr: "Votre site actuel est gardé et remis à niveau : vitesse, extensions, sécurité, hébergement. Sans reconstruction.",
      en: "Your current site is kept and brought up to standard: speed, plugins, security, hosting. No rebuild.",
    },
    priceValue: 1500,
    siteKind: "wordpress",
    href: "/solutions-web#forfait-classique",
  },
  "forfait-headless": {
    slug: "forfait-headless",
    name: { fr: "Refonte", en: "Redesign" },
    technique: {
      fr: "WordPress sur mesure ou headless",
      en: "Custom or headless WordPress",
    },
    enClair: {
      fr: "Votre site est reconstruit, et votre équipe publie toujours dans WordPress : thème sur mesure, ou site affiché refait avec Next.js.",
      en: "Your site is rebuilt, and your team still publishes in WordPress: a bespoke theme, or the visible site rebuilt with Next.js.",
    },
    priceValue: 2250,
    siteKind: "wordpress",
    variantes: [
      {
        slug: "sur-mesure",
        technique: { fr: "WordPress sur mesure", en: "Custom WordPress" },
        enClair: {
          fr: "Un thème WordPress écrit pour votre site, léger, avec le strict nécessaire en extensions. Un seul outil à tenir.",
          en: "A WordPress theme written for your site, lightweight, with only the plugins you need. One tool to maintain.",
        },
        quand: {
          fr: "Quand WordPress convient à votre équipe et que le budget de suivi doit rester léger.",
          en: "When WordPress suits your team and the care budget must stay light.",
        },
        priceValue: 2250,
        siteKind: "wordpress",
      },
      {
        slug: "headless",
        technique: { fr: "WordPress headless", en: "Headless WordPress" },
        enClair: {
          fr: "WordPress reste votre outil de publication. Le site affiché est reconstruit avec Next.js.",
          en: "WordPress stays your publishing tool. The visible site is rebuilt with Next.js.",
        },
        quand: {
          fr: "Quand la vitesse, le design ou le trafic sont décisifs, et que le site doit pouvoir grandir.",
          en: "When speed, design or traffic are decisive, and the site must be able to grow.",
        },
        priceValue: 4000,
        siteKind: "headless",
      },
    ],
    href: "/solutions-web#forfait-headless",
    recommended: true,
  },
  "forfait-webapp": {
    slug: "forfait-webapp",
    name: { fr: "Évolution", en: "Evolution" },
    technique: { fr: "Web app ou plateforme", en: "Web app or platform" },
    enClair: {
      fr: "Une application web sur mesure, construite avec Next.js : espace client, annuaire, réservation, paiement.",
      en: "A bespoke web application, built with Next.js: client area, directory, booking, payment.",
    },
    priceValue: 6500,
    siteKind: "webapp",
    href: "/solutions-web#forfait-webapp",
  },
};

export const TRAJECTOIRE_ORDER: TrajectoireSlug[] = [
  "forfait-classique",
  "forfait-headless",
  "forfait-webapp",
];

/**
 * La prestation que désigne ce nom, ou `undefined` si le nom est celui d'une
 * autre offre (visio, audit, suivi, expert technique). Les packs portent le nom
 * lu dans TRAJECTOIRES : une carte reconnaît ainsi une prestation sans que
 * lib/situations.ts ait à le redire.
 */
export function trajectoireDuNom(nom: string): Trajectoire | undefined {
  return TRAJECTOIRE_ORDER.map((slug) => TRAJECTOIRES[slug]).find(
    (t) => t.name.fr === nom || t.name.en === nom,
  );
}

const NBSP = " ";

/**
 * Montant formaté selon la charte §3 : espace insécable entre les milliers et
 * avant le symbole en français (« 2 250 € »), symbole en tête en anglais
 * (« €2,250 »). Formatage manuel, identique côté serveur et côté client.
 */
export function formatEuros(value: number, lang: Lang): string {
  const grouped = Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, lang === "en" ? "," : NBSP);
  return lang === "en" ? `€${grouped}` : `${grouped}${NBSP}€`;
}

/** Prix d'une variante, toujours « à partir de » : « À partir de 4 000 € HT ». */
export function variantePriceHT(v: Variante, lang: Lang): string {
  const amount = formatEuros(v.priceValue, lang);
  return lang === "en" ? `From ${amount} excl. VAT` : `À partir de ${amount} HT`;
}

/** Prix d'une prestation, toujours « à partir de ». */
export function trajectoirePrice(slug: TrajectoireSlug, lang: Lang): string {
  const amount = formatEuros(TRAJECTOIRES[slug].priceValue, lang);
  return lang === "en" ? `From ${amount}` : `À partir de ${amount}`;
}

/** Le même prix, hors taxes affiché : « À partir de 2 250 € HT », « From €2,250 excl. VAT ». */
export function trajectoirePriceHT(slug: TrajectoireSlug, lang: Lang): string {
  return `${trajectoirePrice(slug, lang)}${lang === "en" ? " excl. VAT" : " HT"}`;
}
