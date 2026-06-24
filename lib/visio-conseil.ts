// Offre « Visio conseil » — appels de conseil payants à la demande, sans
// abonnement. Jumelle stratégique du dépannage WordPress : même mécanique
// (formulaire → mail → créneau proposé + lien de paiement si validé), besoin
// différent — non pas « réparer » mais « décider ».
//
// DEUX conseils distincts, deux audiences :
//   1. Conseil WordPress — opérationnel. Pour qui a DÉJÀ un site WordPress et se
//      perd dans les thèmes/extensions.
//   2. Conseil choix de techno — stratégique. Pour qui DÉMARRE un projet (créa
//      ou refonte) et doit choisir la base technique.
//
// Doctrine : on PROUVE avant de DEMANDER. L'audit gratuit (/audit-site-web)
// reste la porte FROIDE ; la visio est l'étage TIÈDE au-dessus, jamais un CTA
// froid ni un titre en tête de héros. Levier clé qui dissout la peur de payer
// un inconnu : le prix de la visio est DÉDUIT du devis si un projet est signé
// ensuite — payer ne fait jamais perdre d'argent.
//
// ⚠️ Valeurs commerciales placeholder à valider par Agathe (durées, prix,
// fenêtre de déduction 30 j), au même titre que les pages partenaires.

/** Fenêtre pendant laquelle le prix de la visio est déduit du devis projet. */
export const CREDIT_WINDOW_DAYS = 30;

/** Page Calendly d'Agathe (liste les deux events). Réservation + paiement en ligne. */
export const CALENDLY_BASE = "https://calendly.com/agathe-next-impact";

interface OfferCopy {
  name: string;
  tag?: string;
  tagline: string;
  forWho: string;
  bullets: string[];
}

/** Un palier de durée d'un conseil (réservation + paiement Calendly à la résa). */
export interface ConseilTier {
  duration: { fr: string; en: string };
  price: string; // montant affiché, ex. « 90 € »
  value: number; // valeur numérique (données structurées)
  calendlyUrl: string;
  featured?: boolean;
  /** Bonus propre au palier, ex. rapport d'audit pour le 60 min. */
  note?: { fr: string; en: string };
}

export interface ConseilOffer {
  id: string;
  featured?: boolean;
  /** Un seul palier = offre simple ; plusieurs = choix de durée. */
  tiers: ConseilTier[];
  fr: OfferCopy;
  en: OfferCopy;
}

