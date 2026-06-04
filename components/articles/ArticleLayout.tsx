import { ArrowLeft } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { ArticleHeader } from "./ArticleHeader"
import { ArticleSidebar } from "./ArticleSidebar"
import type { Article } from "@/lib/articles"
import { TranslationFallbackBanner } from "@/components/translation-fallback-banner"

interface ArticleLayoutProps {
  article: Article
  sectionCount: number
  children: React.ReactNode
}

export function ArticleLayout({ article, sectionCount, children }: ArticleLayoutProps) {
  return (
    <div className="light article-page" style={{ minHeight: "100vh" }}>
      <TranslationFallbackBanner show={article.isFallback} />
      <section className="s">
        <div className="container">
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem", flexWrap: "wrap" }}>
            <Link
              href="/articles"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.375rem",
                fontSize: "0.8125rem",
                color: "var(--muted-color)",
                textDecoration: "none",
              }}
            >
              <ArrowLeft style={{ width: "0.875rem", height: "0.875rem" }} />
              Articles
            </Link>
            <span style={{ color: "var(--rule-strong)" }}>·</span>
            <span style={{ fontSize: "0.8125rem", color: "var(--muted-color)" }}>
              {article.category}
            </span>
          </div>

          {/* Article header */}
          <ArticleHeader article={article} sectionCount={sectionCount} />

          {/* Content grid: sidebar + body */}
          <div className="grid grid-cols-1 lg:grid-cols-4" style={{ gap: "3rem" }}>
            <ArticleSidebar
              relatedArticles={article.relatedArticles}
              relatedDocs={article.relatedDocs}
            />
            <div id="article-body" className="col-span-1 lg:col-span-3" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <div
                data-article-content
                className="light article-text"
                style={{
                  width: "100%",
                  padding: "2.5rem",
                  background: "var(--paper-2)",
                  color: "var(--ink)",
                }}
              >
                {children}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
