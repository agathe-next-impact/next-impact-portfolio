"use client";

import { marked } from "marked";
import { useEffect, useState } from "react";

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    // Configuration de marked pour une meilleure sécurité et personnalisation
    const renderer = new marked.Renderer();

    // Ajout d'ancres et de classes sur les titres H1, H2 et H3
    renderer.heading = ({ text, depth }: { text: string; depth: number }) => {
      const anchor = text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\wÀ-ÖØ-öø-ÿ-]/g, "");

      let className = "";
      let separator = "";
      if (depth === 1) {
        className = "text-4xl font-medium text-regularblue";
      } else if (depth === 2) {
        className = "text-3xl font-medium text-mediumblue";
        separator = `<div class="mt-12 mb-4 flex items-center gap-3"><div class="h-px flex-1 bg-gradient-to-r from-transparent via-lightblue/40 to-transparent"></div><div class="h-1.5 w-1.5 rounded-full bg-regularblue/30"></div><div class="h-px flex-1 bg-gradient-to-r from-transparent via-lightblue/40 to-transparent"></div></div>`;
      } else {
        className = "text-2xl font-medium text-mediumblue";
      }

      return `${separator}<h${depth} id="${anchor}" class="${className}">${text}</h${depth}>`;
    };

    marked.setOptions({
      gfm: true, // GitHub Flavored Markdown
      renderer,
    });

    const parsedContent = marked.parse(content);
    if (typeof parsedContent === "string") {
      setHtml(parsedContent);
    }
  }, [content]);

  return <div className="article-text text-mediumblue" dangerouslySetInnerHTML={{ __html: html }} />;
}