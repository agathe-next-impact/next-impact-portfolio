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
    "Conseil techno web à l'heure de l'IA pour les petites structures. " +
    "L'IA peut coder vite : Next Impact aide à choisir quoi construire, avec quelle technologie, et jusqu'où aller. " +
    "Prestataire TIH : 30 % du coût de main-d'œuvre déductible de votre contribution AGEFIPH.",
  url: "https://www.next-impact.digital",
  ogImage: "/img/desktop-screen-next-impact.png",
  defaultImage: {
    url: "/img/desktop-screen-next-impact.png",
    width: 1200,
    height: 630,
    alt: "Next Impact — Boussole Techno Web & IA — Prestataire TIH",
  },
  creator: "Agathe Karinthi-Martin",
  keywords: [
    "WordPress",
    "Conseil techno web",
    "Boussole Techno Web IA",
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
    title: "Next Impact — Conseil techno web à l'heure de l'IA",
    description:
      "L'IA peut coder vite. Next Impact aide les petites structures à choisir quoi construire, avec quelle techno, et jusqu'où aller : WordPress, no-code, IA coding, SaaS, Headless ou sur-mesure. " +
      "Prestataire TIH : 30 % du coût de main-d'œuvre déductible de votre contribution AGEFIPH.",
    keywords: [
      "conseil techno web IA",
      "Boussole Techno Web IA",
      "choisir technologie web",
      "IA coding ou no-code",
      "second avis devis web",
      "prototype IA maintenable",
      "prestataire TIH développement web",
      "Next Impact",
    ],
  },
  en: {
    title: "Next Impact — Web technology advice in the age of AI",
    description:
      "AI can code fast. Next Impact helps small teams decide what to build, with which technology, and how far to go: WordPress, no-code, AI coding, SaaS, Headless or custom. " +
      "French TIH provider: 30% of labour cost deductible from your AGEFIPH contribution.",
    keywords: [
      "web technology advice AI",
      "Web AI Tech Compass",
      "choose web technology",
      "AI coding or no-code",
      "web quote second opinion",
      "maintainable AI prototype",
      "French TIH provider web development",
      "Next Impact",
    ],
  },
};

const SERVICES_BY_LOCALE: Record<Locale, LocalizedMeta> = {
  fr: {
    title: "Services — construire utile après la Boussole Techno Web & IA",
    description:
      "Mise en œuvre Next Impact après décision : WordPress optimisé dès 2 250 €, Headless dès 4 000 €, outil métier dès 6 500 €. Construire seulement quand c'est le bon choix.",
    keywords: [
      "mise en œuvre après cadrage",
      "construction site après conseil",
      "Boussole Techno Web IA",
      "création site WordPress optimisé",
      "web app sur-mesure",
      "outil métier sur-mesure",
    ],
  },
  en: {
    title: "Services — build what helps after the Web & AI Tech Compass",
    description:
      "Next Impact implementation after a clear decision: optimized WordPress from €2,250, Headless from €4,000, business tool from €6,500. Build only when it is the right choice.",
    keywords: [
      "implementation after scoping",
      "build after tech advice",
      "Web AI Tech Compass",
      "optimized WordPress build",
      "custom web app",
      "custom business tool",
    ],
  },
};

const CONTACT_BY_LOCALE: Record<Locale, LocalizedMeta> = {
  fr: {
    title: "Contact — question techno, devis, prototype IA ou dépannage",
    description:
      "Contactez Next Impact pour choisir une techno web, faire relire un devis ou prototype IA, cadrer un projet, construire si nécessaire ou demander un dépannage WordPress.",
    keywords: [
      "contact conseil techno web",
      "second avis devis web",
      "prototype IA maintenable",
      "diagnostic Web IA",
      "dépannage WordPress",
    ],
  },
  en: {
    title: "Contact — tech question, quote, AI prototype or support",
    description:
      "Contact Next Impact to choose a web technology, review a quote or AI prototype, scope a project, build if needed or request WordPress support.",
    keywords: [
      "contact web technology advice",
      "web quote second opinion",
      "maintainable AI prototype",
      "Web AI diagnostic",
      "WordPress support",
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
    title: "Ressources — choisir sa techno web à l'heure de l'IA",
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
    title: "Resources — choose web technology in the age of AI",
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
      path: "/services",
      keywords: m.keywords,
      locale,
    });
  },

  audit: (locale: Locale = routing.defaultLocale): Metadata =>
    generatePageMetadata({
      title:
        locale === "en"
          ? "Free Web & AI diagnostic"
          : "Diagnostic Web & IA gratuit",
      description:
        locale === "en"
          ? "Get a first direction before building: fix, optimize, use SaaS, no-code, WordPress, Headless or custom development."
          : "Obtenez une première orientation avant de construire : réparer, optimiser, utiliser un SaaS, du no-code, WordPress, Headless ou du sur-mesure.",
      path: "/audit-site-web",
      keywords:
        locale === "en"
          ? ["Web AI diagnostic", "choose web technology", "AI coding", "no-code"]
          : ["diagnostic Web IA", "choisir technologie web", "IA coding", "no-code"],
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
      path: "/outils/simulateur-agefiph",
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
