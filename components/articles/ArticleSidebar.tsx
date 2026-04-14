"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { RelatedArticle, RelatedDoc } from "@/lib/articles"

interface TocItem {
  id: string
  text: string
  level: number
}

interface ArticleSidebarProps {
  relatedArticles: RelatedArticle[]
  relatedDocs: RelatedDoc[]
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\wÀ-ÖØ-öø-ÿ-]/g, "")
}

export function ArticleSidebar({ relatedArticles, relatedDocs }: ArticleSidebarProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const articleEl = document.querySelector("[data-article-content]")
    if (!articleEl) return

    const headings = articleEl.querySelectorAll("h2, h3")
    const items: TocItem[] = Array.from(headings).map((h) => {
      const text = h.textContent || ""
      const id = h.id || slugify(text)
      if (!h.id) h.id = id
      const level = h.tagName === "H2" ? 2 : 3
      return { id, text, level }
    })
    setTocItems(items)
  }, [])

  useEffect(() => {
    if (tocItems.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
            break
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    )

    tocItems.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [tocItems])

  return (
    <aside className="col-span-1 hidden lg:block">
      <div className="sticky top-28 space-y-4">
        {/* CTA Diagnostic */}
        <div className="rounded-2xl bg-blue-500/10 dark:bg-gradient-to-br dark:from-regularblue/30 dark:to-mediumblue/60 backdrop-blur-sm border border-blue-200 dark:border-lightblue/10 p-5 text-center">
          <Link
            href="https://next-impact.digital"
            className="block w-full bg-coral text-darkblue text-xs font-medium font-googletexte py-2.5 rounded-xl transition-all duration-300 hover:opacity-90 text-center"
          >
            Diagnostic gratuit &rarr;
          </Link>
          <p className="text-[10px] text-white/90 font-googletexte mt-2">
            3 min &middot; Sans engagement
          </p>
        </div>

        {/* Sommaire — même style que TableOfContentsPopup */}
        {tocItems.length > 0 && (
          <nav className="relative w-full h-max bg-darkblue/60 backdrop-blur-sm border border-lightblue/10 p-5 rounded-2xl">
            <p className="text-xs text-white/80 font-googletexte uppercase tracking-wider mb-4">
              Sommaire
            </p>
            <ul className="space-y-0.5">
              {tocItems.map(({ id, text, level }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className={cn(
                      "block rounded-lg px-3 py-1.5 font-googletexte transition-all duration-200",
                      level === 3 ? "pl-6 text-xs" : "text-sm",
                      activeId === id
                        ? "text-white bg-regularblue/15 border-l-2 border-orange"
                        : "text-white/80 hover:text-white/80 hover:bg-darkblue/40 border-l-2 border-transparent"
                    )}
                  >
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Articles liés */}
        {relatedArticles.length > 0 && (
          <div className="bg-darkblue/60 backdrop-blur-sm border border-lightblue/10 p-5 rounded-2xl">
            <p className="text-xs text-white/80 font-googletexte uppercase tracking-wider mb-3">
              Articles liés
            </p>
            <div className="space-y-2">
              {relatedArticles.map((a) => (
                <Link
                  key={a.slug}
                  href={`/articles/${a.slug}`}
                  className="block rounded-xl p-2.5 hover:bg-darkblue/40 transition-all duration-200 border border-transparent hover:border-lightblue/10"
                >
                  <span className="inline-block rounded-full bg-blue-500/10 px-2 py-0.5 text-[9px] font-googletexte text-blue-600 dark:text-blue-300/80 mb-1">
                    {a.category}
                  </span>
                  <span className="block text-xs text-white/70 font-googletexte leading-snug hover:text-white/90 transition-colors">
                    {a.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Documentation liée */}
        {relatedDocs.length > 0 && (
          <div className="bg-darkblue/60 backdrop-blur-sm border border-lightblue/10 p-5 rounded-2xl">
            <p className="text-xs text-white/80 font-googletexte uppercase tracking-wider mb-3">
              Documentation
            </p>
            <div className="space-y-1.5">
              {relatedDocs.map((d) => (
                <Link
                  key={d.path}
                  href={d.path}
                  className="flex items-center gap-2 text-xs text-white/50 font-googletexte hover:text-white/80 transition-colors py-1"
                >
                  <span className="text-white/40">&rarr;</span>
                  <span className="text-white/80">{d.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
