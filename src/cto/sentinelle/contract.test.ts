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

import { redirectError } from "./api";

describe("redirectError", () => {
  it("nomme une redirection au lieu de la laisser passer pour un refus d'accès", () => {
    const response = new Response(null, { status: 308, headers: { location: "https://next-impact.digital/x" } });
    expect(redirectError(response, "http://next-impact.digital")?.message).toMatch(/redirige vers https:\/\/next-impact\.digital\/x/);
  });

  it("ne dit rien d'une réponse directe", () => {
    expect(redirectError(new Response(null, { status: 401 }), "https://www.next-impact.digital")).toBeNull();
  });
});
