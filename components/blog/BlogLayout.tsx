import { ArrowLeft, Clock } from "lucide-react"
import { Link } from "@/i18n/navigation"
import type { BlogPost } from "@/lib/blog"
import { TranslationFallbackBanner } from "@/components/translation-fallback-banner"

interface BlogLayoutProps {
  post: BlogPost
  children: React.ReactNode
}

export function BlogLayout({ post, children }: BlogLayoutProps) {
  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : ""

  return (
    <div className="light article-page" style={{ minHeight: "100vh" }}>
      <TranslationFallbackBanner show={post.isFallback} />
      <section className="s">
        <div className="container">
          {/* Breadcrumb */}
          <div style={{ marginBottom: "2rem" }}>
            <Link
              href="/blog"
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
              Blog
            </Link>
          </div>

          {/* Article header */}
          <div style={{
            borderTop: "2px solid var(--ink)",
            paddingTop: "2.5rem",
            marginBottom: "2.5rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
              {formattedDate && <span className="label">{formattedDate}</span>}
              {post.author && (
                <span style={{ fontSize: "0.8125rem", color: "var(--muted-color)" }}>
                  {post.author}
                </span>
              )}
              {post.readingTime > 0 && (
                <span style={{
                  fontSize: "0.75rem",
                  color: "var(--muted-color)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                }}>
                  <Clock style={{ width: "0.75rem", height: "0.75rem" }} />
                  {post.readingTime} min
                </span>
              )}
            </div>

            {post.tags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.25rem" }}>
                {post.tags.map((tag) => (
                  <span key={tag} className="label">{tag}</span>
                ))}
              </div>
            )}

            <h1 style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 400,
              lineHeight: 1.15,
              color: "var(--ink)",
            }}>
              {post.title}
            </h1>
          </div>

          {/* Content */}
          <div
            data-article-content
            className="light article-text"
            style={{
              padding: "2.5rem",
              background: "var(--paper-2)",
              color: "var(--ink)",
            }}
          >
            {children}
          </div>
        </div>
      </section>
    </div>
  )
}
