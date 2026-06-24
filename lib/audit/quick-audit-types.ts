// Types de l'audit léger « instantané » (étape 1 du parcours /audit-site-web).
// Fichier séparé du module "use server" : un fichier d'action serveur ne peut
// exporter que des fonctions async, donc les types/objectifs vivent ici et sont
// partagés client + serveur.

export type AuditObjective =
  | "vitesse"
  | "demandes"
  | "design"
  | "seo"
  | "headless"
  | "refonte";

export type AxisKey = "performance" | "seo" | "accessibility" | "conversion";

export type Impact = "high" | "medium" | "low";

export interface QuickIssue {
  title: string;
  impact: Impact;
}

export type CwvRating = "good" | "average" | "poor";

export interface CwvMetric {
  label: string; // LCP / INP / CLS
  value: string; // ex. « 2.1 s », « 180 ms », « 0.05 »
  rating: CwvRating;
}

export interface QuickAxis {
  key: AxisKey;
  /** Score 0–100. */
  score: number;
  /** false = axe non mesuré (ex. perf sans clé PageSpeed) → exclu du score global. */
  available: boolean;
  /** Note courte (ex. « mesurée dans le rapport complet »). */
  note?: string;
  /** true = score approximatif (proxy), pas une mesure réelle (badge « Estimation »). */
  estimated?: boolean;
  /** Core Web Vitals réels (axe perf, via PageSpeed) : LCP / INP / CLS. */
  metrics?: CwvMetric[];
  positives: string[];
  issues: QuickIssue[];
}

export interface QuickProblem {
  title: string;
  axis: AxisKey;
  impact: Impact;
}

export interface QuickTech {
  wordpress: boolean;
  pageBuilder: string | null;
  generator: string | null;
}

export interface QuickAuditResult {
  url: string;
  reachable: boolean;
  /** Score global pondéré sur les axes mesurés (0–100). */
  overallScore: number;
  axes: QuickAxis[];
  /** 3 problèmes prioritaires, tri par impact. */
  problems: QuickProblem[];
  tech: QuickTech;
  /** Orientation préliminaire (objectif + signaux). Affinée par l'analyse IA. */
  verdict: "A" | "B" | "C" | "D";
  error?: string;
}
