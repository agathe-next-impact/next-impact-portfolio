import { describe, expect, it } from "vitest";
import { AXES, type Lettre } from "@sentinelle/lettre/schema";
import { checkExportAuth } from "./auth";
import { ExportBlockSchema } from "./contract";
import { renderLettre } from "./render";

function lettre(overrides: Partial<Lettre> = {}): Lettre {
  return {
    titre: "Septembre 2026",
    ligneContexte: "Analyse externe.",
    chapeau: "Premier paragraphe.\n\nSecond paragraphe.",
    siteEnUnePhrase: "Un site WordPress vivant.",
    axes: AXES.map((nom, index) => ({
      numero: index + 1,
      nom,
      question: "Question ?",
      analyse: "Analyse.",
      statut: index === 0 ? ("agir" as const) : ("nonConcerne" as const),
      horizon: index === 0 ? "ce mois-ci" : "",
    })),
    tendances: {
      duMois: [],
      marche: [],
      signauxDeDemande: [],
      deFond: [],
      ceQuiNeChangePas: [],
    },
    synthese: {
      actions: [{ action: "Mettre à jour PHP.", horizon: "cette semaine", pourquoi: "Fin de support." }],
      reste: "",
      scenarios: [],
      aDifferer: [],
      budget: { coutTroisACinqAns: "Coût.", indicateurs: [], pointDEquilibre: "", siPasDeChiffres: "" },
      commentDecider: [],
    },
    echeancier: [],
    questions: [],
    sources: [
      {
        theme: "Sécurité",
        faits: [{ enonce: "Avis publié.", date: "2026-09-01", source: "https://exemple.org/avis" }],
      },
    ],
    ligneCloture: "",
    notesDeProduction: "note interne à ne jamais exporter",
    ...overrides,
  };
}

describe("renderLettre", () => {
  it("produit des blocs conformes au contrat", () => {
    for (const block of renderLettre(lettre())) {
      expect(ExportBlockSchema.safeParse(block).success).toBe(true);
    }
  });

  it("garde les douze axes et la synthèse, et découpe le chapeau en paragraphes", () => {
    const blocks = renderLettre(lettre());
    const titres = blocks.filter((b) => b.k === "h3").map((b) => ("s" in b ? b.s[0].t : ""));
    expect(titres.filter((titre) => /^\d+\. /.test(titre))).toHaveLength(12);
    const textes = blocks.flatMap((b) => ("s" in b ? b.s.map((s) => s.t) : []));
    expect(textes).toContain("Premier paragraphe.");
    expect(textes).toContain("Second paragraphe.");
    expect(textes).toContain("Mettre à jour PHP.");
  });

  it("ne fait jamais sortir les notes de production", () => {
    const textes = JSON.stringify(renderLettre(lettre()));
    expect(textes).not.toContain("note interne");
  });

  it("rend une source web cliquable", () => {
    const lien = renderLettre(lettre())
      .flatMap((b) => ("s" in b ? b.s : []))
      .find((s) => s.h);
    expect(lien?.h).toBe("https://exemple.org/avis");
  });

  it("ne laisse pas de titre de section vide", () => {
    const blocks = renderLettre(lettre());
    const titres = blocks.map((b) => ("s" in b ? b.s[0]?.t : ""));
    expect(titres).not.toContain("Les tendances du mois");
    expect(titres).not.toContain("Scénarios");
  });
});

describe("checkExportAuth", () => {
  it("reste fermé sans secret configuré", () => {
    expect(checkExportAuth("Bearer x", undefined)).toBe("closed");
    expect(checkExportAuth("Bearer x", "  ")).toBe("closed");
  });

  it("refuse un jeton absent, mal formé ou faux", () => {
    expect(checkExportAuth(null, "secret")).toBe("denied");
    expect(checkExportAuth("secret", "secret")).toBe("denied");
    expect(checkExportAuth("Bearer autre", "secret")).toBe("denied");
  });

  it("accepte le bon jeton", () => {
    expect(checkExportAuth("Bearer secret", "secret")).toBe("ok");
  });
});
