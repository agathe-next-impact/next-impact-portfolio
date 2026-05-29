import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Vous êtes… | Next Impact",
  description: "Solutions WordPress adaptées à votre secteur : artisans, PME industrielles, acteurs du tourisme.",
  // Page hors détection SEO : non indexée et exclue des surfaces de découverte
  robots: { index: false, follow: false },
}

const PERSONAS = [
  {
    href: "/vous-etes/artisan",
    label: "Artisan & TPE locale",
    desc: "Site vitrine pour valoriser votre savoir-faire et attirer des clients locaux",
    no: "01",
  },
  {
    href: "/vous-etes/pme-industrielle",
    label: "PME industrielle",
    desc: "Site corporate pour présenter vos activités, références et équipes",
    no: "02",
  },
  {
    href: "/vous-etes/acteur-tourisme",
    label: "Acteur du tourisme",
    desc: "Site vitrine pour mettre en avant vos offres et attirer des visiteurs",
    no: "03",
  },
]

export default function VousEtesPage() {
  return (
    <section className="s">
      <div className="container">
        <div className="sec-head">
          <div className="sec-no">№ 01</div>
          <h1
            className="ni-serif"
            style={{ fontSize: "clamp(36px, 5vw, 72px)", lineHeight: 1.05, margin: 0 }}
          >
            Vous êtes{" "}
            <em style={{ color: "var(--ink)" }}>…</em>
          </h1>
          <div className="sec-meta">Secteurs</div>
        </div>

        <p style={{ fontSize: 15, color: "var(--ink-2)", marginBottom: 48, maxWidth: 520 }}>
          Choisissez votre profil pour découvrir les solutions adaptées à votre secteur.
        </p>

        <div style={{ borderTop: "1px solid var(--rule)" }}>
          {PERSONAS.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              style={{ textDecoration: "none", display: "block" }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "56px 1fr auto",
                  gap: 24,
                  padding: "24px 0",
                  borderBottom: "1px solid var(--rule)",
                  alignItems: "center",
                  transition: "background 0.15s",
                }}
                className="hover-row"
              >
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 11,
                    color: "var(--accent-color)",
                    letterSpacing: "0.08em",
                  }}
                >
                  {p.no}
                </span>
                <div>
                  <div className="ni-serif" style={{ fontSize: 20, marginBottom: 4 }}>
                    {p.label}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--ink-2)" }}>{p.desc}</div>
                </div>
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 11,
                    color: "var(--accent-color)",
                    letterSpacing: "0.08em",
                  }}
                >
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
