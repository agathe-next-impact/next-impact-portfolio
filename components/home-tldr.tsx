"use client";

// Bloc « En bref » (TL;DR) — résumé citable par les LLMs, juste sous le hero.
// Encart discret (liseré accent, bordure fine) pour ne pas alourdir le haut de
// page. La classe `.home-tldr` sert de cible au SpeakableSpecification (JSON-LD).

import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { getHomeContent } from "@/lib/home-content";
import { BlueprintSection } from "@/components/aspect/section";
import { Reveal } from "@/components/ui/reveal";

export default function HomeTldr() {
  const locale = useLocale() as Locale;
  const { tldr } = getHomeContent(locale);

  return (
    <BlueprintSection tone="obsidian" innerClassName="px-6 py-8 lg:px-10 lg:py-10">
      <Reveal className="home-tldr border border-l-[3px] border-dark-gray border-l-accent-secondary bg-jet/40 px-6 py-5 lg:px-8">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-accent-secondary">
          {tldr.label}
        </p>
        <ul className="flex flex-col gap-2">
          {tldr.lines.map((line) => (
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
  );
}
