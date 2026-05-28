"use client";

import { Link } from "@/i18n/navigation";
import { Zap, ArrowRight } from "lucide-react";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

export function AuditContextualBanner() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";

  return (
    <section style={{
      marginTop: "2.5rem",
      border: "1px solid var(--rule)",
      borderLeft: "3px solid var(--accent-color)",
      background: "var(--paper-2)",
      padding: "1.5rem 2rem",
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: "1.5rem",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "2.5rem",
        height: "2.5rem",
        border: "1px solid var(--rule)",
        background: "var(--paper)",
        flexShrink: 0,
      }}>
        <Zap style={{ width: "1.125rem", height: "1.125rem", color: "var(--accent-color)" }} />
      </div>

      <div style={{ flex: 1, minWidth: "12rem" }}>
        <h3 style={{
          fontFamily: "var(--font-serif)",
          fontSize: "1.125rem",
          fontWeight: 400,
          color: "var(--ink)",
          marginBottom: "0.25rem",
        }}>
          {isEn ? "Is your current site performing?" : "Votre site actuel est-il performant ?"}
        </h3>
        <p style={{ fontSize: "0.875rem", color: "var(--muted-color)" }}>
          {isEn
            ? "Compare your site's performance with a Headless site."
            : "Comparez les performances de votre site avec celles d'un site Headless."}
        </p>
      </div>

      <Link
        href="/audit-site-ia"
        className="btn primary"
        style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", flexShrink: 0 }}
      >
        {isEn ? "Start my free audit" : "Lancer mon audit gratuit"}
        <ArrowRight style={{ width: "0.875rem", height: "0.875rem" }} />
      </Link>
    </section>
  );
}
