"use client"

import { useEffect } from "react"
import { m as motion, useReducedMotion } from "framer-motion"

import { DUR } from "@/lib/motion-tokens"

// Easing historique du fondu de page — volontairement distinct d'EASE_OUT
// (le changer modifierait le rendu de la transition entre pages).
const EASE_PAGE = "easeInOut"

export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Filet explicite en plus du MotionConfig reducedMotion="user" :
  // rendu statique, aucun composant motion monté.
  if (reduce) {
    return <div>{children}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: DUR.ui, ease: EASE_PAGE }}
    >
      {children}
    </motion.div>
  )
}
