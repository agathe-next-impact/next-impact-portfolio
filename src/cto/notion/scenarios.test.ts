import { describe, expect, it } from "vitest";
import type { Block, Span } from "./blocks";
import { isScenarioProposition, scenarioPropositions, type AuditValide } from "./scenarios";

// Ce que ces tests protègent : le passage d'un audit validé à ses propositions.
// Un scénario oublié prive le client d'un choix ; un identifiant instable
// retirerait et republierait la proposition à chaque retouche du chiffrage.

const cell = (t: string): Span[] => (t ? [{ t }] : []);
const row = (...cells: string[]) => cells.map(cell);

const tableau: Block = {
  k: "table",
  title: "Scénarios",
  head: row("Scénario", "Statut", "Coût", "Délai", "Réponse client"),
  rows: [
    row("1. Optimisation", "Retenu", "2 500", "3 semaines", ""),
    row("2. Refonte headless", "Écarté", "15 700", "3 mois", "Acceptée"),
  ],
};

function audit(synthese: Block[], sections: AuditValide["sections"] = []): AuditValide {
  return {
    notionPageId: "1b34b0bf-ee9c-4b8c-819f-000000000009",
    clientId: "3f7c1a2e-0000-4000-8000-000000000001",
    title: "Audit technique Institut",
    occurredAt: new Date("2026-09-20"),
    synthese,
    sections,
  };
}

describe("propositions issues des scénarios d'un audit", () => {
  it("donne une proposition par scénario, écartés compris", () => {
    const out = scenarioPropositions(audit([{ k: "p", s: cell("Synthèse") }, tableau]));
    expect(out.map((p) => p.title)).toEqual([
      "Optimisation · Audit technique Institut",
      "Refonte headless · Audit technique Institut",
    ]);
    expect(out.every((p) => p.kind === "proposition" && isScenarioProposition(p.notionPageId))).toBe(true);
  });

  it("dérive un identifiant stable du nom, pas des chiffres", () => {
    const avant = scenarioPropositions(audit([tableau]));
    const retouche: Block = { ...tableau, rows: [row("1. Optimisation", "Retenu", "3 000", "1 mois", "")] } as Block;
    const apres = scenarioPropositions(audit([retouche]));
    expect(apres[0].notionPageId).toBe(avant[0].notionPageId);
    expect(avant[0].notionPageId).toBe("scenario-1b34b0bf-ee9c-4b8c-819f-000000000009-optimisation");
  });

  it("lit la réponse du client, et la laisse en attente sinon", () => {
    const [optimisation, refonte] = scenarioPropositions(audit([tableau]));
    expect(optimisation.payload.statut).toBeNull();
    expect(refonte.payload.statut).toBe("Acceptée");
  });

  it("reprend la ligne sous les mêmes en-têtes et dit la recommandation de l'audit", () => {
    const [, refonte] = scenarioPropositions(audit([tableau]));
    const table = refonte.payload.corps.find((b) => b.k === "table");
    expect(table).toMatchObject({ head: tableau.k === "table" ? tableau.head : null, rows: [tableau.k === "table" ? tableau.rows[1] : []] });
    expect(refonte.payload.corps.some((b) => b.k === "callout" && b.s[0].t.includes("écarté"))).toBe(true);
  });

  it("trouve les scénarios dans les sous-pages et les encadrés", () => {
    const out = scenarioPropositions(
      audit([], [{ id: "s1", titre: "Scénarios", icone: null, corps: [{ k: "box", s: [], c: [tableau] }] }]),
    );
    expect(out).toHaveLength(2);
  });

  it("ignore les tableaux qui ne sont pas des scénarios", () => {
    const autre: Block = { k: "table", head: row("Constat", "Gravité", "Effort"), rows: [row("SEC-01", "critique", "2 h")] };
    expect(scenarioPropositions(audit([autre]))).toEqual([]);
  });

  it("garde distincts deux scénarios homonymes", () => {
    const ids = scenarioPropositions(audit([tableau, tableau])).map((p) => p.notionPageId);
    expect(new Set(ids).size).toBe(4);
  });
});
