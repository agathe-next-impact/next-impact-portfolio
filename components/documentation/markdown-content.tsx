"use client";

import { marked } from "marked";
import { useEffect, useState } from "react";

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    const renderer = new marked.Renderer();

    renderer.heading = ({ text, depth }: { text: string; depth: number }) => {
      const anchor = text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\wÀ-ÖØ-öø-ÿ-]/g, "");

      // H2 gets a thin rule separator above it
      const separator = depth === 2
        ? `<div style="margin-top:3rem;margin-bottom:1rem;border-top:1px solid var(--rule)"></div>`
        : "";

      return `${separator}<h${depth} id="${anchor}">${text}</h${depth}>`;
    };

    marked.setOptions({ gfm: true, renderer });

    const parsedContent = marked.parse(content);
    if (typeof parsedContent === "string") {
      setHtml(parsedContent);
    }
  }, [content]);

  return (
    <div
      className="light article-text"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
