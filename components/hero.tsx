"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { getHeroVariants } from "@/lib/homepage-profiles";

import type { Locale } from "@/i18n/routing";
import { BlueprintSection } from "@/components/aspect/section";
import { Reveal } from "@/components/ui/reveal";
import { AuroraGlow } from "@/components/visuals/aurora-glow";

// ─────────────────────────────────────────────────────────────────────────────
// Héros de la home, refait le 2026-09-27 (ADR-018, charte §6 et §9 point 1).
//
// Une seule décision : le positionnement en quatre mots (charte v1.7,
// ADR-019), un sous-titre en trois verbes, une phrase de promesse qui porte le
// mesurable, deux boutons de deux températures (analyse du site, rendez-vous).
// Les onglets Veille / Conseil / Refonte sont retirés : ils rejouaient, en
// moins bien, la section de l'offre par besoin qui suit (home-offres), et
// plaçaient des prix dans le héros. La preuve chiffrée vient juste dessous
// (ProofStrip, posée par home-client) ; ici, la présence humaine (photo) et les
// logos clients.
//
// Titre, description et boutons : HERO_VARIANTS.default
// (lib/homepage-profiles*.ts, FR + EN).
// ─────────────────────────────────────────────────────────────────────────────

const BTN_PRIMARY =
  "inline-flex min-h-11 items-center gap-2 border border-accent-secondary bg-accent-secondary px-5 py-2.5 font-mono text-sm font-semibold uppercase tracking-[0.08em] text-obsidian no-underline transition-colors hover:bg-accent-secondary/85";
const BTN_SECONDARY =
  "inline-flex min-h-11 items-center gap-2 border border-dark-gray px-5 py-2.5 font-mono text-sm font-semibold uppercase tracking-[0.08em] text-foreground no-underline transition-colors hover:bg-jet";

const LOGOS = [
  { src: "/img/logo-sowee_1.webp", alt: "Sowee" },
  { src: "/img/logo-geofit.webp", alt: "Geofit" },
  { src: "/img/logo-aquitaine-robotics.webp", alt: "Aquitaine Robotics" },
  { src: "/img/logo-proditec.webp", alt: "Proditec" },
  { src: "/img/logo-transitions-pro.webp", alt: "Transitions Pro" },
  { src: "/img/logo-sdevo.webp", alt: "SDEVO" },
  { src: "/img/logo-infralliance.webp", alt: "Infralliance" },
  { src: "/img/logo-hermitage.webp", alt: "Tiers Lieu L'Hermitage" },
  { src: "/img/logo-wagner-hamisky_3.webp", alt: "Wagner Hamisky" },
  { src: "/img/logo-salondelacarrosserie.webp", alt: "Salon des professionnels de la carrosserie" },
  { src: "/img/logo-next-event.webp", alt: "Next Event" },
  { src: "/img/logo-mediatico.webp", alt: "Mediatico" },
  { src: "/img/logo-erp-services.webp", alt: "ERP Services" },
  { src: "/img/logo-itavera.webp", alt: "Itavera Asset Management" },
  { src: "/img/logo-egc.webp", alt: "Les États Généraux Communaux" },
  { src: "/img/logo-naturedea.webp", alt: "Naturedéa" },
];

