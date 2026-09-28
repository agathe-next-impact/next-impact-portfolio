import type { MetadataRoute } from "next";

// Manifeste de la vitrine (servi en /manifest.webmanifest, route déjà exclue
// du matcher de proxy.ts). Icônes de la charte bleue : monogramme blanc sur
// fond bleu (2026-09-28). L'espace direction (app/(cto)) garde son propre
// manifeste PWA.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Next Impact · Refonte de site WordPress",
    short_name: "Next Impact",
    description:
      "Refonte de site WordPress : rapide, moderne, sans tout reconstruire. Prix affichés, performance mesurée avant et après.",
    start_url: "/",
    display: "browser",
    lang: "fr",
    background_color: "#050505",
    theme_color: "#12196e",
    icons: [
      { src: "/img/icon-bleu-192.png", sizes: "192x192", type: "image/png" },
      { src: "/img/logo-next-impact-bleu.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
