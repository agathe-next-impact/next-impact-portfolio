import { eq, sql } from "drizzle-orm";
import { db } from "@sentinelle/db/client";
import { clients } from "@sentinelle/db/schema";
import type { NewClient } from "@sentinelle/types";

// ─────────────────────────────────────────────────────────────────────────────
// Écritures liées à l'abonnement.
//
// Idempotence : Stripe rejoue les webhooks (nouvelle tentative après un timeout,
// renvoi manuel depuis le tableau de bord). Aucun compteur applicatif ici — on
// s'appuie sur la contrainte d'unicité de `clients.email` et un upsert. Rejouer
// dix fois le même événement produit exactement le même état.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Crée la fiche client, ou la remet à jour si l'adresse existe déjà
 * (réabonnement après résiliation, rejeu de webhook).
 *
 * Les champs saisis à l'onboarding — secteur, notes, et l'adresse du site quand
 * elle a déjà été renseignée — ne sont jamais écrasés par une valeur vide
 * venant de Stripe.
 */
export async function upsertSubscriber(client: NewClient) {
  const [row] = await db()
    .insert(clients)
    .values(client)
    .onConflictDoUpdate({
      target: clients.email,
      set: {
        active: true,
        // Réabonnement : la date de résiliation s'efface, sans quoi la purge de
        // rétention effacerait dans trois mois les données d'un client payant.
        deactivatedAt: null,
        plan: "veille",
        stripeCustomerId: sql`coalesce(excluded.stripe_customer_id, ${clients.stripeCustomerId})`,
        stripeSubscriptionId: sql`coalesce(excluded.stripe_subscription_id, ${clients.stripeSubscriptionId})`,
        // nullif('' → null) : une valeur vide venant de Stripe ne doit pas
        // effacer une adresse déjà connue.
        siteUrl: sql`coalesce(nullif(excluded.site_url, ''), ${clients.siteUrl})`,
        name: sql`coalesce(nullif(excluded.name, ''), ${clients.name})`,
      },
    })
    .returning({ id: clients.id, email: clients.email });

  return row;
}

/**
 * Désactive l'abonnement à la résiliation.
 *
 * On ne supprime pas la fiche : la politique de conservation prévoit un
 * effacement à J+3 mois (fenêtre de réactivation), pas à la seconde où Stripe
 * annonce la fin de l'abonnement.
 */
export async function deactivateSubscription(subscriptionId: string, at: Date = new Date()) {
  const rows = await db()
    .update(clients)
    // La date, et pas seulement le drapeau : c'est elle qui fait courir les
    // délais d'effacement (retention/policy.ts).
    .set({ active: false, deactivatedAt: at })
    .where(eq(clients.stripeSubscriptionId, subscriptionId))
    .returning({ id: clients.id, email: clients.email });

  return rows;
}
