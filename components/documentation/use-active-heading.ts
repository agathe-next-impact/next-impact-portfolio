"use client";

import { useEffect, useState } from "react";

/**
 * Section active d'une table des matières (articles documentation).
 *
 * Principe : une « ligne d'activation » à 40 % de la hauteur de fenêtre ; la
 * section active est le dernier heading passé au-dessus de cette ligne. Un
 * IntersectionObserver (bande `-40% 0px -55% 0px`) sert uniquement de
 * déclencheur économe : à chaque franchissement de la bande par un heading, on
 * recalcule l'actif à partir des positions réelles — comportement correct dans
 * les deux sens de scroll (contrairement au pattern « premier entry
 * intersectant », qui perd l'actif en remontant).
 *
 * Retourne l'id du heading actif ("" avant le premier H2).
 */
export function useActiveHeading(
  tableOfContents: { id: string }[],
): string {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const headings = tableOfContents
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    if (headings.length === 0) return;

    const compute = () => {
      const line = window.innerHeight * 0.4;
      let current = "";
      // `headings` suit l'ordre du document (TOC générée séquentiellement).
      for (const h of headings) {
        if (h.getBoundingClientRect().top <= line) current = h.id;
        else break;
      }
      setActiveId(current);
    };

    const observer = new IntersectionObserver(compute, {
      rootMargin: "-40% 0px -55% 0px",
      threshold: 0,
    });

    headings.forEach((h) => observer.observe(h));
    compute();
    return () => observer.disconnect();
  }, [tableOfContents]);

  return activeId;
}
