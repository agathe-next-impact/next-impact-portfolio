"use client";

// Diagnostic « Votre site est-il visible dans les moteurs IA ? » — outil de la
// rubrique « Être trouvé à l'heure de l'IA ». Questionnaire déclaratif de
// 10 questions → score global /100 + 4 axes (accès robots IA, citabilité,
// structure/données, autorité externe), verdict par palier et 3 actions
// concrètes. Escalier de CTA par température : froid → rubrique etre-trouve,
// tiède → visio conseil 150 €, chaud → cadrage 490 €. Doctrine : le résultat
// est utile sans rien acheter. Scoring pur dans lib/visibilite-ia.ts (testé).
// Modèle : reparer-ou-refaire.

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Info,
  Radar,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import ConseilModal, { openConseilModal } from "@/components/ui/conseil-modal";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { StepTransition } from "@/components/ui/step-transition";
import { RadialGauge } from "@/components/visuals/radial-gauge";
import { Sonar } from "@/components/visuals/sonar";
import { track } from "@/lib/track";
import {
  AXES,
  computeAxisScores,
  computeScore,
  getRecommendations,
  getTier,
  INITIAL_ANSWERS,
  QUESTIONS,
  resolveAnswers,
  type Status,
  type Tier,
} from "@/lib/visibilite-ia";

const BTN_PRIMARY =
  "inline-flex h-11 items-center gap-2 border border-accent-secondary bg-accent-secondary px-5 font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-obsidian transition-colors hover:bg-accent-secondary/85";
const BTN_GHOST =
  "group inline-flex h-11 items-center gap-1.5 rounded-sm border border-dark-gray px-5 font-mono text-[12px] uppercase tracking-[0.08em] text-foreground transition-colors hover:bg-jet";
const LABEL_MONO =
  "block font-mono text-[10px] uppercase tracking-[0.18em] text-mid-gray";

type LinkHref = Parameters<typeof Link>[0]["href"];

function statusBorderClass(status: Status) {
  if (status === "ok") return "border-l-accent-secondary";
  if (status === "warn") return "border-l-accent";
  return "border-l-vermilion";
}

function scoreToneClass(value: number) {
  if (value >= 70) return "bg-accent-secondary";
  if (value >= 40) return "bg-accent";
  return "bg-vermilion";
}

// Escalier de CTA proportionné au verdict. Le barreau gratuit (rubrique
// « Être trouvé à l'heure de l'IA ») reste présent à tous les paliers.
function getCtas(tier: Tier) {
  if (tier === "visible")
    return {
      primary: {
        fr: "Aller plus loin : Être trouvé à l'heure de l'IA",
        en: "Go further: Getting found in the AI era",
        href: "/documentation/etre-trouve",
      },
      secondary: {
        fr: "Affiner en visio — 150 €",
        en: "Fine-tune on a call — €150",
        href: "/conseil",
      },
    };
  if (tier === "partiel")
    return {
      primary: {
        fr: "Prioriser mes actions en visio — 150 €",
        en: "Prioritize my actions on a call — €150",
        href: "/conseil",
      },
      secondary: {
        fr: "Explorer la rubrique Être trouvé",
        en: "Explore the Getting found section",
        href: "/documentation/etre-trouve",
      },
    };
  return {
    primary: {
      fr: "Cadrer un plan de visibilité — 490 €",
      en: "Scope a visibility plan — €490",
      href: "/conseil",
    },
    secondary: {
      fr: "Comprendre d'abord : la rubrique Être trouvé",
      en: "Understand first: the Getting found section",
      href: "/documentation/etre-trouve",
    },
  };
}

const VERDICTS: Record<Tier, { fr: string; en: string; toneClass: string }> = {
  visible: {
    fr: "Bien positionné. Votre site coche l'essentiel de ce que les moteurs IA recherchent : accès ouvert, contenu citable, signaux externes. Les actions ci-dessous servent à consolider l'avance.",
    en: "Well positioned. Your site checks most of what AI engines look for: open access, citable content, external signals. The actions below help consolidate your lead.",
    toneClass: "text-accent-secondary",
  },
  partiel: {
    fr: "Visibilité partielle. Les moteurs IA peuvent probablement vous lire, mais ils ont peu de raisons de vous citer plutôt qu'un concurrent : le contenu ou les signaux d'autorité ne suffisent pas encore. Les actions ci-dessous sont à votre portée.",
    en: "Partial visibility. AI engines can probably read you, but they have little reason to cite you over a competitor: your content or authority signals aren't there yet. The actions below are within reach.",
    toneClass: "text-accent",
  },
  invisible: {
    fr: "Quasi invisible pour les moteurs IA. En l'état, ChatGPT, Perplexity ou les AI Overviews n'ont ni accès suffisant, ni matière citable, ni raison de vous recommander. La bonne nouvelle : les premières actions sont simples, et souvent gratuites.",
    en: "Nearly invisible to AI engines. As things stand, ChatGPT, Perplexity or AI Overviews have neither enough access, nor citable material, nor a reason to recommend you. The good news: the first actions are simple, and often free.",
    toneClass: "text-vermilion",
  },
};

