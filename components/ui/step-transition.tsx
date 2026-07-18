"use client";

/**
 * StepTransition — transition standard entre étapes d'un outil multi-étapes
 * (question suivante, apparition du résultat…). Fade + léger slide de 8 px,
 * 200 ms, ease-out du design system. `mode="wait"` : l'étape sortante disparaît
 * avant l'entrée de la suivante — pas d'animation de hauteur, pas de layout
 * shift entre étapes de hauteurs différentes.
 *
 * API : <StepTransition stepKey={etape}>{contenu}</StepTransition>
 * - `stepKey` change → l'ancien contenu sort, le nouveau entre ;
 * - enfants vides (false/null) → rien n'est rendu (sortie animée du précédent) ;
 * - prefers-reduced-motion → rendu direct, zéro mouvement.
 */

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import * as React from "react";

import { EASE_OUT } from "@/lib/motion-tokens";

// 200 ms — plus court que DUR.ui (0.3 s) : un changement d'étape doit se
// sentir instantané, la continuité vient du fondu, pas de la durée.
const STEP_DUR = 0.2;

type StepTransitionProps = {
  /** Identifiant de l'étape courante — son changement déclenche la transition. */
  stepKey: string | number;
  children: React.ReactNode;
  /** Axe du léger slide (8 px). Vertical par défaut. */
  axis?: "x" | "y";
  className?: string;
};

export function StepTransition({
  stepKey,
  children,
  axis = "y",
  className,
}: StepTransitionProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return children ? <div className={className}>{children}</div> : null;
  }

  const enter = axis === "x" ? { x: 8, y: 0 } : { x: 0, y: 8 };
  const exit = axis === "x" ? { x: -8, y: 0 } : { x: 0, y: -8 };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {children ? (
        <m.div
          key={stepKey}
          className={className}
          initial={{ opacity: 0, ...enter }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, ...exit }}
          transition={{ duration: STEP_DUR, ease: EASE_OUT }}
        >
          {children}
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
