"use client";

// No-code, SaaS ou sur-mesure ? — outil Tier 2 (rubriques Choisir / Outils
// métier). Recommandateur focalisé sur l'axe build / buy / no-code : 8 critères
// (spécificité, existant, budget, autonomie, données, volume, intégrations,
// time-to-value) → une famille parmi 3 + classement + aiguilleur. Pour la
// question plus large (WordPress, Headless, réparer…), renvoie à la Boussole.
// Modèle : components/outils/boussole.tsx.

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Blocks, Info, RotateCcw } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import NewsletterModal from "@/components/ui/newsletter-modal";
import { Reveal } from "@/components/ui/reveal";
import { StepTransition } from "@/components/ui/step-transition";

type Family = "nocode" | "saas" | "surmesure";

// Ordre d'affichage + départage des ex æquo (simplicité / coût croissant).
const FAMILY_ORDER: Family[] = ["nocode", "saas", "surmesure"];

interface FamilyInfo {
  labelFr: string;
  labelEn: string;
  summaryFr: string;
  summaryEn: string;
  links: { labelFr: string; labelEn: string; href: string }[];
  next: { labelFr: string; labelEn: string; href: string };
}

const FAMILIES: Record<Family, FamilyInfo> = {
  nocode: {
    labelFr: "No-code (Webflow, Framer, Airtable…)",
    labelEn: "No-code (Webflow, Framer, Airtable…)",
    summaryFr:
      "Vous gardez la main, vous lancez vite, à petit budget. Idéal pour un besoin standard ou un premier produit — surveillez le SEO, la propriété des données et les limites quand ça grandit.",
    summaryEn:
      "You stay in control, launch fast, on a small budget. Ideal for a standard need or a first product — watch SEO, data ownership and the ceilings as it grows.",
    links: [
      { labelFr: "En parler en visio", labelEn: "Talk it through on a call", href: "/conseil" },
      { labelFr: "Le blog techno", labelEn: "The tech blog", href: "/blog" },
    ],
    next: { labelFr: "Valider en visio — 150 €", labelEn: "Validate on a call — €150", href: "/conseil" },
  },
  saas: {
    labelFr: "Un logiciel du marché (SaaS)",
    labelEn: "An off-the-shelf tool (SaaS)",
    summaryFr:
      "Si un outil existant couvre l'essentiel, l'acheter coûte souvent bien moins cher que le construire. Comparez les options et vérifiez la réversibilité avant de vous engager.",
    summaryEn:
      "If an existing tool covers the essentials, buying it is often far cheaper than building it. Compare the options and check reversibility before committing.",
    links: [
      { labelFr: "Un avis indépendant en visio", labelEn: "An independent opinion on a call", href: "/conseil" },
      { labelFr: "Décrypter un devis reçu", labelEn: "Decode a quote you received", href: "/outils/decrypteur-devis" },
    ],
    next: { labelFr: "Sécuriser le choix — avis indépendant", labelEn: "Secure the choice — independent opinion", href: "/conseil" },
  },
  surmesure: {
    labelFr: "Développement sur-mesure",
    labelEn: "Custom development",
    summaryFr:
      "Besoin spécifique, données sensibles, intégrations complexes : le sur-mesure se justifie. À cadrer précisément (conseil architecture) avant de construire, pour investir au bon endroit.",
    summaryEn:
      "Specific need, sensitive data, complex integrations: custom is justified. To be scoped precisely (architecture advice) before building, so you invest in the right place.",
    links: [
      { labelFr: "Générer un cahier des charges", labelEn: "Generate a project brief", href: "/cahier-des-charges" },
      { labelFr: "Diagnostic projet", labelEn: "Project diagnostic", href: "/solutions-web/eligibilite" },
    ],
    next: { labelFr: "Cadrer l'architecture", labelEn: "Scope the architecture", href: "/conseil" },
  },
};

interface Option {
  value: string;
  labelFr: string;
  labelEn: string;
  scores: Partial<Record<Family, number>>;
}

interface Question {
  id: string;
  criterionFr: string;
  criterionEn: string;
  labelFr: string;
  labelEn: string;
  options: Option[];
}

