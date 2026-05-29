"use client";

import { motion, AnimatePresence } from "framer-motion";
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
        style={{ display: "flex", flexDirection: "column", gap: 40 }}
      >
        {/* Présentation du projet */}
        <section>
          <h2
            className="ni-serif"
            style={{ fontSize: "clamp(20px, 2vw, 26px)", color: "var(--ink)", marginBottom: 24, lineHeight: 1.2 }}
          >
            {t("projectPresentation")}
          </h2>
          <div>
            {detailedDescription.split("\n\n").map((paragraph, index) => (
              <p
                key={index}
                style={{ color: "var(--ink-2)", lineHeight: 1.7, marginBottom: 16, fontSize: 15 }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* Objectifs et résultats */}
        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          <div>
            <h2
              className="ni-serif"
              style={{ fontSize: "clamp(18px, 2vw, 22px)", color: "var(--ink)", marginBottom: 20 }}
            >
              {t("objectives")}
            </h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {objectives.map((objective, index) => (
                <li
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    padding: "12px 0",
                    borderBottom: "1px solid var(--rule)",
                  }}
                >
                  <ArrowRight
                    size={14}
                    strokeWidth={1.5}
                    style={{ color: "var(--ink-2)", flexShrink: 0, marginTop: 2 }}
                  />
                  <span style={{ color: "var(--ink-2)", fontSize: 14, lineHeight: 1.6 }}>{objective}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2
              className="ni-serif"
              style={{ fontSize: "clamp(18px, 2vw, 22px)", color: "var(--ink)", marginBottom: 20 }}
            >
              {t("results")}
            </h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {results.map((result, index) => (
                <li
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    padding: "12px 0",
                    borderBottom: "1px solid var(--rule)",
                  }}
                >
                  <ArrowRight
                    size={14}
                    strokeWidth={1.5}
                    style={{ color: "var(--ink-2)", flexShrink: 0, marginTop: 2 }}
                  />
                  <span style={{ color: "var(--ink-2)", fontSize: 14, lineHeight: 1.6 }}>{result}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </motion.div>
    </AnimatePresence>
  );
}
