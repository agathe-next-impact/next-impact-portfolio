import Image from "next/image"

interface SolutionLandingProps {
  title?: string
  subtitle?: string
  imageUrl?: string
  features?: string[]
}

export default function SolutionLanding({ title, subtitle, imageUrl, features }: SolutionLandingProps) {
  return (
    <section className="s">
      <div className="container">
        <div className="sec-head">
          <div className="sec-no">№ 02</div>
          <h2
            className="ni-serif"
            style={{ fontSize: "clamp(28px, 3.5vw, 52px)", lineHeight: 1.1, margin: 0 }}
          >
            {title}
          </h2>
          <div className="sec-meta">Solution</div>
        </div>
        {subtitle && (
          <p style={{ fontSize: 14, color: "var(--ink-2)", marginBottom: 40 }}>{subtitle}</p>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "1px solid var(--rule)" }}>
          <div style={{ overflow: "hidden" }}>
            <Image
              src={imageUrl || "/img/placeholder.jpg"}
              alt={title || "Solution"}
              width={600}
              height={400}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }}
            />
          </div>
          <div style={{ borderLeft: "1px solid var(--rule)", padding: "32px 28px", display: "flex", alignItems: "center" }}>
            {features && features.length > 0 && (
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
                {features.map((f, i) => (
                  <li key={i} style={{ fontSize: 14, color: "var(--ink-2)", display: "flex", gap: 10 }}>
                    <span style={{ color: "var(--ink-2)", flexShrink: 0 }}>→</span>
                    {f}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
