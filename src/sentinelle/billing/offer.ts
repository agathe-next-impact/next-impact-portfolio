// Côté produit, l'offre est lue depuis `lib/sentinelle-offer.ts` (voir l'en-tête
// de ce fichier pour la raison : la page marketing ne peut pas importer le code
// du produit, la dépendance est donc inversée). On ne redéclare rien ici, on
// ajoute seulement la logique qui n'a de sens que côté serveur.
import {
  OFFER_AMOUNT_CENTS,
  OFFER_CURRENCY,
  OFFER_ISSUES_PER_MONTH,
  OFFER_PRICE_LABEL,
  sentinellePaymentLinkUrl,
} from "@/lib/sentinelle-offer";

export {
  OFFER_AMOUNT_CENTS,
  OFFER_CURRENCY,
  OFFER_ISSUES_PER_MONTH,
  OFFER_PRICE_LABEL,
};

export const paymentLinkUrl = sentinellePaymentLinkUrl;

/**
 * Le montant encaissé correspond-il à l'offre annoncée sur le site ?
 *
 * Ne bloque rien : le paiement a déjà eu lieu. Sert à journaliser une dérive
 * entre le Price Stripe et la page d'offre — typiquement un tarif changé dans
 * le tableau de bord sans que le site suive.
 */
export function checkAmount(
  amountTotal: number | null | undefined,
  currency: string | null | undefined,
): { matches: boolean; expected: string; received: string } {
  return {
    matches:
      amountTotal === OFFER_AMOUNT_CENTS &&
      (currency ?? "").toLowerCase() === OFFER_CURRENCY,
    expected: `${OFFER_AMOUNT_CENTS} ${OFFER_CURRENCY}`,
    received: `${amountTotal ?? "?"} ${currency ?? "?"}`,
  };
}
