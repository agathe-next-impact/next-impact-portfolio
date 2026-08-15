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

/**
 * Le même lien, rattaché à l'analyse qui a mené jusqu'ici.
 *
 * `client_reference_id` est le seul paramètre que Stripe accepte de faire
 * voyager jusqu'au webhook. On y met l'identifiant du scan : à l'ouverture de
 * l'abonnement, la fiche est amorcée avec ce que le client vient de lire à
 * l'écran, plutôt qu'avec une seconde analyse faite deux minutes plus tard —
 * qui pourrait dire autre chose et donner l'impression d'un produit qui hésite.
 *
 * Stripe n'accepte que des caractères alphanumériques, tirets et soulignés dans
 * ce champ : un identifiant qui n'est pas un UUID est ignoré plutôt que
 * transmis, sans quoi Stripe refuserait l'ouverture de la page de paiement.
 */
export function sentinellePaymentLinkFor(scanId: string | null | undefined): string | null {
  const base = sentinellePaymentLinkUrl();
  if (!base) return null;

  const id = scanId?.trim() ?? "";
  if (!/^[0-9a-f-]{36}$/i.test(id)) return base;

  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}client_reference_id=${id}`;
}
