"use client";

import { useEffect, useState } from "react";

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
    <nav style={{
      width: "100%",
      borderTop: "1px solid var(--rule)",
      paddingTop: "1rem",
    }}>
      <p className="annot" style={{
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        marginBottom: "0.75rem",
      }}>
        Sommaire
      </p>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {tableOfContents.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              style={{
                display: "block",
                padding: "0.375rem 0",
                paddingLeft: item.level === 3 ? "1rem" : "0.5rem",
                fontSize: item.level === 3 ? "0.75rem" : "0.8125rem",
                color: activeId === item.id ? "var(--accent-color)" : "var(--muted-color)",
                textDecoration: "none",
                borderLeft: activeId === item.id
                  ? "2px solid var(--accent-color)"
                  : "2px solid transparent",
                transition: "color 0.15s, border-color 0.15s",
                lineHeight: 1.4,
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
