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
    id: "choix-techno-ia",
    featured: true,
    credited: true,
    tiers: [
      {
        duration: { fr: "30 min", en: "30 min" },
        price: "150 €",
        value: 150,
        calendlyUrl: `${CALENDLY_BASE}/conseil-de-choix-de-techno-pour-un-projet-web-clone`,
      },
    ],
    fr: {
      name: "Choix de techno web avec l'IA",
      tag: "Sélecteur techno",
      tagline: "Trancher rapidement la bonne techno pour votre projet.",
      forWho:
        "Vous démarrez un projet et vous voulez, en 30 minutes, une reco de techno claire plutôt que des semaines de comparaison.",
      bullets: [
        "Analyse express de l'existant et recueil du besoin",
        "Recommandation de techno principale (et alternative éventuelle)",
        "Points de vigilance : maintenance, coût, dépendance, SEO",
        "100 % crédité sur un projet signé sous 30 jours — le seul palier déduit",
      ],
    },
    en: {
      name: "Web tech choice with AI",
      tag: "Compass",
      tagline: "Settle the right technology for your project, fast.",
      forWho:
        "You are starting a project and want, in 30 minutes, a clear technology recommendation instead of weeks of comparison.",
      bullets: [
        "Express review of your existing setup and needs",
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
        duration: { fr: "1 h + livrable", en: "1h + deliverable" },
        price: "490 €",
        value: 490,
        calendlyUrl: `${CALENDLY_BASE}/conseil-de-choix-d-architecture-web-ia`,
      },
    ],
    fr: {
      name: "Architecture de votre projet IA",
      tag: "Cadrage",
      tagline: "Auditer et cadrer l'architecture avant de produire.",
      forWho:
        "Vous avez un projet plus structurant — site, appli, outil métier, automatisation IA — et vous voulez la bonne architecture et des specs claires avant de lancer la production.",
      bullets: [
        "Audit de l'existant et des contraintes du projet",
        "Préconisations : solutions et architecture adaptées au besoin",
        "Visio conseil d'1 heure pour arbitrer les choix",
        "Livrable : cahier des charges et spécifications techniques",
      ],
    },
    en: {
      name: "Your AI project architecture",
      tag: "Scoping",
      tagline: "Audit and scope the architecture before you build.",
      forWho:
        "You have a more structural project — site, app, business tool, AI automation — and want the right architecture and clear specs before starting production.",
      bullets: [
        "Audit of your existing setup and project constraints",
        "Recommendations: solutions and architecture fit to the need",
        "One-hour advisory call to settle the choices",
        "Deliverable: specifications and technical requirements",
      ],
    },
  },
  {
    id: "pack-mise-en-oeuvre-ia",
    tiers: [
      {
        duration: { fr: "2 × 1 h + pack", en: "2 × 1h + pack" },
        price: "1 900 €",
        value: 1900,
        calendlyUrl: `${CALENDLY_BASE}/pack-mise-en-oeuvre-ia`,
      },
    ],
    fr: {
      name: "Pack de mise en œuvre IA",
      tag: "Clés en main",
      tagline: "Tout le nécessaire pour construire le projet avec l'IA.",
      forWho:
        "Vous voulez développer votre projet avec Claude Code ou Codex et repartir avec un pack complet — specs, prompts et agents — prêt à produire.",
      bullets: [
        "Audit et préconisations sur les solutions adaptées au projet",
        "2 visios conseil d'1 heure pour cadrer et affiner",
        "Livrable : cahier des charges et spécifications techniques du projet",
        "Livrable : pack complet de prompts et d'agents (Claude Code ou Codex) prêt au développement",
      ],
    },
    en: {
      name: "AI build pack",
      tag: "Turnkey",
      tagline: "Everything you need to build the project with AI.",
      forWho:
        "You want to develop your project with Claude Code or Codex and leave with a complete pack — specs, prompts and agents — ready to ship.",
      bullets: [
        "Audit and recommendations on the solutions fit to your project",
        "Two one-hour advisory calls to scope and refine",
        "Deliverable: project specifications and technical requirements",
        "Deliverable: complete pack of prompts and agents (Claude Code or Codex) ready for development",
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
      a: "Le choix de techno web tranche rapidement quelle technologie viser. Le conseil architecture cadre un projet plus structurant et vous remet un cahier des charges. Le pack de mise en œuvre y ajoute les prompts et agents pour construire avec l'IA. La direction technique externalisée vous donne un pilotage récurrent, mois après mois.",
    },
    en: {
      q: "Which offer should I choose?",
      a: "The web tech choice call quickly settles which technology to aim for. The architecture advice scopes a more structural project and hands you a specifications document. The build pack adds the prompts and agents to build with AI. The fractional tech direction gives you recurring steering, month after month.",
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
      a: "Seul le choix de techno web (30 min) est crédité : 100 % sur un projet signé sous 30 jours. Le conseil architecture, le pack de mise en œuvre et la direction technique externalisée sont des livrables à part entière — leur valeur est dans le rendu, pas dans un remboursement.",
    },
    en: {
      q: "Is the amount credited if a project follows?",
      a: "Only the web tech choice call (30 min) is credited: 100% on a project signed within 30 days. The architecture advice, the build pack and the fractional tech direction are standalone deliverables — their value is in the output, not in a refund.",
    },
  },
];
