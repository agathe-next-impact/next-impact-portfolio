import { Metadata } from "next";
import { routing, PUBLISHED_LOCALES, type Locale } from "@/i18n/routing";
// Nom et plancher des trois prestations : lus dans lib/trajectoires.ts (charte
// v1.6, ADR-014), jamais réécrits ici. Module sans dépendance.
import { TRAJECTOIRES, TRAJECTOIRE_ORDER, formatEuros } from "@/lib/trajectoires";
// Prix des deux offres de conseil : lus dans lib/visio-conseil.ts. Ce module
// n'est importé que côté serveur (pages et JSON-LD) : rien ne part au client.
import { OFFERS as CONSEIL_OFFERS } from "@/lib/visio-conseil";
// Les deux prestations web (ADR-047) : noms, prix et délais lus dans leur source.
import { EXTENSION_PRIX, LANDING, LANDING_PRIX, REFONTE_WP } from "@/lib/prestations-web";

const conseilPrice = (id: string, locale: Locale): string =>
  CONSEIL_OFFERS.find((offer) => offer.id === id)!.tiers[0].price[locale];

/** « Optimisation, Refonte ou Évolution » : les trois prestations, sous leur seul nom. */
function prestationNames(locale: Locale): string {
  const names = TRAJECTOIRE_ORDER.map((slug) => TRAJECTOIRES[slug].name[locale]);
  const last = names.pop();
  return `${names.join(", ")} ${locale === "en" ? "or" : "ou"} ${last}`;
}

const OG_LOCALES: Record<Locale, string> = {
  fr: "fr_FR",
  en: "en_US",
};

const HREFLANG_LOCALES: Record<Locale, string> = {
  fr: "fr-FR",
  en: "en-US",
};

function absoluteUrl(url: string): string {
  return url.startsWith("http") ? url : `${siteConfig.url}${url}`;
}

/**
 * Construit l'URL d'une image OpenGraph générée à la volée (/og.png).
 * Le titre et la description (déjà localisés) sont passés en query :
 * chaque page obtient ainsi une carte sociale unique, à la charte Blueprint.
 */
function dynamicOgImage(
  title: string,
  description?: string,
  eyebrow?: string,
): { url: string; width: number; height: number; alt: string } {
  const params = new URLSearchParams({ title });
  if (description) params.set("desc", description);
  if (eyebrow) params.set("tag", eyebrow);
  return {
    url: `${siteConfig.url}/og.png?${params.toString()}`,
    width: 1200,
    height: 630,
    alt: title,
  };
}

function buildLocalizedPaths(
  path: string,
  locales: Locale[] = [...routing.locales],
): Record<string, string> {
  const cleaned = path === "/" ? "" : path;
  const langs: Record<string, string> = {};
  for (const loc of locales) {
    const prefix = loc === routing.defaultLocale ? "" : `/${loc}`;
    langs[HREFLANG_LOCALES[loc]] = `${siteConfig.url}${prefix}${cleaned || "/"}`;
  }
  langs["x-default"] = `${siteConfig.url}${path === "/" ? "/" : path}`;
  return langs;
}

/**
 * Charte v1.6 (§ typographie) : tiret cadratin interdit partout, méta-
 * descriptions comprises. Les titres et descriptions de metadata viennent de
 * sources multiples (front matter, lib/case-studies-data.ts, messages) : on
 * les normalise ici, à la sortie, sans toucher au texte affiché dans la page.
 * Titre : « A — B » devient « A : B » (« A · B » s'il y a déjà un deux-points).
 * Description : l'incise « — … — » devient une incise entre virgules.
 */
function stripEmDash(text: string, kind: "title" | "description"): string {
  if (!text.includes("—")) return text;
  if (kind === "title") {
    const separator = text.includes(":") ? " · " : " : ";
    return text.replace(/\s*—\s*/g, separator);
  }
  return text.replace(/\s*—\s*/g, ", ").replace(/,\s*([.;:!?])/g, "$1");
}