export default function Hero() {
  const locale = useLocale() as Locale;
  const t = useTranslations("hero");
  const variant = getHeroVariants(locale).default;
  const isEn = locale === "en";

  const reassurance = isEn
    ? ["Price and timeline in writing", "6 to 10 weeks", "A single point of contact", "Watch at every step"]
    : ["Prix et délai écrits", "6 à 10 semaines", "Une interlocutrice unique", "Veille à chaque étape"];

  return (
    <BlueprintSection
      tone="obsidian"
      ticks
      backdrop={<AuroraGlow intensity="subtle" />}
      innerClassName="px-6 py-16 lg:px-10 lg:py-24"
    >
      <div className="grid gap-12 lg:grid-cols-[1.45fr_1fr] lg:items-center">
        {/* Le positionnement, les trois verbes, la promesse, deux boutons */}
        <Reveal className="flex flex-col gap-6">
          <div className="flex items-center gap-2 font-mono text-2xs uppercase tracking-[0.14em] text-accent-secondary">
            <span>№ 01</span>
            <span className="h-px w-6 bg-accent-secondary/50" />
            <span className="text-mid-gray">
              {isEn ? "Outsourced technical expert" : "Expert technique externalisé"}
            </span>
          </div>
          <h1 className="text-4xl font-extralight leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {variant.headline}{" "}
            <em className="font-normal not-italic text-accent-secondary">{variant.subHeadline}</em>
          </h1>
          {variant.tagline && (
            <p className="text-xl font-light leading-snug tracking-tight text-foreground md:text-2xl">
              {variant.tagline}
            </p>
          )}
          <p className="max-w-2xl font-inter-tight text-base leading-relaxed text-mid-gray md:text-lg">
            {variant.description}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {/* Premier bouton : l'échange gratuit de 15 minutes, sur Calendly
                (ADR-023) — lien externe, nouvel onglet. */}
            <a
              href={variant.ctaPrimary.href}
              target="_blank"
              rel="noopener noreferrer"
              className={BTN_PRIMARY}
            >
              {variant.ctaPrimary.label}
              <ArrowRight size={14} />
            </a>
            {/* /scan vit hors de app/[locale]/ : balise <a>, pas le Link i18n,
                qui produirait /en/scan en anglais. */}
            <a href={variant.ctaSecondary.href} className={BTN_SECONDARY}>
              {variant.ctaSecondary.label}
            </a>
          </div>
          <ul className="flex flex-wrap gap-2">
            {reassurance.map((item) => (
              <li
                key={item}
                className="inline-flex items-center gap-1.5 border border-dark-gray px-2.5 py-1 font-mono text-2xs uppercase tracking-[0.08em] text-mid-gray"
              >
                <span className="h-1 w-1 rounded-full bg-accent-secondary" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Qui le fait : la présence humaine */}
        <Reveal delay={0.12} className="relative mx-auto w-full max-w-[420px]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-dark-gray bg-obsidian">
            <Image
              src="/img/agathe.png"
              alt={
                isEn
                  ? "Agathe Karinthi-Martin, founder of Next Impact Digital, at her workstation"
                  : "Agathe Karinthi-Martin, fondatrice de Next Impact Digital, à son poste de travail"
              }
              fill
              priority
              className="object-cover object-center"
              sizes="(min-width: 1024px) 420px, 100vw"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 px-4 py-3">
              <span className="font-mono text-2xs uppercase tracking-[0.1em] text-white">
                Agathe Karinthi-Martin
              </span>
              <span className="font-inter-tight text-sm text-white/80">
                {isEn
                  ? "15 years publishing in WordPress before building it. I scope, AI executes."
                  : "15 ans à publier dans WordPress avant d'en développer. Je cadre, l'IA exécute."}
              </span>
            </div>
          </div>
          <div className="absolute -top-3 right-0 flex items-center gap-1.5 border border-dark-gray bg-jet px-3 py-1">
            <span className="status-dot" />
            <span className="font-mono text-2xs uppercase tracking-[0.1em] text-foreground">
              {t("available")}
            </span>
          </div>
        </Reveal>
      </div>

      {/* Logos clients : preuve sociale discrète */}
      <div className="mt-14 flex flex-col gap-4 border-t border-dark-gray pt-6">
        <span className="font-mono text-2xs uppercase tracking-[0.12em] text-mid-gray">
          {isEn ? "Trusted by" : "Ils m'ont fait confiance"}
        </span>
        {/* Uniquement des assets détourés (fond transparent vérifié). */}
        <div className="flex flex-wrap items-center gap-x-[62px] gap-y-[42px]">
          {LOGOS.map((logo) => (
            <Image
              key={logo.src}
              src={logo.src}
              alt={logo.alt}
              width={108}
              height={27}
              className="h-[27px] w-auto opacity-90 transition-opacity hover:opacity-100"
            />
          ))}
        </div>
      </div>
    </BlueprintSection>
  );
}
