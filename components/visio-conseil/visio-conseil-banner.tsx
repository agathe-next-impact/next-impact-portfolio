"use client";

// Bandeau « Visio conseil » — band pleine largeur, drop-in bas de funnel sur la
// home, la page services, la page contact et en fin d'audit gratuit. Modèle :
// components/wordpress-express/wordpress-express-banner.tsx. Offre TIÈDE : ne
// jamais la placer dans un héros ni en CTA froid. Tokens DS uniquement, i18n
// inline, reduced-motion via <Reveal>.

import { Link } from "@/i18n/navigation";
import { ArrowRight, Video } from "lucide-react";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { BlueprintSection } from "@/components/aspect/section";
import { Reveal } from "@/components/ui/reveal";

const COPY = {
  fr: {
    eyebrow: "Déduit du devis",
    title: "Une décision web à trancher ?",
    subtitle:
      "Thèmes & extensions WordPress, ou choix de techno pour votre projet : une visio pour décider. Compte-rendu écrit — et le prix est déduit du devis si on travaille ensemble.",
    cta: "Voir la visio conseil",
  },
  en: {
    eyebrow: "Credited to your quote",
    title: "A web decision to make?",
    subtitle:
      "WordPress themes & plugins, or the tech stack for your project: a video call to decide. Written recap — and the price is credited to your quote if we work together.",
    cta: "See the advisory call",
  },
};

export function VisioConseilBanner({
  tone = "obsidian",
}: {
  tone?: "obsidian" | "jet";
}) {
  const locale = useLocale() as Locale;
  const copy = COPY[locale === "en" ? "en" : "fr"];

  return (
    <BlueprintSection tone={tone} innerClassName="px-6 py-12 lg:px-8 lg:py-16">
      <Reveal
        as="section"
        className="flex flex-wrap items-center gap-6 border border-l-[3px] border-dark-gray border-l-vermilion bg-jet/40 p-6 px-8"
      >
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-dark-gray bg-obsidian">
          <Video className="h-[1.125rem] w-[1.125rem] text-vermilion" />
        </div>

        <div className="min-w-[12rem] flex-1">
          <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-mid-gray">
            {copy.eyebrow}
          </p>
          <h3 className="mb-1 text-lg font-light tracking-tight text-foreground">
            {copy.title}
          </h3>
          <p className="font-inter-tight text-sm text-mid-gray">{copy.subtitle}</p>
        </div>

        <Link
          href="/conseil"
          className="group inline-flex flex-shrink-0 items-center gap-1.5 border border-vermilion bg-vermilion px-6 py-3 font-mono text-xs uppercase tracking-[0.06em] text-white no-underline transition-colors hover:bg-vermilion-bright"
        >
          {copy.cta}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Reveal>
    </BlueprintSection>
  );
}
