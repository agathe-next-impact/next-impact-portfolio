"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { ArrowRight, Info } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { Reveal } from "@/components/ui/reveal";
import { RadialGauge } from "@/components/visuals/radial-gauge";
import { DonutBreakdown } from "@/components/visuals/charts";

const SMIC_HORAIRE = 11.88;

function bareme(effectif: number): number {
  if (effectif < 250) return 400 * SMIC_HORAIRE;
  if (effectif < 750) return 500 * SMIC_HORAIRE;
  return 600 * SMIC_HORAIRE;
}

function formatEuro(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "en" ? "en-US" : "fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

const presetsFr = [
  { label: "Classique", value: 2250 },
  { label: "Headless", value: 4000 },
  { label: "Web app", value: 6500 },
  { label: "Application sur-mesure", value: 15000 },
];
const presetsEn = [
  { label: "Classic", value: 2250 },
  { label: "Headless", value: 4000 },
  { label: "Web app", value: 6500 },
  { label: "Custom application", value: 15000 },
];

const BTN_PRIMARY =
  "inline-flex h-11 items-center gap-2 border border-charcoal bg-vermilion px-5 font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-vermilion-bright";

const BTN_GHOST =
  "group inline-flex h-11 items-center gap-1.5 rounded-sm border border-dark-gray px-5 font-mono text-[12px] uppercase tracking-[0.08em] text-foreground transition-colors hover:bg-jet";

const LABEL_MONO =
  "block font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray";

/**
 * Chiffre € qui se réécrit en douceur quand les entrées changent (interpolation
 * sur 500 ms depuis la valeur précédente). Reduced-motion → bascule directe.
 */
function AnimatedEuro({
  value,
  locale,
  className,
}: {
  value: number;
  locale: Locale;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      prev.current = value;
      return;
    }
    const start = prev.current;
    const end = value;
    if (start === end) return;
    const duration = 500;
    let startTime: number | null = null;
    let raf = 0;
    const tick = (ts: number) => {
      if (startTime === null) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(start + (end - start) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else prev.current = end;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, reduce]);

  return <span className={className}>{formatEuro(display, locale)}</span>;
}

export default function SimulateurAgefiph() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const presets = isEn ? presetsEn : presetsFr;
  const [effectif, setEffectif] = useState(50);
  const [thEmployes, setThEmployes] = useState(0);
  const [montantProjet, setMontantProjet] = useState(4000);
  const [customMontant, setCustomMontant] = useState("");
  const [isCustom, setIsCustom] = useState(false);

  const resultats = useMemo(() => {
    const objectif = Math.floor(effectif * 0.06);
    const manquants = Math.max(0, objectif - thEmployes);
    const contributionBrute = manquants * bareme(effectif);

    const deductionTIH = montantProjet * 0.3;

    const tauxEmploi = effectif > 0 ? thEmployes / effectif : 0;
    const plafondDeduction =
      tauxEmploi < 0.03
        ? contributionBrute * 0.5
        : contributionBrute * 0.75;

    const deductionEffective = Math.min(deductionTIH, plafondDeduction);
    const contributionApres = contributionBrute - deductionEffective;
    const economie = deductionEffective;
    const coutReelProjet = montantProjet - economie;
    const pourcentageEconomie =
      montantProjet > 0 ? (economie / montantProjet) * 100 : 0;

    return {
      objectif,
      manquants,
      contributionBrute,
      deductionEffective,
      contributionApres,
      economie,
      coutReelProjet,
      pourcentageEconomie,
    };
  }, [effectif, thEmployes, montantProjet]);

  const handlePreset = (value: number) => {
    setMontantProjet(value);
    setIsCustom(false);
    setCustomMontant("");
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setCustomMontant(val);
    setIsCustom(true);
    if (val) {
      setMontantProjet(parseInt(val, 10));
    }
  };

  const objectifTH = Math.floor(effectif * 0.06);

  // Données chart : décomposition de la contribution brute (part déduite vs
  // part restante). Redessinée à chaque changement d'entrée.
  const donutData = [
    {
      label: isEn ? "Deduction" : "Déduction",
      value: Math.round(resultats.economie),
    },
    {
      label: isEn ? "Remaining" : "Reste à payer",
      value: Math.round(resultats.contributionApres),
    },
  ];
  const hasContribution = resultats.contributionBrute > 0;
  const pctEconomie = Math.round(resultats.pourcentageEconomie);

  return (
    <Reveal className="w-full border border-dark-gray bg-obsidian">
      {/* Header */}
      <div className="border-b border-dark-gray px-6 py-6 lg:px-8">
        <p className={LABEL_MONO}>
          {isEn ? "Tool — AGEFIPH 2025" : "Outil — AGEFIPH 2025"}
        </p>
        <h2 className="mt-2 text-2xl font-light tracking-tight text-foreground md:text-3xl">
          {isEn
            ? "AGEFIPH deduction simulator"
            : "Simulateur de déduction AGEFIPH"}
        </h2>
        <p className="mt-2 font-inter-tight text-sm leading-relaxed text-mid-gray">
          {isEn
            ? "Estimate your AGEFIPH contribution reduction when working with Next Impact."
            : "Estimez la réduction de votre contribution AGEFIPH en travaillant avec Next Impact."}
        </p>
      </div>

      {/* Inputs */}
      <div className="grid gap-x-8 gap-y-8 px-6 py-8 sm:grid-cols-2 lg:px-8">
        {/* Effectif */}
        <div>
          <label className={LABEL_MONO}>
            {isEn ? "Number of employees" : "Nombre de salariés"}
          </label>
          <div className="mt-2.5 mb-2.5 flex items-baseline justify-between">
            <span className="text-3xl font-light leading-none text-foreground md:text-4xl">
              {effectif}
            </span>
            <span className="font-mono text-[11px] tracking-[0.05em] text-mid-gray">
              {isEn
                ? `OETH: ${objectifTH} required`
                : `OETH : ${objectifTH} TH requis`}
            </span>
          </div>
          <input
            type="range"
            min={20}
            max={1000}
            step={1}
            value={effectif}
            onChange={(e) => setEffectif(Number(e.target.value))}
            className="w-full cursor-pointer accent-accent-secondary"
            aria-label={isEn ? "Number of employees" : "Nombre de salariés"}
          />
          <div className="mt-1 flex justify-between font-mono text-[10px] text-mid-gray">
            <span>20</span>
            <span>{isEn ? "1,000" : "1 000"}</span>
          </div>
        </div>

        {/* TH employés */}
        <div>
          <label className={LABEL_MONO}>
            {isEn
              ? "Disabled workers employed"
              : "Travailleurs handicapés employés"}
          </label>
          <div className="mt-2.5 flex items-center gap-4">
            <input
              type="number"
              min={0}
              max={effectif}
              value={thEmployes}
              onChange={(e) =>
                setThEmployes(
                  Math.min(
                    Math.max(0, parseInt(e.target.value) || 0),
                    effectif
                  )
                )
              }
              className="w-[90px] border border-dark-gray bg-jet px-3 py-2 text-center font-mono text-lg text-foreground outline-none transition-colors focus-visible:border-accent-secondary focus-visible:ring-1 focus-visible:ring-accent-secondary"
              aria-label={
                isEn
                  ? "Number of disabled workers employed"
                  : "Nombre de travailleurs handicapés employés"
              }
            />
            <span className="font-inter-tight text-sm text-mid-gray">
              {isEn
                ? `out of ${objectifTH} required (6%)`
                : `sur ${objectifTH} requis (6%)`}
            </span>
          </div>
        </div>

        {/* Montant projet */}
        <div className="sm:col-span-2">
          <label className={LABEL_MONO}>
            {isEn ? "Project amount (excl. tax)" : "Montant HT du projet"}
          </label>
          <div className="mt-3 mb-3 flex flex-wrap gap-2">
            {presets.map((p) => {
              const isActive = montantProjet === p.value && !isCustom;
              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => handlePreset(p.value)}
                  className={
                    "rounded-sm border px-4 py-2 font-inter-tight text-sm transition-colors " +
                    (isActive
                      ? "border-accent-secondary bg-jet text-foreground"
                      : "border-dark-gray text-mid-gray hover:bg-jet hover:text-foreground")
                  }
                >
                  {p.label} — {formatEuro(p.value, locale)}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              inputMode="numeric"
              placeholder={isEn ? "Custom amount" : "Montant personnalisé"}
              value={isCustom ? customMontant : ""}
              onChange={handleCustomChange}
              onFocus={() => setIsCustom(true)}
              className={
                "max-w-[220px] flex-1 border bg-jet px-3.5 py-2.5 font-inter-tight text-sm text-foreground placeholder:text-mid-gray outline-none transition-colors focus-visible:border-accent-secondary focus-visible:ring-1 focus-visible:ring-accent-secondary " +
                (isCustom ? "border-accent-secondary" : "border-dark-gray")
              }
              aria-label={
                isEn
                  ? "Custom project amount in euros (excl. tax)"
                  : "Montant personnalisé du projet en euros HT"
              }
            />
            <span className="font-mono text-xs text-mid-gray">
              {isEn ? "€ excl. tax" : "€ HT"}
            </span>
          </div>
        </div>
      </div>

      {/* Result panel */}
      <div className="border-t border-dark-gray">
        <div className="grid lg:grid-cols-[1.4fr_1fr]">
          {/* Chiffres clés */}
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {/* Contribution brute */}
            <div className="border-b border-dark-gray p-6 sm:border-r lg:p-8">
              <p className={LABEL_MONO}>
                {isEn
                  ? "AGEFIPH contribution before"
                  : "Contribution AGEFIPH avant"}
              </p>
              <p className="mt-2 text-2xl font-light text-foreground md:text-[28px]">
                {formatEuro(resultats.contributionBrute, locale)}
              </p>
              <p className="mt-1.5 font-mono text-[11px] text-mid-gray">
                {isEn
                  ? `${resultats.manquants} missing TH × ${formatEuro(bareme(effectif), locale)}`
                  : `${resultats.manquants} TH manquant${resultats.manquants > 1 ? "s" : ""} × ${formatEuro(bareme(effectif), locale)}`}
              </p>
            </div>

            {/* Déduction Next Impact */}
            <div className="border-b border-dark-gray p-6 lg:p-8">
              <p className={LABEL_MONO}>
                {isEn ? "Next Impact deduction" : "Déduction Next Impact"}
              </p>
              <p className="mt-2 text-2xl font-light text-accent-secondary md:text-[28px]">
                − <AnimatedEuro value={resultats.economie} locale={locale} />
              </p>
              <p className="mt-1.5 font-mono text-[11px] text-mid-gray">
                {isEn
                  ? "30% of labor cost (capped)"
                  : "30% du coût de main-d'œuvre, plafonné"}
              </p>
            </div>

            {/* Contribution après */}
            <div className="border-b border-dark-gray p-6 sm:border-r sm:border-b-0 lg:p-8">
              <p className={LABEL_MONO}>
                {isEn
                  ? "Contribution after deduction"
                  : "Contribution après déduction"}
              </p>
              <p className="mt-2 text-2xl font-light text-foreground md:text-[28px]">
                {formatEuro(resultats.contributionApres, locale)}
              </p>
            </div>

            {/* Coût réel — carte mise en avant */}
            <div className="border-b border-dark-gray border-l-2 border-l-accent-secondary bg-jet p-6 sm:border-b-0 lg:p-8">
              <p className={LABEL_MONO}>
                {isEn ? "Real cost of the site" : "Coût réel du site"}
              </p>
              <div className="mt-2 flex flex-wrap items-baseline gap-3">
                <AnimatedEuro
                  value={resultats.coutReelProjet}
                  locale={locale}
                  className="text-3xl font-light leading-none text-accent-secondary md:text-5xl"
                />
                {pctEconomie > 0 && (
                  <span className="font-mono text-sm tracking-[0.05em] text-mid-gray">
                    −{pctEconomie}%
                  </span>
                )}
              </div>
              <p className="mt-2 font-mono text-[11px] text-mid-gray">
                {formatEuro(montantProjet, locale)} −{" "}
                {formatEuro(resultats.economie, locale)}{" "}
                {isEn ? "AGEFIPH deduction" : "de déduction AGEFIPH"}
              </p>
            </div>
          </div>

          {/* Visualisations theme-aware (se redessinent au changement d'entrée) */}
          <div className="flex flex-col items-center justify-center gap-8 border-t border-dark-gray p-6 lg:border-t-0 lg:border-l lg:p-8">
            {hasContribution ? (
              <div className="w-full">
                <DonutBreakdown
                  data={donutData}
                  height={180}
                  centerLabel={`−${pctEconomie}%`}
                />
                <div className="mt-3 flex items-center justify-center gap-5 font-mono text-[10px] uppercase tracking-[0.08em] text-mid-gray">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-accent-primary" />
                    {isEn ? "Deduction" : "Déduction"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-accent-secondary" />
                    {isEn ? "Remaining" : "Reste"}
                  </span>
                </div>
              </div>
            ) : (
              <RadialGauge
                value={Math.min(100, Math.round(resultats.pourcentageEconomie))}
                size={150}
                label={isEn ? "of project" : "du projet"}
                sublabel={isEn ? "saved" : "économisé"}
              />
            )}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 border-t border-dark-gray px-6 py-6 lg:px-8">
          <Link href="/contact" className={BTN_PRIMARY}>
            {isEn ? "Start a project" : "Démarrer un projet"}
            <ArrowRight size={14} />
          </Link>
          <Link href="/services" className={BTN_GHOST}>
            {isEn ? "See services" : "Voir les services"}
            <ArrowRight
              size={13}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex gap-3 border-t border-dark-gray bg-jet px-6 py-5 lg:px-8">
        <Info size={15} className="mt-0.5 shrink-0 text-mid-gray" />
        <p className="font-inter-tight text-[13px] leading-relaxed text-mid-gray">
          {isEn ? (
            <>
              Indicative estimate based on the 2025 AGEFIPH rate schedule
              (hourly minimum wage: €11.88). The actual calculation depends on
              additional factors (ECAP, reductions, surcharges). Consult the{" "}
              <Link
                href="https://www.agefiph.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-2 transition-colors hover:text-accent-secondary"
              >
                official AGEFIPH simulator
              </Link>
              . Attestation compliant with articles L.5212-10-1 and D.5212-7 of
              the French Labor Code.
            </>
          ) : (
            <>
              Estimation indicative basée sur le barème AGEFIPH 2025 (SMIC
              horaire : 11,88 €). Le calcul réel dépend de facteurs
              complémentaires (ECAP, minorations, majorations). Consultez le{" "}
              <Link
                href="https://www.agefiph.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-2 transition-colors hover:text-accent-secondary"
              >
                simulateur officiel AGEFIPH
              </Link>
              . Attestation conforme aux articles L.5212-10-1 et D.5212-7 du Code
              du travail.
            </>
          )}
        </p>
      </div>
    </Reveal>
  );
}
