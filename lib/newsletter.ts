// Newsletter gratuite « Quelle techno pour mon site web à l'heure de l'IA ? »
//
// Source unique des URL : y pointent la page /veille, le méga-menu, le widget
// de contact flottant et le panneau « dernier numéro » du héros d'accueil.
// Tout lien « newsletter » du site doit mener à NEWSLETTER_SUBSCRIBE_URL —
// c'est la seule page Substack qui porte un champ e-mail.
//
// L'abonnement se fait sur Substack : il n'existe aucun formulaire maison
// (app/api/newsletter/route.ts est un reliquat sans appelant depuis la
// suppression de l'ancienne popup newsletter, commit bcb1600).

export const NEWSLETTER_NAME =
  "Quelle techno pour mon site web à l'heure de l'IA ?";

// Publication Substack (le sous-domaine, pas le profil) : racine du flux RSS
// `/feed` et de l'archive JSON `/api/v1/archive`, lus par lib/substack.ts.
export const NEWSLETTER_PUBLICATION_URL =
  "https://comesattollo626215.substack.com";

// Page d'abonnement : c'est LA destination de tout lien « newsletter » du site.
// Deux autres URL Substack existent et ne conviennent pas — la racine de la
// publication (qui affiche l'archive avant le formulaire) et le profil
// `substack.com/@comesattollo626215`, qui ne propose que « Follow » et aucun
// champ e-mail. Le profil a été retiré du code le 2026-09-12 pour cette raison.
export const NEWSLETTER_SUBSCRIBE_URL = `${NEWSLETTER_PUBLICATION_URL}/subscribe`;
