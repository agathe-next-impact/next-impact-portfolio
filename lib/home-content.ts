import type { Locale } from "@/i18n/routing";
import {
  TRAJECTOIRES,
  formatEuros,
  type Lang,
  type TrajectoireSlug,
  type VarianteSlug,
} from "@/lib/trajectoires";
import { OFFERS as CONSEIL_OFFERS } from "@/lib/visio-conseil";

// Contenu GEO de la home : cartouche « L'essentiel » (TL;DR, format de citation idéal
// pour les LLMs) + FAQ (les cinq questions cibles de la charte éditoriale,
// DIRECTIVES-CHARTE-EDITORIALE.md §6 Home). Convention du repo : module TS
// FR + EN + accesseur. Consommé à la fois par le rendu visible (home-tldr /
// home-faq) et par le JSON-LD (FAQJsonLd dans page.tsx) → une seule source.
//
// Le nom et le montant des trois prestations sont lus dans lib/trajectoires.ts
// (charte v1.6, ADR-014).

const nom = (slug: TrajectoireSlug, lang: Lang) => TRAJECTOIRES[slug].name[lang];
const des = (slug: TrajectoireSlug, lang: Lang) =>
  lang === "en"
    ? `from ${formatEuros(TRAJECTOIRES[slug].priceValue, "en")} excl. VAT`
    : `dès ${formatEuros(TRAJECTOIRES[slug].priceValue, "fr")} HT`;
// Même montant, formulation longue (« à partir de 2 250 € HT »), pour la FAQ.
const apd = (slug: TrajectoireSlug, lang: Lang) =>
  lang === "en"
    ? `from ${formatEuros(TRAJECTOIRES[slug].priceValue, "en")} excl. VAT`
    : `à partir de ${formatEuros(TRAJECTOIRES[slug].priceValue, "fr")} HT`;
// Plancher d'une variante de la Refonte (sur mesure ou headless, ADR-031).
const variante = (slug: VarianteSlug, lang: Lang) => {
  const v = TRAJECTOIRES["forfait-headless"].variantes?.find((x) => x.slug === slug);
  const amount = formatEuros(v?.priceValue ?? TRAJECTOIRES["forfait-headless"].priceValue, lang);
  return lang === "en" ? `from ${amount} excl. VAT` : `à partir de ${amount} HT`;
};
// Prix de l'audit + roadmap, lu dans lib/visio-conseil.ts (« 650 € », « €650 »).
const AUDIT_VALUE = CONSEIL_OFFERS.find((o) => o.id === "architecture-projet-ia")!.tiers[0].value;
const audit = (lang: Lang) => formatEuros(AUDIT_VALUE, lang);

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
    label: "L'essentiel",
    lines: [
      "Next Impact refait les sites WordPress qui vieillissent : rapides et modernes, sans changer votre façon de publier.",
      `Trois prestations : ${nom("forfait-classique", "fr")} (le WordPress existant remis à niveau, ${des("forfait-classique", "fr")}), ${nom("forfait-headless", "fr")} (le site reconstruit, WordPress sur mesure ou headless, recommandée, ${des("forfait-headless", "fr")}), ${nom("forfait-webapp", "fr")} (web app, ${des("forfait-webapp", "fr")}).`,
      "L'offre se lit par situation : trois besoins (décider, faire évoluer son site, agir dans la durée), sept situations, un parcours par situation, avec son budget.",
      "Chaque offre porte une veille technique et stratégique : une première analyse dans l'audit et les prestations, une veille en continu dans le suivi et maintenance et la direction technique.",
      "Prix et délai écrits avant de commencer, 6 à 10 semaines, performance mesurée avant et après.",
      `En amont : un échange gratuit de 15 minutes, puis l'audit + roadmap (${audit("fr")} HT) si la décision engage un budget ; l'analyse de votre site est gratuite : une adresse, un rapport en deux minutes, aucun accès demandé.`,
    ],
  },
  faq: {
    kicker: "FAQ",
    title: "Les questions qui se posent",
    items: [
      {
        question: "Mon site WordPress est lent : refonte ou optimisation ?",
        answer:
          `Cela dépend de la cause. Si le problème vient de l'empilement d'extensions et du manque d'entretien, l'${nom("forfait-classique", "fr")} suffit : le site existant est gardé et remis à niveau, sans reconstruction (${apd("forfait-classique", "fr")}). Si le thème lui-même bloque ou que le design a vieilli, c'est une ${nom("forfait-headless", "fr")} : en WordPress sur mesure (${variante("sur-mesure", "fr")}) ou en WordPress headless (${variante("headless", "fr")}) quand la vitesse et le trafic sont décisifs. L'analyse gratuite de votre site liste ses composants et ceux qui sont à risque : c'est une première orientation ; l'échange gratuit de 15 minutes dit par où commencer, et l'audit + roadmap tranche sur pièces.`,
      },
      {
        question: "Sur mesure ou headless : qu'est-ce qui change, concrètement ?",
        answer:
          `Dans les deux cas, le site est reconstruit et vos rédacteurs publient toujours dans WordPress. En WordPress sur mesure, un thème est écrit pour votre site, avec le strict nécessaire en extensions : un seul outil à tenir, un suivi léger. En WordPress headless, WordPress ne sert plus qu'à publier et le site affiché est reconstruit avec Next.js : généré à l'avance, affiché en moins de deux secondes. Les deux variantes se valent ; votre situation tranche.`,
      },
      {
        question: "Mon équipe devra-t-elle réapprendre à publier ?",
        answer:
          `Non. Dans les prestations ${nom("forfait-classique", "fr")} et ${nom("forfait-headless", "fr")}, l'administration WordPress reste identique : mêmes pages, mêmes articles, mêmes médias. Seule la prestation ${nom("forfait-webapp", "fr")} (web app) remplace l'outil, et dans ce cas une administration sur mesure est conçue pour votre logique métier, avec formation incluse.`,
      },
      {
        question: "Que se passe-t-il pour mon référencement ?",
        answer:
          "Rien n'est perdu : chaque adresse existante est redirigée vers la nouvelle (redirections 301), donc aucune page ni aucun référencement perdu. La vitesse gagnée joue ensuite en votre faveur : les trois mesures de vitesse que Google utilise pour classer votre site (Core Web Vitals) sont vérifiées à la livraison.",
      },
      {
        question: `Par où commencer : l'échange de 15 minutes ou l'audit à ${audit("fr")} ?`,
        answer:
          `Par l'échange de 15 minutes : il est gratuit et pose la situation, garder, faire évoluer ou refaire. Si la décision engage un budget, l'audit + roadmap (${audit("fr")} HT) livre un rapport d'audit, des préconisations chiffrées et un plan par étapes, utilisables même avec un autre prestataire. Et l'analyse gratuite de votre site, en deux minutes, donne la première orientation.`,
      },
    ],
  },
};

