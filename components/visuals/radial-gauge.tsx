"use client";

import { m as motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { DUR, EASE_OUT } from "@/lib/motion-tokens";

/**
 * RadialGauge — anneau fin qui se trace au scroll (pathLength), avec un point
 * jaune en tête. Épure : trait 5px, chiffre en graisse légère. Pour les scores.
 * MotionProvider rend l'animation instantanée en reduced-motion.
 */
export function RadialGauge({
  value = 72,
  label,
  sublabel,
  size = 150,
  className,
}: {
  value?: number;
  label?: string;
  sublabel?: string;
  size?: number;
  className?: string;
}) {
  const v = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("flex flex-col items-center gap-3", className)} style={{ width: size }}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r="53" fill="none" stroke="hsl(var(--dark-gray))" strokeWidth="5" />
          <motion.circle
            cx="60"
            cy="60"
            r="53"
            fill="none"
            stroke="hsl(var(--accent))"
            strokeWidth="5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: v / 100 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: DUR.chart, ease: EASE_OUT }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-light text-foreground">
            {v}
            <span className="text-base text-mid-gray">%</span>
          </span>
        </div>
      </div>
      {label && (
        <div className="text-center">
          <div className="text-sm font-light text-foreground">{label}</div>
          {sublabel && (
            <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-mid-gray">
              {sublabel}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
