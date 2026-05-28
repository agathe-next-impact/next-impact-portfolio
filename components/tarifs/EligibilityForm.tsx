"use client";

import { FormEvent, useMemo, useRef, useState, useEffect } from "react";
import { ArrowRight, CheckCircle2, ChevronDown, Info, Mail, Phone, Video } from "lucide-react";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

const CALENDAR_LINK = "https://calendar.app.google/RwZqaabSR5aDMnk46";

type ProjectKey =
  | "vitrine"
  | "blog"
  | "ecommerce"
  | "webapp"
  | "mobile"
  | "platform";

type IntegrationKey = "none" | "crm" | "api" | "multi-source";
type ReasonKey = "performance" | "security" | "ecodesign" | "custom" | "business-logic";
type UsersKey = "none" | "accounts" | "mobile";

const projectLabels: Record<ProjectKey, { fr: string; en: string }> = {
  vitrine: {
    fr: "Site vitrine ou institutionnel",
    en: "Brochure or institutional site",
  },
  blog: { fr: "Blog ou site éditorial", en: "Blog or editorial site" },
  ecommerce: { fr: "Site e-commerce", en: "E-commerce site" },
  webapp: {
    fr: "Plateforme métier ou web app sur-mesure",
    en: "Business platform or custom web app",
  },
  mobile: {
    fr: "Outil mobile ou usage sur le terrain",
    en: "Mobile tool or on-site usage",
  },
  platform: {
    fr: "Multisite ou plateforme à fort volume",
    en: "Multisite or high-volume platform",
  },
};

const projectKeys: ProjectKey[] = [
  "vitrine",
  "blog",
  "ecommerce",
  "webapp",
  "mobile",
  "platform",
];

const integrationLabels: Record<IntegrationKey, { fr: string; en: string }> = {
  none: {
    fr: "Aucune intégration spécifique",
    en: "No specific integration",
  },
  crm: { fr: "CRM ou outil marketing", en: "CRM or marketing tool" },
  api: { fr: "API métier interne", en: "Internal business API" },
  "multi-source": {
    fr: "Plusieurs sources de contenu",
    en: "Multiple content sources",
  },
};

const integrationKeys: IntegrationKey[] = ["none", "crm", "api", "multi-source"];

const reasonLabels: Record<ReasonKey, { fr: string; en: string }> = {
  performance: {
    fr: "Performance et vitesse (SEO)",
    en: "Performance and speed (SEO)",
  },
  security: {
    fr: "Sécurité maximale (Inattaquable)",
    en: "Maximum security (rock-solid)",
  },
  ecodesign: {
    fr: "Éco-conception / Sobriété numérique",
    en: "Eco-design / digital sobriety",
  },
  custom: {
    fr: "Besoin de sur-mesure total",
    en: "Need for fully bespoke",
  },
  "business-logic": {
    fr: "Logique métier ou fonctionnalités avancées",
    en: "Business logic or advanced features",
  },
};

const reasonKeys: ReasonKey[] = ["performance", "security", "ecodesign", "custom", "business-logic"];

const usersLabels: Record<UsersKey, { fr: string; en: string }> = {
  none: {
    fr: "Non, juste de la consultation de contenu",
    en: "No, just content browsing",
  },
  accounts: {
    fr: "Oui, des comptes utilisateurs",
    en: "Yes, user accounts",
  },
  mobile: {
    fr: "Oui, une expérience mobile dédiée",
    en: "Yes, a dedicated mobile experience",
  },
};

const usersKeys: UsersKey[] = ["none", "accounts", "mobile"];

type TrafficBand = "low" | "medium" | "high";

type Result = {
  title: string;
  amount: string;
  message: string;
  highlight: string;
};

