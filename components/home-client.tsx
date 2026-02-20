"use client";
import dynamic from "next/dynamic";
import { HomepageProfileBanner } from "./homepage-profile-banner";

// Dynamic imports pour les composants lourds
const Hero = dynamic(() => import("@/components/hero"), {
  loading: () => <div className="min-h-screen" />
});

const ExpandableCardDemo = dynamic(() => import("./expandable-cards").then(mod => ({ default: mod.ExpandableCardDemo })), {
  loading: () => <div className="min-h-[400px]" />
});

export default function HomeClient() {
  return (
    <>
      <main className="flex-1">
        {/* Profile selection banner */}
        <HomepageProfileBanner />

        {/* Hero Section */}
        <Hero />

        {/* Whats's Headless Section */}
        <ExpandableCardDemo />
      </main>
    </>
  );
}
