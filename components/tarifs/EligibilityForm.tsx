"use client";

import { FormEvent, useMemo, useRef, useState, useEffect } from "react";
import { ArrowRight, CheckCircle2, ChevronDown, Info, Mail, Phone, Video } from "lucide-react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { MeterBar } from "@/components/visuals/charts";
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

// Indice de complexité (présentation seule) : positionne la voie recommandée
// sur l'échelle A→D, matérialisé par la MeterBar du bloc résultat.
const PATH_METER: Record<"mobileApp" | "webApp" | "headless" | "wpClassic", { value: number; fr: string; en: string }> = {
  wpClassic: { value: 30, fr: "Voie A · périmètre maîtrisé", en: "Path A · contained scope" },
  headless: { value: 60, fr: "Voie B · performance & SEO", en: "Path B · performance & SEO" },
  webApp: { value: 85, fr: "Voie C · sur-mesure", en: "Path C · fully bespoke" },
  mobileApp: { value: 100, fr: "Voie D · app mobile", en: "Path D · mobile app" },
};

const fieldClass =
  "w-full bg-jet border border-dark-gray px-3 py-2.5 font-inter-tight text-sm text-foreground placeholder:text-mid-gray outline-none transition-colors focus-visible:ring-1 focus-visible:ring-accent-secondary focus-visible:border-accent-secondary";

