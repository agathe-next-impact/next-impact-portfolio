"use client";

import { FormEvent, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import NewsletterModal from "@/components/ui/newsletter-modal";

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
    <div style={{ border: "1px solid var(--rule)" }}>
      {/* Header */}
      <div
        style={{
          padding: "24px 32px",
          borderBottom: "1px solid var(--rule)",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: "11px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--muted-color)",
            display: "inline-block",
          }}
        >
          {isEn ? "SaaS vs custom — TCO calculator" : "SaaS vs sur-mesure — Calculateur TCO"}
        </span>
        <p style={{ fontFamily: "var(--sans)", fontSize: "15px", color: "var(--ink)", lineHeight: 1.6, margin: 0 }}>
          {isEn
            ? "Compare the cost of staying on your current SaaS vs migrating to a custom web app. Includes workaround time."
            : "Comparez le coût entre rester sur votre SaaS actuel et migrer vers une web app sur-mesure. Inclut le temps perdu en contournements."}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "32px" }}>

          {/* SaaS actuel */}
          <fieldset style={{ border: "none", margin: 0, padding: 0 }}>
            <legend
              style={{
                fontFamily: "var(--mono)",
                fontSize: "11px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--muted-color)",
                marginBottom: "16px",
              }}
            >
              {isEn ? "Current SaaS" : "SaaS actuel"}
            </legend>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "16px",
              }}
            >
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
          </fieldset>

          {/* Sur-mesure */}
          <fieldset style={{ border: "none", margin: 0, padding: 0 }}>
            <legend
              style={{
                fontFamily: "var(--mono)",
                fontSize: "11px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--muted-color)",
                marginBottom: "16px",
              }}
            >
              {isEn ? "Custom alternative" : "Alternative sur-mesure"}
            </legend>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "16px",
              }}
            >
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
          </fieldset>

          {/* Horizon */}
          <div style={{ maxWidth: "220px" }}>
            <NumberField
              label={isEn ? "Horizon (years)" : "Horizon (années)"}
              value={years}
              onChange={setYears}
              min={1}
              max={10}
              step={1}
            />
          </div>

          <div>
            <button type="submit" className="btn primary">
              {isEn ? "Compare" : "Comparer"}
            </button>
          </div>
        </div>

        {/* Results */}
        {submitted && (
          <div
            style={{
              borderTop: "1px solid var(--rule)",
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            <NewsletterModal source="tco-saas-vs-sur-mesure" />
            {/* TCO label */}
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: "11px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--muted-color)",
              }}
            >
              {isEn ? `TCO over ${years} years` : `TCO sur ${years} ans`}
            </span>

            {/* 2-col comparison */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              {/* SaaS column */}
              <div style={{ border: "1px solid var(--rule)", padding: "24px" }}>
                <p
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "11px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--muted-color)",
                    margin: "0 0 12px 0",
                  }}
                >
                  {isEn ? "Total SaaS cost" : "Coût total SaaS"}
                </p>
                <p
                  className="ni-serif"
                  style={{
                    fontSize: "clamp(28px, 3vw, 40px)",
                    color: "var(--ink)",
                    margin: "0 0 16px 0",
                    lineHeight: 1.1,
                  }}
                >
                  {formatEuro(calc.saasTrueCost, locale)}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <p
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: "12px",
                      color: "var(--muted-color)",
                      margin: 0,
                    }}
                  >
                    {isEn ? "Licenses" : "Licences"}: {formatEuro(calc.saasTotal, locale)}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: "12px",
                      color: "var(--muted-color)",
                      margin: 0,
                    }}
                  >
                    {isEn ? "Workarounds" : "Contournements"}: {formatEuro(calc.workaroundTotal, locale)}
                  </p>
                </div>
              </div>

              {/* Custom column */}
              <div style={{ border: "1px solid var(--rule)", padding: "24px" }}>
                <p
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "11px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--muted-color)",
                    margin: "0 0 12px 0",
                  }}
                >
                  {isEn ? "Total custom cost" : "Coût total sur-mesure"}
                </p>
                <p
                  className="ni-serif"
                  style={{
                    fontSize: "clamp(28px, 3vw, 40px)",
                    color: "var(--ink)",
                    margin: "0 0 16px 0",
                    lineHeight: 1.1,
                  }}
                >
                  {formatEuro(calc.customTotal, locale)}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <p
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: "12px",
                      color: "var(--muted-color)",
                      margin: 0,
                    }}
                  >
                    {isEn ? "Initial" : "Initial"}: {formatEuro(customInitial, locale)}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: "12px",
                      color: "var(--muted-color)",
                      margin: 0,
                    }}
                  >
                    {isEn ? "Maintenance" : "Maintenance"}: {formatEuro(customMaintenance * years, locale)}
                  </p>
                </div>
              </div>
            </div>

            {/* Verdict */}
            <div
              style={{
                background: "var(--paper-2)",
                border: "1px solid var(--rule)",
                padding: "24px",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "11px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--muted-color)",
                  margin: "0 0 12px 0",
                }}
              >
                {calc.diff > 0
                  ? isEn ? "Savings with custom" : "Économie avec sur-mesure"
                  : isEn ? "Extra cost with custom" : "Surcoût avec sur-mesure"}
              </p>
              <p
                className="ni-serif"
                style={{
                  fontSize: "clamp(28px, 3vw, 40px)",
                  color: calc.diff > 0 ? "var(--accent-color)" : "var(--ink)",
                  margin: "0 0 8px 0",
                  lineHeight: 1.1,
                }}
              >
                {formatEuro(Math.abs(calc.diff), locale)}
              </p>
              {calc.diff > 0 && calc.breakEvenYears < years && (
                <p
                  style={{
                    fontFamily: "var(--sans)",
                    fontSize: "13px",
                    color: "var(--muted-color)",
                    margin: 0,
                  }}
                >
                  {isEn
                    ? `Break-even reached around year ${calc.breakEvenYears.toFixed(1)}.`
                    : `Seuil de rentabilité atteint vers l'année ${calc.breakEvenYears.toFixed(1)}.`}
                </p>
              )}
            </div>

            {/* Recommendation */}
            <div style={{ border: "1px solid var(--rule)", padding: "24px" }}>
              <p
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "11px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--muted-color)",
                  margin: "0 0 10px 0",
                }}
              >
                {isEn ? "Recommendation" : "Recommandation"}
              </p>
              <p
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: "15px",
                  color: "var(--ink)",
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {isEn ? calc.recommendation.en : calc.recommendation.fr}
              </p>
            </div>

            {/* Disclaimer */}
            <p
              style={{
                fontFamily: "var(--sans)",
                fontSize: "12px",
                color: "var(--muted-color)",
                lineHeight: 1.6,
                margin: 0,
                borderTop: "1px solid var(--rule)",
                paddingTop: "16px",
              }}
            >
              {isEn
                ? "Indicative comparison. A real migration evaluation also considers non-financial factors: vendor lock-in, regulatory specificity, business agility, team autonomy."
                : "Comparaison indicative. Une vraie évaluation de migration considère aussi des facteurs non financiers : dépendance vendeur, spécificité réglementaire, agilité métier, autonomie d'équipe."}
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", paddingTop: "8px" }}>
              <Link href="/contact">
                <button className="btn primary" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                  {isEn ? "Discuss this migration" : "Discuter de cette migration"}
                  <ArrowRight size={14} />
                </button>
              </Link>
              <Link href="/documentation/applications-web-mobile/migrer-dun-saas-vers-une-web-app-sur-mesure">
                <button className="btn" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                  {isEn ? "Read the migration guide" : "Lire le guide de migration"}
                  <ArrowRight size={14} />
                </button>
              </Link>
            </div>
          </div>
        )}
      </form>
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
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label
        style={{
          fontFamily: "var(--mono)",
          fontSize: "11px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--muted-color)",
        }}
      >
        {label}
      </label>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        style={{
          border: "1px solid var(--rule)",
          background: "var(--paper)",
          color: "var(--ink)",
          padding: "10px 14px",
          fontFamily: "var(--mono)",
          fontSize: "14px",
          width: "100%",
          outline: "none",
          borderRadius: 0,
        }}
      />
    </div>
  );
}
