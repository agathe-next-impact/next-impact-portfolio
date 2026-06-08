"use client";

import EligibilityForm from "@/components/tarifs/EligibilityForm";
import { useLocale } from "next-intl";
import { getHeroVariants } from "@/lib/homepage-profiles";
import type { Locale } from "@/i18n/routing";
import { BlueprintSection, SectionHeading } from "@/components/aspect/section";
import { Reveal } from "@/components/ui/reveal";
import { NeonArcs } from "@/components/visuals/neon-arcs";

export default function HomeDiagnostic() {
  const locale = useLocale() as Locale;
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
      innerClassName="px-6 py-16 lg:px-10 lg:py-24"
    >
      <Reveal>
        <SectionHeading
          index="№ 06"
          kicker={variant.auditSubtitle}
          title={variant.auditTitle}
          description={variant.auditDescription}
        />
      </Reveal>

      <Reveal delay={0.08} className="mt-12">
        <EligibilityForm />
      </Reveal>
    </BlueprintSection>
  );
}
