import { LINE_CHARS, type DigestContent, type DigestLine } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// La retouche d'un digest avant validation, depuis l'admin.
//
// Pur, testé. On ne retouche que le texte : le libellé d'une ligne, l'action de
// la semaine d'une édition. Le ton, l'étiquette et la référence d'une ligne
// viennent de sa source (alerte validée, axe d'une édition) et ne se réécrivent
// pas à la main. Vider une ligne la retire. Une ligne reste bornée à
// `LINE_CHARS` : c'est ce qui rend « 15 lignes » vérifiable.
// ─────────────────────────────────────────────────────────────────────────────

export interface DigestEdits {
  /** Le texte de chaque ligne de veille technique, dans l'ordre affiché. */
  sentinelle: string[];
  /** Par édition Signaux Faibles, dans l'ordre affiché. */
  signaux: { lines: string[]; action: string }[];
}

function propre(texte: string): string {
  return texte.replace(/\s+/g, " ").trim().slice(0, LINE_CHARS);
}

function retoucher(lines: DigestLine[], textes: string[] | undefined): DigestLine[] {
  if (!textes) return lines;
  return lines.flatMap((line, index) => {
    const texte = propre(textes[index] ?? line.text);
    return texte ? [{ ...line, text: texte }] : [];
  });
}

/** Le digest retouché, marqué comme tel (`modifieLe`). */
export function appliquerRetouches(content: DigestContent, edits: DigestEdits, now = new Date()): DigestContent {
  return {
    ...content,
    sentinelle: content.sentinelle
      ? { ...content.sentinelle, lines: retoucher(content.sentinelle.lines, edits.sentinelle) }
      : null,
    signaux: content.signaux.map((signal, index) => {
      const edit = edits.signaux[index];
      if (!edit) return signal;
      const action = edit.action.replace(/\s+/g, " ").trim();
      return { ...signal, lines: retoucher(signal.lines, edit.lines), action: action || null };
    }),
    modifieLe: now.toISOString(),
  };
}

/** Lit les retouches d'un formulaire : `sentinelle.<i>`, `signal.<n>.<i>`, `signal.<n>.action`. */
export function retouchesDuFormulaire(content: DigestContent, champ: (nom: string) => string | null): DigestEdits {
  return {
    sentinelle: (content.sentinelle?.lines ?? []).map((line, i) => champ(`sentinelle.${i}`) ?? line.text),
    signaux: content.signaux.map((signal, n) => ({
      lines: signal.lines.map((line, i) => champ(`signal.${n}.${i}`) ?? line.text),
      action: champ(`signal.${n}.action`) ?? signal.action ?? "",
    })),
  };
}
