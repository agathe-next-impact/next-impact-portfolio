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
import { trajectoireDuNom, type Lang } from "@/lib/trajectoires";

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
// case : elle est incluse dans le suivi. Le panneau « Agents de veille IA »
// a été retiré le 2026-10-14 (ADR-043).
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
   * (ADR-022). Absente : l'entrée ouvre seulement le panneau.
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

export const MEGA_SECTIONS: Record<string, MegaSection> = {
  decider: section("decider", [SCAN_ITEM]),
  refaire: section("refaire"),
  tenir: section("tenir"),
};
