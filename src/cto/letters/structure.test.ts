import { describe, expect, it } from "vitest";
import type { Block } from "../notion/blocks";
import { attaque, dateEcheance, pressionDe, structureLettre } from "./structure";

const p = (t: string): Block => ({ k: "p", s: [{ t }] });
const pb = (gras: string, t: string): Block => ({ k: "p", s: [{ t: gras, b: true }, { t }] });
const h = (k: "h1" | "h2" | "h3", t: string): Block => ({ k, s: [{ t }] });

// Août 2026, lu à Paris : minuit à Paris le 1er août.
const PERIODE = new Date("2026-07-31T22:00:00.000Z");

const LETTRE: Block[] = [
  p("Note d'atelier."),
  h("h1", "Août 2026 : trois évolutions"),
  p("Trois évolutions d'août."),
  { k: "hr" },
  h("h2", "Lecture du mois"),
  p("La maintenance a occupé le mois."),
  h("h3", "Le tour des douze axes"),
  pb("Socle technique et architecture.", " Le paysage reste stable : rien ne bouge. WordPress 7.1 est sortie."),
  pb("Sécurité et maintenance.", " La pression monte, sur tous les socles. Détail."),
  pb("Données, mesure et consentement.", " Un axe à surveiller plus qu'à subir ce mois-ci. Détail."),
  pb("Visibilité.", " Le canal Google bouge fortement, la pression est en hausse. Détail."),
  { k: "hr" },
  h("h2", "À faire sur l'existant"),
  h("h3", "1. Correctifs de sécurité : tous les socles"),
  p("6 août - 27 août · WordPress 7.0.3 · wordpress.org, CERT-FR · axes 1 et 2"),
  pb("Ce qui s'est passé.", " WordPress a publié."),
  pb("Ce que ça change.", " Un site peut tomber."),
  pb("À faire cette semaine.", " Obtenir la version installée."),
  h("h3", "2. Google : mise à jour"),
  p("18 août - 31 août · Google Search · axes 4 et 7"),
  pb("À faire ce mois-ci.", " Annoter les dates."),
  { k: "hr" },
  h("h2", "Refonte : quelles solutions envisager"),
  pb("À considérer.", " Rester sur son socle."),
  pb("À différer.", " La 7.1 attend."),
  pb("Ordre de coût.", " 1 340 à 7 000 €."),
  h("h2", "Et aussi"),
  pb("Décisions automatisées.", " Uber sanctionné."),
  pb("Navigateurs.", " Chrome 152."),
  h("h2", "Échéancier"),
  p("Au 1er septembre, toute entreprise doit recevoir des factures."),
  p("Les 14 et 15 septembre, Relay coupe l'accès."),
  p("Le 9 décembre, Drupal 10 cesse d'être maintenu."),
  h("h2", "Questions à adresser au prestataire"),
  { k: "oli", s: [{ t: "Quelle version ?", b: true }] },
  { k: "oli", s: [{ t: "Quel coût ?", b: true }] },
  { k: "hr" },
  p("Agathe, Next Impact"),
];

describe("structureLettre", () => {
  const lettre = structureLettre(LETTRE, PERIODE)!;

  it("reconnaît le gabarit et retire le grand titre de l'accroche", () => {
    expect(lettre).not.toBeNull();
    expect(lettre.intro.map((b) => b.k)).toEqual(["p", "p"]);
    expect(lettre.sections.map((s) => s.kind)).toEqual([
      "prose",
      "axes",
      "actions",
      "options",
      "cartes",
      "echeancier",
      "questions",
    ]);
  });

  it("qualifie la pression de chaque axe par sa première phrase", () => {
    const axes = lettre.sections.find((s) => s.kind === "axes");
    if (axes?.kind !== "axes") throw new Error("axes absents");
    expect(axes.axes.map((a) => [a.numero, a.nom, a.pression])).toEqual([
      [1, "Socle technique et architecture", "stable"],
      [2, "Sécurité et maintenance", "hausse"],
      [3, "Données, mesure et consentement", "surveiller"],
      [4, "Visibilité", "hausse"],
    ]);
    expect(axes.axes[0].verdict).toBe("Le paysage reste stable : rien ne bouge.");
    expect(axes.axes[0].detail.map((s) => s.t).join("")).toBe("WordPress 7.1 est sortie.");
  });

  it("lit les repères, l'urgence et les rubriques d'une action", () => {
    const section = lettre.sections.find((s) => s.kind === "actions");
    if (section?.kind !== "actions") throw new Error("actions absentes");
    const [a, b] = section.actions;
    expect(a.titre).toBe("Correctifs de sécurité : tous les socles");
    expect(a.periode).toBe("6 août - 27 août");
    expect(a.sources).toEqual(["WordPress 7.0.3", "wordpress.org, CERT-FR"]);
    expect(a.axes).toEqual([1, 2]);
    expect(a.urgence).toBe("semaine");
    expect(a.echeance).toBe("Cette semaine");
    expect(a.contexte.map((c) => c.titre)).toEqual(["Ce qui s'est passé", "Ce que ça change"]);
    expect(b.urgence).toBe("mois");
    expect(b.axes).toEqual([4, 7]);
  });

  it("date les échéances dans l'année de l'édition", () => {
    const section = lettre.sections.find((s) => s.kind === "echeancier");
    if (section?.kind !== "echeancier") throw new Error("échéancier absent");
    expect(section.echeances.map((e) => [e.libelle, e.date?.toISOString().slice(0, 10)])).toEqual([
      ["Au 1er septembre", "2026-09-01"],
      ["Les 14 et 15 septembre", "2026-09-14"],
      ["Le 9 décembre", "2026-12-09"],
    ]);
    expect(section.echeances[1].texte.map((s) => s.t).join("")).toBe("Relay coupe l'accès.");
  });

  it("garde la signature après les questions", () => {
    const section = lettre.sections.find((s) => s.kind === "questions");
    if (section?.kind !== "questions") throw new Error("questions absentes");
    expect(section.questions).toHaveLength(2);
    expect(section.blocs).toEqual([p("Agathe, Next Impact")]);
  });

  it("renvoie null pour une lettre hors gabarit", () => {
    expect(structureLettre([p("Un seul paragraphe.")], PERIODE)).toBeNull();
    expect(structureLettre([h("h2", "Titre libre"), p("Du texte.")], PERIODE)).toBeNull();
  });
});

describe("outils", () => {
  it("pressionDe", () => {
    expect(pressionDe("Le marché est stable et de plus en plus lisible.")).toBe("stable");
    expect(pressionDe("La pression reste en hausse.")).toBe("hausse");
    expect(pressionDe("La pression se détend enfin.")).toBe("baisse");
    expect(pressionDe("Rien à signaler.")).toBe("inconnue");
  });

  it("attaque ignore un paragraphe sans gras", () => {
    expect(attaque([{ t: "Texte simple." }])).toBeNull();
  });

  it("dateEcheance passe à l'année suivante pour un mois déjà écoulé", () => {
    expect(dateEcheance("Le 15 janvier", PERIODE)?.toISOString().slice(0, 10)).toBe("2027-01-15");
    expect(dateEcheance("En mars 2028", PERIODE)?.toISOString().slice(0, 10)).toBe("2028-03-01");
    expect(dateEcheance("Bientôt", PERIODE)).toBeNull();
  });
});
