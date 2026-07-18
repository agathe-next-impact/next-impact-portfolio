"use client";

import { m as motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

const BLOB =
  "M38,-49C50,-40,60,-25,63,-9C66,7,62,25,52,38C42,51,25,59,7,63C-11,67,-31,67,-45,57C-59,47,-67,27,-67,7C-67,-13,-59,-32,-46,-43C-33,-54,-16,-57,1,-58C18,-59,26,-58,38,-49Z";
const RINGS = [1, 0.82, 0.64, 0.47, 0.31, 0.17];

/**
 * ContourField — courbes organiques concentriques (façon lignes de niveau), en
 * fines lignes néon (blanc/doré/champagne) qui respirent par contre-rotation.
 * Très calme. Statique en reduced-motion.
 */
export function ContourField({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <svg aria-hidden viewBox="-80 -80 160 160" className={cn("h-full w-full", className)}>
      <defs>
        <radialGradient id="contour-grad">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="55%" stopColor="hsl(var(--accent-2))" stopOpacity="0.85" />
          <stop offset="100%" stopColor="hsl(var(--accent-champagne))" stopOpacity="0.45" />
        </radialGradient>
      </defs>
      <g
        fill="none"
        stroke="url(#contour-grad)"
        style={{ filter: "drop-shadow(0 0 1.4px hsl(var(--accent-2) / 0.5))" }}
      >
        {RINGS.map((s, i) => {
          const path = (
            <path
              d={BLOB}
              transform={`scale(${s}) rotate(${i * 12})`}
              strokeWidth={0.7 / s}
              opacity={0.9 - i * 0.07}
            />
          );
          return reduce ? (
            <g key={i}>{path}</g>
          ) : (
            <motion.g
              key={i}
              style={{ transformOrigin: "0px 0px" }}
              animate={{ rotate: i % 2 ? 7 : -7 }}
              transition={{ duration: 12 + i * 2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
            >
              {path}
            </motion.g>
          );
        })}
      </g>
    </svg>
  );
}
