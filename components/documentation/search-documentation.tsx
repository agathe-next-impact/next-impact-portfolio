"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
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

  // Fonction de recherche
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCategories([])
      setFilteredArticles([])
      return
    }

    const query = searchQuery.toLowerCase()

    // Filtrer les catégories
    const matchedCategories = categories.filter(
      (category) => category.title.toLowerCase().includes(query) || category.description.toLowerCase().includes(query),
    )

    // Filtrer les articles
    const matchedArticles = articles.filter(
      (article) => article.title.toLowerCase().includes(query) || article.description.toLowerCase().includes(query),
    )

    setFilteredCategories(matchedCategories)
    setFilteredArticles(matchedArticles)
  }, [searchQuery, articles, categories])

  // Gérer le clic en dehors du composant de recherche
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearching(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Gérer la navigation avec les touches
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsSearching(false)
    } else if (e.key === "Enter" && filteredArticles.length > 0) {
      router.push(`/documentation/${filteredArticles[0].category}/${filteredArticles[0].slug}`)
      setIsSearching(false)
      setSearchQuery("")
    }
  }

  // Fonction pour effacer la recherche
  const clearSearch = () => {
    setSearchQuery("")
    inputRef.current?.focus()
  }

  return (
    <div className="w-full" ref={searchRef}>
      <div className="relative max-w-2xl mx-auto">
        <Input
          ref={inputRef}
          type="search"
          placeholder="Rechercher dans la documentation..."
          className="w-full rounded-full appearance-none pl-8 pr-10 ring-0 focus:ring-0 bg-extralightblue"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearching(true)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {isSearching && searchQuery.trim() !== "" && (
        <div className="mt-6 w-full">
          {filteredCategories.length === 0 && filteredArticles.length === 0 ? (
            <p className="text-center text-sm text-white/80 py-6">Aucun résultat trouvé</p>
          ) : (
            <div className="space-y-6">
              {filteredCategories.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium font-googletexte text-white/80 mb-3">Catégories</h3>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredCategories.map((category) => (
                      <Link
                        key={category.id}
                        href={category.url}
                        className="block rounded-xl p-4 bg-mediumblue/80 backdrop-blur-md border border-lightblue/10 hover:border-lightblue/20 transition-colors"
                        onClick={() => setIsSearching(false)}
                      >
                        <div className="font-medium font-googletexte text-white">{category.title}</div>
                        <div className="text-sm text-white/80 font-googletexte mt-1">{category.description}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {filteredArticles.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium font-googletexte text-white/80 mb-3">
                    Articles ({filteredArticles.length})
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredArticles.map((article) => (
                      <Link
                        key={article.slug}
                        href={`/documentation/${article.category}/${article.slug}`}
                        className="block rounded-xl p-4 bg-mediumblue/80 backdrop-blur-md border border-lightblue/10 hover:border-lightblue/20 transition-colors"
                        onClick={() => setIsSearching(false)}
                      >
                        <div className="font-medium font-googletexte text-white">{article.title}</div>
                        <div className="text-sm text-white/80 font-googletexte mt-1 line-clamp-2">{article.description}</div>
                        <div className="mt-2 text-xs text-extralightblue/80 font-googletexte">
                          {categories.find((c) => c.id === article.category)?.title || article.category}
                        </div>
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