export default function VisibiliteIa() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const [state, setState] = useState<Record<string, string>>(INITIAL_ANSWERS);
  const [submitted, setSubmitted] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!submitted || submitCount === 0) return;
    resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [submitted, submitCount]);

  const answers = useMemo(() => resolveAnswers(state), [state]);
  const score = useMemo(() => computeScore(state), [state]);
  const axisScores = useMemo(() => computeAxisScores(state), [state]);
  const recommendations = useMemo(() => getRecommendations(state), [state]);
  const tier = getTier(score);
  const verdict = VERDICTS[tier];
  const ctas = getCtas(tier);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setSubmitCount((c) => c + 1);
    track("visibilite_ia_result", { tier, score });
  };

  const reset = () => {
    setState(INITIAL_ANSWERS);
    setSubmitted(false);
  };

  const axisLabel = (id: string) => {
    const axis = AXES.find((a) => a.id === id);
    return axis ? (isEn ? axis.labelEn : axis.labelFr) : id;
  };

  return (
    <Reveal className="w-full border border-dark-gray bg-obsidian">
      {/* Header */}
      <div className="flex items-start gap-4 border-b border-dark-gray px-6 py-6 lg:px-8">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-dark-gray bg-jet">
          <Radar className="h-[1.125rem] w-[1.125rem] text-vermilion" />
        </div>
        <div>
          <p className={LABEL_MONO}>
            {isEn
              ? "Is your site visible to AI engines?"
              : "Votre site est-il visible dans les moteurs IA ?"}
          </p>
          <p className="mt-2 font-inter-tight text-[15px] leading-relaxed text-foreground">
            {isEn
              ? "ChatGPT, Perplexity and AI Overviews now answer instead of listing links. 10 questions to score your site on 4 axes — AI crawler access, content citability, structure, external authority — with concrete actions, whatever your score."
              : "ChatGPT, Perplexity et les AI Overviews répondent désormais à la place des listes de liens. 10 questions pour situer votre site sur 4 axes — accès des robots IA, citabilité du contenu, structure, autorité externe — avec des actions concrètes, quel que soit votre score."}
          </p>
        </div>
      </div>

      {/* Résultat — transition d'étape standard (fade + slide 8 px) */}
      <StepTransition stepKey={submitted ? "resultat" : "formulaire"}>
      {submitted && (
        <div ref={resultRef} className="scroll-mt-24 border-b border-dark-gray">
        {/* Verdict en cascade — les blocs du résultat apparaissent en Stagger */}
        <Stagger className="flex flex-col gap-8 px-6 py-8 lg:px-8">
          {/* Score + verdict */}
          <StaggerItem className="grid gap-px overflow-hidden border border-dark-gray bg-dark-gray md:grid-cols-[1fr_2fr]">
            <div className="relative flex items-center justify-center overflow-hidden bg-obsidian p-6">
              <div className="pointer-events-none absolute inset-0 opacity-[0.18]">
                <Sonar />
              </div>
              <div className="relative flex flex-col items-center gap-3">
                <p className={LABEL_MONO}>
                  {isEn ? "AI visibility" : "Visibilité IA"}
                </p>
                <RadialGauge value={score} size={132} label={isEn ? "out of 100" : "sur 100"} />
              </div>
            </div>
            <div
              className="flex flex-col justify-center bg-obsidian p-6 lg:p-8"
              role="status"
              aria-live="polite"
            >
              <p className={LABEL_MONO}>{isEn ? "Verdict" : "Verdict"}</p>
              <p className={`mt-3 font-inter-tight text-[15px] leading-relaxed ${verdict.toneClass}`}>
                {isEn ? verdict.en : verdict.fr}
              </p>
            </div>
          </StaggerItem>

          {/* Scores par axe */}
          <StaggerItem>
            <p className={`${LABEL_MONO} mb-4`}>
              {isEn ? "The 4 axes" : "Les 4 axes"}
            </p>
            <div className="grid gap-px border border-dark-gray bg-dark-gray sm:grid-cols-2">
              {AXES.map((axis) => {
                const value = axisScores[axis.id];
                return (
                  <div key={axis.id} className="bg-obsidian px-4 py-3.5">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="font-inter-tight text-sm font-medium text-foreground">
                        {isEn ? axis.labelEn : axis.labelFr}
                      </p>
                      <p className="font-mono text-[11px] text-mid-gray">{value}/100</p>
                    </div>
                    <div
                      className="mt-2.5 h-1.5 w-full border border-dark-gray bg-jet"
                      role="img"
                      aria-label={`${isEn ? axis.labelEn : axis.labelFr} : ${value}/100`}
                    >
                      <div
                        className={`h-full ${scoreToneClass(value)}`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </StaggerItem>

          {/* Recommandations concrètes */}
          {recommendations.length > 0 && (
            <StaggerItem>
              <p className={`${LABEL_MONO} mb-4`}>
                {isEn ? "Your priority actions" : "Vos actions prioritaires"}
              </p>
              <ol className="border border-dark-gray">
                {recommendations.map((reco, i) => (
                  <li
                    key={reco.questionId}
                    className={`flex items-start gap-3 border-l-[3px] px-4 py-3.5 ${statusBorderClass(
                      reco.status
                    )} ${i < recommendations.length - 1 ? "border-b border-b-dark-gray" : ""}`}
                  >
                    <span className="mt-0.5 font-mono text-[11px] text-mid-gray">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-accent-secondary">
                        {axisLabel(reco.axis)}
                      </p>
                      <p className="mt-1 font-inter-tight text-sm leading-relaxed text-foreground">
                        {isEn ? reco.recoEn : reco.recoFr}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </StaggerItem>
          )}

          {/* Détail par question */}
          <StaggerItem>
            <p className={`${LABEL_MONO} mb-4`}>
              {isEn ? "What weighs in" : "Ce qui pèse dans la balance"}
            </p>
            <div className="border border-dark-gray">
              {answers.map(({ question, option }, i) => (
                <div
                  key={question.id}
                  className={`flex items-start gap-3 border-l-[3px] px-4 py-3.5 ${statusBorderClass(
                    option.status
                  )} ${i < answers.length - 1 ? "border-b border-b-dark-gray" : ""}`}
                >
                  {option.status === "ok" ? (
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-accent-secondary" />
                  ) : option.status === "warn" ? (
                    <AlertTriangle size={16} className="mt-0.5 shrink-0 text-accent" />
                  ) : (
                    <XCircle size={16} className="mt-0.5 shrink-0 text-vermilion" />
                  )}
                  <div>
                    <p className="font-inter-tight text-sm font-medium text-foreground">
                      {isEn ? question.criterionEn : question.criterionFr}
                    </p>
                    <p className="mt-1 font-inter-tight text-[13px] leading-relaxed text-mid-gray">
                      {isEn ? option.detailEn : option.detailFr}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </StaggerItem>

          {/* Note d'honnêteté / doctrine */}
          <StaggerItem className="flex gap-3 border border-dark-gray bg-jet px-4 py-4">
            <Info size={14} className="mt-0.5 shrink-0 text-mid-gray" />
            <p className="font-inter-tight text-[13px] leading-relaxed text-mid-gray">
              {isEn
                ? "This is a declarative self-check: it reflects your answers, not a crawl of your site. The actions above can be done without any provider — a call helps prioritize and verify on the real site."
                : "Auto-diagnostic déclaratif : il reflète vos réponses, pas un crawl de votre site. Les actions ci-dessus se mènent sans prestataire — une visio sert à prioriser et vérifier sur le site réel."}
            </p>
          </StaggerItem>

          {/* Prochaine étape (adaptée au verdict) */}
          <StaggerItem className="flex flex-wrap items-center gap-3">
            <Link href={ctas.primary.href as LinkHref} className={BTN_PRIMARY}>
              {isEn ? ctas.primary.en : ctas.primary.fr}
              <ArrowRight size={14} />
            </Link>
            <Link href={ctas.secondary.href as LinkHref} className={BTN_GHOST}>
              {isEn ? ctas.secondary.en : ctas.secondary.fr}
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <button
              type="button"
              onClick={() => {
                reset();
                openConseilModal();
              }}
              className={BTN_GHOST}
            >
              <RotateCcw size={13} />
              {isEn ? "Restart" : "Refaire"}
            </button>
          </StaggerItem>
        </Stagger>
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
              <p className="mb-2.5 font-inter-tight text-[13px] text-mid-gray" id={`vis-ia-q-${q.id}`}>
                {isEn ? q.questionEn : q.questionFr}
              </p>
              <div
                className="flex flex-wrap gap-1.5"
                role="group"
                aria-labelledby={`vis-ia-q-${q.id}`}
              >
                {q.options.map((opt) => {
                  const selected = state[q.id] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      aria-pressed={selected}
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
          {isEn ? "Get my AI visibility score" : "Obtenir mon score de visibilité IA"}
          <ArrowRight size={14} />
        </button>
      </form>
      {/* Montee a la racine : elle doit survivre au reset du bouton « Refaire ». */}
      <ConseilModal source="visibilite-ia" armed={submitted} />
    </Reveal>
  );
}
