import React from "react";

interface ComparisonTableProps {
  headers: string[];
  rows: string[][];
}

export default function ComparisonTable({ headers, rows }: ComparisonTableProps) {
  return (
    <div style={{ overflowX: "auto", margin: "32px 0" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid var(--rule)", background: "var(--paper)" }}>
        <thead>
          <tr style={{ background: "var(--paper-2)" }}>
            {headers.map((h, i) => (
              <th key={i} style={{
                padding: "12px 16px",
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--ink)",
                fontWeight: 600,
                textAlign: "left",
                borderBottom: "1px solid var(--rule)",
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rIdx) => (
            <tr key={rIdx} style={{ background: rIdx % 2 === 0 ? "var(--paper)" : "var(--paper-2)" }}>
              {row.map((cell, cIdx) => {
                const cleanCell = cell.replace(/\*+/g, "");
                return (
                  <td key={cIdx} style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid var(--rule)",
                    fontFamily: "var(--sans)",
                    fontSize: 13,
                    color: "var(--ink-2)",
                    verticalAlign: "top",
                  }}>
                    {cleanCell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
