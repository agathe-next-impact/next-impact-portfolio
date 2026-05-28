"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import PageLayout from "@/components/page-layout";
import Realisations from "@/components/case-studies/realisations";
import { useLocale } from "next-intl";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { getCaseStudiesPageVariants } from "@/lib/homepage-profiles";
import type { Locale } from "@/i18n/routing";

export default function CaseStudiesClient() {
  const { profileId } = useDocumentationMode();
  const locale = useLocale() as Locale;
  const caseStudiesVariants = getCaseStudiesPageVariants(locale);
  const variant = profileId ? caseStudiesVariants[profileId] : caseStudiesVariants.default;

  return (
    <PageLayout titre={variant.titre} sousTitre={variant.sousTitre}>
      <section className="s" style={{ borderTop: "1px solid var(--rule)" }}>
        <div className="container">
          <Realisations count={30} defaultTab={variant.defaultTab} />
        </div>
      </section>

      <AnimatePresence mode="wait">
        <motion.section
          key={`cta-${profileId || "default"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="s"
          style={{ background: "var(--paper-2)", borderTop: "1px solid var(--rule)" }}
        >
          <div className="container">
            <p style={{ fontSize: 16, color: "var(--ink-2)", maxWidth: 480, marginBottom: 24, lineHeight: 1.65 }}>
              {variant.ctaDescription}
            </p>
            {variant.ctaHref.startsWith("http") ? (
              <a
                href={variant.ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn primary"
                style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
              >
                {variant.ctaLabel}
                <ArrowRight size={14} />
              </a>
            ) : (
              <Link
                href={variant.ctaHref as Parameters<typeof Link>[0]["href"]}
                className="btn primary"
                style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
              >
                {variant.ctaLabel}
                <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </motion.section>
      </AnimatePresence>
    </PageLayout>
  );
}
