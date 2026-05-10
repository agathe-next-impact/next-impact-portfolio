"use client";

import React from "react";
import { CheckCircle, AlertTriangle, TrendingUp, Activity, Gauge } from "lucide-react";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

interface AuditDashboardProps {
  markdown: string;
}

// Fonction utilitaire pour extraire les données via Regex (FR + EN AI output)
const extractData = (md: string, isEn: boolean) => {
  // 1. Modernity index / Indice de modernité
  const scoreMatch =
    md.match(/Indice de modernité.*?:[^\d]*(\d+)/i) ||
    md.match(/Modernity index.*?:[^\d]*(\d+)/i);
  let score = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;
  if (score > 10) score = 0;

  // 2. Strategic verdict / Verdict Stratégique
  const verdictMatch =
    md.match(/\*\*Verdict Stratégique.*?:.*?\*?\[?(.*?)(?:\]|\.| \n)/i) ||
    md.match(/\*\*Strategic verdict.*?:.*?\*?\[?(.*?)(?:\]|\.| \n)/i);
  const verdict = verdictMatch
    ? verdictMatch[1].replace(/[*\[\]]/g, "").trim()
    : isEn
      ? "Undefined"
      : "Non défini";

  // 3. Nature of the organization / Nature de l'organisation
  const natureMatch =
    md.match(/1\.\s*\*\*Nature de l'organisation.*?:.*?\*\*(.*?)(?:\n|$)/i) ||
    md.match(/1\.\s*\*\*Nature of the organization.*?:.*?\*\*(.*?)(?:\n|$)/i);
  const natureMatchBF =
    md.match(/1\.\s*\*\*Nature de l'organisation.*?:(.*?)(?:\n|$)/i) ||
    md.match(/1\.\s*\*\*Nature of the organization.*?:(.*?)(?:\n|$)/i);
  let nature = natureMatch
    ? natureMatch[1].trim()
    : natureMatchBF
      ? natureMatchBF[1].trim()
      : isEn
        ? "Not detected"
        : "Non détecté";
  nature = nature.replace(/\*\*/g, "").trim();

  return { score, verdict, nature };
};

export default function AuditDashboard({ markdown }: AuditDashboardProps) {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const { score, verdict, nature } = extractData(markdown, isEn);

  // Définition des couleurs selon le score
  let scoreColor = "text-red-500 border-red-500";
  let scoreBg = "bg-red-50";
  if (score >= 5) { scoreColor = "text-yellow-600 border-yellow-600"; scoreBg="bg-yellow-50"; }
  if (score >= 8) { scoreColor = "text-emerald-600 border-emerald-600"; scoreBg="bg-emerald-50"; }

  return (
    <>
    <h1 className="text-2xl md:text-3xl font-googletitre font-semibold text-center text-mediumblue mb-6">
      {isEn
        ? "Headless WordPress migration opportunity audit"
        : "Audit d'opportunité pour une migration WordPress Headless"}
     </h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      {/* Carte 1: Score Global */}
      <div className={`p-6 rounded-2xl border flex flex-col items-center justify-center gap-2 ${scoreBg} ${scoreColor.replace('text-', 'border-opacity-20 border-')}`}>
        <h3 className="text-xs font-bold uppercase tracking-widest opacity-70 flex items-center gap-2">
            <Gauge className="size-4"/> {isEn ? "Modernity index" : "Indice de Modernité"}
        </h3>
        <div className="relative size-20 flex items-center justify-center mt-1">
            <div className={`size-full rounded-full border-4 opacity-20 absolute ${scoreColor}`}></div>
            <div 
              className={`size-full rounded-full border-4 absolute border-t-transparent border-l-transparent ${scoreColor}`} 
              style={{ transform: `rotate(${(score / 10) * 360}deg)` }}
            ></div>
            <span className={`text-3xl font-bold ${scoreColor}`}>{score}<span className="text-sm opacity-60">/10</span></span>
        </div>
      </div>

      {/* Carte 2: Verdict */}
      <div className="p-6 rounded-2xl bg-white/60 border border-white/50 flex flex-col items-center justify-center gap-3 text-center backdrop-blur-sm">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <Activity className="size-4"/> {isEn ? "Strategic verdict" : "Verdict Stratégique"}
        </h3>
        <div className={`px-4 py-1.5 rounded-full font-bold text-base uppercase ${
            (verdict.includes("Accélérer") || /migrate quickly/i.test(verdict)) ? "text-emerald-800" :
            (verdict.includes("Pivoter") || /migrate progressively/i.test(verdict)) ? "text-orange-800" :
            "text-blue-800"
        }`}>
            {verdict}
        </div>
        <p className="text-[10px] uppercase tracking-wide text-slate-400">
            {isEn ? "AI recommendation" : "Recommandation IA"}
        </p>
      </div>


    </div>
    </>
  );
}