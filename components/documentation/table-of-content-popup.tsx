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
    <nav className="w-full border-t border-dark-gray pt-4">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
        Sommaire
      </p>
      <ul className="m-0 list-none p-0">
        {tableOfContents.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={cn(
                  "block border-l-2 py-1.5 leading-tight no-underline transition-colors",
                  item.level === 3
                    ? "pl-4 text-xs"
                    : "pl-2 text-[0.8125rem]",
                  isActive
                    ? "border-accent-secondary text-accent-secondary"
                    : "border-transparent text-mid-gray hover:text-foreground",
                )}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
