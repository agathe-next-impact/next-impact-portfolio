import {
  CTO_CONTACT_HREF,
  CTO_MIN_MONTHS,
  CTO_NOTICE_MONTHS,
  CTO_PATH,
  CTO_TIERS,
} from "@/lib/cto-externalise";
import {
  MAINTENANCE_ANNUAL_FREE_MONTHS,
  MAINTENANCE_CONTACT_HREF,
  MAINTENANCE_ONBOARDING_VALUE,
  MAINTENANCE_PATH,
  SUIVI_INCLUS_MOIS,
  maintenanceMonthly,
} from "@/lib/maintenance-offer";
import {
  TRAJECTOIRES,
  TRAJECTOIRE_ORDER,
  formatEuros,
  type Lang,
  type SiteKind,
  type Trajectoire,
  type TrajectoireSlug,
  type Variante,
  type VarianteSlug,
} from "@/lib/trajectoires";
import { ECHANGE_NAME, ECHANGE_URL, OFFERS as CONSEIL_OFFERS } from "@/lib/visio-conseil";

// ─────────────────────────────────────────────────────────────────────────────
// L'offre par situation : source unique des besoins, des situations et des
// packs (charte v1.6, ADR-014).
//
// Trois niveaux, du plus large au plus précis :
//   1. le BESOIN, dit à la première personne. Il y en a trois, un par moment
//      (Diagnostiquer, Évoluer, Gérer) ;
//   2. la SITUATION, la phrase que le visiteur se dit. Elle dit pour qui est
//      le pack, en ligne secondaire ; elle ne le désigne jamais ;
//   3. le PACK, le parcours qui répond à cette situation : avant, pendant,
//      après, avec un budget. Il se désigne par un seul terme, `nom`
//      (Arbitrage, Optimisation, Refonte, Évolution, Maintenance, Pilotage) :
//      titre des cartes, des cases du menu, des pages, du fil d'Ariane, des
//      schémas et de llms (ADR-016). Voir packNom().
//
// Un pack assemble, il ne crée rien : ni ligne de catalogue, ni prix, ni
// remise. Chaque étape est une ligne du catalogue, chaque
// montant est lu dans sa source (lib/visio-conseil, lib/trajectoires,
// lib/maintenance-offer, lib/cto-externalise), chaque budget est calculé ici.
//
// La veille technique et stratégique est ce qui distingue chaque offre
// (arbitrage d'Agathe du 2026-09-27, ADR-014). Elle a deux formes, portées par
// les étapes : une PREMIÈRE ANALYSE dans l'audit et dans les prestations, une
// veille EN CONTINU dans le suivi et maintenance et dans la direction
// technique. Voir VEILLE ci-dessous : un seul endroit où elle se définit.
//
// Bilingue pour ce que la home et le menu affichent ; le contenu des pages de
// pack (`page`) est en français seulement, l'anglais suit la validation du
// français (charte §3).
//
// Règles de charte (§3) : « vous » / « je », jamais « nous », aucun tiret
// cadratin, aucun terme technique sans sa traduction.
// ─────────────────────────────────────────────────────────────────────────────

type Bi = Record<Lang, string>;

export const PACKS_PATH = "/packs";

export type BesoinKey = "decider" | "refaire" | "tenir";

export interface Besoin {
  /** Clé technique du moment, inchangée depuis l'ADR-012. */
  key: BesoinKey;
  index: string;
  /** Nom du moment, celui du menu. */
  moment: Bi;
  /** Le besoin, dit par le visiteur. */
  phrase: Bi;
  /** Page du moment : les offres détaillées. */
  href: string;
}

export const BESOINS: Besoin[] = [
  {
    key: "decider",
    index: "01",
    moment: { fr: "Diagnostiquer", en: "Diagnose" },
    phrase: { fr: "Je veux pouvoir décider", en: "I want to be able to decide" },
    href: "/conseil",
  },
  {
    key: "refaire",
    index: "02",
    moment: { fr: "Évoluer", en: "Evolve" },
    phrase: { fr: "Je veux faire évoluer mon site web", en: "I want my website to evolve" },
    href: "/solutions-web",
  },
  {
    key: "tenir",
    index: "03",
    moment: { fr: "Gérer", en: "Manage" },
    phrase: { fr: "Je veux agir dans la durée", en: "I want to act over the long run" },
    href: MAINTENANCE_PATH,
  },
];

export type SituationSlug =
  | "devis-a-juger"
  | "etat-des-lieux"
  | "site-wordpress-ingerable"
  | "site-wordpress-lent"
  | "site-outil-de-travail"
  | "site-a-tenir"
  | "decisions-techniques";

export type VeilleMode = "premiere-analyse" | "continu";

/**
 * La veille technique et stratégique, caractéristique de toutes les offres.
 * Technique : ce qui menace ce que vous faites déjà tourner. Stratégique : ce
 * que le contexte rend possible et que votre site ne fait pas encore.
 */
export const VEILLE: Record<VeilleMode, { label: Bi; ou: Bi; detail: Bi }> = {
  "premiere-analyse": {
    label: { fr: "Analyse technique et stratégique", en: "Technical and strategic analysis" },
    ou: {
      fr: "Dans l'audit et dans chaque prestation",
      en: "In the audit and in every service",
    },
    detail: {
      fr: "Avant de décider et de construire, je regarde ce qui bouge autour de votre site : fins de support, failles connues, évolution des outils que vous utilisez, et ce que le contexte rend possible. Le choix repose sur l'état du terrain, daté et sourcé.",
      en: "Before deciding and building, I look at what is moving around your site: end-of-support dates, known vulnerabilities, changes in the tools you use, and what the context makes possible. The choice rests on the state of play, dated and sourced.",
    },
  },
  continu: {
    label: { fr: "Veille écosystème et technos", en: "Ecosystem and tech watch" },
    ou: {
      fr: "Dans le suivi et maintenance et dans la direction technique",
      en: "In care and maintenance and in technical direction",
    },
    detail: {
      fr: "Une fois le site en ligne, la veille continue : les composants installés chez vous sont suivis, une alerte part quand l'un d'eux devient un risque, et vous lisez ce que ça change pour la suite.",
      en: "Once the site is live, the watch goes on: the components you run are tracked, an alert goes out when one becomes a risk, and you read what it changes for what comes next.",
    },
  },
};

export const VEILLE_TITRE: Bi = {
  fr: "Veille technique et stratégique",
  en: "Technical and strategic watch",
};

export interface PackStep {
  quand: "avant" | "pendant" | "apres";
  /** Ligne du catalogue, sous son seul nom. */
  offre: Bi;
  detail: Bi;
  prix: Bi;
  href: string;
  /** Lien hors de app/[locale]/ (ex. /scan) : balise <a>, pas le Link i18n. */
  plain?: boolean;
  /** Forme de veille que l'étape porte, quand elle en porte une. */
  veille?: VeilleMode;
}

export interface BudgetLine {
  label: Bi;
  /** Montant compté dans le total, en euros hors taxes. */
  amount: number;
  /** Texte affiché quand il diffère du montant compté (« Inclus », « Gratuit »). */
  display?: Bi;
}

export interface PackBudget {
  lines: BudgetLine[];
  total: number;
  /** Ce que le total couvre. */
  periode: Bi;
  /** Une autre hypothèse, dite en une ligne. */
  variante?: { label: Bi; total: number };
}