const QUESTIONS: Question[] = [
  {
    id: "specificite",
    criterionFr: "Spécificité",
    criterionEn: "Specificity",
    labelFr: "Votre besoin est-il standard ou très spécifique ?",
    labelEn: "Is your need standard or very specific?",
    options: [
      { value: "standard", labelFr: "Standard, comme beaucoup d'autres", labelEn: "Standard, like many others", scores: { saas: 3, nocode: 1 } },
      { value: "particulier", labelFr: "Un peu particulier", labelEn: "Somewhat particular", scores: { nocode: 2, saas: 1 } },
      { value: "specifique", labelFr: "Très spécifique à mon métier", labelEn: "Very specific to my field", scores: { surmesure: 3 } },
    ],
  },
  {
    id: "existant",
    criterionFr: "Existant",
    criterionEn: "Existing tools",
    labelFr: "Un logiciel fait-il déjà ça sur le marché ?",
    labelEn: "Does a tool already do this on the market?",
    options: [
      { value: "oui", labelFr: "Oui, plusieurs", labelEn: "Yes, several", scores: { saas: 3 } },
      { value: "adapter", labelFr: "Peut-être, à adapter", labelEn: "Maybe, to adapt", scores: { nocode: 2, saas: 1 } },
      { value: "non", labelFr: "Non, rien ne correspond", labelEn: "No, nothing fits", scores: { surmesure: 3 } },
    ],
  },
  {
    id: "budget",
    criterionFr: "Budget",
    criterionEn: "Budget",
    labelFr: "Quel budget pour cet outil ?",
    labelEn: "What's the budget for this tool?",
    options: [
      { value: "serre", labelFr: "Serré (abo léger / < 3 000 €)", labelEn: "Tight (light subscription / < €3,000)", scores: { nocode: 2, saas: 2 } },
      { value: "moyen", labelFr: "Moyen", labelEn: "Medium", scores: { nocode: 1, saas: 1, surmesure: 1 } },
      { value: "eleve", labelFr: "Confortable (> 10 000 €)", labelEn: "Comfortable (> €10,000)", scores: { surmesure: 3 } },
    ],
  },
  {
    id: "autonomie",
    criterionFr: "Autonomie",
    criterionEn: "Autonomy",
    labelFr: "Voulez-vous tout gérer et modifier vous-même ?",
    labelEn: "Do you want to manage and edit it yourself?",
    options: [
      { value: "oui", labelFr: "Oui, sans développeur", labelEn: "Yes, without a developer", scores: { nocode: 3, saas: 1 } },
      { value: "partiel", labelFr: "En partie", labelEn: "Partly", scores: { nocode: 1, saas: 1 } },
      { value: "delegue", labelFr: "Non, je délègue", labelEn: "No, I delegate", scores: { surmesure: 2, saas: 1 } },
    ],
  },
  {
    id: "donnees",
    criterionFr: "Données",
    criterionEn: "Data",
    labelFr: "Vos données ?",
    labelEn: "Your data?",
    options: [
      { value: "standard", labelFr: "Standard, hébergées par l'outil : ok", labelEn: "Standard, hosted by the tool: fine", scores: { saas: 2, nocode: 1 } },
      { value: "maitrise", labelFr: "Je veux les maîtriser", labelEn: "I want to control them", scores: { nocode: 1, surmesure: 1 } },
      { value: "sensibles", labelFr: "Sensibles / structure très spécifique", labelEn: "Sensitive / very specific structure", scores: { surmesure: 3 } },
    ],
  },
  {
    id: "volume",
    criterionFr: "Volume",
    criterionEn: "Volume",
    labelFr: "Quel volume d'usage ou d'utilisateurs ?",
    labelEn: "What usage or user volume?",
    options: [
      { value: "faible", labelFr: "Faible / interne", labelEn: "Low / internal", scores: { nocode: 2, saas: 1 } },
      { value: "moyen", labelFr: "Moyen", labelEn: "Medium", scores: { saas: 2, nocode: 1 } },
      { value: "fort", labelFr: "Fort / croissance attendue", labelEn: "High / growth expected", scores: { surmesure: 2, saas: 1 } },
    ],
  },
  {
    id: "integrations",
    criterionFr: "Intégrations",
    criterionEn: "Integrations",
    labelFr: "Besoin de connecter d'autres outils ?",
    labelEn: "Need to connect other tools?",
    options: [
      { value: "non", labelFr: "Non / peu", labelEn: "No / little", scores: { nocode: 1, saas: 1 } },
      { value: "standard", labelFr: "Quelques connecteurs standard", labelEn: "A few standard connectors", scores: { saas: 2, nocode: 1 } },
      { value: "complexe", labelFr: "Intégrations complexes / sur-mesure", labelEn: "Complex / custom integrations", scores: { surmesure: 3 } },
    ],
  },
  {
    id: "timetovalue",
    criterionFr: "Time-to-value",
    criterionEn: "Time-to-value",
    labelFr: "À quelle vitesse devez-vous lancer ?",
    labelEn: "How fast must you launch?",
    options: [
      { value: "vite", labelFr: "Très vite", labelEn: "Very fast", scores: { saas: 2, nocode: 2 } },
      { value: "semaines", labelFr: "Quelques semaines", labelEn: "A few weeks", scores: { nocode: 1, saas: 1, surmesure: 1 } },
      { value: "souple", labelFr: "Le délai n'est pas la contrainte", labelEn: "Timing isn't the constraint", scores: { surmesure: 2 } },
    ],
  },
];

