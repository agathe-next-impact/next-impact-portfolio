"use client"

import { useState } from "react"
import { ArticleCard } from "./ArticleCard"
import type { ArticleMeta } from "@/lib/articles"

const categories = ["Tous", "WP Headless", "TIH / AGEFIPH", "ROI & Budget"]

interface ArticlesIndexProps {
  articles: ArticleMeta[]
}

export function ArticlesIndex({ articles }: ArticlesIndexProps) {
  const [activeCategory, setActiveCategory] = useState("Tous")

  const filtered =
    activeCategory === "Tous"
      ? articles
      : articles.filter((a) => a.category === activeCategory)

  return (
    <div className="relative z-10 min-h-screen">
      <div className="container px-4 md:px-6 py-8 md:py-12 lg:py-16 space-y-8">
        {/* Hero */}
        <div className="rounded-3xl bg-gradient-to-br from-mediumblue/90 via-mediumblue/80 to-darkblue/70 backdrop-blur-sm p-6 md:p-10 lg:p-12 border border-lightblue/10">
          <h1 className="font-googletitre text-3xl md:text-4xl lg:text-5xl tracking-tight font-medium text-white mb-3">
            Articles &amp; Comparatifs
          </h1>
          <p className="text-lg text-white/80 font-googletexte font-light max-w-2xl leading-relaxed">
            Analyses, comparatifs et retours d&apos;expérience pour prendre les bonnes décisions web.
          </p>

          {/* Filtres */}
          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-lightblue/10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium font-googletexte transition-all duration-200 border ${
                  activeCategory === cat
                    ? "bg-coral/15 text-coral border-coral/30"
                    : "bg-transparent text-white/60 border-lightblue/10 hover:text-white/80 hover:border-lightblue/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grille */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filtered.map((article, i) => (
            <ArticleCard key={article.slug} article={article} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-white/40 text-sm font-googletexte py-12">
            Aucun article dans cette catégorie pour le moment.
          </p>
        )}
      </div>
    </div>
  )
}