export interface SituationPage {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  /** h1 : `accent` porte le bénéfice. */
  titre: { avant: string; accent: string; apres: string };
  /** h1 propre à la page, quand il diffère du nom du pack (le nom reste celui du menu). */
  h1?: string;
  /** Partie du h1 en couleur d'accent ; sans elle, tout le h1 l'est. */
  h1Accent?: string;
  promesse: string;
  /**
   * Page réduite à la prestation (demande d'Agathe du 2026-09-27, Audit +
   * roadmap) : quand ce champ existe, la page n'affiche que le hero, cette
   * description, le prix et les deux boutons de fin. Preuve, étapes, veille,
   * FAQ et autres situations ne sont pas rendus.
   */
  prestation?: {
    description: string;
    /**
     * Les livrables, dans l'ordre. Un bloc à `cartes` s'affiche en accordéon
     * (deux cartes à l'intérieur) ; un bloc à `detail` s'affiche ouvert.
     */
    livrables: {
      titre: string;
      /** Le livrable remis, ou ce que le bloc donne. */
      sousTitre?: string;
      detail?: string;
      cartes?: { titre: string; detail: string }[];
    }[];
  };
  /**
   * Page d'une prestation (Optimisation, Refonte, Évolution ; demande
   * d'Agathe du 2026-09-27) : quand ce champ existe, la page affiche le prix
   * du forfait, pas le budget de la première année, et une seule section en
   * accordéon : la solution technique, les situations types, le processus
   * (avant, pendant, après) et la preuve. Ni budget détaillé, ni FAQ.
   */
  solution?: {
    /** Ce que je fais, en détail. */
    detail: string;
    /** La stack technique, chaque terme traduit. */
    stack: string;
    /** Les situations types auxquelles la prestation répond. */
    situations: string[];
  };
  /**
   * Le concept de l'offre, en première section (demande d'Agathe du
   * 2026-09-27, pack Pilotage). Avec `offres`, remplace la preuve et les trois
   * étapes.
   */
  concept?: {
    kicker: string;
    titre: { avant: string; accent: string };
    description?: string;
    /** Les bénéfices pour le client, un par colonne. */
    points: { titre: string; texte: string }[];
    /** Ce qui est pris en charge, en pastilles. */
    perimetre?: string[];
  };
  /**
   * Les abonnements du pack détaillés un par un (demande d'Agathe du
   * 2026-09-27) : une section par abonnement ou par palier, en accordéon
   * ouvert, un volet par composant, des cartes dedans. Remplace la preuve et
   * les trois étapes.
   */
  offres?: {
    /** Ancre de la section. */
    id: string;
    /** Libellé de la carte du héros. */
    carte: string;
    kicker: string;
    titre: { avant: string; accent: string };
    description: string;
    volets: {
      titre: string;
      sousTitre: string;
      cartes: { titre: string; detail: string }[];
    }[];
  }[];
  /** Pas de section budget (packs Maintenance et Pilotage : les paliers disent le prix). */
  sansBudget?: boolean;
  /** Ni preuve ni trois étapes, même sans concept ni offres détaillées (pack Pilotage). */
  sansParcours?: boolean;
  /** Pas de section « La preuve » (packs Pilotage et Maintenance, demandes d'Agathe du 2026-09-27). */
  sansPreuve?: boolean;
  /** Les paliers du service avant la veille (packs Maintenance et Pilotage). */
  paliersAvantVeille?: boolean;
  preuve: {
    /** Étude de cas lue dans lib/case-studies-data.ts : ses chiffres ne sont pas recopiés. */
    caseStudy?: string;
    titre: string;
    texte: string;
    lien: string;
    href: string;
  };
  inclus: string[];
  faq: { question: string; answer: string }[];
  /** Bouton chaud : deep-link du formulaire de contact. */
  contactHref: string;
}

export interface Situation {
  slug: SituationSlug;
  besoin: BesoinKey;
  /** Le seul terme qui désigne le pack (ADR-016). */
  nom: Bi;
  /** La phrase que le visiteur se dit : ligne « pour qui », jamais un nom. */
  phrase: Bi;
  /** Ligne du catalogue au centre du pack. */
  offre: Bi;
  /** Ce que le visiteur obtient. */
  resultat: Bi;
  recommended?: boolean;
  /**
   * Pack sans page : son lien part ailleurs, dans un nouvel onglet (menu,
   * cartes, listes, llms). Arbitrage renvoie ainsi à la réservation de
   * l'échange de 15 minutes (demande d'Agathe du 2026-09-27). Aucune page
   * /packs/<slug> n'est générée pour lui, ni listée au plan du site.
   */
  lienExterne?: string;
  steps: PackStep[];
  budget: PackBudget;
  /** Plancher mensuel, pour un pack dont le prix est récurrent (JSON-LD, menu). */
  mensuel?: number;
  /** Sous-titre du menu et des cartouches, quand ce n'est pas une prestation. */
  sousTitre?: Bi;
  page: SituationPage;
}

// ─── Montants lus dans les sources ──────────────────────────────────────────

const conseil = (id: string) => CONSEIL_OFFERS.find((o) => o.id === id)!.tiers[0].value;
const AUDIT = conseil("architecture-projet-ia");
const REFERENT = CTO_TIERS[0];
const DIRECTION = CTO_TIERS[1];

/** Mois de suivi facturés la première année, une fois les mois inclus écoulés. */
const MOIS_FACTURES = 12 - SUIVI_INCLUS_MOIS;

const ht = (value: number): Bi => ({
  fr: `${formatEuros(value, "fr")} HT`,
  en: `${formatEuros(value, "en")} excl. VAT`,
});

const parMois = (value: number): Bi => ({
  fr: `${formatEuros(value, "fr")} HT par mois`,
  en: `${formatEuros(value, "en")} excl. VAT per month`,
});

const aPartirDe = (value: number): Bi => ({
  fr: `À partir de ${formatEuros(value, "fr")} HT`,
  en: `From ${formatEuros(value, "en")} excl. VAT`,
});

const GRATUIT: Bi = { fr: "Gratuit", en: "Free" };
const PREMIERE_ANNEE: Bi = { fr: "la première année", en: "the first year" };

// ─── Étapes communes ────────────────────────────────────────────────────────

const STEP_ANALYSE: PackStep = {
  quand: "avant",
  offre: { fr: "Analyse du site", en: "Site analysis" },
  detail: {
    fr: "Une adresse, deux minutes, aucun accès demandé : de quoi votre site est fait, et ce qui est à risque.",
    en: "One address, two minutes, no access required: what your site is made of, and what is at risk.",
  },
  prix: GRATUIT,
  href: "/scan",
  plain: true,
};

/** L'échange de 15 minutes, gratuit (ADR-023) : il remplace la visio payante. */
const STEP_ECHANGE: PackStep = {
  quand: "avant",
  offre: ECHANGE_NAME,
  detail: {
    fr: "Quinze minutes en visio pour poser votre situation et savoir par où commencer. Sans engagement.",
    en: "Fifteen minutes on a video call to lay out your situation and know where to start. No commitment.",
  },
  prix: GRATUIT,
  href: ECHANGE_URL,
  plain: true,
};

const STEP_AUDIT: PackStep = {
  quand: "avant",
  offre: { fr: "Audit + roadmap", en: "Audit + roadmap" },
  detail: {
    fr: "Rapport d'audit, préconisations chiffrées et roadmap par étapes, remis dans votre espace en ligne.",
    en: "Audit report, costed recommendations and a step-by-step roadmap, delivered in your online workspace.",
  },
  prix: ht(AUDIT),
  href: "/conseil#architecture-projet-ia",
  veille: "premiere-analyse",
};

function stepSuivi(kind: SiteKind): PackStep {
  return {
    quand: "apres",
    veille: "continu",
    offre: { fr: "Suivi et maintenance", en: "Care and maintenance" },
    detail: {
      fr: `${SUIVI_INCLUS_MOIS} mois de suivi inclus, puis le palier Essentiel : surveillance, sauvegardes, mises à jour vérifiées, rapport chaque mois. Sentinelle incluse.`,
      en: `${SUIVI_INCLUS_MOIS} months of care included, then the Essential tier: monitoring, backups, checked updates, a report every month. Sentinelle included.`,
    },
    prix: parMois(maintenanceMonthly("essentiel", kind)),
    href: MAINTENANCE_PATH,
  };
}

function stepTrajectoire(slug: TrajectoireSlug, detail: Bi): PackStep {
  const t = TRAJECTOIRES[slug];
  return {
    quand: "pendant",
    offre: t.name,
    detail,
    prix: aPartirDe(t.priceValue),
    href: t.href,
    veille: "premiere-analyse",
  };
}

// ─── Budgets calculés ───────────────────────────────────────────────────────

