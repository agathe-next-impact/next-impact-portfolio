// Swiss minimalist sections for the Next Impact landing page.
// Each component is small + composable. All exported to window at the end.

const { useState, useEffect, useMemo } = React;

/* ---------- Helpers ---------- */
function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}
function pad(n) { return String(n).padStart(2, "0"); }
function fmtTime(d) {
  return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} UTC`;
}
function fmtDate(d) {
  const months = ["JAN","FÉV","MAR","AVR","MAI","JUI","JUL","AOÛ","SEP","OCT","NOV","DÉC"];
  return `${pad(d.getDate())} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

/* ---------- Header ---------- */
function Header() {
  const now = useNow();
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 10, background: "var(--paper)", borderBottom: "1px solid var(--rule)" }}>
      <div className="container">
        <div className="u-flex u-between u-center" style={{ height: 56 }}>
          <div className="u-flex u-center u-gap">
            <div className="mono" style={{ fontSize: 12, letterSpacing: "0.08em" }}>
              <span style={{ color: "var(--accent)" }}>◼</span>&nbsp; NEXT&nbsp;IMPACT — STUDIO
            </div>
            <span className="label" style={{ fontSize: 10 }}>EST. 2020 · FR</span>
          </div>
          <nav className="u-flex u-center u-gap-l" style={{ fontSize: 13 }}>
            <a href="index.html#capacites">Capacités</a>
            <a href="services.html">Services</a>
            <a href="index.html#methode">Méthode</a>
            <a href="index.html#cas">Études</a>
            <a href="index.html#ressources">Ressources</a>
            <a href="index.html#contact">Contact</a>
          </nav>
          <div className="u-flex u-center u-gap">
            <span className="annot"><span className="status-dot"></span> DISPONIBLE</span>
            <span className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>{fmtTime(now)}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ---------- 01 — Hero ---------- */
