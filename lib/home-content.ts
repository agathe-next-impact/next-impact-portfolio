import type { Locale } from "@/i18n/routing";
import { TRAJECTOIRES, formatEuros, type Lang, type TrajectoireSlug } from "@/lib/trajectoires";
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
      "Next Impact refait les sites WordPress qui vieillissent : rapides et modernes, sans tout reconstruire.",
      `Trois prestations : ${nom("forfait-classique", "fr")} (WordPress optimisé, ${des("forfait-classique", "fr")}), ${nom("forfait-headless", "fr")} (WordPress headless, recommandée, ${des("forfait-headless", "fr")}), ${nom("forfait-webapp", "fr")} (web app, ${des("forfait-webapp", "fr")}).`,
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
          `Cela dépend de la cause. Si le problème vient du thème et de l'empilement de plugins, une refonte WordPress optimisée suffit (${apd("forfait-classique", "fr")}). Si le site est lent parce que tout passe par WordPress à chaque visite, le découplage headless change la donne (${apd("forfait-headless", "fr")}). L'analyse gratuite de votre site liste ses composants et ceux qui sont à risque : c'est une première orientation ; l'échange gratuit de 15 minutes dit par où commencer, et l'audit + roadmap tranche sur pièces.`,
      },
      {
        question: "Qu'est-ce qu'une refonte headless, concrètement ?",
        answer:
          "Vos rédacteurs continuent de publier dans WordPress, exactement comme avant. Vos visiteurs, eux, voient un site reconstruit avec des technologies modernes : généré à l'avance, affiché en moins de deux secondes. On garde l'outil de publication, on change tout ce qui est visible.",
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
      "Next Impact redesigns aging WordPress sites: fast and modern, without rebuilding everything.",
      `Three services: ${nom("forfait-classique", "en")} (optimized WordPress, ${des("forfait-classique", "en")}), ${nom("forfait-headless", "en")} (headless WordPress, recommended, ${des("forfait-headless", "en")}), ${nom("forfait-webapp", "en")} (web app, ${des("forfait-webapp", "en")}).`,
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
          `It depends on the cause. If the problem is the theme and the plugin pile-up, an optimized WordPress redesign is enough (${apd("forfait-classique", "en")}). If the site is slow because everything goes through WordPress on every visit, headless decoupling changes the picture (${apd("forfait-headless", "en")}). The free analysis of your site lists its components and the ones at risk: that is a first direction; the free 15-minute call tells you where to start, and the audit + roadmap settles it on evidence.`,
      },
      {
        question: "What is a headless redesign, concretely?",
        answer:
          "Your editors keep publishing in WordPress, exactly as before. Your visitors see a site rebuilt with modern technology: generated in advance, displayed in under two seconds. You keep the publishing tool and change everything that is visible.",
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
