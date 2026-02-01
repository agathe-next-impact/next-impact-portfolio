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
    <div className="relative w-full max-w-xl" ref={searchRef}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="search"
          placeholder="Rechercher dans la documentation..."
          className="w-full rounded-full appearance-none pl-8 pr-10 shadow-none ring-0 focus:ring-0 bg-extralightblue"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearching(true)}
          onKeyDown={handleKeyDown}
        />
        {/* Croix supprimée */}
      </div>

      {isSearching && (searchQuery || filteredCategories.length > 0 || filteredArticles.length > 0) && (
        <div className="absolute top-full z-10 w-full rounded-md bg-darkblue/90 shadow-md">
          <div className="p-2">
            {filteredCategories.length === 0 && filteredArticles.length === 0 ? (
              <p className="text-center text-sm py-6">No results found</p>
            ) : (
              <>
                {filteredCategories.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-white mb-2">Categories</h3>
                    <ul className="space-y-2">
                      {filteredCategories.map((category) => (
                        <li key={category.id}>
                          <Link
                            href={category.url}
                            className="block rounded-md p-2 hover:bg-mediumblue/50 border-b border-white/10"
                            onClick={() => setIsSearching(false)}
                          >
                            <div className="font-medium text-white">{category.title}</div>
                            <div className="text-sm text-extralightblue/70">{category.description}</div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {filteredArticles.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-white mb-2">Articles</h3>
                    <ul className="space-y-2">
                      {filteredArticles.map((article) => (
                        <li key={article.slug}>
                          <Link
                            href={`/documentation/${article.category}/${article.slug}`}
                            className="block p-2 hover:bg-mediumblue/50 border-b border-white/10"
                            onClick={() => setIsSearching(false)}
                          >
                            <div className="font-medium text-white">{article.title}</div>
                            <div className="text-sm text-extralightblue/70">{article.description}</div>
                            <div className="mt-1 text-xs text-extralightblue/80">
                              Categorie: {categories.find((c) => c.id === article.category)?.title || article.category}
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

