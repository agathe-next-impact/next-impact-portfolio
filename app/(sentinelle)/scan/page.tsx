import type { Metadata } from "next";
import { BlueprintSection, SectionHeading } from "@/components/aspect/section";
import { ScanForm } from "./scan-form";

// La page d'atterrissage /scan est le CTA froid du site : elle est indexée
// (décision d'Agathe, 2026-09-28). Elle surcharge le noindex du layout du
// groupe ; les rapports (/scan/[id]) le gardent et restent exclus de
// robots.txt (Disallow: /scan/).
const SCAN_URL = "https://www.next-impact.digital/scan";
const SCAN_TITLE = "Analysez votre site · Résultat par mail";
const SCAN_DESCRIPTION =
  "Analyse gratuite : votre site comparé à vos concurrents, ce qui le compose, ce qui est à risque et la prestation adaptée. Résultat par mail, sans accès demandé.";

export const metadata: Metadata = {
  title: SCAN_TITLE,
  description: SCAN_DESCRIPTION,
  alternates: { canonical: SCAN_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: SCAN_TITLE,
    description: SCAN_DESCRIPTION,
    url: SCAN_URL,
    siteName: "Next Impact",
    locale: "fr_FR",
    type: "website",
  },
};

export default function ScanPage() {
  return (
    <main>
      <BlueprintSection ticks innerClassName="px-6 py-16 lg:px-12 lg:py-24">
        <SectionHeading
          index="№ 00"
          kicker="Sentinelle"
          title={
            <>
              Analysez votre site
              <span className="sr-only"> · </span>
              <span className="mt-2 block text-xl text-accent-secondary md:text-2xl">
                Résultat par mail
              </span>
            </>
          }
          description="En deux minutes : votre site comparé à ceux de vos concurrents, ce qu'il fait pour votre activité, ce qui le compose, et la prestation qui répond à votre situation."
        />

        <ScanForm />
      </BlueprintSection>
    </main>
  );
}
