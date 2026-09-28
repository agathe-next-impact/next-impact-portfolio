/**
 * Composants pour générer les données structurées JSON-LD
 * pour améliorer le SEO et l'affichage dans les résultats de recherche
 */

import { ENGLISH_PUBLISHED } from "@/i18n/routing";
import { siteConfig } from "@/lib/metadata";
import {
  CTO_PATH,
  CTO_PRICE_VALUE,
  CTO_PRICE_CURRENCY,
  CTO_BILLING_UNIT_CODE,
  CTO_MIN_MONTHS,
} from "@/lib/cto-externalise";
import {
  MAINTENANCE_BILLING_UNIT_CODE,
  MAINTENANCE_PATH,
  MAINTENANCE_PRICE_CURRENCY,
  MAINTENANCE_PRICE_VALUE,
  MAINTENANCE_PRIX_VALIDES,
} from "@/lib/maintenance-offer";
import { TRAJECTOIRES, TRAJECTOIRE_ORDER, formatEuros, type TrajectoireSlug } from "@/lib/trajectoires";
import { OFFERS as CONSEIL_OFFERS, ECHANGE_URL, ECHANGE_NAME } from "@/lib/visio-conseil";
import { VEILLE_TITRE } from "@/lib/situations";

type SchemaLocale = "fr" | "en";

/** Normalise la locale reçue d'une route (string) vers les deux langues du site. */
function schemaLocale(locale?: string): SchemaLocale {
  return locale === "en" ? "en" : "fr";
}

/**
 * Offre récurrente « Expert technique externalisé » (moment « Gérer »,
 * arbitrage du 2026-09-07 ; renommée « CTO externalisé » → « Expert technique
 * externalisé » le 2026-09-10, ADR-010). Déclarée une seule fois : les deux
 * OfferCatalog du site (ContactPage et LocalBusiness de la home) la
 * réutilisent, donc un seul endroit à corriger. Prix exprimé en
 * UnitPriceSpecification parce qu'il est mensuel et plancher (« à partir de ») :
 * `minPrice` + `referenceQuantity` en mois.
 *
 * Le libellé suit la langue de la page : sur /en, la page affiche
 * « Outsourced technical expert », le schéma doit dire la même chose que le
 * visible.
 */
const CTO_OFFER = (locale: SchemaLocale) =>
  ({
    "@type": "Offer",
    name: locale === "en" ? "Outsourced technical expert" : "Expert technique externalisé",
    description:
      locale === "en"
        ? `Technical direction on shared time for a mid-sized company's customer-facing digital estate: someone who decides, writes it down, steers your vendors and answers for what is decided, with a dedicated continuous watch. Two tiers, from €${CTO_PRICE_VALUE} excl. VAT per month. ${CTO_MIN_MONTHS}-month commitment, then rolling monthly.`
        : `Direction technique à temps partagé pour le numérique visible d'une PME : quelqu'un qui décide, l'écrit, pilote vos prestataires et répond de ce qui est décidé, avec une veille dédiée en continu. Deux paliers, à partir de ${CTO_PRICE_VALUE} € HT par mois. Engagement de ${CTO_MIN_MONTHS} mois, puis reconduction au mois.`,
    priceCurrency: CTO_PRICE_CURRENCY,
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      priceCurrency: CTO_PRICE_CURRENCY,
      minPrice: CTO_PRICE_VALUE,
      valueAddedTaxIncluded: false,
      referenceQuantity: {
        "@type": "QuantitativeValue",
        value: 1,
        unitCode: CTO_BILLING_UNIT_CODE,
      },
    },
    url: `${siteConfig.url}${localePath(locale, CTO_PATH)}`,
  }) as const;

/** URL réellement servie pour une locale donnée (FR sans préfixe, EN préfixé). */
function localePath(locale: SchemaLocale, path: string): string {
  return locale === "en" ? `/en${path}` : path;
}

