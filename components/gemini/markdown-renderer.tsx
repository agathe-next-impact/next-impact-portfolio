"use client";
import React from "react";
import { marked } from "marked";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = "", analyzedUrl }: MarkdownRendererProps & { analyzedUrl?: string }) {
  
  // --- 1. Nettoyage du contenu (Identique à avant) ---
  let cleanContent = content;
  const identityRegex = /(\*\*Étape 1\s?:[\s\S]*?)(?=\*\*Étape 2)/i;
  
  if (identityRegex.test(cleanContent)) {
    cleanContent = cleanContent.replace(identityRegex, "");
  }

  const step2TitleRegex = /\*\*Étape 2\s?:\s?Analyse Stratégique\s?\(Format Markdown\)\*\*/i;
  cleanContent = cleanContent.replace(step2TitleRegex, "");
  cleanContent = cleanContent.trim();
  
  // --- 2. Configuration du Renderer Custom pour les Tableaux ---
  const renderer = new marked.Renderer();

  // Personnalisation du conteneur de tableau (pour le scroll et le style carte)
  renderer.table = ({ header, body }: { header: string, body: string }) => {
    return `
      <div class="not-prose my-8 w-full overflow-hidden rounded-xl border border-mediumblue/10 shadow-sm bg-white/50 backdrop-blur-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-mediumblue/5 text-mediumblue font-googletitre border-b border-mediumblue/10">
              ${header}
            </thead>
            <tbody class="divide-y divide-mediumblue/10 bg-transparent">
              ${body}
            </tbody>
          </table>
        </div>
      </div>
    `;
  };

  // Personnalisation des cellules
  renderer.tablecell = ({ content, flags }: { content: string, flags: { header: boolean, align: string } }) => {
    const isHeader = flags.header;
    const Tag = isHeader ? 'th' : 'td';
    
    // Styles de base
    let classes = isHeader 
      ? "px-6 py-4 font-semibold uppercase tracking-wider text-xs whitespace-nowrap" 
      : "px-6 py-4 text-gray-600";
    
    // Logique pour centrer les colonnes de comparaison (souvent les colonnes 2 et +)
    // Astuce : on ne peut pas facilement savoir l'index ici sans contexte global, 
    // mais on peut forcer l'alignement via markdown (:--:) ou CSS global
    
    return `<${Tag} class="${classes}">${content}</${Tag}>`;
  };

  // Appliquer le renderer SANS affecter l'instance globale si possible, 
  // mais marked.use est global. On l'utilise ici pour s'assurer que ce composant rend bien comme prévu.
  // Note : Dans une très grosse app, on préférerait "new Marked({ renderer })"
  marked.use({ renderer });

  // --- 3. Ajout du Titre H1 dynamiquement ---
  const finalContent = `# Voici l'audit stratégique de votre site ${analyzedUrl ? analyzedUrl : ''}\n\n` + cleanContent;

  // Rendu
  const htmlContent = marked.parse(finalContent) as string;

  return (
    <div
      className={`prose prose-lg dark:prose-invert max-w-none 
      prose-headings:font-googletitre prose-headings:font-semibold prose-headings:text-mediumblue
      prose-h1:text-3xl prose-h2:text-3xl prose-h3:text-2xl 
      prose-p:text-mediumblue prose-li:text-mediumblue 
      prose-strong:text-mediumblue prose-strong:font-semibold
      prose-a:text-coral prose-a:no-underline hover:prose-a:underline 
      prose:code:text-regularblue prose:code:text-googletitre prose-code:font-medium
      prose-img:rounded-xl prose-img:shadow-lg
      ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
