import { PWA_SCOPE } from "../pwa-config";

// ─────────────────────────────────────────────────────────────────────────────
// Le manifeste de l'application installable « Espace direction ».
//
// Propre à l'espace, pas à la vitrine : `app/manifest.ts` s'appliquerait à tout
// le domaine, et la vitrine n'a rien à installer. La portée s'arrête donc à
// `/espace-direction` — un lien vers la vitrine s'ouvre dans le navigateur.
//
// Icônes dédiées (public/pwa) : le logo du site est blanc sur fond transparent,
// invisible sur un écran d'accueil clair. Celles-ci ont un fond plein et le
// logo dans la zone de sécurité, d'où l'usage « maskable » en plus de « any ».
// ─────────────────────────────────────────────────────────────────────────────

export const dynamic = "force-static";

const MANIFEST = {
  id: PWA_SCOPE,
  name: "Next Impact · Espace direction",
  short_name: "Espace direction",
  description:
    "Missions, état du site, décisions à prendre et veille : l'espace de votre direction technique externalisée.",
  lang: "fr",
  dir: "ltr",
  start_url: PWA_SCOPE,
  scope: PWA_SCOPE,
  display: "standalone",
  background_color: "#050505",
  theme_color: "#050505",
  categories: ["business", "productivity"],
  icons: [
    { src: "/pwa/espace-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
    { src: "/pwa/espace-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    { src: "/pwa/espace-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
  ],
};

export function GET() {
  return new Response(JSON.stringify(MANIFEST), {
    headers: {
      "Content-Type": "application/manifest+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
