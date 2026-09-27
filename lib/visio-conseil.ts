import { CTO_PRICE } from "@/lib/cto-externalise";
import { TRAJECTOIRES, TRAJECTOIRE_ORDER, type Lang } from "@/lib/trajectoires";

/**
 * Les trois prestations sous leur seul nom, lu dans lib/trajectoires.ts (charte
 * v1.6, ADR-014) : « Optimisation, Refonte ou Évolution ».
 */
const prestations = (lang: Lang) => {
  const names = TRAJECTOIRE_ORDER.map((slug) => TRAJECTOIRES[slug].name[lang]);
  return `${names.slice(0, -1).join(", ")} ${lang === "en" ? "or" : "ou"} ${names.at(-1)}`;
};

export const CALENDLY_BASE = "https://calendly.com/agathe-next-impact";

/**
 * L'échange de 15 minutes, gratuit (ADR-023) : première offre du moment
 * « Diagnostiquer », à la place de la visio conseil refonte payante. C'est
 * aussi la destination du bouton chaud « Discutons de votre projet », partout
 * sur le site (voir CTA_CHAUD). Lien Calendly fourni par Agathe le 2026-09-27 :
 * c'est la seule occurrence dans le code de la vitrine.
 */
export const ECHANGE_URL = `${CALENDLY_BASE}/prise-de-contact-conseil`;
export const ECHANGE_NAME = { fr: "Échange de 15 minutes", en: "15-minute call" } as const;

/**
 * Le bouton chaud du site (charte §7) : libellé fixe, il réserve l'échange de
 * 15 minutes. Lien externe : balise <a>, jamais le Link i18n.
 */
export const CTA_CHAUD = {
  href: ECHANGE_URL,
  label: { fr: "Discutons de votre projet", en: "Let's talk about your project" },
} as const;

/**
 * Le premier bouton (plein) de chaque héros (demande du 2026-09-27) :
 * l'échange gratuit, sur Calendly, ouvert dans un nouvel onglet. L'analyse du
 * site (`/scan`) passe en second bouton, en filet.
 */
export const CTA_ECHANGE = {
  href: ECHANGE_URL,
  label: { fr: "Échange gratuit de 15 min", en: "Free 15-min call" },
} as const;

/**
 * `CTO_PRICE.*.amount` ouvre une phrase sur /cto-externalise, donc il porte une
 * majuscule (« À partir de 900 € HT », « From €900 excl. VAT »). Repris ICI en
 * milieu de phrase, il doit être décapitalisé : le texte visible de la FAQ et le
 * FAQPage sont la même chaîne, une majuscule parasite partirait dans le schéma.
 * Décapitalise le premier caractère seulement, pour préserver « HT » et « VAT ».
 */
const lowerFirst = (value: string) => value.charAt(0).toLowerCase() + value.slice(1);

