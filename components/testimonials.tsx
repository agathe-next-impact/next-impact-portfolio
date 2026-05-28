const TESTIMONIALS = [
  {
    quote: "Agathe se distingue par sa capacité à comprendre rapidement les enjeux business et à les traduire en solutions techniques efficaces. Pour notre projet, elle a su créer une landing page sur mesure qui reflète parfaitement notre identité de marque, tout en intégrant un système multilingue fluide et intuitif.",
    author: "Christophe Riboulet",
    position: "PDG",
    company: "Proditec",
    no: "01",
  },
  {
    quote: "Nous travaillons exclusivement avec Agathe désormais pour gérer notre site internet. Elle est très pro, de bons conseils et rapide. Ses offres sont claires et adaptées à nos besoins. Nous le recommandons très volontiers !",
    author: "Laura Schorestene",
    position: "Fondatrice",
    company: "Senza Nature",
    no: "02",
  },
  {
    quote: "Quand réactivité, savoir-faire sont réunis cela assure un résultat. Si en plus de cela l'échange même à distance est facile et efficace, cela rend la mission agréable… Merci Agathe.",
    author: "Philippe Barrat",
    position: "CTO",
    company: "Neway Partners",
    no: "03",
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials">
      <div style={{ borderTop: "1px solid var(--rule)" }}>
        {TESTIMONIALS.map((t) => (
          <div
            key={t.no}
            style={{
              display: "grid",
              gridTemplateColumns: "56px 1fr 240px",
              gap: 32,
              padding: "40px 0",
              borderBottom: "1px solid var(--rule)",
              alignItems: "start",
            }}
          >
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 11,
                color: "var(--accent-color)",
                letterSpacing: "0.08em",
                paddingTop: 6,
              }}
            >
              {t.no}
            </span>
            <blockquote
              className="quote"
              style={{ margin: 0, fontSize: "clamp(15px, 2vw, 20px)" }}
            >
              « {t.quote} »
            </blockquote>
            <div style={{ paddingTop: 6 }}>
              <div className="ni-serif" style={{ fontSize: 16, marginBottom: 4 }}>
                {t.author}
              </div>
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--muted-color)",
                  marginBottom: 2,
                }}
              >
                {t.position}
              </div>
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--accent-color)",
                }}
              >
                {t.company}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
