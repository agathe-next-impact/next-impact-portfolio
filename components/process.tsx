"use client";

import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

const PHASES_FR = [
  { title: "Analyse & Cadrage",       duration: "1 semaine",   description: "Audit de l'existant et définition des besoins" },
  { title: "Conception & Validation", duration: "2 semaines",  description: "Wireframes, maquettes et validation" },
  { title: "Développement",           duration: "3–4 semaines",description: "Développement et intégration" },
  { title: "Optimisation & Tests",    duration: "1 semaine",   description: "Performance, SEO et formation équipes" },
  { title: "Mise en Ligne",           duration: "1 semaine",   description: "Migration, tests et support" },
]

const PHASES_EN = [
  { title: "Analysis & Scoping",      duration: "1 week",    description: "Audit of the existing site and definition of needs" },
  { title: "Design & Validation",     duration: "2 weeks",   description: "Wireframes, mockups and sign-off" },
  { title: "Development",             duration: "3–4 weeks", description: "Development and integration" },
  { title: "Optimization & Testing",  duration: "1 week",    description: "Performance, SEO and team training" },
  { title: "Going Live",              duration: "1 week",    description: "Migration, testing and support" },
]

export default function Process() {
  const locale = useLocale() as Locale;
  const phases = locale === "en" ? PHASES_EN : PHASES_FR;
  const heading = locale === "en" ? "Project in 5 steps" : "Projet en 5 étapes"

  return (
    <div>
      <h3 className="ni-serif" style={{ fontSize: "clamp(22px, 2.5vw, 36px)", marginBottom: 32, color: "var(--ink)" }}>
        {heading}
      </h3>
      <ol className="steps">
        {phases.map((phase) => (
          <li key={phase.title}>
            <h4>{phase.title}</h4>
            <p>
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  color: "var(--accent-color)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  display: "inline-block",
                  marginRight: 12,
                }}
              >
                {phase.duration}
              </span>
              {phase.description}
            </p>
          </li>
        ))}
      </ol>
    </div>
  )
}
