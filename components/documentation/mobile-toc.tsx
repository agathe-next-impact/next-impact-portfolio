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
        className="lg:hidden"
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "4rem",
          zIndex: 40,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(0.5rem)",
          pointerEvents: visible ? "auto" : "none",
          transition: "opacity 0.2s, transform 0.2s",
        }}
      >
        <button
          onClick={() => setOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            border: "1px solid var(--rule-strong)",
            background: "var(--paper)",
            padding: "0.5rem 0.875rem",
            fontSize: "0.8125rem",
            fontFamily: "var(--font-mono)",
            color: "var(--ink-2)",
            cursor: "pointer",
          }}
        >
          <List style={{ width: "0.875rem", height: "0.875rem" }} />
          Sommaire
        </button>
      </div>

      {/* Drawer overlay */}
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(14,14,12,0.4)",
          }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer panel */}
      <div
        className="lg:hidden"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 51,
          background: "var(--paper)",
          borderTop: "2px solid var(--ink)",
          padding: "1.5rem 1.25rem 2rem",
          maxHeight: "70vh",
          overflowY: "auto",
          transform: open ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.25s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <p className="annot" style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Sommaire
          </p>
          <button
            onClick={() => setOpen(false)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-color)", padding: 0 }}
          >
            <X style={{ width: "1rem", height: "1rem" }} />
          </button>
        </div>
        <nav>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {tableOfContents.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  style={{
                    display: "block",
                    padding: "0.5rem 0",
                    paddingLeft: item.level === 3 ? "1rem" : "0.5rem",
                    fontSize: item.level === 3 ? "0.8125rem" : "0.9375rem",
                    color: activeId === item.id ? "var(--accent-color)" : "var(--ink-2)",
                    textDecoration: "none",
                    borderLeft: activeId === item.id
                      ? "2px solid var(--accent-color)"
                      : "2px solid transparent",
                    borderBottom: "1px solid var(--rule)",
                  }}
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
