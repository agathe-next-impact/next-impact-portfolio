import { describe, expect, it } from "vitest";
import {
  compareVersions,
  isAffected,
  isVersionInRange,
  parseRange,
  parseVersion,
} from "./versions";

describe("parseVersion", () => {
  it("découpe les segments numériques", () => {
    expect(parseVersion("2.8.4.1")).toEqual({ release: [2, 8, 4, 1], prerelease: [] });
  });

  it("accepte un préfixe v et des espaces", () => {
    expect(parseVersion("  v6.7  ")).toEqual({ release: [6, 7], prerelease: [] });
  });

  it("ignore les métadonnées de build", () => {
    expect(parseVersion("1.2.3+20260815")).toEqual({ release: [1, 2, 3], prerelease: [] });
  });

  it("isole la pré-version, avec ou sans séparateur", () => {
    expect(parseVersion("1.0-beta")).toEqual({ release: [1, 0], prerelease: ["beta"] });
    expect(parseVersion("2.0RC1")).toEqual({ release: [2, 0], prerelease: ["rc", 1] });
    expect(parseVersion("1.2.3b")).toEqual({ release: [1, 2, 3], prerelease: ["b"] });
  });

  it("refuse ce qui n'est pas une version", () => {
    for (const input of ["", "   ", "latest", "trunk", "n/a", "-1.0", null, undefined]) {
      expect(parseVersion(input as string)).toBeNull();
    }
  });
});

describe("compareVersions", () => {
  it("compare numériquement, pas lexicalement", () => {
    // Le bug classique : "20" < "3" en lexical.
    expect(compareVersions("6.6.20", "6.6.3")).toBe(1);
    expect(compareVersions("1.10.0", "1.9.0")).toBe(1);
    expect(compareVersions("2.0", "10.0")).toBe(-1);
  });

  it("complète les segments manquants par des zéros", () => {
    expect(compareVersions("1.0", "1.0.0")).toBe(0);
    expect(compareVersions("1.0.0.0", "1")).toBe(0);
    expect(compareVersions("2.8.4.1", "2.8.4")).toBe(1);
  });

  it("place une pré-version sous la version finale", () => {
    expect(compareVersions("1.0-beta", "1.0")).toBe(-1);
    expect(compareVersions("6.7", "6.7-rc1")).toBe(1);
  });

  it("ordonne les pré-versions numériquement", () => {
    expect(compareVersions("1.0-beta2", "1.0-beta10")).toBe(-1);
    expect(compareVersions("1.0-alpha", "1.0-beta")).toBe(-1);
    expect(compareVersions("1.0-rc.1", "1.0-rc.2")).toBe(-1);
    // Identifiant plus court d'abord, à préfixe égal.
    expect(compareVersions("1.0-beta", "1.0-beta.1")).toBe(-1);
    // Un identifiant numérique passe avant un alphanumérique.
    expect(compareVersions("1.0-1", "1.0-alpha")).toBe(-1);
  });

  it("est symétrique et réflexive", () => {
    expect(compareVersions("3.1.4", "3.1.4")).toBe(0);
    expect(compareVersions("1.2.3", "1.2.4")).toBe(-1);
    expect(compareVersions("1.2.4", "1.2.3")).toBe(1);
  });

  it("renvoie null — et non 0 — sur une entrée inexploitable", () => {
    expect(compareVersions("latest", "1.0")).toBeNull();
    expect(compareVersions("1.0", null)).toBeNull();
    expect(compareVersions(undefined, undefined)).toBeNull();
  });
});