/** Pack d'une prestation : l'avis ou l'audit, le forfait, puis le suivi jusqu'à la fin de la première année. */
function budgetTrajectoire(slug: TrajectoireSlug, avant: "echange" | "audit"): PackBudget {
  const t = TRAJECTOIRES[slug];
  const essentiel = maintenanceMonthly("essentiel", t.siteKind);
  const actif = maintenanceMonthly("actif", t.siteKind);
  const amont = avant === "audit" ? AUDIT : 0;

  const lines: BudgetLine[] = [
    avant === "audit"
      ? { label: { fr: "Audit + roadmap", en: "Audit + roadmap" }, amount: AUDIT }
      : { label: ECHANGE_NAME, amount: 0, display: GRATUIT },
    {
      label: { fr: `${t.name.fr}, à partir de`, en: `${t.name.en}, from` },
      amount: t.priceValue,
    },
    {
      label: {
        fr: `Suivi, ${SUIVI_INCLUS_MOIS} premiers mois`,
        en: `Care, first ${SUIVI_INCLUS_MOIS} months`,
      },
      amount: 0,
      display: { fr: "Inclus", en: "Included" },
    },
    {
      label: {
        fr: `Suivi Essentiel, ${MOIS_FACTURES} mois suivants`,
        en: `Essential care, next ${MOIS_FACTURES} months`,
      },
      amount: MOIS_FACTURES * essentiel,
    },
  ];

  return {
    lines,
    total: amont + t.priceValue + MOIS_FACTURES * essentiel,
    periode: PREMIERE_ANNEE,
    variante: {
      label: {
        fr: "Avec le palier Actif après les mois inclus",
        en: "With the Active tier after the included months",
      },
      total: amont + t.priceValue + MOIS_FACTURES * actif,
    },
  };
}

const BUDGET_DEVIS: PackBudget = {
  lines: [
    { label: { fr: "Analyse du site", en: "Site analysis" }, amount: 0, display: GRATUIT },
    { label: ECHANGE_NAME, amount: 0, display: GRATUIT },
  ],
  total: 0,
  periode: { fr: "sans engagement", en: "no commitment" },
  variante: {
    label: { fr: "Avec l'audit + roadmap", en: "With the audit + roadmap" },
    total: AUDIT,
  },
};

// Pack Audit (ADR-022) : rétabli après une coupe accidentelle lors de
// l'ADR-023. L'analyse gratuite, puis l'audit + roadmap, en une fois.
const BUDGET_AUDIT: PackBudget = {
  lines: [
    { label: { fr: "Analyse du site", en: "Site analysis" }, amount: 0, display: GRATUIT },
    { label: { fr: "Audit + roadmap", en: "Audit + roadmap" }, amount: AUDIT },
  ],
  total: AUDIT,
  periode: { fr: "en une fois", en: "one-off" },
};

const ESSENTIEL_WP = maintenanceMonthly("essentiel", "wordpress");

const BUDGET_SUIVI: PackBudget = {
  lines: [
    { label: { fr: "Analyse du site", en: "Site analysis" }, amount: 0, display: GRATUIT },
    {
      label: { fr: "Mise sous suivi, une fois", en: "Care onboarding, once" },
      amount: MAINTENANCE_ONBOARDING_VALUE,
    },
    {
      label: { fr: "Suivi Essentiel, 12 mois", en: "Essential care, 12 months" },
      amount: 12 * ESSENTIEL_WP,
    },
  ],
  total: MAINTENANCE_ONBOARDING_VALUE + 12 * ESSENTIEL_WP,
  periode: PREMIERE_ANNEE,
  variante: {
    label: {
      fr: "Payé à l'année, deux mois offerts",
      en: "Paid yearly, two months free",
    },
    total: MAINTENANCE_ONBOARDING_VALUE + (12 - MAINTENANCE_ANNUAL_FREE_MONTHS) * ESSENTIEL_WP,
  },
};

const BUDGET_EXPERT: PackBudget = {
  lines: [
    { label: { fr: "Audit + roadmap", en: "Audit + roadmap" }, amount: AUDIT },
    {
      label: {
        fr: `Palier ${REFERENT.name.fr}, ${CTO_MIN_MONTHS} mois`,
        en: `${REFERENT.name.en} tier, ${CTO_MIN_MONTHS} months`,
      },
      amount: CTO_MIN_MONTHS * REFERENT.price,
    },
  ],
  total: AUDIT + CTO_MIN_MONTHS * REFERENT.price,
  periode: {
    fr: `les ${CTO_MIN_MONTHS} premiers mois`,
    en: `the first ${CTO_MIN_MONTHS} months`,
  },
  variante: {
    label: {
      fr: `Avec le palier ${DIRECTION.name.fr}`,
      en: `With the ${DIRECTION.name.en} tier`,
    },
    total: AUDIT + CTO_MIN_MONTHS * DIRECTION.price,
  },
};

// ─── Textes partagés par les pages ──────────────────────────────────────────

const FAQ_REFERENCEMENT = {
  question: "Que devient mon référencement ?",
  answer:
    "Les adresses de vos pages sont conservées ou redirigées une à une : aucune page perdue, aucun référencement perdu. Le score de vitesse est mesuré avant et après.",
};

const INCLUS_PRESTATION = [
  "Première analyse de veille technique et stratégique",
  "Échange de 15 minutes gratuit avant de décider",
  `${SUIVI_INCLUS_MOIS} mois de suivi inclus`,
  "Veille en continu dans le suivi, Sentinelle incluse",
  "Prix et délai écrits avant de commencer",
];

const fr = (value: number) => formatEuros(value, "fr");

/** Une variante de la Refonte (sur mesure ou headless, ADR-031), lue dans lib/trajectoires.ts. */
function varianteRefonte(slug: VarianteSlug): Variante {
  const v = TRAJECTOIRES["forfait-headless"].variantes?.find((x) => x.slug === slug);
  if (!v) throw new Error(`Variante de la Refonte introuvable : ${slug}`);
  return v;
}

// ─── Les sept situations ─────────────────────────────────────────────────────

