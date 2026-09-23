// ─────────────────────────────────────────────────────────────────────────────
// Identité de l'admin de supervision — une constante, pas une donnée.
//
// L'espace client (`src/cto/access/`) interroge `cto_persons` parce qu'il y a
// plusieurs personnes, chez plusieurs clients, qui entrent et sortent. Ici il
// n'y a qu'une personne au monde à pouvoir se connecter à `/admin-cto` :
// Agathe. Une table pour une seule ligne qui ne change jamais serait un aller-
// retour base pour ce que le code sait déjà — d'où une constante plutôt qu'un
// `findAdminByEmail`.
//
// Conséquence directe : changer cette adresse est un déploiement de code, pas
// un geste d'exploitation. C'est le comportement voulu — cet accès n'est
// jamais transféré à quelqu'un d'autre.
// ─────────────────────────────────────────────────────────────────────────────

export const ADMIN_EMAIL = "agathe@next-impact.digital";
export const ADMIN_NAME = "Agathe Karinthi-Martin";

/**
 * Identifiant WebAuthn de l'admin, transmis à l'authentificateur.
 *
 * Une valeur fixe et non un UUID aléatoire : la table `cto_admin_credentials`
 * ne contient jamais qu'une identité, ce champ n'a donc rien à distinguer.
 */
export const ADMIN_USER_ID = "cto-admin-v1";
