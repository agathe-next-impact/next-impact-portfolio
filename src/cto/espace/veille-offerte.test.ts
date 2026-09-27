import { describe, expect, it } from "vitest";
import { veilleOfferte } from "./veille-offerte";

const ouverture = new Date("2026-09-01T09:00:00Z");

describe("veille offerte", () => {
  it("ne s'arrête pas pour un client récurrent", () => {
    for (const services of [["direction-technique"], ["actions", "audit"], ["suivi-technique"], ["veille-personnalisee"]]) {
      const veille = veilleOfferte(services, ouverture, new Date("2027-06-01T00:00:00Z"));
      expect(veille).toEqual({ recurrente: true, jusquau: null, active: true });
    }
  });

  it("dure un mois après l'ouverture de l'espace pour un client ponctuel", () => {
    for (const services of [["audit"], ["prestations"], []]) {
      expect(veilleOfferte(services, ouverture, new Date("2026-09-20T00:00:00Z")).active).toBe(true);
      const apres = veilleOfferte(services, ouverture, new Date("2026-10-02T00:00:00Z"));
      expect(apres.active).toBe(false);
      expect(apres.jusquau?.toISOString()).toBe("2026-10-01T09:00:00.000Z");
    }
  });

  it("ne coupe pas la veille d'un accompagnement antérieur à la règle (services jamais renseignés)", () => {
    expect(veilleOfferte(null, ouverture, new Date("2027-01-01T00:00:00Z")).active).toBe(true);
  });
});
