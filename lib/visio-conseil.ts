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
  /** Seule offre déduite du devis projet (aujourd'hui : la visio décision). */
  credited?: boolean;
  /** Abonnement mensuel : affiche « sans engagement », pas de crédit. */
  recurring?: boolean;
  /** CTA interne (Link i18n) au lieu du lien Calendly externe. */
  internalCta?: boolean;
  /** Libellé de CTA personnalisé (défaut : « Réserver et payer »). */
  cta?: { fr: string; en: string };
  tiers: ConseilTier[];
  fr: OfferCopy;
  en: OfferCopy;
}

export const OFFERS: ConseilOffer[] = [
  {
    id: "visio-decision-techno",
    featured: true,
    credited: true,
    tiers: [
      {
        duration: { fr: "60 à 75 min", en: "60 to 75 min" },
        price: "240 €",
        value: 240,
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
        "100 % crédité sur un projet signé sous 30 jours — le seul palier déduit",
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
        "100% credited to a project signed within 30 days — the only deducted tier",
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
        "Analyse écrite remise après l'appel — pas seulement un avis oral",
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
        "Written analysis delivered after the call — not just a verbal opinion",
      ],
    },
  },
  {
    id: "roadmap-techno-impact",
    tiers: [
      {
        duration: { fr: "livrable complet", en: "full deliverable" },
        price: "1 500 €",
        value: 1500,
        calendlyUrl: `${CALENDLY_BASE}/visio-decision-techno`,
      },
    ],
    fr: {
      name: "Roadmap projet web",
      tag: "Signature",
      tagline: "Feuille de route avant IA, no-code, refonte ou outil métier.",
      forWho:
        "Votre projet est plus structurant et vous devez clarifier objectifs, fonctionnalités, architecture, données et investissement avant de produire.",
      bullets: [
        "Questionnaire, analyse de l'existant et atelier de cadrage",
        "2 à 3 scénarios techno chiffrés et comparés : WordPress, SaaS, no-code, IA, Headless ou sur-mesure",
        "Architecture cible, plan de données et backlog priorisé des fonctionnalités",
        "Budget par phase, ordre de mise en œuvre, risques, dépendances et réversibilité",
        "Livrable écrit + visio de restitution — un dossier prêt à briefer un prestataire",
      ],
    },
    en: {
      name: "Web project roadmap",
      tag: "Signature",
      tagline: "Roadmap before AI, no-code, redesign or a business tool.",
      forWho:
        "Your project is more structural and you need to clarify goals, features, architecture, data and investment before production.",
      bullets: [
        "Questionnaire, existing-state review and scoping workshop",
        "2 to 3 costed, compared tech scenarios: WordPress, SaaS, no-code, AI, Headless or custom",
        "Target architecture, data plan and prioritized feature backlog",
        "Budget per phase, rollout order, risks, dependencies and reversibility",
        "Written deliverable + recap call — a dossier ready to brief any vendor",
      ],
    },
  },
  {
    id: "direction-technique-externalisee",
    recurring: true,
    internalCta: true,
    cta: { fr: "Cadrer un accompagnement", en: "Set up a retainer" },
    tiers: [
      {
        duration: { fr: "mois", en: "month" },
        price: "750 €",
        value: 750,
        calendlyUrl: "/contact?sujet=direction-technique",
      },
    ],
    fr: {
      name: "Direction technique externalisée",
      tag: "Récurrent",
      tagline: "Votre direction technique, à la demande, chaque mois.",
      forWho:
        "Vous n'avez pas de profil technique en interne mais vous devez arbitrer, prioriser et sécuriser vos choix web et IA en continu — sans embaucher ni dépendre d'un prestataire unique.",
      bullets: [
        "1 visio de pilotage par mois (60 min) + arbitrages illimités en asynchrone",
        "Relecture de vos devis et propositions fournisseurs au fil de l'eau",
        "Roadmap vivante : priorités, budget et prochaines étapes tenus à jour",
        "Veille ciblée : IA, sécurité, obsolescence et dette technique",
        "Sans engagement de durée · accès prioritaire à la mise en œuvre",
      ],
    },
    en: {
      name: "Fractional tech direction",
      tag: "Recurring",
      tagline: "Your technical direction, on demand, every month.",
      forWho:
        "You have no technical profile in-house but must arbitrate, prioritize and secure your web and AI choices continuously — without hiring or depending on a single vendor.",
      bullets: [
        "One 60-min steering call per month + unlimited async arbitration",
        "Ongoing review of your quotes and vendor proposals",
        "Living roadmap: priorities, budget and next steps kept up to date",
        "Targeted watch: AI, security, obsolescence and technical debt",
        "No time commitment · priority access to implementation",
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
      a: "La visio décision techno tranche une question précise. Le second avis challenge un devis, une stack ou un prototype IA. La roadmap cadre un projet plus large avant production. La direction technique externalisée vous donne un pilotage récurrent, mois après mois.",
    },
    en: {
      q: "Which offer should I choose?",
      a: "The tech decision call settles one precise question. The second opinion challenges a quote, stack or AI prototype. The roadmap scopes a broader project before production. The fractional tech direction gives you recurring steering, month after month.",
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
      q: "C'est quoi la direction technique externalisée ?",
      a: "Un abonnement mensuel de pilotage : une visio par mois, des arbitrages en continu, la relecture de vos devis et une roadmap tenue à jour. L'équivalent d'un directeur technique, sans l'embauche et sans engagement de durée.",
    },
    en: {
      q: "What is fractional tech direction?",
      a: "A monthly steering subscription: one call per month, ongoing arbitration, review of your quotes and a roadmap kept up to date. The equivalent of a technical director, without the hire and with no time commitment.",
    },
  },
  {
    fr: {
      q: "Le conseil inclut-il de la correction technique ?",
      a: "Non. Le conseil aide à décider, prioriser et réduire le risque. Les corrections WordPress et la production relèvent des services Next Impact.",
    },
    en: {
      q: "Does advice include technical fixes?",
      a: "No. Advice helps decide, prioritize and reduce risk. WordPress fixes and implementation belong to Next Impact services.",
    },
  },
  {
    fr: {
      q: "Le montant est-il crédité si un projet suit ?",
      a: "Seule la visio décision est créditée : 100 % sur un projet signé sous 30 jours. Le second avis, la roadmap et la direction technique externalisée sont des livrables à part entière — leur valeur est dans le rendu, pas dans un remboursement.",
    },
    en: {
      q: "Is the amount credited if a project follows?",
      a: "Only the tech decision call is credited: 100% on a project signed within 30 days. The second opinion, the roadmap and the fractional tech direction are standalone deliverables — their value is in the output, not in a refund.",
    },
  },
];
