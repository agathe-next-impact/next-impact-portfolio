// ─────────────────────────────────────────────────────────────────────────────
// Le service worker des deux applications installables du groupe — l'espace
// client (`espace-direction/sw.js`) et l'admin (`admin-cto/sw.js`). Un seul
// texte, paramétré par application : portée, préfixe des caches, chemins
// jamais mis en cache, écran hors ligne.
//
// Ce qu'il garde, et comment :
//  - `/_next/static` et les icônes : nommés par empreinte, jamais périmés,
//    « cache d'abord » (cache `<prefixe>-statique`) ;
//  - les PAGES de l'application, en « réseau d'abord » : hors ligne, on relit
//    la dernière version consultée (cache `<prefixe>-pages`) ;
//  - les PIÈCES (`…/fichiers/<empreinte>`), « cache d'abord » : leur adresse
//    est l'empreinte du contenu, elle ne change pas sans que le fichier change ;
//  - le dossier de restitution, en « réseau d'abord ».
// Pages et pièces sont des données de client : leur cache est vidé à la
// déconnexion et à chaque affichage de l'écran de connexion (`pwa.tsx`).
//
// Préchargement : la page envoie au worker (`postMessage`) les liens de son
// menu ; il les charge en arrière-plan, avec les ressources statiques qu'ils
// citent, pour que l'application s'ouvre hors ligne sur des pages jamais
// visitées sur cet appareil. Aucune page du groupe n'écrit à l'affichage : le
// préchargement ne marque rien comme lu.
//
// Jamais en cache : la connexion (jeton à usage unique), tout ce qui n'est pas
// un GET (actions serveur), les requêtes RSC — hors ligne, le routeur Next
// retombe sur une navigation complète, que ce worker sert depuis le cache.
//
// La version (le commit déployé) change le texte du script : c'est ce qui fait
// installer le nouveau worker à chaque déploiement.
// ─────────────────────────────────────────────────────────────────────────────

export interface ConfigWorker {
  /** Portée, sans barre finale : `/espace-direction`, `/admin-cto`. */
  portee: string;
  /** Préfixe des caches : le worker supprime les siens périmés, jamais ceux de l'autre application. */
  prefixe: string;
  /** Page servie hors ligne quand on ouvre la portée elle-même (icône de l'écran d'accueil). */
  accueil: string;
  /** Segments, sous la portée, jamais mis en cache ni préchargés. */
  jamais: string[];
  /** « Espace direction », « Supervision ». */
  libelle: string;
}

export const VERSION_WORKER = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) ?? "local";

const echapper = (texte: string) => texte.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");

