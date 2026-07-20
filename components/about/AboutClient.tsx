"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowRight, CalendarDays, Gauge, Newspaper, Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { getAboutContent } from "@/lib/about-content";
import { CountUp } from "@/components/ui/count-up";
import {
  BlueprintSection,
  SectionHeading,
  Separator,
} from "@/components/aspect/section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { WordAppear } from "@/components/visuals/word-appear";
import { AuroraGlow } from "@/components/visuals/aurora-glow";
import { NeonArcs } from "@/components/visuals/neon-arcs";
import { MeterBar } from "@/components/visuals/charts";

type LinkHref = Parameters<typeof Link>[0]["href"];

const CALENDAR_URL = "https://calendar.app.google/RwZqaabSR5aDMnk46";
const FIGARO_URL =
  "https://www.lefigaro.fr/economie/wordpress-headless-comment-les-pme-peuvent-moderniser-leur-site-sans-tout-reconstruire-avec-next-impact-digital-20260512";
const HAL_URL = "https://archivesic.ccsd.cnrs.fr/sic_01002025";
const MAGMA_URL = "http://www.analisiqualitativa.com/magma/1302/article_10.htm";

const STEP_P = "font-inter-tight text-sm leading-relaxed text-mid-gray";
const LINK_INLINE =
  "text-accent-secondary underline underline-offset-4 hover:text-foreground";

