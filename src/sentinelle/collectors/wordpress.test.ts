import { describe, expect, it } from "vitest";
import { isAffected } from "@sentinelle/matching";
import { createCallBudget } from "./http";
import { intelFromInfo } from "./releases";
import { collectWpscan, intelFromWpscan } from "./wpscan";
import type { WordPressTarget } from "./targets";

const EXTENSION: WordPressTarget = {
  slug: "contact-form-7",
  role: "plugin",
  type: "cms_plugin",
  versions: ["5.9.3"],
};

describe("WPScan", () => {
  it("ne produit rien sans clé, et le dit au lieu de le taire", async () => {
    // Le repli Wordfence du pack n'existe plus (API v2 retirée, v3 authentifiée) :
    // sans clé, il n'y a pas de source gratuite de vulnérabilités WordPress.
    // Le collecteur doit être muet mais explicite, jamais en erreur.
    const report = await collectWpscan([EXTENSION], createCallBudget(), undefined);

    expect(report.items).toEqual([]);
    expect(report.failures).toEqual([]);
    expect(report.unavailable).toContain("WPSCAN_API_KEY");
  });

  it("ne consomme aucun appel quand il n'y a rien à interroger", async () => {
    const budget = createCallBudget();
    await collectWpscan([], budget, "clef-factice");

    expect(budget.spent()).toBe(0);
  });

  it("déduit la plage affectée de la version corrigée", () => {
    const [item] = intelFromWpscan(
      {
        "contact-form-7": {
          latest_version: "6.1.6",
          vulnerabilities: [
            {
              id: "abc-123",
              title: "Contact Form 7 < 5.9.4 — Injection",
              fixed_in: "5.9.4",
              published_date: "2024-04-02T00:00:00.000Z",
              references: { cve: ["CVE-2024-0000"] },
              cvss: { severity: "high" },
            },
          ],
        },
      },
      EXTENSION,
    );

    expect(item).toMatchObject({
      kind: "vulnerability",
      source: "wpscan",
      externalId: "abc-123",
      targetSlug: "contact-form-7",
      targetType: "cms_plugin",
      targetEcosystem: "wordpress",
      affectedRange: "< 5.9.4",
      severity: "high",
    });
    expect(item.title).toContain("CVE-2024-0000");
    expect(isAffected({ version: "5.9.3", affectedRange: item.affectedRange })).toBe(true);
    expect(isAffected({ version: "5.9.4", affectedRange: item.affectedRange })).toBe(false);
  });
});

describe("dernières versions wordpress.org", () => {
  it("produit un fait par composant, pas un par version publiée", () => {
    // Sinon chaque sortie amont créerait une alerte de plus pour la même chose.
    const [item] = intelFromInfo(
      { name: "Contact Form 7", version: "6.1.6", last_updated: "2026-05-15 2:55am GMT" },
      EXTENSION,
    );

    expect(item).toMatchObject({
      kind: "release",
      source: "api.wordpress.org",
      externalId: "plugin:contact-form-7",
      affectedRange: "< 6.1.6",
      fixedIn: "6.1.6",
      title: "Contact Form 7 6.1.6 est disponible",
    });
  });

  it("ignore une réponse d'extension inconnue", () => {
    // wordpress.org répond `false` pour un slug qui n'existe pas.
    expect(intelFromInfo(false, EXTENSION)).toEqual([]);
    expect(intelFromInfo({ error: "Plugin not found." }, EXTENSION)).toEqual([]);
  });
});
