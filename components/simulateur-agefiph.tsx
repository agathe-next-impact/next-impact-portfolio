"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import {
  Calculator,
  TrendingDown,
  Receipt,
  PiggyBank,
  PercentIcon,
  Info,
} from "lucide-react";
import Link from "next/link";

const SMIC_HORAIRE = 11.88;

function bareme(effectif: number): number {
  if (effectif < 250) return 400 * SMIC_HORAIRE;
  if (effectif < 750) return 500 * SMIC_HORAIRE;
  return 600 * SMIC_HORAIRE;
}

function formatEuro(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

const presets = [
  { label: "Solidaire", value: 2250 },
  { label: "Équilibre", value: 4000 },
  { label: "Soutien", value: 5000 },
];

export default function SimulateurAgefiph() {
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

  return (
    <section className="w-full">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <Calculator className="h-8 w-8 text-lightyellow" />
          <h2 className="text-3xl md:text-4xl font-googletitre font-medium text-white">
            Simulateur de déduction AGEFIPH
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="space-y-8 border border-white/10 rounded-2xl p-6 md:p-8 bg-mediumblue/60 backdrop-blur-lg">
            {/* Effectif */}
            <div>
              <label className="block text-sm text-white/50 font-googletexte uppercase tracking-widest mb-3">
                Nombre de salariés
              </label>
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl font-googletitre font-medium text-white">
                  {effectif}
                </span>
                <span className="text-sm text-white/60 font-googletexte">
                  Obligation OETH : {objectifTH} TH
                </span>
              </div>
              <Slider
                value={[effectif]}
                onValueChange={(v) => setEffectif(v[0])}
                min={20}
                max={1000}
                step={1}
                className="w-full [&_[data-slot=range]]:bg-lightyellow [&_[data-slot=thumb]]:border-lightyellow [&_[data-slot=thumb]]:bg-darkblue"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-white/60">20</span>
                <span className="text-xs text-white/60">1 000</span>
              </div>
            </div>

            {/* TH employés */}
            <div>
              <label className="block text-sm text-white/50 font-googletexte uppercase tracking-widest mb-3">
                Travailleurs handicapés employés
              </label>
              <div className="flex items-center gap-4">
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
                  className="w-24 bg-darkblue/60 border border-white/20 rounded-xl px-4 py-3 text-white text-xl font-googletitre text-center focus:outline-none focus:border-lightyellow/50 transition"
                  aria-label="Nombre de travailleurs handicapés employés"
                />
                <span className="text-white/50 font-googletexte text-sm">
                  sur {objectifTH} requis (6% de l&apos;effectif)
                </span>
              </div>
            </div>

            {/* Montant projet */}
            <div>
              <label className="block text-sm text-white/50 font-googletexte uppercase tracking-widest mb-3">
                Montant HT du projet
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {presets.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => handlePreset(p.value)}
                    className={`px-4 py-2 rounded-full text-sm font-googletexte transition-all ${
                      montantProjet === p.value && !isCustom
                        ? "bg-lightyellow text-darkblue font-medium"
                        : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    {p.label} — {formatEuro(p.value)}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Montant personnalisé"
                  value={isCustom ? customMontant : ""}
                  onChange={handleCustomChange}
                  onFocus={() => setIsCustom(true)}
                  className={`flex-1 bg-darkblue/60 border rounded-xl px-4 py-3 text-white font-googletexte placeholder:text-white/50 focus:outline-none transition ${
                    isCustom
                      ? "border-lightyellow/50"
                      : "border-white/20 focus:border-lightyellow/50"
                  }`}
                  aria-label="Montant personnalisé du projet en euros HT"
                />
                <span className="text-white/50 font-googletexte">€ HT</span>
              </div>
            </div>
          </div>

          {/* Résultats */}
          <div className="space-y-4">
            <motion.div
              key={`brute-${resultats.contributionBrute}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="border border-white/10 rounded-2xl p-6 bg-mediumblue/60 backdrop-blur-lg"
            >
              <div className="flex items-center gap-3 mb-2">
                <Receipt className="h-5 w-5 text-coral shrink-0" />
                <span className="text-sm text-white/50 font-googletexte uppercase tracking-widest">
                  Contribution AGEFIPH avant
                </span>
              </div>
              <p className="text-3xl font-googletitre font-medium text-coral">
                {formatEuro(resultats.contributionBrute)}
              </p>
              <p className="text-xs text-white/60 font-googletexte mt-1">
                {resultats.manquants} TH manquant{resultats.manquants > 1 ? "s" : ""} × {formatEuro(bareme(effectif))}
              </p>
            </motion.div>

            <motion.div
              key={`eco-${resultats.economie}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="border border-lightyellow/20 rounded-2xl p-6 bg-lightyellow/5 backdrop-blur-lg"
            >
              <div className="flex items-center gap-3 mb-2">
                <TrendingDown className="h-5 w-5 text-lightyellow shrink-0" />
                <span className="text-sm text-white/50 font-googletexte uppercase tracking-widest">
                  Déduction Next Impact
                </span>
              </div>
              <p className="text-3xl font-googletitre font-medium text-lightyellow">
                - {formatEuro(resultats.economie)}
              </p>
              <p className="text-xs text-white/60 font-googletexte mt-1">
                30% du coût de main-d&apos;œuvre plafonné
              </p>
            </motion.div>

            <motion.div
              key={`apres-${resultats.contributionApres}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="border border-white/10 rounded-2xl p-6 bg-mediumblue/60 backdrop-blur-lg"
            >
              <div className="flex items-center gap-3 mb-2">
                <PiggyBank className="h-5 w-5 text-lightblue shrink-0" />
                <span className="text-sm text-white/50 font-googletexte uppercase tracking-widest">
                  Contribution après déduction
                </span>
              </div>
              <p className="text-3xl font-googletitre font-medium text-lightblue">
                {formatEuro(resultats.contributionApres)}
              </p>
            </motion.div>

            <motion.div
              key={`reel-${resultats.coutReelProjet}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="border-2 border-lightyellow/30 rounded-2xl p-6 bg-darkblue/40 backdrop-blur-lg"
            >
              <div className="flex items-center gap-3 mb-2">
                <PercentIcon className="h-5 w-5 text-lightyellow shrink-0" />
                <span className="text-sm text-white/50 font-googletexte uppercase tracking-widest">
                  Coût réel du site
                </span>
              </div>
              <div className="flex items-end gap-4">
                <p className="text-4xl font-googletitre font-medium text-white">
                  {formatEuro(resultats.coutReelProjet)}
                </p>
                {resultats.pourcentageEconomie > 0 && (
                  <span className="text-lg text-lightyellow font-googletexte mb-1">
                    -{Math.round(resultats.pourcentageEconomie)}%
                  </span>
                )}
              </div>
              <p className="text-xs text-white/60 font-googletexte mt-1">
                {formatEuro(montantProjet)} - {formatEuro(resultats.economie)} de déduction AGEFIPH
              </p>
            </motion.div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
          <Info className="h-4 w-4 text-white/60 mt-0.5 shrink-0" />
          <p className="text-xs text-white/60 font-googletexte leading-relaxed">
            Estimation indicative basée sur le barème AGEFIPH 2025 (SMIC horaire : 11,88 €).
            Le calcul réel dépend de facteurs complémentaires (ECAP, minorations, majorations).
            Consultez le{" "}
            <Link
              href="https://www.agefiph.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lightblue underline"
            >
              simulateur officiel AGEFIPH
            </Link>
            . Attestation conforme aux articles L.5212-10-1 et D.5212-7 du Code du travail.
          </p>
        </div>
      </div>
    </section>
  );
}
