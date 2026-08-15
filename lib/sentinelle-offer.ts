// ─────────────────────────────────────────────────────────────────────────────
// Faits publics de l'offre Sentinelle — source unique.
//
// Ce fichier vit côté vitrine, et non dans src/sentinelle/, à cause de la règle
// d'isolation : la page d'offre /sentinelle est une page marketing, elle ne doit
// jamais importer le code du produit. La dépendance va donc dans l'autre sens —
// c'est `src/sentinelle/billing/offer.ts` qui importe d'ici, ce que la règle
// autorise (Sentinelle → vitrine).
//
// Conséquence : la page affiche et le webhook vérifie le même montant. Modifier
// le tarif ici le change des deux côtés à la fois.
//
// À l'extraction du produit en sous-domaine, ce fichier part avec lui (il est
// listé dans src/sentinelle/README.md).
// ─────────────────────────────────────────────────────────────────────────────

/** Montant mensuel attendu, en centimes. */
export const OFFER_AMOUNT_CENTS = 1900;

export const OFFER_CURRENCY = "eur";

/** Libellé affiché sur la page d'offre. */
export const OFFER_PRICE_LABEL = "19 €/mois";

/** Deux envois par mois : le 1er et le 15. */
export const OFFER_ISSUES_PER_MONTH = 2;

/**
 * URL du Payment Link Stripe (page de paiement hébergée), créée dans le tableau
 * de bord et renseignée via STRIPE_PAYMENT_LINK_VEILLE.
 *
 * Renvoie null si elle est absente ou mal formée : la page bascule alors sur son
 * parcours d'attente plutôt que d'afficher un bouton d'achat qui ne mène nulle
 * part. Mieux vaut pas de bouton qu'un bouton mort.
 */
export function sentinellePaymentLinkUrl(): string | null {
  const url = process.env.STRIPE_PAYMENT_LINK_VEILLE?.trim();
  if (!url) return null;

  if (!/^https:\/\/(buy\.stripe\.com|[a-z0-9-]+\.stripe\.com)\//i.test(url)) {
    console.warn(
      "[sentinelle] STRIPE_PAYMENT_LINK_VEILLE ne ressemble pas à une URL de Payment Link Stripe — bouton d'abonnement masqué.",
    );
    return null;
  }

  return url;
}
