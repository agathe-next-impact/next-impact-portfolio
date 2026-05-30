"use client";

import { MotionConfig } from "framer-motion";
import * as React from "react";

/**
 * Honore globalement `prefers-reduced-motion` pour toutes les animations
 * framer-motion du site (existantes incluses). reducedMotion="user" coupe
 * automatiquement les transformations quand l'utilisateur le demande.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
