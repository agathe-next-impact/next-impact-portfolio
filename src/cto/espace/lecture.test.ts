import { describe, expect, it } from "vitest";
import type { Block } from "../notion/blocks";
import { chapitresDuCorps, ordreDeLecture, resume } from "./lecture";

const h1 = (t: string): Block => ({ k: "h1", s: [{ t }] });
const p = (t: string): Block => ({ k: "p", s: [{ t }] });
const tableau = (lignes: number): Block => ({
  k: "table",
  head: null,
  rows: Array.from({ length: lignes }, () => [[{ t: "x" }]]),
});

describe("ordre de lecture d'une proposition", () => {
  it("découpe le corps à chaque grand titre, le cadrage en préambule", () => {
    const { preambule, chapitres } = chapitresDuCorps([p("cadrage"), h1("Plan"), p("a"), h1("Synthèse"), p("b")]);
    expect(preambule).toHaveLength(1);
    expect(chapitres.map((c) => [c.titre, c.blocs.length])).toEqual([
      ["Plan", 1],
      ["Synthèse", 1],
    ]);
  });

  it("reconnaît ce qui résume", () => {
    expect(resume("2. Synthèse comparative")).toBe(true);
    expect(resume("Recommandation technique")).toBe(true);
    expect(resume("Chiffrage en heures des deux scénarios")).toBe(true);
    expect(resume("Total")).toBe(true);
    expect(resume("Architecture et contenu du site")).toBe(false);
    expect(resume("Totalement autre chose")).toBe(false);
  });

  it("met la synthèse en tête et replie le détail d'un document long", () => {
    // Un seul bloc, mais un tableau de 30 lignes : le document est long.
    const corps = [h1("1. Plan d'action détaillé"), tableau(30), h1("2. Synthèse comparative"), tableau(3)];
    const { ouverts, replies } = ordreDeLecture(corps);
    expect(ouverts.map((c) => c.titre)).toEqual(["2. Synthèse comparative"]);
    expect(replies.map((c) => c.titre)).toEqual(["1. Plan d'action détaillé"]);
  });

  it("laisse un document court ouvert, dans son ordre", () => {
    const corps = [h1("Objet"), p("a"), h1("Détail chiffré"), tableau(7), h1("Total"), p("3 400 €")];
    const { ouverts, replies } = ordreDeLecture(corps);
    expect(ouverts.map((c) => c.titre)).toEqual(["Objet", "Détail chiffré", "Total"]);
    expect(replies).toEqual([]);
  });
});
