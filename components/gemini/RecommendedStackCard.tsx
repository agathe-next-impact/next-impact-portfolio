interface RecommendedStackCardProps {
  title: string;
  stack: string;
  highlights?: string[];
}

export default function RecommendedStackCard({ title, stack, highlights }: RecommendedStackCardProps) {
  return (
    <div style={{
      margin: "32px 0",
      border: "1px solid var(--rule)",
      borderLeft: "3px solid #2a7a2a",
      background: "var(--paper-2)",
      padding: "24px",
    }}>
      <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2a7a2a", marginBottom: 8 }}>
        {title}
      </div>
      <div style={{ fontFamily: "var(--serif)", fontSize: 20, color: "var(--ink)", marginBottom: 12 }}>
        {stack}
      </div>
      {highlights && highlights.length > 0 && (
        <ul style={{ paddingLeft: 16, margin: 0 }}>
          {highlights.map((h, i) => (
            <li key={i} style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-2)", marginBottom: 4 }}>{h}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
