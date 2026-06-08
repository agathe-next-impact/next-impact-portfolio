"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * MouseGlow — halo radial doux qui suit le curseur dans son conteneur parent
 * (qui doit être `position: relative`). Jeu lumineux « Serenity ». Drop-in :
 * placez-le dans n'importe quelle section relative.
 */
export function MouseGlow({
  className,
  size = 380,
  color = "--accent",
}: {
  className?: string;
  size?: number;
  color?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    const move = (e: MouseEvent) => {
      const r = parent.getBoundingClientRect();
      el.style.setProperty("--gx", `${e.clientX - r.left}px`);
      el.style.setProperty("--gy", `${e.clientY - r.top}px`);
      el.style.setProperty("--go", "1");
    };
    const leave = () => el.style.setProperty("--go", "0");
    parent.addEventListener("mousemove", move);
    parent.addEventListener("mouseleave", leave);
    return () => {
      parent.removeEventListener("mousemove", move);
      parent.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        background: `radial-gradient(${size}px circle at var(--gx, 50%) var(--gy, 50%), hsl(var(${color}) / 0.1), transparent 70%)`,
        opacity: "var(--go, 0)" as unknown as number,
        transition: "opacity 300ms ease",
      }}
    />
  );
}
