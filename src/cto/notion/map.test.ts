import { describe, expect, it } from "vitest";
import type { NotionPage } from "./api";
import { mapPage, PROPS, UNTITLED } from "./map";
import { clientPageIds, personEmail, personName, personRevoked, personRole, spaceId } from "./map";
import * as p from "./properties";
import type { CartographiePayload, DecisionPayload, RoadmapPayload } from "../deliverables";

// Ce que ces tests protègent : le seul endroit du dépôt qui connaisse les noms
// des colonnes de l'atelier. Une colonne renommée dans Notion doit produire un
// champ vide et un livrable dégradé, jamais une exception qui interromprait le
// balayage des autres bases.

const CLIENT = "3f7c1a2e-0000-4000-8000-000000000001";

function page(properties: Record<string, unknown>): NotionPage {
  return {
    id: "1b34b0bf-ee9c-4b8c-819f-000000000001",
    properties: properties as NotionPage["properties"],
  };
}

const title = (value: string) => ({ type: "title", title: [{ plain_text: value }] });
const richText = (value: string) => ({ type: "rich_text", rich_text: [{ plain_text: value }] });
const select = (name: string) => ({ type: "select", select: { name } });
const multi = (...names: string[]) => ({
  type: "multi_select",
  multi_select: names.map((name) => ({ name })),
});
const date = (start: string) => ({ type: "date", date: { start } });
const number = (value: number) => ({ type: "number", number: value });
const relation = (...ids: string[]) => ({ type: "relation", relation: ids.map((id) => ({ id })) });
const email = (value: string) => ({ type: "email", email: value });
const checkbox = (value: boolean) => ({ type: "checkbox", checkbox: value });

describe("lecture des propriétés", () => {
  it("rend null sur une propriété absente plutôt que de lever", () => {
    const empty = page({});
    expect(p.text(empty, "Motif")).toBeNull();
    expect(p.select(empty, "Nature")).toBeNull();
    expect(p.date(empty, "Date du comité")).toBeNull();
    expect(p.number(empty, "Budget")).toBeNull();
    expect(p.multiSelect(empty, "Portée")).toEqual([]);
    expect(p.relation(empty, "Client")).toEqual([]);
    expect(p.checkbox(empty, "Publié")).toBe(false);
    expect(p.email(empty, "Email")).toBeNull();
  });

  it("rend null sur une propriété du mauvais type", () => {
    // Le cas réel : une colonne texte transformée en sélecteur dans l'atelier.
    expect(p.text(page({ Motif: select("Urgent") }), "Motif")).toBeNull();
    expect(p.number(page({ Budget: richText("4000") }), "Budget")).toBeNull();
  });

  it("recolle les fragments de texte enrichi et rend null sur du vide", () => {
    const fragments = page({
      Motif: { type: "rich_text", rich_text: [{ plain_text: "deux " }, { plain_text: "morceaux" }] },
      Vide: richText("   "),
    });
    expect(p.text(fragments, "Motif")).toBe("deux morceaux");
    expect(p.text(fragments, "Vide")).toBeNull();
  });

  it("refuse une date illisible sans lever", () => {
    expect(p.date(page({ Date: { type: "date", date: { start: "pas une date" } } }), "Date")).toBeNull();
    expect(p.date(page({ Date: { type: "date", date: null } }), "Date")).toBeNull();
  });
});

describe("base Clients", () => {
  it("lit l'identifiant d'accompagnement et les liens", () => {
    const fiche = page({
      [PROPS.clients.company]: title("Fédération X"),
      [PROPS.clients.spaceId]: richText(CLIENT),
    });
    expect(spaceId(fiche)).toBe(CLIENT);

    const ligne = page({ [PROPS.client]: relation("aaa", "bbb") });
    expect(clientPageIds(ligne)).toEqual(["aaa", "bbb"]);
  });
});

describe("base Personnes", () => {
  it("lit le nom, l'e-mail en minuscules et le rôle", () => {
    const fiche = page({
      [PROPS.persons.name]: title("Alain Roux"),
      [PROPS.persons.email]: email("Alain.Roux@Exemple.fr"),
      [PROPS.persons.role]: richText("Dirigeant"),
    });
    expect(personName(fiche)).toBe("Alain Roux");
    expect(personEmail(fiche)).toBe("alain.roux@exemple.fr");
    expect(personRole(fiche)).toBe("Dirigeant");
    expect(personRevoked(fiche)).toBe(false);
  });

  it("rend l'accès révoqué seulement sur la case cochée", () => {
    const revoquee = page({ [PROPS.persons.revoked]: checkbox(true) });
    expect(personRevoked(revoquee)).toBe(true);
    expect(personRevoked(page({}))).toBe(false);
  });
});

