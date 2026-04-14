import { Clock, BookOpen } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
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
    <div className="rounded-3xl bg-gradient-to-br from-mediumblue/90 via-mediumblue/80 to-darkblue/70 backdrop-blur-sm p-6 md:p-10 lg:p-12 border border-lightblue/10 mb-6">
      {/* Category + Reading time + Sections */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <span className="rounded-full bg-blue-500/20 border border-blue-400/30 px-3 py-1 text-xs font-googletexte text-blue-600 dark:text-blue-300">
          {article.category}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-white/80 font-googletexte">
          <Clock className="h-3 w-3" />
          {article.readingTime} min de lecture
        </span>
        <span className="flex items-center gap-1.5 text-xs text-white/80 font-googletexte">
          <BookOpen className="h-3 w-3" />
          {sectionCount} sections
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {article.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-googletexte text-blue-600 dark:text-blue-300/80"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <h1 className="font-googletitre text-3xl md:text-4xl lg:text-5xl tracking-tight font-medium mb-5 text-white leading-tight">
        {article.title}
      </h1>

      {/* KPI row */}
      {article.kpis.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6 max-w-lg">
          {article.kpis.map((kpi, i) => (
            <ArticleKpiCard key={i} value={kpi.value} label={kpi.label} />
          ))}
        </div>
      )}

      {/* Author meta */}
      <div className="flex items-center gap-4 mt-8 pt-6 border-t border-lightblue/10 flex-wrap">
        <div className="flex items-center gap-3">
          <Image
            src="/img/logo-blanc-carre.png"
            alt="Next Impact"
            width={28}
            height={28}
            className="object-contain rounded-lg"
          />
          <div>
            <p className="text-sm text-white/80 font-googletexte font-medium">
              {article.author}
            </p>
            <p className="text-xs text-white/50 font-googletexte">
              {article.authorRole}
            </p>
          </div>
        </div>
        <span className="text-xs text-white/50 font-googletexte ml-auto">
          {formatDateFr(article.date)}
        </span>
      </div>
    </div>
  )
}
