import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { EXPORT_AXES, SentinelleExportSchema } from "./contract";

// L'exemple publié dans `docs/contrats/` est lu par les DEUX côtés : Sentinelle
// ici, l'espace client dans `src/cto/sentinelle/contract.test.ts`. Aucun ne
// l'importe comme du code ; tous deux doivent l'accepter.
const exemple = JSON.parse(readFileSync("docs/contrats/sentinelle-export.v1.json", "utf8"));

describe("contrat de l'export Sentinelle", () => {
  it("accepte l'exemple publié", () => {
    expect(SentinelleExportSchema.safeParse(exemple).success).toBe(true);
  });

  it("publie les douze axes dans l'ordre de la lettre", () => {
    expect(exemple.axes).toEqual([...EXPORT_AXES]);
  });
});
