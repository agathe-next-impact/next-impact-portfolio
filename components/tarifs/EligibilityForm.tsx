"use client";

import { FormEvent, useMemo, useRef, useState, useEffect } from "react";
import { ArrowRight, CheckCircle2, ChevronDown, Info, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const statuses = [
  "Association Loi 1901",
  "Coopérative (SCOP, SCIC) / Entreprise ESUS",
  "Auto-entrepreneur / Freelance",
  "Entreprise (SAS, SARL, etc.)",
  "Secteur Public / Fondation",
];

const domains = [
  "Écologie / Environnement",
  "Social / Insertion / Santé",
  "Éducation / Culture",
  "Autre",
];

const headlessReasons = [
  "Performance et vitesse (SEO)",
  "Sécurité maximale (Inattaquable)",
  "Éco-conception / Sobriété numérique",
  "Besoin de sur-mesure total",
];

type BudgetBand = "lt100" | "100-500" | "gt500";

type Result = {
  title: string;
  amount: string;
  message: string;
  highlight: string;
};

export default function EligibilityForm() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState(statuses[0]);
  const [statusOpen, setStatusOpen] = useState(false);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
        setStatusOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  const [budget, setBudget] = useState<BudgetBand>("lt100");
  const [impactYes, setImpactYes] = useState(true);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [result, setResult] = useState<Result | null>(null);

  const isSolidarityStructure = useMemo(
    () =>
      status === "Association Loi 1901" ||
      status === "Coopérative (SCOP, SCIC) / Entreprise ESUS",
    [status]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const optionA = budget === "lt100" && isSolidarityStructure && impactYes;
    const optionB = budget === "100-500";

    if (optionA) {
      setResult({
        title: "Tarif Solidaire",
        amount: "≈ 2 450 €",
        message:
          "Félicitations ! Vous êtes éligible au Tarif Solidaire. Votre projet peut être réalisé pour environ 2 450 €.",
        highlight:
          "Préparez votre dernier compte de résultat pour valider l'éligibilité.",
      });
      return;
    }

    if (optionB) {
      setResult({
        title: "Tarif Équilibre",
        amount: "≈ 4 500 €",
        message:
          "Vous êtes éligible au Tarif Équilibre. C'est le tarif juste pour une structure en croissance.",
        highlight:
          "Nous ajustons le périmètre selon vos besoins (Astro ou Next.js).",
      });
      return;
    }

    setResult({
      title: "Tarif Soutien",
      amount: "À partir de 6 500 €",
      message:
        "Votre projet relève du Tarif Soutien. En choisissant ce tarif, vous permettez à Next Impact de libérer du temps pour accompagner une petite association cette année.",
      highlight: "Un accompagnement prioritaire et un impact direct pour l'ESS.",
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
              Test d'éligibilité
            </p>
            <p className="text-white font-googletexte mt-2">
              Qualifiez votre structure en moins de 2 minutes. Résultat immédiat selon vos réponses.
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
                placeholder="Ex : Les Jardins Solidaires"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-lightyellow focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white/70 font-googletexte">
                Statut juridique
              </label>
              <div ref={statusRef} className="relative">
                <button
                  type="button"
                  onClick={() => setStatusOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-white transition focus:border-lightyellow focus:outline-none"
                >
                  <span className="truncate text-white/60">{status}</span>
                  <ChevronDown className={`ml-2 h-4 w-4 shrink-0 text-white/50 transition-transform ${statusOpen ? "rotate-180" : ""}`} />
                </button>
                {statusOpen && (
                  <ul className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-darkblue/95 backdrop-blur-md shadow-lg">
                    {statuses.map((option) => (
                      <li key={option}>
                        <button
                          type="button"
                          onClick={() => { setStatus(option); setStatusOpen(false); }}
                          className={`w-full px-4 py-3 text-left text-sm font-googletexte transition hover:bg-lightyellow/10 hover:text-white ${
                            status === option ? "bg-lightyellow/10 text-lightyellow" : "text-white/80"
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
            <p className="text-sm text-white/70 font-googletexte">Budget annuel de fonctionnement</p>
            <div className="grid gap-3 md:grid-cols-3">
              <label className={`flex items-start gap-3 rounded-xl border px-4 py-3 cursor-pointer transition ${
                budget === "lt100" ? "border-lightyellow bg-lightyellow/10" : "border-white/10 bg-white/5"
              }`}>
                <input
                  type="radio"
                  name="budget"
                  value="lt100"
                  checked={budget === "lt100"}
                  onChange={() => setBudget("lt100")}
                  className="mt-1"
                />
                <div>
                  <p className="text-white font-googletitre text-base">Moins de 100 000 €</p>
                  <p className="text-sm text-white/60 font-googletexte">Eligible Tarif Solidaire</p>
                </div>
              </label>
              <label className={`flex items-start gap-3 rounded-xl border px-4 py-3 cursor-pointer transition ${
                budget === "100-500" ? "border-lightyellow bg-lightyellow/10" : "border-white/10 bg-white/5"
              }`}>
                <input
                  type="radio"
                  name="budget"
                  value="100-500"
                  checked={budget === "100-500"}
                  onChange={() => setBudget("100-500")}
                  className="mt-1"
                />
                <div>
                  <p className="text-white font-googletitre text-base">Entre 100 000 € et 500 000 €</p>
                  <p className="text-sm text-white/60 font-googletexte">Eligible Tarif Équilibre</p>
                </div>
              </label>
              <label className={`flex items-start gap-3 rounded-xl border px-4 py-3 cursor-pointer transition ${
                budget === "gt500" ? "border-lightyellow bg-lightyellow/10" : "border-white/10 bg-white/5"
              }`}>
                <input
                  type="radio"
                  name="budget"
                  value="gt500"
                  checked={budget === "gt500"}
                  onChange={() => setBudget("gt500")}
                  className="mt-1"
                />
                <div>
                  <p className="text-white font-googletitre text-base">Plus de 500 000 €</p>
                  <p className="text-sm text-white/60 font-googletexte">Tarif Soutien</p>
                </div>
              </label>
            </div>
          </div>

          {/* Étape 3 */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm text-white/70 font-googletexte">
                Votre activité relève-t-elle de l'intérêt général ou de l'utilité sociale ?
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setImpactYes(true)}
                  className={`flex-1 rounded-full border px-4 py-2 font-googletexte transition ${
                    impactYes ? "border-lightyellow bg-lightyellow/10 text-white" : "border-white/10 text-white/70"
                  }`}
                >
                  Oui
                </button>
                <button
                  type="button"
                  onClick={() => setImpactYes(false)}
                  className={`flex-1 rounded-full border px-4 py-2 font-googletexte transition ${
                    !impactYes ? "border-lightyellow bg-lightyellow/10 text-white" : "border-white/10 text-white/70"
                  }`}
                >
                  Non
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-white/70 font-googletexte">Domaine d'intervention</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {domains.map((domain) => (
                  <label
                    key={domain}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 cursor-pointer transition ${
                      selectedDomains.includes(domain)
                        ? "border-lightyellow bg-lightyellow/10"
                        : "border-white/10 bg-white/5"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedDomains.includes(domain)}
                      onChange={() => toggleSelection(domain, setSelectedDomains)}
                    />
                    <span className="text-white/80 font-googletexte text-sm">{domain}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Étape 4 */}
          <div className="space-y-2">
            <p className="text-sm text-white/70 font-googletexte">Pourquoi choisissez-vous le Headless ?</p>
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
                  />
                  <span className="text-white/80 font-googletexte text-sm">{reason}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" className="rounded-full bg-lightyellow text-darkblue hover:bg-lightyellow/90 font-googletitre font-semibold">
              Voir mon tarif
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 text-white/60 font-googletexte text-sm">
              <Info className="h-4 w-4" />
              <span className="text-white/60">Calcul basé sur votre statut et votre budget.</span>
            </div>
          </div>
        </form>

        {result && (
          <div className="mt-8 rounded-2xl border border-lightyellow/30 bg-lightyellow/10 p-6 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-lightyellow">
              <CheckCircle2 className="h-5 w-5" />
              <p className="text-sm uppercase tracking-widest font-googletexte text-extralightblue">Résultat</p>
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
