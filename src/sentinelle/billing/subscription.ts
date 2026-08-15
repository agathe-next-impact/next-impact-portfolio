import type { NewClient } from "@sentinelle/types";
import { normalizeSiteUrl } from "@sentinelle/url";
import { checkAmount } from "./offer";

// Réexporté pour que les appelants du module facturation n'aient pas à savoir
// que la fonction est partagée avec le scanner.
export { normalizeSiteUrl };

// ─────────────────────────────────────────────────────────────────────────────
// Traduction d'une session de paiement Stripe en fiche client.
//
// Volontairement pur et sans dépendance au SDK Stripe : c'est la logique qu'on
// veut pouvoir tester sans réseau, sans base et sans clé d'API. La route
// webhook se charge de la vérification de signature et de l'écriture ; ici on
// ne fait que décider.
//
// Principe directeur : un paiement encaissé produit TOUJOURS une fiche. Une
// donnée manquante devient un avertissement à compléter à l'onboarding, jamais
// un rejet — perdre la trace d'un client qui a payé est le pire résultat
// possible.
// ─────────────────────────────────────────────────────────────────────────────

/** Sous-ensemble structurel de Stripe.Checkout.Session dont on a besoin. */
export interface CheckoutSessionLike {
  mode?: string | null;
  payment_status?: string | null;
  customer_email?: string | null;
  customer_details?: { email?: string | null; name?: string | null } | null;
  customer?: string | { id: string } | null;
  subscription?: string | { id: string } | null;
  amount_total?: number | null;
  currency?: string | null;
  custom_fields?: Array<{
    key?: string | null;
    text?: { value?: string | null } | null;
    dropdown?: { value?: string | null } | null;
    numeric?: { value?: string | null } | null;
  }> | null;
}

export type SubscriptionOutcome =
  | { ok: true; client: NewClient; warnings: string[] }
  | { ok: false; reason: string };

/** Clés acceptées pour le champ personnalisé « adresse du site ». */
const SITE_URL_FIELD_KEYS = ["siteurl", "site_url", "site", "url", "adressedusite"];

function idOf(value: string | { id: string } | null | undefined): string | null {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

function customFieldValue(
  fields: CheckoutSessionLike["custom_fields"],
  keys: string[],
): string | null {
  if (!Array.isArray(fields)) return null;

  for (const field of fields) {
    const key = (field?.key ?? "").toLowerCase().replace(/[^a-z]/g, "");
    if (!keys.includes(key)) continue;

    const value =
      field?.text?.value ?? field?.dropdown?.value ?? field?.numeric?.value ?? null;
    if (value && value.trim()) return value.trim();
  }

  return null;
}

/** Nom de repli quand Stripe n'en fournit pas : la partie locale de l'e-mail. */
export function fallbackName(email: string): string {
  const local = email.split("@")[0] ?? email;
  return local.replace(/[._-]+/g, " ").trim() || email;
}

/**
 * Construit la fiche client à créer à partir d'une session de paiement aboutie.
 */
export function clientFromCheckoutSession(
  session: CheckoutSessionLike,
): SubscriptionOutcome {
  // On ne traite que les abonnements réglés. Le reste n'est pas une erreur :
  // Stripe envoie aussi des sessions de paiement unique ou abandonnées.
  if (session.mode && session.mode !== "subscription") {
    return { ok: false, reason: `mode ignoré : ${session.mode}` };
  }
  if (session.payment_status && session.payment_status === "unpaid") {
    return { ok: false, reason: "session non réglée" };
  }

  const email = (session.customer_details?.email ?? session.customer_email ?? "")
    .trim()
    .toLowerCase();
  if (!email) {
    // Sans e-mail, la fiche n'a pas de clé : c'est le seul cas de rejet.
    return { ok: false, reason: "aucune adresse e-mail dans la session" };
  }

  const warnings: string[] = [];

  const rawSiteUrl = customFieldValue(session.custom_fields, SITE_URL_FIELD_KEYS);
  const siteUrl = normalizeSiteUrl(rawSiteUrl);
  if (!siteUrl) {
    warnings.push(
      rawSiteUrl
        ? `adresse de site inexploitable (« ${rawSiteUrl} ») — à corriger à l'onboarding`
        : "aucune adresse de site fournie — à collecter à l'onboarding (champ personnalisé du Payment Link)",
    );
  }

  const amount = checkAmount(session.amount_total, session.currency);
  if (!amount.matches) {
    warnings.push(
      `montant encaissé ${amount.received} alors que l'offre annonce ${amount.expected} — vérifier le Price Stripe et la page d'offre`,
    );
  }

  const stripeCustomerId = idOf(session.customer);
  const stripeSubscriptionId = idOf(session.subscription);
  if (!stripeSubscriptionId) {
    warnings.push("aucun identifiant d'abonnement — résiliation non traçable");
  }

  return {
    ok: true,
    warnings,
    client: {
      email,
      name: session.customer_details?.name?.trim() || fallbackName(email),
      siteUrl: siteUrl ?? "",
      plan: "veille",
      active: true,
      stripeCustomerId,
      stripeSubscriptionId,
    },
  };
}
