// Source unique du sommaire et des ancres de titre.
//
// Trois endroits doivent tomber d'accord au caractère près, sinon les liens du
// sommaire pointent dans le vide :
//   1. le sommaire (généré ici, depuis le markdown brut) ;
//   2. les `id` des titres MDX (components/documentation/mdx-content.tsx) ;
//   3. les `id` des titres markdown (components/documentation/markdown-content.tsx).
// Ils importent tous `slugifyHeading` — ne pas réimplémenter le slug ailleurs.

export interface TocEntry {
  id: string;
  text: string;
  level: number;
}

/**
 * Retire le markdown inline d'un titre pour n'en garder que le texte lisible.
 * Sans ça, un titre `### 1. **Cohérence de la marque**` s'affiche tel quel,
 * astérisques comprises, dans le sommaire.
 */
export function stripInlineMarkdown(text: string): string {
  return (
    text
      // images ![alt](src) avant les liens, sinon le `!` reste orphelin
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
      // liens [libellé](url) → libellé
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      // code inline `x`
      .replace(/`([^`]*)`/g, "$1")
      // gras / italique / barré
      .replace(/\*\*\*([^*]+)\*\*\*/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/~~([^~]+)~~/g, "$1")
      // souligné markdown, uniquement entre limites de mot (pas snake_case)
      .replace(/\b_([^_]+)_\b/g, "$1")
      // entités HTML les plus courantes dans les titres
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

/**
 * Ancre d'un titre. Accepte du markdown brut ou du texte déjà rendu : le
 * markdown est retiré d'abord, donc les deux donnent le même résultat.
 */
export function slugifyHeading(text: string): string {
  return stripInlineMarkdown(text)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\wÀ-ÖØ-öø-ÿ-]/g, "");
}

const HEADING = /^(#{2,3})\s+(.*)$/;
const FENCE = /^\s*(`{3,}|~{3,})/;

/**
 * Sommaire d'un article : les H2 et H3, texte nettoyé et ancre stable.
 *
 * Le balayage est fait ligne à ligne pour pouvoir ignorer les blocs de code :
 * un article qui montre un exemple de fichier contenant `## Summary` faisait
 * apparaître ces titres factices dans le sommaire, avec des ancres pointant
 * dans le vide.
 */
export function generateTableOfContents(content: string): TocEntry[] {
  if (!content || typeof content !== "string") return [];

  const toc: TocEntry[] = [];
  let fence: string | null = null;

  // Normalisation CRLF → LF : les fichiers du dépôt sont en CRLF, et un `\r`
  // résiduel en fin de ligne fait échouer l'ancre `$` de la regex de titre.
  for (const line of content.replace(/\r\n?/g, "\n").split("\n")) {
    const fenceMatch = FENCE.exec(line);
    if (fenceMatch) {
      const marker = fenceMatch[1][0];
      if (fence === null) fence = marker;
      else if (fence === marker) fence = null;
      continue;
    }
    if (fence !== null) continue;

    const match = HEADING.exec(line);
    if (!match) continue;

    const [, hashes, raw] = match;
    const text = stripInlineMarkdown(raw);
    if (!text) continue;

    toc.push({ id: slugifyHeading(raw), text, level: hashes.length });
  }

  return toc;
}
