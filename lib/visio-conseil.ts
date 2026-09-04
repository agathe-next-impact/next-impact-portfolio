export const CREDIT_WINDOW_DAYS = 30;
export const CALENDLY_BASE = "https://calendly.com/agathe-next-impact";

// Catalogue conseil — deux portes d'entrée ponctuelles (visio conseil 150 €,
// audit + roadmap 650 €, libellés et prix du catalogue de référence de la
// charte §1) et une troisième offre récurrente ajoutée sur directive d'Agathe :
// le CTO externalisé (à partir de 490 €/mois), pour un besoin technique dans la
// durée. Elle prolonge le pivot « bras droit IA » (cadrage v3.1, accompagnement
// récurrent).

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
  /** Masque le suffixe « HT » quand le prix n'est pas un montant (ex. « Sur devis »). */
  noHt?: boolean;
  /** Préfixe discret devant le prix (ex. « à partir de » pour un plancher tarifaire). */
  pricePrefix?: { fr: string; en: string };
}

export interface ConseilOffer {
  id: string;
  featured?: boolean;
  /** Seule offre déduite du devis projet (aujourd'hui : la visio conseil refonte). */
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
      name: "Visio conseil refonte",
      tag: "Avis tranché",
      tagline: "Rester, découpler ou refonder : un avis tranché en une heure.",
      forWho:
        "Votre site vieillit et vous hésitez sur la trajectoire. Le coût d'une mauvaise direction se compte en mois ; celui de l'avis, en euros.",
      bullets: [
        "Une heure en visio : analyse de l'existant et recueil du besoin",
        "Un avis écrit envoyé dans les 48 h : rester, découpler ou refonder, et pourquoi",
        "Points de vigilance : maintenance, coût, dépendance, référencement",
        "100 % déduit du devis si un projet démarre sous 30 jours",
      ],
    },
    en: {
      name: "Redesign advisory call",
      tag: "Clear-cut advice",
      tagline: "Stay, decouple or rebuild: a clear-cut opinion in one hour.",
      forWho:
        "Your site is aging and you hesitate on the trajectory. The cost of a wrong direction is counted in months; the cost of the advice, in euros.",
      bullets: [
        "One hour on a call: review of your existing site and needs",
        "A written opinion sent within 48h: stay, decouple or rebuild, and why",
        "Watch points: maintenance, cost, lock-in, search visibility",
        "100% deducted from the quote if a project starts within 30 days",
      ],
    },
  },
  {
    id: "architecture-projet-ia",
    tiers: [
      {
        duration: { fr: "livrables", en: "deliverables" },
        price: "650 €",
        value: 650,
        calendlyUrl: `${CALENDLY_BASE}/conseil-de-choix-d-architecture-web-ia`,
      },
    ],
    fr: {
      name: "Audit + roadmap",
      tag: "Livrables",
      tagline: "L'état des lieux complet et la feuille de route, par écrit.",
      forWho:
        "Vous préparez une décision qui engage un budget : vous voulez un état des lieux vérifiable et un plan par étapes avant de signer quoi que ce soit.",
      bullets: [
        "Rapport d'audit : performance, sécurité, dette technique, plugins, hébergement",
        "Préconisations chiffrées : quelle trajectoire, pour quel budget",
        "Roadmap par étapes, priorisée",
        "Le document vous sert même si la prestation est confiée à quelqu'un d'autre",
      ],
    },
    en: {
      name: "Audit + roadmap",
      tag: "Deliverables",
      tagline: "The complete assessment and the roadmap, in writing.",
      forWho:
        "You are preparing a decision that commits a budget: you want a verifiable assessment and a step-by-step plan before signing anything.",
      bullets: [
        "Audit report: performance, security, technical debt, plugins, hosting",
        "Costed recommendations: which trajectory, for which budget",
        "Step-by-step, prioritized roadmap",
        "The document serves you even if the work goes to someone else",
      ],
    },
  },
  {
    id: "cto-externalise",
    internalCta: true,
    cta: { fr: "Discutons de votre besoin", en: "Let's talk about your need" },
    tiers: [
      {
        duration: { fr: "mission récurrente", en: "ongoing engagement" },
        price: "490 €/mois",
        value: 490,
        calendlyUrl: "/contact?sujet=cto-externalise",
        pricePrefix: { fr: "à partir de", en: "from" },
      },
    ],
    fr: {
      name: "CTO externalisé",
      tag: "Sur la durée",
      tagline: "Un décideur technique à vos côtés, sans recruter.",
      forWho:
        "Vous pilotez un site, des outils et des projets IA sans profil technique en interne. Vous voulez quelqu'un qui arbitre, cadre les prestataires et sécurise vos choix, mois après mois.",
      bullets: [
        "Arbitrage des choix techniques : refonte, hébergement, prestataires, dette technique",
        "Cadrage et suivi de vos prestataires : vous décidez, je traduis le technique en décisions",
        "Point récurrent : feuille de route, priorités, budgets, risques",
        "Engagement souple, sans recrutement : vous ajustez le volume selon vos projets",
      ],
    },
    en: {
      name: "Fractional CTO",
      tag: "Ongoing",
      tagline: "A technical decision-maker by your side, without hiring.",
      forWho:
        "You run a site, tools and AI projects with no technical profile in-house. You want someone who arbitrates, frames your vendors and secures your choices, month after month.",
      bullets: [
        "Arbitration of technical choices: redesign, hosting, vendors, technical debt",
        "Framing and follow-up of your vendors: you decide, I translate the technical into decisions",
        "Recurring check-in: roadmap, priorities, budgets, risks",
        "Flexible engagement, no hiring: you adjust the volume to your projects",
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
      q: "Visio à 150 € ou audit à 650 € : lequel choisir ?",
      a: "La visio tranche une direction en une heure : rester, découpler ou refonder, avec un avis écrit sous 48 h. L'audit + roadmap va au fond : rapport d'audit, préconisations chiffrées et plan par étapes, remis en livrables. Si vous hésitez encore sur la trajectoire, commencez par la visio ; si la décision engage un budget, l'audit la sécurise.",
    },
    en: {
      q: "€150 call or €650 audit: which one should I pick?",
      a: "The call settles a direction in one hour: stay, decouple or rebuild, with a written opinion within 48h. The audit + roadmap goes deeper: audit report, costed recommendations and a step-by-step plan, handed over as deliverables. If you are still weighing the trajectory, start with the call; if the decision commits a budget, the audit secures it.",
    },
  },
  {
    fr: {
      q: "Pourquoi payer un avis avant un projet ?",
      a: "Parce que le coût d'une mauvaise trajectoire se compte en mois : une refonte à refaire, une dépendance à un prestataire, un référencement perdu. L'avis coûte 150 €, il est indépendant, et il est déduit du devis si un projet suit.",
    },
    en: {
      q: "Why pay for advice before a project?",
      a: "Because the cost of a wrong trajectory is counted in months: a redesign to redo, dependency on a vendor, lost search visibility. The advice costs €150, it is independent, and it is deducted from the quote if a project follows.",
    },
  },
  {
    fr: {
      q: "L'audit sert-il si je confie la refonte à quelqu'un d'autre ?",
      a: "Oui, c'est son rôle : le rapport d'audit, les préconisations et la roadmap sont rédigés pour être exploitables par n'importe quel prestataire. Il rend aussi les devis comparables entre eux.",
    },
    en: {
      q: "Is the audit useful if someone else does the redesign?",
      a: "Yes, that is its purpose: the audit report, recommendations and roadmap are written to be usable by any vendor. It also makes quotes comparable with each other.",
    },
  },
  {
    fr: {
      q: "Et si mon besoin technique est récurrent, pas ponctuel ?",
      a: "C'est le rôle du CTO externalisé : un décideur technique à vos côtés dans la durée, qui arbitre vos choix, cadre vos prestataires et tient votre feuille de route, sans recrutement. À partir de 490 €/mois selon le volume. La visio et l'audit tranchent une décision ; le CTO externalisé vous accompagne mois après mois.",
    },
    en: {
      q: "What if my technical need is recurring, not one-off?",
      a: "That is the role of the fractional CTO: a technical decision-maker by your side over time, who arbitrates your choices, frames your vendors and keeps your roadmap, without hiring. From €490/month depending on volume. The call and the audit settle a decision; the fractional CTO supports you month after month.",
    },
  },
  {
    fr: {
      q: "Le conseil inclut-il de la correction technique ?",
      a: "Non. Le conseil aide à décider, prioriser et réduire le risque. Les corrections et la refonte relèvent des trois trajectoires de développement : consolider, découpler ou refonder.",
    },
    en: {
      q: "Does advice include technical fixes?",
      a: "No. Advice helps decide, prioritize and reduce risk. Fixes and the redesign itself belong to the three development trajectories: consolidate, decouple or rebuild.",
    },
  },
  {
    fr: {
      q: "Le montant est-il déduit si un projet suit ?",
      a: "La visio conseil refonte (150 €) est déduite à 100 % du devis si un projet démarre sous 30 jours. L'audit + roadmap est une prestation à part entière : sa valeur est dans les livrables, pas dans un remboursement.",
    },
    en: {
      q: "Is the amount deducted if a project follows?",
      a: "The redesign advisory call (€150) is fully deducted from the quote if a project starts within 30 days. The audit + roadmap is a standalone service: its value lies in the deliverables, not in a refund.",
    },
  },
];
