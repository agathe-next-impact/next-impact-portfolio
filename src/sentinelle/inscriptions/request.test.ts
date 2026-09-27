import { describe, expect, it } from "vitest";
import { parseSubscriptionRequest } from "./request";

const valide = {
  email: "Dirigeante@Exemple.fr",
  nom: "Camille Martin",
  organisation: "Mastora",
  url: "mastora.fr",
  consentement: true,
};

describe("parseSubscriptionRequest", () => {
  it("normalise l'adresse et le site", () => {
    const parsed = parseSubscriptionRequest(valide);
    expect(parsed).toMatchObject({
      ok: true,
      value: { email: "dirigeante@exemple.fr", organisation: "Mastora", originScanId: null },
    });
    if (parsed.ok) expect(parsed.value.siteUrl).toContain("mastora.fr");
  });

  it("garde le rapport d'origine quand la demande en vient", () => {
    const scanId = "b194940a-131b-4a72-856a-0d4b780062a7";
    expect(parseSubscriptionRequest({ ...valide, scanId })).toMatchObject({
      ok: true,
      value: { originScanId: scanId },
    });
  });

  it("refuse sans consentement, sans organisation, avec un site illisible", () => {
    expect(parseSubscriptionRequest({ ...valide, consentement: false })).toEqual({
      ok: false,
      message: "Cochez la case pour confirmer votre demande.",
    });
    expect(parseSubscriptionRequest({ ...valide, organisation: " " })).toMatchObject({ ok: false });
    expect(parseSubscriptionRequest({ ...valide, url: "pas une adresse" })).toEqual({
      ok: false,
      message: "Adresse de site invalide.",
    });
  });

  it("refuse un pot de miel rempli", () => {
    expect(parseSubscriptionRequest({ ...valide, site: "http://spam" })).toEqual({
      ok: false,
      message: "Demande illisible.",
    });
  });
});
