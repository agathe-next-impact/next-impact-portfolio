"use client";

import { FormEvent, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  Info,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

function formatEuro(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "en" ? "en-US" : "fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function TcoSaasVsSurMesure() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";

  // Inputs SaaS
  const [saasMonthly, setSaasMonthly] = useState(800);
  const [saasUsers, setSaasUsers] = useState(20);
  const [saasUserGrowth, setSaasUserGrowth] = useState(30); // % par an
  const [workaroundDays, setWorkaroundDays] = useState(15); // jours / an
  const [internalRate, setInternalRate] = useState(500); // €/jour

  // Inputs sur-mesure
  const [customInitial, setCustomInitial] = useState(40000);
  const [customMaintenance, setCustomMaintenance] = useState(8000); // €/an

  // Horizon
  const [years, setYears] = useState(3);

  const [submitted, setSubmitted] = useState(false);

  const calc = useMemo(() => {
    // SaaS cost on 3 years (scaled with user growth)
    let saasTotal = 0;
    let currentMonthly = saasMonthly;
    for (let y = 0; y < years; y++) {
      saasTotal += currentMonthly * 12;
      // Scale: si les coûts SaaS suivent la croissance utilisateur
      currentMonthly *= 1 + saasUserGrowth / 100;
    }
    const workaroundCostYear = workaroundDays * internalRate;
    const workaroundTotal = workaroundCostYear * years;
    const saasTrueCost = saasTotal + workaroundTotal;

    // Custom cost
    const customTotal = customInitial + customMaintenance * years;

    // Difference
    const diff = saasTrueCost - customTotal;
    const breakEvenYears = customInitial / Math.max(saasMonthly * 12 + workaroundCostYear - customMaintenance, 1);

    let recommendation: { fr: string; en: string };
    if (diff > customInitial * 0.5) {
      recommendation = {
        fr: "Migration sur-mesure très favorable. Vous économisez significativement sur l'horizon retenu, et la position s'améliore au-delà.",
        en: "Custom migration very favorable. You save significantly over the chosen horizon, and the position improves beyond.",
      };
    } else if (diff > 0) {
      recommendation = {
        fr: "Migration sur-mesure modérément favorable. Le ROI s'installe sur la durée — à confirmer par un cadrage précis.",
        en: "Custom migration moderately favorable. ROI builds over time — to confirm with precise scoping.",
      };
    } else if (diff > -customInitial * 0.2) {
      recommendation = {
        fr: "Zone grise. Le SaaS reste compétitif financièrement sur cet horizon. Question à se poser : autres facteurs (dépendance, spécificité, croissance future) ?",
        en: "Gray zone. SaaS remains financially competitive over this horizon. To ask: other factors (dependency, specificity, future growth)?",
      };
    } else {
      recommendation = {
        fr: "Migration non recommandée sur cet horizon. SaaS reste largement plus rentable. À réévaluer dans 2-3 ans si la situation change.",
        en: "Migration not recommended over this horizon. SaaS remains significantly more profitable. To reassess in 2-3 years if the situation changes.",
      };
    }

    return {
      saasTotal,
      workaroundTotal,
      saasTrueCost,
      customTotal,
      diff,
      breakEvenYears: Math.max(0.1, breakEvenYears),
      recommendation,
    };
  }, [
    saasMonthly,
    saasUserGrowth,
    workaroundDays,
    internalRate,
    customInitial,
    customMaintenance,
    years,
  ]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full">
      <div className="bg-darkblue/50 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur">
        <div className="flex items-start gap-3 mb-6">
          <Calculator className="h-6 w-6 text-extralightblue shrink-0 mt-1" />
          <div>
            <p className="text-sm uppercase tracking-[0.25rem] text-white/50 font-googletexte">
              {isEn ? "SaaS vs custom TCO calculator" : "Calculateur TCO SaaS vs sur-mesure"}
            </p>
            <p className="text-white font-googletexte mt-2">
              {isEn
                ? "Compare the 3-year cost of staying on your current SaaS vs migrating to a custom web app. Includes workaround time."
                : "Comparez le coût sur 3 ans entre rester sur votre SaaS actuel et migrer vers une web app sur-mesure. Inclut le temps perdu en contournements."}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SaaS actuel */}
          <div className="rounded-xl border border-coral/20 bg-coral/5 p-5 space-y-4">
            <p className="text-sm uppercase tracking-widest text-coral font-googletitre">
              {isEn ? "Current SaaS" : "SaaS actuel"}
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <NumberField
                label={isEn ? "Monthly SaaS cost (€)" : "Coût SaaS mensuel (€)"}
                value={saasMonthly}
                onChange={setSaasMonthly}
                min={0}
                step={50}
              />
              <NumberField
                label={isEn ? "Annual user growth (%)" : "Croissance utilisateurs/an (%)"}
                value={saasUserGrowth}
                onChange={setSaasUserGrowth}
                min={0}
                max={200}
                step={5}
              />
              <NumberField
                label={isEn ? "Workaround days / year" : "Jours de contournement / an"}
                value={workaroundDays}
                onChange={setWorkaroundDays}
                min={0}
                max={365}
                step={1}
              />
              <NumberField
                label={isEn ? "Internal daily rate (€)" : "TJM interne (€)"}
                value={internalRate}
                onChange={setInternalRate}
                min={100}
                max={2000}
                step={50}
              />
            </div>
          </div>

          {/* Sur-mesure */}
          <div className="rounded-xl border border-lightyellow/20 bg-lightyellow/5 p-5 space-y-4">
            <p className="text-sm uppercase tracking-widest text-lightyellow font-googletitre">
              {isEn ? "Custom alternative" : "Alternative sur-mesure"}
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <NumberField
                label={isEn ? "Initial cost (€)" : "Coût initial (€)"}
                value={customInitial}
                onChange={setCustomInitial}
                min={5_000}
                max={500_000}
                step={1_000}
              />
              <NumberField
                label={isEn ? "Annual maintenance (€)" : "Maintenance annuelle (€)"}
                value={customMaintenance}
                onChange={setCustomMaintenance}
                min={0}
                max={100_000}
                step={500}
              />
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <NumberField
              label={isEn ? "Horizon (years)" : "Horizon (années)"}
              value={years}
              onChange={setYears}
              min={1}
              max={10}
              step={1}
            />
          </div>

          <Button
            type="submit"
            className="rounded-full bg-extralightblue text-darkblue hover:bg-extralightblue/90 font-googletitre font-semibold px-6 py-3"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {isEn ? "Compare" : "Comparer"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>

        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-8 rounded-2xl border border-extralightblue/30 bg-extralightblue/5 p-6 md:p-8 flex flex-col gap-5"
          >
            <div className="flex items-center gap-2 text-extralightblue">
              <CheckCircle2 className="h-5 w-5" />
              <p className="text-sm uppercase tracking-widest font-googletitre">
                {isEn ? `TCO over ${years} years` : `TCO sur ${years} ans`}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-coral/30 bg-coral/10 p-5">
                <p className="text-sm uppercase tracking-widest text-coral font-googletitre mb-2">
                  {isEn ? "Total SaaS cost" : "Coût total SaaS"}
                </p>
                <p className="text-3xl md:text-4xl font-googletitre font-medium text-coral">
                  {formatEuro(calc.saasTrueCost, locale)}
                </p>
                <div className="mt-3 space-y-1 text-xs font-googletexte">
                  <p className="text-white">{isEn ? "Licenses" : "Licences"} : {formatEuro(calc.saasTotal, locale)}</p>
                  <p className="text-white">{isEn ? "Workarounds" : "Contournements"} : {formatEuro(calc.workaroundTotal, locale)}</p>
                </div>
              </div>
              <div className="rounded-xl border border-lightyellow/30 bg-lightyellow/10 p-5">
                <p className="text-sm uppercase tracking-widest text-lightyellow font-googletitre mb-2">
                  {isEn ? "Total custom cost" : "Coût total sur-mesure"}
                </p>
                <p className="text-3xl md:text-4xl font-googletitre font-medium text-lightyellow">
                  {formatEuro(calc.customTotal, locale)}
                </p>
                <div className="mt-3 space-y-1 text-xs font-googletexte">
                  <p className="text-white">{isEn ? "Initial" : "Initial"} : {formatEuro(customInitial, locale)}</p>
                  <p className="text-white">{isEn ? "Maintenance" : "Maintenance"} : {formatEuro(customMaintenance * years, locale)}</p>
                </div>
              </div>
            </div>

            <div className={`rounded-xl border p-5 ${
              calc.diff > 0
                ? "border-lightyellow/30 bg-lightyellow/10"
                : "border-coral/30 bg-coral/10"
            }`}>
              <div className="flex items-center gap-3 mb-2">
                {calc.diff > 0 ? (
                  <TrendingDown className="h-6 w-6 text-lightyellow" />
                ) : (
                  <TrendingUp className="h-6 w-6 text-coral" />
                )}
                <p className="text-sm uppercase tracking-widest font-googletitre text-white">
                  {calc.diff > 0
                    ? isEn ? "Savings with custom" : "Économie avec sur-mesure"
                    : isEn ? "Extra cost with custom" : "Surcoût avec sur-mesure"}
                </p>
              </div>
              <p className={`text-4xl md:text-5xl font-googletitre font-medium ${
                calc.diff > 0 ? "text-lightyellow" : "text-coral"
              }`}>
                {formatEuro(Math.abs(calc.diff), locale)}
              </p>
              {calc.diff > 0 && calc.breakEvenYears < years && (
                <p className="mt-2 text-sm text-white/70 font-googletexte">
                  {isEn
                    ? `Break-even reached around year ${calc.breakEvenYears.toFixed(1)}.`
                    : `Seuil de rentabilité atteint vers l'année ${calc.breakEvenYears.toFixed(1)}.`}
                </p>
              )}
            </div>

            <div className="rounded-xl border border-extralightblue/20 bg-extralightblue/5 p-5">
              <p className="text-sm uppercase tracking-widest text-extralightblue font-googletitre mb-2">
                {isEn ? "Recommendation" : "Recommandation"}
              </p>
              <p className="text-white/90 font-googletexte leading-relaxed">
                {isEn ? calc.recommendation.en : calc.recommendation.fr}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-darkblue/40 p-4 flex items-start gap-3">
              <Info className="h-4 w-4 text-white/40 shrink-0 mt-0.5" />
              <p className="text-xs text-white/60 font-googletexte leading-relaxed">
                {isEn
                  ? "Indicative comparison. A real migration evaluation also considers non-financial factors: vendor lock-in, regulatory specificity, business agility, team autonomy. OETH-eligible companies can deduct up to 30% of custom labor cost from their AGEFIPH contribution."
                  : "Comparaison indicative. Une vraie évaluation de migration considère aussi des facteurs non financiers : dépendance vendeur, spécificité réglementaire, agilité métier, autonomie d'équipe. Les entreprises éligibles OETH peuvent déduire jusqu'à 30 % du coût main-d'œuvre sur-mesure de leur contribution AGEFIPH."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href="/contact" className="flex-1">
                <Button className="w-full rounded-full bg-extralightblue text-darkblue hover:bg-extralightblue/90 font-googletitre font-semibold">
                  {isEn ? "Discuss this migration" : "Discuter de cette migration"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/documentation/applications-web-mobile/migrer-dun-saas-vers-une-web-app-sur-mesure" className="flex-1">
                <Button className="w-full rounded-full border border-white/30 bg-transparent text-white hover:bg-white/10 font-googletitre font-semibold">
                  {isEn ? "Read the migration guide" : "Lire le guide de migration"}
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

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-white/70 font-googletexte">{label}</label>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-extralightblue focus:outline-none"
      />
    </div>
  );
}
