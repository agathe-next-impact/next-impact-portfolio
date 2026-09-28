import { ADMIN_PWA_SCOPE } from "../pwa-config";

// ─────────────────────────────────────────────────────────────────────────────
// Le service worker de l'admin, servi par une route pour poser
// `Service-Worker-Allowed` (portée `/admin-cto`, sans barre finale).
//
// Plus sobre que celui de l'espace client : AUCUNE page n'est mise en cache.
// L'admin lit et écrit en direct (Neon, Notion) ; une copie périmée d'un
// tableau de bord induirait en erreur, et ces pages rassemblent les données de
// tous les clients. Le worker ne sert qu'à :
//  - rendre l'admin installable (Chrome exige un gestionnaire `fetch`) ;
//  - garder en cache les ressources `/_next/static` et les icônes (nommées
//    par empreinte, jamais périmées) : ouverture plus rapide ;
//  - hors ligne, afficher un écran clair plutôt que l'erreur du navigateur.
//
// Caches préfixés `admin-` : le worker de l'espace supprime à son activation
// tous les caches `espace-*` qui ne sont pas les siens.
// ─────────────────────────────────────────────────────────────────────────────

export const dynamic = "force-static";

const VERSION = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) ?? "local";

const SCRIPT = `
const VERSION = ${JSON.stringify(VERSION)};
const PORTEE = ${JSON.stringify(ADMIN_PWA_SCOPE)};
const STATIQUE = "admin-statique";
const MAX_STATIQUE = 250;

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const noms = await caches.keys();
      await Promise.all(
        noms
          .filter((nom) => nom.startsWith("admin-") && nom !== STATIQUE)
          .map((nom) => caches.delete(nom)),
      );
      await self.clients.claim();
    })(),
  );
});

async function elaguer(cache, max) {
  const cles = await cache.keys();
  for (let i = 0; i < cles.length - max; i++) await cache.delete(cles[i]);
}

async function statique(request) {
  const cache = await caches.open(STATIQUE);
  const enCache = await cache.match(request);
  if (enCache) return enCache;
  const reponse = await fetch(request);
  if (reponse.ok && reponse.type === "basic") {
    await cache.put(request, reponse.clone());
    elaguer(cache, MAX_STATIQUE);
  }
  return reponse;
}

function horsLigne() {
  const html = \`<!doctype html><html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Hors ligne · Supervision</title>
<style>
:root{color-scheme:dark light;--fond:#050505;--texte:#f5f5f5;--doux:#9e9e9e;--accent:#7c9bf0;--sur-accent:#050505}
@media (prefers-color-scheme: light){:root{--fond:#fafafa;--texte:#0a0a0a;--doux:#6b6b6b;--accent:#2257d3;--sur-accent:#fafafa}}
body{margin:0;min-height:100dvh;display:grid;place-items:center;background:var(--fond);color:var(--texte);font:16px/1.5 system-ui,sans-serif;padding:24px;box-sizing:border-box}
main{max-width:28rem}
p.label{font:11px/1 ui-monospace,monospace;letter-spacing:.16em;text-transform:uppercase;color:var(--doux)}
h1{font-weight:300;font-size:1.6rem;margin:.6rem 0 .8rem}
p{color:var(--doux)}
a{display:inline-block;margin-top:1.2rem;border:1px solid var(--accent);background:var(--accent);color:var(--sur-accent);padding:.6rem 1rem;font:11px/1 ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;text-decoration:none}
</style></head><body><main>
<p class="label">Next Impact · Supervision</p>
<h1>Vous êtes hors ligne.</h1>
<p>La supervision lit les données en direct : rien n'est conservé sur cet appareil. Réessayez une fois la connexion rétablie.</p>
<a href="\${PORTEE}">Réessayer</a>
</main></body></html>\`;
  return new Response(html, {
    status: 503,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    if (!url.pathname.startsWith(PORTEE)) return;
    event.respondWith(fetch(request).catch(() => horsLigne()));
    return;
  }

  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/pwa/")) {
    event.respondWith(statique(request));
  }
});
`;

export function GET() {
  return new Response(SCRIPT, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-cache",
      "Service-Worker-Allowed": ADMIN_PWA_SCOPE,
    },
  });
}
