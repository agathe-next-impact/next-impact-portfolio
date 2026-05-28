import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function GeminiSearchHomepage() {
  const [url, setUrl] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      router.push(`/audit-site-ia?url=${encodeURIComponent(url)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 12 }}>
      <label htmlFor="gemini_url_home" style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>
        URL WordPress à analyser
      </label>
      <input
        id="gemini_url_home"
        style={{
          border: "1px solid var(--rule)",
          background: "var(--paper)",
          color: "var(--ink)",
          fontFamily: "var(--sans)",
          fontSize: 15,
          padding: "12px 16px",
          width: "100%",
          outline: "none",
        }}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://test.com"
        required
        type="url"
        pattern="https?://.+"
      />
      <div>
        <button
          type="submit"
          disabled={!url.trim()}
          style={{
            border: "1px solid var(--ink)", background: "var(--ink)", color: "var(--paper)",
            fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase",
            padding: "14px 28px", cursor: url.trim() ? "pointer" : "not-allowed",
            opacity: url.trim() ? 1 : 0.5,
            display: "inline-flex", alignItems: "center", gap: 8,
          }}
        >
          Lancer l&apos;analyse
          <ArrowRight size={14} />
        </button>
      </div>
    </form>
  );
}
