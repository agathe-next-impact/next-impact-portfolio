/**
 * Composants pour générer les données structurées JSON-LD
 * pour améliorer le SEO et l'affichage dans les résultats de recherche
 */

import { siteConfig } from "@/lib/metadata";

interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * Composant de base pour injecter du JSON-LD dans la page
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Données structurées pour l'organisation
 */
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/img/logo-blanc-carre.png`,
    description: siteConfig.description,
    founder: {
      "@type": "Person",
      name: "Agathe Karinthi-Martin",
      jobTitle: "Développeur WordPress Headless",
      url: "https://www.linkedin.com/in/agat-dev/",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "FR",
    },
    areaServed: {
      "@type": "Country",
      name: "France",
    },
    serviceType: [
      "Création de sites web",
      "Création de sites WordPress Headless",
      "Création d'applications web sur-mesure",
      "Création d'applications mobiles (PWA)",
      "Migration WordPress vers Headless",
      "Audit de site web",
      "Développement Next.js",
    ],
    priceRange: "€€",
    knowsAbout: [
      "WordPress",
      "WordPress Headless",
      "Next.js",
      "WPGraphQL",
      "React",
      "TypeScript",
      "PostgreSQL",
      "PWA",
      "Application web sur-mesure",
      "Application mobile",
    ],
    sameAs: [
      "https://www.linkedin.com/in/agat-dev/",
    ],
  };

  return <JsonLd data={data} />;
}

/**
 * Données structurées pour un article de blog ou étude de cas
 */
export function ArticleJsonLd({
  title,
  description,
  image,
  datePublished,
  dateModified,
  author = "Agathe",
  url,
}: {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  url: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    image: image.startsWith("http") ? image : `${siteConfig.url}${image}`,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Person",
      name: author,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}${siteConfig.ogImage}`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url.startsWith("http") ? url : `${siteConfig.url}${url}`,
    },
  };

  return <JsonLd data={data} />;
}

/**
 * Données structurées pour le fil d'Ariane (breadcrumb)
 */
export function BreadcrumbJsonLd({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http")
        ? item.url
        : `${siteConfig.url}${item.url}`,
    })),
  };

  return <JsonLd data={data} />;
}

/**
 * Données structurées pour une page de services
 */
export function ServiceJsonLd({
  name,
  description,
  provider = siteConfig.name,
  areaServed = "France",
  serviceType,
  url,
}: {
  name: string;
  description: string;
  provider?: string;
  areaServed?: string;
  serviceType?: string;
  url: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: name,
    description: description,
    provider: {
      "@type": "Organization",
      name: provider,
      url: siteConfig.url,
    },
    areaServed: {
      "@type": "Country",
      name: areaServed,
    },
    serviceType: serviceType || name,
    url: url.startsWith("http") ? url : `${siteConfig.url}${url}`,
  };

  return <JsonLd data={data} />;
}

/**
 * Données structurées pour une page FAQ
 */
export function FAQJsonLd({
  questions,
}: {
  questions: Array<{ question: string; answer: string }>;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };

  return <JsonLd data={data} />;
}

/**
 * Données structurées pour une page de contact
 */