describe("mapPage — décision", () => {
  const complete = page({
    [PROPS.decision.title]: title("Rester sur WordPress un an de plus"),
    [PROPS.decision.nature]: select("Arbitrage"),
    [PROPS.decision.date]: date("2026-03-12"),
    [PROPS.decision.motif]: richText("Le budget refonte tombe sur l'exercice suivant."),
    [PROPS.decision.ruledOut]: richText("Refonte headless immédiate, 28 000 €."),
    [PROPS.decision.scope]: multi("Budget", "Infrastructure"),
  });

  it("porte le contenu et la date du comité", () => {
    const input = mapPage("decision", complete, CLIENT);
    const payload = input.payload as DecisionPayload;

    expect(input.clientId).toBe(CLIENT);
    expect(input.title).toBe("Rester sur WordPress un an de plus");
    expect(input.occurredAt?.toISOString().slice(0, 10)).toBe("2026-03-12");
    expect(payload.nature).toBe("arbitrage");
    expect(payload.optionEcartee).toContain("28 000");
    expect(payload.portee).toEqual(["Budget", "Infrastructure"]);
  });

  it("normalise « Proposition écartée » en valeur de code", () => {
    const ecartee = page({
      ...complete.properties,
      [PROPS.decision.nature]: select("Proposition écartée"),
    });
    expect((mapPage("decision", ecartee, CLIENT).payload as DecisionPayload).nature).toBe("ecartee");
  });

  it("rend une nature nulle sur une option ajoutée dans l'atelier", () => {
    const inconnue = page({ ...complete.properties, [PROPS.decision.nature]: select("À revoir") });
    expect((mapPage("decision", inconnue, CLIENT).payload as DecisionPayload).nature).toBeNull();
  });

  it("étiquette un livrable publié sans titre au lieu de l'escamoter", () => {
    const sansTitre = page({ [PROPS.decision.motif]: richText("un motif, pas de titre") });
    expect(mapPage("decision", sansTitre, CLIENT).title).toBe(UNTITLED);
  });

  it("survit à une colonne renommée dans l'atelier", () => {
    const renommee = page({
      [PROPS.decision.title]: title("Décision"),
      Raison: richText("l'ancienne colonne Motif"),
    });
    const payload = mapPage("decision", renommee, CLIENT).payload as DecisionPayload;
    expect(payload.motif).toBeNull();
    expect(payload.portee).toEqual([]);
  });
});

describe("mise en avant", () => {
  const base = { [PROPS.decision.title]: title("Une décision") };

  it("ne met en avant que sur « À la une »", () => {
    const une = page({ ...base, [PROPS.placement]: select("À la une") });
    expect(mapPage("decision", une, CLIENT).featured).toBe(true);
  });

  it("laisse en archive une colonne vide, absente ou « Archive »", () => {
    // Opt-in strict : le défaut inverse ferait de la page d'accueil un
    // déversoir qu'il faudrait vider ligne à ligne.
    expect(mapPage("decision", page(base), CLIENT).featured).toBe(false);
    expect(
      mapPage("decision", page({ ...base, [PROPS.placement]: select("Archive") }), CLIENT).featured,
    ).toBe(false);
  });

  it("tolère la casse et les accents du libellé", () => {
    const variantes = ["a la une", "À LA UNE", " À la une "];
    for (const valeur of variantes) {
      expect(
        mapPage("decision", page({ ...base, [PROPS.placement]: select(valeur) }), CLIENT).featured,
      ).toBe(true);
    }
  });

  it("s'applique aux trois bases synchronisées", () => {
    const une = { [PROPS.placement]: select("À la une") };
    expect(mapPage("roadmap", page({ ...une }), CLIENT).featured).toBe(true);
    expect(mapPage("cartographie", page({ ...une }), CLIENT).featured).toBe(true);
  });
});

describe("mapPage — roadmap et cartographie", () => {
  it("prend l'échéance comme date qui compte", () => {
    const chantier = page({
      [PROPS.roadmap.title]: title("Migration de l'hébergement"),
      [PROPS.roadmap.nature]: select("Opportunité"),
      [PROPS.roadmap.status]: select("Ouvert"),
      [PROPS.roadmap.due]: date("2026-11-30"),
      [PROPS.roadmap.budget]: number(4200),
      [PROPS.roadmap.effort]: select("Moyen"),
      [PROPS.roadmap.effect]: select("Fort"),
    });
    const input = mapPage("roadmap", chantier, CLIENT);
    const payload = input.payload as RoadmapPayload;

    expect(input.occurredAt?.toISOString().slice(0, 10)).toBe("2026-11-30");
    expect(payload.nature).toBe("opportunite");
    expect(payload.budget).toBe(4200);
    expect(payload.effort).toBe("Moyen");
    expect(payload.effet).toBe("Fort");
  });

  it("garde le coût annuel qui alimentera le budget à trois ans", () => {
    const element = page({
      [PROPS.cartographie.title]: title("Hébergement mutualisé"),
      [PROPS.cartographie.type]: select("Hébergement"),
      [PROPS.cartographie.holder]: richText("Direction financière"),
      [PROPS.cartographie.yearlyCost]: number(180),
      [PROPS.cartographie.criticality]: select("Critique"),
      [PROPS.cartographie.due]: date("2027-01-15"),
    });
    const payload = mapPage("cartographie", element, CLIENT).payload as CartographiePayload;

    expect(payload.coutAnnuel).toBe(180);
    expect(payload.criticite).toBe("Critique");
    expect(payload.detenteur).toBe("Direction financière");
  });
});
