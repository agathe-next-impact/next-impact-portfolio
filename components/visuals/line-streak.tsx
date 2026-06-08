"use client";

import { useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

const LINES = [
  { y: 22, dur: 7, delay: 0, w: 0.5 },
  { y: 40, dur: 9.5, delay: 2.4, w: 0.4 },
  { y: 58, dur: 8, delay: 1.1, w: 0.5 },
  { y: 77, dur: 11, delay: 3.6, w: 0.4 },
];
const TONE = { gold: "--accent-2", champagne: "--accent-champagne", indigo: "--accent" } as const;

/**
 * LineStreak — « lignes qui fusent » : de fins traits guides (0.5px) parcourus
 * par une lueur qui file (cœur blanc → teinte aux extrémités) avec un léger halo.
 * Discret, épuré, en backdrop. Traits statiques en reduced-motion.
 */
export function LineStreak({
  className,
  tone = "gold",
}: {
  className?: string;
  tone?: keyof typeof TONE;
}) {
  const reduce = useReducedMotion();
  const c = TONE[tone];

  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={cn("h-full w-full", className)}
    >
      <defs>
        <linearGradient id={`streak-${tone}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={`hsl(var(${c}))`} stopOpacity="0.15" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor={`hsl(var(${c}))`} stopOpacity="0.15" />
        </linearGradient>
      </defs>

      {LINES.map((l, i) => (
        <g key={i}>
          <line x1="0" y1={l.y} x2="100" y2={l.y} stroke="hsl(var(--dark-gray))" strokeWidth={l.w} opacity={0.5} />
          {!reduce && (
            <line
              x1="0"
              y1={l.y}
              x2="100"
              y2={l.y}
              stroke={`url(#streak-${tone})`}
              strokeWidth={l.w + 0.4}
              strokeLinecap="round"
              strokeDasharray="14 986"
              className="animate-dash-flow"
              style={{
                animationDuration: `${l.dur}s`,
                animationDelay: `${l.delay}s`,
                filter: `drop-shadow(0 0 2px hsl(var(${c}) / 0.7))`,
              }}
            />
          )}
        </g>
      ))}
    </svg>
  );
}
