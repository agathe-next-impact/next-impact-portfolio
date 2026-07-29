"use client";

import { useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

// Inspiré de artifact-fiber : faisceaux de câbles (courbes de Bézier) convergeant
// vers un hub lumineux, parcourus par des impulsions de lumière. Le hub est
// paramétrable (hubX/hubY en fractions) pour le caler sur un élément (ex. mockup).
const W = 1440;
const H = 820;
const rnd = (s: number) => {
  const x = Math.sin(s * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

type Cable = { id: string; d: string; delay: number; dur: number; gold: boolean; width: number };

function buildCables(hub: { x: number; y: number }): Cable[] {
  const arr: Cable[] = [];
  for (let i = 0; i < 9; i++) {
    const yStart = 80 + i * 80 + (i % 2) * 20;
    const c1x = 200 + rnd(i + 1) * 180;
    const c1y = yStart + (rnd(i + 2) - 0.5) * 120;
    const c2x = hub.x - 260 - rnd(i + 3) * 160;
    const c2y = hub.y + (rnd(i + 4) - 0.5) * 220;
    arr.push({
      id: `L${i}`,
      d: `M -20 ${yStart} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${hub.x} ${hub.y + (rnd(i + 5) - 0.5) * 30}`,
      delay: rnd(i + 6) * 3,
      dur: 3 + rnd(i + 7) * 2.5,
      gold: rnd(i + 8) > 0.78,
      width: 1 + rnd(i + 9) * 0.6,
    });
  }
  for (let i = 0; i < 5; i++) {
    const xStart = 200 + i * 180;
    arr.push({
      id: `B${i}`,
      d: `M ${xStart} ${H + 20} C ${xStart + 100} ${H - 200}, ${hub.x - 100} ${hub.y + 240}, ${hub.x} ${hub.y + 30}`,
      delay: rnd(i + 20) * 3,
      dur: 3.5 + rnd(i + 21) * 2,
      gold: rnd(i + 22) > 0.82,
      width: 1 + rnd(i + 23) * 0.6,
    });
  }
  for (let i = 0; i < 4; i++) {
    const yStart = 150 + i * 140;
    arr.push({
      id: `R${i}`,
      d: `M ${W + 20} ${yStart} C ${W - 100} ${yStart + 40}, ${hub.x + 160} ${hub.y + (i - 2) * 60}, ${hub.x} ${hub.y + (i - 1) * 12}`,
      delay: rnd(i + 40) * 2,
      dur: 2.5 + rnd(i + 41) * 1.5,
      gold: false,
      width: 1,
    });
  }
  return arr;
}

function hexPts(r: number) {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
    pts.push(`${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`);
  }
  return pts.join(" ");
}

/**
 * Fiber — câbles fibre optique convergeant vers un hub, impulsions de lumière.
 * `hubX`/`hubY` (0–1) placent le point de jonction (par défaut centre-droit).
 * Impulsions / rotation coupées en reduced-motion.
 */
export function Fiber({
  className,
  hubX = 0.68,
  hubY = 0.48,
}: {
  className?: string;
  hubX?: number;
  hubY?: number;
}) {
  const reduce = useReducedMotion();
  const hub = { x: W * hubX, y: H * hubY };
  const cables = buildCables(hub);

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={cn("h-full w-full", className)}
    >
      <defs>
        <radialGradient id="fiber-hub" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="12%" stopColor="hsl(var(--accent-champagne))" stopOpacity="0.85" />
          <stop offset="45%" stopColor="hsl(var(--accent-2))" stopOpacity="0.22" />
          <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0" />
        </radialGradient>
        <filter id="fiber-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Câbles — trace faible (filets gris + quelques dorés) */}
      {cables.map((c) => (
        <path
          key={`${c.id}-b`}
          d={c.d}
          fill="none"
          stroke={c.gold ? "hsl(var(--accent-2) / 0.01)" : "hsl(var(--dark-gray) / 0.5)"}
          strokeWidth={c.width}
        />
      ))}

      {/* Impulsions de lumière */}
      {!reduce &&
        cables.map((c) => (
          <g key={`${c.id}-p`} filter="url(#fiber-glow)">
            <path
              d={c.d}
              fill="none"
              stroke={c.gold ? "hsl(var(--accent-2))" : "hsl(var(--accent-champagne))"}
              strokeWidth={c.width + 0.5}
              strokeLinecap="round"
              strokeDasharray="60 4000"
              className="animate-fiber-flow"
              style={{ animationDelay: `${c.delay}s`, animationDuration: `${c.dur}s` }}
            />
          </g>
        ))}

      {/* Hub */}
      <circle cx={hub.x} cy={hub.y} r="200" fill="url(#fiber-hub)" />
      <g filter="url(#fiber-glow)" transform={`translate(${hub.x} ${hub.y})`}>
        <polygon points={hexPts(48)} fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.85" />
        <g>
          <polygon points={hexPts(68)} fill="none" stroke="hsl(var(--accent-champagne))" strokeWidth="1" opacity="0.5" />
          {!reduce && (
            <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="22s" repeatCount="indefinite" />
          )}
        </g>
        <polygon points={hexPts(30)} fill="#ffffff" opacity="0.9" />
        <circle cx="0" cy="0" r="5" fill="hsl(var(--accent-2))" />
      </g>
    </svg>
  );
}
