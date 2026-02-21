import { Metadata } from "next";

/**
 * Configuration des métadonnées par défaut du site
 */
export const siteConfig = {
  name: "Next Impact",
  title: "Next Impact",
  description:
    "Développeuse freelance spécialisée WordPress Headless + Next.js & Astro. " +
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
    "Développeuse",
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
  } = options;

  // Construction de l'URL complète
  const url = path ? `${siteConfig.url}${path}` : siteConfig.url;
  const canonicalUrl = canonical || url;

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
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [ogImage],
      locale: "fr_FR",
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
export const pageMetadata = {
  home: (): Metadata =>
    generatePageMetadata({
      title: "Experte WordPress Headless & Next.js — Freelance",
      description:
        "Développeuse freelance spécialisée WordPress Headless + Next.js & Astro. " +
        "8+ ans d'expérience. Création, refonte et migration de sites ultra-performants. " +
        "Audit gratuit — réservez une consultation.",
      path: "/",
      keywords: [
        "WordPress Headless freelance",
        "développeuse Next.js",
        "création site headless",
        "migration WordPress Headless",
      ],
    }),

  services: (): Metadata =>
    generatePageMetadata({
      title: "Services WordPress Headless, Next.js & Astro — Création, Refonte, Audit",
      description:
        "WordPress classique, WordPress custom ou WordPress Headless : " +
        "des solutions adaptées à votre projet. TPE, PME, services marketing. " +
        "Devis gratuit.",
      path: "/services",
      keywords: [
        "services WordPress Headless",
        "création site Next.js",
        "développement Astro",
        "refonte WordPress",
      ],
    }),

  audit: (): Metadata =>
    generatePageMetadata({
      title: "Audit de site web WordPress gratuit",
      description:
        "Obtenez un audit gratuit de votre site WordPress : performance, SEO, sécurité et accessibilité. Analyse complète et recommandations personnalisées.",
      path: "/audit",
      keywords: [
        "audit WordPress",
        "performance site web",
        "SEO",
        "sécurité",
      ],
    }),

  contact: (): Metadata =>
    generatePageMetadata({
      title: "Contact — Devis WordPress Headless & Appel Découverte Gratuit",
      description:
        "Trouvez l'offre adaptée à votre structure en 4 étapes. " +
        "Association, PME ou Grand Compte : audit IA gratuit, appel visio 15 min et devis personnalisé sous 48h.",
      path: "/contact",
      image: "/img/contact-facilitation.jpg",
      keywords: [
        "contact développeuse WordPress Headless",
        "devis site WordPress Headless",
        "demande de projet web",
        "rendez-vous visio freelance",
        "péréquation solidaire",
        "audit site gratuit",
        "appel découverte",
        "tarif site Next.js",
      ],
    }),

  caseStudies: (): Metadata =>
    generatePageMetadata({
      title: "Études de cas WordPress Headless — Réalisations",
      description:
        "Découvrez les projets réalisés : sites corporate, institutionnels, ESS, " +
        "headless. Résultats concrets en performance, design et conversion.",
      path: "/etudes-de-cas",
      keywords: [
        "portfolio WordPress Headless",
        "réalisations Next.js",
        "études de cas",
      ],
      image: "/img/desktop-screen-next-event.jpg",
    }),

  documentation: (): Metadata =>
    generatePageMetadata({
      title: "Ressources WordPress Headless & Next.js",
      description:
        "Guides techniques, tutoriels et bonnes pratiques WordPress Headless, " +
        "Next.js et Astro. Ressources pour développeurs et chefs de projet.",
      path: "/documentation",
      keywords: [
        "documentation WordPress Headless",
        "tutoriels Next.js",
        "guides techniques",
      ],
    }),

  simulateurTarifs: (): Metadata =>
    generatePageMetadata({
      title: "Simulateur de tarifs — Estimation projet WordPress",
      description:
        "Estimez le coût de votre projet WordPress ou Headless en quelques clics. Simulateur gratuit pour obtenir une fourchette de prix instantanée.",
      path: "/simulateur-tarifs",
      keywords: [
        "simulateur prix",
        "tarifs WordPress Headless",
        "coût site web",
      ],
    }),

  brief: (): Metadata =>
    generatePageMetadata({
      title: "Brief projet — Cahier des charges WordPress",
      description:
        "Créez votre brief de projet WordPress interactif. Outil gratuit pour structurer vos besoins et obtenir un devis précis.",
      path: "/brief",
      keywords: ["brief projet", "cahier des charges", "expression besoins"],
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