export const SITUATIONS: Situation[] = [
  {
    slug: "devis-a-juger",
    lienExterne: ECHANGE_URL,
    besoin: "decider",
    nom: { fr: "Arbitrage", en: "Decision" },
    sousTitre: { fr: "Conseil rapide en visio", en: "Quick advice on a video call" },
    phrase: {
      fr: "J'ai un devis à juger, ou une décision à prendre",
      en: "I have a quote to assess, or a decision to make",
    },
    offre: ECHANGE_NAME,
    resultat: {
      fr: "Savoir par où commencer : garder, faire évoluer ou refaire, et ce qu'il faut vérifier.",
      en: "Know where to start: keep, evolve or rebuild, and what needs checking.",
    },
    steps: [
      STEP_ANALYSE,
      {
        ...STEP_ECHANGE,
        quand: "pendant",
        detail: {
          fr: "Quinze minutes en visio sur votre situation réelle : le devis, la décision, ce qu'il faut vérifier et par où commencer.",
          en: "Fifteen minutes on a video call about your actual situation: the quote, the decision, what needs checking and where to start.",
        },
      },
      {
        ...STEP_AUDIT,
        quand: "apres",
        detail: {
          fr: "Si la décision engage un budget : rapport d'audit, préconisations chiffrées, roadmap par étapes. Le document vous sert quel que soit le prestataire.",
          en: "If the decision commits a budget: audit report, costed recommendations, step-by-step roadmap. The document serves you whoever does the work.",
        },
      },
    ],
    budget: BUDGET_DEVIS,
    page: {
      // Requête de SITUATION (le devis à juger). La requête d'OFFRE (« conseil
      // refonte », « visio conseil », « audit ») appartient à /conseil : ni son
      // titre (« un avis tranché avant d'engager un budget ») ni ses mots-clés
      // ne sont repris ici.
      metaTitle: "Devis de refonte à juger : garder, faire évoluer ou refaire ?",
      metaDescription: `Un devis de refonte sur la table, ou une décision à prendre sur votre site ? Analyse gratuite, échange de 15 minutes gratuit, puis un audit documenté si la décision engage un budget.`,
      keywords: [
        "second avis devis site internet",
        "juger un devis de refonte",
        "comparer des devis de refonte",
        "devis refonte site web que vérifier",
        "garder ou refaire son site",
      ],
      titre: { avant: "Un devis à juger ? Parlons-en ", accent: "avant de signer", apres: "." },
      promesse:
        "Un devis sur la table, une refonte qu'on vous propose, une décision à prendre : il vous faut un avis qui ne vend rien. Quinze minutes gratuites pour poser la situation ; si la décision engage un budget, l'audit + roadmap la documente par écrit.",
      preuve: {
        titre: "Des arbitrages écrits, pas des impressions",
        texte:
          "Chaque étude de cas publiée explique l'arbitrage : les options qui étaient sur la table, celle qui a été retenue, et pourquoi. C'est le même raisonnement que vous recevez, à l'oral puis, avec l'audit, par écrit.",
        lien: "Voir les études de cas",
        href: "/etudes-de-cas",
      },
      inclus: [
        "Première analyse de veille dans l'audit + roadmap",
        "Échange de 15 minutes gratuit, sans engagement",
        "Document utilisable avec n'importe quel prestataire",
      ],
      faq: [
        {
          question: "Échange ou audit : par où commencer ?",
          answer:
            "Par l'échange de 15 minutes : il est gratuit et pose la situation. L'audit + roadmap va au fond : rapport d'audit, préconisations chiffrées et plan par étapes. Si la décision engage un budget, l'audit la documente.",
        },
        {
          question: "L'avis est-il indépendant ?",
          answer:
            "Oui. L'échange dit par où commencer, que la suite me soit confiée ou non. L'audit est rédigé pour être utilisé par n'importe quel prestataire, et il rend les devis comparables entre eux.",
        },
        {
          question: "Que faut-il préparer ?",
          answer:
            "L'adresse du site, le devis ou la proposition en cours, et vos notes de projet s'il y en a. Les quinze minutes servent alors à la décision, pas à la découverte.",
        },
      ],
      contactHref: "/contact?sujet=decision-techno",
    },
  },

  {
    slug: "etat-des-lieux",
    besoin: "decider",
    nom: { fr: "Audit + roadmap", en: "Audit + roadmap" },
    sousTitre: { fr: "Diagnostic complet", en: "Full diagnostic" },
    phrase: {
      fr: "Je prépare une décision qui engage un budget",
      en: "I am preparing a decision that commits a budget",
    },
    offre: { fr: "Audit + roadmap", en: "Audit + roadmap" },
    resultat: {
      fr: "Un état des lieux vérifiable et un plan par étapes, chiffré, avant de signer quoi que ce soit.",
      en: "A verifiable assessment and a costed, step-by-step plan, before you sign anything.",
    },
    steps: [
      STEP_ANALYSE,
      { ...STEP_AUDIT, quand: "pendant" },
      {
        quand: "apres",
        offre: { fr: "Expert technique externalisé", en: "Outsourced technical expert" },
        detail: {
          fr: `Si les décisions reviennent tous les mois : la roadmap devient celle du contrat. Premier mois du palier ${REFERENT.name.fr} offert si le contrat démarre dans les 30 jours suivant la restitution.`,
          en: `If decisions come up every month: the roadmap becomes the contract's. First month of the ${REFERENT.name.en} tier free if the contract starts within 30 days of the handover.`,
        },
        prix: parMois(REFERENT.price),
        href: CTO_PATH,
      },
    ],
    budget: BUDGET_AUDIT,
    page: {
      // Requête de SITUATION (une décision qui engage un budget, plusieurs
      // chantiers à ordonner). La requête d'OFFRE (« audit site WordPress »,
      // « audit et roadmap site web ») appartient à /conseil : aucun de ses
      // mots-clés n'est repris ici.
      metaTitle: "Avant d'engager un budget web : l'état des lieux et le plan",
      metaDescription: `Une décision qui engage un budget sur votre site ? Un état des lieux vérifiable, des préconisations chiffrées et un plan par étapes, remis par écrit. ${fr(AUDIT)} HT.`,
      keywords: [
        "état des lieux site web avant refonte",
        "plan de refonte par étapes",
        "chiffrer une refonte de site",
        "prioriser les chantiers de son site",
        "préparer un cahier des charges de refonte",
      ],
      titre: { avant: "Un état des lieux et un plan, ", accent: "avant d'engager un budget", apres: "." },
      promesse:
        "Plusieurs chantiers sur la table, un budget à engager, et rien d'écrit pour trancher : il vous faut un état des lieux vérifiable et un ordre de priorités. Un rapport d'audit, des préconisations chiffrées et une roadmap par étapes, remis dans votre espace en ligne.",
      prestation: {
        description:
          "Un état des lieux complet de votre site, puis un plan pour décider. J'analyse ce que voient vos visiteurs, ce qui tourne en coulisses et ce qui bouge autour de votre site ; je chiffre ce qu'il faut faire, dans quel ordre ; je vous présente le tout en visio. Vous repartez avec un document écrit, utilisable avec n'importe quel prestataire.",
        livrables: [
          {
            titre: "Audit complet",
            sousTitre: "Livrable : rapport d'audit et première analyse de veille",
            cartes: [
              {
                titre: "Rapport d'audit",
                detail:
                  "Performance (les trois mesures de vitesse que Google utilise pour classer votre site), sécurité, dette technique (ce qui coûte un peu chaque mois et beaucoup le jour où ça casse), extensions et hébergement. Chaque constat est daté et vérifiable.",
              },
              {
                titre: "Première analyse de veille technique et stratégique",
                detail:
                  "Ce qui bouge autour de votre site et de votre secteur : fins de support, évolutions des outils, pratiques de vos concurrents, et ce que ça change pour la suite.",
              },
            ],
          },
          {
            titre: "Préconisations",
            sousTitre: "Livrable : préconisations chiffrées et roadmap par étapes",
            cartes: [
              {
                titre: "Préconisations chiffrées",
                detail:
                  "Pour chaque chantier : ce qu'il faut faire, pourquoi, son coût estimé et son délai. Garder, faire évoluer ou refaire : la direction est tranchée par écrit.",
              },
              {
                titre: "Roadmap par étapes",
                detail:
                  "Les chantiers dans l'ordre où les mener, priorisés et budgétés, pour engager votre budget étape par étape plutôt qu'en une fois.",
              },
            ],
          },
          {
            titre: "1 h de restitution en visio",
            detail:
              "Je vous présente les conclusions, je réponds à vos questions et on arbitre ensemble les priorités. Vous repartez avec une décision, pas seulement un rapport.",
          },
          {
            titre: "Espace client",
            sousTitre: "Livrables et veille accessibles en continu",
            detail:
              "Rapport, préconisations et roadmap restent consultables dans votre espace client, et vous servent même si la prestation est confiée à quelqu'un d'autre.",
          },
        ],
      },
      preuve: {
        titre: "Des arbitrages écrits, pas des impressions",
        texte:
          "Chaque étude de cas publiée explique l'arbitrage : les options qui étaient sur la table, celle qui a été retenue, et pourquoi. L'audit vous remet le même raisonnement, appliqué à votre site.",
        lien: "Voir les études de cas",
        href: "/etudes-de-cas",
      },
      inclus: [
        "Première analyse de veille technique et stratégique",
        "Rapport d'audit : performance, sécurité, dette technique, extensions, hébergement",
        "Préconisations chiffrées et roadmap priorisée",
        "1 h de restitution en visio",
        "Document utilisable avec n'importe quel prestataire",
        "Remis dans votre espace en ligne",
      ],
      faq: [
        {
          question: "Audit ou échange de 15 minutes : par où commencer ?",
          answer: `Si vous hésitez encore sur la direction, l'échange de 15 minutes, gratuit, la pose. Si la décision engage un budget ou plusieurs chantiers, l'audit la documente : état des lieux, préconisations chiffrées, plan par étapes.`,
        },
        {
          question: "L'audit m'engage-t-il pour la suite ?",
          answer:
            "Non. Le rapport et la roadmap vous appartiennent et sont rédigés pour être utilisés par n'importe quel prestataire. Ils rendent aussi les devis comparables entre eux.",
        },
        {
          question: "Que faut-il préparer ?",
          answer:
            "L'adresse du site, les accès en lecture si vous pouvez les donner, les devis ou propositions en cours et vos notes de projet. Le reste, je le relève.",
        },
      ],
      contactHref: "/contact?sujet=decision-techno",
    },
  },

  {
    slug: "site-wordpress-ingerable",
    besoin: "refaire",
    nom: TRAJECTOIRES["forfait-classique"].name,
    phrase: {
      fr: "Mon site est devenu ingérable : extensions empilées, mises à jour qui cassent",
      en: "My site has become unmanageable: piled-up plugins, updates that break",
    },
    offre: TRAJECTOIRES["forfait-classique"].name,
    resultat: {
      fr: "Votre WordPress actuel, assaini et plus rapide, moins de mises à jour à surveiller.",
      en: "Your current WordPress, cleaned up and faster, fewer updates to watch.",
    },
    steps: [
      STEP_ECHANGE,
      stepTrajectoire("forfait-classique", {
        fr: "Votre site actuel remis à niveau, sans reconstruction : vitesse, ménage des extensions, sécurité, hébergement. Vous gardez votre thème et vos habitudes de publication.",
        en: "Your current site brought up to standard, no rebuild: speed, plugin clean-up, security, hosting. You keep your theme and your publishing habits.",
      }),
      stepSuivi("wordpress"),
    ],
    budget: budgetTrajectoire("forfait-classique", "echange"),
    page: {
      metaTitle: "Site WordPress ingérable : l'assainir sans changer d'outil",
      metaDescription: `Extensions empilées, mises à jour qui cassent, site qui ralentit : votre WordPress actuel assaini, sans reconstruction, à partir de ${fr(TRAJECTOIRES["forfait-classique"].priceValue)} HT, ${SUIVI_INCLUS_MOIS} mois de suivi inclus.`,
      // Requête de SITUATION. La requête d'OFFRE (« optimisation site
      // WordPress », « refonte site WordPress prix ») appartient à
      // /solutions-web.
      keywords: [
        "site WordPress ingérable",
        "trop d'extensions WordPress",
        "mise à jour WordPress qui casse le site",
        "assainir un site WordPress",
        "optimiser un site WordPress existant",
      ],
      titre: { avant: "Un WordPress assaini, ", accent: "sans changer d'outil", apres: "." },
      promesse:
        "Le problème, c'est l'empilement d'extensions et le manque d'entretien, pas WordPress. Je garde votre site et son thème, et je le remets à niveau : moins d'extensions, moins de mises à jour, moins de failles, moins de pannes. Rien n'est reconstruit ; votre équipe garde ses habitudes de publication.",
      solution: {
        detail:
          "Je repars de votre WordPress existant et je le garde tel qu'il est construit, thème compris. Je règle la vitesse (cache, images, requêtes), je retire les extensions redondantes, je fais les mises à jour en retard, je durcis la sécurité et je vérifie l'hébergement, ou j'en change s'il freine le site. Vos contenus, les adresses de vos pages et vos habitudes de publication restent en place : le site redevient rapide et plus facile à mettre à jour.",
        stack:
          "Votre WordPress actuel, même thème : réglages de performance et cache, audit et ménage des extensions, mises à jour, sécurité durcie, hébergement vérifié ou changé. Vitesse mesurée avant et après.",
        situations: [
          "Les mises à jour d'extensions cassent régulièrement une page.",
          "Les extensions se sont empilées au fil des années, et personne ne sait plus lesquelles servent.",
          "Le site est lent, mais son design vous convient encore.",
          "Vous voulez un site sain sans le reconstruire, ni changer d'outil ou de façon de travailler.",
        ],
      },
      preuve: {
        caseStudy: "proditec",
        titre: "Proditec : le score de vitesse Google, avant et après",
        texte:
          "Un site WordPress refait sans changer d'outil, mesuré avant et après la mise en ligne.",
        lien: "Voir l'étude de cas",
        href: "/etudes-de-cas/proditec",
      },
      inclus: INCLUS_PRESTATION,
      faq: [
        {
          question: "Faut-il quitter WordPress ?",
          answer:
            "Non. Si le problème vient des extensions et du manque d'entretien, WordPress reste le bon outil : je garde votre site, je retire ce qui l'alourdit, et votre équipe continue de publier comme avant.",
        },
        FAQ_REFERENCEMENT,
        {
          question: "Et si l'optimisation ne suffit pas ?",
          answer: `L'échange de 15 minutes le dit avant que vous engagiez un budget. Si le thème lui-même bloque, ou si le site reste lent une fois remis à niveau, la réponse est la ${TRAJECTOIRES["forfait-headless"].name.fr} : le site est reconstruit, en WordPress sur mesure ou en WordPress headless selon votre situation, et votre équipe publie toujours dans WordPress.`,
        },
      ],
      contactHref: "/contact?sujet=mise-en-oeuvre",
    },
  },

  {
    slug: "site-wordpress-lent",
    besoin: "refaire",
    nom: TRAJECTOIRES["forfait-headless"].name,
    phrase: {
      fr: "Mon site est lent ou daté, et mon équipe publie dans WordPress",
      en: "My site is slow or dated, and my team publishes in WordPress",
    },
    offre: TRAJECTOIRES["forfait-headless"].name,
    resultat: {
      fr: "Un site reconstruit, rapide et moderne. Votre équipe publie toujours dans WordPress.",
      en: "A rebuilt, fast, modern site. Your team still publishes in WordPress.",
    },
    recommended: true,
    steps: [
      STEP_ECHANGE,
      stepTrajectoire("forfait-headless", {
        fr: "Le site est reconstruit, en WordPress sur mesure ou en WordPress headless selon votre situation. Vos rédacteurs publient toujours dans WordPress.",
        en: "The site is rebuilt, as custom WordPress or headless WordPress depending on your situation. Your editors still publish in WordPress.",
      }),
      // Plancher : WordPress sur mesure (ADR-031). Le suivi d'un site headless
      // est plus cher : la FAQ le dit.
      stepSuivi("wordpress"),
    ],
    budget: budgetTrajectoire("forfait-headless", "echange"),
    page: {
      metaTitle: "Site WordPress lent ou daté : le refaire sans tout changer",
      metaDescription: `Site WordPress lent ou daté, une équipe qui y publie chaque jour ? Reconstruit en WordPress sur mesure ou headless, même outil, à partir de ${fr(TRAJECTOIRES["forfait-headless"].priceValue)} HT, ${SUIVI_INCLUS_MOIS} mois de suivi inclus.`,
      // Requête de SITUATION (le site lent). Les requêtes d'OFFRE et de
      // TECHNIQUE (« refonte WordPress headless », « WordPress headless »,
      // « Core Web Vitals WordPress ») appartiennent à /solutions-web et à la
      // page pilier /wordpress-headless.
      keywords: [
        "site WordPress lent",
        "site WordPress trop lent que faire",
        "accélérer site WordPress",
        "temps de chargement site WordPress",
        "refaire un site WordPress",
      ],
      titre: { avant: "Un site refait. Votre équipe publie ", accent: "comme avant", apres: "." },
      promesse:
        "Je reconstruis votre site, et vos rédacteurs publient toujours dans WordPress. Deux variantes, à égalité, choisies selon votre situation : WordPress sur mesure, un thème écrit pour votre site ; ou WordPress headless, le site affiché refait avec Next.js.",
      solution: {
        detail:
          "Je reconstruis tout ce que voient vos visiteurs, et WordPress reste l'espace où votre équipe publie. WordPress sur mesure : un thème écrit pour votre site, léger, avec le strict nécessaire en extensions ; un seul outil à tenir, un suivi qui reste léger. WordPress headless : WordPress ne sert plus qu'à publier, et le site affiché est reconstruit à part, relié par une API (une passerelle de données) ; c'est le choix quand la vitesse, le design ou le trafic sont décisifs. Dans les deux cas, la publication ne change pas et le référencement est repris page par page.",
        stack:
          "Sur mesure : WordPress classique (le même outil gère l'administration et l'affichage), thème écrit pour le site, extensions réduites au nécessaire. Headless : WordPress pour publier et Next.js (un outil de construction de sites rapides) pour le site affiché, pages calculées à l'avance et servies par un CDN (un réseau de serveurs proches de vos visiteurs), contenus lus par WPGraphQL ou l'API REST de WordPress.",
        situations: [
          "Le site est lent et le score de vitesse Google est dans le rouge.",
          "Votre équipe publie chaque semaine et ne veut pas changer d'outil.",
          "Le design date, et chaque retouche du thème coûte cher.",
          "Le site porte votre image auprès de clients ou de partenaires exigeants.",
        ],
      },
      preuve: {
        caseStudy: "comme-des-fous",
        titre: "Comme des fous : plus rapide, sans interruption pour les rédacteurs",
        texte:
          "Un site éditorial refait en WordPress headless : le back-office n'a pas changé, le score de vitesse Google a été mesuré avant et après.",
        lien: "Voir l'étude de cas",
        href: "/etudes-de-cas/comme-des-fous",
      },
      inclus: INCLUS_PRESTATION,
      faq: [
        {
          question: "Mon équipe devra-t-elle réapprendre à publier ?",
          answer:
            "Non. Dans les deux variantes, votre équipe publie toujours dans WordPress : mêmes gestes, mêmes habitudes. Ce que voient vos visiteurs est refait.",
        },
        {
          question: "Sur mesure ou headless : comment choisir ?",
          answer: `Les deux se valent ; c'est votre situation qui tranche. WordPress sur mesure (à partir de ${fr(varianteRefonte("sur-mesure").priceValue)} HT) quand WordPress convient à votre équipe et que le budget de suivi doit rester léger. WordPress headless (à partir de ${fr(varianteRefonte("headless").priceValue)} HT) quand la vitesse, le design ou le trafic sont décisifs, et que le site doit pouvoir grandir. L'échange de 15 minutes sert à le dire avant le devis.`,
        },
        {
          question: "Pourquoi le suivi d'un site headless coûte-t-il plus ?",
          answer: `Un site headless compte deux environnements à tenir, le back-office WordPress et le site affiché, chacun avec ses mises à jour. Le palier Essentiel passe de ${fr(maintenanceMonthly("essentiel", "wordpress"))} HT par mois en WordPress sur mesure à ${fr(maintenanceMonthly("essentiel", "headless"))} HT par mois en headless.`,
        },
        FAQ_REFERENCEMENT,
      ],
      contactHref: "/contact?sujet=mise-en-oeuvre",
    },
  },

  {
    slug: "site-outil-de-travail",
    besoin: "refaire",
    nom: TRAJECTOIRES["forfait-webapp"].name,
    phrase: {
      fr: "Mon site est devenu un outil de travail",
      en: "My site has become a work tool",
    },
    offre: TRAJECTOIRES["forfait-webapp"].name,
    resultat: {
      fr: "Une plateforme web ou mobile, reliée à vos outils.",
      en: "A web or mobile platform, connected to your tools.",
    },
    steps: [
      STEP_AUDIT,
      stepTrajectoire("forfait-webapp", {
        fr: "Espace client, annuaire, réservation, paiement : une plateforme web ou mobile, reliée à vos outils.",
        en: "Client area, directory, booking, payment: a web or mobile platform, connected to your tools.",
      }),
      stepSuivi("webapp"),
    ],
    budget: budgetTrajectoire("forfait-webapp", "audit"),
    page: {
      metaTitle: "Site devenu outil de travail : passer à une plateforme sur mesure",
      metaDescription: `Espace client, annuaire, réservation, paiement : quand le site est devenu un outil de travail. Plateforme sur mesure à partir de ${fr(TRAJECTOIRES["forfait-webapp"].priceValue)} HT, cadrée par un audit.`,
      keywords: [
        "plateforme web sur mesure",
        "site avec espace client",
        "annuaire en ligne sur mesure",
        "web app métier",
        "application web PME",
      ],
      titre: { avant: "Un site qui travaille ", accent: "avec vos outils", apres: "." },
      promesse:
        "Espace client, annuaire, réservation, paiement : votre site n'est plus une vitrine, c'est un outil de travail. Je conçois une plateforme web ou mobile où vos outils (CRM, ERP, paiement) parlent au site.",
      solution: {
        detail:
          "Je conçois une application web sur mesure, cadrée par l'audit + roadmap : espace client, annuaire, réservation ou paiement, reliés à vos outils : CRM (le fichier clients), ERP (la gestion de l'entreprise), paiement. Le projet est découpé en étapes, chacune livrée et mesurée avant que la suivante démarre.",
        stack:
          "Next.js et TypeScript (un outil de construction d'applications web et un langage qui limite les erreurs), base de données et administration sur mesure pensées pour votre métier, sans WordPress. Application mobile possible en PWA (installable depuis le navigateur, sans passer par les stores). Mise en ligne automatisée à chaque évolution.",
        situations: [
          "Vos clients ou vos membres ont besoin d'un espace à eux.",
          "Des tâches passent encore par des tableurs, des e-mails ou des ressaisies.",
          "Le site doit parler à votre CRM, votre ERP ou votre outil de paiement.",
          "Le site gère des réservations, des inscriptions ou des abonnements.",
        ],
      },
      preuve: {
        caseStudy: "reseauteurs",
        titre: "Réseauteurs : une plateforme complète, du concept à la mise en ligne",
        texte:
          "Annuaire, agenda, carte interactive, comptes membres et abonnement payé en ligne : une plateforme livrée en un seul projet.",
        lien: "Voir l'étude de cas",
        href: "/etudes-de-cas/reseauteurs",
      },
      inclus: [
        "Première analyse de veille technique et stratégique",
        "Audit + roadmap avant le premier développement",
        `${SUIVI_INCLUS_MOIS} mois de suivi inclus`,
        "Veille en continu dans le suivi, Sentinelle incluse",
        "Prix et délai écrits avant de commencer",
      ],
      faq: [
        {
          question: "Pourquoi commencer par un audit ?",
          answer:
            "Parce qu'une plateforme engage un budget et des choix de structure. L'audit + roadmap documente l'existant, chiffre les scénarios et ordonne les étapes avant le premier développement.",
        },
        {
          question: "Faut-il tout refaire d'un coup ?",
          answer:
            "Non. La roadmap découpe le projet en étapes : chaque étape est livrée et mesurée avant que la suivante démarre.",
        },
        {
          question: "Une application mobile est-elle possible ?",
          answer:
            "Oui, sous forme de PWA : une application mobile sans passer par les stores.",
        },
      ],
      contactHref: "/contact?sujet=mise-en-oeuvre",
    },
  },

  {
    slug: "site-a-tenir",
    besoin: "tenir",
    nom: { fr: "Maintenance", en: "Maintenance" },
    phrase: {
      fr: "Mon site tourne, je veux qu'il le reste",
      en: "My site works, I want it to stay that way",
    },
    offre: { fr: "Suivi et maintenance", en: "Care and maintenance" },
    resultat: {
      fr: "Surveillance, sauvegardes, mises à jour vérifiées et rapport chaque mois.",
      en: "Monitoring, backups, checked updates and a report every month.",
    },
    steps: [
      STEP_ANALYSE,
      {
        quand: "pendant",
        offre: { fr: "Mise sous suivi", en: "Care onboarding" },
        detail: {
          fr: "L'état des lieux de démarrage : inventaire des composants, première sauvegarde, rattrapage des mises à jour. Offert pour un site que j'ai livré.",
          en: "The starting review: component inventory, first backup, pending updates applied. Free for a site I delivered.",
        },
        prix: {
          fr: `${formatEuros(MAINTENANCE_ONBOARDING_VALUE, "fr")} HT, une fois`,
          en: `${formatEuros(MAINTENANCE_ONBOARDING_VALUE, "en")} excl. VAT, once`,
        },
        href: `${PACKS_PATH}/site-a-tenir#paliers`,
      },
      {
        quand: "apres",
        offre: { fr: "Suivi et maintenance", en: "Care and maintenance" },
        detail: {
          fr: "Palier Essentiel : disponibilité surveillée, sauvegarde quotidienne, mises à jour vérifiées, rapport mensuel. Sentinelle incluse.",
          en: "Essential tier: uptime monitored, daily backup, checked updates, monthly report. Sentinelle included.",
        },
        prix: parMois(ESSENTIEL_WP),
        href: MAINTENANCE_PATH,
        veille: "continu",
      },
    ],
    budget: BUDGET_SUIVI,
    mensuel: ESSENTIEL_WP,
    sousTitre: {
      fr: "Surveillance et correctifs en continu",
      en: "Continuous monitoring and fixes",
    },
    page: {
      // Requête de SITUATION (le site que personne ne tient) et son parcours.
      // La requête d'OFFRE (« maintenance WordPress », « contrat de
      // maintenance », « maintenance site internet ») appartient à
      // /maintenance-wordpress : ni son titre (« surveillé, à jour et
      // sauvegardé ») ni la liste de ce qui est surveillé ne sont repris ici.
      metaTitle: "Votre site tourne, personne ne le tient : par où commencer",
      metaDescription: `Votre site fonctionne et personne ne le tient ? Le parcours : analyse gratuite, état des lieux, puis suivi mensuel, à partir de ${fr(ESSENTIEL_WP)} HT par mois.`,
      keywords: [
        "site WordPress sans maintenance",
        "site WordPress jamais mis à jour",
        "faire suivre son site WordPress",
        "reprise de maintenance site WordPress",
        "qui s'occupe de mon site WordPress",
      ],
      titre: {
        avant: "Votre site surveillé, à jour, sauvegardé. ",
        accent: "Et la preuve chaque mois",
        apres: ".",
      },
      promesse:
        "Votre site fonctionne, et personne ne le tient : les mises à jour attendent, les sauvegardes ne sont pas vérifiées. Je surveille le site, je le mets à jour, je le sauvegarde, et je vous rends compte chaque mois dans un rapport lisible sans être développeur.",
      sansBudget: true,
      sansPreuve: true,
      // Les paliers (№ 02) avant la veille (№ 03) : demande d'Agathe du 2026-09-27.
      paliersAvantVeille: true,
      offres: [
        {
          id: "composants",
          carte: "Les composants",
          kicker: "Suivi et maintenance",
          titre: { avant: "Ce que comprend ", accent: "le suivi" },
          description: "Surveillance, sauvegardes, mises à jour vérifiées et rapport chaque mois.",
          volets: [
        {
          titre: "Actions programmées",
          sousTitre: "Sauvegardes, mises à jour, correctifs",
          cartes: [
            {
              titre: "Sauvegardes",
              detail: "Une copie complète chaque jour, stockée hors de votre serveur, prête à être restaurée.",
            },
            {
              titre: "Mises à jour",
              detail:
                "WordPress, extensions et thème mis à jour chaque mois, chaque semaine au palier Actif, puis vérifiés : une mise à jour qui casse une page est annulée.",
            },
            {
              titre: "Correctifs",
              detail:
                "Chaque faille publiée sur un composant installé chez vous est corrigée : sous 72 h au palier Essentiel, sous 24 h ouvrées au palier Actif.",
            },
          ],
        },
        {
          titre: "Monitoring",
          sousTitre: "Surveillance continue de la disponibilité et des performances",
          cartes: [
            {
              titre: "Disponibilité",
              detail: "Votre site est testé en continu, jour et nuit. S'il tombe, je suis alertée tout de suite.",
            },
            {
              titre: "Performances",
              detail: "Le score de vitesse Google est relevé chaque mois : une dégradation se voit avant de se sentir.",
            },
            {
              titre: "Rapport mensuel",
              detail: "Les mesures s'affichent dans votre espace en ligne, section « État du site », avec leur date.",
            },
          ],
        },
        {
          titre: "Veille techno",
          sousTitre: "Information mensuelle sur les technos et les modifications nécessaires ou possibles sur votre site",
          cartes: [
            {
              titre: "Alertes",
              detail:
                "Les composants installés chez vous sont suivis : quand l'un d'eux devient un risque, fin de support ou faille publiée, une alerte part.",
            },
            {
              titre: "Lettres de veille",
              detail:
                "Deux lettres par mois disent ce que les évolutions changent pour votre site : ce qu'il faut modifier, et ce qui devient possible. Sentinelle incluse.",
            },
          ],
        },
          ],
        },
      ],
      preuve: {
        titre: "Cinq mesures, chaque mois dans votre espace",
        texte:
          "Disponibilité, sauvegardes, mises à jour, failles connues, vitesse : ce sont les mesures que votre espace en ligne affiche, avec leur date.",
        lien: "Voir l'espace en ligne",
        href: "/espace-client",
      },
      inclus: [
        "Veille en continu, Sentinelle incluse",
        "Rapport mensuel dans votre espace en ligne",
        "Engagement de 3 mois, puis au mois",
        "Deux mois offerts au paiement annuel",
        "Mise sous suivi offerte pour un site que j'ai livré",
      ],
      faq: [
        {
          question: "Mon site a été réalisé par quelqu'un d'autre, vous pouvez le suivre ?",
          answer:
            "Oui. Le suivi démarre par un état des lieux : inventaire des composants, première sauvegarde, rattrapage des mises à jour. S'il montre que le site n'est pas maintenable en l'état, je vous le dis, avec la prestation adaptée et son prix.",
        },
        {
          question: "Mon site est headless, ou c'est une web app : est-ce couvert ?",
          answer: `Oui, avec sa propre grille : ${fr(maintenanceMonthly("essentiel", "headless"))} HT par mois au palier Essentiel, ${fr(maintenanceMonthly("actif", "headless"))} HT au palier Actif. Deux environnements sont à tenir, chacun avec ses mises à jour.`,
        },
        {
          question: "Que se passe-t-il si j'arrête ?",
          answer:
            "Vous gardez vos accès, vos sauvegardes et l'historique de vos rapports, téléchargeable depuis votre espace en ligne. Après les trois premiers mois, l'arrêt se fait au mois.",
        },
      ],
      contactHref: MAINTENANCE_CONTACT_HREF,
    },
  },

  {
    slug: "decisions-techniques",
    besoin: "tenir",
    // Renommé le 2026-09-28 (demande d'Agathe) : le parcours porte le nom de
    // l'offre, avec une promesse en sous-titre ; ex-« Pilotage ».
    nom: { fr: "Expert technique externalisé", en: "Outsourced technical expert" },
    phrase: {
      fr: "Des décisions techniques reviennent tous les mois, personne pour les trancher",
      en: "Technical decisions come up every month, nobody to settle them",
    },
    offre: { fr: "Expert technique externalisé", en: "Outsourced technical expert" },
    resultat: {
      fr: "Une direction technique à temps partagé, sans recruter.",
      en: "Shared-time technical leadership, without hiring.",
    },
    steps: [
      {
        ...STEP_AUDIT,
        detail: {
          fr: "Aucun accompagnement ne démarre sans lui : il établit l'état des lieux et devient la roadmap du contrat.",
          en: "No retainer starts without it: it sets the baseline and becomes the roadmap of the contract.",
        },
      },
      {
        quand: "pendant",
        offre: { fr: "Expert technique externalisé", en: "Outsourced technical expert" },
        detail: {
          fr: `Palier ${REFERENT.name.fr} : un comité par mois, des arbitrages écrits sous 48 h, vos devis relus, votre roadmap tenue à jour.`,
          en: `${REFERENT.name.en} tier: one committee a month, written decisions within 48 h, your quotes reviewed, your roadmap kept current.`,
        },
        prix: parMois(REFERENT.price),
        href: CTO_PATH,
        veille: "continu",
      },
      {
        quand: "apres",
        offre: { fr: "Reconduction au mois", en: "Rolling monthly" },
        detail: {
          fr: `Après ${CTO_MIN_MONTHS} mois, l'accompagnement se poursuit au mois, avec un préavis de ${CTO_NOTICE_MONTHS} mois. Vos livrables vous appartiennent et se lisent sans moi.`,
          en: `After ${CTO_MIN_MONTHS} months, the retainer rolls monthly, with ${CTO_NOTICE_MONTHS} months' notice. Your deliverables belong to you and read without me.`,
        },
        prix: parMois(REFERENT.price),
        href: CTO_PATH,
      },
    ],
    budget: BUDGET_EXPERT,
    mensuel: REFERENT.price,
    // Le nom est désormais celui de l'offre (ADR-010) ; le sous-titre est la
    // promesse (demande d'Agathe du 2026-09-28).
    sousTitre: {
      fr: "Direction technique sans embaucher",
      en: "Technical leadership without hiring",
    },
    page: {
      h1: "Expert technique externalisé",
      h1Accent: "externalisé",
      sansBudget: true,
      sansParcours: true,
      sansPreuve: true,
      paliersAvantVeille: true,
      // Requête de SITUATION (les décisions qui reviennent, sans personne pour
      // les trancher) et son parcours. La requête d'OFFRE (« expert technique
      // externalisé », « directeur technique externalisé », « direction
      // technique à temps partagé ») appartient à /cto-externalise : aucun de
      // ses mots-clés n'est repris ici.
      metaTitle: "Devis, fin de support, prestataires : qui tranche chez vous ?",
      metaDescription: `Des décisions techniques chaque mois, et personne pour les trancher ? Un audit, puis un expert qui tranche par écrit, à partir de ${fr(REFERENT.price)} HT par mois.`,
      keywords: [
        "PME sans directeur technique",
        "décisions techniques sans directeur technique",
        "relire un devis technique",
        "piloter ses prestataires web",
        "fin de support que faire",
      ],
      titre: { avant: "Des décisions techniques tranchées, ", accent: "sans recruter", apres: "." },
      promesse:
        "Un devis à relire, une fin de support qui tombe, un prestataire à cadrer : les décisions reviennent tous les mois, et ce n'est le métier de personne chez vous. L'expert technique externalisé est une direction technique à temps partagé : quelqu'un qui décide, l'écrit, pilote vos prestataires et répond de ce qui est décidé.",
      preuve: {
        titre: "Des livrables, pas des conversations",
        texte:
          "Cartographie du système, roadmap datée et budgétée, relevé de décisions, revue de devis avec alternative chiffrée : tout vous appartient et se lit sans moi.",
        lien: "Voir les livrables",
        href: CTO_PATH,
      },
      inclus: [
        "Première analyse de veille dans l'audit préalable",
        "Veille dédiée en continu, une page par mois",
        "Arbitrages écrits sous 48 h",
        "Livrables dans votre espace en ligne",
        `Engagement de ${CTO_MIN_MONTHS} mois, puis au mois`,
        "100 % à distance",
      ],
      faq: [
        {
          question: "En quoi est-ce différent du suivi et maintenance ?",
          answer:
            "Le suivi et maintenance entretient l'existant : mises à jour, sauvegardes, corrections. L'expert technique externalisé décide de l'existant : faut-il maintenir, refaire ou remplacer, dans quel ordre et à quel budget. Les deux se complètent.",
        },
        {
          question: "Dois-je changer de prestataire ?",
          answer:
            "Non. Vous gardez vos prestataires, je vous aide à les piloter : leurs devis sont relus, leurs livrables sont contrôlés, leurs arbitrages sont tranchés.",
        },
        {
          question: "Je préfère un avis ponctuel. C'est possible ?",
          answer: `Oui, et c'est souvent le bon point de départ : l'échange de 15 minutes, gratuit, pose la situation, et l'audit + roadmap la documente si une seule décision est à trancher. L'accompagnement mensuel n'a de sens que si les décisions reviennent tous les mois.`,
        },
      ],
      contactHref: CTO_CONTACT_HREF,
    },
  },
];

