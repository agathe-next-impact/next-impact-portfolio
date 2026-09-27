import { describe, expect, it } from "vitest";
import type { Deliverable } from "../deliverables";
import { buildEvents, dayKey, monthGrid, upcoming } from "./calendar";
import {
  arbitrageOuvert,
  GROUP_SLUGS,
  groupFromSlug,
  hasPersonalisedWatch,
  LEGACY_SLUGS,
  SECTIONS,
  sectionsSansInformation,
  type Informations,
  visibleGroups,
  visibleSections,
  type Contents,
} from "./sections";

const EMPTY: Contents = {
  decisions: 0,
  cartographie: 0,
  documents: 0,
  roadmap: 0,
  audits: 0,
  propositions: 0,
  site: false,
};

const keys = (list: { key: string }[]) => list.map((s) => s.key);

describe("sections visibles", () => {
  // Ouvertes à tout client depuis le 2026-09-27 : chaque client a un espace, le
  // suivi des missions et prestations ne demande pas la direction technique, et
  // la veille (technique comprise) est offerte à l'ouverture. Vides, elles
  // sortent de la navigation (`sectionsSansInformation`), pas de la carte.
  const POUR_TOUS = ["tableau", "missions", "agir", "veille", "veille-technique", "prestations", "accompagnement"];
  const avec = (...ajouts: string[]) => {
    const ordre = SECTIONS.map((section) => section.key as string);
    return [...POUR_TOUS, ...ajouts].sort((a, b) => ordre.indexOf(a) - ordre.indexOf(b));
  };

  it("ouvre à tout client la vue d'ensemble, les missions en cours, la veille technique et l'accompagnement", () => {
    expect(keys(visibleSections([], EMPTY))).toEqual(POUR_TOUS);
    expect(keys(visibleSections(null, EMPTY))).toEqual(POUR_TOUS);
  });

  it("ouvre en plus les entrées d'un service coché, même vides", () => {
    expect(keys(visibleSections(["suivi-technique"], EMPTY))).toEqual(avec("site"));
  });

  it("range la direction technique dans Pilotage (roadmap et documents compris) et Votre site", () => {
    expect(keys(visibleSections(["direction-technique"], EMPTY))).toEqual(
      avec("roadmap", "decisions", "documents", "cartographie"),
    );
  });

  it("ferme une entrée non cochée même si elle a du contenu", () => {
    expect(keys(visibleSections(["actions"], { ...EMPTY, decisions: 4 }))).toEqual(avec("roadmap"));
  });

  it("garde l'affichage historique quand la colonne n'a jamais été renseignée", () => {
    expect(keys(visibleSections(null, { ...EMPTY, decisions: 2, roadmap: 3 }))).toEqual(avec("roadmap", "decisions"));
  });

  it("ouvre l'audit pour un client audit seul", () => {
    expect(keys(visibleSections(["audit"], EMPTY))).toEqual(avec("audit"));
  });

  it("montre les propositions dès qu'il y en a une, avant les missions en cours", () => {
    const vues = keys(visibleSections([], { ...EMPTY, propositions: 1 }));
    expect(vues).toEqual(avec("propositions"));
    expect(vues.slice(-3)).toEqual(["propositions", "prestations", "accompagnement"]);
    expect(keys(visibleSections(null, EMPTY))).not.toContain("propositions");
  });

  it("range propositions, missions en cours et accompagnement dans Contrats", () => {
    for (const key of ["propositions", "prestations", "accompagnement"]) {
      expect(SECTIONS.find((s) => s.key === key)?.group).toBe("contrats");
    }
    expect(LEGACY_SLUGS.prestations).toBeUndefined();
  });

  it("réunit à traiter et à arbitrer, et renvoie les rapports vers l'état du site", () => {
    expect(LEGACY_SLUGS["a-traiter"]).toBe("agir");
    expect(LEGACY_SLUGS["a-arbitrer"]).toBe("agir");
    expect(LEGACY_SLUGS.rapports).toBe("site");
    // L'arbitrage suit la roadmap : ouvert par ses services, fermé sans eux.
    expect(arbitrageOuvert(visibleSections(["actions"], EMPTY))).toBe(true);
    expect(arbitrageOuvert(visibleSections(["audit"], EMPTY))).toBe(false);
  });

  it("donne une section existante à chaque ancienne adresse", () => {
    for (const key of Object.values(LEGACY_SLUGS)) expect(SECTIONS.some((s) => s.key === key)).toBe(true);
  });

  it("considère la veille personnalisée souscrite en régime historique", () => {
    expect(hasPersonalisedWatch(null)).toBe(true);
    expect(hasPersonalisedWatch(["actions"])).toBe(false);
    expect(hasPersonalisedWatch(["veille-personnalisee"])).toBe(true);
  });
});

