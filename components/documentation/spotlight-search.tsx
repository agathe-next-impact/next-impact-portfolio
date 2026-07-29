"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, X } from "lucide-react";

interface SpotlightArticle {
  slug: string;
  title: string;
  description: string;
  category: string;
}

export function SpotlightSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState<SpotlightArticle[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Fetch articles once on mount
  useEffect(() => {
    fetch("/api/documentation-articles")
      .then((res) => res.json())
      .then(setArticles)
      .catch(() => {});
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setActiveIndex(0);
    }
  }, [open]);

  const filtered = query.trim()
    ? articles.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.description.toLowerCase().includes(query.toLowerCase()) ||
          a.category.toLowerCase().includes(query.toLowerCase())
      )
    : articles.slice(0, 8);

  const handleSelect = useCallback(
    (article: SpotlightArticle) => {
      router.push(`/documentation/${article.category}/${article.slug}`);
      setOpen(false);
    },
    [router]
  );

  // Keyboard navigation within results
  useEffect(() => {
    if (!open) return;
    const handleNav = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && filtered[activeIndex]) {
        handleSelect(filtered[activeIndex]);
      }
    };
    document.addEventListener("keydown", handleNav);
    return () => document.removeEventListener("keydown", handleNav);
  }, [open, filtered, activeIndex, handleSelect]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 60,
          background: "rgba(14,14,12,0.45)",
        }}
        onClick={() => setOpen(false)}
      />

      {/* Panel */}
      <div
        style={{
          position: "fixed",
          left: "50%",
          top: "20%",
          transform: "translateX(-50%)",
          width: "min(560px, calc(100vw - 2rem))",
          zIndex: 70,
          background: "var(--paper)",
          border: "1px solid var(--rule-strong)",
          borderTop: "2px solid var(--ink)",
          overflow: "hidden",
        }}
      >
        {/* Input row */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          borderBottom: "1px solid var(--rule)",
          padding: "0.75rem 1rem",
        }}>
          <Search style={{ width: "1rem", height: "1rem", color: "var(--muted-color)", flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Rechercher..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              minWidth: 0,
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: "0.9375rem",
              color: "var(--ink)",
              fontFamily: "var(--font-sans)",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", flexShrink: 0 }}>
            <kbd style={{
              border: "1px solid var(--rule)",
              padding: "0.125rem 0.375rem",
              fontSize: "0.625rem",
              fontFamily: "var(--font-mono)",
              color: "var(--muted-color)",
              background: "var(--paper-2)",
            }}>
              Esc
            </kbd>
            <button
              onClick={() => setOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "1.5rem",
                height: "1.5rem",
                border: "1px solid var(--rule)",
                background: "var(--paper)",
                color: "var(--muted-color)",
                cursor: "pointer",
              }}
            >
              <X style={{ width: "0.75rem", height: "0.75rem" }} />
            </button>
          </div>
        </div>

        {/* Results */}
        <div style={{ maxHeight: "20rem", overflowY: "auto" }}>
          {filtered.length === 0 ? (
            <p style={{
              padding: "2rem",
              textAlign: "center",
              fontSize: "0.875rem",
              color: "var(--muted-color)",
            }}>
              Aucun résultat trouvé
            </p>
          ) : (
            filtered.map((article, index) => (
              <button
                key={`${article.category}-${article.slug}`}
                onClick={() => handleSelect(article)}
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "flex-start",
                  gap: "0.75rem",
                  padding: "0.75rem 1rem",
                  textAlign: "left",
                  border: "none",
                  borderBottom: "1px solid var(--rule)",
                  borderLeft: index === activeIndex
                    ? "3px solid var(--accent-color)"
                    : "3px solid transparent",
                  background: index === activeIndex ? "var(--paper-2)" : "var(--paper)",
                  cursor: "pointer",
                  transition: "background 0.1s, border-left-color 0.1s",
                }}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <FileText style={{
                  marginTop: "0.125rem",
                  width: "0.875rem",
                  height: "0.875rem",
                  flexShrink: 0,
                  color: index === activeIndex ? "var(--accent-color)" : "var(--muted-color)",
                }} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "var(--ink)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}>
                    {article.title}
                  </div>
                  <p style={{
                    fontSize: "0.75rem",
                    color: "var(--muted-color)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    marginTop: "0.125rem",
                  }}>
                    {article.description}
                  </p>
                </div>
                <span className="annot" style={{ flexShrink: 0, paddingTop: "0.125rem" }}>
                  {article.category}
                </span>
              </button>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div style={{
          borderTop: "1px solid var(--rule)",
          padding: "0.5rem 1rem",
          display: "flex",
          gap: "1rem",
        }}>
          {[
            { key: "↑↓", label: "naviguer" },
            { key: "↵", label: "ouvrir" },
            { key: "Esc", label: "fermer" },
          ].map(({ key, label }) => (
            <span key={key} style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
              <kbd style={{
                border: "1px solid var(--rule)",
                padding: "0.0625rem 0.375rem",
                fontSize: "0.5625rem",
                fontFamily: "var(--font-mono)",
                color: "var(--muted-color)",
                background: "var(--paper-2)",
              }}>
                {key}
              </kbd>
              <span className="annot">{label}</span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
