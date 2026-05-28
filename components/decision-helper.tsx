const HEADLESS_YES = [
  "Performance critique (< 2 secondes impératif)",
  "Interface utilisateur complexe requise",
  "Multi-canal prévu (web + mobile + autres)",
  "Intégrations système nombreuses",
  "Équipe technique disponible",
  "Budget conséquent acceptable",
  "Évolutivité long terme prioritaire",
]

const HEADLESS_NO = [
  "Site vitrine ou institutionnel classique",
  "Équipe non technique",
  "Budget limité",
  "Mise en ligne rapide nécessaire",
  "Fonctionnalités standard suffisantes",
  "Maintenance simple souhaitée",
]

export async function DecisionHelper() {
  return (
    <div style={{ marginBottom: 48 }}>
      <div className="sec-head">
        <div className="sec-no">№ 06</div>
        <h2
          className="ni-serif"
          style={{ fontSize: "clamp(24px, 3vw, 44px)", lineHeight: 1.1, margin: 0 }}
        >
          Comment déterminer si le{" "}
          <em style={{ color: "var(--accent-color)" }}>headless vous convient</em>
        </h2>
        <div className="sec-meta">Aide à la décision · Fig. 06</div>
      </div>
      <p style={{ fontSize: 14, color: "var(--ink-2)", marginBottom: 40 }}>
        Critères de décision pour une architecture headless.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "1px solid var(--rule)" }}>
        <div style={{ padding: "28px 24px 32px" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent-color)", marginBottom: 16 }}>
            ● Headless recommandé si
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            {HEADLESS_YES.map((item) => (
              <li key={item} style={{ fontSize: 13, color: "var(--ink-2)", display: "flex", gap: 8 }}>
                <span style={{ color: "var(--accent-color)", flexShrink: 0 }}>→</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ padding: "28px 24px 32px", borderLeft: "1px solid var(--rule)", background: "var(--paper-2)" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted-color)", marginBottom: 16 }}>
            ○ WordPress traditionnel si
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            {HEADLESS_NO.map((item) => (
              <li key={item} style={{ fontSize: 13, color: "var(--ink-2)", display: "flex", gap: 8 }}>
                <span style={{ color: "var(--muted-color)", flexShrink: 0 }}>—</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
