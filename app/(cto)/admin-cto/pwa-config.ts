/**
 * Les constantes de l'admin installable, partagées par le worker (servi côté
 * serveur) et par `pwa.tsx` (côté client). Module neutre : `session.ts`
 * importe `next/headers` et ne peut pas être lu par un composant client.
 */
export const ADMIN_PWA_SCOPE = "/admin-cto";
export const ADMIN_SW_URL = `${ADMIN_PWA_SCOPE}/sw.js`;
export const ADMIN_MANIFEST_URL = `${ADMIN_PWA_SCOPE}/manifest.webmanifest`;
