import {
  citer,
  estGratuit,
  getBesoin,
  packPrixEntree,
  situationHref,
  packNom,
  situationsDuBesoin,
  type BesoinKey,
  type Situation,
} from "@/lib/situations";
import { NEWSLETTER_SUBSCRIBE_URL } from "@/lib/newsletter";
import { OFFER_AMOUNT_CENTS, OFFER_PRICE_LABEL } from "@/lib/sentinelle-offer";
import { formatEuros, trajectoireDuNom, type Lang } from "@/lib/trajectoires";

// ─────────────────────────────────────────────────────────────────────────────
// Données du mega menu : l'offre par situation (charte v1.6, ADR-014). Les
// entrées de nav gardent le nom du moment (Diagnostiquer · Évoluer · Gérer,
// ADR-013) ; le panneau qu'elles ouvrent porte le BESOIN, dit à la première
// personne, et ses cases sont des parcours, désignés par leur seul nom, sans
// le mot « pack » (ADR-016, ADR-022).
//
// Chaque case mène à la page du parcours : le nom en titre, la solution
// technique (Évoluer) ou la situation en sous-titre, le prix en bas, le statut
// (gratuit, recommandé) en pastille. Trois cases
// au plus par panneau :
//   – « Je veux pouvoir décider »            : l'analyse du site (gratuite,
//                                              mise en avant), puis Audit.
//                                              Arbitrage est retiré du menu
//                                              (2026-09-28).
//   – « Je veux faire évoluer mon site web » : trois situations, une par
//                                              prestation. Refonte ou création.
//   – « Je veux agir dans la durée »         : deux situations, entretenir puis
//                                              piloter. Toujours en dernier :
//                                              offres de fin de parcours
//                                              (charte §5).
//
// L'entrée de nav ouvre le panneau au survol et au focus, et mène à la page
// mère au clic ; la ligne supérieure du panneau (le besoin + « Voir la page
// … ») y mène aussi (ADR-022, points 14 et 16). Dans les trois moments, Sentinelle n'est pas une
// case : elle est incluse dans le suivi. Elle a sa case dans le panneau
// « La veille » (VEILLE_SECTION, plus bas).
//
// Les clés techniques (`decider`, `refaire`, `tenir`) ne changent pas. Aucun
// texte ni prix n'est écrit ici pour les situations : tout vient de
// lib/situations.ts. Bilingue en ligne (fr/en), pour ne pas gonfler
// messages/*.json.
// ─────────────────────────────────────────────────────────────────────────────

export interface MegaItem {
  label: { fr: string; en: string };
  desc: { fr: string; en: string };
  href: string;
  external?: boolean;
  /**
   * Route hors de app/[locale]/ (ex. /scan) : balise <a> dans le même onglet,
   * pas le Link i18n, qui la préfixerait en /en/… .
   */
  horsLocale?: boolean;
  /** Prix et statut en une ligne : accordéon mobile. */
  badge?: { fr: string; en: string };
  /** Prix seul, en bas de case (desktop). */
  price?: { fr: string; en: string };
  /** Statut en pastille pleine : « Gratuit, sans engagement », « Recommandé ». */
  tag?: { fr: string; en: string };
  /** Offre gratuite ou recommandée : case mise en avant. */
  featured?: boolean;
}

export interface MegaSection {
  /** Clé de traduction `nav` : sert aussi de clé d'état côté header. */
  key: string;
  /**
   * Page mère : l'entrée de nav et la ligne supérieure du panneau y mènent
   * (ADR-022). Absente pour « À propos » : l'entrée ouvre seulement le panneau.
   */
  href?: string;
  /** Le besoin, dit par le visiteur : titre du panneau. */
  heading: { fr: string; en: string };
  /** Deux ou trois cases, une par situation. */
  items: MegaItem[];
}

/** Parcours mis en avant dans le menu, en plus des offres gratuites et recommandées (demande d'Agathe du 2026-09-27). */
const MIS_EN_AVANT: Situation["slug"][] = ["decisions-techniques"];

function situationItem(s: Situation): MegaItem {
  const gratuit = estGratuit(s);
  // Le sous-titre d'une prestation est sa solution technique (demande d'Agathe
  // du 2026-09-27). Le prix est le prix d'entrée publié, calculé au même endroit
  // que celui des cartes de la home et des listes : packPrixEntree.
  const t = trajectoireDuNom(s.offre.fr);
  const prix = (lang: Lang) => packPrixEntree(s, lang);
  const tag = gratuit
    ? { fr: "Gratuit, sans engagement", en: "Free, no commitment" }
    : s.recommended
      ? { fr: "Recommandé", en: "Recommended" }
      : undefined;
  const price = gratuit ? undefined : { fr: prix("fr"), en: prix("en") };
  const join = (lang: Lang) => [price?.[lang], tag?.[lang]].filter(Boolean).join(" · ");
  return {
    label: { fr: packNom(s, "fr"), en: packNom(s, "en") },
    desc: t
      ? { fr: t.technique.fr, en: t.technique.en }
      : s.sousTitre ?? { fr: citer(s.phrase, "fr"), en: citer(s.phrase, "en") },
    // Pack sans page (Arbitrage) : la case ouvre son lien externe, la
    // réservation Calendly, dans un nouvel onglet.
    href: situationHref(s),
    ...(s.lienExterne ? { external: true } : {}),
    badge: { fr: join("fr"), en: join("en") },
    price,
    tag,
    featured: gratuit || s.recommended || MIS_EN_AVANT.includes(s.slug),
  };
}