function Hero() {
  return (
    <section className="s" id="hero" style={{ paddingTop: "calc(72px * var(--density-y))" }}>
      <div className="container">
        <div className="grid12" style={{ rowGap: 32 }}>
          {/* top meta strip */}
          <div className="mono" style={{ gridColumn: "1 / span 4", fontSize: 11, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            № 01 / Document Liminaire
          </div>
          <div className="mono" style={{ gridColumn: "5 / span 4", fontSize: 11, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Édition 2026 / Vol. 02
          </div>
          <div className="mono" style={{ gridColumn: "9 / span 4", fontSize: 11, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "right" }}>
            Studio indépendant · Auvergne (FR)
          </div>

          {/* separator */}
          <div style={{ gridColumn: "1 / -1" }}><hr className="rule strong" style={{ borderTopColor: "var(--ink)" }} /></div>

          {/* headline column */}
          <div style={{ gridColumn: "1 / span 9" }}>
            <h1 className="display" style={{ margin: 0, fontSize: "clamp(56px, 8.4vw, 132px)", lineHeight: 0.95, letterSpacing: "-0.025em" }}>
              Sites &amp; <em style={{ color: "var(--accent)" }}>applications</em>,<br/>
              sur-mesure.<br/>
              <span style={{ fontStyle: "italic", color: "var(--ink-2)" }}>Le bon outil pour le bon projet.</span>
            </h1>
          </div>

          {/* side note */}
          <div style={{ gridColumn: "10 / span 3", paddingTop: 8 }}>
            <div className="annot" style={{ marginBottom: 14 }}><span className="bar"></span>FIG. <em style={{ color: "var(--accent)", fontStyle: "normal" }}>01</em></div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: "var(--ink-2)" }}>
              Studio freelance dirigé par <span className="serif" style={{ fontStyle: "italic" }}>Agathe Karinthi-Martin</span>.
              Conception &amp; développement de sites WordPress, architectures Headless avec Next.js,
              web apps et applications mobiles.
            </p>
            <p className="mono" style={{ marginTop: 18, fontSize: 11, letterSpacing: "0.08em", color: "var(--muted)" }}>
              20 ANS · EXP. DIGITALE<br/>
              06 · ANS DÉV.<br/>
              24 H · TEMPS DE RÉPONSE
            </p>
          </div>

          {/* CTAs */}
          <div style={{ gridColumn: "1 / span 9", marginTop: 32 }} className="u-flex u-center u-gap">
            <a className="btn primary" href="#diagnostic">
              <span className="dot"></span>
              Diagnostic projet — 2 min
              <span className="arrow">→</span>
            </a>
            <a className="btn" href="#contact">
              Échanger directement
              <span className="arrow">→</span>
            </a>
            <span className="fig" style={{ marginLeft: 8 }}>↳ <em>Réponse sous 24 h</em></span>
          </div>
        </div>

        {/* bottom strip */}
        <div style={{ marginTop: 72 }}>
          <hr className="rule" />
          <div className="grid12" style={{ paddingTop: 16 }}>
            <span className="label" style={{ gridColumn: "span 3" }}>Pile technique</span>
            <span className="label" style={{ gridColumn: "span 3" }}>WordPress · WordPress Headless</span>
            <span className="label" style={{ gridColumn: "span 3" }}>Next.js · React · PostgreSQL</span>
            <span className="label" style={{ gridColumn: "span 3", textAlign: "right" }}>PWA · Mobile · Marketplace</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 02 — Capacités ---------- */
const CAPS = [
  {
    no: "01",
    name: "WordPress classique",
    tag: "Vitrine / Institutionnel",
    desc: "Sites éditoriaux performants et autonomes à gérer. Stack éprouvée pour un time-to-market court et une maintenance lisible.",
    stack: ["WP", "ACF", "Gutenberg"]
  },
  {
    no: "02",
    name: "WordPress Headless",
    tag: "WP + Next.js",
    desc: "Le confort éditorial de WordPress, la performance et la sécurité de Next.js. Idéal pour pics de trafic et exigences SEO.",
    stack: ["WPGraphQL", "Next.js", "ISR"]
  },
  {
    no: "03",
    name: "Web App sur-mesure",
    tag: "Logique métier",
    desc: "Applications métier, portails clients, marketplaces. Architecture pensée pour évoluer sans dette technique.",
    stack: ["Next.js", "Postgres", "Prisma"]
  },
  {
    no: "04",
    name: "Mobile & PWA",
    tag: "iOS · Android · Web",
    desc: "Une base, plusieurs cibles. PWA installable et applications natives via React Native, sans duplication d'efforts.",
    stack: ["React Native", "PWA", "Expo"]
  }
];

function Capacites() {
  return (
    <section className="s" id="capacites">
      <div className="container">
        <div className="sec-head">
          <div className="sec-no">№ 02</div>
          <h2 className="sec-title">
            Quatre voies. <em style={{ fontStyle: "italic", color: "var(--accent)" }}>Un seul</em> partenaire,
            de la maquette à la mise en production.
          </h2>
          <div className="sec-meta">Capacités / 04 piliers · Fig. 02</div>
        </div>

        <div>
          {CAPS.map((c) => (
            <div key={c.no} className="cap-row">
              <span className="cap-arrow">→</span>
              <div className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.08em", paddingTop: 6 }}>{c.no} / 04</div>
              <div>
                <h3 className="serif" style={{ margin: 0, fontSize: 30, lineHeight: 1.05, letterSpacing: "-0.01em", fontWeight: 400 }}>{c.name}</h3>
                <div className="label" style={{ marginTop: 8 }}>{c.tag}</div>
              </div>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: "var(--ink-2)", maxWidth: 460 }}>{c.desc}</p>
              <div className="u-flex u-gap-s" style={{ flexWrap: "wrap", justifyContent: "flex-end", alignItems: "flex-start" }}>
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

/* ---------- 03 — Méthode ---------- */
const STEPS = [
  { t: "Diagnostic", d: "Cadrage du périmètre, contraintes techniques, attentes business. Choix de la voie : vitrine, headless, app." },
  { t: "Architecture", d: "Wireframes, modèle de données, schéma de pages. Définition de la pile technique adaptée à la volumétrie cible." },
  { t: "Build", d: "Développement itératif en environnements de recette, accès continu pour validation. Aucun effet boîte noire." },
  { t: "Mise en production", d: "Déploiement, transferts SEO, monitoring. Formation à l'administration pour assurer votre autonomie." },
  { t: "Suivi", d: "Optionnel. Maintenance corrective et évolutive sur demande, sans abonnement contraint." }
];

function Methode() {
  return (
    <section className="s" id="methode">
      <div className="container">
        <div className="sec-head">
          <div className="sec-no">№ 03</div>
          <h2 className="sec-title">Méthode &mdash; <em style={{ fontStyle: "italic" }}>un processus linéaire, sans angle mort.</em></h2>
          <div className="sec-meta">Process / 05 étapes · Fig. 03</div>
        </div>

        <div className="grid12">
          <div style={{ gridColumn: "1 / span 4" }}>
            <p className="quote" style={{ fontSize: 28, margin: 0, color: "var(--ink-2)" }}>
              «&nbsp;Pas de jargon. Pas de dépendance. Un livrable que vous savez maintenir,
              et un canal direct avec votre développeuse.&nbsp;»
            </p>
            <p className="mono" style={{ marginTop: 24, fontSize: 11, color: "var(--muted)", letterSpacing: "0.08em" }}>
              ↳ AGATHE KARINTHI-MARTIN<br/>
              <span style={{ color: "var(--ink-2)" }}>FONDATRICE · DÉVELOPPEUSE</span>
            </p>
          </div>

          <div style={{ gridColumn: "6 / span 7" }}>
            <ol className="steps">
              {STEPS.map((s) => (
                <li key={s.t}>
                  <h4>{s.t}</h4>
                  <p>{s.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 04 — Étude de cas ---------- */
function EtudeDeCas() {
  return (
    <section className="s" id="cas">
      <div className="container">
        <div className="sec-head">
          <div className="sec-no">№ 04</div>
          <h2 className="sec-title">Étude de cas &mdash; <span className="serif" style={{ fontStyle: "italic", color: "var(--accent)" }}>Panorama Pub</span></h2>
          <div className="sec-meta">Référence sélectionnée · Fig. 04</div>
        </div>

        <div className="grid12">
          {/* visual */}
          <div style={{ gridColumn: "1 / span 7" }}>
            <div className="ph" style={{ aspectRatio: "16/10", position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}>
                  <div className="mono" style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.1em" }}>PANORAMA-PUB.FR</div>
                  <div className="serif" style={{ fontSize: 64, lineHeight: 1, marginTop: 12, fontStyle: "italic" }}>
                    Sourcing<br/>fournisseurs.
                  </div>
                </div>
              </div>
              {/* corner labels */}
              <div className="mono" style={{ position: "absolute", top: 12, left: 12, fontSize: 10, letterSpacing: "0.08em", color: "var(--muted)" }}>01 / IMAGE</div>
              <div className="mono" style={{ position: "absolute", top: 12, right: 12, fontSize: 10, letterSpacing: "0.08em", color: "var(--muted)" }}>2025 — LIVRÉ</div>
              <div className="mono" style={{ position: "absolute", bottom: 12, left: 12, fontSize: 10, letterSpacing: "0.08em", color: "var(--muted)" }}>↳ MARKETPLACE B2B</div>
              <div className="mono" style={{ position: "absolute", bottom: 12, right: 12, fontSize: 10, letterSpacing: "0.08em", color: "var(--accent)" }}>ÉTUDE COMPLÈTE →</div>
            </div>
          </div>

          {/* facts column */}
          <div style={{ gridColumn: "9 / span 4" }}>
            <div className="label" style={{ color: "var(--accent)" }}>Résumé d'opération</div>
            <h3 className="serif" style={{ fontSize: 32, lineHeight: 1.1, margin: "12px 0 24px", fontWeight: 400 }}>
              Marketplace B2B pour le sourcing fournisseurs.
            </h3>
            <p style={{ margin: 0, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.6 }}>
              Du concept à la production en deux mois. Architecture Next.js + PostgreSQL,
              espace fournisseur et back-office sur-mesure.
            </p>

            {/* metric grid */}
            <div style={{ marginTop: 32, borderTop: "1px solid var(--ink)" }}>
              <div className="grid12" style={{ gridTemplateColumns: "1fr 1fr", columnGap: 0, borderBottom: "1px solid var(--rule)" }}>
                <div style={{ padding: "18px 0", borderRight: "1px solid var(--rule)", paddingRight: 12 }}>
                  <div className="label">Délai</div>
                  <div className="serif" style={{ fontSize: 40, lineHeight: 1, marginTop: 8 }}>02<span style={{ fontSize: 16, color: "var(--muted)" }}>&nbsp;mois</span></div>
                </div>
                <div style={{ padding: "18px 0 18px 16px" }}>
                  <div className="label">Segment</div>
                  <div className="serif" style={{ fontSize: 40, lineHeight: 1, marginTop: 8 }}>B2B</div>
                </div>
              </div>
              <div className="grid12" style={{ gridTemplateColumns: "1fr 1fr", columnGap: 0, borderBottom: "1px solid var(--rule)" }}>
                <div style={{ padding: "18px 0", borderRight: "1px solid var(--rule)", paddingRight: 12 }}>
                  <div className="label">Stack</div>
                  <div className="mono" style={{ marginTop: 10, fontSize: 12 }}>Next.js<br/>Postgres<br/>Prisma</div>
                </div>
                <div style={{ padding: "18px 0 18px 16px" }}>
                  <div className="label">Statut</div>
                  <div className="mono" style={{ marginTop: 10, fontSize: 12, color: "var(--accent)" }}>● EN&nbsp;PROD<br/><span style={{ color: "var(--muted)" }}>v 1.4.0</span></div>
                </div>
              </div>
            </div>

            <a className="btn" href="#" style={{ marginTop: 28 }}>Lire l'étude <span className="arrow">→</span></a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 05 — Ressources ---------- */
function Ressources() {
  const items = [
    { no: "R-01", kind: "Livre blanc", title: "Qu'est-ce que WordPress Headless ?", meta: "PDF · 42 p · gratuit", body: "Architecture, cas d'usage, mise en œuvre. Un guide complet sans inscription." },
    { no: "R-02", kind: "Outil", title: "Audit IA gratuit", meta: "Web · résultat instantané", body: "Analyse automatisée de votre site actuel : performance, SEO, accessibilité, sobriété." },
    { no: "R-03", kind: "Calculateur", title: "Simulateur ROI", meta: "Web · 5 min", body: "Estimez le retour sur investissement d'une refonte ou d'une migration vers Headless." }
  ];
  return (
    <section className="s" id="ressources">
      <div className="container">
        <div className="sec-head">
          <div className="sec-no">№ 05</div>
          <h2 className="sec-title">Ressources &mdash; <em style={{ fontStyle: "italic" }}>comprendre avant d'engager.</em></h2>
          <div className="sec-meta">03 documents · Fig. 05</div>
        </div>

        <div className="grid12" style={{ borderTop: "1px solid var(--ink)" }}>
          {items.map((it, idx) => (
            <div key={it.no} style={{ gridColumn: "span 4", borderRight: idx < 2 ? "1px solid var(--rule)" : "none", padding: "28px 24px 28px 0" }}>
              <div className="u-flex u-between" style={{ alignItems: "baseline" }}>
                <span className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.08em" }}>{it.no}</span>
                <span className="label">{it.kind}</span>
              </div>
              <h4 className="serif" style={{ fontSize: 26, lineHeight: 1.1, margin: "16px 0 4px", fontWeight: 400 }}>{it.title}</h4>
              <div className="label">{it.meta}</div>
              <p style={{ marginTop: 16, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.55 }}>{it.body}</p>
              <div style={{ marginTop: 22 }}>
                <a className="btn" href="#" style={{ height: 36, fontSize: 12 }}>Accéder <span className="arrow">→</span></a>
              </div>
            </div>
          ))}
        </div>

        {/* press strip */}
        <div style={{ marginTop: 64, borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)", padding: "20px 0" }}>
          <div className="grid12 u-baseline">
            <span className="label" style={{ gridColumn: "span 2" }}>Presse</span>
            <span className="serif" style={{ gridColumn: "span 8", fontSize: 22, fontStyle: "italic" }}>
              «&nbsp;WordPress Headless : comment les PME peuvent moderniser leur site sans tout reconstruire.&nbsp;»
            </span>
            <span className="mono" style={{ gridColumn: "span 2", textAlign: "right", fontSize: 11, color: "var(--muted)", letterSpacing: "0.08em" }}>
              LE FIGARO<br/>05 / 2026
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 06 — Contact ---------- */
function Contact() {
  return (
    <section className="s" id="contact" style={{ background: "var(--ink)", color: "var(--paper)" }}>
      <div className="container">
        <div className="sec-head" style={{ marginBottom: 64 }}>
          <div className="sec-no" style={{ color: "var(--accent)" }}>№ 06</div>
          <h2 className="sec-title" style={{ color: "var(--paper)" }}>
            <em style={{ fontStyle: "italic" }}>Démarrer.</em> Un échange. Une réponse en 24&nbsp;h.
          </h2>
          <div className="sec-meta" style={{ color: "rgba(241,237,228,0.5)" }}>Coordonnées · Fig. 06</div>
        </div>

        <div className="grid12" style={{ borderTop: "1px solid rgba(241,237,228,0.18)", paddingTop: 32 }}>
          <div style={{ gridColumn: "span 5" }}>
            <div className="label" style={{ color: "rgba(241,237,228,0.6)" }}>Contact direct</div>
            <a href="mailto:agathe@next-impact.digital" className="serif" style={{ display: "block", fontSize: 44, lineHeight: 1.05, margin: "16px 0 6px", letterSpacing: "-0.01em" }}>
              agathe@next-impact.digital
            </a>
            <a href="tel:0673981638" className="mono" style={{ fontSize: 18, letterSpacing: "0.04em" }}>+33 (0)6 73 98 16 38</a>
            <div style={{ marginTop: 32 }}>
              <a className="btn primary" href="#" style={{ background: "var(--accent)", borderColor: "var(--accent)", color: "var(--paper)" }}>
                <span className="dot" style={{ background: "var(--paper)" }}></span>
                Démarrer le diagnostic
                <span className="arrow">→</span>
              </a>
            </div>
          </div>

          <div style={{ gridColumn: "span 3" }}>
            <div className="label" style={{ color: "rgba(241,237,228,0.6)" }}>Adresse</div>
            <p className="serif" style={{ fontSize: 20, lineHeight: 1.35, margin: "16px 0 0" }}>
              EI Agathe Karinthi-Martin<br/>
              4 rue du centre<br/>
              15400 Trizac, Cantal · FR
            </p>
            <p className="mono" style={{ marginTop: 16, fontSize: 11, color: "rgba(241,237,228,0.5)", letterSpacing: "0.08em" }}>
              45°16′34″N · 02°37′22″E
            </p>
          </div>

          <div style={{ gridColumn: "span 4" }}>
            <div className="label" style={{ color: "rgba(241,237,228,0.6)" }}>Mentions</div>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(241,237,228,0.75)", margin: "16px 0 0" }}>
              Prestataire <span className="mono" style={{ color: "var(--accent)" }}>TIH</span> &mdash; Travailleur Indépendant Handicapé.
              Attestation OETH disponible : votre projet peut financer une partie de l'obligation d'emploi
              de votre entreprise.
            </p>
            <a href="#" className="annot" style={{ marginTop: 18, color: "var(--paper)" }}><span className="bar" style={{ background: "rgba(241,237,228,0.6)" }}></span> EN SAVOIR PLUS</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer / Colophon ---------- */
function Footer() {
  return (
    <footer style={{ background: "var(--ink)", color: "var(--paper)", borderTop: "1px solid rgba(241,237,228,0.18)" }}>
      <div className="container" style={{ padding: "32px 32px" }}>
        <div className="grid12 u-baseline" style={{ fontSize: 11, fontFamily: "var(--mono)", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(241,237,228,0.55)" }}>
          <span style={{ gridColumn: "span 3" }}>© 2026 NEXT IMPACT DIGITAL</span>
          <span style={{ gridColumn: "span 3" }}>ED. 2026 · VOL. 02 · BUILD 26.05.A</span>
          <span style={{ gridColumn: "span 3" }}>SET EN INSTRUMENT SERIF / GEIST</span>
          <span style={{ gridColumn: "span 3", textAlign: "right", color: "var(--accent)" }}>↑ HAUT DE PAGE</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, {
  Header, Hero, Capacites, Methode, EtudeDeCas, Ressources, Contact, Footer
});
