"use client";

// Prototype IA : jetable ou maintenable ? — outil « IA & code » du hub. L'IA
// produit vite un prototype ; le rendre fiable, sûr et maintenable est un autre
// métier. Checklist 9 facteurs → enjeu de production /100 et verdict directionnel
// à 3 paliers : proto OK / à cadrer / à reconstruire. CTA adaptée (Visio / Roadmap).
// Verdict rendu via une échelle 3 paliers (pas un score bon/mauvais). Modèle :
// components/outils/reparer-ou-refaire.tsx.

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  Info,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import ConseilModal from "@/components/ui/conseil-modal";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { StepTransition } from "@/components/ui/step-transition";

// ok = aucun enjeu de prod sur ce point ; ko = exige un vrai build maintenable.
type Status = "ok" | "warn" | "ko";

interface FactorOption {
  value: string;
  labelFr: string;
  labelEn: string;
  status: Status;
  detailFr: string;
  detailEn: string;
}

interface Factor {
  id: string;
  criterionFr: string;
  criterionEn: string;
  questionFr: string;
  questionEn: string;
  weight: number;
  options: FactorOption[];
}

const FACTORS: Factor[] = [
  {
    id: "usage",
    criterionFr: "Finalité",
    criterionEn: "Purpose",
    questionFr: "À quoi sert ce prototype généré avec l'IA ?",
    questionEn: "What is this AI-generated prototype for?",
    weight: 12,
    options: [
      { value: "demo", labelFr: "Tester une idée / démo interne", labelEn: "Test an idea / internal demo", status: "ok",
        detailFr: "Usage parfait pour l'IA : prototyper vite, jeter sans regret.", detailEn: "Perfect AI use: prototype fast, throw away without regret." },
      { value: "pilote", labelFr: "Un pilote avec de vrais cas", labelEn: "A pilot with real cases", status: "warn",
        detailFr: "Zone grise : utile pour apprendre, à cadrer avant d'aller plus loin.", detailEn: "Grey zone: useful to learn, scope before going further." },
      { value: "produit", labelFr: "Un produit critique pour mon activité", labelEn: "A product critical to my business", status: "ko",
        detailFr: "Enjeu fort : un produit qui compte ne tient pas sur un proto vibe-codé.", detailEn: "High stakes: a product that matters won't hold on vibe-coded scaffolding." },
    ],
  },
  {
    id: "utilisateurs",
    criterionFr: "Utilisateurs",
    criterionEn: "Users",
    questionFr: "Des utilisateurs réels vont-ils s'en servir ?",
    questionEn: "Will real users actually use it?",
    weight: 14,
    options: [
      { value: "moi", labelFr: "Non, juste moi", labelEn: "No, just me", status: "ok",
        detailFr: "Sans public, les exigences de fiabilité restent basses.", detailEn: "With no audience, reliability requirements stay low." },
      { value: "cercle", labelFr: "Un petit cercle de confiance", labelEn: "A small trusted circle", status: "warn",
        detailFr: "Tolérable, mais les bugs commencent à coûter du temps et de la crédibilité.", detailEn: "Tolerable, but bugs start costing time and credibility." },
      { value: "public", labelFr: "Oui, public ou clients", labelEn: "Yes, public or clients", status: "ko",
        detailFr: "Des vrais utilisateurs imposent fiabilité, sécurité et support.", detailEn: "Real users demand reliability, security and support." },
    ],
  },
  {
    id: "donnees",
    criterionFr: "Données",
    criterionEn: "Data",
    questionFr: "Manipule-t-il des données personnelles ou sensibles ?",
    questionEn: "Does it handle personal or sensitive data?",
    weight: 16,
    options: [
      { value: "non", labelFr: "Non, aucune donnée", labelEn: "No data at all", status: "ok",
        detailFr: "Pas de données = pas de risque RGPD ni de fuite : le proto peut vivre.", detailEn: "No data = no GDPR risk or leak: the prototype can live." },
      { value: "basiques", labelFr: "Quelques données perso basiques", labelEn: "Some basic personal data", status: "warn",
        detailFr: "À cadrer : même un e-mail collecté engage votre responsabilité (RGPD).", detailEn: "To scope: even a collected email triggers your GDPR responsibility." },
      { value: "sensibles", labelFr: "Oui, sensibles / paiement / santé", labelEn: "Yes, sensitive / payment / health", status: "ko",
        detailFr: "Données sensibles : sécurité et conformité exigent une vraie base, pas un proto.", detailEn: "Sensitive data: security and compliance demand a real base, not a prototype." },
    ],
  },
  {
    id: "auth",
    criterionFr: "Accès / comptes",
    criterionEn: "Access / accounts",
    questionFr: "Y a-t-il des comptes, des rôles ou des paiements ?",
    questionEn: "Are there accounts, roles or payments?",
    weight: 14,
    options: [
      { value: "non", labelFr: "Non, accès libre", labelEn: "No, open access", status: "ok",
        detailFr: "Sans authentification, la surface de risque reste faible.", detailEn: "Without authentication, the risk surface stays small." },
      { value: "login", labelFr: "Un login simple", labelEn: "A simple login", status: "warn",
        detailFr: "À sécuriser : l'authentification générée par IA est souvent fragile.", detailEn: "To secure: AI-generated authentication is often fragile." },
      { value: "roles", labelFr: "Rôles, accès ou paiement", labelEn: "Roles, access or payment", status: "ko",
        detailFr: "Critique : droits et paiements mal faits exposent à la fraude et aux fuites.", detailEn: "Critical: poorly built permissions and payments expose you to fraud and leaks." },
    ],
  },
  {
    id: "maintenance",
    criterionFr: "Durée de vie",
    criterionEn: "Lifespan",
    questionFr: "Doit-il vivre et évoluer dans le temps ?",
    questionEn: "Must it live and evolve over time?",
    weight: 12,
    options: [
      { value: "jetable", labelFr: "Non, c'est jetable", labelEn: "No, it's throwaway", status: "ok",
        detailFr: "Jetable assumé : inutile d'investir dans la robustesse.", detailEn: "Throwaway by design: no need to invest in robustness." },
      { value: "ponctuel", labelFr: "Je le ferai évoluer ponctuellement", labelEn: "I'll evolve it occasionally", status: "warn",
        detailFr: "À clarifier : sans base saine, chaque évolution devient plus risquée.", detailEn: "To clarify: without a clean base, each change gets riskier." },
      { value: "durable", labelFr: "Oui, il doit durer et grandir", labelEn: "Yes, it must last and grow", status: "ko",
        detailFr: "Pour durer, il faut un code maintenable — rarement le cas d'un proto IA.", detailEn: "To last, it needs maintainable code — rarely the case for an AI prototype." },
    ],
  },
  {
    id: "comprehension",
    criterionFr: "Maîtrise du code",
    criterionEn: "Code control",
    questionFr: "Quelqu'un comprend-il le code généré ?",
    questionEn: "Does anyone understand the generated code?",
    weight: 8,
    options: [
      { value: "egal", labelFr: "Peu importe, c'est jetable", labelEn: "Doesn't matter, throwaway", status: "ok",
        detailFr: "Si on jette, comprendre le code n'a pas d'importance.", detailEn: "If you throw it away, understanding the code doesn't matter." },
      { value: "partiel", labelFr: "En partie", labelEn: "Partly", status: "warn",
        detailFr: "Risque modéré : les zones non comprises deviennent ingérables avec le temps.", detailEn: "Moderate risk: the parts you don't grasp become unmanageable over time." },
      { value: "boitenoire", labelFr: "Non, personne ne sait comment ça marche", labelEn: "No, nobody knows how it works", status: "ko",
        detailFr: "Boîte noire : un code que personne ne maîtrise est une dette dès le départ.", detailEn: "Black box: code nobody controls is debt from day one." },
    ],
  },
  {
    id: "fiabilite",
    criterionFr: "Fiabilité",
    criterionEn: "Reliability",
    questionFr: "Quel niveau de fiabilité est attendu ?",
    questionEn: "What reliability level is expected?",
    weight: 10,
    options: [
      { value: "tolerant", labelFr: "Peu importe si ça casse", labelEn: "Fine if it breaks", status: "ok",
        detailFr: "Tolérance aux pannes élevée : le proto fait le job.", detailEn: "High failure tolerance: the prototype does the job." },
      { value: "moyen", labelFr: "Quelques bugs tolérables", labelEn: "A few bugs are tolerable", status: "warn",
        detailFr: "À surveiller : la dette de fiabilité grandit vite en usage réel.", detailEn: "To watch: reliability debt grows fast in real use." },
      { value: "critique", labelFr: "Ça doit être fiable, sans faille", labelEn: "It must be reliable, no failures", status: "ko",
        detailFr: "Exigence forte : la fiabilité se construit (tests, monitoring), elle ne s'improvise pas.", detailEn: "High bar: reliability is engineered (tests, monitoring), not improvised." },
    ],
  },
  {
    id: "evolutivite",
    criterionFr: "Montée en charge",
    criterionEn: "Scale",
    questionFr: "Va-t-il monter en charge ou en fonctionnalités ?",
    questionEn: "Will it scale in load or features?",
    weight: 8,
    options: [
      { value: "fige", labelFr: "Non, figé", labelEn: "No, frozen", status: "ok",
        detailFr: "Pas de croissance : l'architecture du proto suffit.", detailEn: "No growth: the prototype's architecture is enough." },
      { value: "peu", labelFr: "Un peu", labelEn: "A little", status: "warn",
        detailFr: "À anticiper : quelques ajouts peuvent vite atteindre les limites du proto.", detailEn: "To anticipate: a few additions can quickly hit the prototype's limits." },
      { value: "forte", labelFr: "Oui, croissance attendue", labelEn: "Yes, growth expected", status: "ko",
        detailFr: "La montée en charge demande une base pensée pour, dès le départ.", detailEn: "Scaling needs a base designed for it, from the start." },
    ],
  },
  {
    id: "risque",
    criterionFr: "Coût d'un échec",
    criterionEn: "Cost of failure",
    questionFr: "Que se passe-t-il si ça plante ou fuite ?",
    questionEn: "What happens if it crashes or leaks?",
    weight: 6,
    options: [
      { value: "rien", labelFr: "Rien de grave", labelEn: "Nothing serious", status: "ok",
        detailFr: "Faible enjeu : l'échec est sans conséquence réelle.", detailEn: "Low stakes: failure has no real consequence." },
      { value: "genant", labelFr: "Gênant mais gérable", labelEn: "Annoying but manageable", status: "warn",
        detailFr: "À cadrer : un incident peut coûter du temps et un peu de crédibilité.", detailEn: "To scope: an incident can cost time and some credibility." },
      { value: "grave", labelFr: "Grave (image, légal, argent)", labelEn: "Serious (brand, legal, money)", status: "ko",
        detailFr: "Quand l'échec coûte cher, on ne met pas un proto en production.", detailEn: "When failure is costly, you don't ship a prototype to production." },
    ],
  },
];

