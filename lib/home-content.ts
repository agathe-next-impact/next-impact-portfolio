import type { Locale } from "@/i18n/routing";

// Contenu GEO de la home : bloc « En bref » (TL;DR, format de citation idéal
// pour les LLMs) + FAQ (les cinq questions cibles de la charte éditoriale,
// DIRECTIVES-CHARTE-EDITORIALE.md §6 Home). Convention du repo : module TS
// FR + EN + accesseur. Consommé à la fois par le rendu visible (home-tldr /
// home-faq) et par le JSON-LD (FAQJsonLd dans page.tsx) → une seule source.

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
      "Next Impact refait les sites WordPress qui vieillissent : rapides et modernes, sans tout reconstruire.",
      "Trois trajectoires : consolider (WordPress optimisé, dès 2 250 € HT), découpler (WordPress headless, recommandée, dès 4 000 € HT), refonder (web app, dès 6 500 € HT).",
      "Prix et délai écrits avant de commencer, 6 à 10 semaines, performance mesurée avant et après.",
      "En amont : visio conseil refonte (150 € HT) ou audit + roadmap (650 € HT) ; le diagnostic de site en 2 minutes est gratuit.",
    ],
  },
  faq: {
    kicker: "FAQ",
    title: "Les questions qui se posent",
    items: [
      {
        question: "Mon site WordPress est lent : refonte ou optimisation ?",
        answer:
          "Cela dépend de la cause. Si le problème vient du thème et de l'empilement de plugins, une refonte WordPress optimisée suffit (à partir de 2 250 € HT). Si le site est lent parce que tout passe par WordPress à chaque visite, le découplage headless change la donne (à partir de 4 000 € HT). Le diagnostic en 2 minutes donne une première orientation ; la visio conseil (150 € HT) tranche sur pièces.",
      },
      {
        question: "Qu'est-ce qu'une refonte headless, concrètement ?",
        answer:
          "Vos rédacteurs continuent de publier dans WordPress, exactement comme avant. Vos visiteurs, eux, voient un site reconstruit avec des technologies modernes : généré à l'avance, affiché en moins de deux secondes. On garde l'outil de publication, on change tout ce qui est visible.",
      },
      {
        question: "Mon équipe devra-t-elle réapprendre à publier ?",
        answer:
          "Non. Dans les trajectoires consolider et découpler, l'administration WordPress reste identique : mêmes pages, mêmes articles, mêmes médias. Seule la trajectoire web app remplace l'outil, et dans ce cas une administration sur mesure est conçue pour votre logique métier, avec formation incluse.",
      },
      {
        question: "Que se passe-t-il pour mon référencement ?",
        answer:
          "Rien n'est perdu : chaque adresse existante est redirigée vers la nouvelle (redirections 301), donc aucune page ni aucun référencement perdu. La vitesse gagnée joue ensuite en votre faveur : les trois mesures de vitesse que Google utilise pour classer votre site (Core Web Vitals) sont vérifiées à la livraison.",
      },
      {
        question: "Par où commencer : visio à 150 € ou audit à 650 € ?",
        answer:
          "Si vous hésitez encore sur la direction, la visio conseil refonte (150 € HT) tranche en une heure, avec un avis écrit sous 48 h ; elle est déduite du devis si un projet démarre sous 30 jours. Si la décision engage un budget, l'audit + roadmap (650 € HT) livre un rapport d'audit, des préconisations chiffrées et un plan par étapes, utilisables même avec un autre prestataire. Et le diagnostic en 2 minutes, gratuit, donne la première orientation.",
      },
    ],
  },
};

const EN: HomeContent = {
  tldr: {
    label: "In short",
    lines: [
      "Next Impact redesigns aging WordPress sites: fast and modern, without rebuilding everything.",
      "Three trajectories: consolidate (optimized WordPress, from €2,250 excl. VAT), decouple (headless WordPress, recommended, from €4,000 excl. VAT), rebuild (web app, from €6,500 excl. VAT).",
      "Price and timeline in writing before we start, 6 to 10 weeks, performance measured before and after.",
      "Upstream: redesign advisory call (€150 excl. VAT) or audit + roadmap (€650 excl. VAT); the 2-minute site diagnostic is free.",
    ],
  },
  faq: {
    kicker: "FAQ",
    title: "The questions I'm asked most",
    items: [
      {
        question: "My WordPress site is slow: redesign or optimization?",
        answer:
          "It depends on the cause. If the problem is the theme and the plugin pile-up, an optimized WordPress redesign is enough (from €2,250 excl. VAT). If the site is slow because everything goes through WordPress on every visit, headless decoupling changes the picture (from €4,000 excl. VAT). The 2-minute diagnostic gives a first direction; the advisory call (€150 excl. VAT) settles it on evidence.",
      },
      {
        question: "What is a headless redesign, concretely?",
        answer:
          "Your editors keep publishing in WordPress, exactly as before. Your visitors see a site rebuilt with modern technology: generated in advance, displayed in under two seconds. You keep the publishing tool and change everything that is visible.",
      },
      {
        question: "Will my team have to relearn publishing?",
        answer:
          "No. In the consolidate and decouple trajectories, the WordPress admin stays identical: same pages, same posts, same media. Only the web app trajectory replaces the tool, and in that case a custom admin is designed for your business logic, with training included.",
      },
      {
        question: "What happens to my search rankings?",
        answer:
          "Nothing is lost: every existing address is redirected to the new one (301 redirects), so no page and no ranking is lost. The speed you gain then works in your favor: the three speed measures Google uses to rank your site (Core Web Vitals) are checked at delivery.",
      },
      {
        question: "Where to start: €150 call or €650 audit?",
        answer:
          "If you are still weighing the direction, the redesign advisory call (€150 excl. VAT) settles it in one hour, with a written opinion within 48h; it is deducted from the quote if a project starts within 30 days. If the decision commits a budget, the audit + roadmap (€650 excl. VAT) delivers an audit report, costed recommendations and a step-by-step plan, usable even with another vendor. And the free 2-minute diagnostic gives the first direction.",
      },
    ],
  },
};

export function getHomeContent(locale: Locale): HomeContent {
  return locale === "en" ? EN : FR;
}
