import { ReactNode } from "react";

interface TldrCalloutProps {
  children: ReactNode;
  label?: string;
}

/**
 * TldrCallout — encadré "En bref / TL;DR" placé en tête d'article.
 * Sert de paragraphe-réponse autonome (citable par les assistants IA).
 * Cohérent avec le design system "Blueprint" du site (tokens CSS var()).
 */
export function TldrCallout({ children, label = "En bref" }: TldrCalloutProps) {
  return (
    <aside
      role="note"
      aria-label={label}
      style={{
        margin: "1.5rem 0 2rem",
        padding: "1.25rem 1.25rem",
        background: "var(--paper-2)",
        border: "1px solid var(--rule)",
        borderLeft: "3px solid var(--accent-color)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.625rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--accent-color)",
          marginBottom: "0.5rem",
          fontWeight: 500,
        }}
      >
        {label}
      </p>
      <div
        style={{
          fontSize: "0.9375rem",
          color: "var(--ink)",
          lineHeight: 1.65,
        }}
      >
        {children}
      </div>
    </aside>
  );
}