const TOTAL_WEIGHT = FACTORS.reduce((s, f) => s + f.weight, 0);

// Défauts neutres (option médiane « warn ») — un résultat se calcule toujours.
const INITIAL: Record<string, string> = {
  usage: "pilote",
  utilisateurs: "cercle",
  donnees: "basiques",
  auth: "login",
  maintenance: "ponctuel",
  comprehension: "partiel",
  fiabilite: "moyen",
  evolutivite: "peu",
  risque: "genant",
};

const BTN_PRIMARY =
  "inline-flex h-11 items-center gap-2 border border-charcoal bg-vermilion px-5 font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-vermilion-bright";
const BTN_GHOST =
  "group inline-flex h-11 items-center gap-1.5 rounded-sm border border-dark-gray px-5 font-mono text-[12px] uppercase tracking-[0.08em] text-foreground transition-colors hover:bg-jet";
const LABEL_MONO =
  "block font-mono text-[10px] uppercase tracking-[0.18em] text-mid-gray";

function statusBorderClass(status: Status) {
  if (status === "ok") return "border-l-accent-secondary";
  if (status === "warn") return "border-l-accent";
  return "border-l-vermilion";
}

// 0 = proto OK, 1 = à cadrer, 2 = à reconstruire.
function getCtas(tier: 0 | 1 | 2) {
  if (tier === 0)
    return {
      primary: { fr: "En parler en visio", en: "Talk it through on a call", href: "/conseil" },
      secondary: { fr: "Choisir avec le Sélecteur", en: "Choose with the selector", href: "/outils/selecteur-techno" },
    };
  if (tier === 1)
    return {
      primary: { fr: "Cadrer en visio — 150 €", en: "Scope on a call — €150", href: "/conseil" },
      secondary: { fr: "Voir les solutions web", en: "See the web solutions", href: "/solutions-web" },
    };
  return {
    primary: { fr: "Cadrer l'architecture", en: "Scope the architecture", href: "/conseil" },
    secondary: { fr: "Voir les solutions web", en: "See the web solutions", href: "/solutions-web" },
  };
}

