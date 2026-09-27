import { formatEuros, type Lang, type SiteKind } from "@/lib/trajectoires";

// ─────────────────────────────────────────────────────────────────────────────
// Offre « Suivi et maintenance » : source unique (charte v1.6, ADR-012 amendé
// par l'ADR-013 puis l'ADR-014).
//
// Première marche du moment « Gérer » (entretenir), avant l'Expert technique
// externalisé (piloter, lib/cto-externalise.ts). UNE ligne du catalogue, deux
// paliers ; la mise sous suivi est sa condition de démarrage, pas une offre.
// Sentinelle y est incluse et se dit en pastille. Page d'offre :
// /maintenance-wordpress. Tout ce qui cite l'offre (home, mega menu, /tarifs,
// packs, bandeaux, JSON-LD, llms) lit ce fichier : aucun prix recopié.
//
// Le prix dépend du type de site (ADR-014) : un site headless ou une web app
// compte deux environnements à tenir, d'où une grille plus haute. Cette grille
// remplace l'ancienne règle « palier Actif obligatoire en headless » : les deux
// paliers existent pour chaque type de site.
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
 * Prix des deux paliers validés par Agathe le 2026-09-27 (ADR-014). La page
 * /maintenance-wordpress est indexable, présente au sitemap et dans llms.txt.
 * Repasser ce drapeau à false la remet en noindex, et avec elle les pages de
 * pack qui affichent un budget de suivi. Mise sous suivi (290 € HT) validée le
 * même jour (ADR-018).
 */
export const MAINTENANCE_PRIX_VALIDES = true;

export const MAINTENANCE_PATH = "/maintenance-wordpress";

/** Deep-link du formulaire de contact, pré-sélectionne le sujet dédié. */
export const MAINTENANCE_CONTACT_HREF = "/contact?sujet=maintenance";

export type MaintenanceTierId = "essentiel" | "actif";

/** Grille mensuelle, en euros hors taxes, par type de site et par palier. */
export const MAINTENANCE_GRID: Record<SiteKind, Record<MaintenanceTierId, number>> = {
  wordpress: { essentiel: 89, actif: 249 },
  headless: { essentiel: 129, actif: 299 },
  webapp: { essentiel: 129, actif: 299 },
};

/** Les deux colonnes affichées : headless et web app partagent la même grille. */
export const MAINTENANCE_GRID_COLUMNS: { kind: SiteKind; label: Record<Lang, string> }[] = [
  { kind: "wordpress", label: { fr: "Site WordPress", en: "WordPress site" } },
  { kind: "headless", label: { fr: "Site headless ou web app", en: "Headless site or web app" } },
];

/** Prix mensuel d'un palier pour un type de site. */
export function maintenanceMonthly(tier: MaintenanceTierId, kind: SiteKind): number {
  return MAINTENANCE_GRID[kind][tier];
}

/** Le même prix, formaté (« 129 € HT par mois »). */
export function maintenancePriceLabel(tier: MaintenanceTierId, kind: SiteKind, lang: Lang): string {
  const amount = formatEuros(maintenanceMonthly(tier, kind), lang);
  return lang === "en" ? `${amount} excl. VAT per month` : `${amount} HT par mois`;
}

/** Plancher de la gamme (palier Essentiel, site WordPress), en valeur brute (JSON-LD, llms). */
export const MAINTENANCE_PRICE_VALUE = MAINTENANCE_GRID.wordpress.essentiel;
export const MAINTENANCE_PRICE_CURRENCY = "EUR";
/** Unité de facturation UN/CEFACT : « MON » = par mois. */
export const MAINTENANCE_BILLING_UNIT_CODE = "MON";

/** Prix d'entrée formaté, toujours « à partir de ». */
export const MAINTENANCE_PRICE = {
  fr: { amount: `À partir de ${formatEuros(MAINTENANCE_PRICE_VALUE, "fr")} HT`, period: "par mois" },
  en: { amount: `From ${formatEuros(MAINTENANCE_PRICE_VALUE, "en")} excl. VAT`, period: "per month" },
} as const;

/** Libellé court pour les pastilles et badges (« dès 89 € HT/mois »). */
export const MAINTENANCE_PRICE_SHORT = {
  fr: `dès ${formatEuros(MAINTENANCE_PRICE_VALUE, "fr")} HT/mois`,
  en: `from ${formatEuros(MAINTENANCE_PRICE_VALUE, "en")}/mo`,
} as const;

