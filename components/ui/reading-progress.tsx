"use client";

import { useEffect, useRef } from "react";

/**
 * Barre de progression de lecture — pages ARTICLE uniquement (documentation,
 * blog). Fine (2 px), fixée juste sous le header sticky (h-16), pilotée par
 * `transform: scaleX` avec origine à gauche : aucun layout/paint, zéro CLS
 * (position fixed, hauteur constante, conteneur toujours présent).
 *
 * Sobriété : scroll listener passif + rAF (une écriture de transform par
 * frame), pas de framer-motion — le composant reste hors du graphe LazyMotion.
 * La progression se mesure sur la hauteur totale du document
 * (scrollY / (scrollHeight − innerHeight)), pas sur la fenêtre.
 *
 * Reduced-motion : la barre est CONSERVÉE, sans lissage ni transition — son
 * mouvement est un miroir 1:1 de la position de scroll de l'utilisateur
 * (feedback de position, pas une animation autonome), ce que les
 * recommandations prefers-reduced-motion exemptent. Aucun garde-fou
 * supplémentaire n'est donc nécessaire ici.
 *
 * Purement décorative pour les lecteurs d'écran → `aria-hidden`.
 */
export function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    let raf = 0;

    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      bar.style.transform = `scaleX(${progress})`;
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-16 z-40 h-0.5"
    >
      {/* Accent des surfaces article (TOC, blockquotes) = accent-secondary,
          theme-aware clair/sombre. */}
      <div
        ref={barRef}
        className="h-full origin-left bg-accent-secondary"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
