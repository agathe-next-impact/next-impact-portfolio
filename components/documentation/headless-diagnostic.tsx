"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import {
  Zap,
  Palette,
  Globe,
  Wallet,
  Building2,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Share2,
  CheckCircle,
  ChevronRight,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────────────────── */

interface DiagnosticOption {
  label: string;
  points: number;
}

interface DiagnosticQuestion {
  question: string;
  options: DiagnosticOption[];
}

interface DiagnosticStep {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  questions: DiagnosticQuestion[];
  maxPoints: number;
}

/* ─── Données du diagnostic (tirées de l'article) ────────────────────────── */

const STEPS: DiagnosticStep[] = [
  {
    id: "performance",
    title: "Performance et vitesse",
    description:
      "Évaluez la performance actuelle de votre site et son impact business.",
    icon: Zap,
    maxPoints: 6,
    questions: [
      {
        question: "Temps de chargement actuel de votre site",
        options: [
          { label: "Moins de 2 secondes", points: 0 },
          { label: "Entre 2 et 4 secondes", points: 1 },
          { label: "Plus de 4 secondes", points: 3 },
        ],
      },
      {
        question: "Importance de la performance pour votre activité",
        options: [
          {
            label: "Acceptable, pas d'impact business direct",
            points: 0,
          },
          { label: "Importante pour l'image de marque", points: 2 },
          {
            label: "Critique pour le taux de conversion ou le CA",
            points: 3,
          },
        ],
      },
    ],
  },
  {
    id: "design",
    title: "Design et expérience utilisateur",
    description: "Identifiez les limites actuelles de votre interface.",
    icon: Palette,
    maxPoints: 6,
    questions: [
      {
        question: "Limitations de votre thème actuel",
        options: [
          { label: "Le thème répond à nos besoins", points: 0 },
          { label: "Quelques fonctionnalités UX manquantes", points: 1 },
          {
            label: "Le thème bloque nos objectifs de design",
            points: 3,
          },
        ],
      },
      {
        question: "Besoins en interface utilisateur",
        options: [
          { label: "Interface web standard suffisante", points: 0 },
          {
            label: "Animations et interactions avancées nécessaires",
            points: 2,
          },
          {
            label: "Interface métier sur mesure (configurateur, dashboard)",
            points: 3,
          },
        ],
      },
    ],
  },
  {
    id: "multicanal",
    title: "Distribution multi-canal",
    description:
      "Évaluez votre besoin de diffuser le contenu sur plusieurs canaux.",
    icon: Globe,
    maxPoints: 4,
    questions: [
      {
        question: "Canaux de diffusion actuels et prévus",
        options: [
          { label: "Site web uniquement", points: 0 },
          { label: "Site web + mobile responsive avancé", points: 1 },
          {
            label: "Site web + application mobile native prévue",
            points: 3,
          },
          {
            label: "Site + app mobile + autres interfaces (bornes, affichage)",
            points: 4,
          },
        ],
      },
    ],
  },
  {
    id: "budget",
    title: "Budget et ressources",
    description:
      "Évaluez votre capacité d'investissement et votre degré d'autonomie.",
    icon: Wallet,
    maxPoints: 6,
    questions: [
      {
        // Seuils alignés sur la référence tarifaire du blog 2026
        // (build headless : 2 250 / 4 000 / 6 500 €).
        question: "Budget disponible pour le projet",
        options: [
          { label: "Moins de 2 250 €", points: -2 },
          { label: "Entre 2 250 € et 4 000 €", points: 0 },
          { label: "Entre 4 000 € et 6 500 €", points: 2 },
          { label: "Plus de 6 500 €", points: 3 },
        ],
      },
      {
        question: "Degré d'autonomie souhaité sur le site",
        options: [
          {
            label: "Je veux tout gérer seul, sans intervention technique",
            points: -1,
          },
          {
            label: "Je gère le contenu, un prestataire gère la technique",
            points: 1,
          },
          {
            label: "J'ai une équipe ou un prestataire dédié au développement",
            points: 3,
          },
        ],
      },
    ],
  },
  {
    id: "business",
    title: "Contexte business",
    description:
      "Situez votre projet dans son environnement concurrentiel.",
    icon: Building2,
    maxPoints: 5,
    questions: [
      {
        question: "Secteur d'activité",
        options: [
          { label: "Blog personnel, association", points: 0 },
          { label: "Artisan, PME secteur traditionnel", points: 1 },
          { label: "E-commerce, startup, SaaS", points: 2 },
          { label: "Tech, innovation, grande entreprise", points: 3 },
        ],
      },
      {
        question: "Niveau de digitalisation de la concurrence",
        options: [
          { label: "Concurrence peu digitalisée", points: 0 },
          { label: "Concurrence moyennement digitalisée", points: 1 },
          { label: "Concurrence fortement digitalisée", points: 2 },
        ],
      },
    ],
  },
];

