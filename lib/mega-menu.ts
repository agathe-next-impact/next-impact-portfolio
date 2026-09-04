import { NEWSLETTER_SUBSTACK_URL } from "@/lib/newsletter";

// ─────────────────────────────────────────────────────────────────────────────
// Données du mega menu — Veille · Conseil · Services.
//
// Chaque entrée de nav (clé = clé de traduction `nav`) ouvre un panneau plein
// largeur (style « Blueprint ») réduit à TROIS cases, une par offre :
//   – /veille    : la newsletter, les ressources, les outils
//   – /conseil   : les trois offres (visio 150 €, audit 650 €, CTO dès 490 €/mois)
//   – /solutions-web : les trois trajectoires (consolider, découpler, refonder)
//
// Bilingue en ligne (fr/en) — même pattern que lib/visio-conseil.ts et
// PricingCards, pour ne pas gonfler messages/*.json.
// ─────────────────────────────────────────────────────────────────────────────

export interface MegaItem {
  label: { fr: string; en: string };
  desc: { fr: string; en: string };
  href: string;
  external?: boolean;
  badge?: { fr: string; en: string };
}

export interface MegaSection {
  /** Clé de traduction `nav` — sert aussi de clé d'état côté header. */
  key: string;
  /** Page d'atterrissage de la rubrique (le libellé de nav reste cliquable). */
  href: string;
  /** Titre de la rubrique (accessibilité / libellé). */
  heading: { fr: string; en: string };
  /** Exactement trois cases, une par offre. */
  items: MegaItem[];
}

export const MEGA_SECTIONS: Record<string, MegaSection> = {
  veille: {
    key: "veille",
    href: "/veille",
    heading: { fr: "Veille techno", en: "Tech watch" },
    items: [
      {
        label: { fr: "La newsletter", en: "The newsletter" },
        desc: {
          fr: "Le marché web & IA : une synthèse par mois, un focus par semaine. Gratuit.",
          en: "The web & AI market: a monthly digest, a weekly focus. Free.",
        },
        href: NEWSLETTER_SUBSTACK_URL,
        external: true,
      },
      {
        label: { fr: "Les ressources", en: "The resources" },
        desc: {
          fr: "Choisir sa techno, être trouvé par l'IA, lire un devis, sans jargon.",
          en: "Choose your tech, get found by AI, read a quote, no jargon.",
        },
        href: "/documentation",
      },
      {
        label: { fr: "Les outils", en: "The tools" },
        desc: {
          fr: "Diagnostiquez votre site en quelques minutes : techno, visibilité, devis.",
          en: "Diagnose your site in minutes: tech, visibility, quote.",
        },
        href: "/outils",
      },
    ],
  },

  conseil: {
    key: "conseil",
    href: "/conseil",
    heading: { fr: "Conseil refonte", en: "Redesign advice" },
    items: [
      {
        label: { fr: "Visio conseil refonte", en: "Redesign advisory call" },
        desc: {
          fr: "Rester, découpler ou refonder : un avis tranché en une heure.",
          en: "Stay, decouple or rebuild: a clear-cut opinion in one hour.",
        },
        href: "/conseil#choix-techno-ia",
        badge: { fr: "150 €", en: "€150" },
      },
      {
        label: { fr: "Audit + roadmap", en: "Audit + roadmap" },
        desc: {
          fr: "L'état des lieux complet et la feuille de route, par écrit.",
          en: "The complete assessment and the roadmap, in writing.",
        },
        href: "/conseil#architecture-projet-ia",
        badge: { fr: "650 €", en: "€650" },
      },
      {
        label: { fr: "CTO externalisé", en: "Fractional CTO" },
        desc: {
          fr: "Un décideur technique à vos côtés, sans recruter.",
          en: "A technical decision-maker by your side, without hiring.",
        },
        href: "/conseil#cto-externalise",
        badge: { fr: "dès 490 €/mois", en: "from €490/mo" },
      },
    ],
  },

  services: {
    key: "services",
    href: "/solutions-web",
    heading: { fr: "Services web", en: "Web services" },
    items: [
      {
        label: { fr: "Vitrine simple", en: "Simple showcase site" },
        desc: {
          fr: "Refonte WordPress optimisée : thème sur-mesure, coût maîtrisé.",
          en: "Optimized WordPress redesign: bespoke theme, controlled cost.",
        },
        href: "/solutions-web#forfait-classique",
        badge: { fr: "dès 2 250 €", en: "from €2,250" },
      },
      {
        label: { fr: "Site complexe", en: "Complex site" },
        desc: {
          fr: "Refonte WordPress headless : back-office conservé, front moderne.",
          en: "Headless WordPress redesign: back office kept, modern front end.",
        },
        href: "/solutions-web#forfait-headless",
        badge: { fr: "dès 4 000 € · Recommandée", en: "from €4,000 · Recommended" },
      },
      {
        label: { fr: "Plateforme et app", en: "Platform & app" },
        desc: {
          fr: "Web app, plateforme ou application mobile sur-mesure.",
          en: "Custom web app, platform or mobile application.",
        },
        href: "/solutions-web#forfait-webapp",
        badge: { fr: "dès 6 500 €", en: "from €6,500" },
      },
    ],
  },
};