/**
 * Offre « Suivi et maintenance » (moment « Gérer »). Elle n'entre au catalogue
 * que si MAINTENANCE_PRIX_VALIDES vaut true : tant que les prix ne sont pas
 * validés, la page est en noindex et le schéma ne la déclare pas. Plancher
 * mensuel lu dans lib/maintenance-offer.ts, jamais recopié. La mise sous
 * suivi, condition de démarrage, n'est pas une offre : elle n'est pas déclarée.
 * Page en français seulement (locale EN en noindex) : l'URL pointe toujours la
 * version française.
 */
const MAINTENANCE_OFFER = (locale: SchemaLocale) =>
  ({
    "@type": "Offer",
    name: locale === "en" ? "Care and maintenance" : "Suivi et maintenance",
    description:
      locale === "en"
        ? "Monitoring, backups, checked updates and a report every month in your online workspace. Two tiers, a price grid by type of site, continuous watch with Sentinelle included."
        : "Surveillance, sauvegardes, mises à jour vérifiées et rapport chaque mois dans votre espace en ligne. Deux paliers, une grille par type de site, veille en continu avec Sentinelle incluse.",
    priceCurrency: MAINTENANCE_PRICE_CURRENCY,
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      priceCurrency: MAINTENANCE_PRICE_CURRENCY,
      minPrice: MAINTENANCE_PRICE_VALUE,
      valueAddedTaxIncluded: false,
      referenceQuantity: {
        "@type": "QuantitativeValue",
        value: 1,
        unitCode: MAINTENANCE_BILLING_UNIT_CODE,
      },
    },
    url: `${siteConfig.url}${MAINTENANCE_PATH}`,
  }) as const;

/**
 * Ce que chacune des trois prestations est, dans les mots de sa carte d'offre.
 * Rien n'est écrit ici de ce que la carte affiche : le NOM, le nom TECHNIQUE, la
 * phrase EN CLAIR (ADR-015) et le PLANCHER sont lus dans lib/trajectoires.ts.
 * Le schéma suit donc la carte, quelle que soit sa rédaction. S'y ajoutent deux
 * faits que la carte dit aussi : la prestation recommandée, et la première
 * analyse de veille technique et stratégique par laquelle chaque prestation
 * commence (ADR-014).
 */
const trajectoireDescription = (slug: TrajectoireSlug, locale: SchemaLocale): string => {
  const trajectoire = TRAJECTOIRES[slug];
  const isEn = locale === "en";
  const recommended = trajectoire.recommended
    ? isEn
      ? " This is the recommended service."
      : " C'est la prestation recommandée."
    : "";
  // Les variantes (la Refonte, ADR-031) : à égalité, chacune avec son plancher.
  const variantes = trajectoire.variantes?.length
    ? isEn
      ? ` Two variants on an equal footing, chosen according to the situation: ${trajectoire.variantes
          .map((v) => `${v.technique.en}, from ${formatEuros(v.priceValue, "en")} excl. VAT`)
          .join("; ")}.`
      : ` Deux variantes à égalité, choisies selon la situation : ${trajectoire.variantes
          .map((v) => `${v.technique.fr}, à partir de ${formatEuros(v.priceValue, "fr")} HT`)
          .join(" ; ")}.`
    : "";
  const veille = isEn
    ? " It starts with a first technical and strategic watch analysis."
    : " Elle commence par une première analyse de veille technique et stratégique.";
  return `${trajectoire.enClair[locale]}${variantes}${recommended}${veille}`;
};

/** Les deux offres du moment « Diagnostiquer » (échange de 15 minutes gratuit, ADR-023, puis audit) : nom et prix lus dans lib/visio-conseil.ts. */
const conseilOffer = (id: string) => CONSEIL_OFFERS.find((offer) => offer.id === id)!;
const VISIO = conseilOffer("choix-techno-ia");
const AUDIT = conseilOffer("architecture-projet-ia");