// Catalogue du moment « Diagnostiquer », aligné sur
// DIRECTIVES-CHARTE-EDITORIALE.md §1 (v1.7) : les DEUX offres du moment, dans
// l'ordre d'engagement croissant (échange de 15 minutes gratuit, puis audit +
// roadmap). L'échange remplace la visio conseil refonte payante (ADR-023). Ce module reste
// la seule source des sections d'offre de /conseil : ni pack, ni « sélecteur
// techno » n'y figurent.
//
// Arbitrage du 2026-09-27 (ADR-013), qui revient sur l'ADR-009 : l'expert
// technique externalisé ne vit plus que dans le moment « Gérer ». /conseil n'en
// porte plus de section d'offre : un bandeau de renvoi (CtoExternaliseBanner)
// suffit, plus une ligne de « L'essentiel » et une question de la FAQ. Son prix
// n'est jamais réécrit ici : il est lu dans lib/cto-externalise.ts.
//
// Les identifiants `choix-techno-ia` et `architecture-projet-ia` sont des
// ancres en circulation (menu, llms, e-mails) : ils ne changent pas.

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
  /** Offre déduite du devis projet (aucune depuis l'ADR-022). */
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
    // Identifiant conservé : ancre en circulation (menu, llms, e-mails).
    id: "choix-techno-ia",
    featured: true,
    cta: { fr: "Réserver l'échange", en: "Book the call" },
    tiers: [
      {
        duration: { fr: "15 min", en: "15 min" },
        price: { fr: "Gratuit", en: "Free" },
        value: 0,
        noHt: true,
        ctaHref: ECHANGE_URL,
      },
    ],
    fr: {
      name: ECHANGE_NAME.fr,
      tag: "Gratuit",
      tagline: "Quinze minutes pour poser votre situation et savoir par où commencer.",
      forWho:
        "Votre site vieillit, un devis est sur la table ou une décision vous attend, et vous voulez en parler avant d'engager quoi que ce soit.",
      bullets: [
        "15 minutes en visio, à la date qui vous convient",
        "Vous exposez votre situation, je vous dis par où commencer : l'analyse du site, l'audit + roadmap ou directement un devis",
        "Sans engagement et sans paiement",
      ],
    },
    en: {
      name: ECHANGE_NAME.en,
      tag: "Free",
      tagline: "Fifteen minutes to lay out your situation and know where to start.",
      forWho:
        "Your site is aging, a quote is on the table or a decision is waiting, and you want to talk it through before committing to anything.",
      bullets: [
        "15 minutes on a video call, at a time that suits you",
        "You lay out your situation, I tell you where to start: the site analysis, the audit + roadmap or a quote straight away",
        "No commitment, no payment",
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
        "Première analyse de veille technique et stratégique : ce qui bouge autour de votre site, et ce que ça change pour la suite",
        "Préconisations chiffrées : quelle direction, pour quel budget",
        "Roadmap par étapes, priorisée",
        "1 h de restitution en visio : les conclusions présentées, vos questions, les priorités arbitrées ensemble",
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
        "First technical and strategic watch analysis: what is moving around your site, and what it changes for what comes next",
        "Costed recommendations: which direction, for which budget",
        "Step-by-step, prioritized roadmap",
        "A 1-hour debrief by video call: the findings presented, your questions, the priorities settled together",
        "The document serves you even if the work goes to someone else",
      ],
    },
  },
];

/** Prix affiché d'une offre du catalogue Conseil, dans la locale demandée. */
const priceOf = (id: string, locale: "fr" | "en") =>
  OFFERS.find((offer) => offer.id === id)?.tiers[0]?.price[locale] ?? "";

/**
 * Cartouche « L'essentiel » (TL;DR, ADR-024) de /conseil : résumé autoportant, cible de citation
 * pour les moteurs de réponse (GEO). Même gabarit que la home, /a-propos et
 * /cto-externalise : chaque ligne doit pouvoir être citée seule, sans le reste
 * de la page.
 *
 * Source unique du rendu visible : rien n'est réécrit ailleurs. Les prix sont
 * dérivés d'OFFERS et de lib/cto-externalise.ts, jamais recopiés, pour qu'un
 * changement de tarif ne laisse pas un résumé périmé derrière lui.
 *
 * La quatrième ligne RENVOIE vers l'expert technique externalisé (ADR-013) : il
 * n'est plus une offre de cette page, il vit dans le moment « Gérer ».
 */
