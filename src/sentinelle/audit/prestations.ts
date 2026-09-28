import type {
  DiagnosticBesoin,
  DiagnosticIssue,
  DiagnosticRefonte,
  DiagnosticTonalite,
  DiagnosticVariante,
} from "@sentinelle/types";

// ─────────────────────────────────────────────────────────────────────────────
// Libellés de l'audit, partagés par le rapport en ligne (`/scan/[id]`) et
// l'e-mail qui l'envoie. Données pures, sans dépendance serveur : le rapport
// est un composant client et importe ce fichier directement.
//
// Les trois prestations du catalogue (lib/trajectoires.ts) : seul nom, nom
// technique en sous-titre, et page du pack pour qui veut vérifier. Liens en
// dur : Sentinelle n'importe pas le catalogue de la vitrine.
// ─────────────────────────────────────────────────────────────────────────────

export const PRESTATIONS: Record<
  DiagnosticIssue,
  { nom: string; technique: string; href: string }
> = {
  optimisation: {
    nom: "Optimisation",
    technique: "WordPress optimisé",
    href: "/packs/site-wordpress-ingerable",
  },
  refonte: {
    nom: "Refonte",
    technique: "WordPress sur mesure ou headless",
    href: "/packs/site-wordpress-lent",
  },
  evolution: {
    nom: "Évolution",
    technique: "Web app ou plateforme",
    href: "/packs/site-outil-de-travail",
  },
};

/**
 * Les deux variantes de la Refonte (ADR-031), à égalité. Copie des libellés de
 * `variantes` dans lib/trajectoires.ts : si l'un change, l'autre aussi.
 */
export const VARIANTES_REFONTE: Record<DiagnosticVariante, string> = {
  sur_mesure: "WordPress sur mesure",
  headless: "WordPress headless",
};

/**
 * Le sous-titre technique d'une prestation dans un audit : pour la Refonte, la
 * variante que le diagnostic a retenue quand il en a retenu une.
 */
export function techniqueDe(issue: DiagnosticIssue, refonte?: DiagnosticRefonte): string {
  if (issue === "refonte" && refonte) return VARIANTES_REFONTE[refonte.variante];
  return PRESTATIONS[issue].technique;
}

/**
 * L'audit + roadmap, proposé par la bannière de la page d'attente du rapport
 * (demande d'Agathe du 2026-09-28). Copie en dur du prix de lib/visio-conseil.ts
 * et de la page du parcours (lib/situations.ts) : Sentinelle n'importe pas la
 * vitrine. Si l'un change, l'autre aussi.
 */
export const AUDIT_ROADMAP = {
  nom: "Audit + roadmap",
  prix: "650 € HT",
  href: "/packs/etat-des-lieux",
} as const;

/** La page des prestations, présentées par situation. */
export const PAGE_PRESTATIONS = "/packs";

/**
 * Le bouton chaud « Échange gratuit » réserve l'échange de 15 minutes
 * (ADR-022). Copie en dur de CTA_CHAUD / ECHANGE_URL de lib/visio-conseil.ts :
 * Sentinelle n'importe pas la vitrine (docs/sentinelle/CLAUDE.md, règle 2) :
 * si le lien change là-bas, il change ici aussi.
 */
export const ECHANGE_URL =
  "https://calendly.com/agathe-next-impact/prise-de-contact-conseil";

export const BESOIN_LABELS: Record<DiagnosticBesoin, string> = {
  necessaire: "Nécessaire",
  utile: "Utile",
  pas_prioritaire: "Pas prioritaire",
};

export const TONALITE_LABELS: Record<DiagnosticTonalite, string> = {
  solide: "Solide",
  a_renforcer: "À renforcer",
  fragile: "Fragile",
  indetermine: "Peu observable",
};

export const CASES_TITRES = {
  organisation: "Votre marché et votre promesse",
  ecosysteme: "Face à vos concurrents",
  dispositif: "Ce que votre site fait pour votre activité",
} as const;
