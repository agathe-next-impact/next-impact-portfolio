"use client";

import { FormEvent, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calculator,
  Clock,
  CheckCircle2,
  Info,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

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

  return (
    <div className="w-full">
      <div className="bg-darkblue/50 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur">
        <div className="flex items-start gap-3 mb-6">
          <Calculator className="h-6 w-6 text-lightyellow shrink-0 mt-1" />
          <div>
            <p className="text-sm uppercase tracking-[0.25rem] text-white/50 font-googletexte">
              {isEn ? "Budget & timeline estimator" : "Estimateur budget & délai"}
            </p>
            <p className="text-white font-googletexte mt-2">
              {isEn
                ? "Get an indicative budget range and lead time for your web project. Estimate based on real Next Impact projects."
                : "Obtenez une fourchette de budget et un délai indicatif pour votre projet web. Estimation basée sur les projets réels Next Impact."}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm text-white/70 font-googletexte">
              {isEn ? "Type of project" : "Type de projet"} <span className="text-coral">*</span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(Object.keys(projectLabels) as ProjectType[]).map((key) => {
                const label = isEn ? projectLabels[key].en : projectLabels[key].fr;
                const selected = projectType === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setProjectType(key)}
                    className={`rounded-xl border px-4 py-3 text-left transition ${
                      selected
                        ? "border-lightyellow bg-lightyellow/10 text-white"
                        : "border-white/10 bg-white/5 text-white/80 hover:border-white/30"
                    }`}
                  >
                    <span className="font-googletitre">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm text-white/70 font-googletexte">
                {isEn ? "User roles" : "Rôles utilisateurs"}
              </label>
              <select
                value={roles}
                onChange={(e) => setRoles(e.target.value as Roles)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-lightyellow focus:outline-none"
              >
                {(Object.keys(roleLabels) as Roles[]).map((key) => (
                  <option key={key} value={key} className="bg-darkblue">
                    {isEn ? roleLabels[key].en : roleLabels[key].fr}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/70 font-googletexte">
                {isEn ? "Data model" : "Modèle de données"}
              </label>
              <select
                value={entities}
                onChange={(e) => setEntities(e.target.value as Entities)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-lightyellow focus:outline-none"
              >
                {(Object.keys(entitiesLabels) as Entities[]).map((key) => (
                  <option key={key} value={key} className="bg-darkblue">
                    {isEn ? entitiesLabels[key].en : entitiesLabels[key].fr}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/70 font-googletexte">
                {isEn ? "Third-party integrations" : "Intégrations tierces"}
              </label>
              <select
                value={integrations}
                onChange={(e) => setIntegrations(e.target.value as Integrations)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-lightyellow focus:outline-none"
              >
                {(Object.keys(integrationsLabels) as Integrations[]).map((key) => (
                  <option key={key} value={key} className="bg-darkblue">
                    {isEn ? integrationsLabels[key].en : integrationsLabels[key].fr}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/70 font-googletexte">
                {isEn ? "Design approach" : "Approche design"}
              </label>
              <select
                value={design}
                onChange={(e) => setDesign(e.target.value as Design)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-lightyellow focus:outline-none"
              >
                {(Object.keys(designLabels) as Design[]).map((key) => (
                  <option key={key} value={key} className="bg-darkblue">
                    {isEn ? designLabels[key].en : designLabels[key].fr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button
            type="submit"
            className="rounded-full bg-lightyellow text-darkblue hover:bg-lightyellow/90 font-googletitre font-semibold px-6 py-3"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {isEn ? "Get my estimate" : "Voir mon estimation"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>

        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-8 rounded-2xl border border-lightyellow/30 bg-lightyellow/10 p-6 md:p-8 flex flex-col gap-5"
          >
            <div className="flex items-center gap-2 text-lightyellow">
              <CheckCircle2 className="h-5 w-5" />
              <p className="text-sm uppercase tracking-widest font-googletitre">
                {isEn ? "Estimate" : "Estimation"}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-darkblue/40 p-5">
                <p className="text-sm text-white/60 font-googletexte uppercase tracking-widest mb-2">
                  {isEn ? "Budget range" : "Fourchette budget"}
                </p>
                <p className="text-3xl md:text-4xl font-googletitre font-medium text-lightyellow">
                  {formatEuro(estimate.budgetMin, locale)} – {formatEuro(estimate.budgetMax, locale)}
                </p>
                <p className="text-xs text-white/50 font-googletexte mt-1">{isEn ? "Net before tax" : "HT"}</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-darkblue/40 p-5">
                <p className="text-sm text-white/60 font-googletexte uppercase tracking-widest mb-2">
                  <Clock className="inline h-3 w-3 mr-1" />
                  {isEn ? "Lead time" : "Délai indicatif"}
                </p>
                <p className="text-3xl md:text-4xl font-googletitre font-medium text-coral">
                  {estimate.weeksMin} – {estimate.weeksMax} {isEn ? "weeks" : "semaines"}
                </p>
                <p className="text-xs text-white/50 font-googletexte mt-1">
                  {isEn ? "From kick-off to launch" : "Du lancement à la mise en ligne"}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-lightyellow/20 bg-lightyellow/5 p-5">
              <p className="text-sm uppercase tracking-widest text-lightyellow font-googletitre mb-2">
                {isEn ? "Recommendation" : "Recommandation"}
              </p>
              <p className="text-white/90 font-googletexte leading-relaxed">{estimate.recommendation}</p>
            </div>

            <div className="rounded-xl border border-extralightblue/20 bg-extralightblue/5 p-4 flex items-start gap-3">
              <Info className="h-4 w-4 text-extralightblue shrink-0 mt-0.5" />
              <p className="text-xs text-white/60 font-googletexte leading-relaxed">
                {isEn
                  ? "Indicative estimate based on real Next Impact projects. A precise scoping (1-3 days) is needed to lock in budget and timeline. OETH benefit: TIH-eligible companies can deduct up to 30% of labor cost from their AGEFIPH contribution."
                  : "Estimation indicative basée sur les projets réels Next Impact. Un cadrage précis (1-3 jours) est nécessaire pour figer budget et délai. Avantage OETH : les entreprises éligibles TIH peuvent déduire jusqu'à 30 % du coût main-d'œuvre de leur contribution AGEFIPH."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href="/contact" className="flex-1">
                <Button className="w-full rounded-full bg-lightyellow text-darkblue hover:bg-lightyellow/90 font-googletitre font-semibold">
                  {isEn ? "Discuss this estimate" : "Discuter de cette estimation"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/outils/simulateur-agefiph" className="flex-1">
                <Button className="w-full rounded-full border border-white/30 bg-transparent text-white hover:bg-white/10 font-googletitre font-semibold">
                  {isEn ? "Calculate AGEFIPH deduction" : "Calculer la déduction AGEFIPH"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