export const CONSEIL_TLDR: {
  label: { fr: string; en: string };
  lines: { fr: string; en: string }[];
} = {
  label: { fr: "L'essentiel", en: "Key points" },
  lines: [
    {
      fr: "Deux offres avant une refonte, dans l'ordre d'engagement croissant : un échange gratuit de 15 minutes, puis un audit documenté avec sa roadmap.",
      en: "Two offers before a redesign, in order of increasing commitment: a free 15-minute call, then a documented audit with its roadmap.",
    },
    {
      fr: "Échange de 15 minutes, gratuit : vous exposez votre situation, je vous dis par où commencer, sans engagement.",
      en: "15-minute call, free: you lay out your situation, I tell you where to start, no commitment.",
    },
    {
      fr: `Audit + roadmap, ${priceOf("architecture-projet-ia", "fr")} HT : rapport d'audit (performance, sécurité, dette technique, plugins, hébergement), préconisations chiffrées et roadmap par étapes, exploitables même si la refonte est confiée à quelqu'un d'autre.`,
      en: `Audit + roadmap, ${priceOf("architecture-projet-ia", "en")} excl. VAT: audit report (performance, security, technical debt, plugins, hosting), costed recommendations and a step-by-step roadmap, usable even if the redesign goes to someone else.`,
    },
    {
      fr: `Quand les décisions techniques reviennent tous les mois, l'expert technique externalisé prend le relais : une direction technique à temps partagé, ${lowerFirst(CTO_PRICE.fr.amount)} ${CTO_PRICE.fr.period}, présentée sur sa page dédiée. Tout accompagnement démarre par l'audit + roadmap.`,
      en: `When technical decisions come up every month, the outsourced technical expert takes over: technical direction on shared time, ${lowerFirst(CTO_PRICE.en.amount)} ${CTO_PRICE.en.period}, presented on its own page. Every retainer starts with the audit + roadmap.`,
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
      q: "Échange de 15 minutes ou audit : par où commencer ?",
      a: "Par l'échange : il est gratuit et sert à poser la situation. En quinze minutes, je vous dis si l'analyse du site suffit, si la décision mérite un audit + roadmap, ou si l'on peut passer directement au devis. L'audit va au fond : rapport d'audit, préconisations chiffrées et plan par étapes, remis en livrables.",
    },
    en: {
      q: "15-minute call or audit: where should I start?",
      a: "With the call: it is free and lays out the situation. In fifteen minutes, I tell you whether the site analysis is enough, whether the decision deserves an audit + roadmap, or whether we can go straight to a quote. The audit goes deeper: audit report, costed recommendations and a step-by-step plan, handed over as deliverables.",
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
      a: `Non. Le conseil aide à décider, prioriser et réduire le risque. Les corrections et la refonte relèvent des trois prestations de développement : ${prestations("fr")}.`,
    },
    en: {
      q: "Does advice include technical fixes?",
      a: `No. Advice helps decide, prioritize and reduce risk. Fixes and the redesign itself belong to the three development services: ${prestations("en")}.`,
    },
  },
  {
    // Question miroir de celle de /cto-externalise (« Je préfère un avis
    // ponctuel »). Intentions distinctes, donc pas de cannibalisation : ici le
    // lecteur part du ponctuel et découvre le récurrent, là-bas l'inverse.
    fr: {
      q: "Et si les décisions techniques reviennent tous les mois ?",
      a: `Alors un avis ponctuel n'est pas le bon format : vous en rachèteriez un tous les mois. C'est le rôle de l'expert technique externalisé : une direction technique à temps partagé, ${lowerFirst(CTO_PRICE.fr.amount)} ${CTO_PRICE.fr.period}, avec un comité de pilotage mensuel, vos devis relus et une roadmap tenue à jour. Le détail des deux paliers, des livrables et du périmètre est sur sa page dédiée. L'échange de 15 minutes et l'audit restent les bons points d'entrée si une seule décision est à trancher.`,
    },
    en: {
      q: "What if technical decisions come up every month?",
      a: `Then a one-off opinion is the wrong format: you would buy one every month. That is what the outsourced technical expert is for: technical direction on shared time, ${lowerFirst(CTO_PRICE.en.amount)} ${CTO_PRICE.en.period}, with a monthly steering committee, your quotes reviewed and a roadmap kept up to date. The detail of the two tiers, the deliverables and the scope lives on its own page. The 15-minute call and the audit remain the right entry points when a single decision has to be settled.`,
    },
  },
  {
    fr: {
      q: "Comment se réserve l'échange de 15 minutes ?",
      a: "En ligne, avec confirmation immédiate : vous choisissez un créneau, sans paiement. L'échange se tient en visio. Vous pouvez le reporter ou l'annuler à tout moment depuis le lien de confirmation.",
    },
    en: {
      q: "How do I book the 15-minute call?",
      a: "Online, with immediate confirmation: you pick a slot, no payment. The call takes place on video. You can reschedule or cancel it at any time from the confirmation link.",
    },
  },
  {
    fr: {
      q: "Que faut-il préparer avant l'échange ou l'audit ?",
      a: "L'adresse du site, le devis ou la proposition en cours, et vos notes de projet s'il y en a. Les quinze minutes servent alors à la décision plutôt qu'à la découverte.",
    },
    en: {
      q: "What should I prepare before the call or the audit?",
      a: "The site address, the quote or proposal on the table, and your project notes if you have any. The fifteen minutes then go to the decision rather than to discovery.",
    },
  },
];
