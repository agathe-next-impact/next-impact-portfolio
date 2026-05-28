"use client"

import { useEffect, useState } from "react"
import { Link } from "@/i18n/navigation"
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
      <div style={{ position: "sticky", top: "7rem", display: "flex", flexDirection: "column", gap: "2rem" }}>

        {/* CTA */}
        <div style={{ borderTop: "2px solid var(--ink)", paddingTop: "1rem" }}>
          <Link
            href="https://next-impact.digital"
            className="btn primary"
            style={{ display: "block", textAlign: "center" }}
          >
            Diagnostic gratuit →
          </Link>
          <p style={{ fontSize: "0.6875rem", color: "var(--muted-color)", marginTop: "0.5rem", textAlign: "center" }}>
            3 min · Sans engagement
          </p>
        </div>

        {/* TOC */}
        {tocItems.length > 0 && (
          <nav style={{ borderTop: "1px solid var(--rule)", paddingTop: "1rem" }}>
            <p className="annot" style={{ textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>
              Sommaire
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {tocItems.map(({ id, text, level }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    style={{
                      display: "block",
                      padding: "0.375rem 0",
                      paddingLeft: level === 3 ? "1rem" : "0.5rem",
                      fontSize: level === 3 ? "0.75rem" : "0.8125rem",
                      color: activeId === id ? "var(--accent-color)" : "var(--muted-color)",
                      textDecoration: "none",
                      borderLeft: activeId === id
                        ? "2px solid var(--accent-color)"
                        : "2px solid transparent",
                      transition: "color 0.15s, border-color 0.15s",
                    }}
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
          <div style={{ borderTop: "1px solid var(--rule)", paddingTop: "1rem" }}>
            <p className="annot" style={{ textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>
              Articles liés
            </p>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {relatedArticles.map((a) => (
                <Link
                  key={a.slug}
                  href={`/articles/${a.slug}`}
                  className="hover-row"
                  style={{
                    display: "block",
                    padding: "0.625rem 0",
                    borderTop: "1px solid var(--rule)",
                    fontSize: "0.8125rem",
                    color: "var(--ink-2)",
                    textDecoration: "none",
                  }}
                >
                  <span className="label" style={{ marginBottom: "0.25rem", display: "inline-block" }}>
                    {a.category}
                  </span>
                  <span style={{ display: "block", lineHeight: 1.4 }}>{a.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Documentation liée */}
        {relatedDocs.length > 0 && (
          <div style={{ borderTop: "1px solid var(--rule)", paddingTop: "1rem" }}>
            <p className="annot" style={{ textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>
              Documentation
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {relatedDocs.map((d) => (
                <Link
                  key={d.path}
                  href={d.path}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.8125rem",
                    color: "var(--muted-color)",
                    textDecoration: "none",
                    padding: "0.25rem 0",
                  }}
                >
                  <span style={{ color: "var(--accent-color)" }}>→</span>
                  <span style={{ color: "var(--ink-2)" }}>{d.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
