"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * Hairline — filet fin (1px) à dégradé qui s'efface sur les bords et se trace
 * (scaleX) à l'apparition. Séparateur éditorial « Serenity ». Statique en
 * reduced-motion.
 */
export function Hairline({
  className,
  width = "100%",
  accent = false,
}: {
  className?: string;
  width?: string | number;
  accent?: boolean;
}) {
  const reduce = useReducedMotion();
  const background = accent
    ? "linear-gradient(90deg, transparent, hsl(var(--accent-2)), transparent)"
    : "linear-gradient(90deg, transparent, hsl(var(--mid-gray)), transparent)";

  return (
    <motion.div
      aria-hidden
      className={cn("h-px", className)}
      style={{ width, background, transformOrigin: "center", opacity: 0.6 }}
      initial={reduce ? undefined : { scaleX: 0, opacity: 0 }}
      whileInView={reduce ? undefined : { scaleX: 1, opacity: 0.6 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    />
  );
}
