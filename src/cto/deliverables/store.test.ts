import { describe, expect, it } from "vitest";
import { digestOf } from "./store";
import type { DecisionPayload } from "./types";

// L'empreinte est le seul rempart contre l'inflation de l'historique : sans
// elle, un balayage quotidien écrirait une version par jour et par livrable, et
// l'archive qui doit prouver « ce qui était écrit en mars » deviendrait
// illisible. Ces tests fixent donc ce qui compte comme un changement.

const payload: DecisionPayload = {
  nature: "arbitrage",
  motif: "Le budget refonte tombe sur l'exercice suivant.",
  optionEcartee: "Refonte headless immédiate.",
  portee: ["Budget", "Infrastructure"],
};

const base = {
  title: "Rester sur WordPress un an de plus",
  occurredAt: new Date("2026-03-12T00:00:00.000Z"),
  payload,
};

describe("digestOf", () => {
  it("rend la même empreinte pour un contenu identique", () => {
    expect(digestOf(base)).toBe(digestOf({ ...base, payload: { ...payload } }));
  });

  it("ignore l'ordre des propriétés rendues par Notion", () => {
    const reordonne: DecisionPayload = {
      portee: ["Budget", "Infrastructure"],
      optionEcartee: "Refonte headless immédiate.",
      motif: "Le budget refonte tombe sur l'exercice suivant.",
      nature: "arbitrage",
    };
    expect(digestOf({ ...base, payload: reordonne })).toBe(digestOf(base));
  });

  it("change dès que le titre change", () => {
    expect(digestOf({ ...base, title: "Rester sur WordPress" })).not.toBe(digestOf(base));
  });

  it("change dès que la date du comité change", () => {
    const veille = new Date("2026-03-11T00:00:00.000Z");
    expect(digestOf({ ...base, occurredAt: veille })).not.toBe(digestOf(base));
  });

  it("change dès qu'un champ du contenu change", () => {
    const corrige = { ...payload, motif: "Le budget refonte tombe en 2027." };
    expect(digestOf({ ...base, payload: corrige })).not.toBe(digestOf(base));
  });

  it("distingue un ordre de portée différent", () => {
    // L'ordre des étiquettes est celui de l'atelier et se voit dans l'espace :
    // le trier ici masquerait une modification visible du client.
    const inverse = { ...payload, portee: ["Infrastructure", "Budget"] };
    expect(digestOf({ ...base, payload: inverse })).not.toBe(digestOf(base));
  });

  it("distingue une date absente d'une date posée", () => {
    expect(digestOf({ ...base, occurredAt: null })).not.toBe(digestOf(base));
  });
});
