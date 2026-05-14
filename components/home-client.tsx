"use client";
import dynamic from "next/dynamic";
// Dynamic imports pour les composants lourds
const Hero = dynamic(() => import("@/components/hero"), {
  loading: () => <div className="min-h-screen" />
});

const FeaturedRealisation = dynamic(() => import("./featured-realisation"), {
  loading: () => <div className="min-h-[400px]" />
});

const ExpandableCardDemo = dynamic(() => import("./expandable-cards").then(mod => ({ default: mod.ExpandableCardDemo })), {
  loading: () => <div className="min-h-[400px]" />
});

export default function HomeClient() {
  return (
    <>
      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Réalisation phare — Panorama Pub */}
        <FeaturedRealisation />

        {/* Bloc pédagogique : sites web & applications */}
        <ExpandableCardDemo />
      </main>
    </>
  );
}
