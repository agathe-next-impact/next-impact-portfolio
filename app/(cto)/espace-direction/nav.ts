/**
 * Le cookie qui mémorise la barre latérale repliée (`rail`) ou déployée.
 *
 * Dans un module neutre, pas dans `sidebar.tsx` : une constante importée d'un
 * module client par un composant serveur arrive sous forme de référence
 * client, pas de chaîne.
 */
export const NAV_COOKIE = "cto-nav";