/**
 * Configuration des métadonnées par défaut du site
 */
export const siteConfig = {
  name: "Next Impact",
  title: "Next Impact",
  // Description d'entité, reprise par les nœuds Organization, WebSite, Person
  // et LocalBusiness du JSON-LD. Les trois prestations y portent leur seul nom
  // (lib/trajectoires.ts) ; la veille technique et stratégique, qui distingue
  // chaque offre, y est dite (ADR-014).
  description:
    "Refonte de site WordPress : rapide, moderne, sans tout reconstruire. " +
    `Trois prestations, ${prestationNames("fr")} : prix affichés, délai annoncé, performance mesurée avant et après, veille technique et stratégique à chaque étape.`,
  url: "https://www.next-impact.digital",
  ogImage: "/img/desktop-screen-next-impact.png",
  defaultImage: {
    url: "/img/desktop-screen-next-impact.png",
    width: 1200,
    height: 630,
    alt: "Next Impact · Refonte de site WordPress",
  },
  creator: "Agathe Karinthi-Martin",
  // Mots-clés communs à toutes les pages : alignés sur le catalogue (charte
  // v1.6). Les anciens termes « IA coding », « No-code », « SaaS », « PWA »,
  // « Application mobile »… décrivaient un positionnement abandonné.
  keywords: [
    "Refonte site WordPress",
    "WordPress headless",
    "Maintenance WordPress",
    "Expert technique externalisé",
    "Next Impact",
  ],
  authors: [{ name: "Agathe Karinthi-Martin", url: "https://www.next-impact.digital" }],
};

/**
 * Options pour la génération des métadonnées d'une page
 */
export interface MetadataOptions {
  title: string;
  description: string;
  path?: string;
  image?: string | { url: string; width: number; height: number; alt: string };
  /** Étiquette en haut-droite de la carte OG dynamique (≤ 42 chars, mis en MAJ). */
  eyebrow?: string;
  keywords?: string[];
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  noindex?: boolean;
  canonical?: string;
  locale?: Locale;
  alternateLocales?: Locale[];
}

/**
 * Génère les métadonnées complètes pour une page
 * @param options - Options de métadonnées spécifiques à la page
 * @returns Objet Metadata conforme aux standards Next.js
 */
export function generatePageMetadata(options: MetadataOptions): Metadata {
  const {
    title: rawTitle,
    description: rawDescription,
    path = "",
    image,
    eyebrow,
    keywords = [],
    type = "website",
    publishedTime,
    modifiedTime,
    authors,
    noindex = false,
    canonical,
    locale = routing.defaultLocale,
    alternateLocales: requestedLocales = [...routing.locales],
  } = options;
  // Une langue non publiée (ENGLISH_PUBLISHED) n'est jamais annoncée.
  const alternateLocales = requestedLocales.filter((l) => PUBLISHED_LOCALES.includes(l));

  const title = stripEmDash(rawTitle, "title");
  const description = stripEmDash(rawDescription, "description");

  // Construction de l'URL complète (avec préfixe de locale si non par défaut)
  const localePrefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  const fullPath = path === "/" || !path ? "/" : path;
  const localizedPath = `${localePrefix}${fullPath === "/" ? "" : fullPath}` || "/";
  const url = `${siteConfig.url}${localizedPath}`;
  const canonicalUrl = canonical ? absoluteUrl(canonical) : url;
  const languageAlternates = buildLocalizedPaths(fullPath, alternateLocales);

  // Gestion de l'image OpenGraph
  let ogImage;
  if (image) {
    if (typeof image === "string") {
      ogImage = {
        url: image.startsWith("http") ? image : `${siteConfig.url}${image}`,
        width: 1200,
        height: 630,
        alt: title,
      };
    } else {
      ogImage = {
        ...image,
        url: image.url.startsWith("http")
          ? image.url
          : `${siteConfig.url}${image.url}`,
      };
    }
  } else {
    // Aucune image fournie → carte OpenGraph générée à la volée à partir
    // du titre et de la description localisés de la page.
    ogImage = dynamicOgImage(title, description, eyebrow);
  }

  // Combinaison des mots-clés
  const allKeywords = [...new Set([...siteConfig.keywords, ...keywords])];

  // Construction des métadonnées
  // Le layout ajoute « | Next Impact » (14 caractères). Au-delà de 50
  // caractères, le titre dépasserait ~65 caractères et serait tronqué dans les
  // résultats : on le sert alors tel quel, sans suffixe de marque.
  const TITLE_SUFFIX_MAX = 50;
  const metadata: Metadata = {
    metadataBase: new URL(siteConfig.url),
    title: title.length > TITLE_SUFFIX_MAX ? { absolute: title } : title,
    description,
    keywords: allKeywords,
    authors: authors
      ? authors.map((name) => ({ name }))
      : siteConfig.authors,
    creator: siteConfig.creator,
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [ogImage],
      locale: OG_LOCALES[locale],
      // Seules les langues réellement publiées pour cette page.
      alternateLocale: alternateLocales
        .filter((l) => l !== locale)
        .map((l) => OG_LOCALES[l]),
      type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
      creator: "@nextimpact",
    },
    // noindex, follow : une page hors index (ex. article servi en français
    // sous /en) doit continuer à transmettre ses liens.
    robots: noindex
      ? {
          index: false,
          follow: true,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };

  return metadata;
}

