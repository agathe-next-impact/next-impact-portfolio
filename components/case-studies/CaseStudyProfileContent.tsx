"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { getCaseStudyProfileOverrides } from "@/lib/case-studies-profiles";
import type { Locale } from "@/i18n/routing";

interface CaseStudyProfileContentProps {
  slug: string;
  locale: Locale;
  defaultDescription: string;
  defaultDetailedDescription: string;
  defaultObjectives: string[];
  defaultResults: string[];
}

export default function CaseStudyProfileContent({
  slug,
  locale,
  defaultDescription,
  defaultDetailedDescription,
  defaultObjectives,
  defaultResults,
}: CaseStudyProfileContentProps) {
  const { profileId } = useDocumentationMode();
  const t = useTranslations("caseStudyDetail");

  const overrides = getCaseStudyProfileOverrides(locale);
  const override =
    profileId && overrides[slug] ? overrides[slug][profileId] : null;

  const detailedDescription = override?.detailedDescription ?? defaultDetailedDescription;
  const objectives = override?.objectives ?? defaultObjectives;
  const results = override?.results ?? defaultResults;

  const key = `${slug}-${profileId || "default"}`;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3 }}
        className="space-y-6 sm:space-y-10"
      >
        {/* Présentation du projet */}
        <section>
          <h2 className="text-2xl md:mb-6 text-white">
            {t("projectPresentation")}
          </h2>
          <div className="prose max-w-none">
            {detailedDescription.split("\n\n").map((paragraph, index) => (
              <p
                key={index}
                className="mb-4 text-white/80 md:leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* Objectifs et résultats */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div>
            <h2 className="text-2xl md:mb-6 text-white">{t("objectives")}</h2>
            <ul className="space-y-3">
              {objectives.map((objective, index) => (
                <li
                  key={index}
                  className="w-full flex justify-start items-start"
                >
                  <div className="h-6 w-6 rounded-full bg-transparent text-coral flex items-center justify-center mr-3 mt-0.5">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                  <span className="w-full text-white/80">{objective}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl md:mb-6 text-white">{t("results")}</h2>
            <ul className="space-y-3">
              {results.map((result, index) => (
                <li
                  key={index}
                  className="w-full flex justify-start items-start"
                >
                  <div className="h-6 w-6 rounded-full bg-transparent text-coral flex items-center justify-center mr-3 mt-0.5">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                  <span className="w-full text-white/80">{result}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </motion.div>
    </AnimatePresence>
  );
}
