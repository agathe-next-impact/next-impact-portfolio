"use client";

import React, { useState, useMemo } from "react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

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

  const inputStyle: React.CSSProperties = {
    border: "1px solid var(--rule)",
    background: "var(--paper)",
    padding: "10px 14px",
    fontFamily: "var(--sans)",
    fontSize: "1rem",
    color: "var(--ink)",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "var(--mono)",
    fontSize: "0.7rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--muted-color)",
    marginBottom: "10px",
  };

  const infoCardStyle: React.CSSProperties = {
    border: "1px solid var(--rule)",
    background: "var(--paper-2)",
    padding: "20px",
  };

  return (
    <section style={{ width: "100%" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Main container */}
        <div style={{ border: "1px solid var(--rule)" }}>

          {/* Header */}
          <div
            style={{
              padding: "24px 32px",
              borderBottom: "1px solid var(--rule)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--mono)",
                fontSize: "0.7rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--muted-color)",
                marginBottom: "8px",
              }}
            >
              {isEn ? "Tool — AGEFIPH 2025" : "Outil — AGEFIPH 2025"}
            </p>
            <h2
              style={{
                fontFamily: "var(--sans)",
                fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
                fontWeight: 500,
                color: "var(--ink)",
                margin: 0,
              }}
            >
              {isEn
                ? "AGEFIPH deduction simulator"
                : "Simulateur de déduction AGEFIPH"}
            </h2>
            <p
              style={{
                fontFamily: "var(--sans)",
                fontSize: "0.9rem",
                color: "var(--muted-color)",
                marginTop: "8px",
                marginBottom: 0,
              }}
            >
              {isEn
                ? "Estimate your AGEFIPH contribution reduction when working with Next Impact."
                : "Estimez la réduction de votre contribution AGEFIPH en travaillant avec Next Impact."}
            </p>
          </div>

          {/* Inputs */}
          <div style={{ padding: "32px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "32px",
              }}
            >
              {/* Effectif */}
              <div>
                <label style={labelStyle}>
                  {isEn ? "Number of employees" : "Nombre de salariés"}
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <span
                    className="ni-serif"
                    style={{
                      fontSize: "clamp(28px, 3vw, 40px)",
                      color: "var(--ink)",
                      lineHeight: 1,
                    }}
                  >
                    {effectif}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: "0.7rem",
                      color: "var(--muted-color)",
                      letterSpacing: "0.05em",
                    }}
                  >
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
                  style={{
                    width: "100%",
                    accentColor: "var(--accent-color)",
                    cursor: "pointer",
                  }}
                  aria-label={
                    isEn ? "Number of employees" : "Nombre de salariés"
                  }
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "4px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: "0.65rem",
                      color: "var(--muted-color)",
                    }}
                  >
                    20
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: "0.65rem",
                      color: "var(--muted-color)",
                    }}
                  >
                    {isEn ? "1,000" : "1 000"}
                  </span>
                </div>
              </div>

              {/* TH employés */}
              <div>
                <label style={labelStyle}>
                  {isEn
                    ? "Disabled workers employed"
                    : "Travailleurs handicapés employés"}
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
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
                    style={{
                      ...inputStyle,
                      width: "90px",
                      textAlign: "center",
                      fontFamily: "var(--mono)",
                      fontSize: "1.2rem",
                    }}
                    aria-label={
                      isEn
                        ? "Number of disabled workers employed"
                        : "Nombre de travailleurs handicapés employés"
                    }
                  />
                  <span
                    style={{
                      fontFamily: "var(--sans)",
                      fontSize: "0.85rem",
                      color: "var(--muted-color)",
                    }}
                  >
                    {isEn
                      ? `out of ${objectifTH} required (6%)`
                      : `sur ${objectifTH} requis (6%)`}
                  </span>
                </div>
              </div>

              {/* Montant projet */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>
                  {isEn ? "Project amount (excl. tax)" : "Montant HT du projet"}
                </label>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginBottom: "12px",
                  }}
                >
                  {presets.map((p) => {
                    const isActive = montantProjet === p.value && !isCustom;
                    return (
                      <button
                        key={p.value}
                        onClick={() => handlePreset(p.value)}
                        style={{
                          fontFamily: "var(--sans)",
                          fontSize: "0.85rem",
                          padding: "8px 16px",
                          border: isActive
                            ? "1px solid var(--ink)"
                            : "1px solid var(--rule)",
                          background: isActive
                            ? "var(--ink)"
                            : "var(--paper)",
                          color: isActive ? "var(--paper)" : "var(--ink)",
                          cursor: "pointer",
                          transition: "none",
                        }}
                      >
                        {p.label} — {formatEuro(p.value, locale)}
                      </button>
                    );
                  })}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder={
                      isEn ? "Custom amount" : "Montant personnalisé"
                    }
                    value={isCustom ? customMontant : ""}
                    onChange={handleCustomChange}
                    onFocus={() => setIsCustom(true)}
                    style={{
                      ...inputStyle,
                      maxWidth: "220px",
                      outline: isCustom
                        ? "1px solid var(--ink)"
                        : "none",
                    }}
                    aria-label={
                      isEn
                        ? "Custom project amount in euros (excl. tax)"
                        : "Montant personnalisé du projet en euros HT"
                    }
                  />
                  <span
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: "0.75rem",
                      color: "var(--muted-color)",
                    }}
                  >
                    {isEn ? "€ excl. tax" : "€ HT"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Result panel */}
          <div
            style={{
              borderTop: "1px solid var(--rule)",
              padding: "32px",
            }}
          >
            {/* Four result cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1px",
                background: "var(--rule)",
                marginBottom: "32px",
              }}
            >
              {/* Contribution brute */}
              <div style={{ ...infoCardStyle, background: "var(--paper-2)" }}>
                <p style={labelStyle}>
                  {isEn
                    ? "AGEFIPH contribution before"
                    : "Contribution AGEFIPH avant"}
                </p>
                <p
                  className="ni-serif"
                  style={{
                    fontSize: "clamp(20px, 2.5vw, 28px)",
                    color: "var(--ink)",
                    margin: "0 0 6px",
                  }}
                >
                  {formatEuro(resultats.contributionBrute, locale)}
                </p>
                <p
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "0.65rem",
                    color: "var(--muted-color)",
                    margin: 0,
                  }}
                >
                  {isEn
                    ? `${resultats.manquants} missing TH × ${formatEuro(bareme(effectif), locale)}`
                    : `${resultats.manquants} TH manquant${resultats.manquants > 1 ? "s" : ""} × ${formatEuro(bareme(effectif), locale)}`}
                </p>
              </div>

              {/* Déduction Next Impact */}
              <div style={{ ...infoCardStyle, background: "var(--paper-2)" }}>
                <p style={labelStyle}>
                  {isEn ? "Next Impact deduction" : "Déduction Next Impact"}
                </p>
                <p
                  className="ni-serif"
                  style={{
                    fontSize: "clamp(20px, 2.5vw, 28px)",
                    color: "var(--accent-color)",
                    margin: "0 0 6px",
                  }}
                >
                  − {formatEuro(resultats.economie, locale)}
                </p>
                <p
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "0.65rem",
                    color: "var(--muted-color)",
                    margin: 0,
                  }}
                >
                  {isEn
                    ? "30% of labor cost (capped)"
                    : "30% du coût de main-d'œuvre, plafonné"}
                </p>
              </div>

              {/* Contribution après */}
              <div style={{ ...infoCardStyle, background: "var(--paper-2)" }}>
                <p style={labelStyle}>
                  {isEn
                    ? "Contribution after deduction"
                    : "Contribution après déduction"}
                </p>
                <p
                  className="ni-serif"
                  style={{
                    fontSize: "clamp(20px, 2.5vw, 28px)",
                    color: "var(--ink)",
                    margin: "0 0 6px",
                  }}
                >
                  {formatEuro(resultats.contributionApres, locale)}
                </p>
              </div>

              {/* Coût réel — hero card */}
              <div
                style={{
                  ...infoCardStyle,
                  background: "var(--paper)",
                  borderLeft: "2px solid var(--accent-color)",
                }}
              >
                <p style={labelStyle}>
                  {isEn ? "Real cost of the site" : "Coût réel du site"}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <p
                    className="ni-serif"
                    style={{
                      fontSize: "clamp(32px, 4vw, 56px)",
                      color: "var(--accent-color)",
                      margin: 0,
                      lineHeight: 1,
                    }}
                  >
                    {formatEuro(resultats.coutReelProjet, locale)}
                  </p>
                  {resultats.pourcentageEconomie > 0 && (
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "0.85rem",
                        color: "var(--muted-color)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      −{Math.round(resultats.pourcentageEconomie)}%
                    </span>
                  )}
                </div>
                <p
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "0.65rem",
                    color: "var(--muted-color)",
                    marginTop: "8px",
                    marginBottom: 0,
                  }}
                >
                  {formatEuro(montantProjet, locale)} −{" "}
                  {formatEuro(resultats.economie, locale)}{" "}
                  {isEn ? "AGEFIPH deduction" : "de déduction AGEFIPH"}
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link href="/contact" className="btn primary">
                {isEn ? "Start a project" : "Démarrer un projet"}
              </Link>
              <Link href="/services" className="btn">
                {isEn ? "See services" : "Voir les services"}
              </Link>
            </div>
          </div>

          {/* Disclaimer */}
          <div
            style={{
              borderTop: "1px solid var(--rule)",
              padding: "20px 32px",
              background: "var(--paper-2)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--sans)",
                fontSize: "0.78rem",
                color: "var(--muted-color)",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              {isEn ? (
                <>
                  Indicative estimate based on the 2025 AGEFIPH rate schedule
                  (hourly minimum wage: €11.88). The actual calculation depends
                  on additional factors (ECAP, reductions, surcharges). Consult
                  the{" "}
                  <Link
                    href="https://www.agefiph.fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--ink)", textDecoration: "underline" }}
                  >
                    official AGEFIPH simulator
                  </Link>
                  . Attestation compliant with articles L.5212-10-1 and D.5212-7
                  of the French Labor Code.
                </>
              ) : (
                <>
                  Estimation indicative basée sur le barème AGEFIPH 2025 (SMIC
                  horaire : 11,88 €). Le calcul réel dépend de facteurs
                  complémentaires (ECAP, minorations, majorations). Consultez
                  le{" "}
                  <Link
                    href="https://www.agefiph.fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--ink)", textDecoration: "underline" }}
                  >
                    simulateur officiel AGEFIPH
                  </Link>
                  . Attestation conforme aux articles L.5212-10-1 et D.5212-7
                  du Code du travail.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
