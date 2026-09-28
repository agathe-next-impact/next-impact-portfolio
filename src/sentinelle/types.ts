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
import type { Lettre } from "./lettre/schema";

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
/**
 * Forme actuelle (2026-08-18, seconde itération) : le scan produit un **vrai
 * numéro** par le pipeline de la veille personnalisée — collecte de l'actualité
 * de la dernière semaine (outils web) puis rédaction douze axes — appliqué à la
 * fiche technique issue de l'analyse de stack. Se reconnaît à `lettre`.
 */
export interface ScanApercuLettre {
  status: "done";
  lettre: Lettre;
  /** Fenêtre couverte — « la semaine du 11 au 18 août 2026 ». */
  periodLabel: string;
  genereLe: string;
  /**
   * Ce que cette lettre a réellement coûté à fabriquer — chaque scan se mesure
   * lui-même (2026-08-18). Absent sur les lettres d'avant l'instrumentation.
   */
  consommation?: {
    recherches: number;
    lectures: number;
    reprises: number;
    jetonsEntree: number;
    jetonsSortie: number;
    /** Jetons relus depuis le cache (facturés ×0,1). */
    jetonsCacheLecture: number;
    dureeMs: number;
  };
}

/**
 * Forme héritée (2026-08-16 → 18) : cinq thèmes + cap, une passe sans outils.
 * Encore en base sur les scans passés — l'affichage la lit toujours.
 */
export interface ScanApercuThemes {
  status: "done";
  titre?: string;
  chapeau?: string;
  siteEnUnePhrase?: string;
  ligneCloture?: string;
  themes: ApercuTheme[];
  cap: { scenario: "consolider" | "evoluer" | "refondre"; texte: string };
  genereLe: string;
}

export type ScanApercu =
  | { status: "pending" }
  | { status: "none"; reason?: string }
  | ScanApercuLettre
  | ScanApercuThemes;

/** La forme actuelle porte une lettre complète ; l'héritée, des thèmes. */
export function isApercuLettre(
  apercu: ScanApercuLettre | ScanApercuThemes,
): apercu is ScanApercuLettre {
  return "lettre" in apercu;
}

/**
 * Ce que la page d'accueil dit et comment elle est servie, lu sur la réponse
 * déjà obtenue par le scanner (scanner/signals.ts). Matière première de la
 * grille de diagnostic ; absent des scans d'avant le 2026-09-27.
 */
export interface SiteSignals {
  title: string | null;
  description: string | null;
  lang: string | null;
  h1: string[];
  h2: string[];
  /** Nom déclaré en JSON-LD Organization, à défaut og:site_name. */
  siteName: string | null;
  schemaTypes: string[];
  socialLinks: string[];
  navLabels: string[];
  /** Début du texte visible, borné. */
  excerpt: string;
  wordCount: number;
  /** Preuves repérées dans le texte : « témoignages », « chiffres clés »… */
  proofs: string[];
  /** Libellés des appels à l'action (« Demander un devis »…). */
  callsToAction: string[];
  /** Formulaires hors recherche. */
  formCount: number;
  /** Liens tel: et mailto:. */
  contactLinks: number;
  htmlBytes: number;
  /** Temps jusqu'aux en-têtes de la page d'accueil, en ms. */
  responseMs: number | null;
  imageCount: number;
  imagesWithoutAlt: number;
  scriptCount: number;
  /** Domaines tiers qui servent des scripts. */
  thirdPartyHosts: string[];
  hasViewport: boolean;
  hasCanonical: boolean;
  hasOpenGraph: boolean;
  https: boolean;
  securityHeaders: { hsts: boolean; csp: boolean; xFrameOptions: boolean };
}

/** Couleur d'une case de constat : c'est elle qui colore la grille. */
export type DiagnosticTonalite = "solide" | "a_renforcer" | "fragile" | "indetermine";

/** Les trois suites possibles — les trois prestations du catalogue. */
/**
 * Les trois prestations du catalogue (charte v1.6, lib/trajectoires.ts), sous
 * leur seul nom : Optimisation, Refonte, Évolution. Le rapport les examine
 * toutes les trois et en recommande une. Audit, maintenance et pilotage ne se
 * recommandent pas ici : le rapport les propose en ligne discrète.
 */
