"use client";

import React from "react";
import { Gauge, Activity } from "lucide-react";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

interface AuditDashboardProps {
  markdown: string;
}

const extractData = (md: string, isEn: boolean) => {
  const scoreMatch =
    md.match(/Indice de modernité.*?:[^\d]*(\d+)/i) ||
    md.match(/Modernity index.*?:[^\d]*(\d+)/i);
  let score = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;
  if (score > 10) score = 0;

  const verdictMatch =
    md.match(/\*\*Verdict Stratégique.*?:.*?\*?\[?(.*?)(?:\]|\.| \n)/i) ||
    md.match(/\*\*Strategic verdict.*?:.*?\*?\[?(.*?)(?:\]|\.| \n)/i);
  const verdict = verdictMatch
    ? verdictMatch[1].replace(/[*\[\]]/g, "").trim()
    : isEn ? "Undefined" : "Non défini";

  const natureMatch =
    md.match(/1\.\s*\*\*Nature de l'organisation.*?:.*?\*\*(.*?)(?:\n|$)/i) ||
    md.match(/1\.\s*\*\*Nature of the organization.*?:.*?\*\*(.*?)(?:\n|$)/i);
  const natureMatchBF =
    md.match(/1\.\s*\*\*Nature de l'organisation.*?:(.*?)(?:\n|$)/i) ||
    md.match(/1\.\s*\*\*Nature of the organization.*?:(.*?)(?:\n|$)/i);
  let nature = natureMatch ? natureMatch[1].trim() : natureMatchBF ? natureMatchBF[1].trim() : isEn ? "Not detected" : "Non détecté";
  nature = nature.replace(/\*\*/g, "").trim();

  return { score, verdict, nature };
};

export default function AuditDashboard({ markdown }: AuditDashboardProps) {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const { score, verdict } = extractData(markdown, isEn);

  const scoreColor = score >= 8 ? "#2a7a2a" : score >= 5 ? "#b85c09" : "var(--accent-color)";

  return (
    <>
      <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(20px, 3vw, 28px)", color: "var(--ink)", textAlign: "center", marginBottom: 24 }}>
        {isEn
          ? "Headless WordPress migration opportunity audit"
          : "Audit d'opportunité pour une migration WordPress Headless"}
      </h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div style={{
          border: "1px solid var(--rule)",
          borderLeft: `3px solid ${scoreColor}`,
          background: "var(--paper-2)",
          padding: "24px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted-color)" }}>
            <Gauge size={14} />
            {isEn ? "Modernity index" : "Indice de Modernité"}
          </div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 48, fontWeight: 700, color: scoreColor, lineHeight: 1 }}>
            {score}<span style={{ fontSize: 16, opacity: 0.6 }}>/10</span>
          </div>
        </div>

        <div style={{
          border: "1px solid var(--rule)",
          background: "var(--paper)",
          padding: "24px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted-color)" }}>
            <Activity size={14} />
            {isEn ? "Strategic verdict" : "Verdict Stratégique"}
          </div>
          <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: "var(--ink)", textAlign: "center" }}>
            {verdict}
          </div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted-color)" }}>
            {isEn ? "AI recommendation" : "Recommandation IA"}
          </div>
        </div>
      </div>
    </>
  );
}
