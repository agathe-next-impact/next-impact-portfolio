import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { SentinelleExportSchema, type SentinelleExport } from "../sentinelle/contract";
import {
  assembleDigest,
  assembleSentinelle,
  clip,
} from "./assemble";
import { LINE_CHARS, SENTINELLE_LINES } from "./types";
import { previousWeek, weekLabel, weekOf, weekRange } from "./week";

const exemple: SentinelleExport = SentinelleExportSchema.parse(
  JSON.parse(readFileSync("docs/contrats/sentinelle-export.v1.json", "utf8")),
);
const key = (id: string) => `sentinelle-${id}`;
const semaine39 = weekRange("2026-W39");

describe("semaines", () => {
  it("range un lundi 00:30 à Paris dans sa propre semaine", () => {
    // 2026-09-21 00:30 à Paris = 2026-09-20 22:30 UTC, encore dimanche en UTC.
    expect(weekOf(new Date("2026-09-20T22:30:00Z"))).toBe("2026-W39");
  });

  it("borne la semaine du lundi au lundi, heure de Paris", () => {
    expect(semaine39.from.toISOString()).toBe("2026-09-20T22:00:00.000Z");
    expect(semaine39.to.toISOString()).toBe("2026-09-27T22:00:00.000Z");
  });

  it("donne la dernière semaine complète au lundi du digest", () => {
    expect(previousWeek(new Date("2026-09-28T05:00:00Z"))).toBe("2026-W39");
  });

  it("gère le passage d'année ISO", () => {
    expect(weekOf(new Date("2027-01-01T12:00:00Z"))).toBe("2026-W53");
  });

  it("écrit la semaine en français", () => {
    expect(weekLabel("2026-W39")).toBe("Semaine 39 · du 21 au 27 septembre 2026");
  });
});

describe("clip", () => {
  it("ne dépasse jamais 140 caractères", () => {
    expect(clip("mot ".repeat(80)).length).toBeLessThanOrEqual(LINE_CHARS);
  });
});

describe("veille technique", () => {
  it("met l'alerte rouge de la semaine en tête, avec sa référence", () => {
    const bloc = assembleSentinelle(exemple, semaine39, key);
    expect(bloc.lines[0]).toMatchObject({ tone: "critique", tag: "Alerte", ref: "wpscan:CVE-2026-1234" });
    expect(bloc.stats.critiques).toBe(1);
  });

  it("dit qu'il n'y a pas d'alerte plutôt que de se taire", () => {
    const bloc = assembleSentinelle(exemple, weekRange("2026-W30"), key);
    expect(bloc.lines[0].text).toContain("Aucune nouvelle alerte");
  });

  it("tient en 15 lignes et renvoie le reste à la lettre", () => {
    const beaucoup: SentinelleExport = {
      ...exemple,
      alerts: Array.from({ length: 30 }, (_, i) => ({ ...exemple.alerts[0], id: `a${i}`, ref: `x:${i}` })),
    };
    const bloc = assembleSentinelle(beaucoup, semaine39, key);
    expect(bloc.lines).toHaveLength(SENTINELLE_LINES);
    expect(bloc.overflow).toBeGreaterThan(0);
    expect(bloc.lines.at(-1)?.text).toMatch(/autres points/);
  });

  it("n'annonce la lettre que la semaine où elle paraît", () => {
    expect(assembleSentinelle(exemple, semaine39, key).letterKey).toBeNull();
    const w38 = assembleSentinelle(exemple, weekRange("2026-W38"), key);
    expect(w38.letterKey).toBe(key(exemple.letters[0].id));
  });
});

describe("assembleDigest", () => {
  it("ne produit rien sans veille technique reliée", () => {
    expect(
      assembleDigest({ week: "2026-W39", range: semaine39, sentinelle: null, sentinelleLetterKey: key }),
    ).toBeNull();
  });

  it("produit un digest de la seule veille technique, sans Signaux Faibles", () => {
    const digest = assembleDigest({ week: "2026-W39", range: semaine39, sentinelle: exemple, sentinelleLetterKey: key });
    expect(digest?.sentinelle).not.toBeNull();
    expect(digest).not.toHaveProperty("signaux");
  });
});
