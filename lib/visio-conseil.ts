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
  /** Prestation sur devis : le prix affiché est localisé, pas de mention HT. */
  quote?: boolean;
  note?: { fr: string; en: string };
}

export interface ConseilOffer {
  id: string;
  featured?: boolean;
  /** Seule offre déduite du devis projet (aujourd'hui : le conseil techno). */
  credited?: boolean;
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
    id: "choix-techno-ia",
    featured: true,
    credited: true,
    tiers: [
      {
        duration: { fr: "1 h", en: "1h" },
        price: "150 €",
        value: 150,
        calendlyUrl: `${CALENDLY_BASE}/conseil-de-choix-de-techno-pour-une-refonte`,
      },
    ],
    fr: {
      name: "Conseil techno pour une refonte",
      tag: "Sélecteur techno",
      tagline: "Trancher la bonne techno pour votre refonte, en une heure.",
      forWho:
        "Vous préparez une refonte — ou un nouveau projet — et vous voulez une recommandation claire et argumentée plutôt que des semaines de comparaison.",
      bullets: [
        "Une heure en visio : analyse de l'existant et recueil du besoin",
        "Recommandation de techno principale (et alternative éventuelle)",
        "Points de vigilance : maintenance, coût, dépendance, SEO",
        "100 % crédité sur un projet signé sous 30 jours — le seul palier déduit",
      ],
    },
    en: {
      name: "Tech advice for a rebuild",
      tag: "Compass",
      tagline: "Settle the right technology for your rebuild, in one hour.",
      forWho:
        "You are preparing a rebuild — or a new project — and want a clear, argued recommendation instead of weeks of comparison.",
      bullets: [
        "One hour on a call: review of your existing setup and needs",
        "Main technology recommendation (and possible alternative)",
        "Watch points: maintenance, cost, lock-in, SEO",
        "100% credited to a project signed within 30 days — the only deducted tier",
      ],
    },
  },
  {
    id: "architecture-projet-ia",
    tiers: [
      {
        duration: { fr: "1 h + livrables", en: "1h + deliverables" },
        price: "650 €",
        value: 650,
        calendlyUrl: `${CALENDLY_BASE}/conseil-de-choix-d-architecture-web-ia`,
      },
    ],
    fr: {
      name: "Audit complet et préconisations",
      tag: "Cadrage",
      tagline: "L'état des lieux, les préconisations et la roadmap avant d'investir.",
      forWho:
        "Vous préparez une décision structurante — refonte, migration, outil métier — et vous voulez un état des lieux complet et un plan d'action avant d'engager un budget.",
      bullets: [
        "Audit complet de l'existant et des contraintes du projet",
        "Visio conseil d'1 heure pour arbitrer les choix",
        "Préconisations : solutions et architecture adaptées au besoin",
        "Livrables : rapport d'audit, préconisations et roadmap",
      ],
    },
    en: {
      name: "Full audit & recommendations",
      tag: "Scoping",
      tagline: "The full picture, recommendations and roadmap before you invest.",
      forWho:
        "You are preparing a structural decision — rebuild, migration, business tool — and want a complete assessment and an action plan before committing a budget.",
      bullets: [
        "Full audit of your existing setup and project constraints",
        "One-hour advisory call to settle the choices",
        "Recommendations: solutions and architecture fit to the need",
        "Deliverables: audit report, recommendations and roadmap",
      ],
    },
  },
  {
    id: "accompagnement-duree",
    internalCta: true,
    cta: { fr: "Cadrer un accompagnement", en: "Scope an engagement" },
    tiers: [
      {
        duration: { fr: "", en: "" },
        price: "Sur devis",
        value: 0,
        quote: true,
        calendlyUrl: "/contact?sujet=accompagnement",
      },
    ],
    fr: {
      name: "Accompagnement dans la durée",
      tag: "Pilotage",
      tagline: "Votre direction technique, à vos côtés mois après mois.",
      forWho:
        "Vous n'avez pas de profil technique en interne mais vous devez arbitrer, prioriser et sécuriser vos choix web et IA en continu — sans embaucher ni dépendre d'un prestataire unique.",
      bullets: [
        "Pilotage régulier : visios, arbitrages et priorités au fil de vos projets",
        "Relecture de vos devis et propositions fournisseurs au fil de l'eau",
        "Roadmap vivante : priorités, budget et prochaines étapes tenus à jour",
        "Veille ciblée : IA, sécurité, obsolescence et dette technique",
        "Rythme et périmètre définis ensemble — sans engagement de durée",
      ],
    },
    en: {
      name: "Ongoing tech direction",
      tag: "Steering",
      tagline: "Your technical direction, by your side month after month.",
      forWho:
        "You have no technical profile in-house but must arbitrate, prioritize and secure your web and AI choices continuously — without hiring or depending on a single vendor.",
      bullets: [
        "Regular steering: calls, arbitration and priorities as your projects unfold",
        "Ongoing review of your quotes and vendor proposals",
        "Living roadmap: priorities, budget and next steps kept up to date",
        "Targeted watch: AI, security, obsolescence and technical debt",
        "Pace and scope defined together — no time commitment",
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
      a: "Le conseil techno tranche en une heure la technologie de votre refonte. L'audit complet va plus loin : état des lieux, préconisations et roadmap, remis en livrables. L'accompagnement dans la durée installe ce regard dans le temps — pilotage, arbitrages et priorités au fil de vos projets, sur devis.",
    },
    en: {
      q: "Which offer should I choose?",
      a: "The tech advice call settles the technology of your rebuild in one hour. The full audit goes further: assessment, recommendations and roadmap, handed over as deliverables. The ongoing engagement installs that perspective over time — steering, arbitration and priorities as your projects unfold, on a custom quote.",
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
      q: "C'est quoi l'accompagnement dans la durée ?",
      a: "Un pilotage technique régulier : des visios, des arbitrages en continu, la relecture de vos devis et une roadmap tenue à jour. L'équivalent d'un directeur technique, sans l'embauche — le rythme et le périmètre sont définis ensemble, sur devis.",
    },
    en: {
      q: "What is the ongoing engagement?",
      a: "Regular technical steering: calls, ongoing arbitration, review of your quotes and a roadmap kept up to date. The equivalent of a technical director, without the hire — pace and scope are defined together, on a custom quote.",
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
      a: "Seul le conseil techno (1 h, 150 €) est crédité : 100 % sur un projet signé sous 30 jours. L'audit complet et ses livrables — rapport d'audit, préconisations, roadmap — sont une prestation à part entière ; l'accompagnement dans la durée se chiffre sur devis.",
    },
    en: {
      q: "Is the amount credited if a project follows?",
      a: "Only the tech advice call (1h, €150) is credited: 100% on a project signed within 30 days. The full audit and its deliverables — audit report, recommendations, roadmap — are a standalone service; the ongoing engagement is priced on a custom quote.",
    },
  },
];
