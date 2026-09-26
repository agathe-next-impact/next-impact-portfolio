// ─────────────────────────────────────────────────────────────────────────────
// La forme d'un digest hebdomadaire, telle qu'elle est stockée
// (`cto_digests.content`) et affichée (espace Veille, e-mail).
//
// Les limites sont des constantes du produit, pas des réglages : 15 lignes de
// veille technique, 8 lignes par édition Signaux Faibles, deux éditions au
// plus. Une ligne fait 140 caractères au plus — c'est ce qui rend « 15 lignes »
// vérifiable, à l'écran comme dans une boîte de réception.
// ─────────────────────────────────────────────────────────────────────────────

export const DIGEST_VERSION = 1;
export const SENTINELLE_LINES = 15;
export const SIGNAL_LINES = 8;
export const SIGNAL_EDITIONS = 2;
export const LINE_CHARS = 140;

/**
 * Le ton d'une ligne, commun aux deux veilles : c'est lui qui donne la
 * couleur, pour qu'une alerte rouge Sentinelle et un axe FORT se lisent au même
 * niveau.
 */
export type DigestTone = "critique" | "attention" | "ok" | "info";

export interface DigestLine {
  text: string;
  tone: DigestTone | null;
  /** Nature de la ligne, affichée en toutes lettres (« Alerte », « Fin de support »…). */
  tag: string | null;
  /** Référence d'un fait Sentinelle : portée par l'alerte, citée par une ligne Signaux Faibles. */
  ref: string | null;
}

export interface DigestSentinelle {
  lines: DigestLine[];
  /** Points laissés hors des 15 lignes, à lire dans la lettre complète. */
  overflow: number;
  /** La lettre Sentinelle de la semaine, si elle existe (clé `cto_letters`). */
  letterKey: string | null;
  stats: {
    components: number;
    withoutVersion: number;
    alerts: number;
    critiques: number;
    attention: number;
  };
}

export type SignalLevel = "FORT" | "MOYEN" | "RAS";

export interface DigestSignal {
  /** Clé `cto_letters` de l'édition, pour « lire l'édition complète ». */
  letterKey: string;
  title: string;
  /** Nom de la veille (« Écosystème », « Positionnement »…). */
  label: string | null;
  /** Date ISO de l'édition. */
  date: string;
  lines: DigestLine[];
  action: string | null;
  axes: { name: string; level: SignalLevel | null }[];
}

export interface DigestContent {
  version: number;
  week: string;
  /** Null : pas de veille technique reliée à cet accompagnement. */
  sentinelle: DigestSentinelle | null;
  signaux: DigestSignal[];
  /**
   * Vrai quand l'accompagnement reçoit Signaux Faibles mais qu'aucune édition
   * n'est parue cette semaine : le digest le dit au lieu de se taire.
   */
  signauxAttendus: boolean;
}
