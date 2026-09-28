"use client";

import { useEffect, useRef, type ReactNode } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Un bandeau qui défile à l'horizontale et s'ouvre centré sur son repère
// (l'élément marqué `data-centre`).
//
// Sur mobile, la frise garde une largeur minimale lisible et défile ; ouverte
// sur son bord gauche, elle montrait le passé et laissait « Aujourd'hui » hors
// champ. Sans JavaScript, le bandeau défile normalement depuis la gauche.
// ─────────────────────────────────────────────────────────────────────────────

export function DefilementCentre({
  className = "",
  children,
  ...rest
}: {
  className?: string;
  children: ReactNode;
  "aria-hidden"?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const repere = el?.querySelector<HTMLElement>("[data-centre]");
    if (!el || !repere || el.scrollWidth <= el.clientWidth) return;
    const cadre = el.getBoundingClientRect();
    const cible = repere.getBoundingClientRect();
    el.scrollLeft += cible.left - cadre.left - el.clientWidth / 2;
  }, []);

  return (
    <div ref={ref} className={`overflow-x-auto ${className}`} {...rest}>
      {children}
    </div>
  );
}
