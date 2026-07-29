"use client";

import { m as motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
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

  const detailedDescription =
    override?.detailedDescription ?? defaultDetailedDescription;
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
        className="flex flex-col gap-12"
      >
        {/* Présentation du projet */}
        <section>
          <h2 className="mb-5 text-2xl font-light leading-tight tracking-tight text-foreground md:text-3xl">
            {t("projectPresentation")}
          </h2>
          <div className="font-inter-tight">
            {detailedDescription.split("\n\n").map((paragraph, index) => (
              <p
                key={index}
                className="mb-4 text-[15px] leading-relaxed text-mid-gray"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* Objectifs et résultats */}
        <section className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-8">
          <div>
            <h2 className="mb-5 text-xl font-light tracking-tight text-foreground md:text-2xl">
              {t("objectives")}
            </h2>
            <ul className="m-0 list-none p-0">
              {objectives.map((objective, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 border-b border-dark-gray py-3"
                >
                  <ArrowRight
                    size={14}
                    strokeWidth={1.5}
                    className="mt-0.5 shrink-0 text-accent-secondary"
                  />
                  <span className="font-inter-tight text-sm leading-relaxed text-mid-gray">
                    {objective}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-5 text-xl font-light tracking-tight text-foreground md:text-2xl">
              {t("results")}
            </h2>
            <ul className="m-0 list-none p-0">
              {results.map((result, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 border-b border-dark-gray py-3"
                >
                  <ArrowRight
                    size={14}
                    strokeWidth={1.5}
                    className="mt-0.5 shrink-0 text-accent-secondary"
                  />
                  <span className="font-inter-tight text-sm leading-relaxed text-mid-gray">
                    {result}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </motion.div>
    </AnimatePresence>
  );
}
