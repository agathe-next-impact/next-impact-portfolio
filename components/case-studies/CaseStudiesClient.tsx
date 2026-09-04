"use client";

import { AnimatePresence, m as motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Realisations from "@/components/case-studies/realisations";
import { useLocale } from "next-intl";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { getCaseStudiesPageVariants } from "@/lib/homepage-profiles";
import type { CaseStudyCard } from "@/lib/case-studies-data";
import type { Locale } from "@/i18n/routing";
import { BlueprintSection, SectionHeading, Separator } from "@/components/aspect/section";
import { PageHero, HERO_BTN_PRIMARY } from "@/components/aspect/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { NeonArcs } from "@/components/visuals/neon-arcs";

const FADE = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.25 },
};

const CTA_PRIMARY =
  "inline-flex min-h-11 items-center gap-2 py-2.5 border border-accent-secondary bg-accent-secondary px-5 font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-obsidian transition-colors hover:bg-accent-secondary/85";
const CTA_GHOST =
  "inline-flex min-h-11 items-center gap-2 py-2.5 border border-dark-gray px-5 font-mono text-[12px] uppercase tracking-[0.08em] text-foreground transition-colors hover:bg-jet";

export default function CaseStudiesClient({ cards }: { cards: CaseStudyCard[] }) {
  const { profileId } = useDocumentationMode();
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const caseStudiesVariants = getCaseStudiesPageVariants(locale);
  const variant = profileId ? caseStudiesVariants[profileId] : caseStudiesVariants.default;
  const key = profileId || "default";

  return (
    <div>
      {/* Héros éditorial (harmonisé /veille) — tokens standards, theme-aware
          comme le reste du site (fond sombre par défaut, clair via .light). */}
      <PageHero
        index="№ 01"
        kicker={isEn ? "Case studies" : "Études de cas"}
        title={variant.titre}
        description={variant.sousTitre}
        actions={
          /* Preuve avant demande : la démo vidéo se consulte sans engagement. */
          <Link href="/demo" className={HERO_BTN_PRIMARY}>
            <Play size={14} fill="currentColor" aria-hidden="true" />
            {isEn ? "Watch the demos in video" : "Voir les démos en vidéo"}
          </Link>
        }
        backdrop={
          <div className="absolute inset-0 opacity-50">
            <NeonArcs />
          </div>
        }
      />


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
                <Realisations cards={cards} defaultTab={variant.defaultTab} />
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
                kicker={isEn ? "Your site" : "Votre site"}
                title={
                  isEn ? (
                    <>
                      Where does <span className="text-accent-secondary">your site</span> stand?
                    </>
                  ) : (
                    <>
                      Où en est <span className="text-accent-secondary">votre site</span> ?
                    </>
                  )
                }
                description={
                  isEn
                    ? "Compare it to these projects in 2 minutes — then, if it helps, let's talk."
                    : "Comparez-le à ces projets en 2 minutes — puis, si c'est utile, on en discute."
                }
              />
              <div className="flex flex-wrap gap-3">
                {/* Froid en primaire : un prospect qui vérifie n'est pas prêt pour
                    un RDV — on lui donne d'abord de quoi se situer. */}
                <Link href="/audit-site-web" className={CTA_PRIMARY}>
                  {isEn ? "Compare my site — 2 min" : "Comparer mon site — 2 min"}
                  <ArrowRight size={14} />
                </Link>
                {/* Chaud en secondaire : le RDV reste accessible pour les prêts. */}
                {variant.ctaHref.startsWith("http") ? (
                  <a
                    href={variant.ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={CTA_GHOST}
                  >
                    {variant.ctaLabel}
                  </a>
                ) : (
                  <Link
                    href={variant.ctaHref as Parameters<typeof Link>[0]["href"]}
                    className={CTA_GHOST}
                  >
                    {variant.ctaLabel}
                  </Link>
                )}
              </div>
              {/* Sortie latérale pour l'indécis techno : la visio Sélecteur (/conseil). */}
              <p className="font-inter-tight text-sm leading-relaxed text-mid-gray">
                {isEn ? (
                  <>
                    Still unsure about the tech?{" "}
                    <Link
                      href="/conseil"
                      className="text-accent-secondary underline underline-offset-4 transition-colors hover:text-foreground"
                    >
                      That&apos;s exactly what the Selector call is for.
                    </Link>
                  </>
                ) : (
                  <>
                    Vous hésitez encore sur la techno ?{" "}
                    <Link
                      href="/conseil"
                      className="text-accent-secondary underline underline-offset-4 transition-colors hover:text-foreground"
                    >
                      C&apos;est exactement l&apos;objet de la visio Sélecteur.
                    </Link>
                  </>
                )}
              </p>
            </Reveal>
          </BlueprintSection>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
