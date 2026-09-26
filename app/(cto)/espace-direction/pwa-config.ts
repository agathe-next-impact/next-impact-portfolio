/**
 * Les constantes de l'application installable, partagées par le worker (servi
 * côté serveur) et par `pwa.tsx` (côté client).
 *
 * Dans un module neutre, comme `nav.ts` : `session.ts` importe `next/headers`
 * et ne peut pas être lu par un composant client. `PWA_SCOPE` vaut donc
 * `ESPACE_PATH`, recopié — à changer ensemble.
 */
export const PWA_SCOPE = "/espace-direction";
export const SW_URL = `${PWA_SCOPE}/sw.js`;
export const MANIFEST_URL = `${PWA_SCOPE}/manifest.webmanifest`;

/** Le cache des pages consultées, vidé à la déconnexion. */
export const PAGES_CACHE = "espace-pages";
