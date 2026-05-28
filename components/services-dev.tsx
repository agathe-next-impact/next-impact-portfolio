import Link from "next/link"

const WP_CATEGORIES = [
  { category: "Sites Vitrines", description: "Présentation d'entreprise, services, équipes", examples: ["Groupes industriels", "PME et startups", "Filiales internationales"] },
  { category: "Sites Institutionnels", description: "Collectivités, associations, fondations", examples: ["Mairies", "ONG", "Établissements publics"] },
  { category: "Sites de Services", description: "Cabinets, consultants, professions libérales", examples: ["Cabinets d'avocats", "Consultants", "Centres médicaux"] },
  { category: "Portails d'Information", description: "Actualités, documentation, ressources", examples: ["Centres de formation", "Médias locaux", "Portails RH"] },
]

const HEADLESS_CATEGORIES = [
  { category: "Intranet Évolutif", description: "Portail collaboratif haute performance", examples: ["Interface moderne", "Données unifiées", "Connectivité API"] },
  { category: "Portails Clients B2B", description: "Dashboards, espaces de commande, suivi projets", examples: ["Tableaux de bord", "Intégrations ERP", "Espaces privés"] },
  { category: "Applications SaaS", description: "Interfaces de gestion, analytics temps réel", examples: ["Plateformes métier", "Analytics avancées", "Multi-tenant"] },
  { category: "Portails d'Information", description: "Actualités, documentation, ressources", examples: ["Centres de formation", "Médias locaux", "Portails RH"] },
]

export const ServicesDev = () => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        borderTop: "1px solid var(--rule)",
      }}
    >
      {/* Column 1 — WordPress */}
      <div style={{ padding: "32px 24px 40px", borderRight: "1px solid var(--rule)" }}>
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--muted-color)",
              marginBottom: 8,
            }}
          >
            WordPress
          </div>
          <h3 className="ni-serif" style={{ fontSize: 22, margin: 0 }}>
            Sites <em style={{ color: "var(--accent-color)" }}>corporate</em>
          </h3>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
          {WP_CATEGORIES.map((p) => (
            <div
              key={p.category}
              style={{ border: "1px solid var(--rule)", padding: "14px 16px" }}
            >
              <div style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
                {p.category}
              </div>
              <div style={{ fontSize: 12, color: "var(--ink-2)", marginBottom: 8 }}>{p.description}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {p.examples.map((ex) => (
                  <span
                    key={ex}
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 9,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      border: "1px solid var(--rule)",
                      padding: "2px 6px",
                      color: "var(--muted-color)",
                    }}
                  >
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Link href="/services" className="btn">
          Voir tous les détails →
        </Link>
      </div>

      {/* Column 2 — Headless */}
      <div style={{ padding: "32px 24px 40px" }}>
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--muted-color)",
              marginBottom: 8,
            }}
          >
            WordPress Headless Next.js
          </div>
          <h3 className="ni-serif" style={{ fontSize: 22, margin: 0 }}>
            Applications <em style={{ color: "var(--accent-color)" }}>web</em>
          </h3>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
          {HEADLESS_CATEGORIES.map((p) => (
            <div
              key={p.category}
              style={{ border: "1px solid var(--rule)", padding: "14px 16px" }}
            >
              <div style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
                {p.category}
              </div>
              <div style={{ fontSize: 12, color: "var(--ink-2)", marginBottom: 8 }}>{p.description}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {p.examples.map((ex) => (
                  <span
                    key={ex}
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 9,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      border: "1px solid var(--rule)",
                      padding: "2px 6px",
                      color: "var(--muted-color)",
                    }}
                  >
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Link href="/services" className="btn">
          Voir tous les détails →
        </Link>
      </div>
    </div>
  )
}

export default ServicesDev
