"use client";
import React from "react";
import { marked } from "marked";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = "", analyzedUrl }: MarkdownRendererProps & { analyzedUrl?: string }) {
  // Masquer spécifiquement la section "Étape 1 : Diagnostic d'Identité"
  // On cherche le début de l'étape 1 et on supprime jusqu'au début de l'étape 2 ou jusqu'à la fin si pas d'étape 2 (bien que le prompt demande étape 2)
  // On utilise une regex qui capture de "**Étape 1" jusqu'à "**Étape 2" (non inclus) ou la fin du fichier si non trouvé.
  // Modification pour être robuste : on remplace par une chaîne vide.
  
  let cleanContent = content;

  // Regex pour retirer l'étape 1
  // On assume que le prompt génère "**Étape 1 :" ou "**Étape 1**" etc.
  // Le prompt attendu est "**Étape 1 : Diagnostic d'Identité"
  const identityRegex = /(\*\*Étape 1\s?:[\s\S]*?)(?=\*\*Étape 2)/i;
  
  if (identityRegex.test(cleanContent)) {
    cleanContent = cleanContent.replace(identityRegex, "");
  }

  // Masquer la ligne "Étape 2 : Analyse Stratégique (Format Markdown)"
  const step2TitleRegex = /\*\*Étape 2\s?:\s?Analyse Stratégique\s?\(Format Markdown\)\*\*/i;
  cleanContent = cleanContent.replace(step2TitleRegex, "");

  // Nettoyer les espaces inutiles au début
  cleanContent = cleanContent.trim();


  // Configuration de marked pour gerer les sauts de ligne si besoin (gfm est true par defaut)
  
  // Rendu
  const htmlContent = marked.parse(cleanContent) as string;

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
      prose-table:w-full prose-table:border-collapse prose-table:my-6
      prose-thead:bg-mediumblue/10 prose-thead:text-mediumblue
      prose-th:border prose-th:border-mediumblue/20 prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-semibold
      prose-td:border prose-td:border-mediumblue/20 prose-td:px-4 prose-td:py-2 prose-td:text-mediumblue
      prose-tr:even:bg-mediumblue/5 ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
