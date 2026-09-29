import { describe, expect, it } from "vitest";
import { accesPortes, adoptables, adoptionKey, attendusDe, type Attendus } from "./persons";

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
    const reserve = adoptables([acces("a", "c1", "x@exemple.fr", "page-a")], new Set(["a"]));
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

// Une ligne rattachée à plusieurs clients porte un accès par client (décision
// du 2026-09-29) ; retirer un client de la relation ferme SON accès seulement.
describe("accès portés par une ligne à plusieurs clients", () => {
  const byNotionPage = new Map([
    ["fiche-heritech", "heritech"],
    ["fiche-suneido", "suneido"],
  ]);

  it("résout chaque client de la relation", () => {
    const ligne = attendusDe(["fiche-heritech", "fiche-suneido"], byNotionPage);
    expect([...ligne.clients]).toEqual(["heritech", "suneido"]);
    expect(ligne.complet).toBe(true);
  });

  it("porte les deux accès d'une ligne à deux clients", () => {
    const attendus: Attendus = new Map([["page-s", attendusDe(["fiche-heritech", "fiche-suneido"], byNotionPage)]]);
    const portes = accesPortes(
      [acces("s-h", "heritech", "s@exemple.fr", "page-s"), acces("s-s", "suneido", "s@exemple.fr", "page-s")],
      attendus,
    );
    expect(portes).toEqual(new Set(["s-h", "s-s"]));
  });

  it("ne porte plus l'accès d'un client retiré de la relation", () => {
    const attendus: Attendus = new Map([["page-s", attendusDe(["fiche-heritech"], byNotionPage)]]);
    const portes = accesPortes(
      [acces("s-h", "heritech", "s@exemple.fr", "page-s"), acces("s-s", "suneido", "s@exemple.fr", "page-s")],
      attendus,
    );
    expect(portes).toEqual(new Set(["s-h"]));
  });

  it("ne ferme rien tant qu'un client de la ligne n'est pas résoluble", () => {
    const attendus: Attendus = new Map([["page-s", attendusDe(["fiche-heritech", "fiche-en-preparation"], byNotionPage)]]);
    const portes = accesPortes([acces("s-s", "suneido", "s@exemple.fr", "page-s")], attendus);
    expect(portes).toEqual(new Set(["s-s"]));
  });

  it("ne ferme rien sur une relation vide, erreur de saisie signalée", () => {
    const attendus: Attendus = new Map([["page-s", attendusDe([], byNotionPage)]]);
    const portes = accesPortes([acces("s-h", "heritech", "s@exemple.fr", "page-s")], attendus);
    expect(portes).toEqual(new Set(["s-h"]));
  });

  it("ne porte plus l'accès d'une ligne disparue, ni celui créé sans page", () => {
    const portes = accesPortes(
      [acces("orphelin", "heritech", "s@exemple.fr", "supprimee"), acces("invite", "heritech", "s@exemple.fr")],
      new Map(),
    );
    expect(portes.size).toBe(0);
  });
});
