import type { Metadata } from "next";
import { BlueprintSection, SectionHeading } from "@/components/aspect/section";
import { sentinellePaymentLinkUrl } from "@/lib/sentinelle-offer";
import { ScanReport } from "./report";

export const metadata: Metadata = {
  title: "Sentinelle — rapport d'analyse",
  // Un rapport concerne le site de quelqu'un : jamais indexé, jamais suivi.
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ScanReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main>
      <BlueprintSection ticks innerClassName="px-6 py-16 lg:px-12 lg:py-24">
        <SectionHeading
          index="№ 01"
          kicker="Sentinelle"
          title="De quoi votre site est fait"
          description="Voici ce que l'analyse a pu identifier depuis l'extérieur, sans accès ni mot de passe."
        />

        <ScanReport scanId={id} lienAbonnement={sentinellePaymentLinkUrl()} />
      </BlueprintSection>
    </main>
  );
}
