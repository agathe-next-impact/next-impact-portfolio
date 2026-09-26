import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { Block } from "../notion/blocks";
import { SentinelleExportSchema, type SentinelleExport } from "../sentinelle/contract";
import {
  assembleDigest,
  assembleSentinelle,
  clip,
  extractAxes,
  extractEssentiel,
  pickEditions,
  readAxisTitle,
  type EditionInput,
} from "./assemble";
import { LINE_CHARS, SENTINELLE_LINES, SIGNAL_LINES } from "./types";
import { previousWeek, weekLabel, weekOf, weekRange } from "./week";

const exemple: SentinelleExport = SentinelleExportSchema.parse(
  JSON.parse(readFileSync("docs/contrats/sentinelle-export.v1.json", "utf8")),
);
const key = (id: string) => `sentinelle-${id}`;
const semaine39 = weekRange("2026-W39");

const p = (t: string): Block => ({ k: "p", s: [{ t }] });
const li = (t: string): Block => ({ k: "li", s: [{ t }] });
const h1 = (t: string): Block => ({ k: "h1", s: [{ t }] });
const h2 = (t: string): Block => ({ k: "h2", s: [{ t }] });

function edition(overrides: Partial<EditionInput> = {}): EditionInput {
  return {
    letterKey: "page-1",
    title: "Veille Écosystème, lundi 21 septembre 2026",
    label: "Écosystème",
    action: "Relire le cahier des charges avant jeudi.",
    period: new Date("2026-09-21T06:00:00Z"),
    body: [
      { k: "callout", s: [{ t: "Livraison interne" }] },
      h1("L’essentiel"),
      li("Un appel d'offres régional ouvre le 30 septembre."),
      li("PHP 8.1 arrive en fin de support [S:endoflife:php/8.1]."),
      h1("Actualités par axe"),
      h2("① Commande publique — FORT"),
      p("Détail."),
      h2("② Financements — RAS"),
      h2("③ Emploi — MOYEN"),
    ],
    ...overrides,
  };
}

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

describe("Signaux Faibles", () => {
  it("reprend « L'essentiel » jusqu'au prochain titre", () => {
    expect(extractEssentiel(edition().body)).toEqual([
      "Un appel d'offres régional ouvre le 30 septembre.",
      "PHP 8.1 arrive en fin de support [S:endoflife:php/8.1].",
    ]);
  });

  it("s'arrête aussi à un titre d'axe de niveau 2", () => {
    const body = [h1("L'essentiel"), p("Une ligne."), h2("① Marché — FORT"), p("Hors rubrique.")];
    expect(extractEssentiel(body)).toEqual(["Une ligne."]);
  });

  it("ne garde jamais plus de 8 lignes", () => {
    const body = [h1("L’essentiel"), ...Array.from({ length: 12 }, (_, i) => li(`Ligne ${i}`))];
    const digest = assembleDigest({
      week: "2026-W39",
      range: semaine39,
      sentinelle: null,
      sentinelleLetterKey: key,
      editions: [edition({ body })],
      signauxAttendus: true,
    });
    expect(digest?.signaux[0].lines).toHaveLength(SIGNAL_LINES);
  });

  it("relie une ligne à l'alerte Sentinelle qu'elle cite", () => {
    const digest = assembleDigest({
      week: "2026-W39",
      range: semaine39,
      sentinelle: null,
      sentinelleLetterKey: key,
      editions: [edition()],
      signauxAttendus: true,
    });
    expect(digest?.signaux[0].lines[1].ref).toBe("endoflife:php/8.1");
  });

  it("lit le niveau d'un axe et trie du plus fort au plus faible", () => {
    expect(readAxisTitle("② Marché du travail — FORT")).toEqual({ name: "Marché du travail", level: "FORT" });
    expect(readAxisTitle("5G et réseaux")).toEqual({ name: "5G et réseaux", level: null });
    expect(extractAxes(edition().body).map((a) => a.level)).toEqual(["FORT", "MOYEN", "RAS"]);
  });

  it("préfère deux veilles différentes à deux éditions de la même", () => {
    const picked = pickEditions([
      edition({ letterKey: "a", label: "Écosystème", period: new Date("2026-09-24T06:00:00Z") }),
      edition({ letterKey: "b", label: "Écosystème", period: new Date("2026-09-21T06:00:00Z") }),
      edition({ letterKey: "c", label: "Positionnement", period: new Date("2026-09-22T06:00:00Z") }),
    ]);
    expect(picked.map((e) => e.letterKey)).toEqual(["a", "c"]);
  });
});

describe("assembleDigest", () => {
  it("ne produit rien sans aucune veille", () => {
    expect(
      assembleDigest({
        week: "2026-W39",
        range: semaine39,
        sentinelle: null,
        sentinelleLetterKey: key,
        editions: [],
        signauxAttendus: false,
      }),
    ).toBeNull();
  });

  it("produit un digest qui dit l'absence d'édition quand une veille est attendue", () => {
    const digest = assembleDigest({
      week: "2026-W39",
      range: semaine39,
      sentinelle: exemple,
      sentinelleLetterKey: key,
      editions: [],
      signauxAttendus: true,
    });
    expect(digest?.signaux).toEqual([]);
    expect(digest?.signauxAttendus).toBe(true);
  });
});
