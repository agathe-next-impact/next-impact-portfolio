"use client";

import { LucideIcon } from "lucide-react";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { BlueprintSection, SectionHeading } from "@/components/aspect/section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";

interface GuideItem {
  icon: LucideIcon;
  need: string;
  solution: string;
}

export default function ServicesGuide({ needsGuide }: { needsGuide: GuideItem[] }) {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";

  return (
    <BlueprintSection tone="obsidian">
      {/* En-tête */}
      <Reveal className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          index="№ 05"
          kicker={isEn ? "Which path" : "Quelle voie"}
          title={isEn ? "Which complexity level for which need" : "Quel niveau de complexité pour quel besoin"}
          description={
            isEn
              ? "Identify whether you should fix, simplify, use SaaS, no-code, WordPress, Headless or custom"
              : "Identifiez s'il faut réparer, simplifier, utiliser un SaaS, du no-code, WordPress, Headless ou du sur-mesure"
          }
        />
      </Reveal>

      {/* Lignes besoin → solution */}
      <Stagger>
        {needsGuide.map((item, idx) => (
          <StaggerItem
            key={idx}
            className="group flex flex-col gap-3 border-b border-dark-gray px-6 py-7 transition-colors last:border-b-0 hover:bg-jet md:flex-row md:items-center md:justify-between lg:px-8"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-overlay-gray">
                <item.icon className="h-5 w-5 text-mid-gray transition-colors group-hover:text-accent-secondary" strokeWidth={1.5} />
              </div>
              <p className="font-inter-tight text-base text-foreground md:text-lg">
                &laquo;&nbsp;{item.need}&nbsp;&raquo;
              </p>
            </div>
            <div className="flex items-center gap-3 pl-14 md:ml-auto md:pl-0">
              <span className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.12em] text-accent-secondary">
                → {item.solution}
              </span>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </BlueprintSection>
  );
}
