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

const HomeTestimonials = dynamic(() => import("./home-testimonials"), {
  loading: () => <div style={{ minHeight: 400 }} />,
});

const HomeOffres = dynamic(() => import("./home-offres"), {
  loading: () => <div style={{ minHeight: 400 }} />,
});

const HomeStudio = dynamic(() => import("./home-studio"), {
  loading: () => <div style={{ minHeight: 500 }} />,
});

const HomeTihTeaser = dynamic(() => import("./home-tih-teaser"), {
  loading: () => <div style={{ minHeight: 120 }} />,
});

const HomePerf = dynamic(() => import("./home-perf"), {
  loading: () => <div style={{ minHeight: 400 }} />,
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

      {/* § 02 — Réalisation phare + preuve sociale (preuve UI/UX) */}
      <FeaturedRealisation />
      <Separator />

      {/* § 03 — Témoignages clients */}
      <HomeTestimonials />

      {/* § 04 — Offres : 3 stacks */}
      <HomeOffres />
      <Separator />

      {/* § 05 — Méthode */}
      <BlueprintSection tone="obsidian" innerClassName="px-6 py-16 lg:px-10 lg:py-24">
        <Process />
      </BlueprintSection>
      <Separator />

      {/* § 06 — Le studio (présence humaine) */}
      <HomeStudio />
      {/* § 07 — Avantage TIH */}
      <HomeTihTeaser />
      {/* § 08 — Preuve de performance (argument secondaire, socle technique) */}
      <HomePerf />
      <Separator />

      {/* § 09 — Diagnostic de stack */}
      <HomeDiagnostic />

      {/* § 10 — CTA final */}
      <HomeCta />
    </main>
  );
}