/**
 * Types de service de l'entité, dans l'ordre des trois moments : Diagnostiquer,
 * Évoluer, Gérer (ADR-013). Déclarés UNE SEULE FOIS : OrganizationJsonLd et le
 * nœud LocalBusiness de la home lisent cette liste. Les trois prestations y
 * portent leur nom et leur nom technique, lus dans lib/trajectoires.ts
 * (ADR-014). La veille technique et stratégique, caractéristique de toutes les
 * offres, y figure sous son nom (lib/situations.ts). Le suivi et maintenance
 * n'y figure qu'une fois ses prix validés ; Sentinelle, hors catalogue, n'y
 * figure pas. Un pack n'est pas un type de service : il n'y figure pas.
 */
const SERVICE_TYPES: string[] = [
  // Diagnostiquer
  ECHANGE_NAME.fr,
  "Audit de site web et roadmap",
  // Évoluer : les trois prestations, sous leur nom et leur nom technique.
  ...TRAJECTOIRE_ORDER.map(
    (slug) => `${TRAJECTOIRES[slug].name.fr} : ${TRAJECTOIRES[slug].technique.fr}`,
  ),
  // Gérer
  ...(MAINTENANCE_PRIX_VALIDES ? ["Suivi et maintenance de site web"] : []),
  "Expert technique externalisé (direction technique à temps partagé)",
  VEILLE_TITRE.fr,
  // Les anciennes lignes hors catalogue (« Conseil refonte », « Création de
  // sites WordPress », « Applications mobiles (PWA) », « Développement
  // Next.js »…) sont retirées le 2026-09-28 : charte § 1, toute métadonnée qui
  // cite une offre cite l'une des sept lignes.
];

/**
 * Catalogue d'offres de l'entité : les lignes du catalogue de la charte (§1),
 * dans l'ordre des trois moments, Diagnostiquer, Évoluer, Gérer (ADR-013).
 * Sentinelle n'y figure pas : hors catalogue, elle garde le schéma propre à sa
 * page /sentinelle. Le suivi et maintenance n'y entre qu'avec
 * MAINTENANCE_PRIX_VALIDES (lib/maintenance-offer.ts).
 * Déclaré UNE SEULE FOIS : les deux `hasOfferCatalog` du site (ContactPage et
 * le nœud LocalBusiness de la home) le réutilisent, donc un seul endroit à
 * corriger quand le catalogue bouge.
 *
 * Sémantique des prix, alignée sur ce que la charte et les pages affichent :
 * les deux offres de conseil ont un prix EXACT (`price`), les trois
 * forfaits et les abonnements sont des planchers « à partir de »
 * (`minPrice` dans une `UnitPriceSpecification`). Déclarer 2250 en `price`
 * laissait entendre un forfait ferme, que la page ne promet pas.
 *
 * Le catalogue suit la langue de la page : les libellés anglais sont ceux que
 * la version anglaise du site affiche réellement (cartes d'offre, formulaire de
 * contact), et les URL pointent la locale servie.
 */
const FROM_PRICE = (amount: number) => ({
  "@type": "UnitPriceSpecification",
  priceCurrency: "EUR",
  minPrice: amount,
  valueAddedTaxIncluded: false,
});

