import { describe, expect, it } from "vitest";
import type { ApercuTheme, ScanResult } from "@sentinelle/types";
import type { MatchableIntel } from "@sentinelle/matching";
import { borner } from "./build";
import { croiser, renderDossier } from "./dossier";

// ─────────────────────────────────────────────────────────────────────────────
// L'aperçu réutilise `decide()` tel quel : on ne reteste pas le moteur, on
// vérifie l'adaptation scan → matching et la garde anti-alarmisme.
// ─────────────────────────────────────────────────────────────────────────────

const NOW = new Date("2026-08-16T12:00:00Z");

function scanResult(overrides: Partial<ScanResult> = {}): ScanResult {
  return {
    url: "https://exemple.fr",
    platform: "wordpress",
    components: [
      {
        type: "cms",
        slug: "wordpress",
        label: "WordPress",
        ecosystem: "wordpress",
        version: "6.4.1",
        confidence: "high",
        versionConfidence: "high",
      },
      {
        type: "cms_plugin",
        slug: "contact-form-7",
        label: "Contact Form 7",
        ecosystem: "wordpress",
        version: "5.7",
        confidence: "high",
        versionConfidence: "high",
      },
    ],
    notes: [],
    scannedAt: "2026-08-16T11:00:00.000Z",
    ...overrides,
  };
}

const failleCf7: MatchableIntel = {
  id: "intel-1",
  kind: "vulnerability",
  source: "wpscan",
  targetSlug: "contact-form-7",
  targetType: "cms_plugin",
  targetEcosystem: "wordpress",
  affectedRange: "< 5.8",
  fixedIn: "5.8",
  severity: "high",
  title: "Injection dans le traitement des formulaires",
  publishedAt: new Date("2026-08-10T00:00:00Z"),
};

describe("croiser", () => {
  it("retient un composant détecté dans la plage affectée, avec le verdict du moteur", () => {
    const constats = croiser(scanResult(), [failleCf7], NOW);

    expect(constats).toHaveLength(1);
    expect(constats[0]).toMatchObject({
      verdict: "red",
      composant: "Contact Form 7",
      titre: "Injection dans le traitement des formulaires",
      publieLe: "2026-08-10",
      source: "wpscan",
    });
  });

  it("ne retient rien pour une version hors plage ou un slug non détecté", () => {
    const horsPlage = { ...failleCf7, affectedRange: "< 5.0", fixedIn: "5.0" };
    const autreSlug = { ...failleCf7, id: "intel-2", targetSlug: "woocommerce" };

    expect(croiser(scanResult(), [horsPlage, autreSlug], NOW)).toHaveLength(0);
  });

  it("ne retient rien sans version connue — le doute ne produit rien", () => {
    const sansVersion = scanResult();
    sansVersion.components = sansVersion.components.map((c) => ({
      ...c,
      version: null,
      versionConfidence: null,
    }));

    expect(croiser(sansVersion, [failleCf7], NOW)).toHaveLength(0);
  });
});

describe("borner", () => {
  const themes: ApercuTheme[] = [
    { theme: "socle", statut: "agir", texte: "…" },
    { theme: "visibilite", statut: "rien_a_signaler", texte: "…" },
  ];

  it("rétrograde « agir » en « surveiller » sans fait sérieux au dossier", () => {
    const bornes = borner(themes, []);
    expect(bornes[0].statut).toBe("surveiller");
    expect(bornes[1].statut).toBe("rien_a_signaler");
  });

  it("laisse « agir » quand un constat red ou orange le justifie", () => {
    const constats = croiser(scanResult(), [failleCf7], NOW);
    expect(borner(themes, constats)[0].statut).toBe("agir");
  });
});

describe("renderDossier", () => {
  it("porte le site, les composants, les faits et le cadre d'analyse externe", () => {
    const constats = croiser(scanResult(), [failleCf7], NOW);
    const dossier = renderDossier(scanResult(), constats);

    expect(dossier).toContain("https://exemple.fr");
    expect(dossier).toContain("Contact Form 7");
    expect(dossier).toContain("Analyse externe");
    expect(dossier).toContain("Injection dans le traitement des formulaires");
    expect(dossier).toContain("- socle : Socle technique & sécurité");
  });

  it("dit explicitement quand aucun fait ne concerne le site", () => {
    const dossier = renderDossier(scanResult(), []);
    expect(dossier).toContain("Aucun fait collecté");
  });
});
