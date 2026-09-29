/**
 * Les constantes de l'admin installable, partagées par le worker et le
 * manifeste (servis côté serveur) et par `pwa.tsx` (côté client). Module
 * neutre : `session.ts` importe `next/headers` et ne peut pas être lu par un
 * composant client. `ADMIN_HOME` vaut donc `HOME_PATH`, recopié — à changer
 * ensemble.
 */
export const ADMIN_PWA_SCOPE = "/admin-cto";
export const ADMIN_HOME = `${ADMIN_PWA_SCOPE}/pilotage`;
export const ADMIN_SW_URL = `${ADMIN_PWA_SCOPE}/sw.js`;
export const ADMIN_MANIFEST_URL = `${ADMIN_PWA_SCOPE}/manifest.webmanifest`;

/** Le cache des pages consultées ou préchargées, vidé à la fermeture de session. */
export const ADMIN_PAGES_CACHE = "admin-pages";
