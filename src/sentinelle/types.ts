// Types partagés entre les modules Sentinelle.
// Les types de lignes viennent du schéma Drizzle : la base est la source de
// vérité, on ne redéclare pas les formes à la main.

import type {
  alerts,
  clients,
  digests,
  intelItems,
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
  version: string | null;
  confidence: Confidence;
  /** D'où vient la détection : « meta generator », « /wp-json/ »… (audit). */
  evidence?: string;
}

/** Résultat sérialisé dans `scans.result`. */
export interface ScanResult {
  url: string;
  /** Le site tourne-t-il sous WordPress ? Faux → parcours déclaratif. */
  isWordPress: boolean;
  components: DetectedComponent[];
  /** Limites à afficher honnêtement dans le rapport (specs/scanner.md). */
  notes: string[];
  scannedAt: string;
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
