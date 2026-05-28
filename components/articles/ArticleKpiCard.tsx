interface ArticleKpiCardProps {
  value: string
  label: string
}

export function ArticleKpiCard({ value, label }: ArticleKpiCardProps) {
  return (
    <div style={{
      borderTop: "2px solid var(--rule-strong)",
      paddingTop: "0.75rem",
      paddingRight: "2rem",
    }}>
      <div style={{
        fontFamily: "var(--font-serif)",
        fontSize: "1.875rem",
        fontWeight: 400,
        color: "var(--accent-color)",
        lineHeight: 1,
        marginBottom: "0.25rem",
      }}>
        {value}
      </div>
      <div className="annot">{label}</div>
    </div>
  )
}