describe("parseRange", () => {
  it("lit un opérateur simple, avec ou sans espace", () => {
    expect(parseRange("< 6.7")).toEqual([{ operator: "<", version: "6.7" }]);
    expect(parseRange("<=6.6.20")).toEqual([{ operator: "<=", version: "6.6.20" }]);
  });

  it("lit une conjonction, quel que soit le séparateur", () => {
    const expected = [
      { operator: ">=", version: "2.0" },
      { operator: "<", version: "2.4" },
    ];
    expect(parseRange(">= 2.0 < 2.4")).toEqual(expected);
    expect(parseRange(">=2.0,<2.4")).toEqual(expected);
    expect(parseRange(">=2.0 && <2.4")).toEqual(expected);
  });

  it("traite une version nue comme une égalité", () => {
    expect(parseRange("1.2.3")).toEqual([{ operator: "=", version: "1.2.3" }]);
    expect(parseRange("== 1.2.3")).toEqual([{ operator: "=", version: "1.2.3" }]);
  });

  it("renvoie un tableau vide pour une plage universelle", () => {
    expect(parseRange("*")).toEqual([]);
    expect(parseRange("all")).toEqual([]);
  });

  it("renvoie null sur ce qu'il ne sait pas lire", () => {
    for (const input of [
      "",
      "   ",
      "toutes les versions",
      "< 6.0 || > 7.0", // disjonction non gérée
      "6.0 - 6.4", // plage à tiret non gérée
      "< abc",
      "<",
      null,
      undefined,
    ]) {
      expect(parseRange(input as string)).toBeNull();
    }
  });
});

describe("isVersionInRange", () => {
  it("répond vrai dans la plage", () => {
    expect(isVersionInRange("6.6.20", "< 6.7")).toBe(true);
    expect(isVersionInRange("2.2", ">= 2.0 < 2.4")).toBe(true);
    expect(isVersionInRange("2.0", ">= 2.0 < 2.4")).toBe(true);
  });

  it("répond faux hors plage, bornes comprises", () => {
    expect(isVersionInRange("6.7", "< 6.7")).toBe(false);
    expect(isVersionInRange("2.4", ">= 2.0 < 2.4")).toBe(false);
    expect(isVersionInRange("1.9", ">= 2.0 < 2.4")).toBe(false);
  });

  it("répond faux si la version est inconnue", () => {
    expect(isVersionInRange(null, "< 6.7")).toBe(false);
    expect(isVersionInRange("", "< 6.7")).toBe(false);
    expect(isVersionInRange("latest", "< 6.7")).toBe(false);
  });

  it("répond faux si la plage est illisible", () => {
    expect(isVersionInRange("6.6", "toutes")).toBe(false);
    expect(isVersionInRange("6.6", null)).toBe(false);
  });

  it("gère une plage universelle", () => {
    expect(isVersionInRange("6.6", "*")).toBe(true);
    expect(isVersionInRange(null, "*")).toBe(false);
  });
});

describe("isAffected", () => {
  it("utilise la plage quand elle existe", () => {
    expect(isAffected({ version: "6.6.20", affectedRange: "< 6.7" })).toBe(true);
    expect(isAffected({ version: "6.7.1", affectedRange: "< 6.7" })).toBe(false);
  });

  it("déduit « < fixedIn » à défaut de plage", () => {
    expect(isAffected({ version: "1.4.9", affectedRange: null, fixedIn: "1.5.0" })).toBe(true);
    expect(isAffected({ version: "1.5.0", affectedRange: null, fixedIn: "1.5.0" })).toBe(false);
  });

  it("préfère la plage explicite à fixedIn", () => {
    // Plage lisible : fixedIn n'est pas consulté.
    expect(
      isAffected({ version: "3.0", affectedRange: ">= 1.0 < 2.0", fixedIn: "9.9" }),
    ).toBe(false);
  });

  it("retombe sur fixedIn quand la plage est illisible", () => {
    expect(
      isAffected({ version: "1.4.9", affectedRange: "6.0 - 6.4", fixedIn: "1.5.0" }),
    ).toBe(true);
  });

  it("n'alerte pas sans version connue", () => {
    expect(isAffected({ version: null, affectedRange: "< 6.7" })).toBe(false);
    expect(isAffected({ version: null, affectedRange: "*", fixedIn: "1.0" })).toBe(false);
  });

  it("n'alerte pas quand la source ne dit rien d'exploitable", () => {
    expect(isAffected({ version: "1.0", affectedRange: null })).toBe(false);
    expect(isAffected({ version: "1.0", affectedRange: null, fixedIn: null })).toBe(false);
    expect(isAffected({ version: "1.0", affectedRange: "n/a", fixedIn: "n/a" })).toBe(false);
  });
});