export type DiagnosticIssue = "optimisation" | "refonte" | "evolution";

/**
 * Les deux variantes de la Refonte, à égalité (ADR-031) : WordPress sur mesure
 * ou WordPress headless. Le diagnostic tranche d'après ce qu'il observe.
 */
export type DiagnosticVariante = "sur_mesure" | "headless";

/** La variante de Refonte qui conviendrait, et pourquoi (vingt mots au plus). */
export interface DiagnosticRefonte {
  variante: DiagnosticVariante;
  raison: string;
}

/** La réponse à la question du dirigeant : faut-il le faire ? */
export type DiagnosticBesoin = "necessaire" | "utile" | "pas_prioritaire";

/** L'examen d'une prestation, justifié par ses objectifs. */
export interface DiagnosticExamen {
  prestation: DiagnosticIssue;
  besoin: DiagnosticBesoin;
  /** Objectif stratégique servi (image, position, risque…), vingt mots au plus. */
  strategique: string;
  /** Objectif commercial servi (demandes, conversion, clients…), vingt mots au plus. */
  commercial: string;
}

export interface DiagnosticCase {
  tonalite: DiagnosticTonalite;
  /** Deux phrases au plus (garde-fou : diagnostic/guards.ts). */
  lignes: string[];
}

/**
 * Un concurrent du site analysé : nommé par la collecte (source vérifiée),
 * puis mesuré par le même scanner passif, page d'accueil seulement. Les
 * chiffres sont donc comparables à ceux du site analysé, et déterministes.
 */
export interface DiagnosticConcurrent {
  nom: string;
  url: string;
  /** Pourquoi c'est un concurrent direct, selon la collecte. */
  motif: string;
  plateforme: string | null;
  /** Libellés des composants structurants détectés (plateforme, thème…). */
  composants: string[];
  titre: string | null;
  h1: string | null;
  responseMs: number | null;
  htmlKo: number;
  scripts: number;
  domainesTiers: number;
  https: boolean;
  hsts: boolean;
  donneesStructurees: string[];
  /** Signaux commerciaux, lus comme pour le site analysé. */
  preuves: string[];
  appelsAction: string[];
}

/**
 * La grille en quatre cases du rapport de scan : organisation et positionnement
 * stratégique, positionnement web dans l'écosystème, dispositif site web, puis
 * la conclusion qui relie les trois (optimiser, refondre, évoluer).
 *
 * Fabriquée en deux passes (src/sentinelle/diagnostic/) : collecte web sourcée,
 * puis rédaction sans outils. Non relue par un humain — le rapport le dit.
 */
export type ScanDiagnostic =
  | { status: "pending" }
  | { status: "none"; reason?: string }
  | {
      status: "done";
      /** Secteur d'activité établi par la collecte ; null si introuvable. */
      secteur?: string | null;
      /** Concurrents réellement joints et mesurés. */
      concurrents?: DiagnosticConcurrent[];
      organisation: DiagnosticCase;
      ecosysteme: DiagnosticCase;
      dispositif: DiagnosticCase;
      conclusion: {
        issue: DiagnosticIssue;
        besoin: DiagnosticBesoin;
        /** L'objectif business que la prestation sert, en une phrase. */
        objectif: string;
        lignes: string[];
      };
      /** Les trois prestations examinées, dans l'ordre du catalogue. */
      examens?: DiagnosticExamen[];
      /** La variante de Refonte retenue ; absente des diagnostics d'avant le 2026-09-28. */
      refonte?: DiagnosticRefonte;
      /** URLs des faits externes retenus — affichées sous la grille. */
      sources: string[];
      genereLe: string;
      consommation?: {
        recherches: number;
        jetonsEntree: number;
        jetonsSortie: number;
        dureeMs: number;
      };
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
  /** Signaux de la page d'accueil (2026-09-27) — absent sur les anciens scans. */
  site?: SiteSignals;
  /** Grille de diagnostic en quatre cases (2026-09-27). */
  diagnostic?: ScanDiagnostic;
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
