import { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";

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
 * Configuration des métadonnées par défaut du site
 */
export const siteConfig = {
  name: "Next Impact",
  title: "Next Impact",
  description:
    "Refonte de site WordPress : rapide, moderne, sans tout reconstruire. " +
    "Consolider, découpler ou refonder : prix affichés, délai annoncé, performance mesurée avant et après.",
  url: "https://www.next-impact.digital",
  ogImage: "/img/desktop-screen-next-impact.png",
  defaultImage: {
    url: "/img/desktop-screen-next-impact.png",
    width: 1200,
    height: 630,
    alt: "Next Impact · Refonte de site WordPress",
  },
  creator: "Agathe Karinthi-Martin",
  keywords: [
    "WordPress",
    "Refonte site WordPress",
    "Refonte WordPress headless",
    "Conseil techno web",
    "IA coding",
    "No-code",
    "SaaS",
    "WordPress Headless",
    "Choix technologie web",
    "Architecture web",
    "Next.js",
    "React",
    "Site web",
    "Application web",
    "Web app sur-mesure",
    "Application mobile",
    "PWA",
    "CMS Headless",
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
    title,
    description,
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
    alternateLocales = [...routing.locales],
  } = options;

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
  const metadata: Metadata = {
    metadataBase: new URL(siteConfig.url),
    title,
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
      alternateLocale: routing.locales
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
    robots: noindex
      ? {
          index: false,
          follow: false,
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

const HOME_BY_LOCALE: Record<Locale, LocalizedMeta> = {
  fr: {
    title: "Refonte de site WordPress : rapide, moderne, sans tout reconstruire · Next Impact",
    description:
      "Votre site WordPress vieillit mal ? Refonte optimisée, headless ou web app, en forfait, en 6 à 10 semaines. Prix affichés, performance mesurée avant et après.",
    keywords: [
      "refonte site WordPress",
      "refonte WordPress headless",
      "site WordPress lent",
      "moderniser site WordPress",
      "refonte site web forfait",
      "second avis devis web",
      "Next Impact",
    ],
  },
  en: {
    title: "WordPress site redesign: fast, modern, without rebuilding everything · Next Impact",
    description:
      "Is your WordPress site aging badly? Optimized, headless or web app redesign, at a fixed price, in 6 to 10 weeks. Displayed prices, performance measured before and after.",
    keywords: [
      "WordPress site redesign",
      "headless WordPress redesign",
      "slow WordPress site",
      "modernize WordPress site",
      "fixed price website redesign",
      "web quote second opinion",
      "Next Impact",
    ],
  },
};

const SERVICES_BY_LOCALE: Record<Locale, LocalizedMeta> = {
  fr: {
    title: "Trois trajectoires pour un site WordPress qui vieillit",
    description:
      "Consolider (WordPress optimisé, dès 2 250 € HT), découpler (WordPress headless, recommandée, dès 4 000 € HT) ou refonder (web app, dès 6 500 € HT). Prix et délai fixés avant de commencer.",
    keywords: [
      "refonte site WordPress prix",
      "refonte WordPress optimisée",
      "refonte WordPress headless",
      "création site WordPress optimisé",
      "web app sur-mesure",
      "outil métier sur-mesure",
    ],
  },
  en: {
    title: "Three trajectories for an aging WordPress site",
    description:
      "Consolidate (optimized WordPress, from €2,250 excl. VAT), decouple (headless WordPress, recommended, from €4,000 excl. VAT) or rebuild (web app, from €6,500 excl. VAT). Price and timeline fixed upfront.",
    keywords: [
      "WordPress redesign price",
      "optimized WordPress redesign",
      "headless WordPress redesign",
      "optimized WordPress build",
      "custom web app",
      "custom business tool",
    ],
  },
};

// Aligné sur le namespace `contactPage` des messages (source vive de la page
// /contact) : cinq sujets du catalogue, aucune offre disparue.
const CONTACT_BY_LOCALE: Record<Locale, LocalizedMeta> = {
  fr: {
    title: "Contact : visio conseil, audit + roadmap ou projet de refonte",
    description:
      "Contactez Next Impact : visio conseil refonte (150 €), audit + roadmap (650 €), projet de refonte WordPress, headless ou web app, ou diagnostic gratuit de votre site.",
    keywords: [
      "contact conseil techno web",
      "visio conseil refonte",
      "audit et roadmap site web",
      "contact refonte WordPress",
      "diagnostic gratuit site web",
    ],
  },
  en: {
    title: "Contact: advisory call, audit + roadmap or redesign project",
    description:
      "Contact Next Impact: redesign advisory call (€150), audit + roadmap (€650), WordPress, headless or web app redesign project, or a free diagnostic of your site.",
    keywords: [
      "contact web technology advice",
      "redesign advisory call",
      "website audit and roadmap",
      "WordPress redesign contact",
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

  // Aligné sur le namespace `auditPage` des messages (source vive de la page).
  audit: (locale: Locale = routing.defaultLocale): Metadata =>
    generatePageMetadata({
      title:
        locale === "en"
          ? "See what slows your site down in 2 minutes"
          : "Voyez ce qui ralentit votre site en 2 minutes",
      description:
        locale === "en"
          ? "One address, one report, no sign-up: see what slows your site down and which of the three trajectories (consolidate, decouple, rebuild) matches your situation."
          : "Une adresse, un rapport, aucune inscription : voyez ce qui ralentit votre site et laquelle des trois trajectoires (consolider, découpler, refonder) correspond à votre situation.",
      path: "/audit-site-web",
      keywords:
        locale === "en"
          ? ["free website diagnostic", "slow WordPress site", "website audit", "redesign trajectory"]
          : ["diagnostic site web gratuit", "site WordPress lent", "audit site web", "trajectoire de refonte"],
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
          ? "Project brief — WordPress specifications"
          : "Brief projet — Cahier des charges WordPress",
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
