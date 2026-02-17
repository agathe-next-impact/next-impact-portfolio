"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

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

  // Reset active index when query changes
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Glassmorphism overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-darkblue/60 backdrop-blur-lg"
            onClick={() => setOpen(false)}
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed left-1/2 top-[20%] z-[70] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 rounded-3xl border border-lightblue/20 bg-darkblue/90 backdrop-blur-xl shadow-2xl shadow-darkblue/50 overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-lightblue/10 px-5 py-4">
              <Search className="h-5 w-5 text-lightblue/80 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Rechercher dans la documentation..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-white placeholder:text-white/80 outline-none text-base font-googletexte"
              />
              <kbd className="rounded-md bg-white/10 px-2 py-0.5 text-xs text-white/80 font-mono shrink-0">
                Esc
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <p className="py-8 text-center text-sm text-white/80 font-googletexte">
                  Aucun résultat trouvé
                </p>
              ) : (
                filtered.map((article, index) => (
                  <button
                    key={`${article.category}-${article.slug}`}
                    onClick={() => handleSelect(article)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-2xl px-4 py-3 text-left transition-all duration-200",
                      index === activeIndex
                        ? "bg-regularblue/20 border border-regularblue/30 text-white"
                        : "text-white/80 hover:bg-mediumblue/40 border border-transparent"
                    )}
                  >
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-lightblue/80" />
                    <div>
                      <div className="text-sm font-medium font-googletexte text-inherit">
                        {article.title}
                      </div>
                      <p className="text-xs text-white/80 line-clamp-1 font-googletexte">
                        {article.description}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
