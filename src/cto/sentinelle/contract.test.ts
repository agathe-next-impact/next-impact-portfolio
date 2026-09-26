import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { SentinelleExportSchema } from "./contract";

// Même exemple que côté Sentinelle (`src/sentinelle/export/contract.test.ts`) :
// si les deux schémas divergent, l'un des deux tests tombe.
const exemple = JSON.parse(readFileSync("docs/contrats/sentinelle-export.v1.json", "utf8"));

describe("lecture de l'export Sentinelle", () => {
  it("accepte l'exemple publié par Sentinelle", () => {
    expect(SentinelleExportSchema.safeParse(exemple).success).toBe(true);
  });

  it("refuse une version qu'il ne connaît pas", () => {
    expect(SentinelleExportSchema.safeParse({ ...exemple, version: 2 }).success).toBe(false);
  });
});