/**
 * Métadonnées prédéfinies pour les pages principales
 */
type LocalizedMeta = {
  title: string;
  description: string;
  keywords?: string[];
};

// Home du Studio digital (ADR-047, 2026-11-21) : les deux prestations, leurs
// prix lus dans lib/prestations-web.ts. Anti-cannibalisation : la home garde
// la requête de MARQUE et d'ensemble (« studio digital », « création ou
// refonte de site ») ; /solutions-web l'arbitrage, /landing-evolutive la
// vitrine d'une page, /refonte-wordpress l'offre de refonte et son prix.
// Le titre s'ouvre donc sur le h1 de la home, « Studio digital » : l'ancien
// (« Vitrine évolutive ou refonte WordPress, prix écrits · Next Impact ») ne
// le portait pas et doublait presque mot pour mot celui de /solutions-web
// (« Landing page ou refonte WordPress : deux prestations, prix écrits »).
// « Prix et délai écrits » reste dans la description.
const HOME_FR: LocalizedMeta = {
  title: "Studio digital : vitrine évolutive ou refonte WordPress · Next Impact",
  description: `Lancer un projet ou refondre un site WordPress : ${LANDING.nom.toLowerCase()} à ${LANDING_PRIX}, en ligne en ${LANDING.delaiSemaines} semaines, ou refonte dès ${formatEuros(REFONTE_WP.priceValue, "fr")} HT. Prix et délai écrits.`,
  keywords: [
    "studio digital",
    "création de site vitrine",
    "refonte de site WordPress",
    "site web prix fixe",
    "développeuse web freelance",
    "Next Impact",
  ],
};

// La home est rédigée en français (lib/home-content.ts). L'anglais, fermé
// (ENGLISH_PUBLISHED, /en redirige vers /), reçoit les mêmes métadonnées tant
// qu'il n'est pas traduit, plutôt qu'un titre anglais resté sur l'ancien
// catalogue (« Upgrade, custom or headless redesign, web app »), que la page ne
// montre plus.
const HOME_BY_LOCALE: Record<Locale, LocalizedMeta> = { fr: HOME_FR, en: HOME_FR };

/** Titre, description et mots-clés de la home, pour la page et son JSON-LD (nœud WebPage). */
export function homeMeta(locale: Locale = routing.defaultLocale): LocalizedMeta {
  return HOME_BY_LOCALE[locale];
}

