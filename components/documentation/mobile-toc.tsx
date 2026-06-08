"use client";

import { useState, useEffect } from "react";
import { List, X } from "lucide-react";

interface MobileTocProps {
  tableOfContents: { id: string; text: string; level: number }[];
}

export function MobileToc({ tableOfContents }: MobileTocProps) {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const headings = tableOfContents
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [tableOfContents]);

  if (tableOfContents.length === 0) return null;

  return (
    <>
      {/* Trigger button */}
      <div
        className={`fixed bottom-6 right-16 z-40 transition-[opacity,transform] duration-200 lg:hidden ${
          visible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 border border-dark-gray bg-obsidian px-3.5 py-2 font-mono text-[0.8125rem] text-mid-gray transition-colors hover:border-accent-secondary hover:text-accent-secondary"
        >
          <List className="h-3.5 w-3.5" />
          Sommaire
        </button>
      </div>

      {/* Drawer overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-obsidian/70 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer panel */}
      <div
        className={`fixed inset-x-0 bottom-0 z-[51] max-h-[70vh] overflow-y-auto border-t-2 border-dark-gray bg-obsidian px-5 pb-8 pt-6 transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-mid-gray">
            Sommaire
          </p>
          <button
            onClick={() => setOpen(false)}
            aria-label="Fermer le sommaire"
            className="p-0 text-mid-gray transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <nav>
          <ul className="m-0 list-none p-0">
            {tableOfContents.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  className={`block border-b border-dark-gray no-underline transition-colors ${
                    item.level === 3
                      ? "py-2 pl-4 text-[0.8125rem]"
                      : "py-2 pl-2 text-[0.9375rem]"
                  } ${
                    activeId === item.id
                      ? "border-l-2 border-l-accent-secondary text-accent-secondary"
                      : "border-l-2 border-l-transparent text-mid-gray"
                  }`}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
