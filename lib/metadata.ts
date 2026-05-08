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

function buildLocalizedPaths(path: string): Record<string, string> {
  const cleaned = path === "/" ? "" : path;
  const langs: Record<string, string> = {};
  for (const loc of routing.locales) {
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
    "Développeur freelance spécialisé WordPress Headless + Next.js & Astro. " +
    "8+ ans d'expérience. Création, refonte et migration de sites ultra-performants.",
  url: "https://www.next-impact.digital",
  ogImage: "/img/desktop-screen-next-impact.png",
  defaultImage: {
    url: "/img/desktop-screen-next-impact.png",
    width: 1200,
    height: 630,
    alt: "Next Impact — WordPress Headless & Next.js",
  },
  creator: "Agathe Karinthi-Martin",
  keywords: [
    "WordPress",
    "WordPress Headless",
    "Freelance",
    "Développeur",
    "Next.js",
    "Astro",
    "React",
    "Site web",
    "Application web",
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
  keywords?: string[];
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  noindex?: boolean;
  canonical?: string;
  locale?: Locale;
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
    keywords = [],
    type = "website",
    publishedTime,
    modifiedTime,
    authors,
    noindex = false,
    canonical,
    locale = routing.defaultLocale,
  } = options;

  // Construction de l'URL complète (avec préfixe de locale si non par défaut)
  const localePrefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  const fullPath = path === "/" || !path ? "/" : path;
  const localizedPath = `${localePrefix}${fullPath === "/" ? "" : fullPath}` || "/";
  const url = `${siteConfig.url}${localizedPath}`;
  const canonicalUrl = canonical || url;
  const languageAlternates = buildLocalizedPaths(fullPath);

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
    ogImage = siteConfig.defaultImage;
  }

  // Combinaison des mots-clés
  const allKeywords = [...new Set([...siteConfig.keywords, ...keywords])];

  // Construction des métadonnées
  const metadata: Metadata = {
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
    title: "Next Impact — Développeur WordPress Headless, Next.js & Astro en France",
    description:
      "Next Impact est une agence freelance spécialisée en WordPress Headless, Next.js et Astro. " +
      "Création, refonte et migration de sites performants pour TPE, PME et ESS. " +
      "Basée en Auvergne, intervention dans toute la France. Audit gratuit.",
    keywords: [
      "WordPress Headless freelance",
      "développeur Next.js France",
      "création site headless",
      "migration WordPress Headless",
      "agence WordPress Headless",
      "Next Impact",
    ],
  },
  en: {
    title: "Next Impact — Headless WordPress, Next.js & Astro freelance developer",
    description:
      "Next Impact is a freelance studio specialized in Headless WordPress, Next.js and Astro. " +
      "Build, redesign and migration of high-performance sites for SMEs and social-economy organizations. " +
      "Based in France, working internationally. Free audit included.",
    keywords: [
      "Headless WordPress freelance",
      "Next.js developer",
      "headless site build",
      "WordPress migration",
      "Headless WordPress studio",
      "Next Impact",
    ],
  },
};

const SERVICES_BY_LOCALE: Record<Locale, LocalizedMeta> = {
  fr: {
    title: "Création de site WordPress Headless, Next.js & Astro — Services et tarifs",
    description:
      "3 offres adaptées à chaque budget : WordPress optimisé dès 2 250 €, " +
      "WordPress + Astro dès 4 000 €, WordPress + Next.js dès 5 000 €. " +
      "Création, refonte, migration et audit. Devis personnalisé sous 48 h.",
    keywords: [
      "services WordPress Headless",
      "création site Next.js",
      "développement Astro",
      "refonte WordPress",
      "tarif site WordPress Headless",
      "prix site Next.js",
    ],
  },
  en: {
    title: "Headless WordPress, Next.js & Astro builds — Services and pricing",
    description:
      "Three packages for every budget: optimized WordPress from €2,250, " +
      "WordPress + Astro from €4,000, WordPress + Next.js from €5,000. " +
      "Build, redesign, migration and audit. Personalized quote within 48 hours.",
    keywords: [
      "Headless WordPress services",
      "Next.js site build",
      "Astro development",
      "WordPress redesign",
      "Headless WordPress pricing",
      "Next.js site cost",
    ],
  },
};