// ─── Accès ──────────────────────────────────────────────────────────────────

/** Formes de veille présentes dans un pack, dans l'ordre du parcours. */
export function veilleDuPack(situation: Situation): VeilleMode[] {
  const modes = situation.steps.map((s) => s.veille).filter(Boolean) as VeilleMode[];
  return (["premiere-analyse", "continu"] as VeilleMode[]).filter((m) => modes.includes(m));
}

/** Les packs qui contiennent une forme de veille, dans l'ordre d'affichage. */
export function packsAvecVeille(mode: VeilleMode): Situation[] {
  return SITUATIONS.filter((s) => veilleDuPack(s).includes(mode));
}

/**
 * Prix d'entrée de l'offre au centre du pack, tel que le catalogue le publie :
 * « Gratuit », « 650 € HT », « À partir de 2 250 € HT », « À partir de 89 € HT
 * par mois ». C'est le prix des cartes et des listes (menu, home, /packs) :
 * le budget du parcours (packBudgetLabel) ne s'affiche que sur la page du pack
 * et sur /tarifs, où il est détaillé poste par poste.
 */
export function packPrixEntree(situation: Situation, lang: Lang): string {
  if (estGratuit(situation)) return lang === "en" ? "Free" : "Gratuit";
  const t = trajectoireDuPack(situation);
  const htSuffix = lang === "en" ? " excl. VAT" : " HT";
  if (t) {
    const amount = formatEuros(t.priceValue, lang);
    return lang === "en" ? `From ${amount}${htSuffix}` : `À partir de ${amount}${htSuffix}`;
  }
  if (situation.mensuel) {
    const amount = formatEuros(situation.mensuel, lang);
    return lang === "en"
      ? `From ${amount}${htSuffix} per month`
      : `À partir de ${amount}${htSuffix} par mois`;
  }
  return `${formatEuros(situation.budget.total, lang)}${htSuffix}`;
}

