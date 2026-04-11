"use client";

import { FormEvent, useMemo, useRef, useState, useEffect } from "react";
import { ArrowRight, CheckCircle2, ChevronDown, Info, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const projectTypes = [
  "Site vitrine ou institutionnel",
  "Blog ou site éditorial",
  "Site e-commerce",
  "Application web ou portail métier",
  "Multisite ou plateforme à fort volume",
];

const integrations = [
  "Aucune intégration spécifique",
  "CRM ou outil marketing",
  "API métier interne",
  "Plusieurs sources de contenu",
];

const headlessReasons = [
  "Performance et vitesse (SEO)",
  "Sécurité maximale (Inattaquable)",
  "Éco-conception / Sobriété numérique",
  "Besoin de sur-mesure total",
];

type TrafficBand = "low" | "medium" | "high";

type Result = {
  title: string;
  amount: string;
  message: string;
  highlight: string;
};

export default function EligibilityForm() {
  const [name, setName] = useState("");
  const [projectType, setProjectType] = useState(projectTypes[0]);
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
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([]);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [result, setResult] = useState<Result | null>(null);

  const isComplexProject = useMemo(
    () =>
      projectType === "Application web ou portail métier" ||
      projectType === "Multisite ou plateforme à fort volume",
    [projectType]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Plateforme Sur-Mesure : projet complexe, fort trafic, ou besoin d'API custom
    if (isComplexProject || traffic === "high" || needsCustomApi) {
      setResult({
        title: "Plateforme Sur-Mesure",
        amount: "À partir de 5 000 €",
        message:
          "Votre projet appelle une stack WordPress headless + Next.js : architecture évolutive, ISR/SSR et CI/CD complet pour absorber votre volumétrie et vos intégrations.",
        highlight: "Conservation de l'admin WordPress, révolution complète du front.",
      });
      return;
    }

    // Croissance Accélérée : trafic moyen, enjeu SEO, site éditorial
    if (
      traffic === "medium" ||
      projectType === "Blog ou site éditorial" ||
      projectType === "Site e-commerce"
    ) {
      setResult({
        title: "Croissance Accélérée",
        amount: "À partir de 4 000 €",
        message:
          "Votre projet a tout intérêt à passer en WordPress headless + Astro : performance front maximale, hydratation partielle, Core Web Vitals au vert.",
        highlight: "Le bon compromis entre performance et coût pour un site à fort enjeu SEO.",
      });
      return;
    }

    // Présence Essentielle : site vitrine, faible trafic
    setResult({
      title: "Présence Essentielle",
      amount: "À partir de 2 250 €",
      message:
        "Un WordPress monolithique optimisé suffit largement à votre projet : thème custom moderne, sécurité durcie, mise en ligne rapide.",
      highlight: "Vous gardez l'admin que vous connaissez, je révolutionne le front.",
    });
  };

  const toggleSelection = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  return (
    <div className="w-full">
      <div className="bg-darkblue/50 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur">
        <div className="flex items-start gap-3 mb-6">
          <Sparkles className="h-6 w-6 text-lightyellow" />
          <div>
            <p className="text-sm uppercase tracking-[0.25rem] text-white/50 font-googletexte">
              Diagnostic de stack
            </p>
            <p className="text-white font-googletexte mt-2">
              Identifiez en 2 minutes la stack WordPress adaptée à votre projet : monolithique optimisée, hybride Astro ou Next.js complète.
            </p>
          </div>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Étape 1 */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm text-white/70 font-googletexte">
                Nom de votre organisation
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex : Atelier Martin & Co"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-lightyellow focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white/70 font-googletexte">
                Type de projet
              </label>
              <div ref={projectRef} className="relative">
                <button
                  type="button"
                  onClick={() => setProjectOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-white transition focus:border-lightyellow focus:outline-none"
                >
                  <span className="truncate text-white/60">{projectType}</span>
                  <ChevronDown className={`ml-2 h-4 w-4 shrink-0 text-white/50 transition-transform ${projectOpen ? "rotate-180" : ""}`} />
                </button>
                {projectOpen && (
                  <ul className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-darkblue/95 backdrop-blur-md ">
                    {projectTypes.map((option) => (
                      <li key={option}>
                        <button
                          type="button"
                          onClick={() => { setProjectType(option); setProjectOpen(false); }}
                          className={`w-full px-4 py-3 text-left text-sm font-googletexte transition hover:bg-lightyellow/10 hover:text-white ${
                            projectType === option ? "bg-lightyellow/10 text-lightyellow" : "text-white/80"
                          }`}
                        >
                          {option}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Étape 2 */}
          <div className="space-y-3">
            <p className="text-sm text-white/70 font-googletexte">Volumétrie de trafic attendue</p>
            <div className="grid gap-3 md:grid-cols-3">
              <label className={`flex items-start gap-3 rounded-xl border px-4 py-3 cursor-pointer transition ${
                traffic === "low" ? "border-lightyellow bg-lightyellow/10" : "border-white/10 bg-white/5"
              }`}>
                <input
                  type="radio"
                  name="traffic"
                  value="low"
                  checked={traffic === "low"}
                  onChange={() => setTraffic("low")}
                  className="mt-1 accent-lightyellow"
                />
                <div>
                  <p className="text-white font-googletitre text-base">Moins de 10k visites / mois</p>
                  <p className="text-sm text-white/60 font-googletexte">Plutôt Présence Essentielle</p>
                </div>
              </label>
              <label className={`flex items-start gap-3 rounded-xl border px-4 py-3 cursor-pointer transition ${
                traffic === "medium" ? "border-lightyellow bg-lightyellow/10" : "border-white/10 bg-white/5"
              }`}>
                <input
                  type="radio"
                  name="traffic"
                  value="medium"
                  checked={traffic === "medium"}
                  onChange={() => setTraffic("medium")}
                  className="mt-1 accent-lightyellow"
                />
                <div>
                  <p className="text-white font-googletitre text-base">10k à 100k / mois</p>
                  <p className="text-sm text-white/60 font-googletexte">Plutôt Croissance Accélérée</p>
                </div>
              </label>
              <label className={`flex items-start gap-3 rounded-xl border px-4 py-3 cursor-pointer transition ${
                traffic === "high" ? "border-lightyellow bg-lightyellow/10" : "border-white/10 bg-white/5"
              }`}>
                <input
                  type="radio"
                  name="traffic"
                  value="high"
                  checked={traffic === "high"}
                  onChange={() => setTraffic("high")}
                  className="mt-1 accent-lightyellow"
                />
                <div>
                  <p className="text-white font-googletitre text-base">Plus de 100k / mois</p>
                  <p className="text-sm text-white/60 font-googletexte">Plutôt Plateforme Sur-Mesure</p>
                </div>
              </label>
            </div>
          </div>

          {/* Étape 3 */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm text-white/70 font-googletexte">
                Avez-vous besoin d&apos;API ou d&apos;intégrations sur-mesure ?
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setNeedsCustomApi(true)}
                  className={`flex-1 rounded-full border px-4 py-2 font-googletexte transition ${
                    needsCustomApi ? "border-lightyellow bg-lightyellow/10 text-white" : "border-white/10 text-white/70"
                  }`}
                >
                  Oui
                </button>
                <button
                  type="button"
                  onClick={() => setNeedsCustomApi(false)}
                  className={`flex-1 rounded-full border px-4 py-2 font-googletexte transition ${
                    !needsCustomApi ? "border-lightyellow bg-lightyellow/10 text-white" : "border-white/10 text-white/70"
                  }`}
                >
                  Non
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-white/70 font-googletexte">Intégrations existantes</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {integrations.map((integration) => (
                  <label
                    key={integration}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 cursor-pointer transition ${
                      selectedIntegrations.includes(integration)
                        ? "border-lightyellow bg-lightyellow/10"
                        : "border-white/10 bg-white/5"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIntegrations.includes(integration)}
                      onChange={() => toggleSelection(integration, setSelectedIntegrations)}
                      className="accent-lightyellow"
                    />
                    <span className="text-white/80 font-googletexte text-sm">{integration}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Étape 4 */}
          <div className="space-y-2">
            <p className="text-sm text-white/70 font-googletexte">Pourquoi envisagez-vous une modernisation ?</p>
            <div className="grid gap-2 md:grid-cols-2">
              {headlessReasons.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 cursor-pointer transition ${
                    selectedReasons.includes(reason)
                      ? "border-lightyellow bg-lightyellow/10"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedReasons.includes(reason)}
                    onChange={() => toggleSelection(reason, setSelectedReasons)}
                    className="accent-lightyellow"
                  />
                  <span className="text-white/80 font-googletexte text-sm">{reason}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" className="rounded-full bg-lightyellow text-darkblue hover:bg-lightyellow/90 font-googletitre font-semibold">
              Voir ma stack
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 text-white/60 font-googletexte text-sm">
              <Info className="h-4 w-4" />
              <span className="text-white/60">Diagnostic basé sur le type de projet et la volumétrie.</span>
            </div>
          </div>
        </form>

        {result && (
          <div className="mt-8 rounded-2xl border border-lightyellow/30 bg-lightyellow/10 p-6 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-lightyellow">
              <CheckCircle2 className="h-5 w-5" />
              <p className="text-sm uppercase tracking-widest font-googletexte text-extralightblue">Stack recommandée</p>
            </div>
            <h4 className="text-2xl font-googletitre text-white">{result.title}</h4>
            <p className="text-lg font-googletexte text-white/90">{result.message}</p>
            <p className="text-3xl font-googletitre text-lightyellow">{result.amount}</p>
            <p className="text-white/70 font-googletexte">{result.highlight}</p>
            {name && (
              <p className="text-white/60 text-sm font-googletexte">Dossier : {name}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
