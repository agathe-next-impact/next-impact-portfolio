"use client";

import dynamic from "next/dynamic";
import Process from "@/components/process";
import { BlueprintSection, Separator } from "@/components/aspect/section";

const Hero = dynamic(() => import("@/components/hero"), {
  loading: () => <div style={{ minHeight: "100vh" }} />,
});

const FeaturedRealisation = dynamic(() => import("./featured-realisation"), {
  loading: () => <div style={{ minHeight: 400 }} />,
});

const HomeOffres = dynamic(() => import("./home-offres"), {
  loading: () => <div style={{ minHeight: 400 }} />,
});

const HomeTihTeaser = dynamic(() => import("./home-tih-teaser"), {
  loading: () => <div style={{ minHeight: 120 }} />,
});

const HomeDiagnostic = dynamic(() => import("./home-diagnostic"), {
  loading: () => <div style={{ minHeight: 400 }} />,
});

const HomeCta = dynamic(() => import("./home-cta"), {
  loading: () => <div style={{ minHeight: 200 }} />,
});

export default function HomeClient() {
  return (
    <main className="flex-1">
      {/* § 01 — Hero */}
      <Hero />
      <Separator />

      {/* § 02 — Réalisation phare */}
      <FeaturedRealisation />
      <Separator />

      {/* § 03 — Offres : 3 stacks */}
      <HomeOffres />
      <Separator />

      {/* § 04 — Méthode */}
      <BlueprintSection tone="obsidian" innerClassName="px-6 py-16 lg:px-10 lg:py-24">
        <Process />
      </BlueprintSection>
      <Separator />

      {/* § 05 — Avantage TIH */}
      <HomeTihTeaser />
      <Separator />

      {/* § 06 — Diagnostic de stack */}
      <HomeDiagnostic />
      <Separator />

      {/* § 07 — CTA final */}
      <HomeCta />
    </main>
  );
}
