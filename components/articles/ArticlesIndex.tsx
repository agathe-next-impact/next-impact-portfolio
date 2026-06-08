"use client"

import { useState } from "react"
import { useLocale } from "next-intl"
import { ArticleCard } from "./ArticleCard"
import { BlueprintSection, SectionHeading } from "@/components/aspect/section"
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal"
import { cn } from "@/lib/utils"
import type { Locale } from "@/i18n/routing"
import type { ArticleMeta } from "@/lib/articles"

/**
 * Catégories : `value` est la valeur de filtre (= `article.category` issu du
 * frontmatter, en FR) ; le libellé affiché est localisé. `value: null` = « Tous ».
 */
const CATEGORIES: { value: string | null; fr: string; en: string }[] = [
  { value: null, fr: "Tous", en: "All" },
  { value: "WP Headless", fr: "WP Headless", en: "Headless WP" },
  { value: "TIH / AGEFIPH", fr: "TIH / AGEFIPH", en: "TIH / AGEFIPH" },
  { value: "ROI & Budget", fr: "ROI & Budget", en: "ROI & Budget" },
]

interface ArticlesIndexProps {
  articles: ArticleMeta[]
}

export function ArticlesIndex({ articles }: ArticlesIndexProps) {
  const locale = useLocale() as Locale
  const isEn = locale === "en"
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered =
    activeCategory === null
      ? articles
      : articles.filter((a) => a.category === activeCategory)

  return (
    <BlueprintSection ticks>
      {/* En-tête */}
      <Reveal className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          index="№ 01"
          kicker={isEn ? "Insights" : "Analyses"}
          title={
            isEn ? (
              <>
                Articles <span className="text-accent-secondary">&amp; comparisons</span>
              </>
            ) : (
              <>
                Articles <span className="text-accent-secondary">&amp; comparatifs</span>
              </>
            )
          }
          description={
            isEn
              ? "Field-tested analyses to make the right web decisions."
              : "Analyses de terrain pour prendre les bonnes décisions web."
          }
        />
      </Reveal>

      {/* Filtres en onglets mono */}
      <div className="flex flex-wrap gap-x-1 gap-y-2 border-b border-dark-gray px-6 py-4 lg:px-8">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.value
          return (
            <button
              key={cat.value ?? "all"}
              type="button"
              onClick={() => setActiveCategory(cat.value)}
              aria-pressed={isActive}
              className={cn(
                "border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors",
                isActive
                  ? "border-accent-secondary/60 bg-accent-secondary/10 text-accent-secondary"
                  : "border-dark-gray text-mid-gray hover:border-mid-gray hover:text-foreground",
              )}
            >
              {isEn ? cat.en : cat.fr}
            </button>
          )
        })}
      </div>

      {/* Grille de cartes bordées */}
      {filtered.length > 0 ? (
        <Stagger className="grid gap-4 px-6 py-8 sm:grid-cols-2 lg:grid-cols-3 lg:px-8 lg:py-10">
          {filtered.map((article, i) => (
            <StaggerItem key={article.slug} className="flex">
              <ArticleCard article={article} index={i} />
            </StaggerItem>
          ))}
        </Stagger>
      ) : (
        <div className="border-b border-dark-gray px-6 py-16 text-center lg:px-8">
          <p className="font-inter-tight text-sm text-mid-gray">
            {isEn
              ? "No article in this category yet."
              : "Aucun article dans cette catégorie pour le moment."}
          </p>
        </div>
      )}
    </BlueprintSection>
  )
}
