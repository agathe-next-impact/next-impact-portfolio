import {
  CTO_COMMITMENT,
  CTO_PATH,
  CTO_PRICE,
  CTO_PRICE_VALUE,
  CTO_TIERS,
} from "@/lib/cto-externalise";

export const CREDIT_WINDOW_DAYS = 30;
export const CALENDLY_BASE = "https://calendly.com/agathe-next-impact";

/**
 * `CTO_PRICE.*.amount` ouvre une phrase sur /cto-externalise, donc il porte une
 * majuscule (« À partir de 900 € HT », « From €900 excl. VAT »). Repris ICI en
 * milieu de phrase, il doit être décapitalisé : le texte visible de la FAQ et le
 * FAQPage sont la même chaîne, une majuscule parasite partirait dans le schéma.
 * Décapitalise le premier caractère seulement, pour préserver « HT » et « VAT ».
 */
const lowerFirst = (value: string) => value.charAt(0).toLowerCase() + value.slice(1);

// Catalogue conseil — aligné sur DIRECTIVES-CHARTE-EDITORIALE.md §1 : les TROIS
// lignes Conseil du catalogue de référence, dans l'ordre d'engagement croissant
// (visio ponctuelle, audit ponctuel, accompagnement récurrent). Ce module reste
// la seule source des sections d'offre de /conseil : ni pack, ni « sélecteur
// techno » n'y figurent.
//
// Arbitrage du 2026-09-10 (ADR-009), qui remplace celui du 2026-09-07 :
// l'expert technique externalisé est de nouveau PRÉSENTÉ sur /conseil, en
// dernière position, à la place du simple bandeau de renvoi. Il n'y est pas
// VENDU : son CTA part vers sa page dédiée /cto-externalise, qui reste la
// fiche complète (paliers, livrables, périmètre, FAQ) et la destination du
// mega menu. Offre renommée « CTO externalisé » → « Expert technique
// externalisé » le même jour (ADR-010) ; seul le libellé change.
//
// Conséquence : aucun prix ni condition de cette offre n'est réécrit ici. Le
// contenu de la troisième offre dérive de lib/cto-externalise.ts, source de
// vérité unique.

interface OfferCopy {
  name: string;
  tag?: string;
  tagline: string;
  forWho: string;
  bullets: string[];
}

export interface ConseilTier {
  duration: { fr: string; en: string };
  /**
   * Prix affiché, par locale : la place du symbole change d'une langue à
   * l'autre (« 150 € » / « €150 »), et la mention légale qui le suit aussi
   * (HT / excl. VAT, rendue par le composant).
   */
  price: { fr: string; en: string };
  value: number;
  /** Destination du CTA : lien Calendly, ou route interne si `internalCta`. */
  ctaHref: string;
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
  /** Offre récurrente : présentée ici, mais détaillée et vendue sur sa page. */
  recurring?: boolean;
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
        price: { fr: "150 €", en: "€150" },
        value: 150,
        ctaHref: `${CALENDLY_BASE}/conseil-de-choix-de-techno-pour-une-refonte`,
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
        price: { fr: "650 €", en: "€650" },
        value: 650,
        ctaHref: `${CALENDLY_BASE}/conseil-de-choix-d-architecture-web-ia`,
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
  // Troisième ligne Conseil : la seule offre RÉCURRENTE du catalogue. Présentée
  // ici en dernière position (ordre d'engagement croissant), détaillée sur
  // /cto-externalise où partent son CTA et l'item du mega menu. Prix, paliers et
  // engagement sont importés, jamais recopiés : lib/cto-externalise.ts fait foi.
  {
    id: "cto-externalise",
    recurring: true,
    internalCta: true,
    cta: { fr: "Voir l'offre complète", en: "See the full offer" },
    tiers: [
      {
        duration: { fr: "par mois", en: "per month" },
        price: { fr: `${CTO_PRICE_VALUE} €`, en: `€${CTO_PRICE_VALUE}` },
        value: CTO_PRICE_VALUE,
        ctaHref: CTO_PATH,
        pricePrefix: { fr: "à partir de", en: "from" },
      },
    ],
    fr: {
      name: "Expert technique externalisé",
      tag: "Accompagnement récurrent",
      tagline:
        "Une direction technique à temps partagé, quelques jours par mois, sans recruter.",
      forWho:
        "Les décisions techniques reviennent tous les mois : un devis à relire, une fin de support qui tombe, un prestataire à cadrer. Un avis ponctuel se rachèterait à chaque fois.",
      bullets: [
        `Deux paliers : ${CTO_TIERS[0].name.fr} ${CTO_TIERS[0].priceLabel.fr} par mois, ${CTO_TIERS[1].name.fr} ${CTO_TIERS[1].priceLabel.fr} par mois`,
        "Un comité technique par mois, des arbitrages écrits sous 24 à 48 h",
        "Vos devis relus, vos prestataires pilotés, votre roadmap tenue à jour",
        "Vos livrables dans un espace en ligne : cartographie du système, décisions datées, budget à trois ans",
        `${CTO_COMMITMENT.fr}.`,
      ],
    },
    en: {
      name: "Outsourced technical expert",
      tag: "Ongoing retainer",
      tagline:
        "Technical direction on shared time, a few days a month, without hiring.",
      forWho:
        "Technical decisions come up every month: a quote to review, an end-of-support date landing, a vendor to scope. A one-off opinion would have to be bought again each time.",
      bullets: [
        `Two tiers: ${CTO_TIERS[0].name.en} ${CTO_TIERS[0].priceLabel.en} a month, ${CTO_TIERS[1].name.en} ${CTO_TIERS[1].priceLabel.en} a month`,
        "One technical steering committee a month, decisions in writing within 24 to 48h",
        "Your quotes reviewed, your vendors steered, your roadmap kept up to date",
        "Your deliverables in an online workspace: system map, dated decisions, three-year budget",
        `${CTO_COMMITMENT.en}.`,
      ],
    },
  },
];