const OFFER_CATALOG = (locale: SchemaLocale) => {
  const isEn = locale === "en";
  const url = (path: string) => `${siteConfig.url}${localePath(locale, path)}`;
  return {
    "@type": "OfferCatalog",
    name: isEn
      ? "Next Impact advisory, redesign and ongoing care"
      : "Conseil, refonte et suivi Next Impact",
    itemListElement: [
      {
        "@type": "Offer",
        name: VISIO[locale].name,
        description: isEn
          ? "Fifteen minutes on a video call to lay out your situation and know where to start. Free, no commitment."
          : "Quinze minutes en visio pour poser votre situation et savoir par où commencer. Gratuit, sans engagement.",
        price: String(VISIO.tiers[0].value),
        priceCurrency: "EUR",
        // Ancre de la section d'offre (§ 04) plutôt que la page nue : un moteur
        // de réponse cite alors l'endroit exact où le prix est affiché.
        url: url(`/conseil#${VISIO.id}`),
      },
      {
        "@type": "Offer",
        name: AUDIT[locale].name,
        description: isEn
          ? "Audit report (performance, security, technical debt, plugins, hosting), a first technical and strategic watch analysis, costed recommendations, a step-by-step roadmap and a 1-hour debrief by video call."
          : "Rapport d'audit (performance, sécurité, dette technique, plugins, hébergement), première analyse de veille technique et stratégique, préconisations chiffrées, roadmap par étapes et 1 h de restitution en visio.",
        price: String(AUDIT.tiers[0].value),
        priceCurrency: "EUR",
        url: url(`/conseil#${AUDIT.id}`),
      },
      // Évoluer : les trois prestations. Le nom affiché sur la carte vient en
      // tête, le nom technique le suit, pour que le schéma nomme l'offre comme
      // la page qui la vend. Nom et plancher lus dans lib/trajectoires.ts.
      // L'URL est l'ancre de la section de /solutions-web où le prix est
      // affiché. Les packs ne sont PAS déclarés ici (ADR-014) : un pack assemble
      // des lignes du catalogue, il n'en est pas une.
      ...TRAJECTOIRE_ORDER.map((slug) => {
        const trajectoire = TRAJECTOIRES[slug];
        return {
          "@type": "Offer",
          name: `${trajectoire.name[locale]}${isEn ? ": " : " : "}${trajectoire.technique[locale]}`,
          description: trajectoireDescription(slug, locale),
          priceCurrency: "EUR",
          priceSpecification: FROM_PRICE(trajectoire.priceValue),
          url: url(trajectoire.href),
        };
      }),
      // Gérer : les deux abonnements, du plus léger au plus engageant.
      // Sentinelle n'est plus déclarée ici (ADR-013) : hors catalogue, elle se
      // vend depuis le rapport de l'analyse du site et garde le schéma de sa
      // page /sentinelle.
      ...(MAINTENANCE_PRIX_VALIDES ? [MAINTENANCE_OFFER(locale)] : []),
      CTO_OFFER(locale),
    ],
  } as const;
};

/**
 * Le catalogue complet, prix compris, en nœud autonome : pour /tarifs, la
 * seule page qui affiche toutes les offres et leurs prix. Même source que le
 * hasOfferCatalog de l'entité (OFFER_CATALOG) : aucun prix recopié.
 */
