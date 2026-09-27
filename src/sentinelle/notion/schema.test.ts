import { describe, expect, it } from "vitest";
import { alertKey, statusFromLabel, STATUS_LABEL, verdictFromLabel, VERDICT_LABEL } from "./schema";

describe("statusFromLabel", () => {
  it("relit chaque libellé français vers son statut", () => {
    expect(statusFromLabel("Brouillon")).toBe("draft");
    expect(statusFromLabel("Validée")).toBe("validated");
    expect(statusFromLabel("Envoyée")).toBe("sent");
    expect(statusFromLabel("Ecartée")).toBe("dismissed");
  });

  it("retombe sur brouillon pour un select vide ou méconnu", () => {
    // Un select vide est le cas normal juste après la création de la page.
    expect(statusFromLabel(null)).toBe("draft");
    expect(statusFromLabel("Renommé par erreur")).toBe("draft");
  });

  it("couvre les quatre statuts écrits par le produit", () => {
    expect(Object.keys(STATUS_LABEL).sort()).toEqual(["dismissed", "draft", "sent", "validated"]);
  });
});

describe("verdictFromLabel", () => {
  it("relit chaque libellé français vers son verdict", () => {
    expect(verdictFromLabel("Rouge")).toBe("red");
    expect(verdictFromLabel("Orange")).toBe("orange");
    expect(verdictFromLabel("Vert")).toBe("green");
    expect(verdictFromLabel("Info")).toBe("info");
  });

  it("rend null pour un select vide ou méconnu — jamais un verdict par défaut", () => {
    // Contrairement au statut, il n'y a pas de valeur de repli sûre : un
    // verdict est une affirmation, pas un état d'avancement.
    expect(verdictFromLabel(null)).toBeNull();
    expect(verdictFromLabel("Jaune")).toBeNull();
  });

  it("couvre les quatre verdicts du produit", () => {
    expect(Object.keys(VERDICT_LABEL).sort()).toEqual(["green", "info", "orange", "red"]);
  });
});

describe("alertKey", () => {
  it("est stable pour la même paire client/fait", () => {
    expect(alertKey("client-1", "intel-1")).toBe(alertKey("client-1", "intel-1"));
  });

  it("distingue deux clients sur le même fait", () => {
    expect(alertKey("client-1", "intel-1")).not.toBe(alertKey("client-2", "intel-1"));
  });
});
