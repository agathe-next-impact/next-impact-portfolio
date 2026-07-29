import { ArrowUpRight } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { useLocale } from "next-intl"
import type { Locale } from "@/i18n/routing"
import type { ArticleMeta } from "@/lib/articles"

interface ArticleCardProps {
  article: ArticleMeta
  index?: number
}

export function ArticleCard({ article, index = 0 }: ArticleCardProps) {
  const locale = useLocale() as Locale
  const isEn = locale === "en"
  const kpi = article.kpis[0]
  const formattedDate = article.date
    ? new Date(article.date).toLocaleDateString(isEn ? "en-GB" : "fr-FR", {
        month: "short",
        year: "numeric",
      })
    : ""

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group relative flex h-full w-full flex-col border border-dark-gray bg-transparent p-6 transition-colors hover:bg-jet lg:p-8"
    >
      {/* Meta : index + catégorie */}
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray">
        <span className="text-accent-secondary">{article.category}</span>
        <span>{String(index + 1).padStart(2, "0")}</span>
      </div>

      {/* Titre */}
      <h3 className="mt-5 text-xl font-light leading-snug tracking-tight text-foreground lg:text-2xl">
        {article.title}
      </h3>

      {/* KPI saillant */}
      {kpi && (
        <div className="mt-5 flex items-baseline gap-2">
          <span className="font-mono text-2xl font-light tracking-tight text-accent-secondary">
            {kpi.value}
          </span>
          <span className="font-inter-tight text-xs leading-tight text-mid-gray">
            {kpi.label}
          </span>
        </div>
      )}

      {/* Pied : date + temps de lecture + flèche */}
      <div className="mt-auto flex items-center gap-2 pt-6 font-mono text-[10px] tracking-[0.06em] text-mid-gray">
        {formattedDate && <span>{formattedDate}</span>}
        {formattedDate && <span aria-hidden>·</span>}
        <span>
          {article.readingTime} min{isEn ? "" : " de lecture"}
        </span>
        <ArrowUpRight
          size={14}
          className="ml-auto text-accent-secondary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden
        />
      </div>
    </Link>
  )
}
