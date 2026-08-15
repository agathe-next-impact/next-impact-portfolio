import type { Metadata } from "next";
import { BlueprintSection, SectionHeading } from "@/components/aspect/section";
import { ScanForm } from "./scan-form";

export const metadata: Metadata = {
  title: "Sentinelle — analyser mon site",
};

export default function ScanPage() {
  return (
    <main>
      <BlueprintSection ticks innerClassName="px-6 py-16 lg:px-12 lg:py-24">
        <SectionHeading
          index="№ 00"
          kicker="Sentinelle"
          title="Qu'est-ce qui tourne sur votre site ?"
          description="Deux minutes pour savoir de quoi votre site est fait : CMS, extensions, serveur, bibliothèques. C'est le point de départ de toute surveillance — on ne peut pas veiller sur ce qu'on ne connaît pas."
        />

        <ScanForm />
      </BlueprintSection>
    </main>
  );
}
