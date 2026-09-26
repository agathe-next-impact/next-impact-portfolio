import { describe, expect, it } from "vitest";
import type { Block } from "../notion/blocks";
import { lirePhase, lireSeverites, lireSynthese } from "./synthese";

const SYNTHESE: Block[] = [
  { k: "p", s: [{ t: "Site web: " }, { h: "https://exemple.fr/", t: "https://exemple.fr" }] },
  { k: "hr" },
  { k: "p", s: [{ t: "AUTEUR : Agathe - " }, { h: "mailto:a@b.fr", t: "a@b.fr" }] },
  { k: "p", s: [{ t: "Rendez-vous de restitution : " }] },
  { k: "p", s: [{ h: "https://calendly.com/x", t: "https://calendly.com/x" }] },
  {
    k: "box",
    s: [],
    c: [
      { k: "h3", s: [{ t: "Audit" }] },
      { k: "li", s: [{ b: true, t: "25 constats" }, { t: " mesurés : " }, { b: true, t: "2 critiques, 6 élevés" }, { t: ", 12 modérés, 5 faibles." }] },
      { k: "li", s: [{ b: true, t: "Données exposées " }, { t: ": 10 comptes exportables." }] },
      { k: "li", s: [{ t: "Cœur ancien, " }, { b: true, t: "27 extensions en retard" }] },
      { k: "h3", s: [{ t: "Recommandations" }] },
      { k: "li", s: [{ t: "Motif déterminant : le thème n'est pas évolutif." }] },
      { k: "h3", s: [{ t: "Roadmap" }] },
      { k: "li", s: [{ b: true, t: "P0, immédiat : sauvegardes, nettoyage. — 500€" }] },
      { k: "li", s: [{ t: "P2 : performance, accessibilité. — 800€" }] },
    ],
  },
];

describe("synthèse d'audit", () => {
  const synthese = lireSynthese(SYNTHESE)!;

  it("lit les fiches, y compris un libellé dont la valeur est au paragraphe suivant", () => {
    expect(synthese.fiches.map((f) => f.label)).toEqual(["Site web", "Auteur", "Rendez-vous de restitution"]);
    expect(synthese.fiches[0].valeur[0].h).toBe("https://exemple.fr/");
    expect(synthese.fiches[2].valeur[0].h).toBe("https://calendly.com/x");
    expect(synthese.reste).toEqual([]);
  });

  it("range les puces par rubrique, avec leur titre en gras ou avant « : »", () => {
    expect(synthese.rubriques.map((r) => r.titre)).toEqual(["Audit", "Recommandations", "Roadmap"]);
    const [audit, reco] = synthese.rubriques;
    expect(audit.points[1].titre).toBe("Données exposées");
    expect(audit.points[1].texte.map((s) => s.t).join("")).toBe("10 comptes exportables.");
    expect(audit.points[2].titre).toBeNull();
    expect(reco.points[0].titre).toBe("Motif déterminant");
  });

  it("reconnaît une roadmap en phases, gras ou non", () => {
    const roadmap = synthese.rubriques[2];
    expect(roadmap.phases).toEqual([
      { code: "P0", delai: "immédiat", texte: "sauvegardes, nettoyage", montant: 500 },
      { code: "P2", delai: null, texte: "performance, accessibilité", montant: 800 },
    ]);
    expect(synthese.rubriques[0].phases).toBeNull();
  });

  it("compte les constats par gravité", () => {
    expect(synthese.severites).toEqual({
      total: 25,
      niveaux: [
        { gravite: "critique", label: "Critiques", n: 2 },
        { gravite: "eleve", label: "Élevés", n: 6 },
        { gravite: "modere", label: "Modérés", n: 12 },
        { gravite: "faible", label: "Faibles", n: 5 },
      ],
    });
    expect(lireSeverites("un seul constat critique")).toBeNull();
  });

  it("lit un montant avec espace et HT", () => {
    expect(lirePhase("P3, sous 3 mois : refonte — 2 200 € HT")?.montant).toBe(2200);
    expect(lirePhase("Pas une phase")).toBeNull();
  });

  it("rend null sans rubrique, pour revenir au rendu bloc par bloc", () => {
    expect(lireSynthese([{ k: "p", s: [{ t: "Texte libre." }] }])).toBeNull();
  });
});