const RESULTS: Record<"mobileApp" | "webApp" | "headless" | "wpClassic", Record<Locale, Result>> = {
  mobileApp: {
    fr: {
      title: "Application mobile (Voie D)",
      amount: "Sur devis",
      message:
        "Votre projet appelle une application mobile PWA : Next.js + service worker, installable sur smartphone sans passer par les stores, fonctionnement hors-ligne et géolocalisation native si besoin.",
      highlight:
        "Une vraie app mobile, sans contrainte de store ni dépendance permanente à une connexion.",
    },
    en: {
      title: "Mobile application (Path D)",
      amount: "On quote",
      message:
        "Your project calls for a mobile PWA: Next.js + service worker, installable on smartphones without going through app stores, with offline operation and native geolocation if needed.",
      highlight:
        "A true mobile app, without app-store constraints or permanent-connection dependency.",
    },
  },
  webApp: {
    fr: {
      title: "Plateforme sur-mesure (Voie C)",
      amount: "Sur devis",
      message:
        "Votre projet appelle une web app sur-mesure : Next.js + base PostgreSQL serverless, comptes utilisateurs, logique métier propre et admin autonome conçu pour votre activité.",
      highlight:
        "Vous gardez la main sur vos contenus, vos données et vos utilisateurs — sans dépendance technique récurrente.",
    },
    en: {
      title: "Custom platform (Path C)",
      amount: "On quote",
      message:
        "Your project calls for a custom web app: Next.js + serverless PostgreSQL database, user accounts, dedicated business logic and an autonomous admin built for your activity.",
      highlight:
        "You stay in control of your content, data and users — without ongoing technical dependency.",
    },
  },
  headless: {
    fr: {
      title: "Headless — Site Headless (Voie B)",
      amount: "À partir de 4 000 €",
      message:
        "Votre projet a tout intérêt à passer en WordPress Headless + Next.js : performance front maximale, hydratation partielle, Core Web Vitals au vert et SEO préservé.",
      highlight:
        "Le bon compromis entre performance et coût pour un site à fort enjeu SEO ou éditorial.",
    },
    en: {
      title: "Headless — Headless site (Path B)",
      amount: "From €4,000",
      message:
        "Your project will benefit from Headless WordPress + Next.js: maximum front-end performance, partial hydration, green Core Web Vitals and preserved SEO.",
      highlight:
        "The right trade-off between performance and cost for a site with strong SEO or editorial stakes.",
    },
  },
  wpClassic: {
    fr: {
      title: "Classique — WordPress (Voie A)",
      amount: "À partir de 2 250 €",
      message:
        "Un WordPress classique optimisé suffit largement à votre projet : thème custom moderne, sécurité durcie, mise en ligne rapide. Coût maîtrisé, autonomie totale via l'admin WordPress.",
      highlight: "Vous gardez l'admin que vous connaissez, je modernise tout le reste.",
    },
    en: {
      title: "Classic — WordPress (Path A)",
      amount: "From €2,250",
      message:
        "An optimized classic WordPress is enough for your project: modern custom theme, hardened security, quick to ship. Controlled cost, full autonomy via the WordPress admin.",
      highlight: "You keep the admin you know, I modernize everything else.",
    },
  },
};

