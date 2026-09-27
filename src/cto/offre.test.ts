import { describe, expect, it } from "vitest";
import { apportsDirection, finEngagement, nomPalier, palierSuperieur } from "./offre";

describe("l'offre vue de l'espace client", () => {
  it("nomme les paliers comme la page publique", () => {
    expect(nomPalier("referent")).toBe("Référent");
    expect(nomPalier("direction")).toBe("Direction technique");
    expect(nomPalier("inconnu")).toBe("inconnu");
  });

  it("propose l'étape d'après : Référent après l'audit, Direction technique après le Référent", () => {
    expect(palierSuperieur("audit")).toBe("referent");
    expect(palierSuperieur("referent")).toBe("direction");
    expect(palierSuperieur("direction")).toBeNull();
  });

  it("ne retient du comparatif que ce qui diffère, et jamais un prix", () => {
    const apports = apportsDirection();
    expect(apports.length).toBeGreaterThan(3);
    expect(apports.some((a) => a.critere === "Espace en ligne")).toBe(false);
    for (const a of apports) expect(`${a.referent} ${a.direction}`).not.toMatch(/€/);
  });

  it("fixe la fin d'engagement six mois après le début du contrat", () => {
    expect(finEngagement(new Date("2026-09-01T00:00:00Z")).toISOString().slice(0, 10)).toBe("2027-03-01");
  });
});
