import { Link } from "@/i18n/navigation"
import { Clock } from "lucide-react"
import type { ArticleMeta } from "@/lib/articles"

interface ArticleCardProps {
  article: ArticleMeta
  index?: number
}

export function ArticleCard({ article, index = 0 }: ArticleCardProps) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="hover-row"
      style={{
        display: "block",
        borderTop: "1px solid var(--rule)",
        padding: "1.25rem 0",
        textDecoration: "none",
        color: "var(--ink)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
        <div style={{ flex: 1 }}>
          <span className="label" style={{ marginBottom: "0.5rem", display: "inline-block" }}>
            {article.category}
          </span>
          <h3 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.0625rem",
            fontWeight: 400,
            color: "var(--ink)",
            lineHeight: 1.3,
            marginBottom: "0.5rem",
          }}>
            {article.title}
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--muted-color)", fontSize: "0.6875rem" }}>
            <Clock style={{ width: "0.75rem", height: "0.75rem" }} />
            <span>{article.readingTime} min</span>
            {article.tags.slice(0, 2).map(tag => (
              <span key={tag}>· {tag}</span>
            ))}
          </div>
        </div>
        <span className="annot" style={{ paddingTop: "0.125rem" }}>
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
    </Link>
  )
}
