import type { Metadata } from "next";
import { BlueprintSection } from "@/components/aspect/section";
import { ScanReport } from "./report";

export const metadata: Metadata = {
  title: "Sentinelle · rapport d'analyse",
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
      {/* Hero ramassé : la cartouche de résultat doit être entièrement visible
          à l'ouverture de la page, sans défilement (demande du 2026-09-27). */}
      <BlueprintSection ticks innerClassName="px-6 pt-6 pb-16 lg:px-12 lg:pt-8">
        {/* Pas de surtitre : le titre, « Audit de <organisation> », est porté
            par le rapport, seul à connaître le site analysé. */}
        {/* La demande d'inscription faite depuis le rapport porte l'identifiant
            de cette analyse : à l'activation, la fiche s'ouvre avec ce qui vient
            d'être affiché plutôt qu'avec une seconde analyse. */}
        <ScanReport scanId={id} />
      </BlueprintSection>
    </main>
  );
}
