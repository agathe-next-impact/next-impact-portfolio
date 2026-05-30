"use client";

/**
 * Filet horizontal qui se trace de gauche à droite à l'entrée dans le viewport.
 * Remplace un simple `border-top: 1px solid var(--rule)` quand on veut souligner
 * une rupture de section. Sobre : scaleX uniquement, ~500 ms, une seule fois.
 * prefers-reduced-motion → filet plein, immédiat.
 */

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

type SectionRuleProps = {
  duration?: number;
  delay?: number;
  /** couleur du filet (token CSS) */
  color?: string;
  className?: string;
  style?: React.CSSProperties;
};

export function SectionRule({
  duration = 0.5,
  delay = 0,
  color = "var(--rule)",
  className,
  style,
}: SectionRuleProps) {
  const reduce = useReducedMotion();
  const base: React.CSSProperties = {
    height: 1,
    width: "100%",
    background: color,
    transformOrigin: "left center",
    ...style,
  };

  if (reduce) {
    return <div className={className} style={base} />;
  }

  return (
    <motion.div
      className={className}
      style={base}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration, ease: EASE, delay }}
    />
  );
}
