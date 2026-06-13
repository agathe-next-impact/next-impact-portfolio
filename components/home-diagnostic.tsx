"use client";

import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { getHeroVariants } from "@/lib/homepage-profiles";
import type { Locale } from "@/i18n/routing";
import { BlueprintSection, SectionHeading } from "@/components/aspect/section";
import { Reveal } from "@/components/ui/reveal";
import { NeonArcs } from "@/components/visuals/neon-arcs";

const BTN_PRIMARY =
  "inline-flex h-11 items-center gap-2 border border-charcoal bg-vermilion px-5 font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-vermilion-bright";
const BTN_GHOST =
  "inline-flex h-11 items-center gap-2 border border-dark-gray px-5 font-mono text-[12px] uppercase tracking-[0.08em] text-foreground transition-colors hover:bg-ebony";

/**
 * HomeDiagnostic — bandeau CTA (et non plus l'outil embarqué) : la home appelle
 * le diagnostic, qui vit sur sa page dédiée (/services/eligibilite). Allège le
 * bas de page (une seule décision) et garde le diagnostic comme dé-surchargeur.
 */
export default function HomeDiagnostic({ index = "№ 09" }: { index?: string }) {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const variant = getHeroVariants(locale).default;

  return (
    <BlueprintSection
      id="audit"
      tone="jet"
      backdrop={
        <div className="absolute inset-0 opacity-40">
          <NeonArcs />
        </div>
      }
      innerClassName="px-6 py-16 lg:px-10 lg:py-20"
    >
      <Reveal className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          index={index}
          kicker={variant.auditSubtitle}
          title={variant.auditTitle}
          description={variant.auditDescription}
        />
        <div className="flex flex-wrap gap-3 lg:shrink-0">
          <Link href="/services/eligibilite" className={BTN_PRIMARY}>
            {isEn ? "Run the diagnostic — 2 min" : "Lancer le diagnostic — 2 min"}
            <ArrowRight size={14} />
          </Link>
        </div>
      </Reveal>
    </BlueprintSection>
  );
}
