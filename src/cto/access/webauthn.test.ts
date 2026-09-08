import { describe, expect, it } from "vitest";
import { describeDevice, expectedOrigins, rpId, suggestLabel, DEFAULT_RP_ID } from "./webauthn";
import { accessDecision } from "./store";

describe("identifiant de partie de confiance", () => {
  it("vaut le domaine enregistrable par défaut, jamais un hôte", () => {
    // Le test existe pour verrouiller une décision, pas pour vérifier une
    // constante : enrôler sur `www.` invaliderait toutes les passkeys le jour
    // d'un déménagement sur un sous-domaine.
    expect(rpId({})).toBe(DEFAULT_RP_ID);
    expect(rpId({})).not.toContain("www.");
  });

  it("se laisse surcharger pour le développement local", () => {
    expect(rpId({ CTO_RP_ID: "localhost" })).toBe("localhost");
  });
});

describe("origines acceptées", () => {
  it("couvre les deux hôtes de production", () => {
    expect(expectedOrigins({})).toEqual([
      "https://next-impact.digital",
      "https://www.next-impact.digital",
    ]);
  });

  it("accepte une liste explicite", () => {
    expect(expectedOrigins({ CTO_ORIGIN: "http://localhost:3000, https://x.test" })).toEqual([
      "http://localhost:3000",
      "https://x.test",
    ]);
  });
});

describe("étiquette suggérée", () => {
  it("reconnaît un authentificateur courant", () => {
    expect(suggestLabel("fbfc3007-154e-4ecc-8c0b-6e020557d7bd", ["internal"])).toBe(
      "Trousseau iCloud",
    );
  });

  it("retombe sur le transport quand l'AAGUID est inconnu", () => {
    expect(suggestLabel("00000000-0000-0000-0000-000000000000", ["hybrid"])).toBe("Téléphone");
    expect(suggestLabel(null, ["usb"])).toBe("Clé de sécurité");
  });

  it("propose toujours quelque chose", () => {
    expect(suggestLabel(null, null)).toBe("Appareil");
  });
});

describe("description d'appareil", () => {
  it("distingue Edge de Chrome, qui s'annonce aussi comme Chrome", () => {
    const edge =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0";
    expect(describeDevice(edge)).toBe("Edge sur Windows");
  });

  it("nomme un iPhone", () => {
    const safari =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
    expect(describeDevice(safari)).toBe("Safari sur iOS");
  });

  it("ne casse pas sur une valeur absente", () => {
    expect(describeDevice(null)).toBe("Appareil inconnu");
  });
});

describe("grille d'accès", () => {
  it("ouvre tout à un accompagnement actif", () => {
    expect(accessDecision("actif")).toEqual({ allowed: true, readOnly: false, notice: null });
  });

  it("laisse lire un accompagnement suspendu ou en restitution", () => {
    for (const status of ["suspendu", "restitution"] as const) {
      const decision = accessDecision(status);
      expect(decision.allowed).toBe(true);
      expect(decision.readOnly).toBe(true);
      expect(decision.notice).toBeTruthy();
    }
  });

  it("ferme la porte sur un accompagnement clos", () => {
    // C'est le seul état qui refuse : sans lui, clore un accompagnement
    // laisserait les sessions ouvertes courir jusqu'à leur échéance.
    expect(accessDecision("clos").allowed).toBe(false);
  });
});
