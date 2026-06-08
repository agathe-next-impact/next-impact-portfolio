"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import * as React from "react";

import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * RotatingWord — mot qui défile verticalement dans un emplacement de taille fixe
 * (typographie cinétique, identité « design »). Coupé en reduced-motion (1er mot fixe).
 */
export function RotatingWord({
  words,
  interval = 2200,
  className,
}: {
  words: string[];
  interval?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [i, setI] = React.useState(0);

  React.useEffect(() => {
    if (reduce || words.length < 2) return;
    const id = setInterval(() => setI((p) => (p + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [reduce, interval, words.length]);

  const widest = words.reduce((a, b) => (b.length > a.length ? b : a), "");

  if (reduce) {
    return <span className={cn("text-vermilion", className)}>{words[0]}</span>;
  }

  return (
    <span className={cn("relative inline-grid align-bottom", className)}>
      {/* Réserve la largeur du mot le plus long pour éviter les sauts de mise en page. */}
      <span className="invisible col-start-1 row-start-1 whitespace-nowrap" aria-hidden>
        {widest}
      </span>
      <span className="col-start-1 row-start-1 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={i}
            initial={{ y: "60%", opacity: 0, filter: "blur(6px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: "-60%", opacity: 0, filter: "blur(6px)" }}
            transition={{ duration: 0.55, ease: EASE }}
            className="block whitespace-nowrap text-vermilion"
          >
            {words[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}

/**
 * KineticLines — révèle des lignes de texte qui montent derrière un masque
 * (effet éditorial « rideau »). Chaque enfant = une ligne.
 */
export function KineticLines({
  lines,
  className,
  delay = 0,
}: {
  lines: React.ReactNode[];
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <span className={cn("flex flex-col", className)}>
      {lines.map((line, i) => (
        <span key={i} className="overflow-hidden">
          {reduce ? (
            <span className="block">{line}</span>
          ) : (
            <motion.span
              className="block"
              initial={{ y: "110%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: "-12% 0px" }}
              transition={{ duration: 0.6, ease: EASE, delay: delay + i * 0.08 }}
            >
              {line}
            </motion.span>
          )}
        </span>
      ))}
    </span>
  );
}