export function scriptWorker(config: ConfigWorker): string {
  const jamais = `^${echapper(config.portee)}(?:\\/.*)?\\/(?:${[...config.jamais, "sw\\.js", "manifest\\.webmanifest"].join("|")})(?:\\/|$)`;

  return `
const VERSION = ${JSON.stringify(VERSION_WORKER)};
const PORTEE = ${JSON.stringify(config.portee)};
const ACCUEIL = ${JSON.stringify(config.accueil)};
const STATIQUE = ${JSON.stringify(`${config.prefixe}-statique`)};
const PAGES = ${JSON.stringify(`${config.prefixe}-pages`)};
const PREFIXE = ${JSON.stringify(`${config.prefixe}-`)};
const MAX_STATIQUE = 400;
const MAX_PAGES = 80;
const MAX_PRECHARGEMENT = 40;
const DELAI_RESEAU_MS = 6000;
const JAMAIS = new RegExp(${JSON.stringify(jamais)});
const PIECE = /\\/fichiers\\/[a-f0-9]{64}$/;
const RESTITUTION = /\\/restitution$/;

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const noms = await caches.keys();
      await Promise.all(
        noms
          .filter((nom) => nom.startsWith(PREFIXE) && nom !== STATIQUE && nom !== PAGES)
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

const cleDe = (url) => url.origin + url.pathname + url.search;
const dansPortee = (url) =>
  url.origin === self.location.origin &&
  (url.pathname === PORTEE || url.pathname.startsWith(PORTEE + "/")) &&
  !JAMAIS.test(url.pathname);

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
<title>Hors ligne · ${config.libelle}</title>
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
<p class="label">Next Impact · ${config.libelle}</p>
<h1>Vous êtes hors ligne.</h1>
<p>Cette page n'est pas encore enregistrée sur cet appareil. Les pages déjà ouvertes, et celles du menu, restent lisibles sans réseau.</p>
<a href="\${ACCUEIL}">Revenir à l'accueil</a>
</main></body></html>\`;
  return new Response(html, {
    status: 503,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}

async function page(event, url) {
  const cache = await caches.open(PAGES);
  const cle = cleDe(url);

  const reseau = fetch(event.request).then(async (reponse) => {
    if (reponse.ok && reponse.type === "basic") {
      await cache.put(cle, reponse.clone());
      elaguer(cache, MAX_PAGES);
    }
    return reponse;
  });
  // La mise à jour du cache continue même si la page est servie depuis le cache.
  event.waitUntil(reseau.catch(() => undefined));

  const depuisCache = async () =>
    (await cache.match(cle, { ignoreVary: true })) ||
    (url.pathname === PORTEE ? await cache.match(self.location.origin + ACCUEIL, { ignoreVary: true }) : undefined);

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

async function piece(request, reseauDabord) {
  const cache = await caches.open(PAGES);
  const cle = cleDe(new URL(request.url));
  if (!reseauDabord) {
    const enCache = await cache.match(cle);
    if (enCache) return enCache;
  }
  try {
    const reponse = await fetch(request);
    if (reponse.ok && reponse.type === "basic") await cache.put(cle, reponse.clone());
    return reponse;
  } catch (erreur) {
    const enCache = await cache.match(cle);
    if (enCache) return enCache;
    throw erreur;
  }
}

/** Les ressources statiques citées par une page, pour qu'elle s'affiche hors ligne. */
async function ressourcesDe(html) {
  const cache = await caches.open(STATIQUE);
  const adresses = new Set(html.match(/\\/_next\\/static\\/[^"'\\s)\\\\]+/g) || []);
  for (const adresse of adresses) {
    const url = new URL(adresse, self.location.origin);
    if (await cache.match(url.href)) continue;
    try {
      const reponse = await fetch(url.href, { credentials: "same-origin" });
      if (reponse.ok && reponse.type === "basic") await cache.put(url.href, reponse);
    } catch {
      return;
    }
  }
}

async function precharger(adresses) {
  const cache = await caches.open(PAGES);
  const vues = new Set();
  for (const adresse of adresses) {
    if (vues.size >= MAX_PRECHARGEMENT) break;
    let url;
    try {
      url = new URL(adresse, self.location.origin);
    } catch {
      continue;
    }
    url.hash = "";
    if (!dansPortee(url) || PIECE.test(url.pathname) || RESTITUTION.test(url.pathname)) continue;
    const cle = cleDe(url);
    if (vues.has(cle)) continue;
    vues.add(cle);
    try {
      const reponse = await fetch(cle, { credentials: "same-origin", headers: { Accept: "text/html" } });
      const type = reponse.headers.get("Content-Type") || "";
      // Une redirection (session expirée → connexion) n'est pas la page demandée.
      if (!reponse.ok || reponse.redirected || !type.includes("text/html")) continue;
      await cache.put(cle, reponse.clone());
      await ressourcesDe(await reponse.text());
    } catch {
      return; // Réseau perdu en route : on reprendra au prochain passage.
    }
  }
  await elaguer(cache, MAX_PAGES);
}

self.addEventListener("message", (event) => {
  const donnees = event.data || {};
  if (donnees.type === "precharger" && Array.isArray(donnees.adresses)) {
    event.waitUntil(precharger(donnees.adresses.slice(0, MAX_PRECHARGEMENT * 2)));
  }
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    if (!dansPortee(url)) return;
    if (PIECE.test(url.pathname) || RESTITUTION.test(url.pathname)) return;
    event.respondWith(page(event, url));
    return;
  }

  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/pwa/")) {
    event.respondWith(statique(request));
    return;
  }

  // Les pièces, lues par le lecteur intégré (\`lecteur-pdf.tsx\`) en fetch.
  if (dansPortee(url) && request.headers.get("RSC") === null) {
    if (PIECE.test(url.pathname)) event.respondWith(piece(request, false));
    else if (RESTITUTION.test(url.pathname)) event.respondWith(piece(request, true));
  }
});
`;
}

export function reponseWorker(config: ConfigWorker): Response {
  return new Response(scriptWorker(config), {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-cache",
      "Service-Worker-Allowed": config.portee,
    },
  });
}
