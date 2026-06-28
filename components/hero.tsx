"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { getHeroVariants } from "@/lib/homepage-profiles";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import HeroVideo from "@/components/hero-video";
import { BlueprintSection } from "@/components/aspect/section";
import { Reveal } from "@/components/ui/reveal";
import { AuroraGlow } from "@/components/visuals/aurora-glow";
import { WordAppear } from "@/components/visuals/word-appear";

const BTN_PRIMARY =
  "inline-flex h-11 items-center gap-2 border border-charcoal bg-vermilion px-5 font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-vermilion-bright";
const BTN_GHOST =
  "inline-flex h-11 items-center gap-2 border border-dark-gray px-5 font-mono text-[12px] uppercase tracking-[0.08em] text-foreground transition-colors hover:bg-ebony";

export default function Hero() {
  const locale = useLocale() as Locale;
  const t = useTranslations("hero");
  const variant = getHeroVariants(locale).default;
  const isExternal = variant.ctaPrimary.href.startsWith("http");

  return (
    <BlueprintSection
      tone="obsidian"
      ticks
      backdrop={
        <>
          <AuroraGlow intensity="subtle" />
          {/** <div className="absolute inset-0 opacity-50">
            <Fiber hubX={0.8} hubY={0.5} />
          </div>
          */}
        </>
      }
      innerClassName="px-6 py-16 lg:px-10 lg:py-24 border-b border-dark-gray"
    >
      {/* En-tête */}
      <Reveal className="flex flex-col gap-4">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
          <span>№ 01</span>
          <span className="h-px w-6 bg-accent-secondary/50" />
          <span className="text-mid-gray">
            {locale === "en"
              ? "Web tech advice in the age of AI"
              : "Conseil techno web à l'heure de l'IA"}
          </span>
        </div>
        <h1 className="w-3/4 text-4xl font-extralight leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          <WordAppear text={variant.headline} />{" "}
          <span className="block text-accent-secondary">{variant.subHeadline}</span>
        </h1>
      </Reveal>

      {/* 2 colonnes */}
      <div className="mt-10 grid gap-10 border-t border-dark-gray pt-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        {/* Texte */}
        <Reveal delay={0.08} className="flex flex-col">
          <p className="max-w-xl font-inter-tight text-base leading-relaxed text-foreground">
            {variant.description}
          </p>
          {/* Réassurance — marqueurs lisibles */}
          <div className="mt-5 flex flex-wrap gap-2">
            {(locale === "en"
              ? ["WordPress", "No-code", "AI coding", "Headless", "Custom"]
              : ["WordPress", "No-code", "IA coding", "Headless", "Sur-mesure"]
            ).map((chip) => (
              <span
                key={chip}
                className="inline-flex items-center gap-1.5 border border-dark-gray px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-mid-gray"
              >
                <span className="h-1 w-1 rounded-full bg-accent-secondary" />
                {chip}
              </span>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            {isExternal ? (
              <a
                href={variant.ctaPrimary.href}
                target="_blank"
                rel="noopener noreferrer"
                className={BTN_PRIMARY}
              >
                {variant.ctaPrimary.label}
              </a>
            ) : (
              <Link
                href={variant.ctaPrimary.href as Parameters<typeof Link>[0]["href"]}
                className={BTN_PRIMARY}
              >
                {variant.ctaPrimary.label}
              </Link>
            )}
            <Link
              href={variant.ctaSecondary.href as Parameters<typeof Link>[0]["href"]}
              className={BTN_GHOST}
            >
              {variant.ctaSecondary.label}
            </Link>
            <Link href="/depannage-wordpress" className={BTN_GHOST}>
              {locale === "en" ? "WordPress support" : "Dépannage WordPress"}
            </Link>
          </div>

          {/* Logos techno — preuve discrète */}
          <div className="mt-12 flex items-center gap-6 border-t border-dark-gray pt-6">
            <Image
              src="/img/logo-wordpress-small.webp"
              alt={t("wordpressLogoAlt")}
              width={36}
              height={48}
              className="opacity-60"
              priority
            />
            <Image
              src="/img/logo-nextjs.webp"
              alt={t("nextjsLogoAlt")}
              width={64}
              height={64}
              className="opacity-60"
              priority
            />
            <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-mid-gray">
              {locale === "en"
                ? "AI can generate code. It cannot decide your architecture for you."
                : "L'IA peut générer du code. Elle ne décide pas votre architecture à votre place."}
            </span>
          </div>
        </Reveal>

        {/* Démonstration vidéo */}
        <Reveal delay={0.16} className="relative">
          <HeroVideo />

          {/* Badge disponible */}
          <div className="absolute -top-3 right-0 flex items-center gap-1.5 border border-dark-gray bg-jet px-3 py-1">
            <span className="status-dot" />
            <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-foreground">
              {t("available")}
            </span>
          </div>
        </Reveal>
      </div>
    </BlueprintSection>
  );
}
