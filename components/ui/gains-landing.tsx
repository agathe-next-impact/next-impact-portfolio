import LandingCard from "@/components/ui/landing-cards"

interface GainsLandingProps {
  title?: string
  subtitle?: string
  landingCards?: { imageUrl: string; title: string; text: string }[]
}

export default function GainsLanding({
  title = "Les gains de la solution",
  subtitle = "Découvrez comment notre solution peut transformer votre activité",
  landingCards = [],
}: GainsLandingProps) {
  return (
    <section className="s">
      <div className="container">
        <div className="sec-head">
          <div className="sec-no">№ 03</div>
          <h2
            className="ni-serif"
            style={{ fontSize: "clamp(28px, 3.5vw, 52px)", lineHeight: 1.1, margin: 0 }}
          >
            {title}
          </h2>
          <div className="sec-meta">Bénéfices</div>
        </div>
        {subtitle && (
          <p style={{ fontSize: 14, color: "var(--ink-2)", marginBottom: 40 }}>{subtitle}</p>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            columnGap: 24,
          }}
        >
          {landingCards.map((card, i) => (
            <LandingCard key={i} imageUrl={card.imageUrl} title={card.title} text={card.text} />
          ))}
        </div>
      </div>
    </section>
  )
}
