// Lit les tokens de couleur (HSL) sur :root pour les visuels <canvas>, qui ne
// peuvent pas utiliser les classes Tailwind. Snapshot par frame → theme-aware.
export function paletteSnapshot() {
  const cs = getComputedStyle(document.documentElement);
  return (name: string, alpha = 1): string => {
    const v = cs.getPropertyValue(name).trim() || "0 0% 50%";
    return `hsl(${v} / ${alpha})`;
  };
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
