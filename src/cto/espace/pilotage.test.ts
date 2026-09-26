import { describe, expect, it } from "vitest";
import type { Deliverable } from "../deliverables";
import type { SiteSnapshot } from "../site";
import {
  actionsFor,
  actionsVerdict,
  buildFrise,
  byPhase,
  missionsOf,
  missionsVerdict,
  sitePoints,
  siteVerdict,
} from "./pilotage";

const now = new Date("2026-09-26T10:00:00Z");

function roadmap(id: string, statut: string | null, occurredAt: string | null, nature: "chantier" | "opportunite" = "chantier"): Deliverable {
  return item({
    notionPageId: id,
    kind: "roadmap",
    title: id,
    occurredAt: occurredAt ? new Date(occurredAt) : null,
    payload: { nature, statut, budget: null, effort: null, effet: null, detail: null, source: null },
  });
}

function prestation(id: string, statut: string, occurredAt: string | null, debut: string | null = null): Deliverable {
  return item({
    notionPageId: id,
    kind: "prestation",
    title: id,
    occurredAt: occurredAt ? new Date(occurredAt) : null,
    payload: { statut, debut, montant: null, avancement: 0.6, devis: null, detail: null },
  });
}

function carto(id: string, occurredAt: string): Deliverable {
  return item({
    notionPageId: id,
    kind: "cartographie",
    title: id,
    occurredAt: new Date(occurredAt),
    payload: { type: "Contrat", detenteur: null, coutAnnuel: 1200, criticite: null, risque: null },
  });
}

function item(overrides: Partial<Deliverable>): Deliverable {
  return {
    id: overrides.notionPageId ?? "x",
    clientId: "c",
    notionPageId: "x",
    kind: "roadmap",
    version: 1,
    title: "x",
    payload: {},
    occurredAt: null,
    recordedAt: new Date("2026-09-01"),
    featured: false,
    ...overrides,
  } as Deliverable;
}

function snapshot(overrides: {
  down?: boolean;
  failles?: number;
  backupDaysAgo?: number | null;
  phpSecure?: boolean;
  uptime?: number;
} = {}): SiteSnapshot {
  const backupDaysAgo = overrides.backupDaysAgo === undefined ? 1 : overrides.backupDaysAgo;
  return {
    site: { name: "Site", url: null, wordpress: "6.8", php: "8.1", phpRecommended: "8.3", phpSecure: overrides.phpSecure ?? true, ssl: true, performance: 80, lastSyncAt: null },
    status: { down: overrides.down ?? false, disconnected: false },
    updates: { plugins: [{ name: "a", version: "1", newVersion: "2" }], themes: [] },
    vulnerabilities: {
      items: Array.from({ length: overrides.failles ?? 0 }, (_, i) => ({
        component: `Extension ${i}`,
        title: "XSS",
        cvss: 7,
        fixedIn: "2.0",
        disclosedAt: null,
      })),
      lastScanAt: null,
    },
    uptime: { enabled: true, percentage: overrides.uptime ?? 99.9, from: null, to: null, incidents: [] },
    backups: {
      recent:
        backupDaysAgo === null
          ? []
          : [{ date: new Date(now.getTime() - backupDaysAgo * 86_400_000).toISOString(), status: "finished", sizeBytes: 1 }],
    },
    maintenance: { recent: [] },
  };
}

describe("missions", () => {
  const items = [
    roadmap("fait", "Fait", "2026-08-28"),
    roadmap("ouvert", "Ouvert", "2026-09-30"),
    roadmap("retard", "Décidé", "2026-09-10"),
    roadmap("a-venir", "À venir", "2026-12-10"),
    roadmap("opportunite", "Ouvert", null, "opportunite"),
    roadmap("opportunite-ecartee", "Écarté", null, "opportunite"),
    prestation("refonte", "En cours", "2026-10-15", "2026-09-01"),
    prestation("livree", "Terminée", "2026-07-01"),
    item({ notionPageId: "decision", kind: "decision", title: "decision", occurredAt: new Date("2026-07-03"), payload: { nature: "arbitrage", motif: null, optionEcartee: null, portee: [] } }),
  ];

  it("range chaque livrable dans son moment, sans les opportunités", () => {
    const missions = missionsOf(items, now);
    expect(byPhase(missions, "en-cours").map((m) => m.title)).toEqual(["retard", "ouvert", "refonte"]);
    expect(byPhase(missions, "a-venir").map((m) => m.title)).toEqual(["a-venir"]);
    expect(byPhase(missions, "passe").map((m) => m.title)).toEqual(["fait", "decision", "livree"]);
  });

  it("marque le retard et le dit dans le verdict", () => {
    const missions = missionsOf(items, now);
    expect(missions.find((m) => m.title === "retard")?.overdue).toBe(true);
    expect(missionsVerdict(missions)).toEqual({ headline: "3 en cours, 1 en retard", tone: "alerte" });
  });

  it("dit « dans les temps » quand rien n'est en retard", () => {
    const missions = missionsOf([roadmap("ouvert", "Ouvert", "2026-09-30")], now);
    expect(missionsVerdict(missions)).toEqual({ headline: "1 en cours, dans les temps", tone: "fait" });
    expect(missionsVerdict([]).headline).toBe("Aucune mission pour l'instant");
  });

  it("garde l'avancement d'une prestation en pourcentage entier", () => {
    const [mission] = missionsOf([prestation("p", "En cours", "2026-10-15")], now);
    expect(mission.progress).toBe(60);
  });
});

