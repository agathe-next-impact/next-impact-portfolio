"use client"

import { useState } from "react"
import { ArticleCard } from "./ArticleCard"
import PageLayout from "@/components/page-layout"
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
    <PageLayout
      titre="Articles & Comparatifs"
      sousTitre="Analyses, comparatifs et retours d'expérience pour prendre les bonnes décisions web."
    >
      <section className="s" style={{ borderTop: "1px solid var(--rule)" }}>
        <div className="container">
        {/* Filtres tab-style */}
        <div style={{
          display: "flex",
          borderBottom: "1px solid var(--rule)",
          marginBottom: "2rem",
          gap: 0,
          flexWrap: "wrap",
        }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "0.5rem 1rem",
                fontSize: "0.8125rem",
                fontFamily: "var(--font-mono)",
                background: "none",
                border: "none",
                borderBottom: activeCategory === cat
                  ? "2px solid var(--ink)"
                  : "2px solid transparent",
                color: activeCategory === cat ? "var(--ink)" : "var(--muted-color)",
                cursor: "pointer",
                marginBottom: "-1px",
                transition: "color 0.15s, border-color 0.15s",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grille */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "0 4rem",
        }}>
          {filtered.map((article, i) => (
            <ArticleCard key={article.slug} article={article} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p style={{
            color: "var(--muted-color)",
            fontSize: "0.875rem",
            padding: "3rem 0",
            textAlign: "center",
          }}>
            Aucun article dans cette catégorie pour le moment.
          </p>
        )}
        </div>
      </section>
    </PageLayout>
  )
}
