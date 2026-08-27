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
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
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
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/img/logo-rouge-noir-carre-icon.png`,
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    description: siteConfig.description,
    founder: {
      "@type": "Person",
      "@id": `${siteConfig.url}/#person`,
      name: "Agathe Karinthi-Martin",
      jobTitle: "Conseil techno web à l'heure de l'IA",
      url: "https://www.linkedin.com/in/agat-dev/",
    },
    telephone: "+33673981638",
    email: "agathe@next-impact.digital",
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
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: "+33673981638",
      email: "agathe@next-impact.digital",
      availableLanguage: ["French", "English"],
    },
    serviceType: [
      "Conseil techno web à l'heure de l'IA",
      "Sélecteur techno web & IA",
      "Audit complet et préconisations (audit, préconisations, roadmap)",
      "Accompagnement technique dans la durée",
      "Création de sites web WordPress",
      "Création de sites WordPress Headless + Next.js",
      "Création d'applications web sur-mesure",
      "Création d'applications mobiles (PWA)",
      "Migration WordPress vers Headless",
      "Audit de site web",
      "Développement Next.js",
    ],
    priceRange: "€€",
    knowsAbout: [
      "WordPress",
      "Conseil techno web",
      "IA coding",
      "No-code",
      "SaaS",
      "Architecture web",
      "WordPress Headless",
      "Next.js",
      "WPGraphQL",
      "React",
      "TypeScript",
      "PostgreSQL",
      "PWA",
      "Application web sur-mesure",
    ],
    sameAs: [
      "https://www.linkedin.com/in/agat-dev/",
      "https://github.com/agat-dev",
      "https://annuaire-entreprises.data.gouv.fr/entreprise/agathe-martin-next-impact-532675386",
      "https://www.pappers.fr/entreprise/martin-agathe-532675386",
    ],
    // Citation presse indépendante et autoritaire (E-E-A-T / GEO). Le slug d'URL
    // du Figaro encode le titre ; date issue du slug (20260512).
    subjectOf: {
      "@type": "NewsArticle",
      headline:
        "WordPress Headless : comment les PME peuvent moderniser leur site sans tout reconstruire, avec Next Impact Digital",
      url: "https://www.lefigaro.fr/economie/wordpress-headless-comment-les-pme-peuvent-moderniser-leur-site-sans-tout-reconstruire-avec-next-impact-digital-20260512",
      datePublished: "2026-05-12",
      publisher: {
        "@type": "NewsMediaOrganization",
        name: "Le Figaro",
        url: "https://www.lefigaro.fr",
      },
    },
  };

  return <JsonLd data={data} />;
}

/**
 * Données structurées pour un article de blog, étude de cas ou doc technique.
 * Préférer `type="TechArticle"` pour la documentation technique (WordPress
 * Headless, Next.js…) — c'est le sous-type Schema.org reconnu par Google
 * Search et valorisé par les moteurs IA pour les sujets dev.
 */
