interface AuditSendFormProps {
  markdownFull: string;
  url: string;
}

export default function AuditSendForm({ markdownFull, url }: AuditSendFormProps) {
  return (
    <div style={{
      maxWidth: 900, margin: "32px auto 0",
      border: "1px solid var(--rule)", background: "var(--paper)", padding: "32px",
      display: "flex", flexDirection: "column", gap: 16,
    }}>
      <span style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink)", borderBottom: "1px solid var(--rule)", paddingBottom: 8 }}>
        {url}
      </span>
      <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: markdownFull }} />
    </div>
  );
}
