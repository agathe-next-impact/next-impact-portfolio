import { describe, expect, it } from "vitest";
import type { SyncReport } from "../notion";
import { newAlerts, summarizeNotify, summarizeSync } from "./rapport";

function report(overrides: Partial<SyncReport> = {}): SyncReport {
  return {
    dryRun: false,
    clientsMapped: 2,
    persons: { seen: 3, created: 1, updated: 0, revoked: 0, restored: 0, unchanged: 2 },
    letters: { published: 4, created: 0, updated: 0, unchanged: 4, withdrawn: 0, editions: null },
    kinds: [
      { kind: "decision", published: 5, featured: 1, created: 2, updated: 0, restored: 0, unchanged: 3, withdrawn: 0 },
      { kind: "roadmap", published: 3, featured: 0, created: 0, updated: 0, restored: 0, unchanged: 3, withdrawn: 0 },
    ],
    warnings: ["« Client X » : en préparation — aucun accompagnement créé tant que l'état n'est pas « actif »."],
    alerts: [],
    ...overrides,
  } as SyncReport;
}

describe("résumé de synchro", () => {
  it("ne cite que les bases qui ont bougé, et garde les points à regarder", () => {
    const summary = summarizeSync(report());
    expect(summary.lines.some((line) => line.startsWith("decision : 2 créé(s)"))).toBe(true);
    expect(summary.lines.some((line) => line.startsWith("roadmap"))).toBe(false);
    expect(summary.warnings).toHaveLength(1);
  });

  it("dit quand rien n'a bougé, et quand c'était à blanc", () => {
    const calme = report({
      dryRun: true,
      kinds: [
        { kind: "decision", published: 5, featured: 1, created: 0, updated: 0, restored: 0, unchanged: 5, withdrawn: 0 },
      ],
    });
    const summary = summarizeSync(calme);
    expect(summary.lines[0]).toMatch(/À blanc/);
    expect(summary.lines).toContain("Livrables : rien de nouveau.");
  });

  it("garde à part ce qui touche un accès ou un rattachement", () => {
    const alerte = "decision « Hébergement » est publiée sans client : elle n'apparaît nulle part.";
    const summary = summarizeSync(report({ warnings: ["Base « prestation » ignorée.", alerte], alerts: [alerte] }));
    expect(summary.alerts).toEqual([alerte]);
    expect(summary.warnings).toContain(alerte);
  });
});

describe("alertes nouvelles", () => {
  const sansClient = "decision « Hébergement » est publiée sans client : elle n'apparaît nulle part.";
  const revoquee = "« Camille Roy » : ligne disparue de la base Personnes — accès révoqué.";

  it("ne redit pas une alerte que le balayage précédent portait déjà", () => {
    expect(newAlerts([sansClient, revoquee], [sansClient])).toEqual([revoquee]);
    expect(newAlerts([sansClient], [sansClient])).toEqual([]);
  });

  it("redit une alerte revenue après avoir disparu, et ne compte pas deux fois la même", () => {
    expect(newAlerts([sansClient, sansClient], [])).toEqual([sansClient]);
  });
});

describe("résumé de notification", () => {
  it("distingue l'envoi du passage à blanc", () => {
    expect(summarizeNotify({ notified: 1, welcomed: 0, upToDate: 2, warnings: [] }, false).lines).toEqual([
      "1 accompagnement prévenu, 2 déjà à jour.",
    ]);
    expect(summarizeNotify({ notified: 2, welcomed: 0, upToDate: 0, warnings: [] }, true).lines[0]).toMatch(/À blanc/);
  });

  it("compte les bienvenues à part", () => {
    expect(summarizeNotify({ notified: 0, welcomed: 1, upToDate: 3, warnings: [] }, false).lines).toEqual([
      "0 accompagnement prévenu, 3 déjà à jour.",
      "1 bienvenue envoyée à une personne jamais invitée.",
    ]);
  });
});
