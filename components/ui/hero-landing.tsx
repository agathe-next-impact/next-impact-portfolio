import Link from 'next/link'

interface HeroLandingProps {
  badgeText?: string
  title: string
  subtitle?: string
  buttonText: string
  buttonLink: string
  secondaryButtonText?: string
  secondaryButtonLink?: string
}

export default function HeroLanding({
  badgeText,
  title,
  subtitle,
  buttonText,
  buttonLink,
  secondaryButtonText,
  secondaryButtonLink,
}: HeroLandingProps) {
  return (
    <section className="s" style={{ borderTop: "none", paddingTop: 96, paddingBottom: 96 }}>
      <div className="container">
        <div className="sec-head">
          <div className="sec-no">№ 01</div>
          <h1
            className="ni-serif"
            style={{ fontSize: "clamp(36px, 5vw, 72px)", lineHeight: 1.05, margin: 0 }}
            dangerouslySetInnerHTML={{ __html: title }}
          />
          {badgeText && (
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 9,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                border: "1px solid var(--rule)",
                padding: "2px 8px",
                color: "var(--muted-color)",
                alignSelf: "center",
                whiteSpace: "nowrap",
              }}
            >
              {badgeText}
            </div>
          )}
        </div>
        {subtitle && (
          <p style={{ fontSize: 15, color: "var(--ink-2)", marginBottom: 40, maxWidth: 520 }}>
            {subtitle}
          </p>
        )}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href={buttonLink} className="btn primary">
            {buttonText}
          </Link>
          {secondaryButtonText && secondaryButtonLink && (
            <Link href={secondaryButtonLink} className="btn">
              {secondaryButtonText}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
