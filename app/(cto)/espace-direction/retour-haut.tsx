"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Le bouton « haut de page ».
//
// N'apparaît qu'après un écran et demi de défilement : sur une page courte, il
// ne serait qu'un bouton de plus. Sur mobile et tablette, il se pose au-dessus
// de la barre du bas (et de la bannière d'installation, via `--pwa-banniere`).
//
// Il rend aussi le focus au contenu : sans cela, un utilisateur au clavier
// remonterait visuellement mais garderait son focus en bas de page.
// ─────────────────────────────────────────────────────────────────────────────

export function RetourHaut() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let image = 0;
    const lire = () => {
      image = 0;
      setVisible(window.scrollY > window.innerHeight * 1.5);
    };
    const defiler = () => {
      if (!image) image = requestAnimationFrame(lire);
    };
    lire();
    window.addEventListener("scroll", defiler, { passive: true });
    return () => {
      window.removeEventListener("scroll", defiler);
      cancelAnimationFrame(image);
    };
  }, []);

  function remonter() {
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduit ? "instant" : "smooth" });
    document.getElementById("contenu")?.focus({ preventScroll: true });
  }

  return (
    <button
      type="button"
      onClick={remonter}
      aria-label="Revenir en haut de la page"
      title="Haut de page"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom)+var(--pwa-banniere,0px))] right-4 z-20 grid h-10 w-10 place-items-center border border-dark-gray bg-jet/90 text-mid-gray shadow-lg backdrop-blur transition-[opacity,transform] duration-200 hover:border-accent-secondary hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-secondary motion-reduce:transition-none lg:bottom-6 lg:right-6 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      <ArrowUp aria-hidden className="h-4 w-4" strokeWidth={1.8} />
    </button>
  );
}
