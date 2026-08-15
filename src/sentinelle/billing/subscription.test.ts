import { describe, expect, it } from "vitest";
import {
  clientFromCheckoutSession,
  fallbackName,
  normalizeSiteUrl,
  type CheckoutSessionLike,
} from "./subscription";

/** Session type : abonnement réglé, e-mail et site fournis, 19 €. */
function session(overrides: Partial<CheckoutSessionLike> = {}): CheckoutSessionLike {
  return {
    mode: "subscription",
    payment_status: "paid",
    customer_details: { email: "Marie@Exemple.fr", name: "Marie Dupont" },
    customer: "cus_123",
    subscription: "sub_456",
    amount_total: 1900,
    currency: "eur",
    custom_fields: [{ key: "site_url", text: { value: "exemple.fr" } }],
    ...overrides,
  };
}

describe("normalizeSiteUrl", () => {
  it("complète le schéma manquant", () => {
    expect(normalizeSiteUrl("exemple.fr")).toBe("https://exemple.fr");
    expect(normalizeSiteUrl("www.exemple.fr")).toBe("https://www.exemple.fr");
  });

  it("normalise la casse et la barre finale", () => {
    expect(normalizeSiteUrl("HTTP://Exemple.FR/")).toBe("http://exemple.fr");
    expect(normalizeSiteUrl("  https://Exemple.fr/blog/  ")).toBe("https://exemple.fr/blog");
  });

  it("refuse ce qui n'est pas un domaine public", () => {
    for (const input of ["", "   ", "localhost", "mon site", null, undefined]) {
      expect(normalizeSiteUrl(input as string)).toBeNull();
    }
  });
});

describe("fallbackName", () => {
  it("dérive un nom lisible de l'adresse", () => {
    expect(fallbackName("marie.dupont@exemple.fr")).toBe("marie dupont");
    expect(fallbackName("contact@exemple.fr")).toBe("contact");
  });
});

describe("clientFromCheckoutSession", () => {
  it("construit une fiche complète sans avertissement", () => {
    const outcome = clientFromCheckoutSession(session());

    expect(outcome).toMatchObject({
      ok: true,
      warnings: [],
      client: {
        email: "marie@exemple.fr",
        name: "Marie Dupont",
        siteUrl: "https://exemple.fr",
        plan: "veille",
        active: true,
        stripeCustomerId: "cus_123",
        stripeSubscriptionId: "sub_456",
      },
    });
  });

  it("normalise l'adresse e-mail en minuscules", () => {
    const outcome = clientFromCheckoutSession(
      session({ customer_details: { email: "  MARIE@EXEMPLE.FR ", name: null } }),
    );
    expect(outcome.ok && outcome.client.email).toBe("marie@exemple.fr");
  });

  it("se rabat sur l'adresse quand Stripe ne donne pas de nom", () => {
    const outcome = clientFromCheckoutSession(
      session({ customer_details: { email: "contact@exemple.fr", name: "  " } }),
    );
    expect(outcome.ok && outcome.client.name).toBe("contact");
  });

  it("accepte les objets étendus de Stripe pour customer et subscription", () => {
    const outcome = clientFromCheckoutSession(
      session({ customer: { id: "cus_789" }, subscription: { id: "sub_789" } }),
    );
    expect(outcome.ok && outcome.client.stripeCustomerId).toBe("cus_789");
    expect(outcome.ok && outcome.client.stripeSubscriptionId).toBe("sub_789");
  });

  it("reconnaît le champ site quelle que soit la clé choisie dans Stripe", () => {
    for (const key of ["siteUrl", "site_url", "site", "url", "adresse du site"]) {
      const outcome = clientFromCheckoutSession(
        session({ custom_fields: [{ key, text: { value: "exemple.fr" } }] }),
      );
      expect(outcome.ok && outcome.client.siteUrl).toBe("https://exemple.fr");
    }
  });

  // Le point le plus important : un paiement encaissé produit toujours une fiche.
  it("crée quand même la fiche si l'adresse du site manque, avec un avertissement", () => {
    const outcome = clientFromCheckoutSession(session({ custom_fields: [] }));

    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    expect(outcome.client.siteUrl).toBe("");
    expect(outcome.warnings.join(" ")).toContain("aucune adresse de site");
  });

  it("signale une adresse de site inexploitable sans rejeter le paiement", () => {
    const outcome = clientFromCheckoutSession(
      session({ custom_fields: [{ key: "site_url", text: { value: "je ne sais pas" } }] }),
    );

    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    expect(outcome.warnings.join(" ")).toContain("inexploitable");
  });

  it("signale une divergence de tarif entre Stripe et la page d'offre", () => {
    const outcome = clientFromCheckoutSession(session({ amount_total: 4900 }));

    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    expect(outcome.warnings.join(" ")).toContain("4900 eur");
    expect(outcome.warnings.join(" ")).toContain("1900 eur");
  });

  it("signale un abonnement sans identifiant", () => {
    const outcome = clientFromCheckoutSession(session({ subscription: null }));
    expect(outcome.ok && outcome.warnings.join(" ")).toContain("résiliation non traçable");
  });

  it("ne rejette que l'absence d'e-mail", () => {
    const outcome = clientFromCheckoutSession(
      session({ customer_details: null, customer_email: null }),
    );
    expect(outcome).toEqual({ ok: false, reason: "aucune adresse e-mail dans la session" });
  });

  it("ignore ce qui n'est pas un abonnement réglé", () => {
    expect(clientFromCheckoutSession(session({ mode: "payment" })).ok).toBe(false);
    expect(clientFromCheckoutSession(session({ payment_status: "unpaid" })).ok).toBe(false);
  });
});
