"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Retour en haut"
      style={{
        position: "fixed",
        zIndex: 40,
        bottom: "1.5rem",
        right: "1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "2.25rem",
        height: "2.25rem",
        border: "1px solid var(--rule-strong)",
        background: "var(--paper)",
        color: "var(--muted-color)",
        cursor: "pointer",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(0.5rem)",
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.2s, transform 0.2s, color 0.15s, background 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "var(--ink)";
        e.currentTarget.style.background = "var(--paper-2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "var(--muted-color)";
        e.currentTarget.style.background = "var(--paper)";
      }}
    >
      <ArrowUp style={{ width: "0.875rem", height: "0.875rem" }} />
    </button>
  );
}
