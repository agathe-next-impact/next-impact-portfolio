import { describe, expect, it } from "vitest";
import { isAffected } from "@sentinelle/matching";
import { intelFromProduct, nextBranch } from "./endoflife";

// Extrait réel de https://endoflife.date/api/v1/products/php, réduit à trois
// branches : une maintenue, une en support de sécurité, une hors support.
const PHP = {
  schema_version: "1.2.1",
  result: {
    name: "php",
    label: "PHP",
    releases: [
      {
        name: "8.4",
        label: "8.4",
        releaseDate: "2024-11-21",
        isEol: false,
        eolFrom: "2028-12-31",
        isMaintained: true,
        latest: { name: "8.4.24", date: "2026-07-30" },
      },
      {
        name: "8.1",
        label: "8.1",
        releaseDate: "2021-11-25",
        isEol: false,
        eolFrom: "2025-12-31",
        isMaintained: true,
        latest: { name: "8.1.32", date: "2025-03-13" },
      },
      {
        name: "7.4",
        label: "7.4",
        releaseDate: "2019-11-28",
        isEol: true,
        eolFrom: "2022-11-28",
        isMaintained: false,
        latest: { name: "7.4.33", date: "2022-11-03" },
      },
    ],
  },
};

const MAINTENANT = new Date("2026-08-15T00:00:00.000Z");

function intel(kind: "eol" | "release", branch: string) {
  return intelFromProduct(PHP, MAINTENANT).find(
    (item) => item.kind === kind && item.externalId === `php:${branch}:${kind}`,
  );
}

describe("bornage des branches", () => {
  it("incrémente le dernier segment", () => {
    expect(nextBranch("8.1")).toBe("8.2");
    expect(nextBranch("10")).toBe("11");
    expect(nextBranch("6.4.2")).toBe("6.4.3");
    expect(nextBranch("v3.2")).toBe("3.3");
  });

  it("refuse une branche non numérique plutôt que de deviner une borne", () => {
    // Sans borne haute fiable, la plage déborderait sur des versions saines.
    expect(nextBranch("lts")).toBeNull();
    expect(nextBranch("stable")).toBeNull();
  });
});

describe("faits produits depuis endoflife.date", () => {
  it("produit une fin de support et une dernière version par branche", () => {
    const items = intelFromProduct(PHP, MAINTENANT);

    expect(items.filter((item) => item.kind === "eol")).toHaveLength(3);
    expect(items.filter((item) => item.kind === "release")).toHaveLength(3);
    // Identité canonique reprise du catalogue d'empreintes, sans quoi le
    // matching ne rattacherait jamais le fait à un stack.
    expect(items[0]).toMatchObject({
      source: "endoflife.date",
      targetSlug: "php",
      targetType: "runtime",
      targetEcosystem: "endoflife",
    });
  });

  it("distingue une fin de support passée d'une fin de support annoncée", () => {
    expect(intel("eol", "7.4")?.title).toContain("n'est plus corrigé depuis");
    expect(intel("eol", "8.4")?.title).toContain("cesse d'être corrigé le");
  });

  it("borne la fin de support à la branche concernée", () => {
    const eol74 = intel("eol", "7.4");
    expect(eol74?.affectedRange).toBe(">= 7.4 < 7.5");

    // C'est ce qui permet au matching de traiter une fin de support exactement
    // comme une faille : même comparaison de plage, même prudence.
    expect(isAffected({ version: "7.4.33", affectedRange: eol74?.affectedRange })).toBe(true);
    expect(isAffected({ version: "8.1.32", affectedRange: eol74?.affectedRange })).toBe(false);
    expect(isAffected({ version: "7.3.9", affectedRange: eol74?.affectedRange })).toBe(false);
  });

  it("propose la branche maintenue la plus récente comme issue", () => {
    expect(intel("eol", "7.4")?.fixedIn).toBe("8.4.24");
  });

  it("n'affecte, pour une nouvelle version, que les versions en retard de la même branche", () => {
    const release = intel("release", "8.1");
    expect(release?.affectedRange).toBe(">= 8.1 < 8.1.32");
    expect(release?.fixedIn).toBe("8.1.32");

    expect(isAffected({ version: "8.1.10", affectedRange: release?.affectedRange })).toBe(true);
    expect(isAffected({ version: "8.1.32", affectedRange: release?.affectedRange })).toBe(false);
    // Un client sur 8.4 n'a pas à recevoir la mise à jour de la branche 8.1.
    expect(isAffected({ version: "8.4.24", affectedRange: release?.affectedRange })).toBe(false);
  });

  it("ne produit rien d'une réponse illisible plutôt que de lever", () => {
    expect(intelFromProduct({ resultat: "autre chose" }, MAINTENANT)).toEqual([]);
    expect(intelFromProduct(null, MAINTENANT)).toEqual([]);
  });
});