function StakesScale({ stakes, tier }: { stakes: number; tier: 0 | 1 | 2 }) {
  const tone =
    tier === 0 ? "bg-accent-secondary" : tier === 1 ? "bg-accent" : "bg-vermilion";
  return (
    <div className="mt-5">
      <div className="relative h-1.5 w-full bg-dark-gray">
        <div className={`absolute inset-y-0 left-0 ${tone}`} style={{ width: `${stakes}%` }} />
        <span className="absolute inset-y-0 w-px bg-obsidian" style={{ left: "30%" }} />
        <span className="absolute inset-y-0 w-px bg-obsidian" style={{ left: "60%" }} />
        <span
          className="absolute -top-1 h-3.5 w-0.5 -translate-x-1/2 bg-foreground"
          style={{ left: `${stakes}%` }}
        />
      </div>
    </div>
  );
}

export default function PrototypeIa() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const [state, setState] = useState<Record<string, string>>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!submitted || submitCount === 0) return;
    resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [submitted, submitCount]);

  const results = useMemo(() => {
    return FACTORS.map((f) => {
      const opt = f.options.find((o) => o.value === state[f.id]) ?? f.options[0];
      return { factor: f, opt };
    });
  }, [state]);

  // Enjeu de production : ko = pleine valeur, warn = moitié, ok = 0. Haut = exige un vrai build.
  const stakes = useMemo(() => {
    let total = 0;
    results.forEach(({ factor, opt }) => {
      if (opt.status === "ko") total += factor.weight;
      else if (opt.status === "warn") total += factor.weight * 0.5;
    });
    return Math.round((total / TOTAL_WEIGHT) * 100);
  }, [results]);

  const verdict = useMemo<{
    tier: 0 | 1 | 2;
    titleFr: string;
    titleEn: string;
    fr: string;
    en: string;
    toneClass: string;
  }>(() => {
    if (stakes < 30)
      return {
        tier: 0,
        titleFr: "Le prototype peut rester tel quel",
        titleEn: "The prototype can stay as is",
        fr: "Enjeu faible : c'est un bon usage de l'IA. Continuez à itérer en proto, sans surinvestir dans la robustesse.",
        en: "Low stakes: this is a good use of AI. Keep iterating as a prototype, without over-investing in robustness.",
        toneClass: "text-accent-secondary",
      };
    if (stakes < 60)
      return {
        tier: 1,
        titleFr: "À cadrer avant d'aller plus loin",
        titleEn: "To scope before going further",
        fr: "Vraie valeur, vrais risques. Avant d'ouvrir à des utilisateurs, cadrez les données, la sécurité et la suite : ce qui se garde, ce qui se reconstruit.",
        en: "Real value, real risks. Before opening it to users, scope the data, security and the path: what to keep, what to rebuild.",
        toneClass: "text-accent",
      };
    return {
      tier: 2,
      titleFr: "À reconstruire pour la production",
      titleEn: "To rebuild for production",
      fr: "L'IA a prouvé l'idée — gardez-la comme maquette. Mais utilisateurs, données et enjeux imposent une base fiable, sûre et maintenable.",
      en: "AI proved the idea — keep it as a mockup. But users, data and stakes call for a reliable, secure, maintainable base.",
      toneClass: "text-vermilion",
    };
  }, [stakes]);

  const ctas = getCtas(verdict.tier);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setSubmitCount((c) => c + 1);
    try {
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.(
        "event",
        "prototype_ia_result",
        { tier: verdict.tier, stakes }
      );
    } catch {
      /* analytics absent — on ignore */
    }
  };

  const reset = () => {
    setState(INITIAL);
    setSubmitted(false);
  };

  return (
    <Reveal className="w-full border border-dark-gray bg-obsidian">
      {/* Header */}
      <div className="flex items-start gap-4 border-b border-dark-gray px-6 py-6 lg:px-8">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-dark-gray bg-jet">
          <Bot className="h-[1.125rem] w-[1.125rem] text-vermilion" />
        </div>
        <div>
          <p className={LABEL_MONO}>
            {isEn ? "AI prototype: throwaway or maintainable?" : "Prototype IA : jetable ou maintenable ?"}
          </p>
          <p className="mt-2 font-inter-tight text-[15px] leading-relaxed text-foreground">
            {isEn
              ? "You generated something with AI — and now? Answer 9 checks to know whether to keep iterating, scope it, or rebuild it properly before production."
              : "Vous avez généré un truc avec l'IA — et maintenant ? Répondez à 9 vérifications pour savoir s'il faut continuer en proto, le cadrer, ou le reconstruire proprement avant la production."}
          </p>
        </div>
      </div>

      {/* Résultat — transition d'étape standard (fade + slide 8 px) */}
      <StepTransition stepKey={submitted ? "resultat" : "formulaire"}>
      {submitted && (
        <div ref={resultRef} className="scroll-mt-24 border-b border-dark-gray">
        {/* Verdict en cascade — les blocs du résultat apparaissent en Stagger */}
        <Stagger className="flex flex-col gap-8 px-6 py-8 lg:px-8">
          {/* Verdict + échelle 3 paliers */}
          <StaggerItem className="border border-dark-gray bg-obsidian p-6 lg:p-8">
            <p className={LABEL_MONO}>{isEn ? "Verdict" : "Verdict"}</p>
            <h3 className={`mt-3 text-2xl font-light tracking-tight ${verdict.toneClass}`}>
              {isEn ? verdict.titleEn : verdict.titleFr}
            </h3>
            <StakesScale stakes={stakes} tier={verdict.tier} />
            <div className="mt-2.5 flex justify-between font-mono text-[10px] uppercase tracking-[0.1em]">
              <span className={verdict.tier === 0 ? "text-accent-secondary" : "text-mid-gray"}>
                {isEn ? "Proto OK" : "Proto OK"}
              </span>
              <span className={verdict.tier === 1 ? "text-accent" : "text-mid-gray"}>
                {isEn ? "To scope" : "À cadrer"}
              </span>
              <span className={verdict.tier === 2 ? "text-vermilion" : "text-mid-gray"}>
                {isEn ? "Rebuild" : "À reconstruire"}
              </span>
            </div>
            <p className={`mt-6 font-inter-tight text-[15px] leading-relaxed ${verdict.toneClass}`}>
              {isEn ? verdict.en : verdict.fr}
            </p>
          </StaggerItem>

          {/* Détail par facteur */}
          <StaggerItem>
            <p className={`${LABEL_MONO} mb-4`}>
              {isEn ? "What raises the bar" : "Ce qui relève l'exigence"}
            </p>
            <div className="border border-dark-gray">
              {results.map(({ factor, opt }, i) => (
                <div
                  key={factor.id}
                  className={`flex items-start gap-3 border-l-[3px] px-4 py-3.5 ${statusBorderClass(
                    opt.status
                  )} ${i < results.length - 1 ? "border-b border-b-dark-gray" : ""}`}
                >
                  {opt.status === "ok" ? (
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-accent-secondary" />
                  ) : opt.status === "warn" ? (
                    <AlertTriangle size={16} className="mt-0.5 shrink-0 text-accent" />
                  ) : (
                    <XCircle size={16} className="mt-0.5 shrink-0 text-vermilion" />
                  )}
                  <div>
                    <p className="font-inter-tight text-sm font-medium text-foreground">
                      {isEn ? factor.criterionEn : factor.criterionFr}
                    </p>
                    <p className="mt-1 font-inter-tight text-[13px] leading-relaxed text-mid-gray">
                      {isEn ? opt.detailEn : opt.detailFr}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </StaggerItem>

          {/* Note anti-cannibalisation */}
          <StaggerItem className="flex gap-3 border border-dark-gray bg-jet px-4 py-4">
            <Info size={14} className="mt-0.5 shrink-0 text-mid-gray" />
            <p className="font-inter-tight text-[13px] leading-relaxed text-mid-gray">
              {isEn
                ? "AI produces a prototype fast. Making it reliable, secure and maintainable is another craft. This signal orients you — a call (or architecture advice) frames the move from prototype to product."
                : "L'IA produit vite un prototype. Le rendre fiable, sûr et maintenable est un autre métier. Ce signal vous oriente — une visio (ou un conseil architecture) cadre le passage du prototype au produit."}
            </p>
          </StaggerItem>

          {/* Prochaine étape (adaptée au verdict) */}
          <StaggerItem className="flex flex-wrap items-center gap-3">
            <Link
              href={ctas.primary.href as Parameters<typeof Link>[0]["href"]}
              className={BTN_PRIMARY}
            >
              {isEn ? ctas.primary.en : ctas.primary.fr}
              <ArrowRight size={14} />
            </Link>
            <Link
              href={ctas.secondary.href as Parameters<typeof Link>[0]["href"]}
              className={BTN_GHOST}
            >
              {isEn ? ctas.secondary.en : ctas.secondary.fr}
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <button type="button" onClick={reset} className={BTN_GHOST}>
              <RotateCcw size={13} />
              {isEn ? "Restart" : "Refaire"}
            </button>
          </StaggerItem>
          <ConseilModal source="prototype-ia" />
        </Stagger>
        </div>
      )}
      </StepTransition>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="px-6 py-8 lg:px-8">
        <div className="mb-8 grid gap-x-8 gap-y-7 sm:grid-cols-2">
          {FACTORS.map((f) => (
            <div key={f.id}>
              <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.16em] text-accent-secondary">
                {isEn ? f.criterionEn : f.criterionFr}
              </p>
              <p className="mb-2.5 font-inter-tight text-[13px] text-mid-gray">
                {isEn ? f.questionEn : f.questionFr}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {f.options.map((opt) => {
                  const selected = state[f.id] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setState((s) => ({ ...s, [f.id]: opt.value }))}
                      className={
                        "rounded-sm border px-3.5 py-1.5 font-inter-tight text-[13px] transition-colors " +
                        (selected
                          ? "border-l-[3px] border-l-accent-secondary border-dark-gray bg-jet text-foreground"
                          : "border-dark-gray text-mid-gray hover:bg-jet hover:text-foreground")
                      }
                    >
                      {isEn ? opt.labelEn : opt.labelFr}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <button type="submit" className={BTN_PRIMARY}>
          {isEn ? "Assess my prototype" : "Évaluer mon prototype"}
          <ArrowRight size={14} />
        </button>
      </form>
    </Reveal>
  );
}