describe("site", () => {
  it("ne signale rien sur un site sain, mises à jour comprises", () => {
    expect(sitePoints(snapshot(), now)).toEqual([]);
    expect(siteVerdict({ projectId: 1, snapshot: snapshot(), fetchedAt: now, error: null, errorAt: null }, now)).toEqual({
      headline: "Bon état",
      tone: "fait",
    });
  });

  it("regroupe les failles et signale une sauvegarde de plus de sept jours", () => {
    const points = sitePoints(snapshot({ failles: 2, backupDaysAgo: 8 }), now);
    expect(points.map((p) => p.id)).toEqual(["failles", "sauvegarde"]);
    expect(points[0].title).toBe("2 failles connues");
    expect(sitePoints(snapshot({ backupDaysAgo: 7 }), now)).toEqual([]);
  });

  it("distingue à corriger et à surveiller", () => {
    const state = (s: SiteSnapshot) => ({ projectId: 1, snapshot: s, fetchedAt: now, error: null, errorAt: null });
    expect(siteVerdict(state(snapshot({ failles: 1 })), now)).toEqual({ headline: "1 point à corriger", tone: "alerte" });
    expect(siteVerdict(state(snapshot({ phpSecure: false })), now)).toEqual({
      headline: "Bon état, 1 point à surveiller",
      tone: "attention",
    });
    expect(siteVerdict(state(snapshot({ down: true })), now).headline).toBe("Site injoignable");
    expect(siteVerdict(null, now).headline).toBe("Premier relevé en préparation");
  });
});

describe("actions", () => {
  it("met les échéances à moins de soixante jours et les retards à traiter, urgent d'abord", () => {
    const actions = actionsFor(
      [carto("hebergement", "2026-11-14"), carto("lointain", "2027-03-01"), roadmap("retard", "Ouvert", "2026-09-10")],
      snapshot({ phpSecure: false }),
      now,
    );
    expect(actions.aTraiter.map((a) => a.id)).toEqual(["retard-retard", "echeance-hebergement", "site-php"]);
  });

  it("met les opportunités ouvertes à arbitrer, pas les autres", () => {
    const actions = actionsFor(
      [roadmap("ia", "Ouvert", null, "opportunite"), roadmap("decidee", "Décidé", null, "opportunite")],
      null,
      now,
    );
    expect(actions.aArbitrer.map((a) => a.title)).toEqual(["ia"]);
    expect(actionsVerdict(actions)).toEqual({ headline: "1 action possible", tone: "neutre" });
    expect(actionsVerdict({ aTraiter: [], aArbitrer: [] }).headline).toBe("Rien d'urgent");
  });
});

describe("propositions", () => {
  const proposition = (id: string, statut: string | null) =>
    item({ notionPageId: id, kind: "proposition", title: id, occurredAt: new Date("2026-09-20"), payload: { statut, corps: [], sections: [], fichiers: [] } });

  it("met les propositions sans réponse à arbitrer, avant les opportunités, et jamais dans les missions", () => {
    const items = [proposition("envoyee", "Envoyée"), proposition("acceptee", "Acceptée"), roadmap("ia", "Ouvert", null, "opportunite")];
    expect(actionsFor(items, null, now).aArbitrer.map((a) => a.id)).toEqual(["proposition-envoyee", "opportunite-ia"]);
    expect(missionsOf(items, now)).toEqual([]);
  });
});

describe("frise", () => {
  it("place aujourd'hui au milieu d'une fenêtre de sept mois", () => {
    const frise = buildFrise([], [], now);
    expect(frise.months).toHaveLength(7);
    expect(frise.months[0].label).toBe("juin");
    expect(frise.today).toBeGreaterThan(50);
    expect(frise.today).toBeLessThan(60);
  });

  it("met le passé en jalons, les prestations en barres, les contrats en échéances", () => {
    const items = [prestation("refonte", "En cours", "2026-10-15", "2026-09-01"), roadmap("fait", "Fait", "2026-08-28"), carto("hebergement", "2026-11-14"), carto("hors-fenetre", "2027-06-01")];
    const frise = buildFrise(missionsOf(items, now), items, now);
    const [jalons, missions, echeances] = frise.lanes;
    expect(jalons.rows[0].map((m) => m.id)).toEqual(["fait"]);
    expect(missions.rows[0][0].to).not.toBeNull();
    expect(echeances.rows[0].map((m) => [m.id, m.tone])).toEqual([["hebergement", "attention"]]);
    expect(frise.count).toBe(3);
  });

  it("empile les missions qui se chevauchent sur plusieurs lignes", () => {
    const items = [roadmap("a", "Ouvert", "2026-10-01"), roadmap("b", "Ouvert", "2026-10-03")];
    const frise = buildFrise(missionsOf(items, now), items, now);
    expect(frise.lanes[1].rows).toHaveLength(2);
  });
});
