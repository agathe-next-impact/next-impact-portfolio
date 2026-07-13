import type { Locale } from "@/i18n/routing";

// Contenu GEO de la home (Lot 1 du chantier Score GEO) : bloc « En bref » (TL;DR,
// format de citation idéal pour les LLMs) + FAQ (questions conversationnelles →
// FAQPage schema + titres en question). Convention du repo : module TS FR + EN +
// accesseur. Consommé à la fois par le rendu visible (home-tldr / home-faq) et par
// le JSON-LD (FAQJsonLd dans page.tsx) → une seule source de vérité.

export interface HomeFaqItem {
  question: string;
  answer: string;
}

export interface HomeContent {
  tldr: { label: string; lines: string[] };
  faq: { kicker: string; title: string; items: HomeFaqItem[] };
}

const FR: HomeContent = {
  tldr: {
    label: "En bref",
    lines: [
      "Next Impact aide les petites structures à choisir la bonne techno web à l'heure où l'IA peut coder vite.",
      "La question n'est plus seulement de développer : il faut décider quoi construire, avec quelle architecture, et jusqu'où aller.",
      "La Boussole Techno Web & IA compare WordPress, no-code, IA coding, SaaS, Headless, sur-mesure ou l'option de ne rien construire.",
      "Quand la solution est claire, Next Impact peut aussi construire, corriger ou stabiliser : WordPress, Headless ou outil métier.",
    ],
  },
  faq: {
    kicker: "FAQ",
    title: "Les questions qu'on me pose le plus",
    items: [
      {
        question: "Pourquoi payer du conseil si l'IA peut coder ?",
        answer:
          "Parce que l'IA facilite la production de code, mais ne remplace pas le choix d'architecture, la priorisation, la sécurité, le SEO, la maintenance ni la cohérence business. Une mauvaise décision peut coûter plus cher qu'un bon cadrage.",
      },
      {
        question: "Qu'est-ce que la Boussole Techno Web & IA ?",
        answer:
          "C'est une offre de conseil pour choisir entre WordPress, no-code, IA coding, SaaS, Headless ou sur-mesure. Elle aide à décider ce qu'il faut construire, simplifier, réparer ou ne pas construire.",
      },
      {
        question: "Pouvez-vous relire un devis ou un prototype généré avec l'IA ?",
        answer:
          "Oui. Un avis techno indépendant, en visio, vérifie la cohérence de la stack, le niveau de complexité, les risques de dépendance, la dette technique, les données, la sécurité, le SEO et le coût futur.",
      },
      {
        question: "Est-ce que Next Impact construit aussi les solutions ?",
        answer:
          "Oui, si la solution relève du bon périmètre : site WordPress optimisé, WordPress Headless + Next.js, outil métier ou plateforme sur mesure. La production vient après la décision, pas avant.",
      },
      {
        question: "WordPress Headless reste-t-il une offre Next Impact ?",
        answer:
          "Oui, mais ce n'est plus la réponse poussée par défaut. Le Headless est pertinent quand la performance, l'expérience, le SEO éditorial ou l'évolutivité le justifient.",
      },
      {
        question: "Et si mon WordPress actuel a juste un problème ?",
        answer:
          "On regarde ensemble : réparer quand c'est suffisant, optimiser si la base est saine, refaire seulement quand c'est justifié. Décrivez-moi le problème et je vous oriente.",
      },
      {
        question: "Travaillez-vous à distance ?",
        answer:
          "Oui, 100 % à distance, partout en France et au-delà. Les échanges se font en visio, et vous gardez un interlocuteur unique du devis à la livraison.",
      },
    ],
  },
};

const EN: HomeContent = {
  tldr: {
    label: "In short",
    lines: [
      "Next Impact helps small teams choose the right web technology when AI can code fast.",
      "The question is no longer only how to develop: it is what to build, with which architecture, and how far to go.",
      "The Web & AI Tech Compass compares WordPress, no-code, AI coding, SaaS, Headless, custom development or not building at all.",
      "Once the solution is clear, Next Impact can also build, fix or stabilize: WordPress, Headless or business tools.",
    ],
  },
  faq: {
    kicker: "FAQ",
    title: "The questions I'm asked most",
    items: [
      {
        question: "Why pay for advice if AI can code?",
        answer:
          "Because AI makes code production easier, but it does not replace architecture choices, prioritization, security, SEO, maintenance or business coherence. A bad decision can cost more than good scoping.",
      },
      {
        question: "What is the Web & AI Tech Compass?",
        answer:
          "It is an advisory offer to choose between WordPress, no-code, AI coding, SaaS, Headless or custom development. It helps decide what to build, simplify, fix or not build.",
      },
      {
        question: "Can you review a quote or AI-generated prototype?",
        answer:
          "Yes. An independent tech opinion, on a call, checks stack coherence, complexity level, dependency risks, technical debt, data, security, SEO and future cost.",
      },
      {
        question: "Does Next Impact also build the solutions?",
        answer:
          "Yes, when the solution fits the right scope: optimized WordPress site, Headless WordPress + Next.js, business tool or custom platform. Implementation comes after the decision, not before.",
      },
      {
        question: "Is Headless WordPress still part of the offer?",
        answer:
          "Yes, but it is no longer the default answer. Headless is relevant when performance, experience, editorial SEO or scalability justify it.",
      },
      {
        question: "What if my current WordPress only has a problem?",
        answer:
          "We look at it together: fix when enough, optimize if the base is healthy, rebuild only when justified. Describe the problem and I'll point you the right way.",
      },
      {
        question: "Do you work remotely?",
        answer:
          "Yes, fully remote, across France and beyond. We work over video calls, and you keep a single point of contact from quote to delivery.",
      },
    ],
  },
};

export function getHomeContent(locale: Locale): HomeContent {
  return locale === "en" ? EN : FR;
}