// Pages de prestations web (ADR-047, 2026-11-21). /solutions-web est la page
// d'orientation : deux points de départ, la Vitrine évolutive et la Refonte
// WordPress, chacune vendue sur sa page. Titres et descriptions fixés par les
// directives du 2026-11-21 ; chaque prix et chaque délai est lu dans sa source
// (lib/prestations-web.ts, qui lit lui-même lib/trajectoires.ts pour la
// Refonte). Les trois pages sont rédigées en français ; l'anglais, fermé
// (ENGLISH_PUBLISHED), reçoit les mêmes textes tant qu'il n'est pas traduit.
//
// Anti-cannibalisation : /solutions-web vise la requête d'arbitrage (« landing
// page ou refonte »), /landing-evolutive la requête « landing page », et
// /refonte-wordpress la requête d'OFFRE « refonte WordPress prix ».
// /wordpress-headless garde la requête d'explication du headless.
const SERVICES_FR: LocalizedMeta = {
  title: "Landing page ou refonte WordPress : deux prestations, prix écrits",
  description: `Landing page premium à ${LANDING_PRIX}, textes et visuels compris, en ligne en ${LANDING.delaiSemaines} semaines, ou refonte WordPress sur mesure dès ${formatEuros(REFONTE_WP.priceValue, "fr")} HT.`,
  // Requête d'ARBITRAGE seulement : « création landing page » appartient à
  // /landing-evolutive et « refonte site WordPress prix » à /refonte-wordpress,
  // qui les portaient déjà. Aucun mot-clé en double entre les trois pages.
  keywords: [
    "landing page ou refonte de site",
    "lancer ou refondre un site web",
    "landing page ou site WordPress",
    "prestations web prix affichés",
  ],
};

const SERVICES_BY_LOCALE: Record<Locale, LocalizedMeta> = { fr: SERVICES_FR, en: SERVICES_FR };

/** Titre, description et mots-clés de /solutions-web, pour la page et son JSON-LD. */
export function servicesMeta(locale: Locale = routing.defaultLocale): LocalizedMeta {
  return SERVICES_BY_LOCALE[locale];
}

/**
 * Titre, description et mots-clés de /landing-evolutive.
 *
 * L'offre s'appelle « Vitrine évolutive » (h1 de la page) ; le titre garde la
 * requête « landing page », le descripteur générique du produit. Le nom de
 * l'offre ouvre la description et figure en mot-clé : le résultat de recherche
 * et le h1 disent ainsi le même nom. Ajout du 2026-11-21 au texte des
 * directives, à valider par Agathe.
 */
export const landingMeta: LocalizedMeta = {
  title: `Landing page premium évolutive, ${LANDING_PRIX}, textes et visuels compris`,
  description: `${LANDING.nom} : une grande page aboutie, en ligne en ${LANDING.delaiSemaines} semaines. Textes et visuels compris. Pages suivantes à ${EXTENSION_PRIX}.`,
  keywords: [
    "landing page premium",
    "création landing page",
    "landing page évolutive",
    "landing page prix",
    "site one-page",
    "vitrine évolutive",
  ],
};

/** Titre, description et mots-clés de /refonte-wordpress. */
export const refonteWordpressMeta: LocalizedMeta = {
  title: `Refonte WordPress sur mesure ou headless, dès ${formatEuros(REFONTE_WP.priceValue, "fr")} HT`,
  description:
    "Vos contenus restent, votre équipe publie toujours dans WordPress. Design, vitesse et base technique refaits. Prix et délai écrits.",
  keywords: [
    "refonte WordPress",
    "refonte site WordPress prix",
    "refonte WordPress sur mesure",
    "refonte WordPress headless",
    "thème WordPress sur mesure",
  ],
};

