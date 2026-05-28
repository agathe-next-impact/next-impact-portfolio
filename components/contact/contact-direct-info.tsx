"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

export function ContactDirectInfo() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  return (
    <div
      style={{
        border: "1px solid var(--rule)",
        padding: "32px",
        background: "var(--paper-2)",
      }}
    >
      <div
        style={{
          fontFamily: "var(--mono)",
          fontSize: 9,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--muted-color)",
          marginBottom: 20,
        }}
      >
        {isEn ? "Prefer a direct conversation?" : "Vous préférez un échange direct ?"}
      </div>

      <p style={{ fontWeight: 600, fontSize: 15, color: "var(--ink)", marginBottom: 4 }}>
        Agathe Karinthi-Martin{" "}
        <span style={{ fontWeight: 400, color: "var(--ink-2)" }}>— Next Impact Digital</span>
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
        <a
          href="mailto:agathe@next-impact.digital"
          style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--ink-2)", textDecoration: "none" }}
        >
          <Mail size={14} style={{ color: "var(--accent-color)", flexShrink: 0 }} />
          agathe@next-impact.digital
        </a>
        <a
          href="tel:0673981638"
          style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--ink-2)", textDecoration: "none" }}
        >
          <Phone size={14} style={{ color: "var(--accent-color)", flexShrink: 0 }} />
          06 73 98 16 38
        </a>
        <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--muted-color)" }}>
          <MapPin size={14} style={{ flexShrink: 0 }} />
          {isEn ? "4 rue du centre, 15400 Trizac, France" : "4 rue du centre, 15400 Trizac"}
        </span>
      </div>
    </div>
  );
}