const CONTACT_BY_LOCALE: Record<Locale, LocalizedMeta> = {
  fr: {
    title: "Contact — Devis WordPress Headless & Appel Découverte Gratuit",
    description:
      "Identifiez la stack adaptée à votre projet en 4 étapes : WordPress monolithique optimisé, hybride Astro ou Next.js complet. " +
      "Audit IA gratuit, appel visio 15 min et devis personnalisé sous 48h.",
    keywords: [
      "contact développeur WordPress Headless",
      "devis site WordPress Headless",
      "demande de projet web",
      "rendez-vous visio freelance",
      "diagnostic stack WordPress",
      "audit site gratuit",
      "appel découverte",
      "tarif site Next.js",
    ],
  },
  en: {
    title: "Contact — Headless WordPress quote & free discovery call",
    description:
      "Identify the right stack for your project in 4 steps: optimized monolithic WordPress, hybrid Astro or full Next.js. " +
      "Free AI audit, 15-min video call and personalized quote within 48 hours.",
    keywords: [
      "contact Headless WordPress developer",
      "Headless WordPress quote",
      "web project request",
      "freelance video call",
      "WordPress stack diagnostic",
      "free site audit",
      "discovery call",
      "Next.js project pricing",
    ],
  },
};

const CASE_STUDIES_BY_LOCALE: Record<Locale, LocalizedMeta> = {
  fr: {
    title: "Études de cas WordPress Headless — Réalisations",
    description:
      "Découvrez les projets réalisés : sites corporate, institutionnels, plateformes headless. " +
      "Résultats concrets en performance, design et conversion.",
    keywords: [
      "portfolio WordPress Headless",
      "réalisations Next.js",
      "études de cas",
    ],
  },
  en: {
    title: "Headless WordPress case studies — Selected work",
    description:
      "Selected projects: corporate, institutional and headless platforms. " +
      "Concrete results in performance, design and conversion.",
    keywords: [
      "Headless WordPress portfolio",
      "Next.js work",
      "case studies",
    ],
  },
};

const DOCUMENTATION_BY_LOCALE: Record<Locale, LocalizedMeta> = {
  fr: {
    title: "Ressources WordPress Headless & Next.js",
    description:
      "Guides techniques, tutoriels et bonnes pratiques WordPress Headless, " +
      "Next.js et Astro. Ressources pour développeurs et chefs de projet.",
    keywords: [
      "documentation WordPress Headless",
      "tutoriels Next.js",
      "guides techniques",
    ],
  },
  en: {
    title: "Headless WordPress & Next.js resources",
    description:
      "Technical guides, tutorials and best practices for Headless WordPress, " +
      "Next.js and Astro. Resources for developers and project leads.",
    keywords: [
      "Headless WordPress documentation",
      "Next.js tutorials",
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
      path: "/services",
      keywords: m.keywords,
      locale,
    });
  },

  audit: (locale: Locale = routing.defaultLocale): Metadata =>
    generatePageMetadata({
      title:
        locale === "en"
          ? "Free WordPress site audit"
          : "Audit de site web WordPress gratuit",
      description:
        locale === "en"
          ? "Get a free audit of your WordPress site: performance, SEO, security and accessibility. Full analysis with personalized recommendations."
          : "Obtenez un audit gratuit de votre site WordPress : performance, SEO, sécurité et accessibilité. Analyse complète et recommandations personnalisées.",
      path: "/audit",
      keywords:
        locale === "en"
          ? ["WordPress audit", "site performance", "SEO", "security"]
          : ["audit WordPress", "performance site web", "SEO", "sécurité"],
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

  simulateurTarifs: (locale: Locale = routing.defaultLocale): Metadata =>
    generatePageMetadata({
      title:
        locale === "en"
          ? "Pricing simulator — WordPress project estimate"
          : "Simulateur de tarifs — Estimation projet WordPress",
      description:
        locale === "en"
          ? "Estimate the cost of your WordPress or Headless project in a few clicks. Free simulator for an instant price range."
          : "Estimez le coût de votre projet WordPress ou Headless en quelques clics. Simulateur gratuit pour obtenir une fourchette de prix instantanée.",
      path: "/simulateur-tarifs",
      keywords:
        locale === "en"
          ? ["price simulator", "Headless WordPress pricing", "site cost"]
          : ["simulateur prix", "tarifs WordPress Headless", "coût site web"],
      locale,
    }),

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
      path: "/brief",
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
}): Metadata {
  const path = options.slug
    ? `/documentation/${options.category}/${options.slug}`
    : `/documentation/${options.category}`;

  return generatePageMetadata({
    title: options.title,
    description: options.description,
    path,
    keywords: ["documentation", options.category, "guide"],
  });
}
