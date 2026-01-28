"use client";
import dynamic from "next/dynamic";

// Lazy load du calculateur de prix
const PricingCalculator = dynamic(() => import("./pricing-calculator"), {
  loading: () => (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-regularblue"></div>
    </div>
  ),
  ssr: false, // Désactiver SSR pour ce composant lourd
});

export default PricingCalculator;
