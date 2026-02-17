"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TableOfContentsPopupProps {
  tableOfContents: { id: string; text: string; level: number }[];
}

export default function TableOfContentsPopup({
  tableOfContents,
}: TableOfContentsPopupProps) {
  const [activeId, setActiveId] = useState<string>("");

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
    <nav className="relative w-full h-max bg-darkblue/60 backdrop-blur-sm border border-lightblue/10 p-5 rounded-2xl">
      <p className="text-xs text-white/80 font-googletexte uppercase tracking-wider mb-4">
        Sommaire
      </p>
      <ul className="space-y-0.5">
        {tableOfContents.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                "block rounded-lg px-3 py-1.5 font-googletexte transition-all duration-200",
                item.level === 3 ? "pl-6 text-xs" : "text-sm",
                activeId === item.id
                  ? "text-white bg-regularblue/15 border-l-2 border-orange"
                  : "text-white/80 hover:text-white/80 hover:bg-darkblue/40 border-l-2 border-transparent"
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
