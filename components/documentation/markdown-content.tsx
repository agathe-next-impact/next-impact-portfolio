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
      let border = "";
      if (depth === 1) {
        className = "text-4xl font-medium text-regularblue";
      } else if (depth === 2) {
        className = "text-3xl font-medium text-mediumblue";
        border = `<hr class="border-t-[1px] border-extralightblue mt-12 mb-2" />`;
      } else {
        className = "text-2xl font-medium text-mediumblue";
      }

      return `${border}<h${depth} id="${anchor}" class="${className}">${text}</h${depth}>`;
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