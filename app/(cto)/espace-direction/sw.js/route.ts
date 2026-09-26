import { PAGES_CACHE, PWA_SCOPE } from "../pwa-config";

// ─────────────────────────────────────────────────────────────────────────────
// Le service worker de l'espace, servi par une route plutôt que depuis public/ :
// c'est ici qu'on pose `Service-Worker-Allowed`, sans lequel la portée ne
// pourrait pas être `/espace-direction` (sans barre finale — l'adresse que le
// client met en favori et que l'application installée ouvre).
//
// Ce qu'il met en cache, et pourquoi si peu :
//  - les ressources `/_next/static` et les icônes : nommées par empreinte,
//    jamais périmées, donc « cache d'abord » ;
//  - les PAGES de l'espace, en « réseau d'abord » : hors ligne, le client
//    relit la dernière version qu'il a consultée. Le cache des pages est vidé
//    à la déconnexion et à chaque affichage de l'écran de connexion (`pwa.tsx`),
//    parce que ce sont des données de client sur un appareil qui peut être
//    partagé.
//
// Jamais en cache : le lien de connexion (jeton à usage unique), les fichiers
// et la restitution (téléchargements), tout ce qui n'est pas un GET (actions
// serveur), et les requêtes RSC — hors ligne, le routeur Next retombe sur une
// navigation complète, que ce worker sert depuis le cache des pages.
//
// La version (le commit déployé) change le texte du script : c'est ce qui fait
// installer le nouveau worker à chaque déploiement.
// ─────────────────────────────────────────────────────────────────────────────

export const dynamic = "force-static";

const VERSION = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) ?? "local";

const SCRIPT = `
const VERSION = ${JSON.stringify(VERSION)};
const PORTEE = ${JSON.stringify(PWA_SCOPE)};
const STATIQUE = "espace-statique";
const PAGES = ${JSON.stringify(PAGES_CACHE)};
const MAX_STATIQUE = 250;
const MAX_PAGES = 40;
const DELAI_RESEAU_MS = 6000;
const JAMAIS = /^${PWA_SCOPE.replace(/\//g, "\\/")}\\/(connexion|fichiers|restitution|sw\\.js|manifest\\.webmanifest)(\\/|$)/;

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const noms = await caches.keys();
      await Promise.all(
        noms
          .filter((nom) => nom.startsWith("espace-") && nom !== STATIQUE && nom !== PAGES)
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
<title>Hors ligne · Espace direction</title>
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
<p class="label">Next Impact · Espace direction</p>
<h1>Vous êtes hors ligne.</h1>
<p>Cette page n'a pas encore été consultée sur cet appareil, elle n'est donc pas disponible sans réseau. Les pages déjà ouvertes restent lisibles : revenez à l'accueil, ou réessayez une fois la connexion rétablie.</p>
<a href="\${PORTEE}">Réessayer</a>
</main></body></html>\`;
  return new Response(html, {
    status: 503,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}

async function page(event, url) {
  const cache = await caches.open(PAGES);
  const cle = url.origin + url.pathname + url.search;

  const reseau = fetch(event.request).then(async (reponse) => {
    if (reponse.ok && reponse.type === "basic") {
      await cache.put(cle, reponse.clone());
      elaguer(cache, MAX_PAGES);
    }
    return reponse;
  });
  // La mise à jour du cache continue même si la page est servie depuis le cache.
  event.waitUntil(reseau.catch(() => undefined));

  const depuisCache = () => cache.match(cle, { ignoreVary: true });

  try {
    // Réseau lent : au-delà du délai, la version en cache si elle existe,
    // sinon on continue d'attendre le réseau.
    const delai = new Promise((resoudre) => setTimeout(resoudre, DELAI_RESEAU_MS)).then(
      async () => (await depuisCache()) || reseau,
    );
    return await Promise.race([reseau, delai]);
  } catch {
    return (await depuisCache()) || horsLigne();
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    if (!url.pathname.startsWith(PORTEE) || JAMAIS.test(url.pathname)) return;
    event.respondWith(page(event, url));
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
      "Service-Worker-Allowed": PWA_SCOPE,
    },
  });
}
