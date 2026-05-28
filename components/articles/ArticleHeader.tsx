import { Clock, BookOpen } from "lucide-react"
import { ArticleKpiCard } from "./ArticleKpiCard"
import type { ArticleMeta } from "@/lib/articles"

interface ArticleHeaderProps {
  article: ArticleMeta
  sectionCount: number
}

function formatDateFr(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function ArticleHeader({ article, sectionCount }: ArticleHeaderProps) {
  return (
    <div style={{
      borderTop: "2px solid var(--ink)",
      paddingTop: "2.5rem",
      marginBottom: "2.5rem",
    }}>
      {/* Meta row */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <span className="label">{article.category}</span>
        <span style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "var(--muted-color)", fontSize: "0.75rem" }}>
          <Clock style={{ width: "0.75rem", height: "0.75rem" }} />
          {article.readingTime} min de lecture
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "var(--muted-color)", fontSize: "0.75rem" }}>
          <BookOpen style={{ width: "0.75rem", height: "0.75rem" }} />
          {sectionCount} sections
        </span>
      </div>

      {/* Tags */}
      {article.tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.25rem" }}>
          {article.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="label">{tag}</span>
          ))}
        </div>
      )}

      {/* Title */}
      <h1 style={{
        fontFamily: "var(--font-serif)",
        fontSize: "clamp(2rem, 5vw, 3rem)",
        fontWeight: 400,
        lineHeight: 1.15,
        color: "var(--ink)",
        marginBottom: "1.5rem",
      }}>
        {article.title}
      </h1>

      {/* KPI row */}
      {article.kpis.length > 0 && (
        <div style={{ display: "flex", gap: "2rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {article.kpis.map((kpi, i) => (
            <ArticleKpiCard key={i} value={kpi.value} label={kpi.label} />
          ))}
        </div>
      )}

      {/* Author / date */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderTop: "1px solid var(--rule)",
        paddingTop: "1rem",
        flexWrap: "wrap",
        gap: "0.5rem",
      }}>
        <div>
          <p style={{ fontSize: "0.875rem", color: "var(--ink-2)", fontWeight: 500 }}>
            {article.author}
          </p>
          <p style={{ fontSize: "0.75rem", color: "var(--muted-color)" }}>
            {article.authorRole}
          </p>
        </div>
        <span className="annot">{formatDateFr(article.date)}</span>
      </div>
    </div>
  )
}
