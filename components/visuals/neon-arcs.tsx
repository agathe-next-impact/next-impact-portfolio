"use client";

import { m as motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

const ARCS = [0, 1, 2, 3];

/**
 * NeonArcs — anneaux néon qui se propagent depuis le centre (façon onde / radar),
 * lignes fines blanc/doré/champagne avec halo. Cœur lumineux fixe. Anneaux figés
 * en reduced-motion.
 */
export function NeonArcs({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <svg aria-hidden viewBox="0 0 120 120" className={cn("h-full w-full", className)}>
      <defs>
        <radialGradient id="arc-grad">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="60%" stopColor="hsl(var(--accent-2))" stopOpacity="0.8" />
          <stop offset="100%" stopColor="hsl(var(--accent-champagne))" stopOpacity="0.4" />
        </radialGradient>
      </defs>

      <g
        fill="none"
        stroke="url(#arc-grad)"
        strokeLinecap="round"
        style={{ filter: "drop-shadow(0 0 2px hsl(var(--accent-2) / 0.6))" }}
      >
        {ARCS.map((i) =>
          reduce ? (
            <circle key={i} cx="60" cy="60" r="40" strokeWidth="0.7" opacity={0.45 - i * 0.09} />
          ) : (
            <motion.circle
              key={i}
              cx="220"
              cy="100"
              r="40"
              strokeWidth="0.7"
              style={{ transformOrigin: "60px 60px" }}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: [0.4, 1.35], opacity: [0, 0.7, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeOut", delay: i * 1.25 }}
            />
          ),
        )}
      </g>


    </svg>
  );
}
