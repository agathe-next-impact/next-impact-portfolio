"use client";

import dynamic from "next/dynamic";

import Process from "@/components/process";
import HomeTldr from "@/components/home-tldr";
import { ProofStrip } from "@/components/proof-strip";
import { BlueprintSection, Separator } from "@/components/aspect/section";
import { VisioConseilBanner } from "@/components/visio-conseil/visio-conseil-banner";

const Hero = dynamic(() => import("@/components/hero"), {
  loading: () => <div style={{ minHeight: "100vh" }} />,
});

const HomeFaq = dynamic(() => import("./home-faq"), {
  loading: () => <div style={{ minHeight: 400 }} />,
});

const FeaturedRealisation = dynamic(() => import("./featured-realisation"), {
  loading: () => <div style={{ minHeight: 400 }} />,
});

const HomeTestimonials = dynamic(() => import("./home-testimonials"), {
  loading: () => <div style={{ minHeight: 400 }} />,
});

const HomeOffres = dynamic(() => import("./home-offres"), {
  loading: () => <div style={{ minHeight: 400 }} />,
});

const HomeVeille = dynamic(() => import("./home-veille"), {
  loading: () => <div style={{ minHeight: 400 }} />,
});

const HomeStudio = dynamic(() => import("./home-studio"), {
  loading: () => <div style={{ minHeight: 500 }} />,
});

const HomePerf = dynamic(() => import("./home-perf"), {
  loading: () => <div style={{ minHeight: 400 }} />,
});

const HomeDiagnostic = dynamic(() => import("./home-diagnostic"), {
  loading: () => <div style={{ minHeight: 400 }} />,
});

export default function HomeClient({
  documented,
}: {
  /** Nombre d'études de cas publiées, lu côté serveur (ProofStrip). */
  documented: number;
}) {
  return (
    <main className="flex-1">
      {/* § 01 — Hero : douleur, bénéfice, deux boutons (ADR-018) */}
      <Hero />

      {/* § 01b — Preuve immédiate, juste sous le héros (charte §6) : elle
          remplace le bandeau de logos techno. */}
      <ProofStrip documented={documented} />

      {/* § 02 · Offres : un onglet par famille, les packs en cartouches (ADR-020) */}
      <HomeOffres />
      <Separator />

      {/* § 03 · La spécificité : analyse et veille technique et stratégique (ADR-021) */}
      <HomeVeille />
      <Separator />

      {/* § 04 — Témoignages clients */}
      <HomeTestimonials />

      {/* § 05 — Réalisation phare + preuve sociale (preuve UI/UX) */}
      <FeaturedRealisation />
      <Separator />

      {/* § 06 — Méthode (masquée) */}
      {/* <BlueprintSection tone="obsidian" innerClassName="px-6 py-16 lg:px-10 lg:py-24">
        <Process index="№ 06" />
      </BlueprintSection>
      <Separator /> */}

      {/* § 07 — Le studio (présence humaine) */}
      <HomeStudio />
      <Separator />

      {/* § 09 — Diagnostic de stack 
      <HomeDiagnostic />
      <Separator />
*/}
      {/* § 09b · Offre tiède : l'échange gratuit de 15 minutes, puis l'audit (ADR-023).
          Jamais dans le héros ni en CTA froid. */}
      <VisioConseilBanner />
      <Separator />

      {/* § 09c — « L'essentiel » (TL;DR citable par les IA), juste avant la
          FAQ : synthèse de fin de parcours, pas d'encart en haut de page (ADR-024). */}
      <HomeTldr />

      {/* § 10 — FAQ (citabilité IA + FAQPage schema) */}
      <HomeFaq />
    </main>
  );
}
