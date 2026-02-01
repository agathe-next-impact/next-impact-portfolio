import { Metadata } from "next";

/**
 * Configuration des métadonnées par défaut du site
 */
export const siteConfig = {
  name: "Next Impact - Développeuse WordPress Freelance",
  title: "Next Impact",
  description:
    "Développeuse WordPress freelance spécialisée en sites web corporate et applications web Headless. Création, refonte, audit et conseil pour des projets sur-mesure.",
  url: "https://next-impact.digital",
  ogImage: "/img/desktop-screen-next-impact.png",
  defaultImage: {
    url: "/img/desktop-screen-next-impact.png",
    width: 1200,
    height: 630,
    alt: "Next Impact - Développeuse WordPress Freelance",
  },
  creator: "Agathe - Next Impact",
  keywords: [
    "WordPress",
    "Freelance",
    "Développeuse",
    "Headless",
    "Next.js",
    "React",
    "Site web",
    "Application web",
    "CMS",
  ],
  authors: [{ name: "Agathe", url: "https://next-impact.digital" }],
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
    title: `${title} | ${siteConfig.title}`,
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
      title: "Développeuse WordPress Freelance - Next Impact",
      description:
        "Développeuse WordPress freelance spécialisée en sites web corporate et applications web Headless. Création, refonte, audit et conseil pour des projets sur-mesure.",
      path: "/",
      keywords: ["WordPress freelance", "développeuse web", "création site"],
    }),

  services: (): Metadata =>
    generatePageMetadata({
      title: "Service de création de site web WordPress Headless Next.js - Next Impact",
      description:
        "Service de création de site web WordPress Headless Next.js pour les entreprises. Solutions adaptées aux sites à fonctionnalités avancées, exigeances de qualité ou applications web.",
      path: "/services",
      keywords: ["services WordPress", "headless CMS", "développement web"],
    }),

  audit: (): Metadata =>
    generatePageMetadata({
      title: "Audit de site web WordPress gratuit - Next Impact",
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
      title: "Contact - Demande de devis WordPress",
      description:
        "Contactez-moi pour discuter de votre projet WordPress ou Headless. Devis gratuit et personnalisé sous 48h.",
      path: "/contact",
      keywords: ["contact", "devis WordPress", "demande projet"],
    }),

  caseStudies: (): Metadata =>
    generatePageMetadata({
      title: "Études de cas - Projets WordPress réalisés par Next Impact",
      description:
        "Découvrez mes réalisations WordPress et Headless : sites corporate, applications web, refonte et optimisation. Projets détaillés avec résultats.",
      path: "/etudes-de-cas",
      keywords: ["portfolio", "réalisations WordPress", "études de cas"],
      image: "/img/desktop-screen-next-event.jpg",
    }),

  documentation: (): Metadata =>
    generatePageMetadata({
      title: "Documentation technique WordPress et Headless",
      description:
        "Guides techniques, tutoriels et bonnes pratiques WordPress, Headless CMS, Next.js et React. Ressources pour développeurs et chefs de projet.",
      path: "/documentation",
      keywords: [
        "documentation WordPress",
        "tutoriels",
        "guides techniques",
      ],
    }),

  simulateurTarifs: (): Metadata =>
    generatePageMetadata({
      title: "Simulateur de tarifs - Estimation projet WordPress",
      description:
        "Estimez le coût de votre projet WordPress ou Headless en quelques clics. Simulateur gratuit pour obtenir une fourchette de prix instantanée.",
      path: "/simulateur-tarifs",
      keywords: [
        "simulateur prix",
        "tarifs WordPress",
        "coût site web",
      ],
    }),

  brief: (): Metadata =>
    generatePageMetadata({
      title: "Brief projet - Cahier des charges WordPress",
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
