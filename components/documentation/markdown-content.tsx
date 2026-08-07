import { Marked } from "marked";
import { slugifyHeading } from "@/lib/toc";

interface MarkdownContentProps {
  content: string;
}

// Instance dédiée : `marked.setOptions` est global et fuyait d'un rendu à
// l'autre. Une instance locale garde le renderer confiné à ce composant.
const md = new Marked({ gfm: true });

md.use({
  renderer: {
    // API marked v5+ : le renderer reçoit un token, et le texte inline doit
    // passer par le parser — sinon un titre `## **Gras**` sort avec ses
    // astérisques. `token.text` reste la source brute, utilisée pour l'ancre.
    heading(token) {
      const { depth, tokens, text } = token as unknown as {
        depth: number;
        tokens: unknown[];
        text: string;
      };
      const inline = this.parser.parseInline(tokens as never);
      const anchor = slugifyHeading(text);

      // Filet horizontal au-dessus de chaque H2, comme en MDX.
      const separator =
        depth === 2
          ? `<div style="margin-top:3rem;margin-bottom:1rem;border-top:1px solid hsl(var(--dark-gray))"></div>`
          : "";

      return `${separator}<h${depth} id="${anchor}">${inline}</h${depth}>`;
    },
  },
});

/**
 * Rendu des articles `.md` (les `.mdx` passent par MdxContent).
 *
 * Composant SERVEUR : le corps doit être dans le HTML initial. En rendu client
 * (useEffect + dangerouslySetInnerHTML), la page arrivait vide pour les
 * crawlers et les moteurs de réponse — et les ancres du sommaire ne pointaient
 * sur rien tant que le JS n'avait pas tourné.
 */
export function MarkdownContent({ content }: MarkdownContentProps) {
  const html = md.parse(content, { async: false });

  return <div className="doc-prose" dangerouslySetInnerHTML={{ __html: html }} />;
}
