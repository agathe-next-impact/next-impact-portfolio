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
    <div className="border-t border-foreground/80 pt-8">
      {/* Ligne méta */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">
        <span className="text-accent-secondary">{article.category}</span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-3 w-3" aria-hidden />
          {article.readingTime} min de lecture
        </span>
        <span className="flex items-center gap-1.5">
          <BookOpen className="h-3 w-3" aria-hidden />
          {sectionCount} sections
        </span>
      </div>

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {article.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="border border-dark-gray px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-mid-gray"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Titre */}
      <h1 className="mt-6 text-3xl font-light leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
        {article.title}
      </h1>

      {/* Ligne KPI */}
      {article.kpis.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-x-10 gap-y-6">
          {article.kpis.map((kpi, i) => (
            <ArticleKpiCard key={i} value={kpi.value} label={kpi.label} />
          ))}
        </div>
      )}

      {/* Auteur / date */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-dark-gray pt-4">
        <div>
          <p className="text-sm font-medium text-foreground">{article.author}</p>
          <p className="font-inter-tight text-xs text-mid-gray">{article.authorRole}</p>
        </div>
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">
          {formatDateFr(article.date)}
        </span>
      </div>
    </div>
  )
}