/** Prix affiché d'une offre du catalogue Conseil, dans la locale demandée. */
const priceOf = (id: string, locale: "fr" | "en") =>
  OFFERS.find((offer) => offer.id === id)?.tiers[0]?.price[locale] ?? "";

/**
 * Bloc « En bref » (TL;DR) de /conseil : résumé autoportant, cible de citation
 * pour les moteurs de réponse (GEO). Même gabarit que la home, /a-propos et
 * /cto-externalise : chaque ligne doit pouvoir être citée seule, sans le reste
 * de la page.
 *
 * Source unique du rendu visible : rien n'est réécrit ailleurs. Les prix sont
 * dérivés d'OFFERS et de lib/cto-externalise.ts, jamais recopiés, pour qu'un
 * changement de tarif ne laisse pas un résumé périmé derrière lui.
 *
 * La quatrième ligne PRÉSENTE l'offre récurrente et renvoie à sa page (ADR-009) :
 * elle ne la vend pas, et n'ouvre pas la page.
 */
export const CONSEIL_TLDR: {
  label: { fr: string; en: string };
  lines: { fr: string; en: string }[];
} = {
  label: { fr: "En bref", en: "In short" },
  lines: [
    {
      fr: "Trois offres de conseil avant une refonte, dans l'ordre d'engagement croissant : un avis tranché en une heure, un audit documenté, puis une direction technique récurrente.",
      en: "Three advisory offers before a redesign, in order of increasing commitment: a clear-cut opinion in one hour, a documented audit, then ongoing technical direction.",
    },
    {
      fr: `Visio conseil refonte, ${priceOf("choix-techno-ia", "fr")} HT : une heure en visio, un avis écrit sous 48 h, rester, découpler ou refonder. Déduite à 100 % du devis si un projet démarre sous ${CREDIT_WINDOW_DAYS} jours.`,
      en: `Redesign advisory call, ${priceOf("choix-techno-ia", "en")} excl. VAT: one hour on a call, a written opinion within 48h, stay, decouple or rebuild. Fully deducted from the quote if a project starts within ${CREDIT_WINDOW_DAYS} days.`,
    },
    {
      fr: `Audit + roadmap, ${priceOf("architecture-projet-ia", "fr")} HT : rapport d'audit (performance, sécurité, dette technique, plugins, hébergement), préconisations chiffrées et roadmap par étapes, exploitables même si la refonte est confiée à quelqu'un d'autre.`,
      en: `Audit + roadmap, ${priceOf("architecture-projet-ia", "en")} excl. VAT: audit report (performance, security, technical debt, plugins, hosting), costed recommendations and a step-by-step roadmap, usable even if the redesign goes to someone else.`,
    },
    {
      fr: `Expert technique externalisé, ${lowerFirst(CTO_PRICE.fr.amount)} ${CTO_PRICE.fr.period} : la seule offre récurrente, pour les décisions techniques qui reviennent tous les mois. Elle est présentée ici et détaillée sur sa page dédiée ; tout accompagnement démarre par l'audit + roadmap.`,
      en: `Outsourced technical expert, ${lowerFirst(CTO_PRICE.en.amount)} ${CTO_PRICE.en.period}: the only recurring line, for technical decisions that come up every month. It is presented here and detailed on its own page; every retainer starts with the audit + roadmap.`,
    },
  ],
};

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
      q: "Le conseil inclut-il de la correction technique ?",
      a: "Non. Le conseil aide à décider, prioriser et réduire le risque. Les corrections et la refonte relèvent des trois trajectoires de développement : consolider, découpler ou refonder.",
    },
    en: {
      q: "Does advice include technical fixes?",
      a: "No. Advice helps decide, prioritize and reduce risk. Fixes and the redesign itself belong to the three development trajectories: consolidate, decouple or rebuild.",
    },
  },
  {
    // Question miroir de celle de /cto-externalise (« Je préfère un avis
    // ponctuel »). Intentions distinctes, donc pas de cannibalisation : ici le
    // lecteur part du ponctuel et découvre le récurrent, là-bas l'inverse.
    fr: {
      q: "Et si les décisions techniques reviennent tous les mois ?",
      a: `Alors un avis ponctuel n'est pas le bon format : vous en rachèteriez un tous les mois. C'est le rôle de l'expert technique externalisé, présenté plus haut : une direction technique à temps partagé, ${lowerFirst(CTO_PRICE.fr.amount)} ${CTO_PRICE.fr.period}, avec un comité de pilotage mensuel, vos devis relus et une roadmap tenue à jour. Le détail des deux paliers, des livrables et du périmètre est sur sa page dédiée. La visio conseil et l'audit restent les bons points d'entrée si une seule décision est à trancher.`,
    },
    en: {
      q: "What if technical decisions come up every month?",
      a: `Then a one-off opinion is the wrong format: you would buy one every month. That is what the outsourced technical expert is for, shown above: technical direction on shared time, ${lowerFirst(CTO_PRICE.en.amount)} ${CTO_PRICE.en.period}, with a monthly steering committee, your quotes reviewed and a roadmap kept up to date. The detail of the two tiers, the deliverables and the scope lives on its own page. The advisory call and the audit remain the right entry points when a single decision has to be settled.`,
    },
  },
  {
    // Questions de logistique ajoutées à la passe SEO/GEO : ce sont des
    // formulations de prospect (People Also Ask) dont la réponse est déjà
    // affichée sur la page, en § 03 (bandeau de réassurance) et en § 07
    // (« Comment ça marche »). Rien d'inventé : la FAQ ne fait que rendre
    // citable ce que la page dit déjà.
    fr: {
      q: "Comment se réserve la visio conseil, et peut-on la reporter ?",
      a: "La réservation et le paiement se font en ligne, avec confirmation immédiate. La visio se tient en vrai partage d'écran, pas par chat. Vous pouvez la reporter ou l'annuler jusqu'à 24 h avant.",
    },
    en: {
      q: "How do I book the advisory call, and can I reschedule it?",
      a: "Booking and payment happen online, with immediate confirmation. The call is a real video call with screen sharing, not a chat. You can reschedule or cancel it up to 24h beforehand.",
    },
  },
  {
    fr: {
      q: "Que faut-il préparer avant la visio ou l'audit ?",
      a: "Envoyez le contexte à l'avance : l'adresse du site, le devis ou la proposition en cours, et vos notes de projet s'il y en a. Cela sert à préparer les bonnes questions et à consacrer l'heure à la décision plutôt qu'à la découverte.",
    },
    en: {
      q: "What should I prepare before the call or the audit?",
      a: "Send the context ahead of time: the site address, the quote or proposal on the table, and your project notes if you have any. It is what makes the questions relevant, and keeps the hour focused on the decision rather than on discovery.",
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