const TOTAL_MAX = STEPS.reduce((sum, s) => sum + s.maxPoints, 0);
const TOTAL_MIN = -3;

/* ─── Recommendation ─────────────────────────────────────────────────────── */

interface Recommendation {
  title: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  articles: { title: string; href: string }[];
}

function getRecommendation(score: number): Recommendation {
  if (score < 5) {
    return {
      title: "WordPress traditionnel recommandé",
      description:
        "Votre contexte actuel est mieux servi par un WordPress bien configuré. Optimisez le cache, les images et l'hébergement pour des résultats immédiats.",
      color: "text-coral",
      bgColor: "bg-coral/10",
      borderColor: "border-coral/30",
      articles: [
        {
          title: "Pourquoi utiliser WordPress",
          href: "/documentation/wordpress/pourquoi-utiliser-wordpress",
        },
        {
          title: "Bonnes pratiques WordPress",
          href: "/documentation/wordpress/bonnes-pratiques-wordpress",
        },
        {
          title: "Performance et Core Web Vitals",
          href: "/documentation/wordpress-headless/performance-et-core-web-vitals",
        },
      ],
    };
  }
  if (score <= 10) {
    return {
      title: "Les deux architectures sont viables",
      description:
        "Votre situation se prête aux deux approches. Arbitrez selon vos priorités : le headless si la performance ou le multi-canal est stratégique, le traditionnel si le budget ou le calendrier prime.",
      color: "text-orange",
      bgColor: "bg-orange/10",
      borderColor: "border-orange/30",
      articles: [
        {
          // Ex-« Quand utiliser WordPress headless » (fusionné dans l'article
          // hôte du diagnostic) — remplacé par un critère d'arbitrage concret.
          title: "Performance et Core Web Vitals",
          href: "/documentation/wordpress-headless/performance-et-core-web-vitals",
        },
        {
          title: "Migration monolithique vers headless",
          href: "/documentation/wordpress-headless/migration-monolithique-vers-headless",
        },
        {
          title: "Comprendre le headless",
          href: "/documentation/wordpress-headless/comprendre-le-headless",
        },
      ],
    };
  }
  return {
    title: "WordPress headless fortement recommandé",
    description:
      "Les bénéfices du headless — performance sub-seconde, design sur mesure, distribution multi-canal — justifient pleinement l'investissement dans votre contexte.",
    color: "text-lightblue",
    bgColor: "bg-regularblue/15",
    borderColor: "border-regularblue/30",
    articles: [
      {
        title: "Comment créer un headless",
        href: "/documentation/wordpress-headless/comment-creer-un-headless",
      },
      {
        title: "Next.js pour WordPress headless",
        href: "/documentation/wordpress-headless/nextjs-pour-wordpress-headless",
      },
      {
        title: "Déploiement Vercel + Next.js",
        href: "/documentation/wordpress-headless/deploiement-vercel-nextjs",
      },
    ],
  };
}

/* ─── Animated score counter ─────────────────────────────────────────────── */

