"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

// Sinusoïde fine pour la composition (aucun angle).
function sine(x0: number, x1: number, yBase: number, amp: number, periods: number) {
  const pts: string[] = [];
  const n = 44;
  for (let i = 0; i <= n; i++) {
    const x = x0 + (i / n) * (x1 - x0);
    const y = yBase + amp * Math.sin((i / n) * periods * 2 * Math.PI);
    pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return "M " + pts.join(" L ");
}
const SINE = sine(108, 196, 98, 5, 2);

/**
 * CurveComposition — composition purement courbe (cercles, arc, sinusoïde, points
 * qui orbitent / flottent). Traits fins, peu d'éléments : le versant « design »
 * épuré qui répond à la grille. Statique en reduced-motion.
 */
export function CurveComposition({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <svg aria-hidden viewBox="0 0 200 120" className={cn("h-full w-full", className)}>
      {/* Grand cercle contour fin */}
      <circle cx="70" cy="60" r="46" fill="none" stroke="hsl(var(--dark-gray))" strokeWidth="0.6" />
      {/* Cercle moyen pointillé */}
      <circle cx="70" cy="60" r="30" fill="none" stroke="hsl(var(--dark-gray))" strokeWidth="0.6" strokeDasharray="2 4" opacity="0.7" />

      {/* Arc accent qui tourne lentement */}
      <motion.g
        style={{ transformOrigin: "70px 60px" }}
        animate={reduce ? {} : { rotate: 360 }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      >
        <path d="M70 14 A46 46 0 0 1 116 60" fill="none" stroke="hsl(var(--accent))" strokeWidth="2" strokeLinecap="round" />
      </motion.g>

      {/* Disque doux qui flotte */}
      <motion.circle
        cx="152"
        cy="42"
        r="18"
        fill="hsl(var(--accent) / 0.16)"
        stroke="hsl(var(--accent))"
        strokeWidth="0.6"
        animate={reduce ? {} : { y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Sinusoïde fine jaune */}
      <path d={SINE} fill="none" stroke="hsl(var(--accent-2))" strokeWidth="0.8" opacity="0.85" />

      {/* Point qui orbite sur le grand cercle */}
      {!reduce && (
        <motion.g
          style={{ transformOrigin: "70px 60px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="116" cy="60" r="2.2" fill="hsl(var(--accent-2))" />
        </motion.g>
      )}

      {/* Cœur */}
      <circle cx="70" cy="60" r="2" fill="hsl(var(--accent-2))" />
    </svg>
  );
}
