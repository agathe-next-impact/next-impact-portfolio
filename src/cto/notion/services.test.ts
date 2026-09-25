import { describe, expect, it } from "vitest";
import type { NotionPage } from "./api";
import { clientServices, clientVeilleOrganisations, documentFiles, mapPage, PROPS, UNTITLED } from "./map";
import * as p from "./properties";
import type { DocumentPayload, PrestationPayload } from "../deliverables";

// Ce que ces tests protègent : les colonnes ajoutées pour composer l'espace
// par services, rapatrier les pièces jointes et publier les prestations. Même
// règle que le reste de la passerelle — une colonne renommée dégrade, elle ne
// casse pas.

const CLIENT = "3f7c1a2e-0000-4000-8000-000000000001";

function page(properties: Record<string, unknown>): NotionPage {
  return { id: "pg-1", properties: properties as NotionPage["properties"] };
}

const title = (value: string) => ({ type: "title", title: [{ plain_text: value }] });
const richText = (value: string) => ({ type: "rich_text", rich_text: [{ plain_text: value }] });
const select = (name: string) => ({ type: "select", select: { name } });
const multi = (...names: string[]) => ({ type: "multi_select", multi_select: names.map((name) => ({ name })) });
const date = (start: string) => ({ type: "date", date: { start } });
const number = (value: number) => ({ type: "number", number: value });
const url = (value: string) => ({ type: "url", url: value });
const relation = (...ids: string[]) => ({ type: "relation", relation: ids.map((id) => ({ id })) });

describe("services d'un accompagnement", () => {
  it("traduit les libellés de l'atelier en valeurs de code, triées", () => {
    const fiche = page({
      [PROPS.clients.services]: multi("Suivi technique", "Direction technique", "Prestations en cours"),
    });
    expect(clientServices(fiche)).toEqual({
      codes: ["direction-technique", "prestations", "suivi-technique"],
      unknown: [],
    });
  });

  it("tolère casse et accents, et isole les libellés inconnus sans les inventer", () => {
    const fiche = page({
      [PROPS.clients.services]: multi("VEILLE PERSONNALISEE", "actions en cours", "Hébergement"),
    });
    expect(clientServices(fiche)).toEqual({
      codes: ["actions", "veille-personnalisee"],
      unknown: ["Hébergement"],
    });
  });

  it("rend une liste vide sur une colonne absente", () => {
    expect(clientServices(page({}))).toEqual({ codes: [], unknown: [] });
  });

  it("lit la relation vers le pipeline de veille", () => {
    expect(clientVeilleOrganisations(page({ [PROPS.clients.veilleOrganisation]: relation("org-1") }))).toEqual([
      "org-1",
    ]);
  });
});

describe("pièces jointes", () => {
  it("distingue un fichier hébergé par Notion d'un lien externe", () => {
    const doc = page({
      [PROPS.document.file]: {
        type: "files",
        files: [
          { name: "audit.pdf", type: "file", file: { url: "https://s3/audit.pdf?sig=1", expiry_time: "x" } },
          { name: "devis", type: "external", external: { url: "https://exemple.fr/devis.pdf" } },
          { name: "sans lien", type: "file", file: {} },
        ],
      },
    });
    expect(documentFiles(doc)).toEqual([
      { name: "audit.pdf", url: "https://s3/audit.pdf?sig=1", hosted: true },
      { name: "devis", url: "https://exemple.fr/devis.pdf", hosted: false },
    ]);
  });

  it("rend une liste vide sur une colonne d'un autre type", () => {
    expect(p.files(page({ Fichier: richText("audit.pdf") }), "Fichier")).toEqual([]);
  });

  it("publie un document sans pièce tant que la synchro ne l'a pas rapatriée", () => {
    const input = mapPage("document", page({ [PROPS.document.title]: title("Revue du devis") }), CLIENT);
    expect((input.payload as DocumentPayload).fichier).toBeNull();
  });
});

describe("prestations", () => {
  it("lit toutes les colonnes, et prend la livraison comme date du livrable", () => {
    const input = mapPage(
      "prestation",
      page({
        [PROPS.prestation.title]: title("Refonte de l'extranet"),
        [PROPS.prestation.status]: select("En cours"),
        [PROPS.prestation.start]: date("2026-09-01"),
        [PROPS.prestation.due]: date("2026-11-15"),
        [PROPS.prestation.amount]: number(6400),
        [PROPS.prestation.progress]: number(0.4),
        [PROPS.prestation.quote]: url("https://exemple.fr/devis"),
        [PROPS.prestation.detail]: richText("Phase 2 sur 3"),
      }),
      CLIENT,
    );
    expect(input.title).toBe("Refonte de l'extranet");
    expect(input.occurredAt?.toISOString().slice(0, 10)).toBe("2026-11-15");
    expect(input.payload as PrestationPayload).toEqual({
      statut: "En cours",
      debut: new Date("2026-09-01").toISOString(),
      montant: 6400,
      avancement: 0.4,
      devis: "https://exemple.fr/devis",
      detail: "Phase 2 sur 3",
    });
  });

  it("dégrade une ligne vide sans lever", () => {
    const input = mapPage("prestation", page({}), CLIENT);
    expect(input.title).toBe(UNTITLED);
    expect((input.payload as PrestationPayload).avancement).toBeNull();
  });
});
