"use client";

import { Link } from "@/i18n/navigation";
import { FileText } from "lucide-react";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { isArticleRelevantToProfile } from "@/lib/documentation-profiles";

interface Article {
  slug: string;
  title: string;
  description: string;
  category: string;
}

export function CategoryArticleGrid({ articles }: { articles: Article[] }) {
  const { profileId } = useDocumentationMode();

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "0 4rem",
    }}>
      {articles.map((article) => {
        const relevant = isArticleRelevantToProfile(article.category, article.slug, profileId);
        return (
          <Link
            key={article.slug}
            href={`/documentation/${article.category}/${article.slug}` as never}
            className="hover-row"
            style={{
              display: "block",
              borderTop: "1px solid var(--rule)",
              padding: "1.25rem 0",
              textDecoration: "none",
              opacity: profileId && !relevant ? 0.4 : 1,
              transition: "opacity 0.15s",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem" }}>
              <FileText style={{
                width: "0.875rem",
                height: "0.875rem",
                color: "var(--accent-color)",
                marginTop: "0.25rem",
                flexShrink: 0,
              }} />
              <div>
                {profileId && relevant && (
                  <span className="label" style={{ marginBottom: "0.375rem", display: "inline-block" }}>
                    Recommandé
                  </span>
                )}
                <h3 style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1rem",
                  fontWeight: 400,
                  color: "var(--ink)",
                  lineHeight: 1.35,
                  marginBottom: "0.25rem",
                }}>
                  {article.title}
                </h3>
                <p style={{
                  fontSize: "0.8125rem",
                  color: "var(--muted-color)",
                  lineHeight: 1.5,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}>
                  {article.description}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
