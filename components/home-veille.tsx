"use client";

import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { SectionHeading } from "@/components/aspect/section";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import { VEILLE, packsAvecVeille, type VeilleMode } from "@/lib/situations";
import type { Lang } from "@/lib/trajectoires";
import { PackLink } from "@/components/packs/pack-link";

// ─────────────────────────────────────────────────────────────────────────────
// Home § 03 : la spécificité de Next Impact, l'analyse et la veille technique
// et stratégique (charte v1.7, ADR-021).
//
// Deux cartes, une par forme de veille : l'analyse technique et stratégique
// (avant de décider et de construire), la veille écosystème et technos (une
// fois le site en ligne). Sous chaque carte, les packs qui la contiennent, en
// badges à bord carré, chacun vers sa page.
//
// Aucune liste écrite ici : noms et textes viennent de VEILLE, la liste des
// packs de packsAvecVeille() (lib/situations.ts), qui lit les étapes de
// chaque pack.
// ─────────────────────────────────────────────────────────────────────────────


const MODES: VeilleMode[] = ["premiere-analyse", "continu"];

export default function HomeVeille() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const l: Lang = isEn ? "en" : "fr";

  return (
    <section className="relative overflow-hidden bg-obsidian px-2.5 lg:px-0">
      <div className="relative mx-auto w-full max-w-[1200px] border-x border-dark-gray">
        <Reveal className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
          <SectionHeading
            index="№ 03"
            kicker={isEn ? "Analysis and continuous watch" : "Analyse et veille continue"}
            title={
              isEn ? (
                <>
                  Watch as the <span className="text-accent-secondary">foundation of quality</span>
                </>
              ) : (
                <>
                  La veille comme <span className="text-accent-secondary">base de qualité</span>
                </>
              )
            }
          />
        </Reveal>

        <div className="grid md:grid-cols-2">
          {MODES.map((mode, i) => (
            <div
              key={mode}
              className={cn(
                "flex flex-col gap-4 border-b border-dark-gray p-6 md:border-b-0 lg:p-8",
                i === 0 && "md:border-r",
              )}
            >
              <h3 className="text-2xl font-light leading-snug tracking-tight text-foreground">
                {VEILLE[mode].label[l]}
              </h3>
              <p className="font-inter-tight text-base leading-relaxed text-mid-gray">{VEILLE[mode].detail[l]}</p>
              <div className="mt-auto flex flex-col gap-2 pt-2">
                <p className="font-mono text-2xs uppercase tracking-[0.14em] text-mid-gray">
                  {isEn ? "Included in" : "Inclus dans"}
                </p>
                <ul className="flex flex-wrap gap-2">
                  {packsAvecVeille(mode).map((s) => (
                    <li key={s.slug}>
                      <PackLink situation={s}
                        className="inline-flex items-center rounded-none border border-accent-secondary/60 bg-accent-secondary/10 px-2.5 py-1 font-mono text-2xs uppercase tracking-[0.12em] text-accent-secondary no-underline transition-colors hover:bg-accent-secondary hover:text-obsidian"
                      >
                        {s.nom[l]}
                      </PackLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
