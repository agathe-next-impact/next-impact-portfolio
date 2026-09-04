"use client";

// DocumentationSearch — moteur de recherche du hub documentation, rendu dans le
// héros (headerSlot de PageLayout). Suggestions dynamiques côté client sur le
// corpus passé en props (titre + description + catégorie), sans dépendance ni
// appel réseau : le hub est statique, le filtrage est instantané.
//
// La liste de suggestions est rendue dans un portail (document.body), en
// position fixe : le héros BlueprintSection est en overflow-hidden et
// clipperait sinon la liste ; le portail garantit l'avant-plan quel que soit
// le stacking en dessous.
//
// Accessibilité : motif combobox ARIA (listbox, aria-activedescendant,
// navigation clavier flèches / Entrée / Échap).

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useRouter } from "@/i18n/navigation";
import { Search, FileText } from "lucide-react";
import { docCategoryLabel } from "@/lib/documentation-categories";
import type { Locale } from "@/i18n/routing";

export interface DocSearchItem {
  slug: string;
  category: string;
  title: string;
  description: string;
}

const MAX_SUGGESTIONS = 8;

/** Minuscules + suppression des accents, pour un filtrage tolérant. */
function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function rank(items: DocSearchItem[], query: string): DocSearchItem[] {
  const tokens = normalize(query).split(/\s+/).filter(Boolean);
  if (!tokens.length) return [];

  const scored: { item: DocSearchItem; score: number }[] = [];
  for (const item of items) {
    const title = normalize(item.title);
    const description = normalize(item.description);
    const category = normalize(item.category);

    let score = 0;
    let matchesAll = true;
    for (const token of tokens) {
      if (title.startsWith(token)) score += 6;
      else if (title.includes(token)) score += 4;
      else if (description.includes(token)) score += 2;
      else if (category.includes(token)) score += 1;
      else {
        matchesAll = false;
        break;
      }
    }
    if (matchesAll) scored.push({ item, score });
  }

  return scored
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
    .slice(0, MAX_SUGGESTIONS)
    .map((s) => s.item);
}

interface AnchorRect {
  top: number;
  left: number;
  width: number;
}

export function DocumentationSearch({
  items,
  locale,
}: {
  items: DocSearchItem[];
  locale: Locale;
}) {
  const isEn = locale === "en";
  const router = useRouter();
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [mounted, setMounted] = useState(false);
  const [anchor, setAnchor] = useState<AnchorRect | null>(null);

  useEffect(() => setMounted(true), []);

  const suggestions = useMemo(() => rank(items, query), [items, query]);
  const showList = open && query.trim().length >= 2;

  // Position fixe de la liste, recalculée à l'ouverture puis au scroll/resize.
  useEffect(() => {
    if (!showList) return;
    const update = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) setAnchor({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [showList]);

  // Fermeture au clic hors du champ et hors de la liste (portail inclus).
  useEffect(() => {
    if (!showList) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        !containerRef.current?.contains(target) &&
        !listRef.current?.contains(target)
      ) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [showList]);

  const hrefOf = (item: DocSearchItem) =>
    `/documentation/${item.category}/${item.slug}`;

  const close = () => {
    setOpen(false);
    setActiveIndex(-1);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showList || !suggestions.length) {
      if (e.key === "Escape") close();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      close();
      router.push(hrefOf(suggestions[activeIndex]) as never);
    } else if (e.key === "Escape") {
      close();
    }
  };

  const list =
    mounted && showList && anchor
      ? createPortal(
          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-label="Suggestions"
            style={{ top: anchor.top, left: anchor.left, width: anchor.width }}
            className="fixed z-[100] max-h-96 overflow-y-auto border border-dark-gray bg-obsidian shadow-2xl"
          >
            {suggestions.length === 0 ? (
              <li className="px-4 py-3 font-inter-tight text-sm text-mid-gray">
                {isEn ? "No guide found for" : "Aucun guide trouvé pour"} «{" "}
                {query.trim()} »
              </li>
            ) : (
              suggestions.map((item, index) => (
                <li
                  key={`${item.category}/${item.slug}`}
                  id={`${listboxId}-option-${index}`}
                  role="option"
                  aria-selected={index === activeIndex}
                >
                  <Link
                    href={hrefOf(item) as never}
                    tabIndex={-1}
                    onClick={close}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`flex items-start gap-3 border-b border-dark-gray px-4 py-3 no-underline transition-colors last:border-b-0 ${
                      index === activeIndex ? "bg-jet/60" : "hover:bg-jet/40"
                    }`}
                  >
                    <FileText
                      size={14}
                      strokeWidth={1.5}
                      className="mt-0.5 shrink-0 text-accent-secondary"
                      aria-hidden
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-light tracking-tight text-foreground">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray">
                        {docCategoryLabel(item.category, locale)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))
            )}
          </ul>,
          document.body,
        )
      : null;

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className="flex items-center gap-3 border border-dark-gray bg-obsidian px-4 py-3 transition-colors focus-within:border-accent-secondary">
        <Search
          size={16}
          strokeWidth={1.5}
          className="shrink-0 text-mid-gray"
          aria-hidden
        />
        <input
          type="search"
          role="combobox"
          aria-expanded={showList && suggestions.length > 0}
          aria-controls={listboxId}
          aria-activedescendant={
            activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
          }
          aria-autocomplete="list"
          aria-label={
            isEn ? "Search the documentation" : "Rechercher dans la documentation"
          }
          placeholder={
            isEn
              ? "Search the documentation (web app, SEO, headless…)"
              : "Rechercher dans la documentation (web app, SEO, headless…)"
          }
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="w-full bg-transparent font-inter-tight text-sm text-foreground outline-none placeholder:text-mid-gray [&::-webkit-search-cancel-button]:hidden"
        />
        <span
          className="hidden shrink-0 border border-dark-gray px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-mid-gray sm:block"
          aria-hidden
        >
          {items.length} guides
        </span>
      </div>

      {list}
    </div>
  );
}