function AnimatedScore({ value }: { value: number }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    let frame: number;
    const duration = 1200;
    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayed(Math.round(value * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <span>{displayed}</span>;
}

/* ─── Score gauge ────────────────────────────────────────────────────────── */

function ScoreGauge({ score }: { score: number }) {
  const range = TOTAL_MAX - TOTAL_MIN;
  const percent = Math.max(
    0,
    Math.min(100, ((score - TOTAL_MIN) / range) * 100)
  );

  const zone1End = ((5 - TOTAL_MIN) / range) * 100;
  const zone2End = ((11 - TOTAL_MIN) / range) * 100;

  return (
    <div className="relative mt-6 mb-2">
      <div className="relative h-3 rounded-full overflow-hidden flex">
        <div className="bg-coral/30" style={{ width: `${zone1End}%` }} />
        <div
          className="bg-orange/30"
          style={{ width: `${zone2End - zone1End}%` }}
        />
        <div
          className="bg-regularblue/30"
          style={{ width: `${100 - zone2End}%` }}
        />
      </div>

      <motion.div
        className="absolute top-0 -translate-x-1/2"
        initial={{ left: "0%" }}
        animate={{ left: `${percent}%` }}
        transition={{
          type: "spring",
          stiffness: 80,
          damping: 14,
          delay: 0.8,
        }}
      >
        <div className="relative flex flex-col items-center -mt-1">
          <div
            className={cn(
              "h-5 w-5 rounded-full border-[3px] border-darkblue ",
              score < 5
                ? "bg-coral"
                : score <= 10
                  ? "bg-orange"
                  : "bg-regularblue"
            )}
          />
        </div>
      </motion.div>

      <div className="flex justify-between mt-3 text-[11px] font-googletexte text-white/50">
        <span>WP traditionnel</span>
        <span>Zone mixte</span>
        <span>Headless</span>
      </div>
    </div>
  );
}

/* ─── Step breakdown ─────────────────────────────────────────────────────── */

function StepBreakdown({ answers }: { answers: (number | null)[][] }) {
  return (
    <div className="space-y-3">
      {STEPS.map((step, stepIdx) => {
        const Icon = step.icon;
        const stepScore = step.questions.reduce((sum, q, qIdx) => {
          const sel = answers[stepIdx]?.[qIdx];
          return (
            sum +
            (sel !== null && sel !== undefined ? q.options[sel].points : 0)
          );
        }, 0);
        const fillPercent =
          step.maxPoints > 0
            ? Math.max(0, Math.min(100, (stepScore / step.maxPoints) * 100))
            : 0;

        return (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 + stepIdx * 0.1 }}
            className="flex items-center gap-3"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10">
              <Icon className="h-3.5 w-3.5 text-lightblue" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-googletexte text-white/70 truncate">
                  {step.title}
                </span>
                <span className="text-xs font-mono text-white/50 ml-2">
                  {stepScore}/{step.maxPoints}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className={cn(
                    "h-full rounded-full",
                    stepScore < 0 ? "bg-coral" : "bg-regularblue"
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${fillPercent}%` }}
                  transition={{
                    delay: 1.2 + stepIdx * 0.1,
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─── Composant principal ────────────────────────────────────────────────── */

export function HeadlessDiagnostic() {
  const [currentStep, setCurrentStep] = useState(-1);
  const [answers, setAnswers] = useState<(number | null)[][]>(
    STEPS.map((s) => s.questions.map(() => null))
  );
  const [direction, setDirection] = useState(1);
  const [copied, setCopied] = useState(false);

  // Lecture des paramètres URL pour résultats partagés
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const d = params.get("d");
      if (d) {
        const indices = d.split("-").map(Number);
        if (
          indices.length === 9 &&
          indices.every((n) => !isNaN(n) && n >= 0)
        ) {
          const restored: (number | null)[][] = [];
          let cursor = 0;
          for (const step of STEPS) {
            const stepAnswers: (number | null)[] = [];
            for (const q of step.questions) {
              const val = indices[cursor];
              stepAnswers.push(val < q.options.length ? val : null);
              cursor++;
            }
            restored.push(stepAnswers);
          }
          setAnswers(restored);
          setCurrentStep(5);
        }
      }
    } catch {
      // paramètres invalides — on ignore
    }
  }, []);

  const totalScore = useMemo(() => {
    return STEPS.reduce((total, step, stepIdx) => {
      return (
        total +
        step.questions.reduce((sum, q, qIdx) => {
          const sel = answers[stepIdx]?.[qIdx];
          return (
            sum +
            (sel !== null && sel !== undefined ? q.options[sel].points : 0)
          );
        }, 0)
      );
    }, 0);
  }, [answers]);

  const recommendation = useMemo(
    () => getRecommendation(totalScore),
    [totalScore]
  );

  const canProceed = useMemo(() => {
    if (currentStep < 0 || currentStep > 4) return true;
    return answers[currentStep]?.every((a) => a !== null);
  }, [currentStep, answers]);

  const selectOption = useCallback(
    (questionIdx: number, optionIdx: number) => {
      setAnswers((prev) => {
        const next = prev.map((s) => [...s]);
        next[currentStep][questionIdx] = optionIdx;
        return next;
      });
    },
    [currentStep]
  );

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrentStep((s) => Math.min(s + 1, 5));
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrentStep((s) => Math.max(s - 1, -1));
  }, []);

  const reset = useCallback(() => {
    setDirection(-1);
    setCurrentStep(-1);
    setAnswers(STEPS.map((s) => s.questions.map(() => null)));
    try {
      if (window.location.search) {
        window.history.replaceState({}, "", window.location.pathname);
      }
    } catch {
      // ignore
    }
  }, []);

  const shareResults = useCallback(() => {
    const encoded = answers.flat().join("-");
    const url = `${window.location.origin}${window.location.pathname}?d=${encoded}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        window.prompt("Copiez ce lien :", url);
      });
  }, [answers]);

  const progressPercent =
    currentStep <= 0 ? 0 : currentStep >= 5 ? 100 : (currentStep / 5) * 100;

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <div className="diagnostic-dark my-10 rounded-3xl border border-lightblue/20 bg-gradient-to-br from-darkblue to-mediumblue overflow-hidden ">
      {/* Barre de progression */}
      {currentStep >= 0 && (
        <div className="px-6 pt-5 pb-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-googletexte text-white/60">
              {currentStep >= 5
                ? "Résultats"
                : `Étape ${currentStep + 1} sur 5`}
            </span>
            <span className="text-xs font-mono text-white/60">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <Progress value={progressPercent} className="h-1.5 bg-white/10" />
        </div>
      )}

      {/* Contenu */}
      <div className="relative px-6 py-6 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          {/* ── Intro ──────────────────────────────────────────────────── */}
          {currentStep === -1 && (
            <motion.div
              key="intro"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex flex-col items-center text-center py-8"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 mb-5">
                <Sparkles className="h-8 w-8 text-lightblue" />
              </div>
              <h3 className="font-googletitre text-2xl md:text-3xl font-medium text-white mb-3">
                Auto-diagnostic headless
              </h3>
              <p className="font-googletexte text-white/60 max-w-md mb-8 text-sm leading-relaxed">
                Évaluez en 5 critères si l&apos;architecture WordPress headless
                + Next.js est adaptée à votre projet. Résultat personnalisé et
                partageable.
              </p>
              <button
                onClick={goNext}
                className="inline-flex items-center gap-2 rounded-full bg-regularblue px-6 py-3 text-sm font-googletitre font-medium text-darkblue transition-all duration-300"
              >
                Commencer le diagnostic
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          )}

          {/* ── Étapes 0–4 ─────────────────────────────────────────────── */}
          {currentStep >= 0 && currentStep < 5 && (
            <motion.div
              key={`step-${currentStep}`}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {(() => {
                const step = STEPS[currentStep];
                const Icon = step.icon;
                return (
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                        <Icon className="h-5 w-5 text-lightblue" />
                      </div>
                      <div>
                        <h3 className="font-googletitre text-lg font-medium text-white">
                          {step.title}
                        </h3>
                        <p className="text-xs font-googletexte text-white/60">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6 mt-6">
                      {step.questions.map((q, qIdx) => (
                        <div key={qIdx}>
                          <p className="font-googletexte text-sm font-medium text-white/90 mb-3">
                            {q.question}
                          </p>
                          <div className="space-y-2">
                            {q.options.map((opt, oIdx) => {
                              const isSelected =
                                answers[currentStep][qIdx] === oIdx;
                              return (
                                <button
                                  key={oIdx}
                                  onClick={() => selectOption(qIdx, oIdx)}
                                  className={cn(
                                    "w-full text-left rounded-xl px-4 py-3 text-sm font-googletexte transition-all border",
                                    "flex items-center justify-between gap-3",
                                    isSelected
                                      ? "bg-regularblue/20 border-regularblue/50 text-white"
                                      : "bg-white/5 border-lightblue/15 text-white/70 hover:bg-white/10 hover:border-lightblue/30"
                                  )}
                                >
                                  <div className="flex items-center gap-3">
                                    <span
                                      className={cn(
                                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                                        isSelected
                                          ? "border-regularblue bg-regularblue"
                                          : "border-white/30"
                                      )}
                                    >
                                      {isSelected && (
                                        <motion.div
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          className="h-2 w-2 rounded-full bg-white"
                                        />
                                      )}
                                    </span>
                                    <span>{opt.label}</span>
                                  </div>
                                  <span
                                    className={cn(
                                      "shrink-0 rounded-full px-2 py-0.5 text-xs font-mono",
                                      opt.points > 0
                                        ? "bg-regularblue/20 text-lightblue"
                                        : opt.points < 0
                                          ? "bg-coral/20 text-coral"
                                          : "bg-white/10 text-white/50"
                                    )}
                                  >
                                    {opt.points > 0 ? `+${opt.points}` : opt.points}{" "}
                                    pt{Math.abs(opt.points) !== 1 ? "s" : ""}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-8">
                      <button
                        onClick={goPrev}
                        className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-googletexte text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        {currentStep === 0 ? "Accueil" : "Précédent"}
                      </button>
                      <button
                        onClick={goNext}
                        disabled={!canProceed}
                        className={cn(
                          "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-googletitre font-medium transition-all",
                          canProceed
                            ? "bg-regularblue text-darkblue "
                            : "bg-white/10 text-white/30 cursor-not-allowed"
                        )}
                      >
                        {currentStep === 4 ? "Voir les résultats" : "Suivant"}
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}

          {/* ── Résultats ──────────────────────────────────────────────── */}
          {currentStep === 5 && (
            <motion.div
              key="results"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Score */}
              <div className="text-center mb-4">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                  }}
                  className="inline-flex flex-col items-center"
                >
                  <span className="text-xs font-googletexte text-white/60 mb-1">
                    Votre score
                  </span>
                  <span
                    className={cn(
                      "font-googletitre text-5xl md:text-6xl font-bold",
                      recommendation.color
                    )}
                  >
                    <AnimatedScore value={totalScore} />
                  </span>
                  <span className="text-sm font-googletexte text-white/60 mt-1">
                    sur {TOTAL_MAX} points
                  </span>
                </motion.div>
              </div>

              <ScoreGauge score={totalScore} />

              {/* Recommandation */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className={cn(
                  "rounded-2xl border p-5 mt-6",
                  recommendation.bgColor,
                  recommendation.borderColor
                )}
              >
                <div className="flex items-start gap-3">
                  <CheckCircle
                    className={cn(
                      "h-5 w-5 shrink-0 mt-0.5",
                      recommendation.color
                    )}
                  />
                  <div>
                    <h4
                      className={cn(
                        "font-googletitre text-base font-medium",
                        recommendation.color
                      )}
                    >
                      {recommendation.title}
                    </h4>
                    <p className="text-sm font-googletexte text-white/70 mt-1 leading-relaxed">
                      {recommendation.description}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Détail par critère */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-6"
              >
                <h4 className="text-xs font-googletexte text-white/50 uppercase tracking-wider mb-3">
                  Détail par critère
                </h4>
                <StepBreakdown answers={answers} />
              </motion.div>

              {/* Articles recommandés */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="mt-6"
              >
                <h4 className="text-xs font-googletexte text-white/50 uppercase tracking-wider mb-3">
                  Articles recommandés
                </h4>
                <div className="space-y-2">
                  {recommendation.articles.map((article) => (
                    <Link
                      key={article.href}
                      href={article.href}
                      className="flex items-center gap-2 rounded-full border border-lightblue/15 px-4 py-2.5 text-sm font-googletexte text-white/70 hover:text-white hover:bg-white/10 hover:border-lightblue/30 transition-all"
                    >
                      <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                      {article.title}
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <button
                  onClick={reset}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-lightblue/20 px-4 py-2.5 text-sm font-googletexte text-white/60 hover:text-white hover:bg-white/10 transition-colors flex-1"
                >
                  <RotateCcw className="h-4 w-4" />
                  Refaire le diagnostic
                </button>
                <button
                  onClick={shareResults}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-regularblue px-4 py-2.5 text-sm font-googletitre font-medium text-darkblue transition-all duration-300 flex-1"
                >
                  <Share2 className="h-4 w-4" />
                  {copied ? "Lien copié !" : "Partager le résultat"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
