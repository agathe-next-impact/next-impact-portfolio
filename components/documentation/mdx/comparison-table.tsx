"use client";

import { Check, X, Minus } from "lucide-react";

interface ComparisonTableProps {
  headers: [string, string];
  rows: { label: string; left: string | boolean; right: string | boolean }[];
  highlight?: "left" | "right";
}

function CellValue({ value }: { value: string | boolean }) {
  if (value === true) return <Check style={{ width: "1rem", height: "1rem", color: "#2d7a2d", margin: "0 auto", display: "block" }} />;
  if (value === false) return <X style={{ width: "1rem", height: "1rem", color: "var(--accent-color)", margin: "0 auto", display: "block" }} />;
  if (value === "-") return <Minus style={{ width: "1rem", height: "1rem", color: "var(--muted-color)", margin: "0 auto", display: "block" }} />;
  return <span style={{ fontSize: "0.875rem", color: "var(--ink-2)" }}>{value}</span>;
}

export function ComparisonTable({ headers, rows, highlight }: ComparisonTableProps) {
  if (!headers || !rows || !Array.isArray(rows)) return null;

  return (
    <div style={{ margin: "2rem 0", overflowX: "auto", border: "1px solid var(--rule)" }}>
      <table style={{ width: "100%", fontSize: "0.875rem", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{
              textAlign: "left",
              padding: "0.75rem 1rem",
              background: "var(--paper-2)",
              color: "var(--ink)",
              borderBottom: "1px solid var(--rule)",
              width: "33%",
              fontWeight: 500,
              fontFamily: "var(--font-mono)",
              fontSize: "0.6875rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }} />
            {[0, 1].map((idx) => (
              <th key={idx} style={{
                textAlign: "center",
                padding: "0.75rem 1rem",
                background: highlight === (idx === 0 ? "left" : "right") ? "var(--ink)" : "var(--paper-2)",
                color: highlight === (idx === 0 ? "left" : "right") ? "white" : "var(--ink)",
                borderBottom: "1px solid var(--rule)",
                borderLeft: "1px solid var(--rule)",
                fontWeight: 500,
                fontFamily: "var(--font-mono)",
                fontSize: "0.6875rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}>
                {headers[idx]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid var(--rule)" }}>
              <td style={{
                padding: "0.625rem 1rem",
                color: "var(--ink-2)",
                fontWeight: 500,
                fontSize: "0.875rem",
              }}>
                {row.label}
              </td>
              <td style={{
                textAlign: "center",
                padding: "0.625rem 1rem",
                borderLeft: "1px solid var(--rule)",
                background: highlight === "left" ? "rgba(14,14,12,0.03)" : "transparent",
              }}>
                <CellValue value={row.left} />
              </td>
              <td style={{
                textAlign: "center",
                padding: "0.625rem 1rem",
                borderLeft: "1px solid var(--rule)",
                background: highlight === "right" ? "rgba(14,14,12,0.03)" : "transparent",
              }}>
                <CellValue value={row.right} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
