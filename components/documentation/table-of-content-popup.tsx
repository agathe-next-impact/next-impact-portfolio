"use client";

import { cn } from "@/lib/utils";
import { useActiveHeading } from "./use-active-heading";

interface TableOfContentsPopupProps {
  tableOfContents: { id: string; text: string; level: number }[];
}

export default function TableOfContentsPopup({
  tableOfContents,
}: TableOfContentsPopupProps) {
  const activeId = useActiveHeading(tableOfContents);

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
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  // duration-150 = DUR.micro (lib/motion-tokens.ts)
                  "block border-l-2 py-1.5 leading-tight no-underline transition-colors duration-150",
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
