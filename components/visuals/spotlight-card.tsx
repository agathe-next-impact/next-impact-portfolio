"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * SpotlightCard — jeu lumineux discret : un halo indigo doux suit le curseur et
 * le filet s'éclaire légèrement au survol. Carte très épurée (filet fin, coins
 * arrondis). Le halo disparaît hors survol (rien d'essentiel pour reduced-motion).
 */
export function SpotlightCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-dark-gray bg-jet/60 p-6 transition-colors duration-300 hover:border-mid-gray/40",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(240px circle at var(--mx, 50%) var(--my, 50%), hsl(var(--accent) / 0.12), transparent 72%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
