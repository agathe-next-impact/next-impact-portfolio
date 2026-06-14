"use client";

// Rendu du verdict IA (markdown compact renvoyé par /api/gemini-analyze) en prose
// stylée aux tokens Blueprint (theme-aware). Le markdown vient de notre propre
// prompt + Gemini (contenu contrôlé), rendu comme dans components/gemini.

import { marked } from "marked";

export function GeminiVerdict({ markdown }: { markdown: string }) {
  const html = marked.parse(markdown) as string;
  return (
    <div
      className="prose prose-sm max-w-none font-inter-tight
        prose-headings:font-sans prose-headings:font-light prose-headings:tracking-tight prose-headings:text-foreground
        prose-h3:text-base prose-h3:mb-2 prose-h3:mt-6 first:prose-h3:mt-0
        prose-p:text-mid-gray prose-p:leading-relaxed
        prose-li:text-mid-gray prose-strong:text-foreground prose-strong:font-medium
        prose-a:text-accent-secondary"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
