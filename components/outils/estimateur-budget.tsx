"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  ArrowRight,
  Clock,
  CheckCircle2,
  Info,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import NewsletterModal from "@/components/ui/newsletter-modal";

type ProjectType = "site-classique" | "site-headless" | "web-app" | "app-mobile";
type Roles = "1" | "2-3" | "4+";
type Entities = "small" | "medium" | "large";
type Integrations = "none" | "standard" | "complex";
type Design = "system" | "light" | "signature";

interface Estimate {
  budgetMin: number;
  budgetMax: number;
  weeksMin: number;
  weeksMax: number;
  recommendation: string;
}

const PROJECT_BASE: Record<ProjectType, { budget: [number, number]; weeks: [number, number] }> = {
  "site-classique": { budget: [2_250, 4_500], weeks: [3, 5] },
  "site-headless": { budget: [4_000, 12_000], weeks: [4, 8] },
  "web-app": { budget: [15_000, 35_000], weeks: [6, 12] },
  "app-mobile": { budget: [8_000, 25_000], weeks: [4, 10] },
};

function formatEuro(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "en" ? "en-US" : "fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function EstimateurBudget() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";

  const [projectType, setProjectType] = useState<ProjectType>("site-headless");
  const [roles, setRoles] = useState<Roles>("1");
  const [entities, setEntities] = useState<Entities>("small");
  const [integrations, setIntegrations] = useState<Integrations>("none");
  const [design, setDesign] = useState<Design>("light");
  const [submitted, setSubmitted] = useState(false);

  const estimate = useMemo<Estimate>(() => {
    const base = PROJECT_BASE[projectType];
    let bMin = base.budget[0];
    let bMax = base.budget[1];
    let wMin = base.weeks[0];
    let wMax = base.weeks[1];

    // Multiplicateur rôles
    const roleMult = roles === "1" ? 1 : roles === "2-3" ? 1.25 : 1.6;
    bMin *= roleMult;
    bMax *= roleMult;
    if (roles !== "1") {
      wMin += 1;
      wMax += 2;
    }

    // Multiplicateur entités métier
    if (entities === "medium") {
      bMin *= 1.2;
      bMax *= 1.3;
      wMin += 1;
      wMax += 2;
    } else if (entities === "large") {
      bMin *= 1.5;
      bMax *= 1.8;
      wMin += 2;
      wMax += 4;
    }

    // Multiplicateur intégrations
    if (integrations === "standard") {
      bMin *= 1.1;
      bMax *= 1.2;
      wMin += 1;
      wMax += 2;
    } else if (integrations === "complex") {
      bMin *= 1.3;
      bMax *= 1.5;
      wMin += 2;
      wMax += 4;
    }

    // Multiplicateur design
    if (design === "system") {
      bMin *= 0.9;
      bMax *= 0.95;
    } else if (design === "signature") {
      bMin *= 1.15;
      bMax *= 1.25;
      wMin += 1;
      wMax += 2;
    }

    // Recommandation textuelle
    const totalMid = (bMin + bMax) / 2;
    let recommendation = "";
    if (projectType === "site-classique" && totalMid < 4_000) {
      recommendation = isEn
        ? "Your project fits the Classic tier — well-served by a modern WordPress site."
        : "Votre projet entre dans le forfait Classique — bien servi par un site WordPress moderne.";
    } else if (projectType === "site-headless" && totalMid < 12_000) {
      recommendation = isEn
        ? "Your project fits the Headless tier — Headless WordPress + Next.js for high performance."
        : "Votre projet entre dans le forfait Headless — WordPress Headless + Next.js pour une performance maximale.";
    } else if (projectType === "web-app" || totalMid >= 20_000) {
      recommendation = isEn
        ? "Your project calls for a custom web app — Next.js + PostgreSQL with a tailored admin."
        : "Votre projet appelle une web app sur-mesure — Next.js + PostgreSQL avec admin sur-mesure.";
    } else if (projectType === "app-mobile") {
      recommendation = isEn
        ? "Your project fits a Mobile PWA — installable, geolocated, offline-capable. Next.js + service worker."
        : "Votre projet correspond à une PWA mobile — installable, géolocalisée, fonctionnelle hors-ligne. Next.js + service worker.";
    } else {
      recommendation = isEn
        ? "Your project sits in a hybrid zone — let's discuss the right combination of site and web app."
        : "Votre projet est dans une zone hybride — discutons du bon mix entre site et web app.";
    }

    return {
      budgetMin: Math.round(bMin / 250) * 250,
      budgetMax: Math.round(bMax / 250) * 250,
      weeksMin: Math.round(wMin),
      weeksMax: Math.round(wMax),
      recommendation,
    };
  }, [projectType, roles, entities, integrations, design, isEn]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const projectLabels: Record<ProjectType, { fr: string; en: string }> = {
    "site-classique": { fr: "Site WordPress classique", en: "Classic WordPress site" },
    "site-headless": { fr: "Site Headless WordPress + Next.js", en: "Headless WordPress + Next.js site" },
    "web-app": { fr: "Web app sur-mesure", en: "Custom web app" },
    "app-mobile": { fr: "Application mobile (PWA)", en: "Mobile application (PWA)" },
  };

  const roleLabels: Record<Roles, { fr: string; en: string }> = {
    "1": { fr: "1 rôle (visiteurs simples)", en: "1 role (simple visitors)" },
    "2-3": { fr: "2 à 3 rôles", en: "2 to 3 roles" },
    "4+": { fr: "4 rôles ou plus, permissions fines", en: "4+ roles, fine permissions" },
  };

  const entitiesLabels: Record<Entities, { fr: string; en: string }> = {
    small: { fr: "Petit (< 5 entités)", en: "Small (< 5 entities)" },
    medium: { fr: "Moyen (5-10 entités)", en: "Medium (5-10 entities)" },
    large: { fr: "Grand (10+ entités, relations complexes)", en: "Large (10+ entities, complex relations)" },
  };

  const integrationsLabels: Record<Integrations, { fr: string; en: string }> = {
    none: { fr: "Aucune intégration tierce", en: "No third-party integration" },
    standard: { fr: "Intégrations standard (Stripe, email, analytics)", en: "Standard integrations (Stripe, email, analytics)" },
    complex: { fr: "Intégrations complexes (CRM, ERP, APIs internes)", en: "Complex integrations (CRM, ERP, internal APIs)" },
  };

  const designLabels: Record<Design, { fr: string; en: string }> = {
    system: { fr: "Design système éprouvé (shadcn / Tailwind)", en: "Proven design system (shadcn / Tailwind)" },
    light: { fr: "Design personnalisé léger", en: "Light custom design" },
    signature: { fr: "Design signature distinctif", en: "Distinctive signature design" },
  };

  const selectStyle: React.CSSProperties = {
    border: "1px solid var(--rule)",
    background: "var(--paper)",
    color: "var(--ink)",
    padding: "10px 14px",
    width: "100%",
    borderRadius: 0,
    outline: "none",
    fontFamily: "var(--sans)",
    fontSize: 14,
    appearance: "auto",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--mono)",
    fontSize: 9,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "var(--muted-color)",
    display: "block",
    marginBottom: 6,
  };

  return (
    <div style={{ width: "100%", border: "1px solid var(--rule)" }}>
      {/* Header */}
      <div
        style={{
          padding: "24px 32px",
          borderBottom: "1px solid var(--rule)",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <span
          style={{
            display: "inline-block",
            fontFamily: "var(--mono)",
            fontSize: 9,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--muted-color)",
            border: "1px solid var(--rule)",
            padding: "3px 8px",
            alignSelf: "flex-start",
          }}
        >
          {isEn ? "Budget & timeline estimator" : "Estimateur budget & délai"}
        </span>
        <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: "var(--ink-2)", margin: 0, lineHeight: 1.6 }}>
          {isEn
            ? "Get an indicative budget range and lead time for your web project. Estimate based on real Next Impact projects."
            : "Obtenez une fourchette de budget et un délai indicatif pour votre projet web. Estimation basée sur les projets réels Next Impact."}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div style={{ padding: "32px", display: "flex", flexDirection: "column", gap: 28 }}>

          {/* Project type */}
          <div>
            <span style={labelStyle}>
              {isEn ? "Type of project" : "Type de projet"}
            </span>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 1,
                border: "1px solid var(--rule)",
              }}
            >
              {(Object.keys(projectLabels) as ProjectType[]).map((key) => {
                const label = isEn ? projectLabels[key].en : projectLabels[key].fr;
                const selected = projectType === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setProjectType(key)}
                    style={{
                      background: selected ? "var(--paper-2)" : "var(--paper)",
                      border: "none",
                      borderLeft: selected ? "3px solid var(--accent-color)" : "3px solid transparent",
                      padding: "12px 16px",
                      textAlign: "left",
                      cursor: "pointer",
                      fontFamily: "var(--sans)",
                      fontSize: 13,
                      color: selected ? "var(--ink)" : "var(--ink-2)",
                      fontWeight: selected ? 600 : 400,
                      outline: "none",
                      borderBottom: "1px solid var(--rule)",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selects grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <label style={labelStyle}>
                {isEn ? "User roles" : "Rôles utilisateurs"}
              </label>
              <select
                value={roles}
                onChange={(e) => setRoles(e.target.value as Roles)}
                style={selectStyle}
              >
                {(Object.keys(roleLabels) as Roles[]).map((key) => (
                  <option key={key} value={key}>
                    {isEn ? roleLabels[key].en : roleLabels[key].fr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>
                {isEn ? "Data model" : "Modèle de données"}
              </label>
              <select
                value={entities}
                onChange={(e) => setEntities(e.target.value as Entities)}
                style={selectStyle}
              >
                {(Object.keys(entitiesLabels) as Entities[]).map((key) => (
                  <option key={key} value={key}>
                    {isEn ? entitiesLabels[key].en : entitiesLabels[key].fr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>
                {isEn ? "Third-party integrations" : "Intégrations tierces"}
              </label>
              <select
                value={integrations}
                onChange={(e) => setIntegrations(e.target.value as Integrations)}
                style={selectStyle}
              >
                {(Object.keys(integrationsLabels) as Integrations[]).map((key) => (
                  <option key={key} value={key}>
                    {isEn ? integrationsLabels[key].en : integrationsLabels[key].fr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>
                {isEn ? "Design approach" : "Approche design"}
              </label>
              <select
                value={design}
                onChange={(e) => setDesign(e.target.value as Design)}
                style={selectStyle}
              >
                {(Object.keys(designLabels) as Design[]).map((key) => (
                  <option key={key} value={key}>
                    {isEn ? designLabels[key].en : designLabels[key].fr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit */}
          <div>
            <button type="submit" className="btn primary">
              {isEn ? "Get my estimate" : "Voir mon estimation"}
              <ArrowRight style={{ display: "inline", marginLeft: 8, width: 14, height: 14, verticalAlign: "middle" }} />
            </button>
          </div>
        </div>

        {/* Results section */}
        {submitted && (
          <div
            style={{
              borderTop: "1px solid var(--rule)",
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <NewsletterModal source="estimateur-budget" />
            {/* Result header */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <CheckCircle2
                style={{ width: 14, height: 14, color: "var(--accent-color)", flexShrink: 0 }}
              />
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 9,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--muted-color)",
                }}
              >
                {isEn ? "Estimate" : "Estimation"}
              </span>
            </div>

            {/* Stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {/* Budget card */}
              <div
                style={{
                  border: "1px solid var(--rule)",
                  background: "var(--paper-2)",
                  padding: 24,
                }}
              >
                <span style={labelStyle}>
                  {isEn ? "Budget range" : "Fourchette budget"}
                </span>
                <p
                  className="ni-serif"
                  style={{
                    fontSize: "clamp(28px, 3vw, 40px)",
                    color: "var(--ink)",
                    margin: "4px 0 2px",
                    lineHeight: 1.1,
                  }}
                >
                  {formatEuro(estimate.budgetMin, locale)} – {formatEuro(estimate.budgetMax, locale)}
                </p>
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 9,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--muted-color)",
                  }}
                >
                  {isEn ? "Net before tax" : "HT"}
                </span>
              </div>

              {/* Timeline card */}
              <div
                style={{
                  border: "1px solid var(--rule)",
                  background: "var(--paper-2)",
                  padding: 24,
                }}
              >
                <span style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 4 }}>
                  <Clock style={{ width: 10, height: 10, flexShrink: 0 }} />
                  {isEn ? "Lead time" : "Délai indicatif"}
                </span>
                <p
                  className="ni-serif"
                  style={{
                    fontSize: "clamp(28px, 3vw, 40px)",
                    color: "var(--ink)",
                    margin: "4px 0 2px",
                    lineHeight: 1.1,
                  }}
                >
                  {estimate.weeksMin} – {estimate.weeksMax}{" "}
                  <span style={{ fontSize: "0.5em", fontFamily: "var(--sans)", fontWeight: 400 }}>
                    {isEn ? "weeks" : "semaines"}
                  </span>
                </p>
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 9,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--muted-color)",
                  }}
                >
                  {isEn ? "From kick-off to launch" : "Du lancement à la mise en ligne"}
                </span>
              </div>
            </div>

            {/* Recommendation */}
            <div
              style={{
                border: "1px solid var(--rule)",
                background: "var(--paper-2)",
                padding: 24,
              }}
            >
              <span style={labelStyle}>
                {isEn ? "Recommendation" : "Recommandation"}
              </span>
              <p
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: 14,
                  color: "var(--ink-2)",
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {estimate.recommendation}
              </p>
            </div>

            {/* Info note */}
            <div
              style={{
                border: "1px solid var(--rule)",
                background: "var(--paper-2)",
                padding: "16px 20px",
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
              }}
            >
              <Info
                style={{ width: 14, height: 14, color: "var(--muted-color)", flexShrink: 0, marginTop: 1 }}
              />
              <p
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: 12,
                  color: "var(--muted-color)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {isEn
                  ? "Indicative estimate based on real Next Impact projects. A precise scoping (1-3 days) is needed to lock in budget and timeline. OETH benefit: TIH-eligible companies can deduct up to 30% of labor cost from their AGEFIPH contribution."
                  : "Estimation indicative basée sur les projets réels Next Impact. Un cadrage précis (1-3 jours) est nécessaire pour figer budget et délai. Avantage OETH : les entreprises éligibles TIH peuvent déduire jusqu'à 30 % du coût main-d'œuvre de leur contribution AGEFIPH."}
              </p>
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", gap: 12, paddingTop: 4, flexWrap: "wrap" }}>
              <Link href="/contact" style={{ flex: "1 1 auto" }}>
                <button type="button" className="btn primary" style={{ width: "100%" }}>
                  {isEn ? "Discuss this estimate" : "Discuter de cette estimation"}
                  <ArrowRight style={{ display: "inline", marginLeft: 8, width: 14, height: 14, verticalAlign: "middle" }} />
                </button>
              </Link>
              <Link href="/outils/simulateur-agefiph" style={{ flex: "1 1 auto" }}>
                <button type="button" className="btn" style={{ width: "100%" }}>
                  {isEn ? "Calculate AGEFIPH deduction" : "Calculer la déduction AGEFIPH"}
                  <ArrowRight style={{ display: "inline", marginLeft: 8, width: 14, height: 14, verticalAlign: "middle" }} />
                </button>
              </Link>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
