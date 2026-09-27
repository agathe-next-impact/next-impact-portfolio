import { CTO_MIN_MONTHS, CTO_NOTICE_MONTHS, CTO_TIER_ROWS, CTO_TIERS } from "@/lib/cto-externalise";

// ─────────────────────────────────────────────────────────────────────────────
// L'offre, telle que l'espace client la présente : SANS montants.
//
// Les paliers et leur comparatif viennent de la page publique
// (`lib/cto-externalise.ts`), lus tels quels : un seul texte pour les deux
// lectures, pas de copie qui divergerait au premier changement d'offre. Les
// prix y figurent aussi ; ils ne sortent jamais d'ici (décision du 2026-09-27 :
// l'espace montre ce que l'on a et ce que l'on pourrait avoir, pas ce que ça
// coûte — le tarif se discute en comité).
// ─────────────────────────────────────────────────────────────────────────────

export type PalierId = "referent" | "direction";

/**
 * Vrai pour un palier d'Expert technique externalisé. « audit » (valeur de la
 * colonne Palier pour un client audit seul) n'en est pas un.
 */
export function estPalierExpert(palier: string): palier is PalierId {
  return CTO_TIERS.some((tier) => tier.id === palier);
}

/** Le nom public d'un palier ; un palier inconnu garde son identifiant. */
export function nomPalier(palier: string): string {
  return CTO_TIERS.find((tier) => tier.id === palier)?.name.fr ?? palier;
}

/**
 * Le palier d'après, s'il est publié : Référent pour un client audit seul
 * (pack Pilotage : l'audit, puis l'Expert technique), Direction technique pour
 * un Référent. Direction technique n'en a pas (Renforcée n'est pas publiée).
 */
export function palierSuperieur(palier: string): PalierId | null {
  if (palier === "audit") return "referent";
  if (palier === "referent") return "direction";
  return null;
}

/** Ce que contient un palier, critère par critère, tel que la page publique le dit. */
export function contenuPalier(palier: PalierId): { critere: string; valeur: string }[] {
  const index = palier === "referent" ? 0 : 1;
  return CTO_TIER_ROWS.map((row) => ({ critere: row.label.fr, valeur: row.values[index].fr }));
}

/** Le nom lisible de chaque code de la colonne « Services ». */
export const NOMS_SERVICES: Record<string, string> = {
  "direction-technique": "Direction technique",
  actions: "Suivi des actions et de la roadmap",
  audit: "Audit",
  "suivi-technique": "Suivi et maintenance du site",
  "veille-personnalisee": "Veille personnalisée",
  "veille-technique": "Veille technique (Sentinelle)",
  prestations: "Suivi de vos missions",
};

/** Ce que le palier Direction technique ajoute au Référent : les lignes du comparatif qui diffèrent. */
export function apportsDirection(): { critere: string; referent: string; direction: string }[] {
  return CTO_TIER_ROWS.filter((row) => row.values[0].fr !== row.values[1].fr).map((row) => ({
    critere: row.label.fr,
    referent: row.values[0].fr,
    direction: row.values[1].fr,
  }));
}

/** Fin de l'engagement initial : six mois après le début du contrat. */
export function finEngagement(debut: Date): Date {
  const fin = new Date(debut);
  fin.setMonth(fin.getMonth() + CTO_MIN_MONTHS);
  return fin;
}

export const PREAVIS_MOIS = CTO_NOTICE_MONTHS;

/** Les deux formules du suivi et maintenance, par leur nom public. */
export const FORMULES_SUIVI = ["Essentiel", "Actif"] as const;
export type FormuleSuivi = (typeof FORMULES_SUIVI)[number];

/** Les services que l'on peut ajouter à un accompagnement, par code de la colonne « Services ». */
export const SERVICES_A_AJOUTER: { code: string; nom: string; apport: string }[] = [
  {
    code: "suivi-technique",
    nom: "Suivi et maintenance",
    apport:
      "Votre site tenu à jour, sauvegardé et surveillé chaque nuit, avec la veille technique Sentinelle comprise.",
  },
  {
    code: "veille-personnalisee",
    nom: "Veille personnalisée",
    apport: "Une lettre écrite pour votre organisation : votre écosystème, vos concurrents, ce qu'il faut faire cette semaine.",
  },
];

/** Les projets ponctuels du catalogue, pour la partie « À ajouter ». Sans prix. */
export const PROJETS: { nom: string; apport: string }[] = [
  { nom: "Audit + roadmap", apport: "Un état des lieux complet et un plan d'action priorisé." },
  { nom: "Optimisation", apport: "Votre WordPress remis d'aplomb : plus rapide, plus simple à faire vivre." },
  { nom: "Refonte", apport: "WordPress en headless : vous publiez comme avant, le site va beaucoup plus vite." },
  { nom: "Évolution", apport: "Une web app et une administration sur mesure, quand le site est devenu un outil de travail." },
];
