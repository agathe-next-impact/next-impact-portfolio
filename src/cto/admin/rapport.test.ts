import { describe, expect, it } from "vitest";
import type { SyncReport } from "../notion";
import { summarizeNotify, summarizeSync } from "./rapport";

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
});

describe("résumé de notification", () => {
  it("distingue l'envoi du passage à blanc", () => {
    expect(summarizeNotify({ notified: 1, upToDate: 2, warnings: [] }, false).lines).toEqual([
      "1 accompagnement prévenu, 2 déjà à jour.",
    ]);
    expect(summarizeNotify({ notified: 2, upToDate: 0, warnings: [] }, true).lines[0]).toMatch(/À blanc/);
  });
});
