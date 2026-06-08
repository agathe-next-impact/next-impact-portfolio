"use client";

import { cn } from "@/lib/utils";

type Intensity = "subtle" | "medium" | "strong";

/**
 * AuroraGlow — jeux lumineux épurés : deux halos très diffus (indigo + jaune)
 * qui dérivent lentement. Faible opacité par défaut. Décoratif.
 * La dérive est coupée en prefers-reduced-motion.
 */
export function AuroraGlow({
  className,
  intensity = "subtle",
}: {
  className?: string;
  intensity?: Intensity;
}) {
  const base = intensity === "subtle" ? 0.14 : intensity === "strong" ? 0.26 : 0.2;

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div
        className="animate-aurora-1 absolute -left-1/4 -top-1/3 h-[55vmax] w-[55vmax] rounded-full blur-[130px]"
        style={{
          background:
            "radial-gradient(circle at center, hsl(var(--accent) / 0.9), transparent 62%)",
          opacity: base,
        }}
      />
      <div
        className="animate-aurora-2 absolute -bottom-1/3 -right-1/5 h-[48vmax] w-[48vmax] rounded-full blur-[140px]"
        style={{
          background:
            "radial-gradient(circle at center, hsl(var(--accent-2) / 0.7), transparent 62%)",
          opacity: base * 0.7,
        }}
      />
    </div>
  );
}
