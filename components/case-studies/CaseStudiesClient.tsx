"use client";

import { AnimatePresence, m as motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Realisations from "@/components/case-studies/realisations";
import { useLocale } from "next-intl";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { getCaseStudiesPageVariants } from "@/lib/homepage-profiles";
import type { Locale } from "@/i18n/routing";
import { BlueprintSection, SectionHeading, Separator } from "@/components/aspect/section";
import { Reveal } from "@/components/ui/reveal";
import { WordAppear } from "@/components/visuals/word-appear";
import { AuroraGlow } from "@/components/visuals/aurora-glow";
import { NeonArcs } from "@/components/visuals/neon-arcs";

const FADE = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.25 },
};

const CTA_PRIMARY =
  "inline-flex h-11 items-center gap-2 border border-charcoal bg-vermilion px-5 font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-vermilion-bright";

export default function CaseStudiesClient() {
  const { profileId } = useDocumentationMode();
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const caseStudiesVariants = getCaseStudiesPageVariants(locale);
  const variant = profileId ? caseStudiesVariants[profileId] : caseStudiesVariants.default;
  const key = profileId || "default";

  return (
    <div>
      {/* Héros éditorial */}
      <BlueprintSection
        tone="obsidian"
        ticks
        backdrop={
          <>
            <AuroraGlow intensity="subtle" />
            <div className="absolute inset-0 opacity-50">
              <NeonArcs />
            </div>
          </>
        }
        innerClassName="px-6 py-16 lg:px-10 lg:py-24"
      >
        <Reveal className="flex flex-col gap-4">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
            <span>№ 01</span>
            <span className="h-px w-6 bg-accent-secondary/50" />
            <span className="text-mid-gray">{isEn ? "Case studies" : "Études de cas"}</span>
          </div>
          <h1 className="max-w-4xl text-4xl font-extralight leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            <WordAppear text={variant.titre} />
          </h1>
          {variant.sousTitre && (
            <p className="mt-2 max-w-2xl font-inter-tight text-base leading-relaxed text-mid-gray md:text-lg">
              {variant.sousTitre}
            </p>
          )}
        </Reveal>
      </BlueprintSection>


      {/* Grille des réalisations */}
      <AnimatePresence mode="wait">
        <motion.div key={`grid-${key}`} {...FADE}>
          <BlueprintSection tone="obsidian">
            <div className="border-t border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
              <Reveal>
                <SectionHeading
                  index="№ 02"
                  kicker={variant.tabsLabel}
                  title={isEn ? "Case studies" : "Études de cas"}
                />
              </Reveal>
              <div className="mt-10">
                <Realisations count={30} defaultTab={variant.defaultTab} />
              </div>
            </div>
          </BlueprintSection>
        </motion.div>
      </AnimatePresence>

      <Separator />

      {/* CTA */}
      <AnimatePresence mode="wait">
        <motion.div key={`cta-${key}`} {...FADE}>
          <BlueprintSection tone="jet">
            <Reveal className="flex flex-col gap-6 border-t border-dark-gray px-6 py-14 lg:px-8 lg:py-20">
              <SectionHeading
                index="№ 03"
                kicker={isEn ? "Get in touch" : "Discutons"}
                title={variant.ctaLabel}
                description={variant.ctaDescription}
              />
              <div>
                {variant.ctaHref.startsWith("http") ? (
                  <a
                    href={variant.ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={CTA_PRIMARY}
                  >
                    {variant.ctaLabel}
                    <ArrowRight size={14} />
                  </a>
                ) : (
                  <Link
                    href={variant.ctaHref as Parameters<typeof Link>[0]["href"]}
                    className={CTA_PRIMARY}
                  >
                    {variant.ctaLabel}
                    <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            </Reveal>
          </BlueprintSection>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
