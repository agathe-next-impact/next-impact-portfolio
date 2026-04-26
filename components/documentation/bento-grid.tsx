"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle, BookOpen, SearchCheck, Network, FileText, Layers, Code, Globe, Smartphone } from "lucide-react";
import { BENTO_CONFIGS, JOURNEYS, PROFILES, type BentoCardConfig } from "@/lib/documentation-profiles";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const defaultCards: BentoCardConfig[] = [
  {
    id: "headless-cms",
    title: "Comprendre le headless",
    description:
      "Architecture découplée, API WordPress, Next.js et déploiement.",
    icon: BookOpen,
    href: "/documentation/headless-cms",
    colSpan: "md:col-span-2",
    rowSpan: "md:row-span-2",
    gradient: "bg-mediumblue/40 backdrop-blur-xl border-lightblue/20",
    textColor: "text-white",
  },
  {
    id: "mind-map",
    title: "Mind Map",
    description: "Explorez l'architecture headless de façon interactive.",
    icon: Network,
    href: "/documentation/mind-map",
    colSpan: "md:col-span-1",
    rowSpan: "",
    gradient: "bg-darkblue/60 backdrop-blur-xl border-lightblue/20",
    textColor: "text-extralightblue",
  },
  {
    id: "audit-ia",
    title: "Audit de migration IA",
    description: "Analysez votre site : performance, SEO et conversion.",
    icon: SearchCheck,
    href: "/audit-site-ia",
    colSpan: "md:col-span-1",
    rowSpan: "",
    gradient: "bg-darkblue/60 backdrop-blur-xl border-coral/20",
    textColor: "text-extralightblue",
  },
  {
    id: "livre-blanc",
    title: "Livre Blanc",
    description: "Téléchargez le guide complet : qu'est-ce que WordPress Headless ?",
    icon: FileText,
    href: "/ressources/livre_blanc_wp_headless.pdf",
    colSpan: "md:col-span-3",
    rowSpan: "",
    gradient: "bg-darkblue/60 backdrop-blur-xl border-orange/20",
    textColor: "text-white",
    external: true,
  },
];