export function ContactPageJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact — Next Impact Digital",
    description:
      "Trouvez l'offre adaptée à votre structure. Audit IA gratuit, appel visio et devis personnalisé sous 48h.",
    url: `${siteConfig.url}/contact`,
    mainEntity: {
      "@type": "ProfessionalService",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/img/logo-blanc-carre.png`,
      image: `${siteConfig.url}/img/contact-facilitation.jpg`,
      telephone: "+33673981638",
      email: "agathe@next-impact.digital",
      address: {
        "@type": "PostalAddress",
        streetAddress: "4 rue du centre",
        addressLocality: "Trizac",
        postalCode: "15400",
        addressCountry: "FR",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 45.2547,
        longitude: 2.5264,
      },
      areaServed: {
        "@type": "Country",
        name: "France",
      },
      priceRange: "€€",
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer service",
          telephone: "+33673981638",
          email: "agathe@next-impact.digital",
          availableLanguage: ["French", "English"],
          contactOption: "TollFree",
        },
      ],
      potentialAction: [
        {
          "@type": "ReserveAction",
          name: "Planifier un appel visio de découverte",
          target: "https://calendar.app.google/CiBQuqFLNu3vJwSc7",
          description: "Appel de découverte gratuit de 15 minutes",
        },
        {
          "@type": "CommunicateAction",
          name: "Demander un devis",
          target: `${siteConfig.url}/contact`,
          description: "Devis personnalisé sous 48h",
        },
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Stacks WordPress modernisées",
        itemListElement: [
          {
            "@type": "Offer",
            name: "Classique — WordPress",
            description: "Site vitrine WordPress avec thème custom moderne, build optimisé et sécurité durcie. Conservation de l'admin, modernisation du reste.",
            price: "2250",
            priceCurrency: "EUR",
            url: `${siteConfig.url}/services`,
          },
          {
            "@type": "Offer",
            name: "Headless — WordPress Headless + Next.js",
            description: "WordPress headless en backend, Next.js App Router en frontend (SSG, ISR, hydratation partielle). Performance front et SEO de niveau industriel.",
            price: "4000",
            priceCurrency: "EUR",
            url: `${siteConfig.url}/services`,
          },
          {
            "@type": "Offer",
            name: "Web app — WordPress Headless complexe ou Next.js + PostgreSQL",
            description: "Architecture WordPress Headless + Next.js App Router (SSG/ISR/SSR), TypeScript, multisites, intégrations API et CI/CD complet. Ou web app sur-mesure avec base PostgreSQL et admin autonome.",
            price: "5000",
            priceCurrency: "EUR",
            url: `${siteConfig.url}/services`,
          },
          {
            "@type": "Offer",
            name: "Applications web & mobile sur-mesure",
            description: "Web app (Next.js + PostgreSQL serverless, admin autonome) ou application mobile PWA (Next.js + service worker, géolocalisation et persistance locale au besoin). Sur devis.",
            priceCurrency: "EUR",
            url: `${siteConfig.url}/services`,
          },
        ],
      },
    },
  };

  return <JsonLd data={data} />;
}

/**
 * Données structurées pour la page d'accueil
 */
export function WebsiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/documentation?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return <JsonLd data={data} />;
}

/**
 * Données structurées pour un profil professionnel
 */
export function PersonJsonLd({
  name = "Agathe",
  jobTitle = "Développeur WordPress Freelance",
  description = siteConfig.description,
  url = siteConfig.url,
  image = `${siteConfig.url}${siteConfig.ogImage}`,
}: {
  name?: string;
  jobTitle?: string;
  description?: string;
  url?: string;
  image?: string;
} = {}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: name,
    jobTitle: jobTitle,
    description: description,
    url: url,
    image: image,
    worksFor: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    knowsAbout: [
      "WordPress",
      "Next.js",
      "React",
      "TypeScript",
      "Headless CMS",
      "Web Development",
      "API Development",
    ],
  };

  return <JsonLd data={data} />;
}

/**
 * Données structurées enrichies pour la homepage
 * @graph avec Person, Organization et LocalBusiness interconnectés
 */
export function HomepageJsonLd() {
  const baseUrl = siteConfig.url;

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      // — Person —
      {
        "@type": "Person",
        "@id": `${baseUrl}/#person`,
        name: "Agathe Karinthi-Martin",
        jobTitle: "Développeur WordPress Headless & Next.js",
        description: siteConfig.description,
        url: baseUrl,
        image: `${baseUrl}${siteConfig.ogImage}`,
        email: "agathe@next-impact.digital",
        telephone: "+33673981638",
        address: {
          "@type": "PostalAddress",
          streetAddress: "4 rue du centre",
          addressLocality: "Trizac",
          postalCode: "15400",
          addressRegion: "Auvergne-Rhône-Alpes",
          addressCountry: "FR",
        },
        worksFor: { "@id": `${baseUrl}/#organization` },
        knowsAbout: [
          "WordPress",
          "WordPress Headless",
          "Next.js",
          "React",
          "TypeScript",
          "WPGraphQL",
          "Headless CMS",
          "PostgreSQL",
          "PWA",
          "Application mobile",
          "SEO",
          "API REST",
        ],
        sameAs: [
          "https://www.linkedin.com/in/agat-dev/",
          "https://github.com/agat-dev",
        ],
      },

      // — Organization —
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: siteConfig.name,
        url: baseUrl,
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/img/logo-blanc-carre.png`,
        },
        description: siteConfig.description,
        founder: { "@id": `${baseUrl}/#person` },
        address: {
          "@type": "PostalAddress",
          streetAddress: "4 rue du centre",
          addressLocality: "Trizac",
          postalCode: "15400",
          addressRegion: "Auvergne-Rhône-Alpes",
          addressCountry: "FR",
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          telephone: "+33673981638",
          email: "agathe@next-impact.digital",
          availableLanguage: ["French", "English"],
        },
        sameAs: [
          "https://www.linkedin.com/in/agat-dev/",
          "https://github.com/agat-dev",
        ],
      },

      // — LocalBusiness —
      {
        "@type": ["LocalBusiness", "ProfessionalService"],
        "@id": `${baseUrl}/#localbusiness`,
        name: siteConfig.name,
        url: baseUrl,
        logo: `${baseUrl}/img/logo-blanc-carre.png`,
        image: `${baseUrl}${siteConfig.ogImage}`,
        description: siteConfig.description,
        telephone: "+33673981638",
        email: "agathe@next-impact.digital",
        founder: { "@id": `${baseUrl}/#person` },
        address: {
          "@type": "PostalAddress",
          streetAddress: "4 rue du centre",
          addressLocality: "Trizac",
          postalCode: "15400",
          addressRegion: "Auvergne-Rhône-Alpes",
          addressCountry: "FR",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 45.2547,
          longitude: 2.5264,
        },
        areaServed: {
          "@type": "Country",
          name: "France",
        },
        priceRange: "€€",
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "18:00",
        },
        serviceType: [
          "Création de sites web",
          "Création de sites WordPress Headless",
          "Création d'applications web sur-mesure",
          "Création d'applications mobiles (PWA)",
          "Migration WordPress vers Headless",
          "Audit de site web",
          "Développement Next.js",
        ],
        knowsAbout: [
          "WordPress",
          "WordPress Headless",
          "Next.js",
          "WPGraphQL",
          "React",
          "TypeScript",
          "PostgreSQL",
          "PWA",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Sites web et applications sur-mesure",
          itemListElement: [
            {
              "@type": "Offer",
              name: "Classique — WordPress",
              description:
                "Site vitrine WordPress avec thème custom moderne, build optimisé et sécurité durcie.",
              price: "2250",
              priceCurrency: "EUR",
              url: `${baseUrl}/services`,
            },
            {
              "@type": "Offer",
              name: "Headless — WordPress Headless + Next.js",
              description:
                "WordPress headless en backend, Next.js App Router en frontend. Performance et SEO de niveau industriel.",
              price: "4000",
              priceCurrency: "EUR",
              url: `${baseUrl}/services`,
            },
            {
              "@type": "Offer",
              name: "Web app — WordPress Headless complexe ou Next.js + PostgreSQL",
              description:
                "Architecture WordPress Headless + Next.js App Router, TypeScript, multisites, intégrations API et CI/CD complet. Ou web app sur-mesure avec base PostgreSQL.",
              price: "5000",
              priceCurrency: "EUR",
              url: `${baseUrl}/services`,
            },
            {
              "@type": "Offer",
              name: "Applications web & mobile sur-mesure",
              description:
                "Web app (Next.js + PostgreSQL serverless, admin autonome) ou application mobile PWA (Next.js + service worker, géolocalisation et persistance locale au besoin). Sur devis.",
              priceCurrency: "EUR",
              url: `${baseUrl}/services`,
            },
          ],
        },
        potentialAction: [
          {
            "@type": "ReserveAction",
            name: "Planifier un appel visio de découverte",
            target: "https://calendar.app.google/CiBQuqFLNu3vJwSc7",
            description: "Appel de découverte gratuit de 15 minutes",
          },
          {
            "@type": "CommunicateAction",
            name: "Demander un devis",
            target: `${baseUrl}/contact`,
            description: "Devis personnalisé sous 48h",
          },
        ],
      },
    ],
  };

  return <JsonLd data={data} />;
}

