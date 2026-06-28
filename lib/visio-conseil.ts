export const CREDIT_WINDOW_DAYS = 30;
export const CALENDLY_BASE = "https://calendly.com/agathe-next-impact";

interface OfferCopy {
  name: string;
  tag?: string;
  tagline: string;
  forWho: string;
  bullets: string[];
}

export interface ConseilTier {
  duration: { fr: string; en: string };
  price: string;
  value: number;
  calendlyUrl: string;
  featured?: boolean;
  note?: { fr: string; en: string };
}

export interface ConseilOffer {
  id: string;
  featured?: boolean;
  tiers: ConseilTier[];
  fr: OfferCopy;
  en: OfferCopy;
}

export const OFFERS: ConseilOffer[] = [
  {
    id: "visio-decision-techno",
    featured: true,
    tiers: [
      {
        duration: { fr: "60 à 75 min", en: "60 to 75 min" },
        price: "180 €",
        value: 180,
        calendlyUrl: `${CALENDLY_BASE}/visio-decision-techno`,
      },
    ],
    fr: {
      name: "Visio décision techno",
      tag: "Boussole",
      tagline: "Trancher une décision web à l'heure de l'IA.",
      forWho:
        "Vous hésitez entre WordPress, no-code, IA coding, SaaS, Headless ou sur-mesure et vous voulez décider sans perdre des semaines à comparer.",
      bullets: [
        "Ce qu'il faut construire, simplifier ou ne pas construire",
        "Recommandation principale et alternative éventuelle",
        "Risques de maintenance, sécurité, SEO, dette technique et coût futur",
        "100 % crédité sur un projet signé sous 30 jours",
      ],
    },
    en: {
      name: "Tech decision call",
      tag: "Entry advice",
      tagline: "Settle a web decision in the age of AI.",
      forWho:
        "You are hesitating between WordPress, no-code, AI coding, SaaS, Headless or custom and want to decide without spending weeks comparing.",
      bullets: [
        "What to build, simplify or not build",
        "Main recommendation and possible alternative",
        "Maintenance, security, SEO, technical debt and future cost risks",
        "100% credited to a project signed within 30 days",
      ],
    },
  },
  {
    id: "second-avis-techno",
    tiers: [
      {
        duration: { fr: "Analyse + 60 min", en: "Review + 60 min" },
        price: "390 €",
        value: 390,
        calendlyUrl: `${CALENDLY_BASE}/second-avis-techno`,
      },
    ],
    fr: {
      name: "Second avis devis / stack / prototype IA",
      tagline: "Avant de signer, coder ou industrialiser trop vite.",
      forWho:
        "Vous avez un devis, une proposition d'agence, une stack recommandée ou un prototype généré avec l'IA et vous voulez savoir si c'est maintenable.",
      bullets: [
        "Points forts, vigilances et questions à poser",
        "Risques de dépendance, surcoût, données, sécurité ou mauvais dimensionnement",
        "Recommandation : signer, ajuster, comparer ou recadrer",
        "50 % crédité sur un projet signé sous 30 jours",
      ],
    },
    en: {
      name: "Quote / stack / AI prototype second opinion",
      tagline: "Before signing, coding or industrializing too fast.",
      forWho:
        "You have a quote, agency proposal, recommended stack or AI-generated prototype and want to know if it is maintainable.",
      bullets: [
        "Strengths, watch points and questions to ask",
        "Dependency, overcost, data, security and sizing risks",
        "Recommendation: sign, adjust, compare or rescope",
        "50% credited to a project signed within 30 days",
      ],
    },
  },
  {
    id: "roadmap-techno-impact",
    tiers: [
      {
        duration: { fr: "Essentielle", en: "Essential" },
        price: "950 €",
        value: 950,
        calendlyUrl: `${CALENDLY_BASE}/visio-decision-techno`,
      },
    ],
    fr: {
      name: "Roadmap projet web",
      tagline: "Feuille de route avant IA, no-code, refonte ou outil métier.",
      forWho:
        "Votre projet est plus structurant et vous devez clarifier objectifs, fonctionnalités, architecture, données et investissement avant de produire.",
      bullets: [
        "Questionnaire, analyse de l'existant et atelier de cadrage",
        "Scénarios possibles : WordPress, SaaS, no-code, IA coding, Headless ou sur-mesure",
        "Risques, dépendances, budget indicatif et ordre de mise en œuvre",
        "Option : 300 € crédités sur projet supérieur à 4 000 € HT",
      ],
    },
    en: {
      name: "Web project roadmap",
      tagline: "Roadmap before AI, no-code, redesign or a business tool.",
      forWho:
        "Your project is more structural and you need to clarify goals, features, architecture, data and investment before production.",
      bullets: [
        "Questionnaire, existing-state review and scoping workshop",
        "Possible scenarios: WordPress, SaaS, no-code, AI coding, Headless or custom",
        "Risks, dependencies, indicative budget and rollout order",
        "Option: €300 credited to projects above €4,000 excl. VAT",
      ],
    },
  },
];

export interface FaqItem {
  fr: { q: string; a: string };
  en: { q: string; a: string };
}

export const FAQ: FaqItem[] = [
  {
    fr: {
      q: "Quelle offre choisir ?",
      a: "La visio décision techno sert à trancher une question précise. Le second avis challenge un devis, une stack ou un prototype IA. La roadmap cadre un projet plus large avant production.",
    },
    en: {
      q: "Which offer should I choose?",
      a: "The tech decision call settles one precise question. The second opinion challenges a quote, stack or AI prototype. The roadmap scopes a broader project before production.",
    },
  },
  {
    fr: {
      q: "Pourquoi payer du conseil avant un projet ?",
      a: "Parce qu'à l'heure où l'IA peut générer du code en quelques minutes, le vrai enjeu est de choisir ce qu'il faut construire, avec quelle architecture, pour que ce soit utile, maintenable et rentable.",
    },
    en: {
      q: "Why pay for advice before a project?",
      a: "Because when AI can generate code in minutes, the real issue is choosing what to build, with which architecture, so it stays useful, maintainable and profitable.",
    },
  },
  {
    fr: {
      q: "Le conseil inclut-il de la correction technique ?",
      a: "Non. Le conseil aide à décider, prioriser et réduire le risque. Les corrections WordPress relèvent du dépannage, et la production relève des services Next Impact.",
    },
    en: {
      q: "Does advice include technical fixes?",
      a: "No. Advice helps decide, prioritize and reduce risk. WordPress fixes belong to support, and implementation belongs to Next Impact services.",
    },
  },
  {
    fr: {
      q: "Le montant est-il crédité si un projet suit ?",
      a: "Oui pour les offres d'aide à la décision : la visio décision techno est créditée à 100 % sous 30 jours, le second avis à 50 %. La roadmap est un livrable stratégique ; seul un crédit partiel peut s'appliquer sur les projets plus importants.",
    },
    en: {
      q: "Is the amount credited if a project follows?",
      a: "Yes for decision offers: the tech decision call is credited at 100% within 30 days, the second opinion at 50%. The roadmap is already a strategic deliverable; only partial credit may apply to larger projects.",
    },
  },
];
