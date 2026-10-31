// ─────────────────────────────────────────────────────────────────────────────
// La forme d'un digest hebdomadaire, telle qu'elle est stockée
// (`cto_digests.content`) et affichée (espace Veille, e-mail).
//
// Les limites sont des constantes du produit, pas des réglages : 15 lignes de
// veille technique. Une ligne fait 140 caractères au plus — c'est ce qui rend
// « 15 lignes » vérifiable, à l'écran comme dans une boîte de réception.
// ─────────────────────────────────────────────────────────────────────────────

export const DIGEST_VERSION = 1;
export const SENTINELLE_LINES = 15;
export const LINE_CHARS = 140;

/** Le ton d'une ligne : c'est lui qui donne la couleur. */
export type DigestTone = "critique" | "attention" | "ok" | "info";

export interface DigestLine {
  text: string;
  tone: DigestTone | null;
  /** Nature de la ligne, affichée en toutes lettres (« Alerte », « Fin de support »…). */
  tag: string | null;
  /** Référence d'un fait Sentinelle, portée par l'alerte. */
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

export interface DigestContent {
  version: number;
  week: string;
  /** Null : pas de veille technique reliée à cet accompagnement. */
  sentinelle: DigestSentinelle | null;
  /**
   * Date ISO de la dernière retouche faite dans l'admin. Un digest retouché
   * n'est plus réassemblé par le balayage : la relecture ne se perd pas.
   * Absent ou null : tel qu'assemblé.
   */
  modifieLe?: string | null;
}
