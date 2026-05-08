"use client";
import React from "react";
import { marked } from "marked";
import { parseMarkdownTable, parseAllMarkdownTables } from "./parseMarkdownTable";
import ComparisonTable from "./ComparisonTable";
import RecommendedStackCard from "./RecommendedStackCard";
import { parseRecommendedStack } from "./parseRecommendedStack";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
//

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = "", analyzedUrl }: MarkdownRendererProps & { analyzedUrl?: string }) {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  // --- 1. Nettoyage du contenu (Identique à avant) ---
  let cleanContent = content;
  const identityRegex = /(\*\*Étape 1\s?:[\s\S]*?)(?=\*\*Étape 2)/i;
  if (identityRegex.test(cleanContent)) {
    cleanContent = cleanContent.replace(identityRegex, "");
  }
  const stepEnRegex = /(\*\*Step 1\s?:[\s\S]*?)(?=\*\*Step 2)/i;
  if (stepEnRegex.test(cleanContent)) {
    cleanContent = cleanContent.replace(stepEnRegex, "");
  }
  const step2TitleRegex = /\*\*Étape 2\s?:\s?Analyse Stratégique\s?\(Format Markdown\)\*\*/i;
  cleanContent = cleanContent.replace(step2TitleRegex, "");
  const step2EnTitleRegex = /\*\*Step 2\s?:\s?Strategic Analysis\s?\(Markdown Format\)\*\*/i;
  cleanContent = cleanContent.replace(step2EnTitleRegex, "");
  cleanContent = cleanContent.trim();

  // --- 2. Configuration du Renderer Custom pour les Tableaux ---
  const renderer = new marked.Renderer();
  renderer.table = (table) => {
    return `
      <div class="not-prose my-8 w-full overflow-hidden rounded-xl border border-mediumblue/10 bg-white/50 backdrop-blur-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-mediumblue/5 text-mediumblue font-googletitre border-b border-mediumblue/10">
              ${table.header}
            </thead>
            <tbody class="divide-y divide-mediumblue/10 bg-transparent">
              ${table.body}
            </tbody>
          </table>
        </div>
      </div>
    `;
  };
  renderer.tablecell = (cell) => {
    const isHeader = cell.header;
    const Tag = isHeader ? 'th' : 'td';
    let classes = isHeader 
      ? "px-6 py-4 font-semibold uppercase tracking-wider text-xs whitespace-nowrap" 
      : "px-6 py-4 text-gray-600";
    return `<${Tag} class="${classes}">${cell.text}</${Tag}>`;
  };
  marked.use({ renderer });

  // --- 3. Ajout du Titre H1 dynamiquement ---
  const finalContent = `# ${isEn ? "Strategic audit of your site" : "Audit stratégique de votre site"} ${analyzedUrl ? analyzedUrl : ''}\n\n` + cleanContent;

  // Extraction de tous les tableaux
  const allTables = parseAllMarkdownTables(cleanContent);

  // Supprime tous les tableaux du markdown pour ne pas les afficher deux fois
  let markdownSansTables = cleanContent;
  if (allTables && allTables.length > 0) {
    allTables.forEach(tbl => {
      markdownSansTables = markdownSansTables.replace(tbl.raw, "");
    });
  }

  // Extraction de la stack recommandée
  const stackData = parseRecommendedStack(content);

  // Supprime la section stack du markdown pour ne pas l'afficher deux fois
  let finalContentWithoutStack = markdownSansTables;
  if (stackData && stackData.raw) {
    finalContentWithoutStack = markdownSansTables.replace(stackData.raw, "");
  }

  // Rendu
  const htmlContent = marked.parse(`# ${analyzedUrl ? analyzedUrl : ''}\n\n` + finalContentWithoutStack) as string;

  return (
    <>
      <div>
        <div
          className={`prose prose-lg dark:prose-invert max-w-none 
        prose-headings:font-googletitre prose-headings:font-semibold prose-headings:text-mediumblue
        prose-h1:text-3xl prose-h2:text-3xl prose-h3:text-2xl 
        prose-p:text-mediumblue prose-li:text-mediumblue 
        prose-strong:text-mediumblue prose-strong:font-semibold
        prose-a:text-coral prose-a:no-underline hover:prose-a:underline 
        prose:code:text-regularblue prose:code:text-googletitre prose-code:font-medium
        prose-img:rounded-xl 
        ${className}`}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
        {allTables && allTables.map((tbl, idx) => (
          <ComparisonTable key={idx} headers={tbl.headers} rows={tbl.rows} />
        ))}
        {stackData && stackData.stack && (
          <RecommendedStackCard
            title={isEn ? "Recommended stack" : "Stack recommandée"}
            stack={stackData.stack}
            highlights={stackData.highlights}
          />
        )}
      </div>
    </>
  );
}
