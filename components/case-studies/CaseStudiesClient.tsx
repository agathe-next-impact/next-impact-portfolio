"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      <div className="mt-8 mb-16 px-4 space-y-16">
        <Realisations count={30} defaultTab={variant.defaultTab} />

        {/* CTA adaptatif par profil */}
        <AnimatePresence mode="wait">
          <motion.section
            key={`cta-${profileId || "default"}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto text-center"
          >
            <p className="text-lg text-white/70 font-googletexte mb-6">
              {variant.ctaDescription}
            </p>
            <Link
              href={variant.ctaHref}
              {...(variant.ctaHref.startsWith("http")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              <Button className="h-14 px-10 font-bold font-googletitre text-lg rounded-full bg-coral text-darkblue transition-all duration-300">
                {variant.ctaLabel}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.section>
        </AnimatePresence>
      </div>
    </PageLayout>
  );
}
