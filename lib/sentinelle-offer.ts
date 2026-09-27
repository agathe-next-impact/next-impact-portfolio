// ─────────────────────────────────────────────────────────────────────────────
// Faits publics de l'offre Sentinelle — source unique.
//
// Ce fichier vit côté vitrine, et non dans src/sentinelle/, à cause de la règle
// d'isolation : la page d'offre /sentinelle est une page marketing, elle ne doit
// jamais importer le code du produit. La dépendance va donc dans l'autre sens —
// le rapport d'analyse (app/(sentinelle)/scan) importe d'ici, ce que la règle
// autorise (Sentinelle → vitrine).
//
// Depuis le 2026-09-27, il n'y a plus de paiement en ligne : l'abonnement
// commence par une demande d'inscription validée par Agathe, et la facturation
// se fait hors ligne. Le tarif affiché reste celui-ci.
//
// À l'extraction du produit en sous-domaine, ce fichier part avec lui (il est
// listé dans src/sentinelle/README.md).
// ─────────────────────────────────────────────────────────────────────────────

/** Montant mensuel attendu, en centimes. */
export const OFFER_AMOUNT_CENTS = 1900;

/** Libellé affiché sur la page d'offre. */
export const OFFER_PRICE_LABEL = "19 €/mois";

/** Deux envois par mois : le 1er et le 15. */
export const OFFER_ISSUES_PER_MONTH = 2;
