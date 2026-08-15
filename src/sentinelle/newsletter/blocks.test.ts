import { describe, expect, it } from "vitest";
import {
  assembleBlocks,
  buildRadar,
  daysBetween,
  isQuietIssue,
  missingForIssue,
  periodStart,
  periodWindow,
  type RadarCandidate,
} from "./blocks";

const PERIODE = { year: 2026, month: 8, issue: 2 as const };

function candidat(overrides: Partial<RadarCandidate> = {}): RadarCandidate {
  return {
    label: "PHP",
    version: "8.1.20",
    intelKind: "eol",
    intelTitle: "PHP 8.1 cesse d'être corrigé le 2026-12-31",
    affectedRange: ">= 8.1 < 8.2",
    fixedIn: "8.3.10",
    endsOn: new Date("2026-12-31T00:00:00Z"),
    ...overrides,
  };
}

describe("periodStart / periodWindow", () => {
  it("date un numéro au 1er ou au 15", () => {
    expect(periodStart({ year: 2026, month: 8, issue: 1 }).toISOString()).toBe(
      "2026-08-01T00:00:00.000Z",
    );
    expect(periodStart(PERIODE).toISOString()).toBe("2026-08-15T00:00:00.000Z");
  });

  it("couvre l'intervalle depuis le numéro précédent", () => {
    const window = periodWindow(PERIODE);
    expect(window.from.toISOString()).toBe("2026-08-01T00:00:00.000Z");
    expect(window.to.toISOString()).toBe("2026-08-15T00:00:00.000Z");
  });

  it("remonte au mois précédent pour le numéro du 1er", () => {
    const window = periodWindow({ year: 2026, month: 1, issue: 1 });
    expect(window.from.toISOString()).toBe("2025-12-15T00:00:00.000Z");
  });
});

describe("buildRadar", () => {
  const now = new Date("2026-08-15T00:00:00Z");

  it("retient une fin de support à venir qui concerne la version du client", () => {
    const radar = buildRadar([candidat()], now);

    expect(radar).toHaveLength(1);
    expect(radar[0]).toMatchObject({ label: "PHP", endsOn: "2026-12-31", version: "8.1.20" });
    expect(radar[0].daysLeft).toBe(daysBetween(now, new Date("2026-12-31T00:00:00Z")));
  });

  it("écarte une échéance déjà passée — c'est une alerte, plus un radar", () => {
    expect(buildRadar([candidat({ endsOn: new Date("2026-01-01T00:00:00Z") })], now)).toEqual([]);
  });

  it("écarte une échéance au-delà de six mois", () => {
    expect(buildRadar([candidat({ endsOn: new Date("2027-06-01T00:00:00Z") })], now)).toEqual([]);
  });

  it("écarte une branche que le client n'utilise pas", () => {
    // Le piège du produit : PHP 8.1 en fin de vie est vrai, mais pas pour
    // quelqu'un qui tourne en 8.3.
    expect(buildRadar([candidat({ version: "8.3.2" })], now)).toEqual([]);
  });

  it("ignore les faits qui ne sont pas des fins de support", () => {
    expect(buildRadar([candidat({ intelKind: "vulnerability" })], now)).toEqual([]);
    expect(buildRadar([candidat({ endsOn: null })], now)).toEqual([]);
  });

  it("classe les échéances de la plus proche à la plus lointaine", () => {
    const radar = buildRadar(
      [
        candidat({ label: "nginx", endsOn: new Date("2026-11-01T00:00:00Z") }),
        candidat({ label: "PHP", endsOn: new Date("2026-09-01T00:00:00Z") }),
      ],
      now,
    );

    expect(radar.map((entry) => entry.label)).toEqual(["PHP", "nginx"]);
  });
});

describe("assembleBlocks", () => {
  const base = {
    period: PERIODE,
    components: [
      { label: "PHP", version: "8.1.20", type: "runtime", openAlerts: 1 },
      { label: "nginx", version: null, type: "server", openAlerts: 0 },
    ],
    sentAlerts: [],
    newComponents: [],
    radar: [],
    isFirstIssue: false,
  };

  it("compte les composants sans version — ce qui reste à compléter", () => {
    const blocks = assembleBlocks(base);
    expect(blocks.health.withoutVersion).toBe(1);
    expect(blocks.period).toBe("2026-08-2");
  });

  it("date le numéro par sa période et non par l'instant d'assemblage", () => {
    expect(assembleBlocks(base).issueDate).toBe("2026-08-15T00:00:00.000Z");
  });

  it("laisse les deux blocs rédigés vides — ils seront écrits, puis relus", () => {
    const blocks = assembleBlocks(base);
    expect(blocks.watch).toBe("");
    expect(blocks.reco).toBe("");
  });

  it("n'annonce pas de « depuis le » sur un premier numéro", () => {
    expect(assembleBlocks({ ...base, isFirstIssue: true }).delta.since).toBeNull();
    expect(assembleBlocks(base).delta.since).toBe("2026-08-01T00:00:00.000Z");
  });

  it("est sérialisable tel quel — la colonne est du jsonb", () => {
    const blocks = assembleBlocks(base);
    expect(JSON.parse(JSON.stringify(blocks))).toEqual(blocks);
  });
});

describe("missingForIssue", () => {
  const blocks = assembleBlocks({
    period: PERIODE,
    components: [],
    sentAlerts: [],
    newComponents: [],
    radar: [],
    isFirstIssue: true,
  });

  it("refuse un numéro dont les deux blocs rédigés sont vides", () => {
    expect(missingForIssue(blocks)).toEqual(["la veille du moment", "la recommandation"]);
  });

  it("laisse passer un numéro rédigé, même sans aucun fait à raconter", () => {
    expect(
      missingForIssue({ ...blocks, watch: "Quinzaine calme.", reco: "Ne rien faire." }),
    ).toEqual([]);
  });
});

describe("isQuietIssue", () => {
  const blocks = assembleBlocks({
    period: PERIODE,
    components: [{ label: "PHP", version: "8.1.20", type: "runtime", openAlerts: 0 }],
    sentAlerts: [],
    newComponents: [],
    radar: [],
    isFirstIssue: false,
  });

  it("reconnaît un numéro sans rien de neuf", () => {
    expect(isQuietIssue(blocks)).toBe(true);
  });

  it("ne l'est plus dès qu'une alerte est partie", () => {
    expect(
      isQuietIssue({
        ...blocks,
        delta: {
          ...blocks.delta,
          alerts: [{ title: "PHP 7.4", verdict: "orange", at: "2026-08-10T09:00:00.000Z" }],
        },
      }),
    ).toBe(false);
  });
});
