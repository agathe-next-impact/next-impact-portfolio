import { describe, expect, it } from "vitest";
import { isQuietIssue } from "@sentinelle/lettre";
import type { ScanResult } from "@sentinelle/types";
import { blocksFromScan, contextFromScan, healthFromScan, periodeSemaine } from "./lettre";

// Les parties pures du pipeline scan → lettre : la fenêtre d'une semaine et la
// traduction du scan en constaté. La collecte et la rédaction, elles, sont
// celles de la lettre abonnée — déjà testées de leur côté.

const RESULT: ScanResult = {
  url: "https://exemple.fr",
  platform: "wordpress",
  components: [
    {
      type: "cms",
      slug: "wordpress",
      label: "WordPress",
      ecosystem: "wordpress",
      version: "6.2",
      confidence: "high",
      versionConfidence: "high",
    },
    {
      type: "server",
      slug: "nginx",
      label: "nginx",
      ecosystem: null,
      version: null,
      confidence: "medium",
      versionConfidence: null,
    },
  ],
  notes: [],
  scannedAt: "2026-08-18T02:00:00.000Z",
};

const NOW = new Date("2026-08-18T12:00:00.000Z");

describe("periodeSemaine", () => {
  it("couvre les sept jours écoulés, l'année écrite une seule fois", () => {
    expect(periodeSemaine(NOW)).toBe("la semaine du 11 au 18 août 2026");
  });

  it("nomme les deux mois quand la semaine les chevauche", () => {
    expect(periodeSemaine(new Date("2026-08-03T12:00:00.000Z"))).toBe(
      "la semaine du 27 juillet au 3 août 2026",
    );
  });

  it("nomme les deux années au passage de l'an", () => {
    expect(periodeSemaine(new Date("2027-01-02T12:00:00.000Z"))).toBe(
      "la semaine du 26 décembre 2026 au 2 janvier 2027",
    );
  });
});

describe("blocksFromScan", () => {
  it("traduit le scan en constaté de premier regard — fiche, sans historique", () => {
    const blocks = blocksFromScan(RESULT, [], NOW);

    expect(blocks.health.components).toEqual([
      { label: "WordPress", version: "6.2", type: "cms", openAlerts: 0 },
      { label: "nginx", version: null, type: "server", openAlerts: 0 },
    ]);
    expect(blocks.health.withoutVersion).toBe(1);
    // Premier regard : pas de numéro précédent, pas d'alertes envoyées.
    expect(blocks.delta).toEqual({ since: null, alerts: [], newComponents: [] });
  });

  it("un scan sans radar ni alertes est un numéro calme — le prompt doit le savoir", () => {
    expect(isQuietIssue(blocksFromScan(RESULT, [], NOW))).toBe(true);
  });
});

describe("contextFromScan", () => {
  it("dit au modèle d'où vient la fiche et ce qu'elle vaut", () => {
    const context = contextFromScan(RESULT, [], NOW);

    expect(context.periodLabel).toBe("la semaine du 11 au 18 août 2026");
    expect(context.siteUrl).toBe("https://exemple.fr");
    expect(context.notes).toContain("analyse externe publique du 2026-08-18");
    expect(context.notes).toContain("versions parfois déduites");
    expect(context.notes).toContain("wordpress");
    expect(context.previousIssue).toBeNull();
  });
});

describe("healthFromScan", () => {
  it("ne porte jamais d'alerte ouverte — aucun historique n'existe pour un scan", () => {
    expect(healthFromScan(RESULT).every((line) => line.openAlerts === 0)).toBe(true);
  });
});
