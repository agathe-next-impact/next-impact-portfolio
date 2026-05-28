import Link from "next/link"

type Offer = {
  badge: string
  title: string
  description: string
  price: string
  features: string[]
  button: {
    label: string
    href: string
    external?: boolean
  }
  highlighted?: boolean
}

type TarifsLandingProps = {
  sectionTitle?: string
  sectionSubtitle?: string
  offers: Offer[]
}

export function TarifsLanding({
  sectionTitle = "Tarifs",
  sectionSubtitle,
  offers,
}: TarifsLandingProps) {
  return (
    <section id="tarifs" className="s">
      <div className="container">
        <div className="sec-head">
          <div className="sec-no">№ 04</div>
          <h2
            className="ni-serif"
            style={{ fontSize: "clamp(28px, 3.5vw, 52px)", lineHeight: 1.1, margin: 0 }}
          >
            {sectionTitle}
          </h2>
          <div className="sec-meta">Tarifs · Fig. 04</div>
        </div>
        {sectionSubtitle && (
          <p style={{ fontSize: 14, color: "var(--ink-2)", marginBottom: 40 }}>{sectionSubtitle}</p>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${offers.length}, 1fr)`,
            borderTop: "1px solid var(--rule)",
          }}
        >
          {offers.map((offer, idx) => (
            <div
              key={offer.title}
              style={{
                padding: "32px 28px",
                borderRight: idx < offers.length - 1 ? "1px solid var(--rule)" : "none",
                background: offer.highlighted ? "var(--paper)" : "transparent",
                borderTop: offer.highlighted ? "3px solid var(--accent-color)" : "3px solid transparent",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 9,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--accent-color)",
                  marginBottom: 16,
                }}
              >
                {offer.badge}
              </div>
              <div
                className="ni-serif"
                style={{
                  fontSize: 22,
                  color: "var(--ink)",
                  marginBottom: 8,
                }}
              >
                {offer.title}
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--ink-2)",
                  lineHeight: 1.5,
                  marginBottom: 20,
                }}
              >
                {offer.description}
              </p>
              <div
                style={{
                  fontFamily: "var(--serif)",
                  fontSize: 32,
                  color: "var(--ink)",
                  marginBottom: 24,
                }}
              >
                {offer.price}
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                {offer.features.map((feature) => (
                  <li
                    key={feature}
                    style={{
                      fontSize: 13,
                      color: "var(--ink-2)",
                      display: "flex",
                      gap: 8,
                    }}
                  >
                    <span style={{ color: "var(--accent-color)", flexShrink: 0 }}>→</span>
                    {feature}
                  </li>
                ))}
              </ul>
              {offer.button.external ? (
                <a
                  href={offer.button.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                >
                  {offer.button.label}
                </a>
              ) : (
                <Link
                  href={offer.button.href}
                  className={offer.highlighted ? "btn primary" : "btn"}
                >
                  {offer.button.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