describe("groupes et synthèses", () => {
  it("regroupe les sections visibles dans l'ordre, sans l'accueil", () => {
    const groupes = visibleGroups(visibleSections(["direction-technique", "suivi-technique"], EMPTY));
    expect(groupes.map((g) => g.group)).toEqual(["missions", "site", "agir", "veille", "contrats"]);
    expect(groupes.map((g) => g.label)).toEqual(["Pilotage", "Votre site", "Agir", "Veille", "Contrats"]);
  });

  it("n'ouvre une synthèse qu'aux groupes de deux entrées ou plus", () => {
    const groupes = visibleGroups(visibleSections(["direction-technique", "veille-technique"], EMPTY));
    const synthese = Object.fromEntries(groupes.map((g) => [g.group, g.synthese]));
    expect(synthese).toEqual({ missions: true, site: false, agir: false, veille: true, contrats: true });
  });

  it("donne des adresses de synthèse uniques, relues par groupFromSlug", () => {
    const slugs = Object.values(GROUP_SLUGS);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const [group, slug] of Object.entries(GROUP_SLUGS)) expect(groupFromSlug(slug)).toBe(group);
    expect(groupFromSlug("inconnu")).toBeNull();
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
      ],
      [{ title: "Lettre d'octobre", period: new Date("2026-10-01"), href: "/l" }],
      () => "/x",
      now,
      [
        { title: "Refonte", date: new Date("2026-10-15"), statut: "En cours" },
        { title: "Livrée", date: new Date("2026-10-20"), statut: "Terminée" },
      ],
    );
    expect(events.map((e) => e.kind)).toEqual(["lettre", "prestation", "echeance"]);
    expect(events[1].href).toBeNull();
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

describe("sections sans information", () => {
  const RIEN: Informations = {
    roadmap: 0,
    decisions: 0,
    audits: 0,
    documents: 0,
    cartographie: 0,
    missions: 0,
    actions: 0,
    veille: 0,
    prestations: 0,
    releveSite: false,
    releveSentinelle: false,
  };
  const sections = visibleSections(
    ["direction-technique", "audit", "suivi-technique", "veille-technique", "prestations"],
    EMPTY,
  );

  it("retire toute section vide, sans délai, y compris Actions, Veille et Missions en cours", () => {
    const vides = sectionsSansInformation(sections, RIEN);
    expect([...vides]).toEqual(
      expect.arrayContaining([
        "missions",
        "roadmap",
        "decisions",
        "audit",
        "documents",
        "site",
        "cartographie",
        "agir",
        "veille",
        "veille-technique",
        "prestations",
      ]),
    );
    expect(vides.has("tableau")).toBe(false);
  });

  it("garde une section dès son premier contenu", () => {
    const vides = sectionsSansInformation(sections, { ...RIEN, decisions: 1, missions: 1, veille: 2, releveSite: true });
    expect(vides.has("decisions")).toBe(false);
    expect(vides.has("missions")).toBe(false);
    expect(vides.has("veille")).toBe(false);
    expect(vides.has("site")).toBe(false);
    expect(vides.has("documents")).toBe(true);
  });

  it("ne juge un site ou une veille technique que sur un relevé réel", () => {
    const vides = sectionsSansInformation(sections, RIEN);
    expect(vides.has("site")).toBe(true);
    expect(vides.has("veille-technique")).toBe(true);
  });
});
