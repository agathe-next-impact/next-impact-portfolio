"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * WordAppear — révèle un texte mot à mot (fade + montée + sortie de flou),
 * signature « Digital Serenity ». Rendu plein en reduced-motion.
 */
export function WordAppear({
  text,
  as = "span",
  className,
  delay = 0,
  stagger = 0.08,
  y = 14,
}: {
  text: string;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  delay?: number;
  stagger?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();
  const Comp = as as React.ElementType;

  if (reduce) return <Comp className={className}>{text}</Comp>;

  const words = text.split(" ");
  return (
    <Comp className={className}>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <motion.span
            className="inline-block"
            initial={{ opacity: 0, y, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.7, ease: EASE, delay: delay + i * stagger }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </Comp>
  );
}
