// ─────────────────────────────────────────────────────────────────────────────
// Prestations web : source unique des DEUX points de départ (ADR-047,
// 2026-11-21, directives « docs/Solutions web analyse, noms d'offres et
// structure de page.md »).
//
//   Situation                      Verbe      Nom d'offre         Page
//   Vous lancez ou vous testez     Lancer     Vitrine évolutive   /landing-evolutive
//   Votre stratégie est stable     Refondre   Refonte WordPress   /refonte-wordpress
//
// /solutions-web devient la page d'orientation : elle envoie vers ces deux
// pages. Les trois pages lisent ce fichier : aucun prix, aucun délai, aucun nom
// d'offre n'est écrit dans une page.
//
// Les prix de la Refonte WordPress ne sont PAS recopiés ici : ils se lisent dans
// lib/trajectoires.ts (prestation `forfait-headless`, deux variantes à égalité,
// ADR-031). Les prix de la maintenance se lisent dans lib/maintenance-offer.ts.
//
// Règles de charte (§3) : « vous » / « je », jamais « nous », aucun tiret
// cadratin, prix avec espace insécable, hors taxes.
//
// Module sans dépendance d'exécution autre que lib/trajectoires.ts : importable
// côté serveur comme côté client.
// ─────────────────────────────────────────────────────────────────────────────

import { TRAJECTOIRES, formatEuros, type Variante, type VarianteSlug } from "@/lib/trajectoires";
import { ECHANGE_URL } from "@/lib/visio-conseil";

export const PRESTATIONS_PATH = "/solutions-web";

/**
 * Vidéo du héros des deux pages d'offre (demande d'Agathe du 2026-11-21 : chaque
 * héros garde une vidéo, comme l'ancien héros de /solutions-web). La Vitrine
 * évolutive a sa propre vidéo, au format 4:5 du cadre (fournie par Agathe le
 * 2026-11-21) ; la Refonte WordPress garde la vidéo générale des prestations.
 * Pour changer une vidéo, il suffit de changer le `src` de l'entrée voulue. La
 * page d'orientation /solutions-web n'a plus de héros.
 */
export const HERO_VIDEOS = {
  landing: {
    src: "/video/landing-evolutive-sombre-fil-4x5-1080x1350.mp4",
    label: "La Vitrine évolutive en vidéo",
  },
  refonte: {
    src: "/video/next-impact_services.mp4",
    label: "La Refonte WordPress en vidéo",
  },
} as const;

// ─── Prise de contact ────────────────────────────────────────────────────────

/**
 * Un seul outil de prise de rendez-vous pour les trois pages : l'échange
 * gratuit de 15 minutes (Calendly, lib/visio-conseil.ts). L'ancien lien Google
 * Agenda de la page n'est plus employé.
 */
export const RDV_HREF = ECHANGE_URL;

/** L'analyse du site : bouton froid de la Refonte WordPress. Hors app/[locale]/ : balise <a>. */
export const SCAN_HREF = "/scan";

// ─── Vitrine évolutive ───────────────────────────────────────────────────────

export const LANDING = {
  path: "/landing-evolutive",
  ancre: "lancer",
  verbe: "Lancer",
  nom: "Vitrine évolutive",
  etiquette: "Vous lancez ou vous testez",
  situation:
    "Nouveau projet, nouvelle offre ou nouveau marché. Vous ne savez pas encore quelles pages vos visiteurs liront vraiment.",
  promesse:
    "Une grande page aboutie, textes et visuels compris. Les pages suivantes s'ajoutent quand le besoin est prouvé.",
  /** Prix fixe, en euros hors taxes, textes et visuels compris. */
  priceValue: 1700,
  /** Délai de mise en ligne, en semaines. */
  delaiSemaines: 4,
  /** Extension : une page ajoutée après la mise en ligne. Prix fixe, hors taxes. */
  extensionPriceValue: 300,
  /** « Démarrer ma landing » : le formulaire de contact, sujet « projet » présélectionné. */
  demarrerHref: "/contact?sujet=mise-en-oeuvre",
  demarrerLabel: "Démarrer ma landing",
} as const;

/** « 1 700 € HT ». */
export const LANDING_PRIX = `${formatEuros(LANDING.priceValue, "fr")} HT`;
/** « 300 € HT ». */
export const EXTENSION_PRIX = `${formatEuros(LANDING.extensionPriceValue, "fr")} HT`;
/** « En ligne en 4 semaines ». */
export const LANDING_DELAI = `En ligne en ${LANDING.delaiSemaines} semaines`;