/** Les deux conseils — un par décision, prix et durée fixes, livrable écrit. */
export const OFFERS: ConseilOffer[] = [
  {
    id: "conseil-wordpress",
    tiers: [
      {
        duration: { fr: "45 min", en: "45 min" },
        price: "100 €",
        value: 100,
        calendlyUrl: `${CALENDLY_BASE}/conseil-wordpress-theme-plugins`,
      },
    ],
    fr: {
      name: "Conseil WordPress",
      tagline: "Thèmes & extensions : faites les bons choix.",
      forWho:
        "Vous gérez déjà un site WordPress et vous vous perdez dans la jungle des thèmes et des extensions.",
      bullets: [
        "Quel thème ou page builder choisir — ou garder",
        "Quelles extensions installer, et surtout lesquelles supprimer",
        "Repérer les plugins qui ralentissent ou fragilisent votre site",
        "Bien utiliser ce que vous avez déjà, sans rien casser",
      ],
    },
    en: {
      name: "WordPress advice",
      tagline: "Themes & plugins: make the right calls.",
      forWho:
        "You already run a WordPress site and you're lost in the jungle of themes and plugins.",
      bullets: [
        "Which theme or page builder to choose — or keep",
        "Which plugins to install, and above all which to remove",
        "Spot the plugins slowing down or weakening your site",
        "Get the most out of what you already have, without breaking anything",
      ],
    },
  },
  {
    id: "conseil-techno",
    featured: true,
    // Variantes par DURÉE — prix et mapping slug↔durée confirmés par Agathe :
    // 30 min = `conseil-quelle-techno-web`, 45 min = `…-clone`, 60 min = `…-clone-1`
    // (ce dernier inclut un retour écrit : rapport d'audit + préconisations).
    tiers: [
      {
        duration: { fr: "30 min", en: "30 min" },
        price: "90 €",
        value: 90,
        calendlyUrl: `${CALENDLY_BASE}/conseil-quelle-techno-web`,
      },
      {
        duration: { fr: "45 min", en: "45 min" },
        price: "120 €",
        value: 120,
        calendlyUrl: `${CALENDLY_BASE}/conseil-de-choix-de-techno-pour-un-projet-web-clone`,
      },
      {
        duration: { fr: "60 min", en: "60 min" },
        price: "220 €",
        value: 220,
        calendlyUrl: `${CALENDLY_BASE}/conseil-de-choix-de-techno-pour-un-projet-web-clone-1`,
        featured: true,
        note: {
          fr: "Inclut un retour écrit : rapport d'audit + préconisations",
          en: "Includes written feedback: audit report + recommendations",
        },
      },
    ],
    fr: {
      name: "Conseil choix de techno",
      tag: "Recommandé",
      tagline: "Quelle techno pour votre projet web ?",
      forWho:
        "Vous avez un projet de création ou de refonte et vous devez choisir la bonne base technique avant de construire.",
      bullets: [
        "WordPress classique, Headless ou web app sur-mesure : la voie adaptée",
        "Arbitrage selon votre budget, votre volumétrie, le SEO et l'autonomie voulue",
        "Challenger un devis d'agence avant de signer",
        "Cadrer le projet : ce qui est vraiment nécessaire, et ce qui ne l'est pas",
      ],
    },
    en: {
      name: "Tech stack advice",
      tag: "Recommended",
      tagline: "Which technology for your web project?",
      forWho:
        "You have a new build or a redesign coming and you need to pick the right technical foundation before building.",
      bullets: [
        "Classic WordPress, Headless or custom web app: the right path",
        "Trade-offs by budget, volume, SEO and the autonomy you want",
        "Challenge an agency quote before signing",
        "Scope the project: what's truly needed, and what isn't",
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
      q: "Quelle est la différence entre les deux conseils ?",
      a: "Le Conseil WordPress est opérationnel : vous avez déjà un site WordPress et vous voulez les bons thèmes et extensions, bien utilisés. Le Conseil choix de techno est stratégique : vous avez un projet et vous devez choisir la base technique avant de construire. Si vous hésitez, dites-le dans le formulaire, je vous oriente.",
    },
    en: {
      q: "What's the difference between the two?",
      a: "WordPress advice is operational: you already run a WordPress site and want the right themes and plugins, well used. Tech stack advice is strategic: you have a project and need to choose the technical foundation before building. Not sure? Say so in the form and I'll point you the right way.",
    },
  },
  {
    fr: {
      q: "Pourquoi un appel payant alors que l'audit est gratuit ?",
      a: "L'audit gratuit vous donne un premier diagnostic automatisé. La visio, c'est mon temps d'experte sur VOTRE décision : analyse en direct, réponses sur-mesure, compte-rendu écrit. Et son prix est déduit du devis si on travaille ensemble — vous ne perdez rien.",
    },
    en: {
      q: "Why a paid call when the audit is free?",
      a: "The free audit gives you a first automated diagnosis. The call is my expert time on YOUR decision: live analysis, tailored answers, a written recap. And its price is credited to your quote if we work together — you lose nothing.",
    },
  },
  {
    fr: {
      q: "Le prix est-il vraiment déduit du devis ?",
      a: "Oui. Si vous lancez un projet dans les 30 jours suivant la visio, son montant est déduit de votre devis. Soit vous repartez avec une recommandation actionnable, soit avec une remise sur le projet.",
    },
    en: {
      q: "Is the price really credited to the quote?",
      a: "Yes. If you start a project within 30 days of the call, its amount is deducted from your quote. Either you leave with an actionable recommendation, or with a discount on the project.",
    },
  },
  {
    fr: {
      q: "Comment se passe la réservation et le paiement ?",
      a: "Vous choisissez votre créneau directement dans le calendrier en ligne et réglez la visio à la réservation (paiement sécurisé). Vous recevez aussitôt la confirmation et le lien de visioconférence — rien à attendre.",
    },
    en: {
      q: "How do booking and payment work?",
      a: "You pick your slot directly in the online calendar and pay for the call at booking (secure payment). You instantly receive the confirmation and the video link — no waiting.",
    },
  },
  {
    fr: {
      q: "Comment se déroule l'appel ?",
      a: "45 min à 1h en visio, partage d'écran, analyse en direct de votre site ou de votre projet. Pas de blabla commercial : des réponses concrètes. Vous recevez ensuite un compte-rendu écrit avec ma recommandation et les prochaines étapes — chiffrées quand c'est pertinent.",
    },
    en: {
      q: "How does the call go?",
      a: "45 min to 1h over video, screen sharing, live analysis of your site or project. No sales pitch: concrete answers. You then receive a written recap with my recommendation and next steps — costed when relevant.",
    },
  },
  {
    fr: {
      q: "C'est pour qui ?",
      a: "Pour celui qui gère un WordPress et veut y voir clair dans ses thèmes et extensions, et pour celui qui démarre un projet web et doit choisir sa techno — ou veut un avis avant de signer chez une agence.",
    },
    en: {
      q: "Who is it for?",
      a: "For whoever runs a WordPress site and wants clarity on themes and plugins, and for whoever is starting a web project and must choose their tech — or wants a second opinion before signing with an agency.",
    },
  },
];
