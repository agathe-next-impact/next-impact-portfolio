import { describe, expect, it } from "vitest";
import { appliquerRetouches, retouchesDuFormulaire } from "./edit";
import { LINE_CHARS, type DigestContent } from "./types";

const ligne = (text: string) => ({ text, tone: "info" as const, tag: "Alerte", ref: "A-1" });
const content: DigestContent = {
  version: 1,
  week: "2026-W39",
  sentinelle: {
    lines: [ligne("Première"), ligne("Deuxième")],
    overflow: 0,
    letterKey: null,
    stats: { components: 5, withoutVersion: 1, alerts: 2, critiques: 0, attention: 1 },
  },
};
const now = new Date("2026-09-28T10:00:00Z");

describe("retouche d'un digest", () => {
  it("réécrit le texte, garde ton, étiquette et référence, et marque la retouche", () => {
    const out = appliquerRetouches(content, { sentinelle: ["  Première   revue ", "Deuxième"] }, now);
    expect(out.sentinelle?.lines[0]).toEqual({ ...ligne("Première revue") });
    expect(out.modifieLe).toBe(now.toISOString());
  });

  it("retire une ligne vidée", () => {
    const out = appliquerRetouches(content, { sentinelle: ["", "Deuxième"] }, now);
    expect(out.sentinelle?.lines.map((l) => l.text)).toEqual(["Deuxième"]);
  });

  it(`borne une ligne à ${LINE_CHARS} caractères`, () => {
    const out = appliquerRetouches(content, { sentinelle: ["x".repeat(300), "Deuxième"] }, now);
    expect(out.sentinelle?.lines[0].text).toHaveLength(LINE_CHARS);
  });

  it("lit le formulaire, et garde le texte d'origine d'un champ absent", () => {
    const champs: Record<string, string> = { "sentinelle.1": "Retouchée" };
    expect(retouchesDuFormulaire(content, (nom) => champs[nom] ?? null)).toEqual({
      sentinelle: ["Première", "Retouchée"],
    });
  });
});
