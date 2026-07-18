"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import * as React from "react";

/**
 * 1. `LazyMotion` + `domAnimation` : charge uniquement le sous-ensemble
 *    d'animations DOM de framer-motion (~-25/30 ko gzip par page). Tous les
 *    composants doivent utiliser `m` (importé via `m as motion`) — le mode
 *    `strict` fait planter tout `motion.` résiduel pour le détecter.
 *    Note : `domAnimation` ne couvre ni `drag` ni les animations `layout`
 *    (passer à `domMax` si un composant monté en a besoin un jour).
 * 2. `MotionConfig reducedMotion="user"` : honore globalement
 *    `prefers-reduced-motion` — coupe automatiquement les transformations
 *    quand l'utilisateur le demande.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