/** Montant de la mise sous suivi, en euros hors taxes (validé, ADR-018). */
export const MAINTENANCE_ONBOARDING_VALUE = 290;

/**
 * Mise sous suivi : état des lieux d'entrée, facturé une fois. Condition de
 * démarrage du suivi et maintenance, jamais présentée comme une offre (ADR-013).
 */
export const MAINTENANCE_ONBOARDING = {
  fr: {
    title: "Démarrage : l'état des lieux de votre site",
    price: `${formatEuros(MAINTENANCE_ONBOARDING_VALUE, "fr")} HT, une fois`,
    body: "Inventaire des composants, première sauvegarde, rattrapage des mises à jour, fiche du site dans votre espace en ligne. Offert pour un site que j'ai livré. Si le site n'est pas maintenable en l'état, l'état des lieux le dit, et vous oriente vers la prestation adaptée.",
  },
  en: {
    title: "Getting started: a review of your site",
    price: `${formatEuros(MAINTENANCE_ONBOARDING_VALUE, "en")} excl. VAT, once`,
    body: "Component inventory, first backup, pending updates applied, your site's record in your online workspace. Free for a site I delivered. If the site cannot be maintained as it stands, the review says so and points to the right service.",
  },
} as const;

/** Mois de suivi Essentiel inclus dans chaque forfait de refonte ou de création. 0 = ne pas l'afficher. */
export const SUIVI_INCLUS_MOIS = 3;

export const SUIVI_INCLUS_LABEL = {
  fr: `${SUIVI_INCLUS_MOIS} mois de suivi inclus`,
  en: `${SUIVI_INCLUS_MOIS} months of care included`,
} as const;

/** Mois offerts quand le suivi est payé à l'année. */
export const MAINTENANCE_ANNUAL_FREE_MONTHS = 2;

export const MAINTENANCE_COMMITMENT = {
  fr: "Engagement de 3 mois, puis au mois. Paiement à l'année : deux mois offerts.",
  en: "Three-month commitment, then monthly. Paid yearly: two months free.",
} as const;

/** Nombre maximal de sites suivis en même temps. */
export const MAINTENANCE_MAX_SITES = 20;

export interface MaintenanceTier {
  id: MaintenanceTierId;
  name: { fr: string; en: string };
  /** Prix pour un site WordPress, le plancher du palier. Les autres types de site : `maintenancePriceLabel`. */
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
    price: {
      fr: maintenancePriceLabel("essentiel", "wordpress", "fr"),
      en: maintenancePriceLabel("essentiel", "wordpress", "en"),
    },
    priceValue: MAINTENANCE_GRID.wordpress.essentiel,
    forWhom: {
      fr: "Un site qui doit tourner sans que vous y pensiez.",
      en: "A site that must run without you thinking about it.",
    },
    items: {
      fr: [
        "Disponibilité surveillée jour et nuit, alerte en cas de panne",
        "Sauvegarde quotidienne, stockée hors de votre serveur",
        "Mises à jour chaque mois, vérifiées après passage",
        "Faille critique corrigée sous 72 h",
        "Rapport mensuel dans votre espace en ligne",
        "Veille en continu sur vos composants : alertes et lettres, Sentinelle incluse",
        "30 minutes d'intervention par mois",
      ],
      en: [
        "Uptime monitored day and night, alert on outage",
        "Daily backup, stored off your server",
        "Monthly updates, checked after they run",
        "Critical vulnerability fixed within 72 h",
        "Monthly report in your online workspace",
        "Continuous watch on your components: alerts and letters, Sentinelle included",
        "30 minutes of work per month",
      ],
    },
  },
  {
    id: "actif",
    name: { fr: "Actif", en: "Active" },
    price: {
      fr: maintenancePriceLabel("actif", "wordpress", "fr"),
      en: maintenancePriceLabel("actif", "wordpress", "en"),
    },
    priceValue: MAINTENANCE_GRID.wordpress.actif,
    forWhom: {
      fr: "Un site qui compte : demandes de contact, formulaires, contenus publiés chaque semaine.",
      en: "A site that matters: leads, forms, content published weekly.",
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
