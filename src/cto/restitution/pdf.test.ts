import { describe, expect, it } from "vitest";
import { clean, renderRestitutionPdf } from "./pdf";
import type { RestitutionData } from "./collect";

describe("dossier de restitution", () => {
  it("ramène le texte au jeu des polices standard sans perdre le français", () => {
    expect(clean("Échéance → 15 € — « délai » ≥ 3 jours")).toBe("Échéance -> 15 € — « délai » >= 3 jours");
    expect(clean("Émoji 🚀 retiré")).toBe("Émoji  retiré");
    expect(clean(null)).toBe("");
  });

  it("produit un PDF lisible, même pour un espace vide", () => {
    const data: RestitutionData = {
      company: "L'Hermitage",
      tier: "direction",
      generatedAt: new Date("2026-09-25T10:00:00Z"),
      items: [
        {
          id: "1",
          clientId: "c",
          notionPageId: "p1",
          kind: "decision",
          version: 2,
          title: "Migrer l'hébergement",
          payload: { nature: "arbitrage", motif: "Coût → divisé par 2", optionEcartee: null, portee: [] },
          occurredAt: new Date("2026-09-10"),
          recordedAt: new Date("2026-09-12"),
          featured: true,
        },
      ],
      corrections: [],
      letters: [],
      reports: [],
    };
    const pdf = renderRestitutionPdf(data);
    expect(new TextDecoder().decode(pdf.slice(0, 5))).toBe("%PDF-");
    expect(pdf.byteLength).toBeGreaterThan(2000);
  });
});
