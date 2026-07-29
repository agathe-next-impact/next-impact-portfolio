// Services page sections — Next Impact, Swiss minimalist edition.
// Mirrors the live next-impact.digital/services structure (sans tarifs).

const { useState: useStateSv } = React;

/* ============================================================
   01 — Hero with topic tabs + explainer
   ============================================================ */
function ServicesHero() {
  const [tab, setTab] = useStateSv(0);

  const TABS_DATA = [
    {
      label: "C'est quoi ?",
      intro: "Trois architectures, une promesse commune : un livrable que vous savez maintenir.",
      kind: "text",
      rows: [
        { stack: "Classique", code: "A", head: "WordPress monolithique",  text: "Thème custom moderne, build optimisé. Une seule application, sans découplage." },
        { stack: "Headless",  code: "B", head: "WP back + Next.js front", text: "WordPress en source de contenu, Next.js livre la page. Communication via REST ou GraphQL." },
        { stack: "Web App",   code: "C", head: "Next.js App Router",      text: "TypeScript, RSC, CI/CD complet. WordPress optionnel comme source. Architecture pour scale." }
      ]
    },
    {
      label: "Quel projet ?",
      intro: "Chaque projet a son tempo. La stack suit, pas l'inverse.",
      kind: "text",
      rows: [
        { stack: "Classique", code: "A", head: "Vitrine / Institutionnel", text: "Site corporate, blog modéré, refonte rapide d'un WP existant.", meta: "< 10 k visites / mois" },
        { stack: "Headless",  code: "B", head: "SEO & performance",        text: "Sites à fort enjeu SEO, blog dense, e-commerce de marque produit.", meta: "10 k → 100 k visites / mois" },
        { stack: "Web App",   code: "C", head: "Plateforme métier",        text: "Marketplace, intégrations API, multisites, plateforme B2B.", meta: "> 100 k visites / mois" }
      ]
    },
    {
      label: "Quelle structure ?",
      intro: "La pile s'adapte au profil : budget, équipe interne, dépendances existantes.",
      kind: "text",
      rows: [
        { stack: "Classique", code: "A", head: "TPE · Asso · Indépendant", text: "Équipe non technique, autonomie immédiate. CMS familier sans courbe d'apprentissage.", meta: "Budget < 100 k€" },
        { stack: "Headless",  code: "B", head: "PME · ESS employeuse",     text: "SCOP, SCIC, associations à budget moyen, fondations. Performance + autonomie.",     meta: "100 k → 500 k€" },
        { stack: "Web App",   code: "C", head: "Grand compte · Scale-up",  text: "Équipe technique en interne, SLA, multi-sources de contenu, multi-langues.",        meta: "Budget > 500 k€" }
      ]
    },
    {
      label: "Avantages & limites",
      intro: "Lecture franche. Aucune stack n'est gratuite.",
      kind: "verdict",
      rows: [
        { stack: "Classique", code: "A", pros: ["Coût juste",            "Time-to-market court",     "Écosystème familier"], cons: ["Limites de scaling",      "Performance front sous contrainte"] },
        { stack: "Headless",  code: "B", pros: ["Performance maximale",  "Sécurité renforcée",       "Autonomie éditoriale"], cons: ["Cadrage plus long",       "Substitution des plugins front"] },
        { stack: "Web App",   code: "C", pros: ["Évolutivité sans plafond","Logique métier propre",  "Adapté au temps réel"], cons: ["Budget initial supérieur","DevOps requis"] }
      ]
    }
  ];

  const current = TABS_DATA[tab];

  return (
    <section className="s" id="hero" style={{ paddingTop: "calc(72px * var(--density-y))" }}>
      <div className="container">
        <div className="grid12" style={{ rowGap: 32 }}>
          <div className="mono" style={{ gridColumn: "1 / span 5", fontSize: 11, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            <a href="index.html" style={{ color: "var(--ink-2)" }}>← Accueil</a>&nbsp;&nbsp;/&nbsp;&nbsp;
            <span style={{ color: "var(--accent)" }}>Services</span>
          </div>
          <div className="mono" style={{ gridColumn: "6 / span 4", fontSize: 11, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Document № 02 / Catalogue
          </div>
          <div className="mono" style={{ gridColumn: "10 / span 3", fontSize: 11, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "right" }}>
            Édition 2026
          </div>

          <div style={{ gridColumn: "1 / -1" }}><hr className="rule strong" style={{ borderTopColor: "var(--ink)" }} /></div>

          <div style={{ gridColumn: "1 / span 9" }}>
            <div className="label" style={{ color: "var(--accent)", marginBottom: 16 }}>№ 01 — Services</div>
            <h1 className="display" style={{ margin: 0, fontSize: "clamp(48px, 6.8vw, 108px)", lineHeight: 0.96, letterSpacing: "-0.025em" }}>
              Sites web &amp; <em style={{ color: "var(--accent)" }}>applications</em><br/>
              <span style={{ fontStyle: "italic", color: "var(--ink-2)" }}>sur-mesure.</span>
            </h1>
          </div>

          <div style={{ gridColumn: "10 / span 3", paddingTop: 12 }}>
            <div className="annot" style={{ marginBottom: 14 }}><span className="bar"></span>FIG. <em style={{ color: "var(--accent)", fontStyle: "normal" }}>01</em></div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: "var(--ink-2)" }}>
              Trois stacks calibrées. Du WordPress monolithique au headless le plus exigeant,
              en passant par des web apps sur-mesure.
            </p>
            <p className="mono" style={{ marginTop: 22, fontSize: 11, letterSpacing: "0.08em", color: "var(--muted)" }}>
              03 · STACKS<br/>
              05 · ÉTAPES PROJET<br/>
              ∞&nbsp;&nbsp;· AUTONOMIE
            </p>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ marginTop: 72, borderTop: "1px solid var(--ink)", borderBottom: "1px solid var(--rule)" }}>
          <div className="u-flex" style={{ flexWrap: "wrap" }}>
            {TABS_DATA.map((tt, i) => (
              <button
                key={tt.label}
                onClick={() => setTab(i)}
                style={{
                  padding: "16px 22px 16px 0",
                  marginRight: 22,
                  borderBottom: tab === i ? "2px solid var(--accent)" : "2px solid transparent",
                  marginBottom: -1,
                  color: tab === i ? "var(--ink)" : "var(--muted)",
                  fontSize: 13,
                  letterSpacing: "0.02em",
                  cursor: "pointer"
                }}
              >
                <span className="mono" style={{ fontSize: 10.5, color: tab === i ? "var(--accent)" : "var(--muted)", marginRight: 8, letterSpacing: "0.08em" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {tt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Comparison matrix — content changes per tab */}
        <div className="grid12" style={{ marginTop: 40 }}>
          {/* Intro column */}
          <div style={{ gridColumn: "1 / span 3" }}>
            <div className="mono" style={{ fontSize: 10.5, color: "var(--accent)", letterSpacing: "0.08em" }}>
              MATRICE {String(tab + 1).padStart(2, "0")} / 04
            </div>
            <h3 className="serif" style={{ fontSize: 30, lineHeight: 1.1, margin: "12px 0 0", fontWeight: 400, letterSpacing: "-0.01em" }}>
              {current.label}
            </h3>
            <p style={{ marginTop: 14, fontSize: 13.5, lineHeight: 1.55, color: "var(--ink-2)" }}>
              {current.intro}
            </p>
            <div className="mono" style={{ marginTop: 22, fontSize: 10.5, color: "var(--muted)", letterSpacing: "0.08em" }}>
              ↳ LECTURE EN COLONNES<br/>
              ↳ A / B / C → CLASSIQUE / HEADLESS / WEB APP
            </div>
          </div>

          {/* 3 stack columns */}
          <div style={{ gridColumn: "5 / span 8", borderTop: "1px solid var(--ink)" }}>
            <div className="grid12" style={{ gridTemplateColumns: "repeat(3, 1fr)", columnGap: 0 }}>
              {current.rows.map((r, i) => (
                <div key={r.stack} style={{
                  padding: "20px 18px 24px 18px",
                  borderRight: i < 2 ? "1px solid var(--rule)" : "none",
                  background: i === 1 ? "var(--paper-2)" : "transparent"
                }}>
                  <div className="u-flex u-between u-baseline">
                    <span className="mono" style={{ fontSize: 10.5, color: "var(--accent)", letterSpacing: "0.08em" }}>STACK&nbsp;{r.code}</span>
                    <span className="label">{r.stack}</span>
                  </div>

                  {current.kind === "text" ? (
                    <React.Fragment>
                      <h4 className="serif" style={{ fontSize: 20, lineHeight: 1.15, margin: "16px 0 10px", fontWeight: 400 }}>
                        {r.head}
                      </h4>
                      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: "var(--ink-2)" }}>{r.text}</p>
                      {r.meta && (
                        <div className="mono" style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid var(--rule)", fontSize: 10.5, color: "var(--muted)", letterSpacing: "0.06em" }}>
                          ↳ {r.meta.toUpperCase()}
                        </div>
                      )}
                    </React.Fragment>
                  ) : (
                    <div style={{ marginTop: 14 }}>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {r.pros.map((p) => (
                          <li key={p} className="u-flex u-gap-s" style={{ padding: "5px 0", fontSize: 13, alignItems: "baseline" }}>
                            <span className="mono" style={{ color: "var(--accent)", fontSize: 11 }}>＋</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                      <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 0", paddingTop: 10, borderTop: "1px solid var(--rule)" }}>
                        {r.cons.map((p) => (
                          <li key={p} className="u-flex u-gap-s" style={{ padding: "5px 0", fontSize: 13, alignItems: "baseline", color: "var(--ink-2)" }}>
                            <span className="mono" style={{ color: "var(--muted)", fontSize: 11 }}>−</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   02 — Trois stacks (no prices)
   ============================================================ */
const STACKS = [
  {
    no: "01",
    code: "STACK A",
    name: "Classique",
    tagline: "Le standard, durci.",
    audience: "Sites vitrines, sites institutionnels, refontes rapides d'un WordPress existant.",
    tech: "WordPress monolithique avec thème custom moderne, build optimisé, sécurité durcie.",
    inclus: ["Design moderne et responsive", "Compatible 5 langages", "Formation à l'admin WordPress", "Sécurité durcie"],
    cta: "Choisir cette stack",
    badge: null
  },
  {
    no: "02",
    code: "STACK B",
    name: "Headless",
    tagline: "La performance durable.",
    audience: "Sites à fort enjeu SEO, blogs denses, marques produit dont la performance front est un levier de conversion.",
    tech: "WordPress Headless en backend + Next.js en front (ISR, ISG, SSR). Hydratation partielle.",
    inclus: ["Design personnalisé", "Stratégie SEO avancée", "Migration de données", "Accompagnement stratégique"],
    cta: "Choisir cette stack",
    badge: "Le plus demandé"
  },
  {
    no: "03",
    code: "STACK C",
    name: "Web App",
    tagline: "Sur-mesure, sans plafond.",
    audience: "Plateformes à forte volumétrie, marketplaces, intégrations API lourdes, applications métier ou multisites.",
    tech: "WordPress Headless + Next.js App Router (RSC, ISR, SSR), TypeScript, CI/CD complet.",
    inclus: ["UI/UX sur-mesure totale", "Performances critiques (Lighthouse)", "Sécurité renforcée des dépendances", "Support prioritaire 12 mois"],
    cta: "Discuter de mon projet",
    badge: "Impact"
  }
];

function Stacks() {
  return (
    <section className="s" id="stacks">
      <div className="container">
        <div className="sec-head">
          <div className="sec-no">№ 02</div>
          <h2 className="sec-title">
            Trois stacks &mdash; <em style={{ fontStyle: "italic" }}>calibrées par périmètre, pas par tarif.</em>
          </h2>
          <div className="sec-meta">Catalogue · Fig. 02</div>
        </div>

        <div className="grid12" style={{ borderTop: "1px solid var(--ink)" }}>
          {STACKS.map((o, idx) => (
            <div key={o.no} style={{
              gridColumn: "span 4",
              borderRight: idx < 2 ? "1px solid var(--rule)" : "none",
              padding: "32px 28px 32px 0",
              position: "relative",
              background: idx === 1 ? "var(--paper-2)" : "transparent"
            }}>
              {o.badge && (
                <span className="mono" style={{
                  position: "absolute", top: 32, right: 0,
                  fontSize: 10, letterSpacing: "0.1em",
                  color: idx === 1 ? "var(--accent)" : "var(--ink-2)",
                  textTransform: "uppercase",
                  border: `1px solid ${idx === 1 ? "var(--accent)" : "var(--rule-strong)"}`,
                  padding: "4px 8px"
                }}>
                  ● {o.badge}
                </span>
              )}

              <div className="u-flex u-gap" style={{ alignItems: "baseline" }}>
                <span className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.08em" }}>{o.no} / 03</span>
                <span className="label">{o.code}</span>
              </div>

              <h3 className="serif" style={{ fontSize: 56, lineHeight: 1, margin: "20px 0 8px", fontWeight: 400, letterSpacing: "-0.02em" }}>
                {o.name}
              </h3>
              <p className="serif" style={{ fontStyle: "italic", margin: 0, fontSize: 18, color: "var(--ink-2)" }}>
                {o.tagline}
              </p>

              <div style={{ marginTop: 28, paddingTop: 18, borderTop: "1px solid var(--rule)" }}>
                <div className="label">Pour quel projet</div>
                <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.5, color: "var(--ink-2)" }}>{o.audience}</p>
              </div>

              <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid var(--rule)" }}>
                <div className="label">Stack technique</div>
                <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.5, color: "var(--ink-2)" }}>{o.tech}</p>
              </div>

              <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid var(--rule)" }}>
                <div className="label">Ce qui est inclus</div>
                <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 0" }}>
                  {o.inclus.map((it) => (
                    <li key={it} className="u-flex u-gap-s" style={{ fontSize: 14, padding: "5px 0", alignItems: "baseline" }}>
                      <span className="mono" style={{ color: "var(--accent)", fontSize: 11 }}>＋</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a className="btn" href="index.html#contact" style={{ marginTop: 28, height: 38, fontSize: 12 }}>
                {o.cta} <span className="arrow">→</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   03 — Comparatif
   ============================================================ */
const COMPARE = [
  ["Design",                       "Éco-conçu",  "Personnalisé", "Sur-mesure total"],
  ["Pages incluses",               "5 pages",    "Sur-mesure",   "Illimité"],
  ["Vitesse < 1 s",                "●",          "●",            "●"],
  ["Sécurité maximale",            "●",          "●",            "●"],
  ["Stratégie SEO avancée",        "",           "●",            "●"],
  ["Migration de données",         "",           "●",            "●"],
  ["Architecture multisite",       "",           "",             "●"],
  ["Intégrations API spécifiques", "",           "",             "●"],
  ["Accompagnement",               "Formation",  "Stratégique",  "Prioritaire"],
  ["Support",                      "—",          "3 mois",       "12 mois"],
  ["Attestation OETH (TIH)",       "●",          "●",            "Optimisée"]
];

function Comparatif() {
  return (
    <section className="s" id="comparatif">
      <div className="container">
        <div className="sec-head">
          <div className="sec-no">№ 03</div>
          <h2 className="sec-title">Comparatif &mdash; <em style={{ fontStyle: "italic" }}>la lecture en un coup d'œil.</em></h2>
          <div className="sec-meta">Tableau · Fig. 03</div>
        </div>

        <div style={{ borderTop: "1px solid var(--ink)" }}>
          <div className="grid12" style={{ borderBottom: "1px solid var(--ink)", padding: "16px 0" }}>
            <div className="label" style={{ gridColumn: "span 5" }}>Critère</div>
            <div className="label solid" style={{ gridColumn: "span 2", textAlign: "center" }}>A · Classique</div>
            <div className="label solid" style={{ gridColumn: "span 2", textAlign: "center" }}>B · Headless</div>
            <div className="label solid" style={{ gridColumn: "span 3", textAlign: "center" }}>C · Web App</div>
          </div>

          {COMPARE.map((row, i) => (
            <div key={row[0]} className="grid12" style={{
              borderBottom: "1px solid var(--rule)",
              padding: "18px 0",
              alignItems: "center"
            }}>
              <div style={{ gridColumn: "span 5", fontSize: 14 }}>
                <span className="mono" style={{ fontSize: 10.5, color: "var(--muted)", marginRight: 12 }}>{String(i + 1).padStart(2, "0")}</span>
                {row[0]}
              </div>
              <CompareCell value={row[1]} span={2} />
              <CompareCell value={row[2]} span={2} />
              <CompareCell value={row[3]} span={3} highlight />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function CompareCell({ value, span, highlight }) {
  const isDot = value === "●";
  const isEmpty = !value || value === "—";
  return (
    <div style={{
      gridColumn: `span ${span}`,
      textAlign: "center",
      fontSize: isDot ? 16 : 13,
      color: isEmpty ? "var(--rule-strong)" : (isDot ? (highlight ? "var(--accent)" : "var(--ink)") : "var(--ink-2)"),
      fontFamily: isDot ? "var(--mono)" : "var(--sans)"
    }}>
      {isEmpty ? "—" : value}
    </div>
  );
}

/* ============================================================
   04 — Web App focus : caractéristiques + cas d'usage
   ============================================================ */
function WebAppFocus() {
  const carac = [
    "Logique métier propre",
    "Comptes utilisateurs",
    "Données temps réel",
    "Éco-conception, mode hors-ligne, installation via écran d'accueil"
  ];
  const usage = [
    "Marketplace ou marques B2B",
    "Outil interne ou plateforme métier",
    "Simulateur, calculateur, configurateur",
    "Jeu en ligne, gamification",
    "Application terrain ou mobile"
  ];

  return (
    <section className="s" id="webapp">
      <div className="container">
        <div className="sec-head">
          <div className="sec-no">№ 04</div>
          <h2 className="sec-title">Zoom Web App &mdash; <em style={{ fontStyle: "italic" }}>quand l'aller-retour API n'est plus une option.</em></h2>
          <div className="sec-meta">Stack C · Fig. 04</div>
        </div>

        <div className="grid12">
          <div style={{ gridColumn: "1 / span 6", borderTop: "1px solid var(--ink)", paddingTop: 24 }}>
            <div className="label" style={{ color: "var(--accent)" }}>Caractéristiques</div>
            <ul style={{ listStyle: "none", padding: 0, margin: "20px 0 0" }}>
              {carac.map((c, i) => (
                <li key={c} style={{ display: "grid", gridTemplateColumns: "44px 1fr", gap: 12, padding: "12px 0", borderBottom: "1px solid var(--rule)", alignItems: "baseline" }}>
                  <span className="mono" style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.08em" }}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="serif" style={{ fontSize: 20, lineHeight: 1.25 }}>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ gridColumn: "8 / span 5", borderTop: "1px solid var(--ink)", paddingTop: 24 }}>
            <div className="label" style={{ color: "var(--accent)" }}>Cas d'usage</div>
            <ul style={{ listStyle: "none", padding: 0, margin: "20px 0 0" }}>
              {usage.map((u, i) => (
                <li key={u} style={{ display: "grid", gridTemplateColumns: "44px 1fr", gap: 12, padding: "12px 0", borderBottom: "1px solid var(--rule)", alignItems: "baseline" }}>
                  <span className="mono" style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.08em" }}>U.{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ fontSize: 16 }}>{u}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   05 — Avantages & Limites
   ============================================================ */
function Verdict() {
  const pros = [
    "Stack moderne intégrée, adaptée à votre métier",
    "Performance maximale (front Next.js + base statique)",
    "Autonomie complète : comprendre et maintenir",
    "Pas de limites imposées par un CMS générique"
  ];
  const cons = [
    "Budget initial supérieur à WordPress monolithique",
    "Substitution complète de l'écosystème plugins front",
    "Équipe technique nécessaire pour les évolutions structurelles"
  ];
  return (
    <section className="s" id="verdict">
      <div className="container">
        <div className="sec-head">
          <div className="sec-no">№ 05</div>
          <h2 className="sec-title">Verdict &mdash; <em style={{ fontStyle: "italic" }}>à retenir, à éviter.</em></h2>
          <div className="sec-meta">Lecture honnête · Fig. 05</div>
        </div>

        <div className="grid12">
          <div style={{ gridColumn: "1 / span 6", border: "1px solid var(--rule)", padding: 28 }}>
            <div className="u-flex u-between" style={{ alignItems: "baseline" }}>
              <span className="serif" style={{ fontSize: 28, fontStyle: "italic" }}>À retenir</span>
              <span className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.08em" }}>＋ POSITIF</span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "20px 0 0" }}>
              {pros.map((p) => (
                <li key={p} className="u-flex u-gap-s" style={{ padding: "10px 0", borderTop: "1px solid var(--rule)", fontSize: 14, alignItems: "baseline" }}>
                  <span className="mono" style={{ color: "var(--accent)" }}>＋</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ gridColumn: "8 / span 5", border: "1px solid var(--rule)", padding: 28 }}>
            <div className="u-flex u-between" style={{ alignItems: "baseline" }}>
              <span className="serif" style={{ fontSize: 28, fontStyle: "italic" }}>À éviter</span>
              <span className="mono" style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.08em" }}>− RÉSERVE</span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "20px 0 0" }}>
              {cons.map((p) => (
                <li key={p} className="u-flex u-gap-s" style={{ padding: "10px 0", borderTop: "1px solid var(--rule)", fontSize: 14, alignItems: "baseline" }}>
                  <span className="mono" style={{ color: "var(--muted)" }}>−</span>
                  <span style={{ color: "var(--ink-2)" }}>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   06 — Réalisations
   ============================================================ */
const CASES = [
  {
    no: "R.01",
    title: "Panorama Pub",
    type: "Marketplace B2B",
    desc: "Plateforme livrée en 2 mois pour le sourcing fournisseurs publicitaires.",
    stack: ["Next.js", "Postgres", "Prisma"]
  },
  {
    no: "R.02",
    title: "Hermitage",
    type: "Jeu de piste — PWA",
    desc: "Application mobile PWA, gamification, installable sans store, hors-ligne.",
    stack: ["PWA", "Next.js", "Workbox"]
  }
];

function Realisations() {
  return (
    <section className="s" id="realisations">
      <div className="container">
        <div className="sec-head">
          <div className="sec-no">№ 06</div>
          <h2 className="sec-title">Réalisations &mdash; <em style={{ fontStyle: "italic" }}>deux cas, deux stacks.</em></h2>
          <div className="sec-meta">Sélection 2025–2026 · Fig. 06</div>
        </div>

        <div className="grid12">
          {CASES.map((c, i) => (
            <div key={c.no} style={{ gridColumn: "span 6", borderTop: "1px solid var(--ink)", paddingTop: 24 }}>
              <div className="u-flex u-between" style={{ alignItems: "baseline" }}>
                <span className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.08em" }}>{c.no}</span>
                <span className="label">{c.type}</span>
              </div>
              <div className="ph" style={{ aspectRatio: "16/10", marginTop: 16, position: "relative" }}>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div className="serif" style={{ fontSize: 56, lineHeight: 1, fontStyle: "italic", letterSpacing: "-0.02em" }}>
                    {c.title}
                  </div>
                </div>
                <div className="mono" style={{ position: "absolute", bottom: 12, left: 12, fontSize: 10, letterSpacing: "0.08em", color: "var(--muted)" }}>↳ {c.type.toUpperCase()}</div>
                <div className="mono" style={{ position: "absolute", bottom: 12, right: 12, fontSize: 10, letterSpacing: "0.08em", color: "var(--accent)" }}>VOIR L'ÉTUDE →</div>
              </div>
              <p style={{ margin: "16px 0 0", color: "var(--ink-2)", fontSize: 14, lineHeight: 1.55 }}>{c.desc}</p>
              <div className="u-flex u-gap-s" style={{ marginTop: 16, flexWrap: "wrap" }}>
                {c.stack.map((s) => (
                  <span key={s} className="mono" style={{ fontSize: 10.5, padding: "5px 9px", border: "1px solid var(--rule)", letterSpacing: "0.06em" }}>{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   07 — Avantage OETH (callout)
   ============================================================ */
function OETHCallout() {
  return (
    <section className="s" id="oeth" style={{ background: "var(--paper-2)" }}>
      <div className="container">
        <div className="grid12 u-baseline">
          <div style={{ gridColumn: "span 2" }}>
            <div className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.08em" }}>№ 07 ★ AVANTAGE</div>
            <div className="serif" style={{ fontSize: 44, marginTop: 8, lineHeight: 1, fontStyle: "italic", letterSpacing: "-0.02em" }}>OETH</div>
            <div className="label" style={{ marginTop: 12 }}>APPLICABLE · TRANSVERSE</div>
          </div>

          <div style={{ gridColumn: "span 7" }}>
            <h3 className="serif" style={{ fontSize: 36, lineHeight: 1.1, margin: 0, fontWeight: 400 }}>
              Déduction AGEFIPH transverse.
            </h3>
            <p style={{ margin: "16px 0 0", color: "var(--ink-2)", fontSize: 15, lineHeight: 1.6 }}>
              Vous pouvez faire valoir vos achats dans le droit à la déduction AGEFIPH —
              <span className="mono" style={{ color: "var(--accent)" }}>&nbsp;30 % du coût de main-d'œuvre</span> —
              que votre projet soit un site WordPress, headless, web app ou application mobile.
              Attestation OETH fournie en fin de projet.
            </p>
          </div>

          <div style={{ gridColumn: "span 3", textAlign: "right" }}>
            <a className="btn primary" href="index.html#contact">Simuler mon économie <span className="arrow">→</span></a>
            <div className="mono" style={{ marginTop: 14, fontSize: 11, color: "var(--muted)", letterSpacing: "0.08em" }}>
              ↳ Prestataire TIH agréé
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   08 — Comment je choisis votre stack
   ============================================================ */
function Methode() {
  const items = [
    { no: "M.01", t: "Périmètre fonctionnel", d: "Site vitrine, blog, e-commerce, application métier : chaque type de projet a sa stack idéale." },
    { no: "M.02", t: "Volumétrie & trafic", d: "Sous 10 k visites/mois, un monolithique custom suffit. Au-delà, le headless devient pertinent." },
    { no: "M.03", t: "Évolutivité visée", d: "Intégrations API, multisites, applications métier : Next.js est le terrain de jeu adapté." }
  ];
  return (
    <section className="s" id="methode">
      <div className="container">
        <div className="sec-head">
          <div className="sec-no">№ 08</div>
          <h2 className="sec-title">Méthode &mdash; <em style={{ fontStyle: "italic" }}>comment je choisis votre stack.</em></h2>
          <div className="sec-meta">03 critères · Fig. 08</div>
        </div>

        <div className="grid12" style={{ borderTop: "1px solid var(--rule)" }}>
          {items.map((c, i) => (
            <div key={c.no} style={{
              gridColumn: "span 4",
              borderRight: i < 2 ? "1px solid var(--rule)" : "none",
              padding: "32px 24px 32px 0"
            }}>
              <div className="serif" style={{ fontSize: 88, lineHeight: 1, color: "var(--rule-strong)", letterSpacing: "-0.04em" }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="mono" style={{ marginTop: 12, fontSize: 11, color: "var(--accent)", letterSpacing: "0.08em" }}>{c.no}</div>
              <h4 className="serif" style={{ fontSize: 26, fontWeight: 400, margin: "8px 0 12px", lineHeight: 1.15 }}>{c.t}</h4>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: "var(--ink-2)" }}>{c.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   09 — Niveau d'investissement (sans tarifs : qualitatif)
   ============================================================ */
function NiveauInvestissement() {
  const blocks = [
    {
      no: "I.01",
      t: "Site vitrine ou institutionnel",
      d: "Un WordPress monolithique custom suffit : design moderne, code propre, performances solides et sécurité maximale pour un coût juste.",
      tag: "Stack A · Classique"
    },
    {
      no: "I.02",
      t: "Plateforme à fort enjeu",
      d: "Forte volumétrie, multisites ou intégrations complexes : architecture WordPress Headless + Next.js, en sur-mesure.",
      tag: "Stack B/C · Headless / Web App"
    }
  ];
  return (
    <section className="s" id="investissement">
      <div className="container">
        <div className="sec-head">
          <div className="sec-no">№ 09</div>
          <h2 className="sec-title">
            Quel niveau d'investissement <em style={{ fontStyle: "italic" }}>pour votre projet&nbsp;?</em>
          </h2>
          <div className="sec-meta">02 trajectoires · Fig. 09</div>
        </div>

        <div className="grid12" style={{ rowGap: 24 }}>
          {blocks.map((b, i) => (
            <div key={b.no} style={{
              gridColumn: i === 0 ? "1 / span 6" : "7 / span 6",
              border: "1px solid var(--rule)",
              padding: 32
            }}>
              <div className="u-flex u-between" style={{ alignItems: "baseline" }}>
                <span className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.08em" }}>{b.no}</span>
                <span className="label">{b.tag}</span>
              </div>
              <h3 className="serif" style={{ fontSize: 32, lineHeight: 1.1, margin: "20px 0 14px", fontWeight: 400 }}>{b.t}</h3>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: "var(--ink-2)" }}>{b.d}</p>
              <div className="mono" style={{ marginTop: 24, paddingTop: 18, borderTop: "1px solid var(--rule)", fontSize: 11, color: "var(--muted)", letterSpacing: "0.08em" }}>
                ↳ DEVIS ÉTABLI APRÈS CADRAGE — RÉPONSE SOUS 24 H
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   10 — Outils + Démo + Choisissez votre stack
   ============================================================ */
function Outils() {
  const items = [
    { no: "T.01", k: "Outils",                title: "Simulateur ROI, audit & diagnostic IA", body: "Évaluez votre présence digitale et le retour sur investissement d'une refonte.", cta: "Accéder aux outils" },
    { no: "T.02", k: "Démo",                  title: "WordPress Headless en live",            body: "Découvrez en direct la puissance d'une architecture découplée sur un projet d'exemple.", cta: "Voir la démo" },
    { no: "T.03", k: "Choisissez votre stack", title: "Questionnaire — 2 minutes",            body: "Répondez à quelques questions et recevez l'offre adaptée à votre structure.", cta: "Démarrer" }
  ];
  return (
    <section className="s" id="outils">
      <div className="container">
        <div className="sec-head">
          <div className="sec-no">№ 10</div>
          <h2 className="sec-title">Outils &mdash; <em style={{ fontStyle: "italic" }}>se faire une idée avant d'engager.</em></h2>
          <div className="sec-meta">03 ressources · Fig. 10</div>
        </div>

        <div className="grid12" style={{ borderTop: "1px solid var(--ink)" }}>
          {items.map((it, idx) => (
            <div key={it.no} style={{ gridColumn: "span 4", borderRight: idx < 2 ? "1px solid var(--rule)" : "none", padding: "28px 24px 28px 0" }}>
              <div className="u-flex u-between" style={{ alignItems: "baseline" }}>
                <span className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.08em" }}>{it.no}</span>
                <span className="label">{it.k}</span>
              </div>
              <h4 className="serif" style={{ fontSize: 26, lineHeight: 1.1, margin: "16px 0 8px", fontWeight: 400 }}>{it.title}</h4>
              <p style={{ margin: "10px 0 0", color: "var(--ink-2)", fontSize: 14, lineHeight: 1.55 }}>{it.body}</p>
              <div style={{ marginTop: 22 }}>
                <a className="btn" href="#" style={{ height: 36, fontSize: 12 }}>{it.cta} <span className="arrow">→</span></a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   11 — Projet en 5 étapes
   ============================================================ */
const PROCESS = [
  { dur: "1 sem.",  t: "Analyse & cadrage",       d: "Audit de l'existant, définition des besoins, choix de la stack." },
  { dur: "2 sem.",  t: "Conception & validation", d: "Wireframes, maquettes, validation. Accès continu à l'environnement de recette." },
  { dur: "3–4 sem.", t: "Développement",           d: "Développement et intégration. Itérations courtes, démonstrations hebdomadaires." },
  { dur: "1 sem.",  t: "Optimisation & tests",    d: "Performance (Lighthouse), SEO technique, formation des équipes." },
  { dur: "1 sem.",  t: "Mise en ligne",           d: "Migration, tests de bascule, support post-déploiement." }
];

function Process() {
  return (
    <section className="s" id="process">
      <div className="container">
        <div className="sec-head">
          <div className="sec-no">№ 11</div>
          <h2 className="sec-title">Projet en <em style={{ fontStyle: "italic" }}>cinq étapes.</em></h2>
          <div className="sec-meta">Process rodé · Fig. 11</div>
        </div>

        <div style={{ borderTop: "1px solid var(--ink)" }}>
          <div className="grid12" style={{ borderBottom: "1px solid var(--rule)" }}>
            {PROCESS.map((p, i) => (
              <div key={p.t} style={{
                gridColumn: i === 2 ? "span 3" : "span 2",
                borderRight: i < 4 ? "1px solid var(--rule)" : "none",
                padding: "24px 18px 28px 0"
              }}>
                <div className="u-flex u-between u-baseline">
                  <span className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.08em" }}>
                    ÉTAPE {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="mono" style={{ fontSize: 10.5, color: "var(--muted)" }}>{p.dur}</span>
                </div>
                <h4 className="serif" style={{ fontSize: 22, fontWeight: 400, margin: "18px 0 10px", lineHeight: 1.1 }}>{p.t}</h4>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "var(--ink-2)" }}>{p.d}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, position: "relative", height: 8 }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 3, height: 1, background: "var(--rule-strong)" }}></div>
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} style={{
                position: "absolute",
                left: `${(i / 4) * 100}%`,
                top: 0,
                width: 7,
                height: 7,
                background: i === 2 ? "var(--accent)" : "var(--ink)",
                transform: "translateX(-50%)",
                borderRadius: "50%"
              }}></div>
            ))}
            <div className="mono" style={{ position: "absolute", left: 0, top: 16, fontSize: 10, color: "var(--muted)", letterSpacing: "0.08em" }}>JOUR 0</div>
            <div className="mono" style={{ position: "absolute", right: 0, top: 16, fontSize: 10, color: "var(--accent)", letterSpacing: "0.08em" }}>~ 8 SEMAINES → LIVRAISON</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   12 — FAQ
   ============================================================ */
const FAQ = [
  { q: "Est-ce que je pourrai toujours modifier mes textes ?", a: "Oui, sans réserve. Le back-office WordPress reste votre point d'entrée pour tous les contenus : textes, images, médias, taxonomies. Le découplage Headless ne change rien à l'expérience d'édition — il n'optimise que la livraison côté visiteur." },
  { q: "Le Headless est-il plus cher à maintenir ?",            a: "Non, et souvent l'inverse. Moins de plugins front, hébergement statique mutualisable, mises à jour de sécurité concentrées sur le back. Le coût total sur 3 ans est généralement inférieur à un WordPress classique surchargé." },
  { q: "Combien de temps prend la mise en place ?",             a: "Compter 6 à 10 semaines en moyenne pour une refonte complète (cadrage → mise en ligne). Pour un site vitrine simple, c'est plutôt 3 à 5 semaines." },
  { q: "Mes plugins WordPress fonctionneront-ils encore ?",     a: "La majorité oui (formulaires, SEO, ACF, multilingue). Les plugins purement front (sliders, builders) sont remplacés par des équivalents Next.js plus performants. Un audit préalable identifie systématiquement les substitutions nécessaires." }
];

function Faq() {
  const [openIdx, setOpenIdx] = useStateSv(0);
  return (
    <section className="s" id="faq">
      <div className="container">
        <div className="sec-head">
          <div className="sec-no">№ 12</div>
          <h2 className="sec-title">Questions <em style={{ fontStyle: "italic" }}>fréquentes.</em></h2>
          <div className="sec-meta">04 réponses · Fig. 12</div>
        </div>

        <div className="grid12">
          <div style={{ gridColumn: "1 / span 3" }}>
            <p style={{ margin: 0, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.55 }}>
              Une question qui n'apparaît pas&nbsp;? Écrivez-moi directement,
              je réponds sous 24&nbsp;h ouvrées.
            </p>
            <a href="mailto:agathe@next-impact.digital" className="annot" style={{ marginTop: 18, color: "var(--ink)" }}>
              <span className="bar"></span>agathe@next-impact.digital
            </a>
          </div>

          <div style={{ gridColumn: "5 / span 8", borderTop: "1px solid var(--ink)" }}>
            {FAQ.map((it, i) => {
              const open = i === openIdx;
              return (
                <div key={it.q} style={{ borderBottom: "1px solid var(--rule)" }}>
                  <button
                    onClick={() => setOpenIdx(open ? -1 : i)}
                    style={{ width: "100%", textAlign: "left", padding: "22px 0", display: "grid", gridTemplateColumns: "56px 1fr 32px", alignItems: "center", gap: 16 }}
                  >
                    <span className="mono" style={{ fontSize: 11, color: open ? "var(--accent)" : "var(--muted)", letterSpacing: "0.08em" }}>Q.{String(i + 1).padStart(2, "0")}</span>
                    <span className="serif" style={{ fontSize: 22, lineHeight: 1.15, color: open ? "var(--ink)" : "var(--ink-2)" }}>{it.q}</span>
                    <span className="mono" style={{ fontSize: 18, color: open ? "var(--accent)" : "var(--ink)", textAlign: "right" }}>{open ? "−" : "+"}</span>
                  </button>
                  {open && (
                    <div style={{ display: "grid", gridTemplateColumns: "56px 1fr 32px", gap: 16, paddingBottom: 24 }}>
                      <span></span>
                      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: "var(--ink-2)", maxWidth: 640 }}>{it.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   13 — CTA final
   ============================================================ */
function ServicesCTA() {
  return (
    <section className="s" id="cta" style={{ background: "var(--ink)", color: "var(--paper)" }}>
      <div className="container">
        <div className="grid12 u-baseline" style={{ borderTop: "1px solid rgba(241,237,228,0.18)", paddingTop: 48 }}>
          <div style={{ gridColumn: "span 1" }}>
            <span className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.08em" }}>№ 13</span>
          </div>
          <div style={{ gridColumn: "span 8" }}>
            <h2 className="serif" style={{ fontSize: "clamp(40px, 5vw, 72px)", lineHeight: 1.02, margin: 0, fontWeight: 400, letterSpacing: "-0.02em" }}>
              Prêt&nbsp;? <em style={{ fontStyle: "italic", color: "var(--accent)" }}>Deux minutes</em> de questionnaire
              et vous obtenez la stack adaptée.
            </h2>
          </div>
          <div style={{ gridColumn: "span 3", textAlign: "right" }}>
            <span className="annot" style={{ color: "rgba(241,237,228,0.55)", justifyContent: "flex-end" }}>
              <span className="bar" style={{ background: "rgba(241,237,228,0.5)" }}></span>DISPONIBLE · 24 H
            </span>
          </div>
        </div>

        <div className="grid12" style={{ marginTop: 56 }}>
          <div style={{ gridColumn: "1 / span 8" }} className="u-flex u-gap">
            <a className="btn primary" href="index.html#contact" style={{ background: "var(--accent)", borderColor: "var(--accent)", color: "var(--paper)" }}>
              <span className="dot" style={{ background: "var(--paper)" }}></span>
              Choisir ma stack — 2 min
              <span className="arrow">→</span>
            </a>
            <a className="btn" href="mailto:agathe@next-impact.digital" style={{ borderColor: "var(--paper)", color: "var(--paper)" }}>
              Écrire un mail <span className="arrow">→</span>
            </a>
          </div>
          <div style={{ gridColumn: "span 4", textAlign: "right" }}>
            <a href="index.html" className="mono" style={{ fontSize: 11, letterSpacing: "0.08em", color: "rgba(241,237,228,0.7)" }}>
              ← RETOUR ACCUEIL
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, {
  ServicesHero, Stacks, Comparatif, WebAppFocus, Verdict, Realisations,
  OETHCallout, Methode, NiveauInvestissement, Outils, Process, Faq, ServicesCTA
});
