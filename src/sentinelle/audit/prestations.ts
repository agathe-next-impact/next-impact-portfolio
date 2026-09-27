import type { DiagnosticBesoin, DiagnosticIssue, DiagnosticTonalite } from "@sentinelle/types";

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
    technique: "WordPress headless",
    href: "/packs/site-wordpress-lent",
  },
  evolution: {
    nom: "Évolution",
    technique: "Web app ou plateforme",
    href: "/packs/site-outil-de-travail",
  },
};

/** La page des prestations, présentées par situation. */
export const PAGE_PRESTATIONS = "/packs";

/**
 * Le bouton chaud « Discutons de votre projet » réserve l'échange de 15 minutes
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