export function ArticleJsonLd({
  title,
  description,
  image,
  datePublished,
  dateModified,
  author = "Agathe",
  url,
  type = "Article",
  proficiencyLevel,
  dependencies,
  inLanguage,
}: {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  url: string;
  type?: "Article" | "TechArticle";
  proficiencyLevel?: "Beginner" | "Intermediate" | "Expert";
  dependencies?: string;
  /** Locale du contenu (« fr-FR », « en »…) — consolide le graphe multilingue. */
  inLanguage?: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": type,
    ...(type === "TechArticle" && proficiencyLevel ? { proficiencyLevel } : {}),
    ...(type === "TechArticle" && dependencies ? { dependencies } : {}),
    headline: title,
    description: description,
    image: image.startsWith("http") ? image : `${siteConfig.url}${image}`,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    ...(inLanguage ? { inLanguage } : {}),
    // Référence le nœud Person partagé du site (@id commun) plutôt qu'un doublon
    // anonyme : c'est ce qui consolide le graphe d'entités auteur ↔ organisation.
    author: {
      "@type": "Person",
      "@id": `${siteConfig.url}/#person`,
      name: author,
      url: `${siteConfig.url}/a-propos`,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
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
      "@id": `${siteConfig.url}/#organization`,
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
 * Données structurées pour une méthode pas à pas (schema HowTo).
 * À réserver aux articles qui décrivent une vraie procédure ordonnée
 * (frontmatter `howto` — voir lib/markdown.ts pour le format attendu).
 * `totalTime` : durée ISO 8601 (ex. "PT4H" = 4 heures), optionnelle.
 */
export function HowToJsonLd({
  name,
  description,
  steps,
  totalTime,
}: {
  name: string;
  description?: string;
  steps: Array<{ name: string; text: string }>;
  totalTime?: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    ...(description ? { description } : {}),
    ...(totalTime ? { totalTime } : {}),
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
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
      "Choisir la bonne techno web à l'heure de l'IA : conseil techno pour une refonte, audit complet et préconisations, accompagnement dans la durée.",
    url: `${siteConfig.url}/contact`,
    mainEntity: {
      "@type": "ProfessionalService",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/img/logo-rouge-noir-carre-icon.png`,
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
          name: "Réserver un conseil techno pour une refonte",
          target: "https://calendly.com/agathe-next-impact/conseil-de-choix-de-techno-pour-une-refonte",
          description: "Visio pour choisir entre WordPress, no-code, IA coding, SaaS, Headless ou sur-mesure",
        },
        {
          "@type": "CommunicateAction",
          name: "Faire relire un devis ou cadrer un projet",
          target: `${siteConfig.url}/contact`,
          description: "Conseil techno pour une refonte, audit complet et préconisations, accompagnement dans la durée ou mise en œuvre",
        },
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Sélecteur techno web & IA",
        itemListElement: [
          {
            "@type": "Offer",
            name: "Conseil techno pour une refonte",
            description: "Trancher la bonne techno d'une refonte en une heure de visio : WordPress, no-code, IA coding, SaaS, Headless ou sur-mesure.",
            price: "150",
            priceCurrency: "EUR",
            url: `${siteConfig.url}/conseil`,
          },
          {
            "@type": "Offer",
            name: "Audit complet et préconisations",
            description: "L'état des lieux complet avant d'investir : audit de l'existant, visio conseil d'une heure et livrables — rapport d'audit, préconisations et roadmap.",
            price: "650",
            priceCurrency: "EUR",
            url: `${siteConfig.url}/conseil`,
          },
          {
            "@type": "Offer",
            name: "Accompagnement dans la durée",
            description: "Pilotage technique régulier sur devis : arbitrages, relecture de devis et roadmap tenue à jour — l'équivalent d'un directeur technique sans l'embauche.",
            priceCurrency: "EUR",
            url: `${siteConfig.url}/conseil`,
          },
          {
            "@type": "Offer",
            name: "Mise en œuvre Next Impact",
            description: "Construire un site WordPress, Headless ou outil métier seulement si le besoin le justifie.",
            priceCurrency: "EUR",
            url: `${siteConfig.url}/solutions-web`,
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
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: ["fr-FR", "en-US"],
    publisher: {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
    },
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
  name = "Agathe Karinthi-Martin",
  jobTitle = "Conseil techno web à l'heure de l'IA",
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
    "@id": `${siteConfig.url}/#person`,
    name: name,
    jobTitle: jobTitle,
    description: description,
    url: url,
    image: image,
    knowsLanguage: ["fr", "en"],
    worksFor: {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Université Paul-Valéry Montpellier 3",
    },
    // Parcours pluridisciplinaire (technique · business · marketing · design) +
    // socle académique : signaux d'expertise (E-E-A-T) lisibles par les moteurs IA.
    knowsAbout: [
      "Développement web",
      "Conseil techno web",
      "Architecture web",
      "Gestion de projet web",
      "Marketing digital",
      "Design web",
      "Stratégie business web",
      "WordPress",
      "WordPress Headless",
      "Next.js",
      "React",
      "TypeScript",
      "PostgreSQL",
      "Headless CMS",
      "WPGraphQL",
      "IA coding",
      "No-code",
      "SaaS",
      "Cybernétique",
      "Veille technologique",
    ],
    sameAs: [
      "https://www.linkedin.com/in/agat-dev/",
      "https://github.com/agat-dev",
    ],
    // Citation presse indépendante et autoritaire (E-E-A-T / GEO).
    subjectOf: {
      "@type": "NewsArticle",
      headline:
        "WordPress Headless : comment les PME peuvent moderniser leur site sans tout reconstruire, avec Next Impact Digital",
      url: "https://www.lefigaro.fr/economie/wordpress-headless-comment-les-pme-peuvent-moderniser-leur-site-sans-tout-reconstruire-avec-next-impact-digital-20260512",
      datePublished: "2026-05-12",
      publisher: {
        "@type": "NewsMediaOrganization",
        name: "Le Figaro",
        url: "https://www.lefigaro.fr",
      },
    },
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
      // — WebPage (Speakable : cible le H1 et le bloc « En bref » pour les
      //   assistants vocaux / lecture IA). Les sélecteurs pointent du contenu visible. —
      {
        "@type": "WebPage",
        "@id": `${baseUrl}/#webpage`,
        url: baseUrl,
        name: siteConfig.name,
        isPartOf: { "@id": `${baseUrl}/#website` },
        about: { "@id": `${baseUrl}/#organization` },
        primaryImageOfPage: `${baseUrl}${siteConfig.ogImage}`,
        dateModified: "2026-07-18",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", ".home-tldr"],
        },
      },

      // — Person —
      {
        "@type": "Person",
        "@id": `${baseUrl}/#person`,
        name: "Agathe Karinthi-Martin",
        jobTitle: "Conseil techno web à l'heure de l'IA",
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
          "Conseil techno web",
          "IA coding",
          "No-code",
          "SaaS",
          "Architecture web",
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
          "https://annuaire-entreprises.data.gouv.fr/entreprise/agathe-martin-next-impact-532675386",
          "https://www.pappers.fr/entreprise/martin-agathe-532675386",
        ],
      },

      // — Organization —
      // L'entité `#organization` est définie une seule fois, à l'échelle du site,
      // par <OrganizationJsonLd /> (layout). On ne la redéclare donc PAS ici pour
      // éviter un conflit de type sur le même @id (ProfessionalService vs Organization).
      // Les nœuds #person et #localbusiness ci-dessous y font référence via @id.

      // — LocalBusiness —
      {
        "@type": ["LocalBusiness", "ProfessionalService"],
        "@id": `${baseUrl}/#localbusiness`,
        name: siteConfig.name,
        url: baseUrl,
        logo: `${baseUrl}/img/logo-rouge-noir-carre-icon.png`,
        image: `${baseUrl}${siteConfig.ogImage}`,
        description: siteConfig.description,
        telephone: "+33673981638",
        email: "agathe@next-impact.digital",
        founder: { "@id": `${baseUrl}/#person` },
        sameAs: [
          "https://www.linkedin.com/in/agat-dev/",
          "https://github.com/agat-dev",
          "https://annuaire-entreprises.data.gouv.fr/entreprise/agathe-martin-next-impact-532675386",
          "https://www.pappers.fr/entreprise/martin-agathe-532675386",
        ],
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
          "Conseil techno web à l'heure de l'IA",
          "Sélecteur techno web & IA",
          "Audit complet et préconisations (audit, préconisations, roadmap)",
          "Accompagnement technique dans la durée",
          "Création de sites web WordPress",
          "Création de sites WordPress Headless + Next.js",
          "Création d'applications web sur-mesure",
          "Création d'applications mobiles (PWA)",
          "Migration WordPress vers Headless",
          "Audit de site web",
          "Développement Next.js",
        ],
        knowsAbout: [
          "WordPress",
          "Conseil techno web",
          "IA coding",
          "No-code",
          "SaaS",
          "Architecture web",
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
          name: "Sélecteur techno web & IA",
          itemListElement: [
            {
              "@type": "Offer",
              name: "Conseil techno pour une refonte",
              description:
                "Trancher la bonne techno d'une refonte en une heure de visio : WordPress, no-code, IA coding, SaaS, Headless ou sur-mesure.",
              price: "150",
              priceCurrency: "EUR",
              url: `${baseUrl}/conseil`,
            },
            {
              "@type": "Offer",
              name: "Audit complet et préconisations",
              description:
                "L'état des lieux complet avant d'investir : audit de l'existant, visio conseil d'une heure et livrables — rapport d'audit, préconisations et roadmap.",
              price: "650",
              priceCurrency: "EUR",
              url: `${baseUrl}/conseil`,
            },
            {
              "@type": "Offer",
              name: "Accompagnement dans la durée",
              description:
                "Pilotage technique régulier sur devis : arbitrages, relecture de devis et roadmap tenue à jour — l'équivalent d'un directeur technique sans l'embauche.",
              priceCurrency: "EUR",
              url: `${baseUrl}/conseil`,
            },
            {
              "@type": "Offer",
              name: "Mise en œuvre Next Impact",
              description:
                "Construire un site WordPress, Headless ou outil métier seulement si le besoin le justifie.",
              priceCurrency: "EUR",
              url: `${baseUrl}/solutions-web`,
            },
          ],
        },
        potentialAction: [
          {
            "@type": "ReserveAction",
            name: "Réserver un conseil techno pour une refonte",
            target: "https://calendly.com/agathe-next-impact/conseil-de-choix-de-techno-pour-une-refonte",
            description: "Visio pour choisir entre WordPress, no-code, IA coding, SaaS, Headless ou sur-mesure",
          },
          {
            "@type": "CommunicateAction",
            name: "Faire relire un devis ou cadrer un projet",
            target: `${baseUrl}/contact`,
            description: "Conseil techno pour une refonte, audit complet et préconisations, accompagnement dans la durée ou mise en œuvre",
          },
        ],
      },
    ],
  };

  return <JsonLd data={data} />;
}

// NB : un helper `ReviewJsonLd` (aggregateRating au niveau Organization, à partir
// d'avis auto-collectés) a été retiré volontairement. Google n'autorise plus les
// avis « self-serving » sur une Organization/LocalBusiness : non éligibles aux
// étoiles et passibles d'une action manuelle. Pour afficher des notes en rich
// result, la notation doit porter sur un item précis (Product/Service/CreativeWork),
// pas sur l'entité de marque.

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
        url: `${siteConfig.url}/img/logo-rouge-noir-carre-icon.png`,
      },
    },
  };

  return <JsonLd data={data} />;
}
