"use client";

import { ArrowRight, CalendarDays } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { BlueprintSection } from "@/components/aspect/section";
import { AuroraGlow } from "@/components/visuals/aurora-glow";
import { WordAppear } from "@/components/visuals/word-appear";

export default function HomeCta() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";

  const stats = [
    { value: "6–10", label: isEn ? "weeks avg." : "semaines moy." },
    { value: "> 90", label: "Core Web Vitals" },
  ];

  return (
    <BlueprintSection
      tone="obsidian"
      backdrop={<AuroraGlow intensity="subtle" />}
    >
      <div className="border-t border-dark-gray px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid items-end gap-10 md:grid-cols-[1fr_auto]">
          {/* Left */}
          <Reveal>
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
              № 6 —{" "}
              <span className="text-mid-gray">
                {isEn ? "Start your project" : "Démarrer votre projet"}
              </span>
            </p>
            <WordAppear
              as="h2"
              className="mb-4 max-w-[16ch] text-3xl font-extralight leading-[1.05] tracking-tight text-foreground md:text-4xl lg:text-5xl"
              text={
                isEn
                  ? "Your project online in 6 to 10 weeks."
                  : "Votre projet en ligne en 6 à 10 semaines."
              }
            />
            <p className="mb-8 max-w-[460px] font-inter-tight text-base leading-relaxed text-mid-gray">
              {isEn
                ? "A call, a clear scope, then design and build — budget and timeline fixed upfront."
                : "Un appel, un cadrage clair, puis conception et développement — budget et délai fixés d'emblée."}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://calendar.app.google/RwZqaabSR5aDMnk46"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 border border-accent-secondary bg-accent-secondary px-5 font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-obsidian hover:bg-accent-secondary/85"
              >
                <CalendarDays size={14} />
                {isEn ? "Let's talk about your project" : "Discutons de votre projet"}
              </a>
              <Link
                href="/etudes-de-cas"
                className="group inline-flex h-11 items-center gap-1.5 rounded-sm border border-dark-gray px-5 font-mono text-[12px] uppercase tracking-[0.08em] text-foreground hover:bg-jet"
              >
                {isEn ? "View case studies" : "Voir les études de cas"}
                <ArrowRight size={13} />
              </Link>
            </div>
          </Reveal>

          {/* Right — stats strip */}
          <Stagger
            as="div"
            stagger={0.08}
            delayChildren={0.1}
            className="flex min-w-[160px] flex-col border-l border-dark-gray pl-10"
          >
            {stats.map((s, i) => (
              <StaggerItem
                key={s.label}
                className={
                  i < 2 ? "mb-5 border-b border-dark-gray pb-5" : undefined
                }
              >
                <div className="text-3xl font-extralight leading-none tracking-tight text-foreground">
                  {s.value}
                </div>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-mid-gray">
                  {s.label}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </BlueprintSection>
  );
}
