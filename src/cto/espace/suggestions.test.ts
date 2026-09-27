import { describe, expect, it } from "vitest";
import { prochaineEtape, type FaitsEspace } from "./suggestions";

const maintenant = new Date("2026-09-27T08:00:00Z");
const BASE: FaitsEspace = {
  status: "actif",
  tier: "direction",
  services: ["direction-technique", "actions"],
  suggestionsCoupees: false,
  suiviInclusJusquau: null,
  propositionsEnAttente: [],
  audits: 0,
  arbitrages: 0,
  alertesCritiques: 0,
  masquees: {},
  maintenant,
};
const id = (f: Partial<FaitsEspace>) => prochaineEtape({ ...BASE, ...f })?.id ?? null;

describe("prochaine étape", () => {
  it("ne suggère rien sans fait déclencheur", () => {
    expect(id({})).toBeNull();
  });

  it("fait passer une proposition en attente avant tout, et ne la laisse pas masquer", () => {
    const f = {
      propositionsEnAttente: [{ titre: "Refonte", chemin: "propositions/x" }],
      alertesCritiques: 3,
      services: [],
      masquees: { proposition: maintenant.toISOString() },
    };
    expect(id(f)).toBe("proposition");
  });

  it("annonce la fin des mois de suivi inclus trente jours avant, pas plus tôt, pas après", () => {
    expect(id({ suiviInclusJusquau: new Date("2026-10-20T00:00:00Z") })).toBe("suivi-inclus-2026-10-20");
    expect(id({ suiviInclusJusquau: new Date("2026-12-20T00:00:00Z") })).toBeNull();
    expect(id({ suiviInclusJusquau: new Date("2026-09-01T00:00:00Z") })).toBeNull();
  });

  it("propose le suivi sur des failles, seulement à qui ne l'a pas", () => {
    expect(id({ alertesCritiques: 2 })).toBe("suivi-alertes");
    expect(id({ alertesCritiques: 2, services: ["suivi-technique"] })).toBeNull();
  });

  it("propose le pilotage après un audit, seulement sans suivi des actions", () => {
    expect(id({ audits: 1, services: ["audit"], tier: "audit" })).toBe("audit-pilotage");
    expect(id({ audits: 1 })).toBeNull();
  });

  it("propose Direction technique à un Référent débordé d'arbitrages", () => {
    expect(id({ tier: "referent", arbitrages: 3 })).toBe("palier-direction");
    expect(id({ tier: "referent", arbitrages: 2 })).toBeNull();
    expect(id({ tier: "direction", arbitrages: 5 })).toBeNull();
  });

  it("respecte « Pas maintenant » soixante jours, puis passe à la suggestion suivante", () => {
    const f = { alertesCritiques: 1, audits: 1, services: ["audit"] };
    expect(id({ ...f, masquees: { "suivi-alertes": "2026-09-01T00:00:00Z" } })).toBe("audit-pilotage");
    expect(id({ ...f, masquees: { "suivi-alertes": "2026-06-01T00:00:00Z" } })).toBe("suivi-alertes");
  });

  it("se tait pour un accompagnement non actif ou aux suggestions coupées", () => {
    const f = { alertesCritiques: 2 };
    expect(id({ ...f, status: "suspendu" })).toBeNull();
    expect(id({ ...f, status: "restitution" })).toBeNull();
    expect(id({ ...f, suggestionsCoupees: true })).toBeNull();
  });
});
