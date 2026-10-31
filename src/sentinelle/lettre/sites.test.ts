import { describe, expect, it } from "vitest";
import { alertKey, composantAffiche, siteCourt } from "../notion/schema";
import type { NewsletterBlocks } from "../newsletter/blocks";
import { renderConstate, sitesDeLaFiche, type LettreContext } from "./context";

const PRINCIPAL = "https://cafecitoyen.art";

function contexte(composants: { label: string; version: string | null; site?: string | null }[]): LettreContext {
  const blocks = {
    issueDate: "2026-10-31T00:00:00Z",
    health: {
      components: composants.map((c) => ({ ...c, type: "cms", openAlerts: 0 })),
      withoutVersion: composants.filter((c) => !c.version).length,
    },
    delta: { since: null, alerts: [], newComponents: [] },
    radar: [],
  } as unknown as NewsletterBlocks;
  return { periodLabel: "novembre 2026", siteUrl: PRINCIPAL, sector: null, notes: null, blocks, previousIssue: null };
}

describe("alerte par site", () => {
  it("garde la clé d'avant les sites multiples pour le site principal", () => {
    expect(alertKey("c", "i")).toBe("c:i");
    expect(alertKey("c", "i", "")).toBe("c:i");
    expect(alertKey("c", "i", "https://boutique.fr")).toBe("c:i:https://boutique.fr");
  });

  it("nomme le site à côté du composant, sauf pour le site principal", () => {
    expect(composantAffiche("WordPress", "6.4", "")).toBe("WordPress v6.4");
    expect(composantAffiche("WordPress", null, "https://www.boutique.fr/")).toBe("WordPress — boutique.fr");
    expect(siteCourt("http://www.exemple.fr/")).toBe("exemple.fr");
  });
});

describe("fiche de la lettre", () => {
  it("garde le rendu à plat pour un client à un seul site", () => {
    const texte = renderConstate(contexte([{ label: "WordPress", version: "6.4" }]));
    expect(texte).toContain("# Le site à observer");
    expect(texte).not.toContain("##");
    expect(texte).toContain("- WordPress (6.4)");
  });

  it("range la fiche par site quand il y en a plusieurs, et prévient le modèle", () => {
    const ctx = contexte([
      { label: "WordPress", version: "6.4" },
      { label: "WordPress", version: "6.6", site: "https://lesdoleances.fr" },
    ]);
    expect(sitesDeLaFiche(ctx.blocks, PRINCIPAL)).toEqual([PRINCIPAL, "https://lesdoleances.fr"]);
    const texte = renderConstate(ctx);
    expect(texte).toContain("# Les sites à observer");
    expect(texte).toContain(`## ${PRINCIPAL} (site principal)`);
    expect(texte).toContain("## https://lesdoleances.fr");
    expect(texte.indexOf("WordPress (6.4)")).toBeLessThan(texte.indexOf("WordPress (6.6)"));
    expect(texte).toContain("nomme toujours le site");
  });
});