const EN: HomeContent = {
  tldr: {
    label: "Key points",
    lines: [
      "Next Impact redesigns aging WordPress sites: fast and modern, without changing the way you publish.",
      `Three services: ${nom("forfait-classique", "en")} (the existing WordPress brought up to standard, ${des("forfait-classique", "en")}), ${nom("forfait-headless", "en")} (the site rebuilt, custom or headless WordPress, recommended, ${des("forfait-headless", "en")}), ${nom("forfait-webapp", "en")} (web app, ${des("forfait-webapp", "en")}).`,
      "The offer reads by situation: three needs (decide, evolve your site, act over the long run), seven situations, one path per situation, with its budget.",
      "Every offer carries a technical and strategic watch: a first analysis in the audit and the services, a continuous watch in care and maintenance and in technical direction.",
      "Price and timeline in writing before we start, 6 to 10 weeks, performance measured before and after.",
      `Upstream: a free 15-minute call, then the audit + roadmap (${audit("en")} excl. VAT) if the decision commits a budget; the analysis of your site is free: one address, a report in two minutes, no access requested.`,
    ],
  },
  faq: {
    kicker: "FAQ",
    title: "The questions I'm asked most",
    items: [
      {
        question: "My WordPress site is slow: redesign or optimization?",
        answer:
          `It depends on the cause. If the problem is plugin pile-up and lack of upkeep, ${nom("forfait-classique", "en")} is enough: the existing site is kept and brought up to standard, no rebuild (${apd("forfait-classique", "en")}). If the theme itself is the blocker or the design has aged, it is a ${nom("forfait-headless", "en")}: as custom WordPress (${variante("sur-mesure", "en")}) or as headless WordPress (${variante("headless", "en")}) when speed and traffic are decisive. The free analysis of your site lists its components and the ones at risk: that is a first direction; the free 15-minute call tells you where to start, and the audit + roadmap settles it on evidence.`,
      },
      {
        question: "Custom or headless: what changes, concretely?",
        answer:
          `In both cases the site is rebuilt and your editors still publish in WordPress. With custom WordPress, a theme is written for your site, with only the plugins you need: one tool to maintain, light care. With headless WordPress, WordPress is only used to publish and the visible site is rebuilt with Next.js: generated in advance, displayed in under two seconds. The two variants are equally valid; your situation decides.`,
      },
      {
        question: "Will my team have to relearn publishing?",
        answer:
          `No. In the ${nom("forfait-classique", "en")} and ${nom("forfait-headless", "en")} services, the WordPress admin stays identical: same pages, same posts, same media. Only the ${nom("forfait-webapp", "en")} service (web app) replaces the tool, and in that case a custom admin is designed for your business logic, with training included.`,
      },
      {
        question: "What happens to my search rankings?",
        answer:
          "Nothing is lost: every existing address is redirected to the new one (301 redirects), so no page and no ranking is lost. The speed you gain then works in your favor: the three speed measures Google uses to rank your site (Core Web Vitals) are checked at delivery.",
      },
      {
        question: `Where to start: the 15-minute call or the ${audit("en")} audit?`,
        answer:
          `With the 15-minute call: it is free and lays out the situation, keep, evolve or rebuild. If the decision commits a budget, the audit + roadmap (${audit("en")} excl. VAT) delivers an audit report, costed recommendations and a step-by-step plan, usable even with another vendor. And the free analysis of your site, in two minutes, gives the first direction.`,
      },
    ],
  },
};

export function getHomeContent(locale: Locale): HomeContent {
  return locale === "en" ? EN : FR;
}
