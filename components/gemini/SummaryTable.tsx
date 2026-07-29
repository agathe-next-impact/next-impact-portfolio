interface SummaryTableProps {
  rows: { critere: string; valeur: string }[];
}

export default function SummaryTable({ rows }: SummaryTableProps) {
  if (!rows || rows.length === 0) return null;
  return (
    <div style={{ margin: "32px 0", overflowX: "auto", border: "1px solid var(--rule)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--paper)" }}>
        <thead style={{ background: "var(--paper-2)" }}>
          <tr>
            <th style={{ padding: "10px 16px", fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink)", textAlign: "left", borderBottom: "1px solid var(--rule)" }}>Critère</th>
            <th style={{ padding: "10px 16px", fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink)", textAlign: "left", borderBottom: "1px solid var(--rule)" }}>Valeur</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} style={{ background: idx % 2 === 0 ? "var(--paper)" : "var(--paper-2)" }}>
              <td style={{ padding: "10px 16px", fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: "var(--ink)", borderBottom: "1px solid var(--rule)" }}>{row.critere}</td>
              <td style={{ padding: "10px 16px", fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-2)", borderBottom: "1px solid var(--rule)" }}>{row.valeur}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
