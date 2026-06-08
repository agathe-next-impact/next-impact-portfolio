"use client";

import { useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

const W = 100;
// Construit une sinusoïde lisse échantillonnée (courbe douce, aucun angle).
function sine(yBase: number, amp: number, periods: number, phase = 0) {
  const pts: string[] = [];
  for (let i = 0; i <= 72; i++) {
    const x = (i / 72) * W;
    const y = yBase + amp * Math.sin((i / 72) * periods * 2 * Math.PI + phase);
    pts.push(`${x.toFixed(1)} ${y.toFixed(2)}`);
  }
  return "M " + pts.join(" L ");
}

const LINES = [
  { d: sine(10, 3.5, 1.5, 0), dur: 14 },
  { d: sine(18, 4.5, 1.2, 1.1), dur: 18 },
  { d: sine(27, 3, 1.8, 2.2), dur: 16 },
  { d: sine(34, 2.5, 1.4, 0.6), dur: 20 },
];

/**
 * SignalPaths — flux abstraits épurés : sinusoïdes fines (0.5px) parcourues par
 * une fine lueur jaune (comète) façon signal. Aucun angle. Comète coupée en
 * reduced-motion (sinusoïdes statiques conservées).
 */
export function SignalPaths({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <svg
      aria-hidden
      viewBox="0 0 100 44"
      preserveAspectRatio="none"
      className={cn("h-full w-full", className)}
    >
      <defs>
        <linearGradient id="sp-comet" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--accent-2))" stopOpacity="0" />
          <stop offset="50%" stopColor="hsl(var(--accent-2))" stopOpacity="0.9" />
          <stop offset="100%" stopColor="hsl(var(--accent-2))" stopOpacity="0" />
        </linearGradient>
      </defs>

      {LINES.map((l, i) => (
        <g key={i}>
          <path d={l.d} fill="none" stroke="hsl(var(--dark-gray))" strokeWidth="0.5" />
          {!reduce && (
            <path
              d={l.d}
              fill="none"
              stroke="url(#sp-comet)"
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeDasharray="6 340"
              className="animate-dash-flow"
              style={{
                animationDelay: `${i * 1.6}s`,
                animationDuration: `${l.dur}s`,
                filter: "drop-shadow(0 0 2px hsl(var(--accent-2) / 0.7))",
              }}
            />
          )}
        </g>
      ))}
    </svg>
  );
}
