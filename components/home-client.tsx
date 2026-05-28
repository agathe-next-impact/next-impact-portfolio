"use client";

import dynamic from "next/dynamic";
import Process from "@/components/process";

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

      {/* § 02 — Réalisation phare */}
      <FeaturedRealisation />

      {/* § 03 — Offres : 3 stacks */}
      <HomeOffres />

      {/* § 04 — Méthode */}
      <section className="s" style={{ borderTop: "1px solid var(--rule)" }}>
        <div className="container">
          <Process />
        </div>
      </section>

      {/* § 05 — Avantage TIH */}
      <HomeTihTeaser />

      {/* § 06 — Diagnostic de stack */}
      <HomeDiagnostic />

      {/* § 07 — CTA final */}
      <HomeCta />
    </main>
  );
}