const labelClass = "block font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray";

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

  // Retrouve la voie correspondant au résultat affiché (présentation : MeterBar).
  const resultMeter = useMemo(() => {
    if (!result) return null;
    const entry = (Object.keys(RESULTS) as Array<keyof typeof RESULTS>).find(
      (key) => RESULTS[key][locale]?.title === result.title || RESULTS[key].fr.title === result.title
    );
    return entry ? PATH_METER[entry] : null;
  }, [result, locale]);

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

  // Classe d'une cellule sélectionnable (radio / checkbox) : liseré accent quand active.
  const choiceClass = (active: boolean) =>
    cn(
      "flex cursor-pointer items-center gap-2.5 border bg-jet px-3 py-2.5 transition-colors",
      active
        ? "border-accent-secondary"
        : "border-dark-gray hover:border-mid-gray"
    );

  return (
    <div className="w-full">
      <div className="border border-dark-gray bg-obsidian p-6 md:p-8">
        {/* Header row */}
        <div className="mb-6">
          <p className={labelClass}>{isEn ? "Project diagnostic" : "Diagnostic projet"}</p>
          <p className="mt-2 font-inter-tight text-sm leading-relaxed text-mid-gray">
            {isEn
              ? "Identify in 2 minutes the right path for your project: classic WordPress site, Headless WordPress + Next.js site, custom web app or mobile application."
              : "Identifiez en 2 minutes la voie adaptée à votre projet : site WordPress classique, site Headless WordPress + Next.js, web app sur-mesure ou application mobile."}
          </p>
        </div>

        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          {/* Étape 1 */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="elig-name" className={labelClass}>
                {isEn ? "Your organization name" : "Nom de votre organisation"}
              </label>
              <input
                id="elig-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isEn ? "e.g. Atelier Martin & Co" : "Ex : Atelier Martin & Co"}
                className={fieldClass}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className={labelClass}>
                {isEn ? "Project type" : "Type de projet"}
              </label>
              <div ref={projectRef} className="relative">
                <button
                  type="button"
                  onClick={() => setProjectOpen((prev) => !prev)}
                  aria-haspopup="listbox"
                  aria-expanded={projectOpen}
                  className={cn(
                    fieldClass,
                    "flex items-center justify-between text-left focus-visible:ring-1"
                  )}
                >
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                    {projectLabels[projectType][locale] ?? projectLabels[projectType].fr}
                  </span>
                  <ChevronDown
                    size={16}
                    className={cn(
                      "ml-2 shrink-0 text-mid-gray transition-transform duration-150",
                      projectOpen && "rotate-180"
                    )}
                  />
                </button>
                {projectOpen && (
                  <ul
                    role="listbox"
                    className="absolute top-full z-50 m-0 w-full list-none border border-dark-gray bg-jet p-0 shadow-lg"
                  >
                    {projectKeys.map((key) => {
                      const active = projectType === key;
                      return (
                        <li key={key} role="option" aria-selected={active}>
                          <button
                            type="button"
                            onClick={() => { setProjectType(key); setProjectOpen(false); }}
                            className={cn(
                              "block w-full border-l-2 px-3 py-2.5 text-left font-inter-tight text-[13px] text-foreground transition-colors hover:bg-obsidian",
                              active
                                ? "border-accent-secondary bg-obsidian"
                                : "border-transparent"
                            )}
                          >
                            {projectLabels[key][locale] ?? projectLabels[key].fr}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Étape 2 — Volumétrie */}
          <div className="flex flex-col gap-3">
            <p className={labelClass}>
              {isEn ? "Expected traffic volume" : "Volumétrie de trafic attendue"}
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {trafficBands.map((band) => (
                <label
                  key={band.key}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 border bg-jet px-4 py-3 transition-colors",
                    traffic === band.key
                      ? "border-accent-secondary"
                      : "border-dark-gray hover:border-mid-gray"
                  )}
                >
                  <input
                    type="radio"
                    name="traffic"
                    value={band.key}
                    checked={traffic === band.key}
                    onChange={() => setTraffic(band.key)}
                    className="mt-1 accent-accent-secondary"
                  />
                  <div>
                    <p className="font-inter-tight text-sm font-medium text-foreground">
                      {band.title}
                    </p>
                    <p className="mt-0.5 font-mono text-[11px] text-mid-gray">
                      {band.subtitle}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Étape 3 — Intégrations */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <p className={labelClass}>
                {isEn
                  ? "Do you need custom APIs or integrations?"
                  : "Avez-vous besoin d'API ou d'intégrations sur-mesure ?"}
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setNeedsCustomApi(true)}
                  aria-pressed={needsCustomApi}
                  className={cn(
                    "flex-1 border px-3 py-2.5 font-inter-tight text-sm transition-colors",
                    needsCustomApi
                      ? "border-accent-secondary bg-jet text-foreground"
                      : "border-dark-gray bg-jet text-mid-gray hover:border-mid-gray hover:text-foreground"
                  )}
                >
                  {isEn ? "Yes" : "Oui"}
                </button>
                <button
                  type="button"
                  onClick={() => setNeedsCustomApi(false)}
                  aria-pressed={!needsCustomApi}
                  className={cn(
                    "flex-1 border px-3 py-2.5 font-inter-tight text-sm transition-colors",
                    !needsCustomApi
                      ? "border-accent-secondary bg-jet text-foreground"
                      : "border-dark-gray bg-jet text-mid-gray hover:border-mid-gray hover:text-foreground"
                  )}
                >
                  {isEn ? "No" : "Non"}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className={labelClass}>
                {isEn ? "Existing integrations" : "Intégrations existantes"}
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {integrationKeys.map((key) => (
                  <label key={key} className={choiceClass(selectedIntegrations.includes(key))}>
                    <input
                      type="checkbox"
                      checked={selectedIntegrations.includes(key)}
                      onChange={() => toggle(key, setSelectedIntegrations)}
                      className="accent-accent-secondary"
                    />
                    <span className="font-inter-tight text-[13px] text-mid-gray">
                      {integrationLabels[key][locale] ?? integrationLabels[key].fr}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Étape 4 — Comptes utilisateurs / mobile */}
          <div className="flex flex-col gap-2">
            <p className={labelClass}>
              {isEn
                ? "Will your users need accounts or a dedicated mobile experience?"
                : "Vos utilisateurs auront-ils besoin d'un compte ou d'une expérience mobile dédiée ?"}
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {usersKeys.map((key) => {
                const active = users === key;
                return (
                  <label
                    key={key}
                    className={cn(
                      "flex cursor-pointer items-center gap-2.5 border bg-jet px-4 py-3 transition-colors",
                      active
                        ? "border-accent-secondary"
                        : "border-dark-gray hover:border-mid-gray"
                    )}
                  >
                    <input
                      type="radio"
                      name="users"
                      value={key}
                      checked={active}
                      onChange={() => setUsers(key)}
                      className="accent-accent-secondary"
                    />
                    <span
                      className={cn(
                        "font-inter-tight text-sm text-foreground",
                        active ? "font-medium" : "font-normal"
                      )}
                    >
                      {usersLabels[key][locale] ?? usersLabels[key].fr}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Étape 5 — Raison de modernisation */}
          <div className="flex flex-col gap-2">
            <p className={labelClass}>
              {isEn
                ? "Why are you considering modernization?"
                : "Pourquoi envisagez-vous une modernisation ?"}
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {reasonKeys.map((key) => (
                <label key={key} className={choiceClass(selectedReasons.includes(key))}>
                  <input
                    type="checkbox"
                    checked={selectedReasons.includes(key)}
                    onChange={() => toggle(key, setSelectedReasons)}
                    className="accent-accent-secondary"
                  />
                  <span className="font-inter-tight text-[13px] text-mid-gray">
                    {reasonLabels[key][locale] ?? reasonLabels[key].fr}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit row */}
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <button
              type="submit"
              className="inline-flex items-center gap-2 border border-accent-secondary bg-accent-secondary px-6 py-3 font-mono text-[11px] uppercase tracking-[0.08em] text-obsidian transition-colors hover:bg-accent-secondary/85 [&_svg]:transition-transform hover:[&_svg]:translate-x-0.5"
            >
              {isEn ? "Show my path" : "Voir ma voie"}
              <ArrowRight size={14} />
            </button>
            <div className="flex items-center gap-1.5 font-inter-tight text-xs text-mid-gray">
              <Info size={14} className="shrink-0" />
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
          <div className="mt-8 border border-dark-gray border-l-2 border-l-accent-secondary bg-jet p-6">
            <div className="mb-3 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-accent-secondary" />
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-accent-secondary">
                {isEn ? "Recommended path" : "Voie recommandée"}
              </p>
            </div>
            <h4 className="mb-3 font-sans text-xl font-light tracking-tight text-foreground md:text-2xl">
              {result.title}
            </h4>
            <p className="mb-3 font-inter-tight text-sm leading-relaxed text-mid-gray">
              {result.message}
            </p>
            <p className="mb-4 font-mono text-2xl font-light text-accent-secondary">
              {result.amount}
            </p>

            {/* Positionnement de la voie sur l'échelle A→D */}
            {resultMeter && (
              <div className="mb-4">
                <MeterBar
                  value={resultMeter.value}
                  label={isEn ? "Project complexity" : "Complexité du projet"}
                  sublabel={isEn ? resultMeter.en : resultMeter.fr}
                />
              </div>
            )}

            <p className="font-inter-tight text-[13px] italic text-foreground">
              {result.highlight}
            </p>
            {name && (
              <p className="mt-2 font-mono text-xs text-mid-gray">
                {isEn ? `File: ${name}` : `Dossier : ${name}`}
              </p>
            )}

            {/* CTAs de contact */}
            <div className="mt-4 flex flex-col gap-3 border-t border-dark-gray pt-4">
              <p className={labelClass}>
                {isEn ? "Discuss this recommendation" : "Discutons de cette recommandation"}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="https://calendar.app.google/Cw7TGQBzeZ1szKU86"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-accent-secondary bg-accent-secondary px-[18px] py-2.5 font-mono text-[11px] uppercase tracking-[0.08em] text-obsidian transition-colors hover:bg-accent-secondary/85"
                >
                  <Video size={14} />
                  {isEn ? "Book a 15-min discovery call" : "Planifier un appel découverte (15 min)"}
                </a>
                <a
                  href="mailto:agathe@next-impact.digital"
                  className="inline-flex items-center gap-2 py-2.5 font-inter-tight text-[13px] text-foreground transition-colors hover:text-accent-secondary"
                >
                  <Mail size={14} />
                  {isEn ? "Describe my project in writing" : "Décrire mon projet par écrit"}
                </a>
                <a
                  href="tel:0673981638"
                  className="inline-flex items-center gap-2 py-2.5 font-inter-tight text-[13px] text-foreground transition-colors hover:text-accent-secondary"
                >
                  <Phone size={14} />
                  06 73 98 16 38
                </a>
              </div>
              <p className="font-inter-tight text-xs text-mid-gray">
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