/**
 * Données structurées pour les avis clients
 */
export function ReviewJsonLd({
  reviews,
}: {
  reviews: Array<{
    author: string;
    rating: number;
    reviewBody: string;
    datePublished: string;
  }>;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: (
        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      ).toFixed(1),
      reviewCount: reviews.length,
      bestRating: 5,
      worstRating: 1,
    },
    review: reviews.map((review) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: review.author,
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: review.reviewBody,
      datePublished: review.datePublished,
    })),
  };

  return <JsonLd data={data} />;
}

/**
 * Données structurées pour une page de collection (liste d'articles, études de cas, outils)
 */
export function CollectionPageJsonLd({
  name,
  description,
  url,
  items,
}: {
  name: string;
  description: string;
  url: string;
  items: Array<{ name: string; url: string; description?: string }>;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: url.startsWith("http") ? url : `${siteConfig.url}${url}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: item.url.startsWith("http")
          ? item.url
          : `${siteConfig.url}${item.url}`,
        ...(item.description && { description: item.description }),
      })),
    },
  };

  return <JsonLd data={data} />;
}

/**
 * Données structurées pour une application web / outil interactif
 */
export function WebApplicationJsonLd({
  name,
  description,
  url,
  applicationCategory = "BusinessApplication",
  offers,
}: {
  name: string;
  description: string;
  url: string;
  applicationCategory?: string;
  offers?: { price: string; priceCurrency?: string };
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url: url.startsWith("http") ? url : `${siteConfig.url}${url}`,
    applicationCategory,
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: offers?.price || "0",
      priceCurrency: offers?.priceCurrency || "EUR",
    },
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return <JsonLd data={data} />;
}

/**
 * Données structurées pour une vidéo
 */
export function VideoObjectJsonLd({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  contentUrl,
  embedUrl,
}: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  contentUrl?: string;
  embedUrl?: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl: thumbnailUrl.startsWith("http")
      ? thumbnailUrl
      : `${siteConfig.url}${thumbnailUrl}`,
    uploadDate,
    ...(contentUrl && { contentUrl }),
    ...(embedUrl && { embedUrl }),
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/img/logo-blanc-carre.png`,
      },
    },
  };

  return <JsonLd data={data} />;
}
