"use client";

import dynamic from "next/dynamic";
import Process from "@/components/process";
import HomeTldr from "@/components/home-tldr";
import { TechnoLogosStrip } from "@/components/techno-logos-strip";
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

const HomeStudio = dynamic(() => import("./home-studio"), {
  loading: () => <div style={{ minHeight: 500 }} />,
});

const HomePerf = dynamic(() => import("./home-perf"), {
  loading: () => <div style={{ minHeight: 400 }} />,
});

const HomeDiagnostic = dynamic(() => import("./home-diagnostic"), {
  loading: () => <div style={{ minHeight: 400 }} />,
});

export default function HomeClient() {
  return (
    <main className="flex-1">
      {/* § 01 — Hero */}
      <Hero />

      {/* § 01b — « En bref » (TL;DR citable par les IA) */}
      <HomeTldr />

      {/* § 01c — Technos (WordPress / Next.js / Astro + outils IA) en preuve
          discrète ; les logos clients, eux, sont dans le hero. */}
      <TechnoLogosStrip />

      {/* § 02 — Offres : 3 stacks */}
      <HomeOffres />
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
      {/* § 09b — Offre tiède : visio conseil payante (déduite du devis).
          Placée juste après le diagnostic : il pose une décision, la visio la
          résout. Jamais dans le héros ni en CTA froid. */}
      <VisioConseilBanner />
      <Separator />

      {/* § 10 — FAQ (citabilité IA + FAQPage schema) */}
      <HomeFaq />
    </main>
  );
}
