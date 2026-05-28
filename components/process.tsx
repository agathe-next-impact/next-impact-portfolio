"use client";

import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

type Phase = {
  title: string;
  duration: string;
  description: string;
  deliverable: string;
};

const PHASES_FR: Phase[] = [
  {
    title: "Analyse & cadrage",
    duration: "1 semaine",
    description: "Audit de l'existant, entretien de découverte, définition des besoins fonctionnels et techniques. Rédaction des specs et arbitrage stack (Classique / Headless / Web App).",
    deliverable: "Document de cadrage + recommandation stack",
  },
  {
    title: "Conception & validation",
    duration: "1–2 semaines",
    description: "Wireframes, maquettes haute-fidélité, charte graphique si nécessaire. Validation itérative avant tout développement.",
    deliverable: "Maquettes validées + charte typographique",
  },
  {
    title: "Développement",
    duration: "3–5 semaines",
    description: "Intégration Next.js ou thème WordPress custom, configuration du backend, développement des fonctionnalités métier. Déploiement continu en staging pour suivi client.",
    deliverable: "Site fonctionnel en environnement staging",
  },
  {
    title: "Optimisation & tests",
    duration: "1 semaine",
    description: "Audit Core Web Vitals (cible > 90), SEO technique, accessibilité WCAG, tests multi-navigateurs et responsive. Formation à l'administration si besoin.",
    deliverable: "Rapport Core Web Vitals + checklist SEO",
  },
  {
    title: "Mise en ligne & suivi",
    duration: "1 semaine",
    description: "Déploiement en production, migration DNS, tests de non-régression, redirections 301. Support post-lancement inclus pendant 30 jours.",
    deliverable: "Site en ligne + accès livrés + 30 j de support",
  },
];

const PHASES_EN: Phase[] = [
  {
    title: "Analysis & scoping",
    duration: "1 week",
    description: "Audit of the existing site, discovery call, functional and technical requirements. Specs writing and stack recommendation (Classic / Headless / Web App).",
    deliverable: "Scoping document + stack recommendation",
  },
  {
    title: "Design & validation",
    duration: "1–2 weeks",
    description: "Wireframes, high-fidelity mockups, brand guidelines if needed. Iterative sign-off before any development begins.",
    deliverable: "Validated mockups + type guidelines",
  },
  {
    title: "Development",
    duration: "3–5 weeks",
    description: "Next.js integration or custom WordPress theme, backend configuration, business logic development. Continuous staging deployment for client review.",
    deliverable: "Functional site in staging environment",
  },
  {
    title: "Optimization & testing",
    duration: "1 week",
    description: "Core Web Vitals audit (target > 90), technical SEO, WCAG accessibility, cross-browser and responsive testing. Admin training if required.",
    deliverable: "Core Web Vitals report + SEO checklist",
  },
  {
    title: "Go-live & follow-up",
    duration: "1 week",
    description: "Production deployment, DNS migration, regression testing, 301 redirects. Post-launch support included for 30 days.",
    deliverable: "Live site + credentials delivered + 30-day support",
  },
];

export default function Process() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const phases = isEn ? PHASES_EN : PHASES_FR;

  return (
    <>
      <div className="sec-head">
        <div className="sec-no">№ —</div>
        <h2 className="ni-serif" style={{ fontSize: "clamp(22px, 2.5vw, 36px)", lineHeight: 1.1, margin: 0 }}>
          {isEn
            ? <>From brief to <em style={{ color: "var(--accent-color)" }}>go-live</em></>
            : <>Du brief à la <em style={{ color: "var(--accent-color)" }}>mise en ligne</em></>}
        </h2>
        <div className="sec-meta">
          {isEn ? "Method · 5 phases" : "Méthode · 5 phases"}
        </div>
      </div>

      {/* Steps */}
      <div style={{ borderTop: "1px solid var(--rule)" }}>
        {phases.map((phase, i) => (
          <div
            key={phase.title}
            style={{
              display: "grid",
              gridTemplateColumns: "56px 1fr auto",
              gap: "0 24px",
              padding: "28px 0",
              borderBottom: "1px solid var(--rule)",
              alignItems: "start",
            }}
          >
            {/* Counter */}
            <div style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              letterSpacing: "0.08em",
              color: "var(--accent-color)",
              paddingTop: 3,
            }}>
              {String(i + 1).padStart(2, "0")}
            </div>

            {/* Main content */}
            <div>
              <h3 style={{
                fontFamily: "var(--serif)",
                fontSize: 18,
                margin: "0 0 8px",
                color: "var(--ink)",
                fontWeight: 400,
              }}>
                {phase.title}
              </h3>
              <p style={{
                fontSize: 13,
                color: "var(--ink-2)",
                lineHeight: 1.65,
                margin: "0 0 12px",
                maxWidth: 520,
              }}>
                {phase.description}
              </p>
              <p style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: "0.06em",
                color: "var(--muted-color)",
                margin: 0,
              }}>
                ↳ {phase.deliverable}
              </p>
            </div>

            {/* Duration */}
            <div style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--accent-color)",
              paddingTop: 3,
              whiteSpace: "nowrap",
            }}>
              {phase.duration}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 20,
        gap: 24,
        flexWrap: "wrap",
      }}>
        <p style={{
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontSize: 14,
          color: "var(--ink-2)",
          margin: 0,
        }}>
          {isEn
            ? "6 to 10 weeks total, depending on stack and complexity."
            : "6 à 10 semaines au total, selon la stack et la complexité."}
        </p>
        <span style={{
          fontFamily: "var(--mono)",
          fontSize: 9,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--muted-color)",
          whiteSpace: "nowrap",
        }}>
          {isEn ? "Classic: 6 w · Headless: 8 w · Web app: 10 w" : "Classique : 6 s · Headless : 8 s · Web app : 10 s"}
        </span>
      </div>
    </>
  );
}
