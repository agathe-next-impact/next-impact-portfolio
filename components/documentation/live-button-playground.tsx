"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

type Variant = "primary" | "secondary" | "outline" | "ghost";

export function LiveButtonPlayground() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const [active, setActive] = useState<Variant>("primary");

  const variants: { label: string; value: Variant }[] = [
    { label: isEn ? "Primary" : "Primaire", value: "primary" },
    { label: isEn ? "Secondary" : "Secondaire", value: "secondary" },
    { label: isEn ? "Outline" : "Contour", value: "outline" },
    { label: isEn ? "Ghost" : "Fantôme", value: "ghost" },
  ];

  return (
    <div style={{ borderTop: "1px solid var(--rule)", paddingTop: "2rem" }}>
      <p style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.6875rem",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "var(--muted-color)",
        marginBottom: "1.25rem",
      }}>
        {isEn ? "Button playground" : "Playground boutons"}
      </p>

      {/* Preview */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--paper-2)",
        border: "1px solid var(--rule)",
        minHeight: "8rem",
        marginBottom: "1rem",
      }}>
        {active === "primary" && (
          <button className="btn primary">{isEn ? "Click me" : "Cliquez-moi"}</button>
        )}
        {active === "secondary" && (
          <button className="btn" style={{ background: "var(--paper-2)", border: "1px solid var(--rule-strong)" }}>
            {isEn ? "Click me" : "Cliquez-moi"}
          </button>
        )}
        {active === "outline" && (
          <button className="btn" style={{ background: "transparent", border: "1px solid var(--rule)" }}>
            {isEn ? "Click me" : "Cliquez-moi"}
          </button>
        )}
        {active === "ghost" && (
          <button className="btn" style={{ background: "transparent", border: "none", color: "var(--muted-color)" }}>
            {isEn ? "Click me" : "Cliquez-moi"}
          </button>
        )}
      </div>

      {/* Variant selector */}
      <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap" }}>
        {variants.map(v => (
          <button
            key={v.value}
            onClick={() => setActive(v.value)}
            style={{
              padding: "0.375rem 0.875rem",
              fontSize: "0.6875rem",
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              border: "1px solid var(--rule)",
              background: active === v.value ? "var(--ink)" : "var(--paper)",
              color: active === v.value ? "white" : "var(--muted-color)",
              cursor: "pointer",
              transition: "background 0.15s, color 0.15s",
            }}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}
