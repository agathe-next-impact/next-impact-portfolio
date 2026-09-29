import { describe, expect, it } from "vitest";
import { adoptables, adoptionKey } from "./persons";

// Ce que ces tests protègent : une même adresse peut porter plusieurs
// personnes (décision du 2026-09-29), et l'adoption par adresse d'un accès sans
// page ne franchit JAMAIS la frontière d'un accompagnement — sans quoi une
// ligne Notion ouvrirait les données d'une autre entreprise.

const acces = (
  id: string,
  clientId: string,
  email: string,
  notionPageId: string | null = null,
  revokedAt: Date | null = null,
) => ({ id, clientId, email, notionPageId, revokedAt });

describe("accès adoptables par adresse", () => {
  it("n'adopte pas un accès dont la ligne est toujours là", () => {
    const reserve = adoptables([acces("a", "c1", "x@exemple.fr", "page-a")], new Set(["page-a"]));
    expect(reserve.get(adoptionKey("c1", "x@exemple.fr"))).toBeUndefined();
  });

  it("propose un accès sans page, et un accès dont la ligne a disparu", () => {
    const reserve = adoptables(
      [acces("invite", "c1", "x@exemple.fr"), acces("orphelin", "c1", "y@exemple.fr", "supprimee")],
      new Set(),
    );
    expect(reserve.get(adoptionKey("c1", "x@exemple.fr"))).toEqual(["invite"]);
    expect(reserve.get(adoptionKey("c1", "y@exemple.fr"))).toEqual(["orphelin"]);
  });

  it("sépare la même adresse chez deux clients", () => {
    const reserve = adoptables(
      [acces("chez-1", "c1", "x@exemple.fr"), acces("chez-2", "c2", "x@exemple.fr")],
      new Set(),
    );
    expect(reserve.get(adoptionKey("c1", "x@exemple.fr"))).toEqual(["chez-1"]);
    expect(reserve.get(adoptionKey("c2", "x@exemple.fr"))).toEqual(["chez-2"]);
  });

  it("ignore la casse et les espaces de l'adresse", () => {
    const reserve = adoptables([acces("a", "c1", "X@Exemple.fr")], new Set());
    expect(reserve.get(adoptionKey("c1", " x@exemple.fr "))).toEqual(["a"]);
  });

  it("propose l'accès encore ouvert avant l'accès révoqué", () => {
    const reserve = adoptables(
      [acces("revoque", "c1", "x@exemple.fr", null, new Date()), acces("vivant", "c1", "x@exemple.fr")],
      new Set(),
    );
    expect(reserve.get(adoptionKey("c1", "x@exemple.fr"))).toEqual(["vivant", "revoque"]);
  });
});