// ─── Refonte WordPress ───────────────────────────────────────────────────────

const REFONTE_SOURCE = TRAJECTOIRES["forfait-headless"];

export const REFONTE_WP = {
  path: "/refonte-wordpress",
  ancre: "refondre",
  verbe: "Refondre",
  nom: "Refonte WordPress",
  etiquette: "Votre stratégie est stable",
  situation:
    "Votre offre et vos contenus sont en place. C'est le site qui a vieilli : lent, daté, pénible à mettre à jour.",
  promesse:
    "Vos contenus restent, votre équipe publie toujours dans WordPress. Design, vitesse et base technique repartent à neuf.",
  /** Plancher, lu dans lib/trajectoires.ts (la formule la moins chère). */
  priceValue: REFONTE_SOURCE.priceValue,
  /** Délai annoncé, en semaines. */
  delaiMin: 6,
  delaiMax: 10,
} as const;

/** « À partir de 2 250 € HT ». */
export const REFONTE_PRIX = `À partir de ${formatEuros(REFONTE_WP.priceValue, "fr")} HT`;
/** « 6 à 10 semaines ». */
export const REFONTE_DELAI = `${REFONTE_WP.delaiMin} à ${REFONTE_WP.delaiMax} semaines`;

export interface Formule {
  slug: VarianteSlug;
  /** Nom affiché sur la page Refonte WordPress. */
  nom: string;
  /** Pour quel cas, en une phrase. */
  pourQui: string;
  /** Durée de la méthode pour cette formule, en semaines. */
  semaines: number;
  /** La variante de lib/trajectoires.ts : prix et phrase « en clair ». */
  variante: Variante;
}

const variante = (slug: VarianteSlug): Variante => {
  const v = REFONTE_SOURCE.variantes?.find((x) => x.slug === slug);
  if (!v) throw new Error(`Variante de Refonte introuvable : ${slug}`);
  return v;
};

/** Les deux formules de la Refonte WordPress, à égalité (ADR-031). */
export const FORMULES: Formule[] = [
  {
    slug: "sur-mesure",
    nom: "Thème sur mesure",
    pourQui: "Site vitrine, autonomie éditoriale complète, performance maîtrisée.",
    semaines: 6,
    variante: variante("sur-mesure"),
  },
  {
    slug: "headless",
    nom: "Headless",
    pourQui:
      "Quand la vitesse, le référencement ou l'expérience justifient une architecture séparée.",
    semaines: 8,
    variante: variante("headless"),
  },
];

/** « À partir de 4 000 € HT ». */
export const formulePrix = (f: Formule) => `À partir de ${formatEuros(f.variante.priceValue, "fr")} HT`;

/** « Thème sur mesure : 6 semaines · Headless : 8 semaines ». */
export const FORMULES_DUREES = FORMULES.map((f) => `${f.nom} : ${f.semaines} semaines`).join(" · ");

// ─── Réalisations et inspirations, en bas de chaque page de prestation ───────

export type PrestationKey = "landing" | "refonte";

/**
 * Études de cas et démos affichées en bas de chaque page de prestation : deux
 * rangées, chacune dans l'ordre de sa liste. Sélection éditoriale : des slugs
 * de lib/case-studies-data.ts. Un slug absent ou non publié est ignoré, une
 * rangée vide ne s'affiche pas. L'étiquette « Réalisation client » ou « Démo »
 * ne vient pas de cette liste : elle se lit dans `isDemo` de l'étude de cas,
 * pour qu'une démo ne passe jamais pour une réalisation client, quelle que
 * soit sa rangée.
 */
export const REALISATIONS_PAR_PRESTATION: Record<PrestationKey, { cas: string[]; inspirations: string[] }> = {
  // Trois pages uniques : une landing de séjours, la démo Verdier RH (à la
  // place d'ECOLISE, demande d'Agathe du 2026-11-21) et la landing d'un réseau.
  // Sur /landing-evolutive, ces trois cas forment la grille du bloc 3 ; la
  // rangée d'inspirations n'y est plus affichée. Verdier RH est une démo : sa
  // vignette porte l'étiquette « Démo », lue dans `isDemo`.
  landing: { cas: ["hermitage-sejours", "verdier-rh", "resems"], inspirations: [] },
  // La refonte headless d'Infralliance en tête (à la place de la démo Next
  // Event), un thème sur mesure, une refonte WordPress (sélection d'Agathe du
  // 2026-11-21).
  refonte: { cas: ["infralliance", "aloyse-leledy-becue", "sowee"], inspirations: [] },
};

