"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowRight, CalendarDays } from "lucide-react";
import { CountUp } from "@/components/ui/count-up";
import { useLocale, useTranslations } from "next-intl";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { getAboutPageVariants } from "@/lib/homepage-profiles";
import type { Locale } from "@/i18n/routing";
import { BlueprintSection, SectionHeading, Separator } from "@/components/aspect/section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { WordAppear } from "@/components/visuals/word-appear";
import { Hairline } from "@/components/visuals/hairline";
import { AuroraGlow } from "@/components/visuals/aurora-glow";
import { NeonArcs } from "@/components/visuals/neon-arcs";
import { MeterBar } from "@/components/visuals/charts";

const FADE = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.25 },
};

export default function AboutClient() {
  const { profileId } = useDocumentationMode();
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const aboutVariants = getAboutPageVariants(locale);
  const variant = profileId ? aboutVariants[profileId] : aboutVariants.default;
  const t = useTranslations("aboutPage");
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
            <span className="text-mid-gray">{isEn ? "Studio" : "Le studio"}</span>
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

      {/* Manifeste — piliers adaptatifs */}
      <AnimatePresence mode="wait">
        <motion.div key={`manifeste-${key}`} {...FADE}>
          <BlueprintSection tone="obsidian">
            <Reveal className="border-t border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
              <SectionHeading
                index="№ 02"
                kicker={isEn ? "Manifesto" : "Le manifeste"}
                title={variant.manifesteAccroche}
                description={variant.manifesteIntro}
              />
            </Reveal>

            <Stagger className="grid border-t border-dark-gray md:grid-cols-3">
              {variant.piliers.map((pilier, index) => (
                <StaggerItem
                  key={index}
                  className="flex h-full flex-col border-b border-dark-gray p-6 last:border-b-0 md:border-b-0 md:border-r md:border-dark-gray md:last:border-r-0 lg:p-8"
                >
                  <Image
                    src={pilier.icon}
                    alt=""
                    width={40}
                    height={40}
                    className="mb-6 opacity-70"
                  />
                  <h3 className="text-xl font-light leading-tight tracking-tight text-foreground md:text-2xl">
                    {pilier.title}
                  </h3>
                  <p className="mt-3 font-inter-tight text-sm leading-relaxed text-mid-gray">
                    {pilier.description}
                  </p>
                  <ul className="mt-6 flex flex-1 flex-col justify-end gap-2 border-t border-dark-gray pt-5">
                    {pilier.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex gap-2 font-inter-tight text-sm leading-relaxed text-mid-gray"
                      >
                        <span className="shrink-0 pt-px font-mono text-[11px] text-accent-secondary">
                          →
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </StaggerItem>
              ))}
            </Stagger>
          </BlueprintSection>
        </motion.div>
      </AnimatePresence>

      <Separator />

      {/* Parcours — timeline statique */}
      <BlueprintSection tone="obsidian">
        <Reveal className="border-t border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
          <SectionHeading
            index="№ 03"
            kicker={t("journey.label")}
            title={t("journey.title")}
            description={t("journey.subtitle")}
          />
        </Reveal>

        <Stagger stagger={0.1} className="border-t border-dark-gray">
          {[
            {
              year: t("journey.step1.year"),
              title: t("journey.step1.title"),
              content: (
                <p className="font-inter-tight text-sm leading-relaxed text-mid-gray">
                  {t("journey.step1.description")}
                </p>
              ),
              imageSrc: "/img/about-nb-asso.jpg",
              imageAlt: t("journey.step1.imageAlt"),
            },
            {
              year: t("journey.step2.year"),
              title: t("journey.step2.title"),
              content: (
                <p className="font-inter-tight text-sm leading-relaxed text-mid-gray">
                  {t("journey.step2.description")}
                </p>
              ),
              imageSrc: "/img/about-code.jpg",
              imageAlt: t("journey.step2.imageAlt"),
            },
            {
              year: t("journey.step3.year"),
              title: t("journey.step3.title"),
              content: (
                <ul className="flex flex-col gap-2.5">
                  {(["user", "tech", "ai"] as const).map((k) => (
                    <li
                      key={k}
                      className="font-inter-tight text-sm leading-relaxed text-mid-gray"
                    >
                      <strong className="font-medium text-foreground">
                        {t(`journey.step3.items.${k}.label`)}
                      </strong>{" "}
                      {t(`journey.step3.items.${k}.text`)}
                    </li>
                  ))}
                  <li className="mt-2 font-inter-tight text-[13px] italic leading-relaxed text-mid-gray">
                    {t.rich("journey.step3.figaroMention", {
                      lien: (chunks) => (
                        <a
                          href="https://www.lefigaro.fr/economie/wordpress-headless-comment-les-pme-peuvent-moderniser-leur-site-sans-tout-reconstruire-avec-next-impact-digital-20260512"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent-secondary underline underline-offset-4 hover:text-foreground"
                        >
                          {chunks}
                        </a>
                      ),
                    })}
                  </li>
                </ul>
              ),
              imageSrc: "/img/contact-agathe-km.png",
              imageAlt: t("journey.step3.imageAlt"),
            },
          ].map((step, i) => (
            <StaggerItem
              key={i}
              className="grid gap-6 border-b border-dark-gray p-6 last:border-b-0 lg:grid-cols-[140px_1fr_280px] lg:gap-10 lg:p-8"
            >
              <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-accent-secondary lg:pt-1">
                {step.year}
              </div>
              <div>
                <h3 className="mb-3 text-lg font-light leading-tight tracking-tight text-foreground md:text-xl">
                  {step.title}
                </h3>
                {step.content}
              </div>
              <div className="relative h-44 overflow-hidden rounded-sm border border-dark-gray lg:h-48">
                <Image
                  src={step.imageSrc}
                  alt={step.imageAlt}
                  fill
                  className="object-cover object-top"
                  sizes="280px"
                />
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </BlueprintSection>

      <Separator />

      {/* Citation — adaptative */}
      <AnimatePresence mode="wait">
        <motion.div key={`citation-${key}`} {...FADE}>
          <BlueprintSection tone="jet" innerClassName="border-t border-dark-gray px-6 py-16 lg:px-10 lg:py-20">
            <Reveal className="flex flex-col gap-6">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
                <span>№ 04</span>
                <span className="h-px w-6 bg-accent-secondary/50" />
              </div>
              <blockquote className="max-w-3xl border-l-2 border-accent-secondary/60 pl-6 text-2xl font-extralight leading-snug tracking-tight text-foreground md:pl-8 md:text-3xl lg:text-4xl">
                &ldquo;{variant.citation}&rdquo;
              </blockquote>
              <Hairline width="100%" accent className="max-w-3xl" />
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-mid-gray md:pl-8">
                {t("citationByline")}
              </p>
            </Reveal>
          </BlueprintSection>
        </motion.div>
      </AnimatePresence>

      <Separator />

      {/* Chiffres clés */}
      <BlueprintSection tone="obsidian">
        <Reveal className="border-t border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
          <SectionHeading
            index="№ 05"
            kicker={t("metrics.label")}
            title={t("metrics.title")}
          />
        </Reveal>

        <Stagger stagger={0.1} className="grid border-t border-dark-gray md:grid-cols-3">
          {[
            { end: 15, prefix: "+", label: t("metrics.yearsCommitment"), meter: 100 },
            { end: 8, prefix: "+", label: t("metrics.yearsDevelopment"), meter: 78 },
            { end: 25, prefix: "+", label: t("metrics.projectsDelivered"), meter: 88 },
          ].map((stat) => (
            <StaggerItem
              key={stat.label}
              className="flex flex-col border-b border-dark-gray p-8 last:border-b-0 md:border-b-0 md:border-r md:border-dark-gray md:last:border-r-0 lg:p-10"
            >
              <div className="text-5xl font-extralight leading-none tracking-tight text-foreground lg:text-6xl">
                <CountUp end={stat.end} prefix={stat.prefix} />
              </div>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.1em] text-mid-gray">
                {stat.label}
              </p>
              <MeterBar value={stat.meter} className="mt-6" />
            </StaggerItem>
          ))}
        </Stagger>
      </BlueprintSection>

      <Separator />

      {/* CTA final — adaptatif */}
      <AnimatePresence mode="wait">
        <motion.div key={`cta-${key}`} {...FADE}>
          <BlueprintSection
            tone="jet"
            backdrop={<AuroraGlow intensity="subtle" />}
            innerClassName="border-t border-dark-gray px-6 py-16 lg:px-10 lg:py-20"
          >
            <Reveal className="flex flex-col gap-6">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
                <span>№ 06</span>
                <span className="h-px w-6 bg-accent-secondary/50" />
                <span className="text-mid-gray">{isEn ? "Get in touch" : "Échanger"}</span>
              </div>
              <p className="max-w-xl font-inter-tight text-base leading-relaxed text-foreground md:text-lg">
                {variant.ctaDescription}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {variant.ctaHref.startsWith("http") ? (
                  <a
                    href={variant.ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center gap-2 border border-charcoal bg-vermilion px-5 font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-vermilion-bright"
                  >
                    <CalendarDays size={14} />
                    {variant.ctaLabel}
                  </a>
                ) : (
                  <Link
                    href={variant.ctaHref as Parameters<typeof Link>[0]["href"]}
                    className="group inline-flex h-11 items-center gap-2 border border-charcoal bg-vermilion px-5 font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-vermilion-bright"
                  >
                    {variant.ctaLabel}
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
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
