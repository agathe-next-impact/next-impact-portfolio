import { describe, expect, it } from "vitest";
import { LETTER_COLUMNS, LETTER_PROPS } from "./letters";
import { PROPS } from "./map";
import { column, COLUMNS, schemaIssues, schemaWarning, type Column, type SchemaBase } from "./schema";

// Ce que ces tests protègent : une colonne renommée dans l'atelier doit arrêter
// le balayage de SA base et se dire par son nom, au lieu de réécrire chaque
// livrable avec un champ vide. Et la liste des colonnes attendues doit suivre
// celle des colonnes lues — sans quoi le contrôle laisse passer ce qu'il ignore.

const DECISIONS: Record<string, { type: string }> = {
  Client: { type: "relation" },
  Publié: { type: "checkbox" },
  Affichage: { type: "select" },
  Décision: { type: "title" },
  Nature: { type: "select" },
  "Date du comité": { type: "date" },
  Motif: { type: "rich_text" },
  "Option écartée": { type: "rich_text" },
  Portée: { type: "multi_select" },
};

function sans(properties: Record<string, { type: string }>, name: string) {
  const { [name]: _retiree, ...reste } = properties;
  return reste;
}

describe("contrôle de schéma", () => {
  it("ne dit rien d'une base conforme, colonnes en plus comprises", () => {
    expect(schemaIssues(COLUMNS.decision, { ...DECISIONS, "Notes internes": { type: "rich_text" } })).toEqual([]);
  });

  it("nomme la colonne absente, et celle qui l'a sans doute remplacée", () => {
    const renommee = { ...sans(DECISIONS, "Date du comité"), "Date de séance": { type: "date" } };
    expect(schemaIssues(COLUMNS.decision, renommee)).toEqual([
      "colonne « Date du comité » absente (renommée en « Date de séance » ?)",
    ]);
  });

  it("ne devine pas quand plusieurs colonnes pourraient convenir", () => {
    const ambigue = {
      ...sans(DECISIONS, "Motif"),
      Motivation: { type: "rich_text" },
      "Notes internes": { type: "rich_text" },
    };
    expect(schemaIssues(COLUMNS.decision, ambigue)).toEqual(["colonne « Motif » absente"]);
  });

  it("signale un changement de type, qui se lirait vide sans lever", () => {
    expect(schemaIssues(COLUMNS.decision, { ...DECISIONS, Nature: { type: "status" } })).toEqual([
      "colonne « Nature » de type « status », attendu sélection",
    ]);
  });

  it("accepte les deux types d'une colonne lue en lien ou en texte", () => {
    const colonnes: Column[] = [column("Page de l'audit", "url", "rich_text")];
    expect(schemaIssues(colonnes, { "Page de l'audit": { type: "rich_text" } })).toEqual([]);
    expect(schemaIssues(colonnes, { "Page de l'audit": { type: "date" } })).toEqual([
      "colonne « Page de l'audit » de type date, attendu URL ou texte",
    ]);
  });

  it("tolère l'absence d'une colonne facultative, pas son mauvais type", () => {
    const raccord = COLUMNS.clients.filter((colonne) => colonne.name === PROPS.clients.spaceId);
    expect(schemaIssues(raccord, {})).toEqual([]);
    expect(schemaIssues(raccord, { [PROPS.clients.spaceId]: { type: "number" } })).toHaveLength(1);
  });

  it("laisse passer une base sans « Affichage », comme Documents", () => {
    expect(schemaIssues(COLUMNS.decision, sans(DECISIONS, PROPS.placement))).toEqual([]);
  });

  it("met la base de côté en une phrase, ou se tait", () => {
    expect(schemaWarning("decision", [])).toBeNull();
    expect(schemaWarning("decision", ["colonne « Motif » absente"])).toMatch(
      /^decision : colonne « Motif » absente\. Base ni écrite ni retirée/,
    );
  });
});

describe("colonnes déclarées", () => {
  // Une colonne lue dans `map.ts` et oubliée ici échapperait au contrôle : son
  // renommage redeviendrait silencieux.
  const LUES: [SchemaBase, Record<string, string>][] = [
    ["clients", PROPS.clients],
    ["persons", PROPS.persons],
    ["decision", PROPS.decision],
    ["roadmap", PROPS.roadmap],
    ["cartographie", PROPS.cartographie],
    ["veille", PROPS.veille],
    ["document", PROPS.document],
    ["prestation", PROPS.prestation],
    ["paiement", PROPS.paiement],
    ["audit", PROPS.audit],
    ["proposition", PROPS.proposition],
  ];

  it.each(LUES)("%s : chaque colonne de PROPS a son type attendu", (base, props) => {
    const declarees = COLUMNS[base].map((colonne) => colonne.name);
    for (const name of Object.values(props)) expect(declarees).toContain(name);
  });

  it("les bases de contenu portent Client, Publié et Affichage", () => {
    const contenu: SchemaBase[] = [
      "decision",
      "roadmap",
      "cartographie",
      "veille",
      "document",
      "prestation",
      "audit",
      "proposition",
    ];
    for (const base of contenu) {
      const declarees = COLUMNS[base].map((colonne) => colonne.name);
      expect(declarees).toEqual(expect.arrayContaining([PROPS.client, PROPS.published, PROPS.placement]));
    }
  });

  it("la base Lettres déclare chacune de ses colonnes", () => {
    expect(LETTER_COLUMNS.map((colonne) => colonne.name).sort()).toEqual(Object.values(LETTER_PROPS).sort());
  });
});
