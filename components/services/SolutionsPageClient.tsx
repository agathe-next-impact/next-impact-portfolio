"use client";

import ServicesOffers from "@/components/services/ServicesOffers";
import { ServicesComparisonTable } from "@/components/services/ServicesComparisonTable";
import ServicesGuide from "@/components/services/ServicesGuide";
import Process from "@/components/process";
import ServicesFAQ from "@/components/services/ServicesFAQ";
import { Monitor, TrendingUp, Smartphone } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { BlueprintSection, Separator } from "@/components/aspect/section";
import { Reveal } from "@/components/ui/reveal";
import { SignalPaths } from "@/components/visuals/signal-paths";
import { WordAppear } from "@/components/visuals/word-appear";

type Offer = {
  name: string;
  tech: string;
  target: string;
  concept: string;
  icon: string;
  color: string;
  features: string[];
  recommended: boolean;
};

type FAQ = {
  question: string;
  answer: string;
};

interface SolutionsPageClientProps {
  locale: Locale;
  offers: Offer[];
  faqs: FAQ[];
}

export default function SolutionsPageClient({ locale, offers, faqs }: SolutionsPageClientProps) {
  const isEn = locale === "en";

  const needsGuide = isEn
    ? [
        {
          need: "I want to update my menus and design on my own",
          solution: "Classic WordPress",
          icon: Monitor,
        },
        {
          need: "My current site is too slow and dated",
          solution: "Headless + Next.js",
          icon: TrendingUp,
        },
        {
          need: "I want a client portal with online services",
          solution: "Next.js + Headless",
          icon: Smartphone,
        },
      ]
    : [
        {
          need: "Je veux changer mes menus et mon design seul",
          solution: "WordPress Classique",
          icon: Monitor,
        },
        {
          need: "Mon site actuel est trop lent et daté",
          solution: "Headless + Next.js",
          icon: TrendingUp,
        },
        {
          need: "Je veux un portail client avec des services en ligne",
          solution: "Next.js + Headless",
          icon: Smartphone,
        },
      ];

  return (
    <main>
      {/* Héros */}
      <BlueprintSection
        tone="obsidian"
        backdrop={
          <div className="absolute inset-x-0 bottom-0 h-1/2 opacity-30">
            <SignalPaths />
          </div>
        }
        innerClassName="px-6 py-16 lg:px-8 lg:py-24"
      >
        <Reveal className="flex flex-col gap-4">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
            <span>№ 01</span>
            <span className="h-px w-6 bg-accent-secondary/50" />
            <span className="text-mid-gray">{isEn ? "Services" : "Services"}</span>
          </div>
          <h1 className="max-w-4xl text-4xl font-extralight leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            <WordAppear
              text={isEn ? "Our Headless WordPress services" : "Nos Services WordPress Headless"}
            />
          </h1>
          <p className="mt-2 max-w-2xl font-inter-tight text-base leading-relaxed text-mid-gray md:text-lg">
            {isEn
              ? "Pick the solution that fits your needs and your budget."
              : "Choisissez la solution adaptée à vos besoins et à votre budget."}
          </p>
        </Reveal>
      </BlueprintSection>

      <Separator />

      {/* § 02 — Offres */}
      <ServicesOffers offers={offers} />

      <Separator />

      {/* § 03 — Comparatif des forfaits */}
      <ServicesComparisonTable />

      <Separator />

      {/* § 04 — Quelle stack pour quel projet */}
      <ServicesGuide needsGuide={needsGuide} />

      <Separator />

      {/* § 05 — Méthode */}
      <BlueprintSection tone="obsidian" innerClassName="border-t border-dark-gray px-6 py-16 lg:px-8 lg:py-20">
        <Process />
      </BlueprintSection>

      <Separator />

      {/* § 06 — FAQ */}
      <ServicesFAQ faqs={faqs} />
    </main>
  );
}
