"use client";

import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ArticleMeta } from "@/lib/markdown";

interface ArticleSequentialNavProps {
  prev: ArticleMeta | null;
  next: ArticleMeta | null;
}

export function ArticleSequentialNav({ prev, next }: ArticleSequentialNavProps) {
  if (!prev && !next) return null;

  const cardStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.375rem",
    border: "1px solid var(--rule)",
    padding: "1rem 1.25rem",
    textDecoration: "none",
    background: "var(--paper)",
    transition: "background 0.15s",
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "var(--rule)" }}>
      {prev ? (
        <Link
          href={`/documentation/${prev.category}/${prev.slug}` as never}
          style={cardStyle}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--paper-2)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--paper)")}
        >
          <span style={{
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            fontSize: "0.6875rem",
            color: "var(--muted-color)",
            fontFamily: "var(--font-mono)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}>
            <ArrowLeft style={{ width: "0.75rem", height: "0.75rem" }} />
            Article précédent
          </span>
          <p style={{
            fontSize: "0.875rem",
            color: "var(--ink-2)",
            lineHeight: 1.4,
            fontFamily: "var(--font-serif)",
            fontWeight: 400,
          }}>
            {prev.title}
          </p>
        </Link>
      ) : (
        <div style={{ background: "var(--paper)" }} />
      )}

      {next ? (
        <Link
          href={`/documentation/${next.category}/${next.slug}` as never}
          style={{ ...cardStyle, textAlign: "right" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--paper-2)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--paper)")}
        >
          <span style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "0.375rem",
            fontSize: "0.6875rem",
            color: "var(--muted-color)",
            fontFamily: "var(--font-mono)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}>
            Article suivant
            <ArrowRight style={{ width: "0.75rem", height: "0.75rem" }} />
          </span>
          <p style={{
            fontSize: "0.875rem",
            color: "var(--ink-2)",
            lineHeight: 1.4,
            fontFamily: "var(--font-serif)",
            fontWeight: 400,
          }}>
            {next.title}
          </p>
        </Link>
      ) : (
        <div style={{ background: "var(--paper)" }} />
      )}
    </div>
  );
}
