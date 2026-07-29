"use client";

import { cn } from "@/lib/utils";

// Champ de courbes qui jaillissent (inspiration « Hero Champ Violet »), en
// lignes néon fines. Tracés déterministes (pas de Math.random → SSR safe).
const FIELD = (() => {
  const arr: { d: string; w: number; delay: number }[] = [];
  for (let i = 0; i < 16; i++) {
    const x0 = 1 + i * 6.4;
    const c1x = x0 + 5 + (i % 3) * 2;
    const c1y = 72 - (i % 4) * 5;
    const c2x = x0 - 6 + (i % 5) * 3;
    const c2y = 42 - (i % 3) * 6;
    const ex = x0 + 9 + (i % 5) * 2;
    const ey = 4 + (i % 4) * 5;
    arr.push({
      d: `M ${x0} 99 C ${c1x} ${c1y} ${c2x} ${c2y} ${ex} ${ey}`,
      w: 0.45 + (i % 3) * 0.2,
      delay: i * 0.16,
    });
  }
  return arr;
})();

/**
 * NeonField — champ de fines courbes néon (blanc → doré → champagne) qui se
 * tracent en cascade. Halo léger. Idéal en backdrop de hero. Le tracé se fige
 * en état final sous reduced-motion (lignes affichées, sans animation).
 */
export function NeonField({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className={cn("h-full w-full", className)}
    >
      <defs>
        <linearGradient id="neon-field-grad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="hsl(var(--accent-champagne))" stopOpacity="0.12" />
          <stop offset="45%" stopColor="hsl(var(--accent-2))" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      <g
        fill="none"
        strokeLinecap="round"
        stroke="url(#neon-field-grad)"
        style={{ filter: "drop-shadow(0 0 1.6px hsl(var(--accent-2) / 0.6))" }}
      >
        {FIELD.map((l, i) => (
          <path
            key={i}
            d={l.d}
            strokeWidth={l.w}
            className="animate-draw-in"
            style={{ animationDelay: `${l.delay}s` }}
          />
        ))}
      </g>
    </svg>
  );
}