export default function AboutClient() {
  const t = useTranslations("aboutPage");
  const locale = useLocale() as Locale;
  const about = getAboutContent(locale);

  const timelineSteps: { year: string; title: string; body: ReactNode }[] = [
    {
      year: t("journey.fondations.year"),
      title: t("journey.fondations.title"),
      body: <p className={STEP_P}>{t("journey.fondations.description")}</p>,
    },
    {
      year: t("journey.theorie.year"),
      title: t("journey.theorie.title"),
      body: (
        <>
          <p className={STEP_P}>
            {t.rich("journey.theorie.description", {
              hal: (chunks) => (
                <a
                  href={HAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK_INLINE}
                >
                  {chunks}
                </a>
              ),
              magma: (chunks) => (
                <a
                  href={MAGMA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK_INLINE}
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
          <p className="mt-2 font-inter-tight text-[13px] italic leading-relaxed text-mid-gray">
            {t("journey.theorie.note")}
          </p>
        </>
      ),
    },
    {
      year: t("journey.code.year"),
      title: t("journey.code.title"),
      body: <p className={STEP_P}>{t("journey.code.description")}</p>,
    },
    {
      year: t("journey.today.year"),
      title: t("journey.today.title"),
      body: (
        <ul className="flex flex-col gap-2.5">
          {(["user", "tech", "theory"] as const).map((k) => (
            <li key={k} className={STEP_P}>
              <strong className="font-medium text-foreground">
                {t(`journey.today.${k}.label`)}
              </strong>{" "}
              {t(`journey.today.${k}.text`)}
            </li>
          ))}
        </ul>
      ),
    },
  ];

  const manifestoCards = [
    { key: "ecarts", n: "01" },
    { key: "decision", n: "02" },
    { key: "multiplicateur", n: "03" },
  ] as const;

  const metrics: {
    end: number;
    label: string;
    meter: number;
    href?: string;
    cta?: string;
  }[] = [
    { end: 25, label: t("proofs.metrics.pratique"), meter: 100 },
    { end: 15, label: t("proofs.metrics.wordpress"), meter: 80 },
    {
      end: 25,
      label: t("proofs.metrics.projets"),
      meter: 92,
      href: "/etudes-de-cas",
      cta: t("proofs.metrics.projetsCta"),
    },
  ];

  return (
    <div>
      {/* № 01 — Héros : la personne derrière Next Impact */}
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
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <Reveal className="flex flex-col gap-4">
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
              <span>№ 01</span>
              <span className="h-px w-6 bg-accent-secondary/50" />
              <span className="text-mid-gray">{t("hero.kicker")}</span>
            </div>
            <h1 className="max-w-3xl text-4xl font-extralight leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              <WordAppear text={t("hero.title")} />
            </h1>
            <p className="mt-2 max-w-xl font-inter-tight text-base leading-relaxed text-foreground md:text-lg">
              {t.rich("hero.lead", {
                em: (chunks) => (
                  <em className="not-italic text-accent-secondary">{chunks}</em>
                ),
              })}
            </p>
            <p className="max-w-xl font-inter-tight text-sm leading-relaxed text-mid-gray md:text-base">
              {t("hero.subtext")}
            </p>
          </Reveal>

          <Reveal
            delay={0.1}
            className="relative mx-auto aspect-[4/5] w-full max-w-xs overflow-hidden rounded-sm border border-dark-gray lg:max-w-none"
          >
            <Image
              src="/img/contact-agathe-km.png"
              alt={t("hero.imageAlt")}
              fill
              priority
              className="object-cover object-top"
              sizes="(max-width: 1024px) 20rem, 33vw"
            />
          </Reveal>
        </div>
      </BlueprintSection>

      {/* En bref — TL;DR citable par les moteurs IA (GEO) */}
      <BlueprintSection tone="obsidian" innerClassName="px-6 py-8 lg:px-10 lg:py-10">
        <Reveal className="about-tldr border border-l-[3px] border-dark-gray border-l-accent-secondary bg-jet/40 px-6 py-5 lg:px-8">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-accent-secondary">
            {about.tldr.label}
          </p>
          <ul className="flex flex-col gap-2">
            {about.tldr.lines.map((line) => (
              <li
                key={line}
                className="font-inter-tight text-sm leading-relaxed text-mid-gray md:text-[15px]"
              >
                {line}
              </li>
            ))}
          </ul>
        </Reveal>
      </BlueprintSection>

      <Separator />

      {/* № 02 — Le parcours */}
      <BlueprintSection tone="obsidian">
        <Reveal className="border-t border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
          <SectionHeading
            index="№ 02"
            kicker={t("journey.label")}
            title={t("journey.title")}
            description={t("journey.subtitle")}
          />
        </Reveal>

        <Stagger stagger={0.08} className="border-t border-dark-gray">
          {timelineSteps.map((step, i) => (
            <StaggerItem
              key={i}
              className="grid gap-4 border-b border-dark-gray p-6 last:border-b-0 lg:grid-cols-[180px_1fr] lg:gap-10 lg:p-8"
            >
              <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-accent-secondary lg:pt-1">
                {step.year}
              </div>
              <div>
                <h3 className="mb-3 text-lg font-light leading-tight tracking-tight text-foreground md:text-xl">
                  {step.title}
                </h3>
                {step.body}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </BlueprintSection>

      <Separator />

      {/* № 03 — Le manifeste : la posture à l'heure de l'IA */}
      <BlueprintSection tone="obsidian">
        <Reveal className="border-t border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
          <SectionHeading
            index="№ 03"
            kicker={t("manifesto.label")}
            title={t("manifesto.title")}
          />
        </Reveal>

        <Reveal className="border-t border-dark-gray px-6 py-10 lg:px-8">
          <blockquote className="max-w-3xl border-l-2 border-accent-secondary/60 pl-6 text-xl font-extralight leading-snug tracking-tight text-foreground md:text-2xl">
            &ldquo;{t("manifesto.chapo")}&rdquo;
          </blockquote>
          <p className="mt-3 pl-6 font-mono text-[11px] uppercase tracking-[0.1em] text-mid-gray">
            {t("manifesto.chapoByline")}
          </p>
          <p className="mt-8 max-w-2xl font-inter-tight text-base leading-relaxed text-mid-gray md:text-lg">
            {t("manifesto.intro")}
          </p>
        </Reveal>

        <Stagger className="grid border-t border-dark-gray md:grid-cols-3">
          {manifestoCards.map(({ key, n }) => (
            <StaggerItem
              key={key}
              className="flex h-full flex-col border-b border-dark-gray p-6 last:border-b-0 md:border-b-0 md:border-r md:border-dark-gray md:last:border-r-0 lg:p-8"
            >
              <span className="mb-6 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
                {n}
              </span>
              <h3 className="text-xl font-light leading-tight tracking-tight text-foreground md:text-2xl">
                {t(`manifesto.${key}.title`)}
              </h3>
              <p className="mt-3 font-inter-tight text-sm leading-relaxed text-mid-gray">
                {t(`manifesto.${key}.description`)}
              </p>
              <ul className="mt-6 flex flex-1 flex-col justify-end gap-2 border-t border-dark-gray pt-5">
                {(["item1", "item2", "item3"] as const).map((it) => (
                  <li
                    key={it}
                    className="flex gap-2 font-inter-tight text-sm leading-relaxed text-mid-gray"
                  >
                    <span className="shrink-0 pt-px font-mono text-[11px] text-accent-secondary">
                      →
                    </span>
                    {t(`manifesto.${key}.${it}`)}
                  </li>
                ))}
              </ul>
            </StaggerItem>
          ))}
        </Stagger>
      </BlueprintSection>

      <Separator />

      {/* № 04 — Preuves : Figaro + chiffres */}
      <BlueprintSection tone="obsidian">
        <Reveal className="border-t border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
          <SectionHeading index="№ 04" kicker={t("proofs.label")} title={t("proofs.title")} />
        </Reveal>

        <Reveal className="border-t border-dark-gray px-6 py-8 lg:px-8">
          <div className="flex flex-col gap-4 rounded-sm border border-dark-gray bg-jet/40 p-6 sm:flex-row sm:items-center sm:justify-between lg:p-8">
            <div className="flex items-start gap-4">
              <Newspaper size={22} className="mt-0.5 shrink-0 text-accent-secondary" />
              <p className="max-w-2xl font-inter-tight text-sm leading-relaxed text-foreground md:text-base">
                {t.rich("proofs.figaro.text", {
                  lien: (chunks) => (
                    <span className="font-medium text-foreground">{chunks}</span>
                  ),
                })}
              </p>
            </div>
            <a
              href={FIGARO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex shrink-0 items-center gap-2 font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-accent-secondary hover:text-foreground"
            >
              {t("proofs.figaro.cta")}
              <ArrowRight
                size={13}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </Reveal>

        <Stagger stagger={0.1} className="grid border-t border-dark-gray md:grid-cols-3">
          {metrics.map((stat, i) => (
            <StaggerItem
              key={i}
              className="flex flex-col border-b border-dark-gray p-8 last:border-b-0 md:border-b-0 md:border-r md:border-dark-gray md:last:border-r-0 lg:p-10"
            >
              <div className="text-5xl font-extralight leading-none tracking-tight text-foreground lg:text-6xl">
                <CountUp end={stat.end} />
              </div>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.1em] text-mid-gray">
                {stat.label}
              </p>
              <MeterBar value={stat.meter} className="mt-6" />
              {stat.href && (
                <Link
                  href={stat.href as LinkHref}
                  className="group mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-accent-secondary hover:text-foreground"
                >
                  {stat.cta}
                  <ArrowRight
                    size={12}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              )}
            </StaggerItem>
          ))}
        </Stagger>
        {/* Témoignages — emplacement réservé (chantier). Prioriser un témoignage
            client nominatif chiffré (ex. Panorama Pub) avant mise en ligne. */}
      </BlueprintSection>

      <Separator />

      {/* FAQ — parcours d'Agathe (GEO / FAQPage). Accordéon natif <details> :
          contenu VISIBLE = schema (politique Google), 100 % SSR et accessible. */}
      <BlueprintSection tone="obsidian">
        <Reveal className="border-t border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
          <SectionHeading kicker={about.faq.kicker} title={about.faq.title} />
        </Reveal>
        <div className="border-t border-dark-gray px-6 lg:px-8">
          {about.faq.items.map((f) => (
            <details
              key={f.question}
              className="group border-b border-dark-gray last:border-b-0"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 [&::-webkit-details-marker]:hidden">
                <span className="font-inter-tight text-[15px] text-foreground md:text-base">
                  {f.question}
                </span>
                <Plus
                  size={16}
                  className="shrink-0 text-mid-gray transition-transform group-open:rotate-45"
                />
              </summary>
              <p className="max-w-3xl pb-6 font-inter-tight text-sm leading-relaxed text-mid-gray">
                {f.answer}
              </p>
            </details>
          ))}
        </div>
      </BlueprintSection>

      <Separator />

      {/* Mention TIH / OETH — sobre, en fin de parcours, jamais en accroche */}
      <BlueprintSection
        tone="jet"
        innerClassName="border-t border-dark-gray px-6 py-8 lg:px-10"
      >
        <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-3xl font-inter-tight text-sm leading-relaxed text-mid-gray">
            {t.rich("tih.text", {
              strong: (chunks) => (
                <strong className="font-medium text-foreground">{chunks}</strong>
              ),
            })}
          </p>
          <Link
            href={"/avantage-oeth" as LinkHref}
            className="group inline-flex shrink-0 items-center gap-2 font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-accent-secondary hover:text-foreground"
          >
            {t("tih.cta")}
            <ArrowRight
              size={13}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </Reveal>
      </BlueprintSection>

      <Separator />

      {/* № 05 — Double CTA final : froid (prioritaire) + chaud */}
      <BlueprintSection
        tone="jet"
        backdrop={<AuroraGlow intensity="subtle" />}
        innerClassName="border-t border-dark-gray px-6 py-16 lg:px-10 lg:py-20"
      >
        <Reveal className="flex flex-col gap-8">
          <SectionHeading
            index="№ 05"
            kicker={t("ctaFinal.label")}
            title={t("ctaFinal.title")}
          />
          <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
            {/* CTA froid — dominant */}
            <Link
              href={"/audit-site-web" as LinkHref}
              className="group flex flex-col justify-between gap-6 rounded-sm border border-charcoal bg-vermilion/10 p-6 transition-colors hover:bg-vermilion/15 lg:p-8"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-accent-secondary">
                  <Gauge size={14} />
                  <span>{t("ctaFinal.coldTag")}</span>
                </div>
                <h3 className="text-xl font-light leading-tight tracking-tight text-foreground md:text-2xl">
                  {t("ctaFinal.coldTitle")}
                </h3>
                <p className="font-inter-tight text-sm leading-relaxed text-mid-gray">
                  {t("ctaFinal.coldDescription")}
                </p>
              </div>
              <span className="inline-flex items-center gap-2 font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-accent-secondary group-hover:text-foreground">
                {t("ctaFinal.coldCta")}
                <ArrowRight
                  size={13}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </span>
            </Link>

            {/* CTA chaud — secondaire */}
            <a
              href={CALENDAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between gap-6 rounded-sm border border-dark-gray p-6 transition-colors hover:border-mid-gray lg:p-8"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">
                  <CalendarDays size={14} />
                  <span>{t("ctaFinal.warmTag")}</span>
                </div>
                <h3 className="text-xl font-light leading-tight tracking-tight text-foreground md:text-2xl">
                  {t("ctaFinal.warmTitle")}
                </h3>
              </div>
              <span className="inline-flex items-center gap-2 font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-foreground">
                {t("ctaFinal.warmCta")}
                <ArrowRight
                  size={13}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </span>
            </a>
          </div>
        </Reveal>
      </BlueprintSection>
    </div>
  );
}
