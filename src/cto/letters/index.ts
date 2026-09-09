// API publique des lettres de veille.
//
// Séparée de `deliverables/` parce qu'une lettre n'est pas un livrable : elle se
// remplace au lieu de s'empiler, et elle s'adresse à une portée plutôt qu'à un
// client. Les mêler aurait obligé chacun des deux à porter les contraintes de
// l'autre.

export {
  currentLetters,
  digestOfLetter,
  letterForClient,
  lettersForClient,
  upsertLetter,
  withdrawLetter,
  ARCHIVE_MONTHS,
  type Letter,
  type LetterInput,
  type LetterScope,
  type LetterSummary,
} from "./store";

export type { Block, Span } from "../notion/blocks";
