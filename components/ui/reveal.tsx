"use client";

/**
 * Couche d'animation « Édition Suisse » — sobre, au service de la lecture.
 *
 * <Reveal>      : apparition unique d'un bloc (fade + ~12 px de translation).
 * <Stagger>     : conteneur qui révèle ses <StaggerItem> en cascade discrète.
 * <StaggerItem> : élément piloté par les variants du Stagger parent.
 *
 * Garde-fous design system :
 * - opacity + translateY uniquement (pas de scale/rotation/blur/shadow) ;
 * - easing ease-out franc, durée ~500 ms ;
 * - viewport once → pas de re-trigger au scroll arrière ;
 * - prefers-reduced-motion → rendu en état final, zéro mouvement.
 */

import { m as motion, useReducedMotion, type Variants } from "framer-motion";
import * as React from "react";

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, margin: "-12% 0px" } as const;

type Tag = keyof React.JSX.IntrinsicElements;

type RevealProps = {
  children: React.ReactNode;
  as?: Tag;
  /** délai avant l'animation, en secondes */
  delay?: number;
  /** translation initiale en px (axe Y) */
  y?: number;
  /** durée en secondes */
  duration?: number;
  once?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export function Reveal({
  children,
  as = "div",
  delay = 0,
  y = 12,
  duration = 0.5,
  once = true,
  className,
  style,
}: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    const Plain = as as React.ElementType;
    return (
      <Plain className={className} style={style}>
        {children}
      </Plain>
    );
  }

  const Comp = (motion[as as keyof typeof motion] ?? motion.div) as React.ElementType;
  return (
    <Comp
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ ...VIEWPORT, once }}
      transition={{ duration, ease: EASE, delay }}
    >
      {children}
    </Comp>
  );
}

const containerVariants = (stagger: number, delayChildren: number): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
});

const itemVariants = (y: number, duration: number): Variants => ({
  hidden: { opacity: 0, y },
  visible: { opacity: 1, y: 0, transition: { duration, ease: EASE } },
});

type StaggerProps = {
  children: React.ReactNode;
  as?: Tag;
  /** intervalle entre deux enfants, en secondes */
  stagger?: number;
  /** délai global avant le premier enfant, en secondes */
  delayChildren?: number;
  once?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export function Stagger({
  children,
  as = "div",
  stagger = 0.06,
  delayChildren = 0,
  once = true,
  className,
  style,
}: StaggerProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    const Plain = as as React.ElementType;
    return (
      <Plain className={className} style={style}>
        {children}
      </Plain>
    );
  }

  const Comp = (motion[as as keyof typeof motion] ?? motion.div) as React.ElementType;
  return (
    <Comp
      className={className}
      style={style}
      variants={containerVariants(stagger, delayChildren)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-10% 0px" }}
    >
      {children}
    </Comp>
  );
}

type StaggerItemProps = {
  children: React.ReactNode;
  as?: Tag;
  y?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
};

export function StaggerItem({
  children,
  as = "div",
  y = 12,
  duration = 0.5,
  className,
  style,
}: StaggerItemProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    const Plain = as as React.ElementType;
    return (
      <Plain className={className} style={style}>
        {children}
      </Plain>
    );
  }

  const Comp = (motion[as as keyof typeof motion] ?? motion.div) as React.ElementType;
  return (
    <Comp className={className} style={style} variants={itemVariants(y, duration)}>
      {children}
    </Comp>
  );
}
