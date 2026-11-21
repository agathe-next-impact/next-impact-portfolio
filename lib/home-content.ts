import type { Locale } from "@/i18n/routing";
import {
  EXTENSION_PRIX,
  FORMULES,
  LANDING,
  LANDING_PRIX,
  REFONTE_DELAI,
  REFONTE_PRIX,
  REFONTE_WP,
  formulePrix,
} from "@/lib/prestations-web";

// Contenu de la home : le héros, le cartouche « L'essentiel » (TL;DR, format de
// citation idéal pour les LLMs) et la FAQ. Consommé à la fois par le rendu
// visible (hero / home-tldr / home-faq) et par le JSON-LD (FAQJsonLd dans
// page.tsx) : une seule source.
//
// Depuis le 2026-11-21 (ADR-047, demande d'Agathe), la home ne reflète que
// l'offre du Studio digital : deux points de départ, la Vitrine évolutive et la
// Refonte WordPress. L'audit, le suivi et maintenance et l'expert technique
// externalisé n'y sont plus présentés. Aucun nom d'offre, prix ni délai n'est
// écrit ici : tout se lit dans lib/prestations-web.ts.
//
// La home est rédigée en français. L'anglais est fermé (ENGLISH_PUBLISHED) :
// il reçoit les mêmes textes tant qu'il n'est pas traduit, plutôt qu'une
// version anglaise restée sur l'ancien catalogue.

const [SUR_MESURE, HEADLESS] = FORMULES;
/** « à partir de 2 250 € HT », en milieu de phrase. */
const minuscule = (texte: string) => texte.charAt(0).toLowerCase() + texte.slice(1);

export interface HomeFaqItem {
  question: string;
  answer: string;
}

export interface HomeContent {
  hero: {
    kicker: string;
    /** Le h1 : « Studio Digital » (demande d'Agathe du 2026-11-21). */
    titre: string;
    /** Portion du h1 mise à l'accent. */
    titreAccent: string;
    accroche: string;
    /** Les deux prix, sous l'accroche. */
    prix: string[];
  };
  tldr: { label: string; lines: string[] };
  faq: { kicker: string; title: string; items: HomeFaqItem[] };
}

const FR: HomeContent = {
  hero: {
    kicker: "Next Impact",
    titre: "Studio Digital",
    titreAccent: "Digital",
    accroche:
      "Deux prestations, deux prix écrits. Partez de votre situation, pas d'une liste de technologies.",
    prix: [`${LANDING.nom} : ${LANDING_PRIX}`, `${REFONTE_WP.nom} : ${minuscule(REFONTE_PRIX)}`],
  },
  tldr: {
    label: "L'essentiel",
    lines: [
      `Next Impact est un studio digital : deux prestations, deux prix écrits, selon votre point de départ.`,
      `Vous lancez un projet ou testez un marché : la ${LANDING.nom}, une grande page aboutie à ${LANDING_PRIX}, textes et visuels compris, en ligne en ${LANDING.delaiSemaines} semaines. Les pages suivantes s'ajoutent quand le besoin est prouvé, à ${EXTENSION_PRIX} la page.`,
      `Votre stratégie est stable et le site a vieilli : la ${REFONTE_WP.nom}, ${minuscule(REFONTE_PRIX)}, en ${REFONTE_DELAI}. Vos contenus restent, votre équipe publie toujours dans WordPress ; le design, la vitesse et la base technique sont refaits.`,
      `La refonte se fait en ${SUR_MESURE.nom.toLowerCase()} (${minuscule(formulePrix(SUR_MESURE))}) ou en ${HEADLESS.nom.toLowerCase()} (${minuscule(formulePrix(HEADLESS))}) : deux formules à égalité, votre situation tranche.`,
      "Prix et délai écrits avant de commencer, vitesse mesurée, une interlocutrice unique du devis à la mise en ligne.",
      "Pour commencer : un échange gratuit de 15 minutes, ou l'analyse gratuite de votre site, une adresse, un rapport, aucun accès demandé.",
    ],
  },
  faq: {
    kicker: "FAQ",
    title: "Les questions qui se posent",
    items: [
      {
        question: `${LANDING.nom} ou ${REFONTE_WP.nom} : comment choisir ?`,
        answer: `Par votre point de départ. Si le projet, l'offre ou le marché est nouveau, vous ne savez pas encore quelles pages vos visiteurs liront : la ${LANDING.nom} met tout l'effort dans une page, et la suite se décide sur des faits. Si votre offre et vos contenus sont en place et que c'est le site qui a vieilli, c'est une ${REFONTE_WP.nom} : les contenus restent, ce qui les porte est refait. En cas de doute, l'échange gratuit de 15 minutes tranche.`,
      },
      {
        question: "Une seule page suffit-elle pour être trouvé sur Google ?",
        answer:
          "Sur le nom de votre activité et sur quelques recherches précises, oui. Une page se positionne toutefois sur moins de requêtes qu'un site complet : c'est la limite du format. Les Extensions servent à élargir cette couverture, une page à la fois, sur les sujets que vos visiteurs cherchent vraiment.",
      },
      {
        question: "Mon équipe devra-t-elle réapprendre à publier ?",
        answer:
          "Non. Dans une refonte, en thème sur mesure comme en headless, vous gardez l'interface WordPress que vous connaissez : mêmes pages, mêmes articles, mêmes médias. Aucune compétence technique n'est requise.",
      },
      {
        question: "Thème sur mesure ou headless : qu'est-ce qui change, concrètement ?",
        answer: `Dans les deux cas, le site est reconstruit et vos rédacteurs publient toujours dans WordPress. En ${SUR_MESURE.nom.toLowerCase()} : ${minuscule(SUR_MESURE.variante.enClair.fr)} En ${HEADLESS.nom.toLowerCase()} : ${HEADLESS.variante.enClair.fr} Le headless se justifie quand la vitesse, le référencement ou l'expérience demandent une architecture séparée. Les deux formules se valent ; votre situation tranche, avant le devis.`,
      },
      {
        question: "Que se passe-t-il pour mon référencement lors d'une refonte ?",
        answer:
          "Les contenus sont repris et les adresses de pages sont préservées ou redirigées vers les nouvelles. La vitesse gagnée joue ensuite en votre faveur : les trois mesures de vitesse que Google utilise pour classer un site (Core Web Vitals) sont vérifiées à la livraison.",
      },
      {
        question: "Par où commencer ?",
        answer:
          "Par l'échange gratuit de 15 minutes : il pose votre situation et dit laquelle des deux prestations y répond. Si vous avez déjà un site, son analyse est gratuite aussi : une adresse, un rapport, aucun accès demandé.",
      },
    ],
  },
};

export function getHomeContent(_locale?: Locale): HomeContent {
  return FR;
}
