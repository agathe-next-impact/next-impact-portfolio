"use client";

import { useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

const DOTS = [
  { top: "24%", left: "15%", d: "0s", gold: true },
  { top: "60%", left: "85%", d: "1s", gold: false },
  { top: "40%", left: "10%", d: "1.5s", gold: false },
  { top: "72%", left: "90%", d: "2s", gold: true },
  { top: "18%", left: "70%", d: "0.6s", gold: false },
  { top: "82%", left: "32%", d: "1.2s", gold: true },
];

/**
 * FloatingParticles — fines particules qui flottent doucement (or / champagne),
 * avec un léger halo. Décoratif. Immobiles en reduced-motion.
 */
export function FloatingParticles({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {DOTS.map((p, i) => (
        <span
          key={i}
          className={cn("absolute h-1 w-1 rounded-full", !reduce && "animate-float-y")}
          style={{
            top: p.top,
            left: p.left,
            animationDelay: p.d,
            background: p.gold ? "hsl(var(--accent-2))" : "hsl(var(--accent-champagne))",
            boxShadow: "0 0 6px hsl(var(--accent-2) / 0.6)",
            opacity: 0.5,
          }}
        />
      ))}
    </div>
  );
}
