import type { Confidence, StackItemType } from "@sentinelle/types";

// ─────────────────────────────────────────────────────────────────────────────
// Vocabulaire du scanner.
//
// Le parti pris qui gouverne tout le module : **détecter une technologie ne
// doit pas demander d'écrire du code**. Une empreinte est une donnée ; le
// moteur (detect.ts) est générique et ne connaît aucune technologie en
// particulier. Ajouter Drupal, Shopify ou un paquet npm, c'est ajouter une
// entrée dans fingerprints.ts.
//
// Conséquence utile : le moteur est une fonction pure sur une PageEvidence.
// Tout se teste sans réseau.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Tout ce qu'on a pu observer d'une page, une fois la requête faite.
 * Ne contient que du public : HTML servi, en-têtes, URL finale.
 */
export interface PageEvidence {
  /** URL demandée. */
  url: string;
  /** URL après redirections — porte parfois la signature (myshopify.com…). */
  finalUrl: string;
  status: number;
  /** En-têtes, noms en minuscules. */
  headers: Record<string, string>;
  html: string;
  /** Noms des cookies posés (jamais les valeurs). */
  cookieNames: string[];
  /** Valeurs des attributs src des <script>. */
  scripts: string[];
  /** Valeurs des attributs href des <link>. */
  links: string[];
  /** Contenu de <meta name="generator">, si présent. */
  generator: string | null;
}

/**
 * Un signal est une observation qui, si elle se vérifie, désigne une
 * technologie. `version` est une seconde expression appliquée au même texte,
 * dont le premier groupe capturant donne la version.
 */
export type Signal =
  /** En-tête HTTP. Sans `match`, la seule présence de l'en-tête suffit. */
  | { on: "header"; name: string; match?: RegExp; version?: RegExp; confidence?: Confidence; versionConfidence?: Confidence }
  /** Nom d'un cookie posé. */
  | { on: "cookie"; match: RegExp; confidence?: Confidence }
  /** N'importe où dans le HTML servi. */
  | { on: "html"; match: RegExp; version?: RegExp; confidence?: Confidence; versionConfidence?: Confidence }
  /** Contenu de <meta name="generator"> — la source la plus fiable. */
  | { on: "generator"; match: RegExp; version?: RegExp; confidence?: Confidence; versionConfidence?: Confidence }
  /** URL d'un script ou d'une feuille de style. */
  | { on: "asset"; match: RegExp; version?: RegExp; confidence?: Confidence; versionConfidence?: Confidence }
  /** URL finale de la page. */
  | { on: "url"; match: RegExp; version?: RegExp; confidence?: Confidence; versionConfidence?: Confidence };

/**
 * Empreinte d'une technologie.
 *
 * `ecosystem` est ce qui rend la veille agnostique : il dit dans quel catalogue
 * chercher les failles de ce composant. Null = composant affiché dans la fiche
 * mais non surveillé automatiquement (un hébergeur, par exemple).
 */
export interface Fingerprint {
  slug: string;
  label: string;
  type: StackItemType;
  ecosystem?: string | null;
  signals: Signal[];
  /**
   * Technologies impliquées par celle-ci : WooCommerce implique WordPress.
   * Elles sont ajoutées au résultat si elles n'ont pas été détectées seules,
   * avec une confiance dégradée — c'est une déduction, pas une observation.
   */
  implies?: string[];
}
