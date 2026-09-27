import { NEWSLETTER_SUBSCRIBE_URL } from "@/lib/newsletter";
import { CTO_PATH, CTO_PRICE_VALUE } from "@/lib/cto-externalise";
import { OFFER_PRICE_LABEL } from "@/lib/sentinelle-offer";
import { MAINTENANCE_PATH, MAINTENANCE_PRICE_SHORT } from "@/lib/maintenance-offer";

// ─────────────────────────────────────────────────────────────────────────────
// Données du mega menu — Décider · Refaire · Tenir (charte v1.4, ADR-012).
//
// Le visiteur ne choisit pas dans un catalogue : il se situe dans un des trois
// moments. Chaque entrée de nav (clé = clé de traduction `nav`) ouvre un
// panneau plein largeur (style « Blueprint ») réduit à TROIS cases :
//   – Décider (/conseil)        : visio, audit + roadmap, puis la veille
//                                 gratuite (on s'informe pour décider). Les
//                                 deux offres ponctuelles pointent vers leur
//                                 SECTION de /conseil (ancres = id des
//                                 sections dans OFFERS, lib/visio-conseil.ts).
//   – Refaire (/solutions-web)  : les trois trajectoires (consolider,
//                                 découpler, refonder). Refonte ou création.
//   – Tenir (/maintenance-wordpress) : les trois abonnements, du plus léger au
//                                 plus engageant : Sentinelle, suivi et
//                                 maintenance, expert technique externalisé.
//                                 Toujours en dernier : offres de fin de
//                                 parcours (charte §5).
//
// Bilingue en ligne (fr/en) — même pattern que lib/visio-conseil.ts et
// PricingCards, pour ne pas gonfler messages/*.json. Les prix viennent de
// leur source unique dans lib/.
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
  decider: {
    key: "decider",
    href: "/conseil",
    heading: { fr: "Décider", en: "Decide" },
    items: [
      {
        label: { fr: "Visio conseil refonte", en: "Redesign advisory call" },
        desc: {
          fr: "Garder, faire évoluer ou refaire : un avis écrit sous 48 h, après une heure en visio.",
          en: "Keep, evolve or rebuild: a written opinion within 48 h, after a one-hour call.",
        },
        href: "/conseil#choix-techno-ia",
        badge: { fr: "150 € HT", en: "€150" },
      },
      {
        label: { fr: "Audit + roadmap", en: "Audit + roadmap" },
        desc: {
          fr: "Rapport, préconisations et roadmap, remis dans votre espace en ligne.",
          en: "Report, recommendations and roadmap, delivered in your online workspace.",
        },
        href: "/conseil#architecture-projet-ia",
        badge: { fr: "650 € HT", en: "€650" },
      },
      {
        label: { fr: "Veille et ressources", en: "Watch and resources" },
        desc: {
          fr: "La lettre gratuite, les ressources et les outils pour décider sans jargon.",
          en: "The free newsletter, resources and tools to decide without jargon.",
        },
        href: "/veille",
        badge: { fr: "Gratuit", en: "Free" },
      },
    ],
  },

  refaire: {
    key: "refaire",
    href: "/solutions-web",
    heading: { fr: "Refaire", en: "Rebuild" },
    items: [
      {
        label: { fr: "Consolider", en: "Consolidate" },
        desc: {
          fr: "Refonte WordPress optimisée : un WordPress assaini et plus rapide.",
          en: "Optimized WordPress redesign: a cleaned-up, faster WordPress.",
        },
        href: "/solutions-web#forfait-classique",
        badge: { fr: "dès 2 250 € HT", en: "from €2,250" },
      },
      {
        label: { fr: "Découpler", en: "Decouple" },
        desc: {
          fr: "Refonte WordPress headless : un site rapide, votre équipe publie comme avant.",
          en: "Headless WordPress redesign: a fast site, your team publishes as before.",
        },
        href: "/solutions-web#forfait-headless",
        badge: { fr: "dès 4 000 € HT · Recommandée", en: "from €4,000 · Recommended" },
      },
      {
        label: { fr: "Refonder", en: "Rebuild" },
        desc: {
          fr: "Web app ou plateforme, quand le site est devenu un outil de travail.",
          en: "Web app or platform, when the site has become a work tool.",
        },
        href: "/solutions-web#forfait-webapp",
        badge: { fr: "dès 6 500 € HT", en: "from €6,500" },
      },
    ],
  },

  tenir: {
    key: "tenir",
    href: MAINTENANCE_PATH,
    heading: { fr: "Tenir", en: "Keep it running" },
    items: [
      {
        label: { fr: "Sentinelle", en: "Sentinelle" },
        desc: {
          fr: "Lettre de veille et alertes sur les composants réellement installés sur votre site.",
          en: "Watch letter and alerts on the components actually installed on your site.",
        },
        href: "/sentinelle",
        badge: { fr: OFFER_PRICE_LABEL, en: "€19/mo" },
      },
      {
        label: { fr: "Suivi et maintenance", en: "Care and maintenance" },
        desc: {
          fr: "Surveillance, sauvegardes, mises à jour vérifiées, rapport chaque mois.",
          en: "Monitoring, backups, checked updates, a report every month.",
        },
        href: MAINTENANCE_PATH,
        badge: MAINTENANCE_PRICE_SHORT,
      },
      {
        label: { fr: "Expert technique externalisé", en: "Outsourced technical expert" },
        desc: {
          fr: "Une direction technique à temps partagé, sans recruter.",
          en: "Shared-time technical leadership, without hiring.",
        },
        href: CTO_PATH,
        badge: { fr: `dès ${CTO_PRICE_VALUE} € HT/mois`, en: `from €${CTO_PRICE_VALUE}/mo` },
      },
    ],
  },
};
