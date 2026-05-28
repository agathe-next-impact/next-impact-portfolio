"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Link } from "@/i18n/navigation"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import type { ArticleMeta } from "@/lib/markdown"

interface Category {
  id: string
  title: string
  description: string
  url: string
}

interface SearchDocumentationProps {
  articles: ArticleMeta[]
  categories: Category[]
}

export function SearchDocumentation({ articles, categories }: SearchDocumentationProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
  const [filteredArticles, setFilteredArticles] = useState<ArticleMeta[]>([])
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCategories([])
      setFilteredArticles([])
      return
    }
    const query = searchQuery.toLowerCase()
    setFilteredCategories(categories.filter(
      (c) => c.title.toLowerCase().includes(query) || c.description.toLowerCase().includes(query),
    ))
    setFilteredArticles(articles.filter(
      (a) => a.title.toLowerCase().includes(query) || a.description.toLowerCase().includes(query),
    ))
  }, [searchQuery, articles, categories])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearching(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsSearching(false)
    } else if (e.key === "Enter" && filteredArticles.length > 0) {
      router.push(`/documentation/${filteredArticles[0].category}/${filteredArticles[0].slug}`)
      setIsSearching(false)
      setSearchQuery("")
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    inputRef.current?.focus()
  }

  return (
    <div style={{ width: "100%" }} ref={searchRef}>
      {/* Input */}
      <div style={{ position: "relative", maxWidth: "36rem", margin: "0 auto" }}>
        <Search style={{
          position: "absolute",
          left: "0.875rem",
          top: "50%",
          transform: "translateY(-50%)",
          width: "0.875rem",
          height: "0.875rem",
          color: "var(--muted-color)",
          pointerEvents: "none",
        }} />
        <input
          ref={inputRef}
          type="search"
          placeholder="Rechercher dans la documentation..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearching(true)}
          onKeyDown={handleKeyDown}
          style={{
            width: "100%",
            border: "1px solid var(--rule-strong)",
            borderTop: "2px solid var(--ink)",
            background: "var(--paper)",
            padding: "0.625rem 2.5rem",
            fontSize: "0.9375rem",
            color: "var(--ink)",
            fontFamily: "var(--font-sans)",
            outline: "none",
          }}
          onFocusCapture={(e) => { e.currentTarget.style.borderTopColor = "var(--accent-color)"; }}
          onBlurCapture={(e) => { e.currentTarget.style.borderTopColor = "var(--ink)"; }}
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            style={{
              position: "absolute",
              right: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--muted-color)",
              padding: 0,
              display: "flex",
            }}
          >
            <X style={{ width: "0.875rem", height: "0.875rem" }} />
          </button>
        )}
      </div>

      {/* Results */}
      {isSearching && searchQuery.trim() !== "" && (
        <div style={{ marginTop: "1.5rem", width: "100%" }}>
          {filteredCategories.length === 0 && filteredArticles.length === 0 ? (
            <p style={{ textAlign: "center", fontSize: "0.875rem", color: "var(--muted-color)", padding: "1.5rem 0" }}>
              Aucun résultat trouvé
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

              {filteredCategories.length > 0 && (
                <div>
                  <p className="annot" style={{ textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>
                    Catégories
                  </p>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(14rem, 1fr))",
                    gap: "1px",
                    background: "var(--rule)",
                    border: "1px solid var(--rule)",
                  }}>
                    {filteredCategories.map((category) => (
                      <Link
                        key={category.id}
                        href={category.url as never}
                        style={{
                          display: "block",
                          padding: "1rem",
                          background: "var(--paper)",
                          textDecoration: "none",
                          transition: "background 0.15s",
                        }}
                        onClick={() => setIsSearching(false)}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--paper-2)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "var(--paper)")}
                      >
                        <div style={{ fontSize: "0.9375rem", fontWeight: 500, color: "var(--ink)", marginBottom: "0.25rem", fontFamily: "var(--font-serif)" }}>
                          {category.title}
                        </div>
                        <div style={{ fontSize: "0.8125rem", color: "var(--muted-color)", lineHeight: 1.4 }}>
                          {category.description}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {filteredArticles.length > 0 && (
                <div>
                  <p className="annot" style={{ textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>
                    Articles ({filteredArticles.length})
                  </p>
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    border: "1px solid var(--rule)",
                  }}>
                    {filteredArticles.map((article) => (
                      <Link
                        key={article.slug}
                        href={`/documentation/${article.category}/${article.slug}` as never}
                        style={{
                          display: "block",
                          padding: "0.875rem 1rem",
                          borderBottom: "1px solid var(--rule)",
                          background: "var(--paper)",
                          textDecoration: "none",
                          transition: "background 0.15s",
                        }}
                        onClick={() => setIsSearching(false)}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--paper-2)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "var(--paper)")}
                      >
                        <div style={{ fontSize: "0.9375rem", fontFamily: "var(--font-serif)", fontWeight: 400, color: "var(--ink)", marginBottom: "0.2rem" }}>
                          {article.title}
                        </div>
                        <div style={{ fontSize: "0.8125rem", color: "var(--muted-color)", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>
                          {article.description}
                        </div>
                        <span className="label" style={{ marginTop: "0.375rem", display: "inline-block" }}>
                          {categories.find((c) => c.id === article.category)?.title || article.category}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
