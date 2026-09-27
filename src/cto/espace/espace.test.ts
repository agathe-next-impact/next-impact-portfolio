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
  sectionsEnSommeil,
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
  it("ouvre la veille technique par son service, ou par un client relié en régime historique", () => {
    expect(keys(visibleSections([], EMPTY))).not.toContain("veille-technique");
    expect(keys(visibleSections([], { ...EMPTY, sentinelle: true }))).not.toContain("veille-technique");
    expect(keys(visibleSections(["veille-technique"], EMPTY))).toContain("veille-technique");
    expect(keys(visibleSections(null, { ...EMPTY, sentinelle: true }))).toContain("veille-technique");
    expect(keys(visibleSections(null, EMPTY))).not.toContain("veille-technique");
  });

  it("montre toujours l'accueil, les actions et la veille, même sans aucun service", () => {
    expect(keys(visibleSections([], EMPTY))).toEqual(["tableau", "agir", "veille"]);
  });

  it("ouvre les entrées d'un service coché, même vides (état « en préparation »)", () => {
    expect(keys(visibleSections(["suivi-technique"], EMPTY))).toEqual([
      "tableau",
      "site",
      "agir",
      "veille",
      "accompagnement",
    ]);
  });

  it("range la direction technique dans Pilotage (roadmap et documents compris), Votre site, Agir et Veille", () => {
    expect(keys(visibleSections(["direction-technique"], EMPTY))).toEqual([
      "tableau",
      "missions",
      "roadmap",
      "decisions",
      "documents",
      "cartographie",
      "agir",
      "veille",
      "accompagnement",
    ]);
  });

  it("ferme une entrée non cochée même si elle a du contenu", () => {
    expect(keys(visibleSections(["actions"], { ...EMPTY, decisions: 4 }))).toEqual([
      "tableau",
      "missions",
      "roadmap",
      "agir",
      "veille",
      "accompagnement",
    ]);
  });

  it("garde l'affichage historique quand la colonne n'a jamais été renseignée", () => {
    expect(keys(visibleSections(null, { ...EMPTY, decisions: 2, roadmap: 3 }))).toEqual([
      "tableau",
      "missions",
      "roadmap",
      "decisions",
      "agir",
      "veille",
      "accompagnement",
    ]);
  });

  it("ouvre l'audit dans Missions pour un client audit seul", () => {
    expect(keys(visibleSections(["audit"], EMPTY))).toEqual(["tableau", "missions", "audit", "agir", "veille", "accompagnement"]);
  });

  it("montre « Votre accompagnement » dès qu'un service est souscrit, jamais à un prospect", () => {
    expect(keys(visibleSections(["veille-personnalisee"], EMPTY))).toContain("accompagnement");
    expect(keys(visibleSections(null, EMPTY))).toContain("accompagnement");
    expect(keys(visibleSections([], { ...EMPTY, propositions: 1 }))).not.toContain("accompagnement");
  });

  it("montre les propositions dès qu'il y en a une, même sans aucun service", () => {
    expect(keys(visibleSections([], { ...EMPTY, propositions: 1 }))).toEqual([
      "tableau",
      "agir",
      "veille",
      "propositions",
    ]);
    expect(keys(visibleSections(null, EMPTY))).not.toContain("propositions");
  });

  it("range propositions puis missions en cours dans Contrats, en dernier", () => {
    expect(keys(visibleSections(["prestations"], EMPTY))).toEqual([
      "tableau",
      "agir",
      "veille",
      "prestations",
      "accompagnement",
    ]);
    expect(keys(visibleSections(["prestations"], { ...EMPTY, propositions: 2 })).slice(-3)).toEqual([
      "propositions",
      "prestations",
      "accompagnement",
    ]);
    expect(SECTIONS.find((s) => s.key === "prestations")?.group).toBe("contrats");
    expect(SECTIONS.find((s) => s.key === "propositions")?.group).toBe("contrats");
    // Des tarifs ne s'ouvrent jamais au contenu, régime historique compris.
    expect(keys(visibleSections(null, EMPTY))).not.toContain("prestations");
    expect(keys(visibleSections(["direction-technique"], EMPTY))).not.toContain("prestations");
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
    expect(synthese).toEqual({ missions: true, site: false, agir: false, veille: true, contrats: false });
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

describe("sections en sommeil", () => {
  const maintenant = new Date("2026-09-27T08:00:00Z");
  const sections = visibleSections(["direction-technique", "audit"], EMPTY);
  const ilYa = (jours: number) => new Date(maintenant.getTime() - jours * 86_400_000).toISOString();

  it("retire de la navigation une section cochée, vide depuis plus d'une semaine", () => {
    const sommeil = sectionsEnSommeil(sections, EMPTY, { "direction-technique": ilYa(10), audit: ilYa(10) }, maintenant);
    expect([...sommeil]).toEqual(expect.arrayContaining(["decisions", "documents", "cartographie", "audit"]));
    expect(sommeil.has("agir")).toBe(false);
    expect(sommeil.has("veille")).toBe(false);
    expect(sommeil.has("accompagnement")).toBe(false);
  });

  it("laisse sa semaine de grâce à une section tout juste ouverte", () => {
    expect(sectionsEnSommeil(sections, EMPTY, { "direction-technique": ilYa(3), audit: ilYa(3) }, maintenant).size).toBe(0);
  });

  it("réveille une section dès son premier contenu", () => {
    const sommeil = sectionsEnSommeil(sections, { ...EMPTY, decisions: 1 }, { "direction-technique": ilYa(30) }, maintenant);
    expect(sommeil.has("decisions")).toBe(false);
    expect(sommeil.has("missions")).toBe(false);
    expect(sommeil.has("documents")).toBe(true);
  });

  it("ne met rien en sommeil sans date d'ouverture connue", () => {
    expect(sectionsEnSommeil(sections, EMPTY, {}, maintenant).size).toBe(0);
  });
});
