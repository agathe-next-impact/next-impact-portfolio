// ─────────────────────────────────────────────────────────────────────────────
// Offre « Suivi et maintenance » — source unique (charte v1.4, ADR-012).
//
// Deuxième marche du moment « Tenir », entre Sentinelle (prévenir, 19 €/mois)
// et l'Expert technique externalisé (décider, lib/cto-externalise.ts). Page
// d'offre : /maintenance-wordpress. Tout ce qui cite l'offre (home, mega menu,
// /tarifs, bandeaux, JSON-LD, llms) lit ce fichier : aucun prix recopié.
//
// Ce qui est surveillé correspond à ce que l'espace en ligne sait déjà montrer
// (section « État du site » + « Rapports », alimentées par WP Umbrella) :
// disponibilité, sauvegardes, mises à jour, failles connues, score de vitesse.
// Ne rien promettre ici que l'espace ne sache afficher.
//
// Règles de charte (§3) : « vous » / « je », jamais « nous », aucun tiret
// cadratin, prix avec espace insécable, « à partir de ».
// ─────────────────────────────────────────────────────────────────────────────

/**
 * ⚠️ Les prix ci-dessous sont des HYPOTHÈSES proposées le 2026-09-27, pas des
 * tarifs validés. Tant que ce drapeau vaut false, /maintenance-wordpress est en
 * noindex, hors sitemap et hors llms.txt / llms-full.txt. Le passer à true
 * (après validation d'Agathe) réexpose la page ; penser alors à réintégrer
 * l'entrée sitemap et les lignes llms (cf. ADR-012).
 */
export const MAINTENANCE_PRIX_VALIDES = false;

export const MAINTENANCE_PATH = "/maintenance-wordpress";

/** Deep-link du formulaire de contact, pré-sélectionne le sujet dédié. */
export const MAINTENANCE_CONTACT_HREF = "/contact?sujet=maintenance";

/** Plancher de la gamme (palier Essentiel), en valeur brute (JSON-LD, llms). */
export const MAINTENANCE_PRICE_VALUE = 89;
export const MAINTENANCE_PRICE_CURRENCY = "EUR";
/** Unité de facturation UN/CEFACT : « MON » = par mois. */
export const MAINTENANCE_BILLING_UNIT_CODE = "MON";

/** Prix d'entrée formaté, toujours « à partir de ». */
export const MAINTENANCE_PRICE = {
  fr: { amount: "À partir de 89 € HT", period: "par mois" },
  en: { amount: "From €89 excl. VAT", period: "per month" },
} as const;

/** Libellé court pour les pastilles et badges (« dès 89 € HT/mois »). */
export const MAINTENANCE_PRICE_SHORT = {
  fr: "dès 89 € HT/mois",
  en: "from €89/mo",
} as const;

/** Mise sous suivi : état des lieux d'entrée, facturé une fois. */
export const MAINTENANCE_ONBOARDING = {
  fr: {
    title: "Démarrage : l'état des lieux de votre site",
    price: "290 € HT, une fois",
    body: "Inventaire des composants, première sauvegarde, rattrapage des mises à jour, fiche du site dans votre espace en ligne. Offert pour un site que j'ai livré. Si le site n'est pas maintenable en l'état, l'état des lieux le dit, et vous oriente vers la trajectoire adaptée.",
  },
  en: {
    title: "Getting started: a review of your site",
    price: "€290 excl. VAT, once",
    body: "Component inventory, first backup, pending updates applied, your site's record in your online workspace. Free for a site I delivered. If the site cannot be maintained as it stands, the review says so and points to the right trajectory.",
  },
} as const;

/** Mois de suivi Essentiel inclus dans chaque forfait de refonte ou de création. 0 = ne pas l'afficher. */
export const SUIVI_INCLUS_MOIS = 3;

export const SUIVI_INCLUS_LABEL = {
  fr: `${SUIVI_INCLUS_MOIS} mois de suivi inclus`,
  en: `${SUIVI_INCLUS_MOIS} months of care included`,
} as const;

export const MAINTENANCE_COMMITMENT = {
  fr: "Engagement de 3 mois, puis au mois. Paiement à l'année : deux mois offerts.",
  en: "Three-month commitment, then monthly. Paid yearly: two months free.",
} as const;

/** Nombre maximal de sites suivis en même temps. */
export const MAINTENANCE_MAX_SITES = 20;

export interface MaintenanceTier {
  id: "essentiel" | "actif";
  name: { fr: string; en: string };
  price: { fr: string; en: string };
  priceValue: number;
  forWhom: { fr: string; en: string };
  items: { fr: string[]; en: string[] };
  recommended?: boolean;
}

export const MAINTENANCE_TIERS: MaintenanceTier[] = [
  {
    id: "essentiel",
    name: { fr: "Essentiel", en: "Essential" },
    price: { fr: "89 € HT par mois", en: "€89 excl. VAT per month" },
    priceValue: 89,
    forWhom: {
      fr: "Un site vitrine WordPress qui doit tourner sans que vous y pensiez.",
      en: "A WordPress showcase site that must run without you thinking about it.",
    },
    items: {
      fr: [
        "Disponibilité surveillée jour et nuit, alerte en cas de panne",
        "Sauvegarde quotidienne, stockée hors de votre serveur",
        "Mises à jour chaque mois, vérifiées après passage",
        "Faille critique corrigée sous 72 h",
        "Rapport mensuel dans votre espace en ligne",
        "Sentinelle incluse : lettres de veille et alertes",
        "30 minutes d'intervention par mois",
      ],
      en: [
        "Uptime monitored day and night, alert on outage",
        "Daily backup, stored off your server",
        "Monthly updates, checked after they run",
        "Critical vulnerability fixed within 72 h",
        "Monthly report in your online workspace",
        "Sentinelle included: watch letters and alerts",
        "30 minutes of work per month",
      ],
    },
  },
  {
    id: "actif",
    name: { fr: "Actif", en: "Active" },
    price: { fr: "229 € HT par mois", en: "€229 excl. VAT per month" },
    priceValue: 229,
    forWhom: {
      fr: "Un site qui compte : demandes de contact, formulaires, contenus publiés chaque semaine. Obligatoire pour un site headless.",
      en: "A site that matters: leads, forms, content published weekly. Required for a headless site.",
    },
    items: {
      fr: [
        "Tout le palier Essentiel",
        "Mises à jour chaque semaine",
        "Faille corrigée sous 24 h ouvrées",
        "Restauration incluse en cas d'incident",
        "Score de vitesse suivi chaque mois",
        "2 heures d'intervention par mois : petites évolutions, contenus, réglages",
        "Une revue de 30 minutes en visio chaque trimestre",
      ],
      en: [
        "Everything in Essential",
        "Weekly updates",
        "Vulnerability fixed within 24 business hours",
        "Restore included after an incident",
        "Speed score tracked every month",
        "2 hours of work per month: small changes, content, settings",
        "A 30-minute video review every quarter",
      ],
    },
    recommended: true,
  },
];
