"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

export function ServicesComparisonTable() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const [open, setOpen] = useState(false);
  const labels = isEn
    ? { title: "Tier comparison", feature: "Feature", essential: "Classic", growth: "Headless", custom: "Web app" }
    : { title: "Comparatif des forfaits", feature: "Fonctionnalité", essential: "Classique", growth: "Headless", custom: "Web app" };

  const comparison = isEn
    ? [
        { feature: "Design", pack1: "Eco-designed", pack2: "Custom", pack3: "Fully bespoke" },
        { feature: "Pages included", pack1: "5 key pages", pack2: "Custom", pack3: "Unlimited" },
        { feature: "Speed < 1s", pack1: true, pack2: true, pack3: true },
        { feature: "Maximum security", pack1: true, pack2: true, pack3: true },
        { feature: "Advanced SEO strategy", pack1: false, pack2: true, pack3: true },
        { feature: "Data migration", pack1: false, pack2: true, pack3: true },
        { feature: "Multisite architecture", pack1: false, pack2: false, pack3: true },
        { feature: "Specific API integrations", pack1: false, pack2: false, pack3: true },
        { feature: "Support", pack1: "Training", pack2: "Strategic", pack3: "Priority" },
        { feature: "Maintenance", pack1: false, pack2: "3 months", pack3: "12 months" },
        { feature: "OETH attestation (TIH)", pack1: true, pack2: true, pack3: "Optimized for OETH deduction" },
      ]
    : [
        { feature: "Design", pack1: "Éco-conçu", pack2: "Personnalisé", pack3: "Sur-mesure total" },
        { feature: "Pages incluses", pack1: "5 pages clés", pack2: "Sur-mesure", pack3: "Illimité" },
        { feature: "Vitesse < 1s", pack1: true, pack2: true, pack3: true },
        { feature: "Sécurité maximale", pack1: true, pack2: true, pack3: true },
        { feature: "Stratégie SEO avancée", pack1: false, pack2: true, pack3: true },
        { feature: "Migration de données", pack1: false, pack2: true, pack3: true },
        { feature: "Architecture multisite", pack1: false, pack2: false, pack3: true },
        { feature: "Intégrations API spécifiques", pack1: false, pack2: false, pack3: true },
        { feature: "Accompagnement", pack1: "Formation", pack2: "Stratégique", pack3: "Prioritaire" },
        { feature: "Support", pack1: false, pack2: "3 mois", pack3: "12 mois" },
        { feature: "Attestation OETH (TIH)", pack1: true, pack2: true, pack3: "Optimisé pour la déduction OETH" },
      ];

  const cellStyle = (val: boolean | string): React.CSSProperties => ({
    padding: "14px 20px",
    textAlign: "center",
    fontFamily: typeof val === "string" && val !== "" ? "var(--sans)" : "var(--mono)",
    fontSize: 13,
    color: val === true ? "var(--ink)" : val === false ? "var(--rule-strong)" : "var(--ink-2)",
    borderRight: "1px solid var(--rule)",
  });

  return (
    <section className="s" style={{ borderTop: "1px solid var(--rule)" }}>
      <div className="container">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            background: "none",
            border: "none",
            borderBottom: open ? "1px solid var(--rule)" : "none",
            padding: "32px 0",
            cursor: "pointer",
            textAlign: "left",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted-color)", flexShrink: 0 }}>
              № —
            </span>
            <span className="ni-serif" style={{ fontSize: "clamp(20px, 2.2vw, 32px)", lineHeight: 1.1, color: "var(--ink)" }}>
              {labels.title}
            </span>
          </div>
          <ChevronDown
            size={18}
            strokeWidth={1.5}
            style={{
              color: "var(--muted-color)",
              flexShrink: 0,
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.22s ease",
            }}
          />
        </button>

        <div
          style={{
            maxHeight: open ? 1200 : 0,
            overflow: "hidden",
            transition: "max-height 0.35s ease",
          }}
        >
        <div style={{ overflowX: "auto", paddingTop: 1 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", borderTop: "1px solid var(--rule)" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--rule-strong)" }}>
                <th style={{ padding: "14px 20px", textAlign: "left", fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted-color)", borderRight: "1px solid var(--rule)" }}>
                  {labels.feature}
                </th>
                {[labels.essential, labels.growth, labels.custom].map((col, i, arr) => (
                  <th key={col} style={{ padding: "14px 20px", textAlign: "center", fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: i === 1 ? "var(--ink)" : "var(--ink-2)", borderRight: i < arr.length - 1 ? "1px solid var(--rule)" : "none" }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid var(--rule)", background: idx % 2 === 1 ? "var(--paper-2)" : "transparent" }}>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--ink)", borderRight: "1px solid var(--rule)" }}>
                    {row.feature}
                  </td>
                  <td style={cellStyle(row.pack1)}>
                    {row.pack1 === true ? "✓" : row.pack1 === false ? "—" : row.pack1}
                  </td>
                  <td style={{ ...cellStyle(row.pack2), fontWeight: typeof row.pack2 === "string" ? 500 : undefined }}>
                    {row.pack2 === true ? "✓" : row.pack2 === false ? "—" : row.pack2}
                  </td>
                  <td style={{ ...cellStyle(row.pack3), borderRight: "none" }}>
                    {row.pack3 === true ? "✓" : row.pack3 === false ? "—" : row.pack3}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </section>
  );
}