function InlineLearningPath() {
  const { profileId, readArticles } = useDocumentationMode();

  if (!profileId) return null;

  const journey = JOURNEYS[profileId];
  const profile = PROFILES[profileId];
  const Icon = profile.icon;

  const readCount = journey.filter((step) =>
    readArticles.includes(`${step.category}/${step.slug}`)
  ).length;

  const progressPercent = Math.round((readCount / journey.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={cn(
        "md:col-span-2 md:row-span-2 rounded-3xl border p-6 md:p-8 overflow-hidden bg-mediumblue/40 backdrop-blur-xl",
        profileId === "decideur" && "border-orange/20",
        profileId === "utilisateur" && "border-regularblue/20",
        profileId === "developpeur" && "border-lightblue/20"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            profile.gradient
          )}
        >
          <Icon className={cn("h-5 w-5", profile.accentColor)} />
        </div>
        <h2 className="font-googletitre text-xl md:text-2xl font-medium text-white">
          Votre parcours {profile.label}
        </h2>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3 mb-6 mt-4">
        <Progress
          value={progressPercent}
          className="h-2 flex-1 bg-darkblue/60"
        />
        <span className="text-sm text-white/80 font-googletexte whitespace-nowrap">
          {readCount} / {journey.length}
        </span>
      </div>

      {/* Timeline */}
      <div className="relative pl-6 border-l-2 border-lightblue/20 space-y-3">
        {journey.map((step, index) => {
          const isRead = readArticles.includes(
            `${step.category}/${step.slug}`
          );
          return (
            <motion.div
              key={step.slug}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: index * 0.08,
                type: "spring",
                stiffness: 300,
                damping: 24,
              }}
              className="relative"
            >
              <div
                className={cn(
                  "absolute -left-[calc(1.5rem+5px)] top-1 h-3 w-3 rounded-full border-2",
                  isRead
                    ? "bg-orange border-orange"
                    : "bg-darkblue border-lightblue/30"
                )}
              />
              <Link
                href={`/documentation/${step.category}/${step.slug}`}
                className={cn(
                  "block rounded-2xl p-3 border transition-all duration-300",
                  isRead
                    ? "bg-orange/5 border-orange/20 hover:border-orange/40"
                    : "bg-darkblue/40 border-lightblue/10 hover:border-lightblue/20 hover:bg-darkblue/60"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p
                      className={cn(
                        "font-googletexte font-medium",
                        isRead
                          ? "text-mediumblue dark:text-white/70 line-through decoration-orange/40"
                          : "text-mediumblue dark:text-white"
                      )}
                    >
                      {step.title}
                    </p>
                    <p
                      className={cn(
                        "text-xs font-googletexte mt-0.5",
                        isRead
                          ? "text-mediumblue/70 dark:text-white/60"
                          : "text-mediumblue/80 dark:text-white/80"
                      )}
                    >
                      {step.description}
                    </p>
                  </div>
                  {isRead && (
                    <CheckCircle className="h-4 w-4 text-orange shrink-0 mt-0.5" />
                  )}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export function BentoGrid() {
  const { profileId } = useDocumentationMode();

  // When profile is active, skip the "Mon parcours" card (first one) — it's replaced by InlineLearningPath
  const cards = profileId
    ? BENTO_CONFIGS[profileId].filter((c) => !c.id.startsWith("parcours-"))
    : defaultCards;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {profileId && <InlineLearningPath />}
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: (profileId ? index + 1 : index) * 0.1,
              type: "spring",
              stiffness: 300,
              damping: 24,
            }}
            whileHover={{ scale: 1.05 }}
            className={cn(
              "group relative overflow-hidden rounded-3xl p-6 md:p-8 border border-lightblue/10",
              "cursor-pointer transition-all duration-300 hover:border-lightblue/20",
              card.colSpan,
              card.rowSpan,
              card.gradient,
              card.id.includes("mindmap") || card.id === "mind-map" ? "hidden md:block" : ""
            )}
          >
            <Link
              href={card.href}
              className="absolute inset-0 z-10"
              {...(card.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <span className="sr-only">{card.title}</span>
            </Link>
            <div className="relative z-0 flex flex-col justify-between h-full min-h-[160px]">
              <div>
                <div className="flex items-start justify-between">
                </div>
                {/* Infographie "Pourquoi ça change tout" — profil par défaut uniquement */}
                {!profileId && card.id === "headless-cms" && (
                  <div className="mt-5 space-y-5">
                    <div className="flex flex-col gap-3">
                      {[
                        { value: "2×", label: "plus rapide qu'un site classique" },
                        { value: "100", label: "score Lighthouse accessible" },
                        { value: "0", label: "plugin frontend à maintenir" },
                      ].map((stat) => (
                        <div key={stat.label} className="flex items-baseline gap-3">
                          <span className="text-3xl font-googletitre font-medium text-lightyellow">
                            {stat.value}
                          </span>
                          <span className="text-sm text-white/60">{stat.label}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 md:gap-4 pt-2">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-regularblue/20 border border-regularblue/30">
                          <Layers className="h-5 w-5 text-regularblue" />
                        </div>
                        <span className="text-xs text-white/50">WordPress</span>
                      </div>
                      <div className="h-px w-6 bg-lightblue/30" />
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange/20 border border-orange/30">
                          <Code className="h-5 w-5 text-orange" />
                        </div>
                        <span className="text-xs text-white/50">Next.js</span>
                      </div>
                      <div className="h-px w-6 bg-lightblue/30" />
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lightblue/20 border border-lightblue/30">
                          <div className="flex gap-1">
                            <Globe className="h-4 w-4 text-lightblue" />
                            <Smartphone className="h-4 w-4 text-lightblue" />
                          </div>
                        </div>
                        <span className="text-xs text-white/50">Vos visiteurs</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <h3
                  className={cn(
                    "font-googletitre text-2xl md:text-3xl font-medium mb-2",
                    card.textColor
                  )}
                >
                  {card.title}
                </h3>
                <p
                  className={cn(
                    "text-sm md:text-base font-googletexte",
                    card.textColor,
                    "opacity-60"
                  )}
                >
                  {card.description}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
