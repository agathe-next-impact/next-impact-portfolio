"use client";

import { useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

// Coordonnées fixes (déterministes → pas de mismatch d'hydratation).
const NODES = [
  { x: 12, y: 22 }, { x: 30, y: 11 }, { x: 48, y: 28 }, { x: 24, y: 44 },
  { x: 60, y: 15 }, { x: 75, y: 34 }, { x: 89, y: 21 }, { x: 67, y: 50 },
  { x: 41, y: 52 },
];
const EDGES: Array<[number, number]> = [
  [0, 1], [1, 2], [0, 3], [2, 4], [4, 5], [5, 6], [2, 3], [5, 7], [3, 8], [8, 7],
];
const COMETS = [1, 4, 8];
const ACCENT_DOTS = [1, 4, 7];

// Lien courbe (quadratique bombée) entre deux nœuds — aucune arête droite.
function curve(a: { x: number; y: number }, b: { x: number; y: number }) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2 - 7;
  return `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
}

/**
 * NodeNetwork — constellation épurée : liens *courbes* très fins, nœuds discrets,
 * et fines lueurs jaunes qui parcourent quelques courbes. Coupé en reduced-motion.
 */
export function NodeNetwork({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <svg
      aria-hidden
      viewBox="0 0 100 64"
      preserveAspectRatio="xMidYMid slice"
      className={cn("h-full w-full", className)}
    >
      <defs>
        <linearGradient id="nn-comet" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--accent-2))" stopOpacity="0" />
          <stop offset="50%" stopColor="hsl(var(--accent-2))" stopOpacity="0.9" />
          <stop offset="100%" stopColor="hsl(var(--accent-2))" stopOpacity="0" />
        </linearGradient>
      </defs>

      {EDGES.map(([a, b], i) => {
        const d = curve(NODES[a], NODES[b]);
        const isComet = COMETS.includes(i);
        return (
          <g key={i}>
            <path d={d} fill="none" stroke="hsl(var(--dark-gray))" strokeWidth="0.4" />
            {!reduce && isComet && (
              <path
                d={d}
                fill="none"
                stroke="url(#nn-comet)"
                strokeWidth="0.7"
                strokeLinecap="round"
                strokeDasharray="4 120"
                className="animate-dash-flow"
                style={{ animationDelay: `${i * 0.9}s`, animationDuration: "9s" }}
              />
            )}
          </g>
        );
      })}

      {NODES.map((n, i) => (
        <circle
          key={`n-${i}`}
          cx={n.x}
          cy={n.y}
          r={ACCENT_DOTS.includes(i) ? 1 : 0.7}
          fill={ACCENT_DOTS.includes(i) ? "hsl(var(--accent-2))" : "hsl(var(--mid-gray))"}
          className={ACCENT_DOTS.includes(i) ? "animate-pulse-soft" : undefined}
          style={ACCENT_DOTS.includes(i) ? { animationDelay: `${i * 0.5}s` } : undefined}
        />
      ))}
    </svg>
  );
}
