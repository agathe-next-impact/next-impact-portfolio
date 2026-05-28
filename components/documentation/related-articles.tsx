"use client";

import { Link } from "@/i18n/navigation";
import { Clock } from "lucide-react";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { isArticleRelevantToProfile } from "@/lib/documentation-profiles";
import type { ArticleMeta } from "@/lib/markdown";

interface RelatedArticleData extends ArticleMeta {
  readingTime: number;
}

interface RelatedArticlesProps {
  articles: RelatedArticleData[];
  categoryLabels: Record<string, string>;
}

export function RelatedArticles({ articles, categoryLabels }: RelatedArticlesProps) {
  const { profileId } = useDocumentationMode();

  const sorted = profileId
    ? [...articles].sort((a, b) => {
        const aRel = isArticleRelevantToProfile(a.category, a.slug, profileId) ? 0 : 1;
        const bRel = isArticleRelevantToProfile(b.category, b.slug, profileId) ? 0 : 1;
        return aRel - bRel;
      })
    : articles;

  const display = sorted.slice(0, 3);

  if (display.length === 0) return null;

  return (
    <div>
      <div style={{ borderTop: "1px solid var(--rule)", paddingTop: "2rem", marginBottom: "1.25rem" }}>
        <h3 style={{
          fontFamily: "var(--font-serif)",
          fontSize: "1.25rem",
          fontWeight: 400,
          color: "var(--ink)",
        }}>
          Continuer la lecture
        </h3>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "1px",
        background: "var(--rule)",
      }}>
        {display.map((article, i) => {
          const isRecommended = profileId
            ? isArticleRelevantToProfile(article.category, article.slug, profileId)
            : false;

          return (
            <Link
              key={article.slug}
              href={`/documentation/${article.category}/${article.slug}` as never}
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "1.25rem",
                background: "var(--paper)",
                textDecoration: "none",
                transition: "background 0.15s",
                position: "relative",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--paper-2)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--paper)")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.5rem" }}>
                <span className="label">
                  {categoryLabels[article.category] || article.category}
                </span>
                {isRecommended && (
                  <span className="label" style={{ color: "var(--accent-color)", borderColor: "var(--accent-color)" }}>
                    Recommandé
                  </span>
                )}
              </div>
              <h4 style={{
                fontFamily: "var(--font-serif)",
                fontSize: "0.9375rem",
                fontWeight: 400,
                color: "var(--ink)",
                lineHeight: 1.35,
                marginBottom: "0.375rem",
                flex: 1,
              }}>
                {article.title}
              </h4>
              <p style={{
                fontSize: "0.75rem",
                color: "var(--muted-color)",
                lineHeight: 1.5,
                marginBottom: "0.5rem",
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}>
                {article.description}
              </p>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                color: "var(--muted-color)",
                fontSize: "0.6875rem",
                fontFamily: "var(--font-mono)",
              }}>
                <Clock style={{ width: "0.75rem", height: "0.75rem" }} />
                <span>{article.readingTime} min</span>
                <span style={{ marginLeft: "auto" }} className="annot">{String(i + 1).padStart(2, "0")}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