export default function EligibilityForm() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const [name, setName] = useState("");
  const [projectType, setProjectType] = useState<ProjectKey>("vitrine");
  const [projectOpen, setProjectOpen] = useState(false);
  const projectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (projectRef.current && !projectRef.current.contains(e.target as Node)) {
        setProjectOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  const [traffic, setTraffic] = useState<TrafficBand>("low");
  const [needsCustomApi, setNeedsCustomApi] = useState(false);
  const [selectedIntegrations, setSelectedIntegrations] = useState<IntegrationKey[]>([]);
  const [selectedReasons, setSelectedReasons] = useState<ReasonKey[]>([]);
  const [users, setUsers] = useState<UsersKey>("none");
  const [result, setResult] = useState<Result | null>(null);

  const wantsBusinessLogic = useMemo(
    () => selectedReasons.includes("business-logic") || selectedReasons.includes("custom"),
    [selectedReasons]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Voie D — Application mobile : usage terrain ou expérience mobile dédiée
    if (projectType === "mobile" || users === "mobile") {
      setResult(RESULTS.mobileApp[locale] ?? RESULTS.mobileApp.fr);
      return;
    }

    // Voie C — Web app sur-mesure : plateforme métier, logique métier, comptes utilisateurs
    if (
      projectType === "webapp" ||
      users === "accounts" ||
      wantsBusinessLogic
    ) {
      setResult(RESULTS.webApp[locale] ?? RESULTS.webApp.fr);
      return;
    }

    // Voie B — Site Headless WordPress + Next.js : SEO/éditorial, trafic moyen, API
    if (
      projectType === "platform" ||
      traffic === "high" ||
      traffic === "medium" ||
      needsCustomApi ||
      projectType === "blog" ||
      projectType === "ecommerce"
    ) {
      setResult(RESULTS.headless[locale] ?? RESULTS.headless.fr);
      return;
    }

    // Voie A — Classique / WordPress : site vitrine, petit trafic, sans intégration
    setResult(RESULTS.wpClassic[locale] ?? RESULTS.wpClassic.fr);
  };

  function toggle<T>(value: T, setter: React.Dispatch<React.SetStateAction<T[]>>) {
    setter((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  }

  const trafficBands: { key: TrafficBand; title: string; subtitle: string }[] = isEn
    ? [
        { key: "low", title: "Less than 10k visits / month", subtitle: "Likely Classic" },
        { key: "medium", title: "10k to 100k / month", subtitle: "Likely Headless" },
        { key: "high", title: "More than 100k / month", subtitle: "Likely Web app" },
      ]
    : [
        { key: "low", title: "Moins de 10k visites / mois", subtitle: "Plutôt Classique" },
        { key: "medium", title: "10k à 100k / mois", subtitle: "Plutôt Headless" },
        { key: "high", title: "Plus de 100k / mois", subtitle: "Plutôt Web app" },
      ];

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          border: "1px solid var(--rule)",
          background: "var(--paper)",
          padding: "32px",
        }}
      >
        {/* Header row */}
        <div style={{ marginBottom: 24 }}>
          <p
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--muted-color)",
              margin: 0,
            }}
          >
            {isEn ? "Project diagnostic" : "Diagnostic projet"}
          </p>
          <p
            style={{
              fontFamily: "var(--sans)",
              fontSize: 14,
              color: "var(--ink-2)",
              marginTop: 8,
              marginBottom: 0,
            }}
          >
            {isEn
              ? "Identify in 2 minutes the right path for your project: classic WordPress site, Headless WordPress + Next.js site, custom web app or mobile application."
              : "Identifiez en 2 minutes la voie adaptée à votre projet : site WordPress classique, site Headless WordPress + Next.js, web app sur-mesure ou application mobile."}
          </p>
        </div>

        <form style={{ display: "flex", flexDirection: "column", gap: 32 }} onSubmit={handleSubmit}>
          {/* Étape 1 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: 13,
                  color: "var(--muted-color)",
                }}
              >
                {isEn ? "Your organization name" : "Nom de votre organisation"}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isEn ? "e.g. Atelier Martin & Co" : "Ex : Atelier Martin & Co"}
                style={{
                  border: "1px solid var(--rule)",
                  background: "var(--paper)",
                  color: "var(--ink)",
                  fontFamily: "var(--sans)",
                  fontSize: 14,
                  padding: "10px 12px",
                  width: "100%",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: 13,
                  color: "var(--muted-color)",
                }}
              >
                {isEn ? "Project type" : "Type de projet"}
              </label>
              <div ref={projectRef} style={{ position: "relative" }}>
                <button
                  type="button"
                  onClick={() => setProjectOpen((prev) => !prev)}
                  style={{
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "space-between",
                    border: "1px solid var(--rule)",
                    background: "var(--paper)",
                    color: "var(--ink)",
                    padding: "10px 12px",
                    cursor: "pointer",
                    fontFamily: "var(--sans)",
                    fontSize: 14,
                    textAlign: "left",
                    boxSizing: "border-box",
                  }}
                >
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {projectLabels[projectType][locale] ?? projectLabels[projectType].fr}
                  </span>
                  <ChevronDown
                    size={16}
                    style={{
                      flexShrink: 0,
                      marginLeft: 8,
                      transform: projectOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.15s",
                    }}
                  />
                </button>
                {projectOpen && (
                  <ul
                    style={{
                      position: "absolute",
                      zIndex: 50,
                      width: "100%",
                      border: "1px solid var(--rule)",
                      background: "var(--paper)",
                      margin: 0,
                      padding: 0,
                      listStyle: "none",
                      top: "100%",
                    }}
                  >
                    {projectKeys.map((key) => (
                      <li key={key}>
                        <button
                          type="button"
                          onClick={() => { setProjectType(key); setProjectOpen(false); }}
                          style={{
                            display: "block",
                            width: "100%",
                            padding: "10px 12px",
                            fontFamily: "var(--sans)",
                            fontSize: 13,
                            textAlign: "left",
                            cursor: "pointer",
                            background: projectType === key ? "var(--paper-2)" : "var(--paper)",
                            borderTop: "none",
                            borderRight: "none",
                            borderBottom: "none",
                            borderLeft: projectType === key ? "3px solid var(--accent-color)" : "3px solid transparent",
                            color: "var(--ink)",
                          }}
                          onMouseEnter={(e) => {
                            if (projectType !== key) {
                              (e.currentTarget as HTMLButtonElement).style.background = "var(--paper-2)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (projectType !== key) {
                              (e.currentTarget as HTMLButtonElement).style.background = "var(--paper)";
                            }
                          }}
                        >
                          {projectLabels[key][locale] ?? projectLabels[key].fr}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Étape 2 — Volumétrie */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <p
              style={{
                fontFamily: "var(--sans)",
                fontSize: 13,
                color: "var(--muted-color)",
                margin: 0,
              }}
            >
              {isEn ? "Expected traffic volume" : "Volumétrie de trafic attendue"}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {trafficBands.map((band) => (
                <label
                  key={band.key}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    border: traffic === band.key ? "1px solid var(--rule)" : "1px solid var(--rule)",
                    borderLeft: traffic === band.key ? "3px solid var(--accent-color)" : "1px solid var(--rule)",
                    background: traffic === band.key ? "var(--paper-2)" : "var(--paper)",
                    padding: "12px 16px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name="traffic"
                    value={band.key}
                    checked={traffic === band.key}
                    onChange={() => setTraffic(band.key)}
                    style={{ accentColor: "var(--accent-color)", marginTop: 2 }}
                  />
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--sans)",
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--ink)",
                        margin: 0,
                      }}
                    >
                      {band.title}
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--muted-color)",
                        fontFamily: "var(--sans)",
                        margin: 0,
                        marginTop: 2,
                      }}
                    >
                      {band.subtitle}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Étape 3 — Intégrations */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <p
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: 13,
                  color: "var(--muted-color)",
                  margin: 0,
                }}
              >
                {isEn
                  ? "Do you need custom APIs or integrations?"
                  : "Avez-vous besoin d'API ou d'intégrations sur-mesure ?"}
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  type="button"
                  onClick={() => setNeedsCustomApi(true)}
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    fontFamily: "var(--sans)",
                    fontSize: 14,
                    cursor: "pointer",
                    background: needsCustomApi ? "var(--ink)" : "var(--paper)",
                    color: needsCustomApi ? "var(--paper)" : "var(--ink)",
                    border: needsCustomApi ? "1px solid var(--ink)" : "1px solid var(--rule)",
                  }}
                >
                  {isEn ? "Yes" : "Oui"}
                </button>
                <button
                  type="button"
                  onClick={() => setNeedsCustomApi(false)}
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    fontFamily: "var(--sans)",
                    fontSize: 14,
                    cursor: "pointer",
                    background: !needsCustomApi ? "var(--ink)" : "var(--paper)",
                    color: !needsCustomApi ? "var(--paper)" : "var(--ink)",
                    border: !needsCustomApi ? "1px solid var(--ink)" : "1px solid var(--rule)",
                  }}
                >
                  {isEn ? "No" : "Non"}
                </button>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <p
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: 13,
                  color: "var(--muted-color)",
                  margin: 0,
                }}
              >
                {isEn ? "Existing integrations" : "Intégrations existantes"}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {integrationKeys.map((key) => (
                  <label
                    key={key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      border: "1px solid var(--rule)",
                      borderLeft: selectedIntegrations.includes(key)
                        ? "3px solid var(--accent-color)"
                        : "1px solid var(--rule)",
                      background: selectedIntegrations.includes(key) ? "var(--paper-2)" : "var(--paper)",
                      padding: "10px 12px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIntegrations.includes(key)}
                      onChange={() => toggle(key, setSelectedIntegrations)}
                      style={{ accentColor: "var(--accent-color)" }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--sans)",
                        fontSize: 13,
                        color: "var(--ink-2)",
                      }}
                    >
                      {integrationLabels[key][locale] ?? integrationLabels[key].fr}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Étape 4 — Comptes utilisateurs / mobile */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <p
              style={{
                fontFamily: "var(--sans)",
                fontSize: 13,
                color: "var(--muted-color)",
                margin: 0,
              }}
            >
              {isEn
                ? "Will your users need accounts or a dedicated mobile experience?"
                : "Vos utilisateurs auront-ils besoin d'un compte ou d'une expérience mobile dédiée ?"}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {usersKeys.map((key) => (
                <label
                  key={key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    border: "1px solid var(--rule)",
                    borderLeft: users === key
                      ? "3px solid var(--accent-color)"
                      : "1px solid var(--rule)",
                    background: users === key ? "var(--paper-2)" : "var(--paper)",
                    padding: "12px 16px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name="users"
                    value={key}
                    checked={users === key}
                    onChange={() => setUsers(key)}
                    style={{ accentColor: "var(--accent-color)" }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--sans)",
                      fontSize: 14,
                      fontWeight: users === key ? 600 : 400,
                      color: "var(--ink)",
                    }}
                  >
                    {usersLabels[key][locale] ?? usersLabels[key].fr}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Étape 5 — Raison de modernisation */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <p
              style={{
                fontFamily: "var(--sans)",
                fontSize: 13,
                color: "var(--muted-color)",
                margin: 0,
              }}
            >
              {isEn
                ? "Why are you considering modernization?"
                : "Pourquoi envisagez-vous une modernisation ?"}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {reasonKeys.map((key) => (
                <label
                  key={key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    border: "1px solid var(--rule)",
                    borderLeft: selectedReasons.includes(key)
                      ? "3px solid var(--accent-color)"
                      : "1px solid var(--rule)",
                    background: selectedReasons.includes(key) ? "var(--paper-2)" : "var(--paper)",
                    padding: "10px 12px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedReasons.includes(key)}
                    onChange={() => toggle(key, setSelectedReasons)}
                    style={{ accentColor: "var(--accent-color)" }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--sans)",
                      fontSize: 13,
                      color: "var(--ink-2)",
                    }}
                  >
                    {reasonLabels[key][locale] ?? reasonLabels[key].fr}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit row */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              type="submit"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                border: "1px solid var(--ink)",
                background: "var(--ink)",
                color: "var(--paper)",
                fontFamily: "var(--mono)",
                fontSize: 11,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "12px 24px",
                cursor: "pointer",
              }}
            >
              {isEn ? "Show my path" : "Voir ma voie"}
              <ArrowRight size={14} />
            </button>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "var(--sans)",
                fontSize: 12,
                color: "var(--muted-color)",
              }}
            >
              <Info size={14} />
              <span>
                {isEn
                  ? "Diagnostic based on project type, traffic and usage needs."
                  : "Diagnostic basé sur le type de projet, le trafic et les besoins d'usage."}
              </span>
            </div>
          </div>
        </form>

        {/* Result block */}
        {result && (
          <div
            style={{
              border: "1px solid var(--rule)",
              borderLeft: "3px solid #2a7a2a",
              background: "var(--paper-2)",
              padding: 24,
              marginTop: 32,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <CheckCircle2 size={16} style={{ color: "#2a7a2a" }} />
              <p
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#2a7a2a",
                  margin: 0,
                }}
              >
                {isEn ? "Recommended path" : "Voie recommandée"}
              </p>
            </div>
            <h4
              style={{
                fontFamily: "var(--serif)",
                fontSize: 22,
                color: "var(--ink)",
                margin: 0,
                marginBottom: 12,
              }}
            >
              {result.title}
            </h4>
            <p
              style={{
                fontFamily: "var(--sans)",
                fontSize: 14,
                color: "var(--ink-2)",
                margin: 0,
                marginBottom: 12,
              }}
            >
              {result.message}
            </p>
            <p
              style={{
                fontFamily: "var(--mono)",
                fontSize: 24,
                color: "var(--accent-color)",
                margin: 0,
                marginBottom: 12,
              }}
            >
              {result.amount}
            </p>
            <p
              style={{
                fontFamily: "var(--sans)",
                fontSize: 13,
                fontStyle: "italic",
                color: "var(--ink)",
                margin: 0,
              }}
            >
              {result.highlight}
            </p>
            {name && (
              <p
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: 13,
                  color: "var(--muted-color)",
                  margin: 0,
                  marginTop: 8,
                }}
              >
                {isEn ? `File: ${name}` : `Dossier : ${name}`}
              </p>
            )}

            {/* CTAs de contact */}
            <div
              style={{
                borderTop: "1px solid var(--rule)",
                paddingTop: 16,
                marginTop: 16,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <p
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--muted-color)",
                  margin: 0,
                }}
              >
                {isEn ? "Discuss this recommendation" : "Discutons de cette recommandation"}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
                <a
                  href="https://calendar.app.google/Cw7TGQBzeZ1szKU86"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    border: "1px solid var(--accent-color)",
                    background: "var(--accent-color)",
                    color: "var(--paper)",
                    fontFamily: "var(--mono)",
                    fontSize: 11,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    padding: "10px 18px",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                >
                  <Video size={14} />
                  {isEn ? "Book a 15-min discovery call" : "Planifier un appel découverte (15 min)"}
                </a>
                <a
                  href="mailto:agathe@next-impact.digital"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    color: "var(--ink)",
                    fontFamily: "var(--sans)",
                    fontSize: 13,
                    textDecoration: "none",
                    padding: "10px 0",
                  }}
                >
                  <Mail size={14} />
                  {isEn ? "Describe my project in writing" : "Décrire mon projet par écrit"}
                </a>
                <a
                  href="tel:0673981638"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    color: "var(--ink)",
                    fontFamily: "var(--sans)",
                    fontSize: 13,
                    textDecoration: "none",
                    padding: "10px 0",
                  }}
                >
                  <Phone size={14} />
                  06 73 98 16 38
                </a>
              </div>
              <p
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: 12,
                  color: "var(--muted-color)",
                  margin: 0,
                }}
              >
                {isEn
                  ? "Reply within 24h · Personalized quote within 48h · Free, no strings attached"
                  : "Réponse sous 24h · Devis personnalisé sous 48h · Gratuit, sans engagement"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
