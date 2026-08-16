"use client"

import { useEffect, useState } from "react"
import { Link } from "@/i18n/navigation"
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
      <div className="sticky top-28 flex flex-col gap-8 px-6 py-12 lg:px-8">
        {/* CTA */}
        <div className="border-t border-foreground/80 pt-4">
          <Link
            href="https://next-impact.digital"
            className="block bg-accent-secondary px-4 py-2.5 text-center font-mono text-xs uppercase tracking-[0.1em] text-obsidian transition-colors hover:bg-accent-secondary/85"
          >
            Diagnostic gratuit →
          </Link>
          <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.08em] text-mid-gray">
            3 min · Sans engagement
          </p>
        </div>

        {/* Sommaire */}
        {tocItems.length > 0 && (
          <nav className="border-t border-dark-gray pt-4">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray">
              Sommaire
            </p>
            <ul className="list-none border-l border-dark-gray">
              {tocItems.map(({ id, text, level }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className={cn(
                      "-ml-px block border-l-2 py-1.5 font-mono transition-colors",
                      level === 3
                        ? "pl-6 text-[11px]"
                        : "pl-3 text-xs",
                      activeId === id
                        ? "border-accent-secondary text-accent-secondary"
                        : "border-transparent text-mid-gray hover:text-foreground"
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
          <div className="border-t border-dark-gray pt-4">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray">
              Articles liés
            </p>
            <div className="flex flex-col">
              {relatedArticles.map((a) => (
                <Link
                  key={a.slug}
                  href={`/articles/${a.slug}`}
                  className="group block border-t border-dark-gray py-2.5 transition-colors hover:bg-jet"
                >
                  <span className="mb-1 inline-block font-mono text-[10px] uppercase tracking-[0.1em] text-accent-secondary">
                    {a.category}
                  </span>
                  <span className="block font-inter-tight text-[0.8125rem] leading-snug text-foreground/90 group-hover:text-foreground">
                    {a.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Documentation liée */}
        {relatedDocs.length > 0 && (
          <div className="border-t border-dark-gray pt-4">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray">
              Documentation
            </p>
            <div className="flex flex-col gap-1">
              {relatedDocs.map((d) => (
                <Link
                  key={d.path}
                  href={d.path}
                  className="flex items-center gap-2 py-1 font-inter-tight text-[0.8125rem] text-foreground/90 transition-colors hover:text-foreground"
                >
                  <span aria-hidden className="text-accent-secondary">→</span>
                  <span>{d.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
