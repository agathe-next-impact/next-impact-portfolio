"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { JOURNEYS, PROFILES } from "@/lib/documentation-profiles";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { cn } from "@/lib/utils";

export function LearningPath() {
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
    <section id="parcours" className="mt-12 scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="rounded-3xl bg-mediumblue/80 backdrop-blur-sm border border-lightblue/10 p-6 md:p-8"
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
          <div>
            <h2 className="font-googletitre text-xl md:text-2xl font-medium text-white">
              Votre parcours {profile.label}
            </h2>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3 mb-8 mt-4">
          <Progress
            value={progressPercent}
            className="h-2 flex-1 bg-darkblue/60"
          />
          <span className="text-sm text-white/80 font-googletexte whitespace-nowrap">
            {readCount} / {journey.length} articles lus
          </span>
        </div>

        {/* Timeline */}
        <div className="relative pl-6 border-l-2 border-lightblue/20 space-y-6">
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
                {/* Dot on the timeline */}
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
                    "block rounded-2xl p-4 border transition-all duration-300",
                    isRead
                      ? "bg-orange/5 border-orange/20 hover:border-orange/40"
                      : "bg-darkblue/40 border-lightblue/10 hover:border-lightblue/20 hover:bg-darkblue/60"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-googletexte text-sm font-medium text-white">
                        {step.title}
                      </p>
                      <p className="text-xs text-white/80 font-googletexte mt-1">
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
    </section>
  );
}
