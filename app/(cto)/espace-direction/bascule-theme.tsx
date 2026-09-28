"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

/**
 * La bascule clair / sombre, en haut à droite de chaque page connectée.
 *
 * Avant le montage, le thème résolu est inconnu : on suppose le clair, qui est
 * le défaut de l'espace (cf. `layout.tsx`), pour ne pas faire clignoter l'icône.
 */
export function BasculeTheme({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [pret, setPret] = useState(false);
  useEffect(() => setPret(true), []);
  const sombre = pret && resolvedTheme === "dark";
  const label = sombre ? "Passer en clair" : "Passer en sombre";
  const Icon = sombre ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={() => setTheme(sombre ? "light" : "dark")}
      aria-label={label}
      title={label}
      className={`inline-flex h-9 w-9 items-center justify-center border border-dark-gray text-mid-gray transition-colors hover:border-accent-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-secondary ${className}`}
    >
      <Icon aria-hidden className="h-4 w-4" strokeWidth={1.7} />
    </button>
  );
}