/**
 * Parcours retirés du menu (demande d'Agathe du 2026-09-28) : Arbitrage, dont
 * la case doublait l'échange gratuit du bouton de la navbar. Le parcours reste
 * sur /packs et /tarifs.
 */
const HORS_MENU: Situation["slug"][] = ["devis-a-juger"];

function section(key: BesoinKey, avant: MegaItem[] = []): MegaSection {
  const besoin = getBesoin(key);
  return {
    key,
    href: besoin.href,
    heading: besoin.phrase,
    items: [
      ...avant,
      ...situationsDuBesoin(key)
        .filter((s) => !HORS_MENU.includes(s.slug))
        .map(situationItem),
    ],
  };
}

// L'analyse du site, première case du panneau « Audit » (demande d'Agathe du
// 2026-09-28) : le CTA froid, gratuit, avant l'échange et l'audit payant.
const SCAN_ITEM: MegaItem = {
  label: { fr: "Analyse du site", en: "Site analysis" },
  desc: {
    fr: "Votre site comparé à vos concurrents, en deux minutes. Résultat par mail.",
    en: "Your site compared with your competitors, in two minutes. Results by email.",
  },
  href: "/scan",
  horsLocale: true,
  badge: { fr: "Gratuit", en: "Free" },
  tag: { fr: "Gratuit", en: "Free" },
  featured: true,
};

// « La veille » (clé technique `surveiller`) : hors moments, donc hors
// lib/situations.ts. Deux cases, demandées par Agathe : la lettre gratuite puis
// Sentinelle. Le prix de Sentinelle vient de sa source unique.
const SENTINELLE_PRIX_EN = `${formatEuros(OFFER_AMOUNT_CENTS / 100, "en")}/month`;
const VEILLE_SECTION: MegaSection = {
  key: "surveiller",
  href: "/veille",
  heading: { fr: "Je veux suivre ce qui change", en: "I want to keep up with what changes" },
  items: [
    {
      label: { fr: "Lettre de veille", en: "Tech watch newsletter" },
      desc: {
        fr: "Le marché web & IA : une synthèse par mois, un focus par semaine.",
        en: "The web & AI market: one digest a month, one focus a week.",
      },
      // Inscription Substack dans un nouvel onglet (demande d'Agathe, 2026-09-27).
      href: NEWSLETTER_SUBSCRIBE_URL,
      external: true,
      badge: { fr: "Gratuit", en: "Free" },
      tag: { fr: "Gratuit", en: "Free" },
    },
    {
      label: { fr: "Sentinelle", en: "Sentinelle" },
      desc: {
        fr: "La veille personnalisée de votre site : alertes ciblées, deux lettres par mois.",
        en: "A personalised watch on your site: targeted alerts, two letters a month.",
      },
      href: "/sentinelle",
      badge: { fr: `${OFFER_PRICE_LABEL}, sans engagement`, en: `${SENTINELLE_PRIX_EN}, no commitment` },
      price: { fr: OFFER_PRICE_LABEL, en: SENTINELLE_PRIX_EN },
      // Mise en avant demandée par Agathe (2026-09-27).
      featured: true,
    },
  ],
};

// « À propos » (demande d'Agathe du 2026-09-28) : la preuve et la personne,
// regroupées en un panneau. Hors moments, donc hors lib/situations.ts. Pas de
// compte d'études de cas ici : lib/case-studies-data.ts alourdirait le bundle
// du header.
// Pas de page mère (demande d'Agathe du 2026-09-28) : l'entrée ne fait
// qu'ouvrir le panneau, dont les deux cases sont les seules destinations.
const A_PROPOS_SECTION: MegaSection = {
  key: "about",
  heading: { fr: "Je veux savoir à qui je m'adresse", en: "I want to know who I'm dealing with" },
  items: [
    {
      label: { fr: "Études de cas", en: "Case studies" },
      desc: {
        fr: "Des projets livrés, avec leurs résultats mesurés avant et après.",
        en: "Delivered projects, with results measured before and after.",
      },
      href: "/etudes-de-cas",
      featured: true,
    },
    {
      label: { fr: "À propos", en: "About" },
      desc: {
        fr: "Agathe Karinthi-Martin : 20 ans d'expérience, dont 15 ans de WordPress.",
        en: "Agathe Karinthi-Martin: 20 years of experience, 15 of them with WordPress.",
      },
      href: "/a-propos",
    },
  ],
};

export const MEGA_SECTIONS: Record<string, MegaSection> = {
  decider: section("decider", [SCAN_ITEM]),
  refaire: section("refaire"),
  tenir: section("tenir"),
  surveiller: VEILLE_SECTION,
  about: A_PROPOS_SECTION,
};
