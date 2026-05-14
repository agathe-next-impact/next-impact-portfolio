"use client";

import { FormEvent, useMemo, useRef, useState, useEffect } from "react";
import { ArrowRight, CheckCircle2, ChevronDown, Info, Mail, Phone, ScreenShareIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

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
      title: "Équilibre — Site Headless (Voie B)",
      amount: "À partir de 4 000 €",
      message:
        "Votre projet a tout intérêt à passer en WordPress Headless + Next.js : performance front maximale, hydratation partielle, Core Web Vitals au vert et SEO préservé.",
      highlight:
        "Le bon compromis entre performance et coût pour un site à fort enjeu SEO ou éditorial.",
    },
    en: {
      title: "Balance — Headless site (Path B)",
      amount: "From €4,000",
      message:
        "Your project will benefit from Headless WordPress + Next.js: maximum front-end performance, partial hydration, green Core Web Vitals and preserved SEO.",
      highlight:
        "The right trade-off between performance and cost for a site with strong SEO or editorial stakes.",
    },
  },
  wpClassic: {
    fr: {
      title: "Solidaire — WordPress classique (Voie A)",
      amount: "À partir de 2 250 €",
      message:
        "Un WordPress classique optimisé suffit largement à votre projet : thème custom moderne, sécurité durcie, mise en ligne rapide. Coût maîtrisé, autonomie totale via l'admin WordPress.",
      highlight: "Vous gardez l'admin que vous connaissez, je modernise tout le reste.",
    },
    en: {
      title: "Solidarity — Classic WordPress (Path A)",
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

    // Voie A — Solidaire / WordPress classique : site vitrine, petit trafic, sans intégration
    setResult(RESULTS.wpClassic[locale] ?? RESULTS.wpClassic.fr);
  };

  function toggle<T>(value: T, setter: React.Dispatch<React.SetStateAction<T[]>>) {
    setter((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  }

  const trafficBands: { key: TrafficBand; title: string; subtitle: string }[] = isEn
    ? [
        { key: "low", title: "Less than 10k visits / month", subtitle: "Likely Solidarity" },
        { key: "medium", title: "10k to 100k / month", subtitle: "Likely Balance" },
        { key: "high", title: "More than 100k / month", subtitle: "Likely Support" },
      ]
    : [
        { key: "low", title: "Moins de 10k visites / mois", subtitle: "Plutôt Solidaire" },
        { key: "medium", title: "10k à 100k / mois", subtitle: "Plutôt Équilibre" },
        { key: "high", title: "Plus de 100k / mois", subtitle: "Plutôt Soutien" },
      ];

  return (
    <div className="w-full">
      <div className="bg-darkblue/50 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur">
        <div className="flex items-start gap-3 mb-6">
          <Sparkles className="h-6 w-6 text-lightyellow" />
          <div>
            <p className="text-sm uppercase tracking-[0.25rem] text-white/50 font-googletexte">
              {isEn ? "Project diagnostic" : "Diagnostic projet"}
            </p>
            <p className="text-white font-googletexte mt-2">
              {isEn
                ? "Identify in 2 minutes the right path for your project: classic WordPress site, Headless WordPress + Next.js site, custom web app or mobile application."
                : "Identifiez en 2 minutes la voie adaptée à votre projet : site WordPress classique, site Headless WordPress + Next.js, web app sur-mesure ou application mobile."}
            </p>
          </div>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Étape 1 */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm text-white/70 font-googletexte">
                {isEn ? "Your organization name" : "Nom de votre organisation"}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isEn ? "e.g. Atelier Martin & Co" : "Ex : Atelier Martin & Co"}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-lightyellow focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white/70 font-googletexte">
                {isEn ? "Project type" : "Type de projet"}
              </label>
              <div ref={projectRef} className="relative">
                <button
                  type="button"
                  onClick={() => setProjectOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-white transition focus:border-lightyellow focus:outline-none"
                >
                  <span className="truncate text-white/60">
                    {projectLabels[projectType][locale] ?? projectLabels[projectType].fr}
                  </span>
                  <ChevronDown className={`ml-2 h-4 w-4 shrink-0 text-white/50 transition-transform ${projectOpen ? "rotate-180" : ""}`} />
                </button>
                {projectOpen && (
                  <ul className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-darkblue/95 backdrop-blur-md ">
                    {projectKeys.map((key) => (
                      <li key={key}>
                        <button
                          type="button"
                          onClick={() => { setProjectType(key); setProjectOpen(false); }}
                          className={`w-full px-4 py-3 text-left text-sm font-googletexte transition hover:bg-lightyellow/10 hover:text-white ${
                            projectType === key ? "bg-lightyellow/10 text-lightyellow" : "text-white/80"
                          }`}
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
          <div className="space-y-3">
            <p className="text-sm text-white/70 font-googletexte">
              {isEn ? "Expected traffic volume" : "Volumétrie de trafic attendue"}
            </p>
            <div className="grid gap-3 md:grid-cols-3">
              {trafficBands.map((band) => (
                <label
                  key={band.key}
                  className={`flex items-start gap-3 rounded-xl border px-4 py-3 cursor-pointer transition ${
                    traffic === band.key ? "border-lightyellow bg-lightyellow/10" : "border-white/10 bg-white/5"
                  }`}
                >
                  <input
                    type="radio"
                    name="traffic"
                    value={band.key}
                    checked={traffic === band.key}
                    onChange={() => setTraffic(band.key)}
                    className="mt-1 accent-lightyellow"
                  />
                  <div>
                    <p className="text-white font-googletitre text-base">{band.title}</p>
                    <p className="text-sm text-white/60 font-googletexte">{band.subtitle}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Étape 3 — Intégrations */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm text-white/70 font-googletexte">
                {isEn
                  ? "Do you need custom APIs or integrations?"
                  : "Avez-vous besoin d'API ou d'intégrations sur-mesure ?"}
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setNeedsCustomApi(true)}
                  className={`flex-1 rounded-full border px-4 py-2 font-googletexte transition ${
                    needsCustomApi ? "border-lightyellow bg-lightyellow/10 text-white" : "border-white/10 text-white/70"
                  }`}
                >
                  {isEn ? "Yes" : "Oui"}
                </button>
                <button
                  type="button"
                  onClick={() => setNeedsCustomApi(false)}
                  className={`flex-1 rounded-full border px-4 py-2 font-googletexte transition ${
                    !needsCustomApi ? "border-lightyellow bg-lightyellow/10 text-white" : "border-white/10 text-white/70"
                  }`}
                >
                  {isEn ? "No" : "Non"}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-white/70 font-googletexte">
                {isEn ? "Existing integrations" : "Intégrations existantes"}
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {integrationKeys.map((key) => (
                  <label
                    key={key}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 cursor-pointer transition ${
                      selectedIntegrations.includes(key)
                        ? "border-lightyellow bg-lightyellow/10"
                        : "border-white/10 bg-white/5"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIntegrations.includes(key)}
                      onChange={() => toggle(key, setSelectedIntegrations)}
                      className="accent-lightyellow"
                    />
                    <span className="text-white/80 font-googletexte text-sm">
                      {integrationLabels[key][locale] ?? integrationLabels[key].fr}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Étape 4 — Comptes utilisateurs / mobile (nouvelle question §5.7) */}
          <div className="space-y-2">
            <p className="text-sm text-white/70 font-googletexte">
              {isEn
                ? "Will your users need accounts or a dedicated mobile experience?"
                : "Vos utilisateurs auront-ils besoin d'un compte ou d'une expérience mobile dédiée ?"}
            </p>
            <div className="grid gap-2 md:grid-cols-3">
              {usersKeys.map((key) => (
                <label
                  key={key}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 cursor-pointer transition ${
                    users === key
                      ? "border-lightyellow bg-lightyellow/10"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <input
                    type="radio"
                    name="users"
                    value={key}
                    checked={users === key}
                    onChange={() => setUsers(key)}
                    className="accent-lightyellow"
                  />
                  <span className="text-white/80 font-googletexte text-sm">
                    {usersLabels[key][locale] ?? usersLabels[key].fr}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Étape 5 — Raison de modernisation */}
          <div className="space-y-2">
            <p className="text-sm text-white/70 font-googletexte">
              {isEn
                ? "Why are you considering modernization?"
                : "Pourquoi envisagez-vous une modernisation ?"}
            </p>
            <div className="grid gap-2 md:grid-cols-2">
              {reasonKeys.map((key) => (
                <label
                  key={key}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 cursor-pointer transition ${
                    selectedReasons.includes(key)
                      ? "border-lightyellow bg-lightyellow/10"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedReasons.includes(key)}
                    onChange={() => toggle(key, setSelectedReasons)}
                    className="accent-lightyellow"
                  />
                  <span className="text-white/80 font-googletexte text-sm">
                    {reasonLabels[key][locale] ?? reasonLabels[key].fr}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" className="rounded-full bg-lightyellow text-darkblue hover:bg-lightyellow/90 font-googletitre font-semibold">
              {isEn ? "Show my path" : "Voir ma voie"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 text-white/60 font-googletexte text-sm">
              <Info className="h-4 w-4" />
              <span className="text-white/60">
                {isEn
                  ? "Diagnostic based on project type, traffic and usage needs."
                  : "Diagnostic basé sur le type de projet, le trafic et les besoins d'usage."}
              </span>
            </div>
          </div>
        </form>

        {result && (
          <div className="mt-8 rounded-2xl border border-lightyellow/30 bg-lightyellow/10 p-6 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-lightyellow">
              <CheckCircle2 className="h-5 w-5" />
              <p className="text-sm uppercase tracking-widest font-googletexte text-extralightblue">
                {isEn ? "Recommended path" : "Voie recommandée"}
              </p>
            </div>
            <h4 className="text-2xl font-googletitre text-white">{result.title}</h4>
            <p className="text-lg font-googletexte text-white/90">{result.message}</p>
            <p className="text-3xl font-googletitre text-lightyellow">{result.amount}</p>
            <p className="text-white/70 font-googletexte">{result.highlight}</p>
            {name && (
              <p className="text-white/60 text-sm font-googletexte">
                {isEn ? `File: ${name}` : `Dossier : ${name}`}
              </p>
            )}
            <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-3">
              <p className="text-sm uppercase tracking-widest font-googletexte text-white/60">
                {isEn ? "Discuss this recommendation" : "Discutons de cette recommandation"}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="https://calendar.app.google/Cw7TGQBzeZ1szKU86"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-coral text-darkblue font-googletitre font-semibold px-5 py-2.5 hover:bg-coral/80 transition"
                >
                  <ScreenShareIcon className="h-5 w-5" />
                  {isEn ? "Book a video call" : "Échanger en visio"}
                </a>
                <a
                  href="mailto:agathe@next-impact.digital"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 text-white font-googletexte px-5 py-2.5 hover:bg-white/10 transition"
                >
                  <Mail className="h-4 w-4 text-coral" />
                  agathe@next-impact.digital
                </a>
                <a
                  href="tel:0673981638"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 text-white font-googletexte px-5 py-2.5 hover:bg-white/10 transition"
                >
                  <Phone className="h-4 w-4 text-lightyellow" />
                  06 73 98 16 38
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
