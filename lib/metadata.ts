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
    "Studio freelance spécialisé WordPress Headless et Next.js. " +
    "Trois stacks : WordPress classique, Headless + Next.js, web app sur-mesure. " +
    "Prestataire TIH : 30 % du coût de main-d'œuvre déductible de votre contribution AGEFIPH.",
  url: "https://www.next-impact.digital",
  ogImage: "/img/desktop-screen-next-impact.png",
  defaultImage: {
    url: "/img/desktop-screen-next-impact.png",
    width: 1200,
    height: 630,
    alt: "Next Impact — WordPress Headless & Next.js — Prestataire TIH",
  },
  creator: "Agathe Karinthi-Martin",
  keywords: [
    "WordPress",
    "WordPress Headless",
    "Freelance",
    "Développeur",
    "Next.js",
    "React",
    "Site web",
    "Application web",
    "Web app sur-mesure",
    "Application mobile",
    "PWA",
    "Marketplace",
    "PostgreSQL",
    "CMS Headless",
    "TIH",
    "OETH",
    "AGEFIPH",
    "prestataire TIH",
    "déduction AGEFIPH",
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
    title: "Next Impact — WordPress Headless & Next.js | Prestataire TIH",
    description:
      "Studio freelance spécialisé dans la modernisation WordPress : site classique, Headless + Next.js, web app sur-mesure. " +
      "Basée en Auvergne, intervention dans toute la France. " +
      "Prestataire TIH : 30 % du coût de main-d'œuvre déductible de votre contribution AGEFIPH.",
    keywords: [
      "création site web freelance",
      "développeur Next.js France",
      "WordPress Headless freelance",
      "web app sur-mesure",
      "prestataire TIH développement web",
      "déduction AGEFIPH sous-traitance",
      "OETH numérique",
      "Next Impact",
    ],
  },
  en: {
    title: "Next Impact — Headless WordPress & Next.js | French TIH provider",
    description:
      "Freelance studio specialising in WordPress modernisation: classic site, Headless + Next.js, custom web apps. " +
      "Based in France, working internationally. " +
      "French TIH provider: 30% of labour cost deductible from your AGEFIPH contribution.",
    keywords: [
      "freelance website build",
      "Next.js developer France",
      "Headless WordPress freelance",
      "custom web app",
      "French TIH provider web development",
      "AGEFIPH deduction subcontracting",
      "OETH digital",
      "Next Impact",
    ],
  },
};

const SERVICES_BY_LOCALE: Record<Locale, LocalizedMeta> = {
  fr: {
    title: "Création de sites web et d'applications sur-mesure — Services et tarifs",
    description:
      "Trois forfaits Sites web — Classique dès 2 250 €, Headless dès 4 000 €, Web app dès 6 500 € — " +
      "et une offre Applications web & mobile sur devis. " +
      "Avantage OETH transverse : 30 % du coût main-d'œuvre déductible AGEFIPH. Devis sous 48 h.",
    keywords: [
      "services création site web",
      "création site WordPress",
      "création site Next.js",
      "web app sur-mesure",
      "application mobile freelance",
      "tarif site WordPress Headless",
      "prix application web",
    ],
  },
  en: {
    title: "Custom websites and applications — Services and pricing",
    description:
      "Three website tiers — Classic from €2,250, Headless from €4,000, Web app from €6,500 — " +
      "and a Web & Mobile App offer on quote. " +
      "Transverse OETH benefit: 30% of labor cost deductible from your AGEFIPH contribution. Quote within 48 hours.",
    keywords: [
      "website build services",
      "WordPress site build",
      "Next.js site build",
      "custom web app",
      "freelance mobile application",
      "Headless WordPress pricing",
      "web app pricing",
    ],
  },
};

const CONTACT_BY_LOCALE: Record<Locale, LocalizedMeta> = {
  fr: {
    title: "Contact — Devis site web ou application & Appel Découverte Gratuit",
    description:
      "Identifiez en quelques étapes la voie adaptée à votre projet : site WordPress classique, site Headless, web app ou application mobile. " +
      "Audit IA gratuit, appel visio 15 min et devis personnalisé sous 48h.",
    keywords: [
      "contact développeur freelance",
      "devis site web",
      "devis application web",
      "demande de projet web",
      "rendez-vous visio freelance",
      "diagnostic projet web",
      "audit site gratuit",
      "appel découverte",
    ],
  },
  en: {
    title: "Contact — Website or app quote & free discovery call",
    description:
      "Identify in a few steps the right path for your project: classic WordPress site, Headless site, web app or mobile app. " +
      "Free AI audit, 15-min video call and personalized quote within 48 hours.",
    keywords: [
      "contact freelance developer",
      "website quote",
      "web app quote",
      "web project request",
      "freelance video call",
      "project diagnostic",
      "free site audit",
      "discovery call",
    ],
  },
};

const CASE_STUDIES_BY_LOCALE: Record<Locale, LocalizedMeta> = {
  fr: {
    title: "Études de cas — Sites web, web apps et applications mobiles",
    description:
      "Découvrez les projets réalisés : sites WordPress, sites Headless, web apps sur-mesure (marketplace, plateforme métier) et applications mobiles (PWA). " +
      "Résultats concrets en performance, design et conversion.",
    keywords: [
      "portfolio site web",
      "réalisations Next.js",
      "web app marketplace",
      "application mobile PWA",
      "études de cas",
    ],
  },
  en: {
    title: "Case studies — Websites, web apps and mobile applications",
    description:
      "Selected projects: WordPress sites, Headless sites, custom web apps (marketplace, business platforms) and mobile applications (PWA). " +
      "Concrete results in performance, design and conversion.",
    keywords: [
      "website portfolio",
      "Next.js work",
      "marketplace web app",
      "mobile PWA application",
      "case studies",
    ],
  },
};

const DOCUMENTATION_BY_LOCALE: Record<Locale, LocalizedMeta> = {
  fr: {
    title: "Ressources — Sites web, applications & WordPress Headless",
    description:
      "Guides techniques, tutoriels et bonnes pratiques : WordPress Headless, " +
      "Next.js, applications web et mobiles. Ressources pour développeurs et chefs de projet.",
    keywords: [
      "documentation WordPress Headless",
      "tutoriels Next.js",
      "guides applications web",
      "guides techniques",
    ],
  },
  en: {
    title: "Resources — Websites, applications & Headless WordPress",
    description:
      "Technical guides, tutorials and best practices: Headless WordPress, " +
      "Next.js, web and mobile applications. Resources for developers and project leads.",
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