// Source de la page /contact (app/[locale]/contact/page.tsx lit
// `pageMetadata.contact`) : les sujets réellement proposés par le formulaire,
// rangés par moment depuis l'ADR-012 (refonte ou création, suivi et maintenance
// ajoutés), aucune offre disparue. Les deux prix du conseil sont lus dans
// lib/visio-conseil.ts ; aucun prix mensuel n'est écrit. Description calibrée
// pour l'affichage SERP (≤ 160 caractères), promesse de réponse en fin.
//
// Anti-cannibalisation : les mots-clés restent sur l'intention de CONTACT. Les
// requêtes d'offre (« conseil refonte », « expert technique
// externalisé », « audit et roadmap ») appartiennent à /conseil et à
// /cto-externalise.
const CONTACT_BY_LOCALE: Record<Locale, LocalizedMeta> = {
  fr: {
    title: "Contact : conseil, audit, expert technique externalisé ou refonte",
    description: `Échange de 15 minutes gratuit, audit + roadmap (${conseilPrice("architecture-projet-ia", "fr")}), refonte, suivi et maintenance, expert technique externalisé, diagnostic gratuit : réponse sous 24 h.`,
    keywords: [
      "contact conseil techno web",
      "contact refonte WordPress",
      "contact expert technique externalisé",
      "contact maintenance WordPress",
      "diagnostic gratuit site web",
    ],
  },
  en: {
    title: "Contact: advice, audit, outsourced technical expert or redesign",
    description: `Free 15-minute call, audit + roadmap (${conseilPrice("architecture-projet-ia", "en")}), redesign, care and maintenance, outsourced technical expert, free diagnostic: reply within 24h.`,
    keywords: [
      "contact web technology advice",
      "WordPress redesign contact",
      "outsourced technical expert contact",
      "WordPress maintenance contact",
      "free website diagnostic",
    ],
  },
};

const CASE_STUDIES_BY_LOCALE: Record<Locale, LocalizedMeta> = {
  fr: {
    title: "Études de cas : des projets livrés, des choix expliqués",
    description:
      "Sites WordPress, sites Headless, plateformes métier et outils terrain : chaque étude de cas explique la décision (techno, budget, délai) et les résultats mesurés.",
    keywords: [
      "études de cas site web",
      "portfolio site web",
      "réalisations Next.js",
      "choix techno projet web",
      "refonte WordPress résultats",
    ],
  },
  en: {
    title: "Case studies: projects delivered, choices explained",
    description:
      "WordPress sites, Headless sites, business platforms and field tools: each case study explains the decision (tech, budget, timeline) and the measured results.",
    keywords: [
      "website case studies",
      "website portfolio",
      "Next.js work",
      "web project tech choice",
      "WordPress redesign results",
    ],
  },
};

const DOCUMENTATION_BY_LOCALE: Record<Locale, LocalizedMeta> = {
  fr: {
    title: "Ressources : choisir sa techno web à l'heure de l'IA",
    description:
      "Guides pour choisir entre WordPress, no-code, IA coding, SaaS, Headless ou sur-mesure : architecture, SEO, maintenance, coût futur et cadrage.",
    keywords: [
      "documentation WordPress Headless",
      "tutoriels Next.js",
      "guides applications web",
      "guides techniques",
    ],
  },
  en: {
    title: "Resources: choose web technology in the age of AI",
    description:
      "Guides to choose between WordPress, no-code, AI coding, SaaS, Headless or custom: architecture, SEO, maintenance, future cost and scoping.",
    keywords: [
      "Headless WordPress documentation",
      "Next.js tutorials",
      "web application guides",
      "technical guides",
    ],
  },
};

