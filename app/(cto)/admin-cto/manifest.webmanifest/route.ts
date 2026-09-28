import { ADMIN_PWA_SCOPE } from "../pwa-config";

// ─────────────────────────────────────────────────────────────────────────────
// Le manifeste de l'admin installable « Supervision ».
//
// Distinct de celui de l'espace client (`espace-direction/manifest.webmanifest`)
// : autre `id`, autre portée, autre icône (fond bleu de la charte au lieu du
// noir), pour que les deux applications, installées sur le même appareil, ne
// se confondent pas. `start_url` = `/admin-cto`, qui renvoie vers le pilotage
// ou la connexion selon la session.
// ─────────────────────────────────────────────────────────────────────────────

export const dynamic = "force-static";

const MANIFEST = {
  id: ADMIN_PWA_SCOPE,
  name: "Next Impact · Supervision",
  short_name: "Supervision",
  description: "Pilotage des accompagnements de direction technique externalisée.",
  lang: "fr",
  dir: "ltr",
  start_url: ADMIN_PWA_SCOPE,
  scope: ADMIN_PWA_SCOPE,
  display: "standalone",
  background_color: "#12196e",
  theme_color: "#050505",
  categories: ["business", "productivity"],
  icons: [
    { src: "/pwa/admin-bleu-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
    { src: "/pwa/admin-bleu-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    { src: "/pwa/admin-bleu-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
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
