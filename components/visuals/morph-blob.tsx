"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

// Forme organique unique : rotation lente + respiration (scale), pas de morph du
// `d` (plus sûr, tout aussi fluide). Dégradé indigo très doux.
const BLOB =
  "M38,-49C50,-40,60,-25,63,-9C66,7,62,25,52,38C42,51,25,59,7,63C-11,67,-31,67,-45,57C-59,47,-67,27,-67,7C-67,-13,-59,-32,-46,-43C-33,-54,-16,-57,1,-58C18,-59,26,-58,38,-49Z";

/**
 * MorphBlob — tache organique à dégradé indigo qui tourne et respire lentement.
 * Décoratif, faible présence. Figée en reduced-motion.
 */
export function MorphBlob({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <svg aria-hidden viewBox="-90 -90 180 180" className={cn("h-full w-full", className)}>
      <defs>
        <radialGradient id="blob-grad">
          <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.4" />
          <stop offset="55%" stopColor="hsl(var(--accent))" stopOpacity="0.12" />
          <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0" />
        </radialGradient>
      </defs>
      <motion.path
        d={BLOB}
        fill="url(#blob-grad)"
        style={{ transformOrigin: "0px 0px" }}
        animate={reduce ? {} : { rotate: 360, scale: [1, 1.06, 0.97, 1] }}
        transition={{
          rotate: { duration: 50, repeat: Infinity, ease: "linear" },
          scale: { duration: 10, repeat: Infinity, ease: "easeInOut" },
        }}
      />
    </svg>
  );
}