/** La prestation au centre du pack, quand c'en est une (Optimisation, Refonte, Évolution). */
export function trajectoireDuPack(situation: Situation): Trajectoire | undefined {
  return TRAJECTOIRE_ORDER.map((slug) => TRAJECTOIRES[slug]).find(
    (tr) => tr.name.fr === situation.offre.fr,
  );
}

export function getSituation(slug: string): Situation | undefined {
  return SITUATIONS.find((s) => s.slug === slug);
}

/** Les packs qui ont une page : ceux qui ne renvoient pas ailleurs. */
export function getSituationSlugs(): SituationSlug[] {
  return SITUATIONS.filter((s) => !s.lienExterne).map((s) => s.slug);
}

export function situationsDuBesoin(key: BesoinKey): Situation[] {
  return SITUATIONS.filter((s) => s.besoin === key);
}

export function getBesoin(key: BesoinKey): Besoin {
  return BESOINS.find((b) => b.key === key)!;
}

/** Une phrase du visiteur, entre guillemets : français « … », anglais “…”. */
export function citer(phrase: Bi, lang: Lang): string {
  return lang === "en" ? `“${phrase.en}”` : `« ${phrase.fr} »`;
}

/** Le nom affiché d'un parcours : « Refonte », “Redesign”, sans le mot « pack ». */
export function packNom(situation: Situation, lang: Lang): string {
  // Le mot « pack » ne s'affiche plus (demande d'Agathe du 2026-09-27) : le
  // nom seul, « Refonte », « Arbitrage ». Les adresses /packs restent.
  return situation.nom[lang];
}