/**
 * Études de cas de la home, dans cet ordre (sélection d'Agathe du
 * 2026-11-21) : Sowee (refonte WordPress), Infralliance (refonte headless),
 * Aloyse Leledy-Bécue (thème WordPress sur mesure), qui remplace L'Hermitage ·
 * ECOLISE en troisième position. Les trois sont des refontes : la home ne
 * montre plus de cas Vitrine évolutive.
 */
export const REALISATIONS_HOME: string[] = ["sowee", "infralliance", "aloyse-leledy-becue"];

// ─── FAQ ─────────────────────────────────────────────────────────────────────

export interface Faq {
  question: string;
  answer: string;
}

export const LANDING_FAQ: Faq[] = [
  {
    question: "Une seule page suffit-elle pour être trouvé sur Google ?",
    answer:
      "Sur le nom de votre activité et sur quelques recherches précises, oui. Une page se positionne toutefois sur moins de requêtes qu'un site complet : c'est la limite du format. Les Extensions servent à élargir cette couverture, une page à la fois, sur les sujets que vos visiteurs cherchent vraiment.",
  },
  {
    question: "Que se passe-t-il si je fournis déjà mes textes et mes visuels ?",
    answer: `Je pars de vos contenus : je les relis, je les adapte à la structure de la page et je complète ce qui manque. Le prix ne change pas : ${LANDING_PRIX}, prix fixe.`,
  },
  {
    question: "Comment décide-t-on des pages à ajouter ?",
    answer: `Sur des faits : les questions que vos clients vous posent, les recherches qui amènent des visiteurs, les passages de la page les plus lus, les clics mesurés depuis la mise en ligne. Quand un sujet revient, il devient une Extension, à ${EXTENSION_PRIX} la page.`,
  },
  {
    question: "Puis-je passer plus tard à un site complet sans tout refaire ?",
    answer:
      "Oui. La base technique est retenue dès le départ selon ce que vous prévoyez : WordPress, Astro ou Next.js. Les Extensions s'ajoutent à la page en ligne : le site grandit page par page, sans repartir de zéro.",
  },
  {
    question: "À qui appartiennent le domaine et l'hébergement ?",
    answer:
      "À vous. Ils sont mis en place à votre nom : vous en restez propriétaire, avec ou sans maintenance. Leur coût courant relève de la maintenance ; sans abonnement, vous les réglez directement.",
  },
];

/**
 * Les quatre questions de l'ancienne page /solutions-web, gardées telles
 * quelles. Les réponses ne citent plus l'Optimisation ni l'Évolution, sorties
 * des prestations web le 2026-11-21, et les délais sont ceux de la méthode.
 */
export const REFONTE_FAQ: Faq[] = [
  {
    question: "Est-ce que je pourrai toujours modifier mes textes ?",
    answer:
      "Oui. Dans les deux formules, vous gardez l'interface WordPress que vous connaissez pour gérer vos contenus, vos images et vos pages. Aucune compétence technique n'est requise.",
  },
  {
    question: "Refonte sur mesure ou headless : laquelle coûte le moins à maintenir ?",
    answer:
      "Le thème sur mesure : un seul outil à tenir, la maintenance reste légère. En headless, deux parties sont à maintenir, WordPress et le site affiché : le suivi coûte un peu plus, ce que compensent la vitesse et la sécurité quand le trafic est décisif. Votre situation tranche, avant le devis.",
  },
  {
    question: "Combien de temps prend la mise en place ?",
    answer: `Comptez ${FORMULES[0].semaines} semaines pour un thème sur mesure et ${FORMULES[1].semaines} semaines en headless, soit ${REFONTE_DELAI} selon la complexité du projet. Le délai est écrit avant de commencer.`,
  },
  {
    question: "Mes plugins WordPress fonctionneront-ils encore ?",
    answer:
      "Les extensions d'administration (référencement, statistiques, sécurité) continuent de fonctionner. Les extensions d'affichage (carrousels, formulaires affichés) sont remplacées par des équivalents plus légers, écrits pour votre site : moins de mises à jour, moins de failles, moins de pannes.",
  },
];
