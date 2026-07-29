"use client";

import { m as motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

const RINGS = [18, 30, 42, 54];

/**
 * OrbitRings — cercles concentriques très fins avec des points qui orbitent
 * lentement (sens alternés). Que des courbes : le motif « rond » épuré, idéal
 * en backdrop de hero. Orbites figées en reduced-motion.
 */
export function OrbitRings({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <svg aria-hidden viewBox="0 0 120 120" className={cn("h-full w-full", className)}>
      {RINGS.map((r, i) => (
        <circle
          key={`r-${i}`}
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="hsl(var(--dark-gray))"
          strokeWidth="0.5"
          strokeDasharray={i % 2 ? "2 4" : undefined}
          opacity={0.55}
        />
      ))}

      {RINGS.map((r, i) => {
        const dot = (
          <circle
            cx={60 + r}
            cy="60"
            r={i === 1 ? 1.8 : 1.2}
            fill={i === 1 ? "hsl(var(--accent-2))" : "hsl(var(--accent))"}
          />
        );
        return reduce ? (
          <g key={`o-${i}`}>{dot}</g>
        ) : (
          <motion.g
            key={`o-${i}`}
            style={{ transformOrigin: "60px 60px" }}
            animate={{ rotate: i % 2 ? -360 : 360 }}
            transition={{ duration: 20 + i * 7, repeat: Infinity, ease: "linear" }}
          >
            {dot}
          </motion.g>
        );
      })}

      <circle cx="60" cy="60" r="1.6" fill="hsl(var(--accent-2))" opacity="0.9" />
    </svg>
  );
}
