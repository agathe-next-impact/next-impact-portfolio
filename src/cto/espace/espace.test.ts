import { describe, expect, it } from "vitest";
import type { Deliverable } from "../deliverables";
import { buildEvents, dayKey, monthGrid, upcoming } from "./calendar";
import { hasPersonalisedWatch, visibleSections, type Contents } from "./sections";

const EMPTY: Contents = {
  decisions: 0,
  cartographie: 0,
  documents: 0,
  roadmap: 0,
  prestations: 0,
  audits: 0,
  site: false,
};

const keys = (list: { key: string }[]) => list.map((s) => s.key);

describe("sections visibles", () => {
  it("montre toujours le tableau de bord et la veille, même sans aucun service", () => {
    expect(keys(visibleSections([], EMPTY))).toEqual(["tableau", "veille"]);
  });

  it("ouvre les sections cochées, même vides (état « en préparation »)", () => {
    expect(keys(visibleSections(["suivi-technique", "prestations"], EMPTY))).toEqual([
      "tableau",
      "suivi-technique",
      "veille",
      "prestations",
    ]);
  });

  it("ferme une section non cochée même si elle a du contenu", () => {
    expect(keys(visibleSections(["actions"], { ...EMPTY, decisions: 4 }))).toEqual([
      "tableau",
      "actions",
      "veille",
    ]);
  });

  it("garde l'affichage historique quand la colonne n'a jamais été renseignée", () => {
    expect(keys(visibleSections(null, { ...EMPTY, decisions: 2, roadmap: 3 }))).toEqual([
      "tableau",
      "direction-technique",
      "actions",
      "veille",
    ]);
  });

  it("ouvre la section Audit juste après l'accueil, seule pour un client audit seul", () => {
    expect(keys(visibleSections(["audit"], EMPTY))).toEqual(["tableau", "audit", "veille"]);
    expect(keys(visibleSections(null, { ...EMPTY, audits: 1, roadmap: 2 }))).toEqual([
      "tableau",
      "audit",
      "actions",
      "veille",
    ]);
  });

  it("considère la veille personnalisée souscrite en régime historique", () => {
    expect(hasPersonalisedWatch(null)).toBe(true);
    expect(hasPersonalisedWatch(["actions"])).toBe(false);
    expect(hasPersonalisedWatch(["veille-personnalisee"])).toBe(true);
  });
});

function item(overrides: Partial<Deliverable>): Deliverable {
  return {
    id: overrides.notionPageId ?? "x",
    clientId: "c",
    notionPageId: "x",
    kind: "roadmap",
    version: 1,
    title: "Chantier",
    payload: { nature: "chantier", statut: "Ouvert", budget: null, effort: null, effet: null, detail: null, source: null },
    occurredAt: null,
    recordedAt: new Date("2026-09-01"),
    featured: false,
    ...overrides,
  } as Deliverable;
}

describe("calendrier", () => {
  const now = new Date("2026-09-25T10:00:00Z");

  it("écarte les chantiers faits ou écartés et marque le retard", () => {
    const events = buildEvents(
      [
        item({ notionPageId: "a", title: "En retard", occurredAt: new Date("2026-09-10") }),
        item({
          notionPageId: "b",
          title: "Fait",
          occurredAt: new Date("2026-10-01"),
          payload: { nature: "chantier", statut: "Fait", budget: null, effort: null, effet: null, detail: null, source: null },
        }),
        item({ notionPageId: "c", title: "Sans date" }),
      ],
      [],
      () => null,
      now,
    );
    expect(events.map((e) => [e.title, e.overdue])).toEqual([["En retard", true]]);
  });

  it("met les renouvellements, livraisons et lettres sur le même axe, dans l'ordre", () => {
    const events = buildEvents(
      [
        item({
          notionPageId: "carto",
          kind: "cartographie",
          title: "Hébergement OVH",
          occurredAt: new Date("2026-11-01"),
          payload: { type: "Contrat", detenteur: null, coutAnnuel: null, criticite: null, risque: null },
        }),
        item({
          notionPageId: "presta",
          kind: "prestation",
          title: "Refonte",
          occurredAt: new Date("2026-10-15"),
          payload: { statut: "En cours", debut: null, montant: null, avancement: null, devis: null, detail: null },
        }),
      ],
      [{ title: "Lettre d'octobre", period: new Date("2026-10-01"), href: "/l" }],
      () => "/x",
      now,
    );
    expect(events.map((e) => e.kind)).toEqual(["lettre", "prestation", "echeance"]);
    expect(events[2].title).toBe("Hébergement OVH (contrat)");
  });

  it("borne l'à-venir à la fenêtre et garde les retards", () => {
    const events = buildEvents(
      [
        item({ notionPageId: "a", title: "Retard", occurredAt: new Date("2026-08-01") }),
        item({ notionPageId: "b", title: "Proche", occurredAt: new Date("2026-10-10") }),
        item({ notionPageId: "c", title: "Lointain", occurredAt: new Date("2027-06-01") }),
      ],
      [],
      () => null,
      now,
    );
    expect(upcoming(events, now, 90).map((e) => e.title)).toEqual(["Retard", "Proche"]);
  });

  it("dessine un mois commençant le lundi, avec aujourd'hui marqué", () => {
    const weeks = monthGrid(2026, 8, [], now); // septembre 2026 : le 1er est un mardi
    expect(weeks[0][0].inMonth).toBe(false);
    expect(weeks[0][1].date.getUTCDate()).toBe(1);
    const today = weeks.flat().find((d) => d.isToday);
    expect(today?.date.getUTCDate()).toBe(25);
    expect(weeks.length).toBeGreaterThanOrEqual(4);
    expect(weeks.length).toBeLessThanOrEqual(6);
  });

  it("range une date Notion sans heure au bon jour, en heure de Paris", () => {
    expect(dayKey(new Date("2026-10-31T23:30:00Z"))).toBe("2026-11-01");
  });
});