export function OfferCatalogJsonLd({ locale = "fr" }: { locale?: SchemaLocale }) {
  const data = {
    "@context": "https://schema.org",
    ...OFFER_CATALOG(locale),
  };
  return <JsonLd data={data} />;
}

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
    // Le nom de domaine et la citation presse écrivent « Next Impact Digital » :
    // déclarer la variante évite deux entités distinctes côté moteurs.
    alternateName: "Next Impact Digital",
    url: siteConfig.url,
    logo: `${siteConfig.url}/img/logo-next-impact-bleu.png`,
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    description: siteConfig.description,
    founder: {
      "@type": "Person",
      "@id": `${siteConfig.url}/#person`,
      name: "Agathe Karinthi-Martin",
      jobTitle: "Conseil techno web à l'heure de l'IA",
      // Même url que les autres déclarations de #person (profil sur le site) ;
      // LinkedIn reste dans ses sameAs.
      url: `${siteConfig.url}/a-propos`,
      sameAs: ["https://www.linkedin.com/in/agat-dev/"],
    },
    telephone: "+33673981638",
    email: "agathe@next-impact.digital",
    // Immatriculation vérifiable (registre du commerce français). Le même
    // numéro est déjà pointé par les liens `sameAs` ci-dessous : le déclarer
    // en identifiant lève l'ambiguïté d'entité pour les moteurs de réponse.
    identifier: {
      "@type": "PropertyValue",
      propertyID: "SIREN",
      value: "532675386",
    },
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
    serviceType: SERVICE_TYPES,
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
      "Refonte de site WordPress",
      "Dette technique",
      "Core Web Vitals",
      "Performance web",
      "SEO technique",
      "Veille technologique",
      VEILLE_TITRE.fr,
      ...(MAINTENANCE_PRIX_VALIDES ? ["Maintenance de site web"] : []),
      "Direction technique à temps partagé",
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
const AUTHOR_NAME = "Agathe Karinthi-Martin";

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
  locale,
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
  /** Locale du contenu (« fr-FR », « en »…) : consolide le graphe multilingue. */
  inLanguage?: string;
  /**
   * Locale de la page rendue (« fr » / « en »). Fournie, elle préfixe l'URL
   * relative pour les locales non par défaut : `mainEntityOfPage` pointe alors
   * l'URL réellement servie (/en/...) et non son équivalent français. Omise,
   * comportement historique conservé.
   */
  locale?: string;
}) {
  const localePrefix = locale && locale !== "fr" ? `/${locale}` : "";
  const canonicalUrl = url.startsWith("http")
    ? url
    : `${siteConfig.url}${localePrefix}${url}`;
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
    //
    // Le nom n'est plus repris du front matter : 100 articles déclaraient
    // `author: Next Impact`, ce qui nommait « Next Impact » la Person #person.
    // Les articles sont tous signés par la même personne.
    author: {
      "@type": "Person",
      "@id": `${siteConfig.url}/#person`,
      name: AUTHOR_NAME,
      url: `${siteConfig.url}/a-propos`,
    },
    // Même entité que le nœud du layout ; le logo est le vrai logo, pas la
    // capture d'écran 2560×1600 utilisée jusqu'ici.
    publisher: {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/img/logo-next-impact-bleu.png`,
      },
    },
    url: canonicalUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  };

  return <JsonLd data={data} />;
}

/**
 * Données structurées pour le fil d'Ariane (breadcrumb)
 */
export function BreadcrumbJsonLd({
  items,
  locale,
}: {
  items: Array<{ name: string; url: string }>;
  /**
   * Locale de la page rendue. Fournie, elle préfixe les URL relatives pour les
   * locales non par défaut (`/en/...`) : sur une page anglaise, le fil d'Ariane
   * pointe alors les URL réellement servies, et non leurs équivalents français.
   * Omise, le comportement historique (URL françaises) est conservé.
   */
  locale?: string;
}) {
  const prefix = locale && locale !== "fr" ? `/${locale}` : "";
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http")
        ? item.url
        : `${siteConfig.url}${prefix}${prefix && item.url === "/" ? "" : item.url}`,
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
  offer,
  offerCatalog,
  locale,
}: {
  name: string;
  description: string;
  provider?: string;
  areaServed?: string;
  serviceType?: string;
  url: string;
  /**
   * Locale de la page rendue. Fournie, l'URL relative est préfixée pour les
   * locales non par défaut : le nœud Service d'une page anglaise pointe alors
   * `/en/...`, et non son équivalent français. Omise, comportement historique.
   */
  locale?: string;
  /**
   * Prix réellement affiché sur la page, quand il y en a un. `minPrice` traduit
   * le « à partir de » du catalogue ; `billingUnitCode` (UN/CEFACT, ex. « MON »)
   * n'est renseigné que pour un prix récurrent. Ne jamais déclarer ici un prix
   * qui n'est pas visible sur la page.
   */
  offer?: {
    /** Plancher, quand la page écrit « à partir de ». */
    minPrice?: number;
    /** Montant exact affiché (ex. Sentinelle 19 €/mois, audit 650 €). */
    price?: number;
    priceCurrency?: string;
    billingUnitCode?: string;
  };
  /**
   * Catalogue des offres réellement PRÉSENTÉES sur la page, quand il y en a
   * plusieurs (schema.org `OfferCatalog`). Chaque entrée porte l'URL de sa
   * section ou de sa page canonique : une offre détaillée ailleurs (l'expert
   * technique externalisé, vendu sur `/cto-externalise`) pointe vers cette
   * page-là au lieu de dupliquer son nœud. Ne jamais déclarer ici un prix qui
   * n'est pas visible sur la page.
   */
  offerCatalog?: {
    name: string;
    items: Array<{
      name: string;
      description?: string;
      /** Ancre de section ou route interne ; absolue acceptée. */
      url: string;
      /** Montant exact affiché. Exclusif de `minPrice`. */
      price?: number;
      /** Plancher tarifaire, quand la page écrit « à partir de ». */
      minPrice?: number;
      priceCurrency?: string;
      /** UN/CEFACT (ex. « MON » = par mois), pour un prix récurrent seulement. */
      billingUnitCode?: string;
    }>;
  };
}) {
  const localePrefix = locale && locale !== "fr" ? `/${locale}` : "";
  const absoluteUrl = url.startsWith("http")
    ? url
    : `${siteConfig.url}${localePrefix}${url}`;
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
    url: absoluteUrl,
    ...(offer
      ? {
          offers: {
            "@type": "Offer",
            url: absoluteUrl,
            priceCurrency: offer.priceCurrency ?? "EUR",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              priceCurrency: offer.priceCurrency ?? "EUR",
              ...(offer.price !== undefined ? { price: offer.price } : { minPrice: offer.minPrice }),
              valueAddedTaxIncluded: false,
              ...(offer.billingUnitCode
                ? {
                    referenceQuantity: {
                      "@type": "QuantitativeValue",
                      value: 1,
                      unitCode: offer.billingUnitCode,
                    },
                  }
                : {}),
            },
          },
        }
      : {}),
    ...(offerCatalog
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: offerCatalog.name,
            itemListElement: offerCatalog.items.map((item) => {
              const currency = item.priceCurrency ?? "EUR";
              return {
                "@type": "Offer",
                name: item.name,
                url: item.url.startsWith("http")
                  ? item.url
                  : `${siteConfig.url}${localePrefix}${item.url}`,
                priceCurrency: currency,
                priceSpecification: {
                  "@type": "UnitPriceSpecification",
                  priceCurrency: currency,
                  ...(item.price !== undefined ? { price: item.price } : {}),
                  ...(item.minPrice !== undefined ? { minPrice: item.minPrice } : {}),
                  valueAddedTaxIncluded: false,
                  ...(item.billingUnitCode
                    ? {
                        referenceQuantity: {
                          "@type": "QuantitativeValue",
                          value: 1,
                          unitCode: item.billingUnitCode,
                        },
                      }
                    : {}),
                },
                itemOffered: {
                  "@type": "Service",
                  name: item.name,
                  ...(item.description ? { description: item.description } : {}),
                },
              };
            }),
          },
        }
      : {}),
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
export function ContactPageJsonLd({ locale }: { locale?: string } = {}) {
  const lang = schemaLocale(locale);
  const isEn = lang === "en";
  const data = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact · Next Impact Digital",
    // Prix lus dans leurs sources (lib/visio-conseil.ts, lib/cto-externalise.ts).
    // Le suivi et maintenance n'est cité que si ses prix sont validés, comme
    // dans le formulaire de la page.
    description: isEn
      ? `Talk about a redesign or a new site: a free 15-minute call, audit + roadmap (${AUDIT.tiers[0].price.en} excl. VAT), Optimization, Redesign (custom or headless WordPress) or Evolution project, ${MAINTENANCE_PRIX_VALIDES ? "care and maintenance, " : ""}outsourced technical expert (from €${CTO_PRICE_VALUE}/month), or a free diagnostic.`
      : `Parler d'une refonte ou d'une création : un échange gratuit de 15 minutes, audit + roadmap (${AUDIT.tiers[0].price.fr} HT), projet d'Optimisation, de Refonte (WordPress sur mesure ou headless) ou d'Évolution, ${MAINTENANCE_PRIX_VALIDES ? "suivi et maintenance, " : ""}expert technique externalisé (dès ${CTO_PRICE_VALUE} €/mois), ou diagnostic gratuit.`,
    url: `${siteConfig.url}${localePath(lang, "/contact")}`,
    inLanguage: isEn ? "en-US" : "fr-FR",
    // Même entité que le nœud du layout (un seul @id pour l'entreprise).
    mainEntity: {
      "@type": "ProfessionalService",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/img/logo-next-impact-bleu.png`,
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
        },
      ],
      potentialAction: [
        {
          "@type": "ReserveAction",
          name: isEn
            ? "Book a free 15-minute call"
            : "Réserver l'échange gratuit de 15 minutes",
          target: ECHANGE_URL,
          description: isEn
            ? "Fifteen minutes on a video call to lay out your situation and know where to start. Free, no commitment"
            : "Quinze minutes en visio pour poser votre situation et savoir par où commencer. Gratuit, sans engagement",
        },
        {
          "@type": "CommunicateAction",
          name: isEn ? "Talk about a redesign project" : "Parler d'un projet de refonte",
          target: `${siteConfig.url}${localePath(lang, "/contact")}`,
          description: isEn
            ? "Free 15-minute call, audit + roadmap, redesign or new site project (Optimization, Redesign in custom or headless WordPress, or Evolution), care and maintenance, outsourced technical expert or free diagnostic"
            : "Échange de 15 minutes gratuit, audit + roadmap, projet de refonte ou de création (Optimisation, Refonte en WordPress sur mesure ou headless, ou Évolution), suivi et maintenance, expert technique externalisé ou diagnostic gratuit",
        },
      ],
      hasOfferCatalog: OFFER_CATALOG(lang),
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
    alternateName: "Next Impact Digital",
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: ENGLISH_PUBLISHED ? ["fr-FR", "en-US"] : "fr-FR",
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
  url = `${siteConfig.url}/a-propos`,
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
      name: "Aix-Marseille Université",
    },
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "degree",
      name: "Master Veille technologique et innovation",
      recognizedBy: {
        "@type": "CollegeOrUniversity",
        name: "Aix-Marseille Université",
      },
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
export function HomepageJsonLd({ locale }: { locale?: string } = {}) {
  const baseUrl = siteConfig.url;
  const lang = schemaLocale(locale);
  const isEn = lang === "en";
  // URL réellement servie pour la home de la locale rendue. Les nœuds d'entité
  // (#person, #organization, #localbusiness) gardent leur @id canonique : ce
  // sont les mêmes entités quelle que soit la langue. Seul le nœud WebPage,
  // qui décrit LA page, change d'URL.
  const homeUrl = isEn ? `${baseUrl}/en` : baseUrl;

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      // — WebPage (Speakable : cible le H1 et le cartouche « L'essentiel » pour les
      //   assistants vocaux / lecture IA). Les sélecteurs pointent du contenu visible. —
      {
        "@type": "WebPage",
        "@id": `${homeUrl}#webpage`,
        url: homeUrl,
        name: siteConfig.name,
        inLanguage: isEn ? "en-US" : "fr-FR",
        isPartOf: { "@id": `${baseUrl}/#website` },
        about: { "@id": `${baseUrl}/#organization` },
        primaryImageOfPage: `${baseUrl}${siteConfig.ogImage}`,
        // Dernier remaniement éditorial substantiel de la home : l'offre s'y
        // lit par situation, en trois colonnes, une par besoin, et la veille
        // technique et stratégique y est dite (2026-09-27, ADR-014).
        dateModified: "2026-09-27",
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
        url: `${baseUrl}/a-propos`,
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
        // Mêmes signaux d'expertise que le nœud Person de /a-propos : le
        // parcours est affiché sur la home (section « Qui le fait »), le
        // diplôme sur /a-propos. Rien n'est déclaré qui ne soit visible.
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "Aix-Marseille Université",
        },
        hasCredential: {
          "@type": "EducationalOccupationalCredential",
          credentialCategory: "degree",
          name: "Master Veille technologique et innovation",
          recognizedBy: {
            "@type": "CollegeOrUniversity",
            name: "Aix-Marseille Université",
          },
        },
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
        // Même entité que le nœud du layout (OrganizationJsonLd) : un seul @id,
        // sinon les moteurs voient deux entreprises homonymes (audit 2026-09-28).
        "@id": `${baseUrl}/#organization`,
        name: siteConfig.name,
        url: baseUrl,
        logo: `${baseUrl}/img/logo-next-impact-bleu.png`,
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
        serviceType: SERVICE_TYPES,
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
          "Refonte de site WordPress",
          VEILLE_TITRE.fr,
        ],
        hasOfferCatalog: OFFER_CATALOG(lang),
        potentialAction: [
          {
            "@type": "ReserveAction",
            name: isEn
              ? "Book a free 15-minute call"
              : "Réserver l'échange gratuit de 15 minutes",
            target: ECHANGE_URL,
            description: isEn
              ? "Fifteen minutes on a video call to lay out your situation and know where to start. Free, no commitment"
              : "Quinze minutes en visio pour poser votre situation et savoir par où commencer. Gratuit, sans engagement",
          },
          {
            "@type": "CommunicateAction",
            name: isEn ? "Talk about a redesign project" : "Parler d'un projet de refonte",
            target: `${baseUrl}${localePath(lang, "/contact")}`,
            description: isEn
              ? "Free 15-minute call, audit + roadmap, redesign or new site project (Optimization, Redesign in custom or headless WordPress, or Evolution), care and maintenance, outsourced technical expert or free diagnostic"
              : "Échange de 15 minutes gratuit, audit + roadmap, projet de refonte ou de création (Optimisation, Refonte en WordPress sur mesure ou headless, ou Évolution), suivi et maintenance, expert technique externalisé ou diagnostic gratuit",
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
  locale,
}: {
  name: string;
  description: string;
  url: string;
  items: Array<{ name: string; url: string; description?: string }>;
  /**
   * Locale de la page rendue. Fournie, les URL relatives (la collection et
   * chacun de ses items) sont préfixées pour les locales non par défaut : la
   * liste pointe alors les URL réellement servies. Omise, comportement
   * historique (URL françaises).
   */
  locale?: string;
}) {
  const prefix = locale && locale !== "fr" ? `/${locale}` : "";
  const absolute = (value: string) =>
    value.startsWith("http") ? value : `${siteConfig.url}${prefix}${value}`;
  const data = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: absolute(url),
    ...(locale ? { inLanguage: locale === "en" ? "en-US" : "fr-FR" } : {}),
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: absolute(item.url),
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
  locale,
}: {
  name: string;
  description: string;
  url: string;
  applicationCategory?: string;
  offers?: { price: string; priceCurrency?: string };
  /** Locale de la page rendue : préfixe l'URL relative pour /en. */
  locale?: string;
}) {
  const prefix = locale && locale !== "fr" ? `/${locale}` : "";
  const data = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url: url.startsWith("http") ? url : `${siteConfig.url}${prefix}${url}`,
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
      "@id": `${siteConfig.url}/#organization`,
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
    // `contentUrl` désigne le fichier média : une page YouTube (youtu.be,
    // youtube.com/watch) n'en est pas un, `embedUrl` suffit alors.
    ...(contentUrl && !/youtu\.?be/.test(contentUrl) && { contentUrl }),
    ...(embedUrl && { embedUrl }),
    publisher: {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/img/logo-next-impact-bleu.png`,
      },
    },
  };

  return <JsonLd data={data} />;
}