export const pageMetadata = {
  home: (locale: Locale = routing.defaultLocale): Metadata => {
    const m = HOME_BY_LOCALE[locale];
    return generatePageMetadata({
      title: m.title,
      description: m.description,
      path: "/",
      keywords: m.keywords,
      locale,
    });
  },

  services: (locale: Locale = routing.defaultLocale): Metadata => {
    const m = SERVICES_BY_LOCALE[locale];
    return generatePageMetadata({
      title: m.title,
      description: m.description,
      path: "/solutions-web",
      keywords: m.keywords,
      locale,
    });
  },

  // Aligné sur le namespace `auditPage` des messages. /audit-site-web redirige
  // vers l'analyse du site (/scan, ADR-012) : ces métadonnées décrivent donc
  // l'analyse, plus « ce qui ralentit le site » (l'analyse liste les
  // composants, elle ne mesure pas la vitesse).
  audit: (locale: Locale = routing.defaultLocale): Metadata =>
    generatePageMetadata({
      title:
        locale === "en"
          ? "Analyze your site in 2 minutes"
          : "Analysez votre site en 2 minutes",
      description:
        locale === "en"
          ? "One address, one report, no access requested: what your site is made of, and which components are at risk."
          : "Une adresse, un rapport, aucun accès demandé : de quoi votre site est fait, et quels composants sont à risque.",
      path: "/audit-site-web",
      keywords:
        locale === "en"
          ? ["free website analysis", "website components at risk", "free website diagnostic"]
          : ["analyse de site web gratuite", "composants de site à risque", "diagnostic site web gratuit"],
      locale,
    }),

  contact: (locale: Locale = routing.defaultLocale): Metadata => {
    const m = CONTACT_BY_LOCALE[locale];
    return generatePageMetadata({
      title: m.title,
      description: m.description,
      path: "/contact",
      image: "/img/contact-facilitation.jpg",
      keywords: m.keywords,
      locale,
    });
  },

  caseStudies: (locale: Locale = routing.defaultLocale): Metadata => {
    const m = CASE_STUDIES_BY_LOCALE[locale];
    return generatePageMetadata({
      title: m.title,
      description: m.description,
      path: "/etudes-de-cas",
      keywords: m.keywords,
      image: "/img/desktop-screen-next-event.jpg",
      locale,
    });
  },

  documentation: (locale: Locale = routing.defaultLocale): Metadata => {
    const m = DOCUMENTATION_BY_LOCALE[locale];
    return generatePageMetadata({
      title: m.title,
      description: m.description,
      path: "/documentation",
      keywords: m.keywords,
      locale,
    });
  },

  brief: (locale: Locale = routing.defaultLocale): Metadata =>
    generatePageMetadata({
      title:
        locale === "en"
          ? "Project brief: WordPress specifications"
          : "Brief projet : cahier des charges WordPress",
      description:
        locale === "en"
          ? "Build your interactive WordPress project brief. Free tool to structure your needs and get an accurate quote."
          : "Créez votre brief de projet WordPress interactif. Outil gratuit pour structurer vos besoins et obtenir un devis précis.",
      path: "/cahier-des-charges",
      keywords:
        locale === "en"
          ? ["project brief", "specifications", "requirements"]
          : ["brief projet", "cahier des charges", "expression besoins"],
      locale,
    }),
};

/**
 * Génère les métadonnées pour un article de blog ou cas d'étude
 */
export function generateArticleMetadata(options: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  publishedTime: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
  locale?: Locale;
}): Metadata {
  return generatePageMetadata({
    title: options.title,
    description: options.description,
    path: `/etudes-de-cas/${options.slug}`,
    image: options.image,
    type: "article",
    publishedTime: options.publishedTime,
    modifiedTime: options.modifiedTime,
    authors: options.authors,
    keywords: options.tags,
    locale: options.locale,
  });
}

/**
 * Génère les métadonnées pour une page de documentation
 */
export function generateDocMetadata(options: {
  title: string;
  description: string;
  category: string;
  slug?: string;
  locale?: Locale;
}): Metadata {
  const path = options.slug
    ? `/documentation/${options.category}/${options.slug}`
    : `/documentation/${options.category}`;

  return generatePageMetadata({
    title: options.title,
    description: options.description,
    path,
    keywords: ["documentation", options.category, "guide"],
    locale: options.locale,
  });
}