/** Offre gratuite : mise en avant partout où elle s'affiche. */
export function estGratuit(situation: Situation): boolean {
  return situation.budget.total === 0;
}

export function packHref(slug: SituationSlug): string {
  return `${PACKS_PATH}/${slug}`;
}

/** Le lien d'un pack : sa page, ou son lien externe quand il n'en a pas. */
export function situationHref(situation: Situation): string {
  return situation.lienExterne ?? packHref(situation.slug);
}

/**
 * Pack sans somme de parcours (Maintenance, Pilotage : `page.sansBudget`) :
 * ses paliers disent le prix. Aucune somme annuelle ou semestrielle n'est
 * affichée pour eux, nulle part (demande d'Agathe du 2026-09-28) : partout où
 * un budget de parcours apparaîtrait, c'est le prix d'entrée mensuel.
 */
export function sansSommeDeParcours(situation: Situation): boolean {
  return Boolean(situation.page.sansBudget && situation.mensuel);
}

/** Budget d'un pack en une ligne : « 5 161 € HT la première année ». */
export function packBudgetLabel(situation: Situation, lang: Lang): string {
  if (sansSommeDeParcours(situation)) return packPrixEntree(situation, lang);
  const { total, periode } = situation.budget;
  if (total === 0) return `${GRATUIT[lang]}, ${periode[lang]}`;
  const amount = formatEuros(total, lang);
  return lang === "en"
    ? `${amount} excl. VAT, ${periode.en}`
    : `${amount} HT, ${periode.fr}`;
}

/** Version courte, pour les badges du menu : « 5 161 € HT ». */
export function packBudgetShort(situation: Situation, lang: Lang): string {
  if (sansSommeDeParcours(situation)) return packPrixEntree(situation, lang);
  if (situation.budget.total === 0) return GRATUIT[lang];
  const amount = formatEuros(situation.budget.total, lang);
  return lang === "en" ? amount : `${amount} HT`;
}