// Défauts neutres — un résultat se calcule toujours.
const INITIAL: Record<string, string> = {
  specificite: "particulier",
  existant: "adapter",
  budget: "moyen",
  autonomie: "partiel",
  donnees: "standard",
  volume: "moyen",
  integrations: "standard",
  timetovalue: "semaines",
};

const BTN_PRIMARY =
  "inline-flex h-11 items-center gap-2 border border-charcoal bg-vermilion px-5 font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-vermilion-bright";
const BTN_GHOST =
  "group inline-flex h-11 items-center gap-1.5 rounded-sm border border-dark-gray px-5 font-mono text-[12px] uppercase tracking-[0.08em] text-foreground transition-colors hover:bg-jet";
const LABEL_MONO =
  "block font-mono text-[10px] uppercase tracking-[0.18em] text-mid-gray";

export default function NocodeSaasSurmesure() {
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

  const scores = useMemo<Record<Family, number>>(() => {
    const totals: Record<Family, number> = { nocode: 0, saas: 0, surmesure: 0 };
    QUESTIONS.forEach((q) => {
      const opt = q.options.find((o) => o.value === state[q.id]);
      if (!opt) return;
      (Object.keys(opt.scores) as Family[]).forEach((f) => {
        totals[f] += opt.scores[f] ?? 0;
      });
    });
    return totals;
  }, [state]);

  const ranking = useMemo(() => {
    return [...FAMILY_ORDER].sort((a, b) => {
      if (scores[b] !== scores[a]) return scores[b] - scores[a];
      return FAMILY_ORDER.indexOf(a) - FAMILY_ORDER.indexOf(b);
    });
  }, [scores]);

  const winner = ranking[0];
  const maxScore = Math.max(1, scores[winner]);
  const info = FAMILIES[winner];

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setSubmitCount((c) => c + 1);
    try {
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.(
        "event",
        "nocode_saas_surmesure_result",
        { family: winner }
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
          <Blocks className="h-[1.125rem] w-[1.125rem] text-vermilion" />
        </div>
        <div>
          <p className={LABEL_MONO}>
            {isEn ? "No-code, SaaS or custom?" : "No-code, SaaS ou sur-mesure ?"}
          </p>
          <p className="mt-2 font-inter-tight text-[15px] leading-relaxed text-foreground">
            {isEn
              ? "Webflow, an existing SaaS, or custom development? Answer 8 questions to see which fits your tool — and the next step for your case."
              : "Webflow, un SaaS existant, ou du développement sur-mesure ? Répondez à 8 questions pour voir ce qui correspond à votre outil — et la prochaine étape pour votre cas."}
          </p>
        </div>
      </div>

      {/* Résultat — transition d'étape standard (fade + slide 8 px) */}
      <StepTransition stepKey={submitted ? "resultat" : "formulaire"}>
      {submitted && (
        <div
          ref={resultRef}
          className="flex scroll-mt-24 flex-col gap-8 border-b border-dark-gray px-6 py-8 lg:px-8"
        >
          <div className="grid gap-px overflow-hidden border border-dark-gray bg-dark-gray md:grid-cols-[3fr_2fr]">
            <div className="flex flex-col justify-center bg-obsidian p-6 lg:p-8">
              <p className={LABEL_MONO}>{isEn ? "Recommended" : "Recommandé"}</p>
              <h3 className="mt-3 text-2xl font-light tracking-tight text-accent-secondary">
                {isEn ? info.labelEn : info.labelFr}
              </h3>
              <p className="mt-3 font-inter-tight text-[15px] leading-relaxed text-mid-gray">
                {isEn ? info.summaryEn : info.summaryFr}
              </p>
            </div>
            <div className="flex flex-col justify-center bg-obsidian p-6 lg:p-8">
              <p className={`${LABEL_MONO} mb-4`}>
                {isEn ? "How the options rank" : "Le classement des options"}
              </p>
              <div className="flex flex-col gap-2.5">
                {ranking.map((f, i) => {
                  const pct = Math.round((scores[f] / maxScore) * 100);
                  return (
                    <div key={f} className="flex items-center gap-3">
                      <span className="w-1/2 shrink-0 truncate font-inter-tight text-[12px] text-mid-gray">
                        {isEn ? FAMILIES[f].labelEn : FAMILIES[f].labelFr}
                      </span>
                      <div className="relative h-1.5 flex-1 bg-dark-gray">
                        <div
                          className={i === 0 ? "absolute inset-y-0 left-0 bg-accent-secondary" : "absolute inset-y-0 left-0 bg-mid-gray/40"}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Par où commencer */}
          <div>
            <p className={`${LABEL_MONO} mb-4`}>{isEn ? "Where to start" : "Par où commencer"}</p>
            <div className="border border-dark-gray">
              {info.links.map((l, i) => (
                <Link
                  key={l.href + l.labelFr}
                  href={l.href as Parameters<typeof Link>[0]["href"]}
                  className={
                    "group flex items-center justify-between gap-3 px-4 py-3.5 no-underline transition-colors hover:bg-jet " +
                    (i < info.links.length - 1 ? "border-b border-dark-gray" : "")
                  }
                >
                  <span className="font-inter-tight text-sm text-foreground">
                    {isEn ? l.labelEn : l.labelFr}
                  </span>
                  <ArrowRight
                    size={14}
                    className="shrink-0 text-accent-secondary transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Note anti-cannibalisation */}
          <div className="flex gap-3 border border-dark-gray bg-jet px-4 py-4">
            <Info size={14} className="mt-0.5 shrink-0 text-mid-gray" />
            <p className="font-inter-tight text-[13px] leading-relaxed text-mid-gray">
              {isEn
                ? "This signal points you in a direction. A tech choice call applies it to your real budget, data and constraints — and is credited back if a project follows."
                : "Ce signal vous oriente. Une visio de choix de techno l'applique à votre budget réel, vos données et vos contraintes — et se déduit d'un projet si vous le lancez."}
            </p>
          </div>

          {/* Prochaine étape */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={info.next.href as Parameters<typeof Link>[0]["href"]}
              className={BTN_PRIMARY}
            >
              {isEn ? info.next.labelEn : info.next.labelFr}
              <ArrowRight size={14} />
            </Link>
            <Link href="/outils/boussole" className={BTN_GHOST}>
              {isEn ? "Broader question? The Compass" : "Question plus large ? La Boussole"}
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <button type="button" onClick={reset} className={BTN_GHOST}>
              <RotateCcw size={13} />
              {isEn ? "Restart" : "Refaire"}
            </button>
          </div>
          <NewsletterModal source="nocode-saas-surmesure" />
        </div>
      )}
      </StepTransition>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="px-6 py-8 lg:px-8">
        <div className="mb-8 grid gap-x-8 gap-y-7 sm:grid-cols-2">
          {QUESTIONS.map((q) => (
            <div key={q.id}>
              <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.16em] text-accent-secondary">
                {isEn ? q.criterionEn : q.criterionFr}
              </p>
              <p className="mb-2.5 font-inter-tight text-[13px] text-mid-gray">
                {isEn ? q.labelEn : q.labelFr}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {q.options.map((opt) => {
                  const selected = state[q.id] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setState((s) => ({ ...s, [q.id]: opt.value }))}
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
          {isEn ? "Find the right family" : "Trouver la bonne famille"}
          <ArrowRight size={14} />
        </button>
      </form>
    </Reveal>
  );
}
