// Types partagés entre les modules Sentinelle.
// Les types de lignes viennent du schéma Drizzle : la base est la source de
// vérité, on ne redéclare pas les formes à la main.

import type {
  alerts,
  clients,
  digests,
  intelItems,
  magicLinks,
  scans,
  stackItems,
} from "./db/schema";

export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;

export type StackItem = typeof stackItems.$inferSelect;
export type NewStackItem = typeof stackItems.$inferInsert;

export type IntelItem = typeof intelItems.$inferSelect;
export type NewIntelItem = typeof intelItems.$inferInsert;

export type Alert = typeof alerts.$inferSelect;
export type NewAlert = typeof alerts.$inferInsert;

export type Digest = typeof digests.$inferSelect;
export type NewDigest = typeof digests.$inferInsert;

export type Scan = typeof scans.$inferSelect;
export type NewScan = typeof scans.$inferInsert;

export type MagicLink = typeof magicLinks.$inferSelect;
export type NewMagicLink = typeof magicLinks.$inferInsert;

export type StackItemType = StackItem["type"];
export type StackItemSource = StackItem["source"];
export type IntelKind = IntelItem["kind"];
export type AlertStatus = Alert["status"];
export type Verdict = NonNullable<Alert["verdict"]>;
export type Plan = Client["plan"];

/** Niveau de confiance d'une détection du scanner (specs/scanner.md). */
export type Confidence = "high" | "medium" | "low";

/** Un composant détecté sur un site, avant tout rattachement à un client. */
export interface DetectedComponent {
  type: StackItemType;
  /** Slug canonique — même contrat que `stackItems.slug`. */
  slug: string;
  label: string;
  /** Écosystème de veille — même contrat que `stackItems.ecosystem`. */
  ecosystem: string | null;
  version: string | null;
  /** Confiance dans la PRÉSENCE du composant. */
  confidence: Confidence;
  /**
   * Confiance dans la VERSION, qui n'est pas la même chose : un `?ver=` peut
   * porter la version du site plutôt que celle du composant (specs/scanner.md).
   * C'est ce champ, et non `confidence`, que le matching doit consulter avant
   * de fonder une alerte rouge sur une comparaison de plage.
   * Null quand aucune version n'a été trouvée.
   */
  versionConfidence: Confidence | null;
  /** D'où vient la détection : « meta generator », « en-tête server »… (audit). */
  evidence?: string;
}

/** Statut d'un thème dans l'aperçu de veille du rapport de scan. */
export type ApercuStatut = "agir" | "surveiller" | "rien_a_signaler" | "non_observable";

export interface ApercuTheme {
  /** Slug du thème — les cinq grands thèmes de la lettre (apercu/dossier.ts). */
  theme: string;
  statut: ApercuStatut;
  texte: string;
}

/**
 * Aperçu de veille joint au rapport de scan : un échantillon de la lettre
 * personnalisée, fabriqué en une passe sans outils à partir du seul dossier
 * scan × intel déjà collectée. Contrairement à la lettre abonnée, il n'est PAS
 * relu par un humain — le rapport l'affiche explicitement.
 *
 * `pending` le temps de la rédaction (le front continue d'interroger) ;
 * `none` quand l'aperçu n'a pas lieu d'être (aucun composant, clé absente,
 * API indisponible) — l'absence du champ sur d'anciens scans vaut `none`.
 */
export type ScanApercu =
  | { status: "pending" }
  | { status: "none"; reason?: string }
  | {
      status: "done";
      themes: ApercuTheme[];
      cap: { scenario: "consolider" | "evoluer" | "refondre"; texte: string };
      genereLe: string;
    };

/** Résultat sérialisé dans `scans.result`. */
export interface ScanResult {
  url: string;
  /**
   * Plateforme reconnue : slug du CMS, de la boutique ou du méta-framework
   * détecté (« wordpress », « drupal », « shopify », « next »…), `null` quand
   * rien de structurant n'a été reconnu — le parcours devient déclaratif.
   *
   * Remplace l'ancien `isWordPress: boolean`, qui était le seul endroit du
   * modèle à nommer une technologie en dur (règle 6 du CLAUDE.md).
   */
  platform: string | null;
  components: DetectedComponent[];
  /** Limites à afficher honnêtement dans le rapport (specs/scanner.md). */
  notes: string[];
  scannedAt: string;
  /** Aperçu de veille (post-plan, 2026-08-16) — absent sur les anciens scans. */
  apercu?: ScanApercu;
}

/**
 * Contenu de `stack_items.meta` tel que Sentinelle l'écrit.
 *
 * `versionConfidence` y est capital : c'est lui qui décide si une comparaison de
 * plage peut fonder un verdict rouge. Le scanner distingue « le composant est-il
 * là ? » de « la version est-elle sûre ? » ; la seconde question doit survivre
 * au passage en base, sans quoi le matching perdrait l'information la plus
 * importante qu'il possède.
 */
export interface StackItemMeta {
  versionConfidence?: Confidence;
  /** D'où venait la détection, quand le composant vient d'un scan. */
  evidence?: string;
  [key: string]: unknown;
}

/** Sortie attendue de la couche rédaction (prompts/verdict-system-prompt.md). */
export interface DraftedAlert {
  verdict: Verdict;
  title: string;
  body: string;
  whatItChanges: string;
  recommendedAction: string;
  diyPossible: boolean;
  effortEstimate: string;
}
