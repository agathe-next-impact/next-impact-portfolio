"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Passe à `true` la première fois que l'élément référencé entre dans le
 * viewport, puis y reste. Sert à armer un déclencheur au scroll (ex. « la
 * grille tarifaire a été dépassée ») sans écouter l'événement scroll.
 *
 * `rootMargin` négatif en bas = l'élément doit être franchement visible, pas
 * juste effleuré par le bord de l'écran.
 */
export function useSeen<T extends Element>(options?: {
  rootMargin?: string;
  threshold?: number;
}) {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    if (seen) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: options?.rootMargin ?? "0px 0px -25% 0px",
        threshold: options?.threshold ?? 0,
      },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [seen, options?.rootMargin, options?.threshold]);

  return [ref, seen] as const;
}
