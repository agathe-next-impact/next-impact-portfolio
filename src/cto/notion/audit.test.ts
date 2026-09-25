import { describe, expect, it } from "vitest";
import type { NotionPage } from "./api";
import { auditActionInput, auditPageId, mapPage, pageIdFromUrl, PROPS, UNTITLED } from "./map";
import * as p from "./properties";
import type { AuditPayload, RoadmapPayload } from "../deliverables";

// Ce que ces tests protègent : le raccord entre la base Audits, la page de
// mission qu'elle désigne, et la roadmap de l'espace. Un lien mal lu publie un
// audit vide ; une action mal filtrée met une simple recommandation dans la
// roadmap du client comme si elle était décidée.

const CLIENT = "3f7c1a2e-0000-4000-8000-000000000001";

function page(properties: Record<string, unknown>): NotionPage {
  return {
    id: "1b34b0bf-ee9c-4b8c-819f-000000000009",
    properties: properties as NotionPage["properties"],
  };
}

const title = (value: string) => ({ type: "title", title: [{ plain_text: value }] });
const richText = (value: string) => ({ type: "rich_text", rich_text: [{ plain_text: value }] });
const select = (name: string) => ({ type: "select", select: { name } });
const number = (value: number) => ({ type: "number", number: value });
const url = (value: string) => ({ type: "url", url: value });
const date = (start: string) => ({ type: "date", date: { start } });

describe("lien vers la page d'audit", () => {
  const attendu = "3e2fe829-ce71-81e6-84ae-db242925ae2e";

  it("lit l'identifiant dans toutes les formes de lien Notion", () => {
    expect(pageIdFromUrl("https://app.notion.com/p/3e2fe829ce7181e684aedb242925ae2e?pvs=204")).toBe(attendu);
    expect(
      pageIdFromUrl("https://www.notion.so/Audit-technique-WordPress-Institut-3e2fe829ce7181e684aedb242925ae2e"),
    ).toBe(attendu);
    expect(pageIdFromUrl("3e2fe829-ce71-81e6-84ae-db242925ae2e")).toBe(attendu);
    expect(pageIdFromUrl("3e2fe829ce7181e684aedb242925ae2e")).toBe(attendu);
  });

  it("ne mange pas la fin du titre quand elle ressemble à de l'hexadécimal", () => {
    // Le cas réel : « France » finit par « ce », deux lettres hexadécimales.
    expect(
      pageIdFromUrl(
        "https://app.notion.com/p/Audit-technique-WordPress-Institut-Lean-France-3e2fe829ce7181e684aedb242925ae2e?source=copy_link",
      ),
    ).toBe(attendu);
  });

  it("ignore l'ancre d'un bloc et garde la page", () => {
    // Un lien copié depuis un bloc porte l'identifiant du bloc après le #.
    expect(
      pageIdFromUrl("https://app.notion.com/p/3e2fe829ce7181e684aedb242925ae2e#3e4fe829ce7180dfa8cbcc8c920d38ba"),
    ).toBe(attendu);
  });

  it("rend null sur un lien sans identifiant", () => {
    expect(pageIdFromUrl("https://www.institut-lean-france.fr")).toBeNull();
    expect(pageIdFromUrl(null)).toBeNull();
    expect(auditPageId(page({}))).toBeNull();
  });

  it("accepte le lien en colonne URL ou en texte", () => {
    const lien = "https://app.notion.com/p/3e2fe829ce7181e684aedb242925ae2e";
    expect(auditPageId(page({ [PROPS.audit.page]: url(lien) }))).toBe(attendu);
    expect(auditPageId(page({ [PROPS.audit.page]: richText(lien) }))).toBe(attendu);
  });
});

describe("ligne de la base Audits", () => {
  it("donne l'en-tête de l'audit ; le contenu vient de la lecture de la page", () => {
    const input = mapPage(
      "audit",
      page({
        [PROPS.audit.title]: title("Audit technique WordPress : Institut Lean France"),
        [PROPS.audit.site]: url("https://www.institut-lean-france.fr"),
        [PROPS.audit.date]: date("2026-09-21"),
      }),
      CLIENT,
    );
    const payload = input.payload as AuditPayload;
    expect(input.title).toBe("Audit technique WordPress : Institut Lean France");
    expect(input.occurredAt?.toISOString().slice(0, 10)).toBe("2026-09-21");
    expect(payload.site).toBe("https://www.institut-lean-france.fr");
    expect(payload.sections).toEqual([]);
    expect(payload.fichiers).toEqual([]);
  });

  it("part avec le titre de repli plutôt que de disparaître", () => {
    expect(mapPage("audit", page({}), CLIENT).title).toBe(UNTITLED);
  });
});

describe("actions d'audit vers la roadmap", () => {
  const action = (statut: string, extra: Record<string, unknown> = {}) =>
    page({
      [PROPS.auditRoadmap.title]: title("SAUV-01 : Sauvegardes externalisées et restauration testée"),
      [PROPS.auditRoadmap.phase]: select("P0 Urgences"),
      [PROPS.auditRoadmap.effortMin]: number(2),
      [PROPS.auditRoadmap.effortMax]: number(4),
      [PROPS.auditRoadmap.criterion]: richText("Restauration testée et datée"),
      [PROPS.auditRoadmap.findings]: richText("C-002"),
      [PROPS.auditRoadmap.status]: select(statut),
      ...extra,
    });

  it("laisse une simple proposition dans l'audit", () => {
    expect(auditActionInput(action("Proposé"), CLIENT, "Audit")).toBeNull();
    expect(auditActionInput(action("Écarté"), CLIENT, "Audit")).toBeNull();
    expect(auditActionInput(page({}), CLIENT, "Audit")).toBeNull();
  });

  it("fait d'une action validée un chantier décidé, relié à son audit", () => {
    const input = auditActionInput(action("Validé client"), CLIENT, "Audit ILF");
    expect(input).not.toBeNull();
    const payload = input!.payload as RoadmapPayload;
    expect(input!.kind).toBe("roadmap");
    expect(input!.title).toBe("SAUV-01 : Sauvegardes externalisées et restauration testée");
    expect(payload.nature).toBe("chantier");
    expect(payload.statut).toBe("Décidé");
    expect(payload.effort).toBe("2 à 4 h");
    expect(payload.detail).toContain("Issue de l'audit « Audit ILF »");
    expect(payload.detail).toContain("P0 Urgences");
    expect(payload.detail).toContain("Critère de réussite : Restauration testée et datée");
    expect(payload.detail).toContain("Constats liés : C-002");
  });

  it("suit l'action après la restitution", () => {
    expect((auditActionInput(action("En cours"), CLIENT, "A")!.payload as RoadmapPayload).statut).toBe("Ouvert");
    expect((auditActionInput(action("Fait"), CLIENT, "A")!.payload as RoadmapPayload).statut).toBe("Fait");
  });

  it("n'invente pas de fourchette d'effort", () => {
    const egal = auditActionInput(
      action("Validé client", { [PROPS.auditRoadmap.effortMax]: number(2) }),
      CLIENT,
      "A",
    );
    expect((egal!.payload as RoadmapPayload).effort).toBe("2 h");
    const sans = auditActionInput(
      action("Validé client", { [PROPS.auditRoadmap.effortMin]: null, [PROPS.auditRoadmap.effortMax]: null }),
      CLIENT,
      "A",
    );
    expect((sans!.payload as RoadmapPayload).effort).toBeNull();
  });
});

describe("cellules d'une base inline", () => {
  it("rend chaque type tel que l'atelier l'affiche", () => {
    expect(p.cellText(title("SEC-04") as never)).toBe("SEC-04");
    expect(p.cellText(select("Prod") as never)).toBe("Prod");
    expect(p.cellText(number(1200.5) as never)).toBe("1 200,5");
    expect(p.cellText({ type: "checkbox", checkbox: true })).toBe("Oui");
    expect(p.cellText({ type: "multi_select", multi_select: [{ name: "a" }, { name: "b" }] })).toBe("a, b");
    expect(p.cellText(date("2026-09-21") as never)).toMatch(/21 sept\.? 2026/);
  });

  it("tait ce qui n'a rien à dire au client", () => {
    expect(p.cellText({ type: "relation", relation: [{ id: "x" }] })).toBe("");
    expect(p.cellText(undefined)).toBe("");
    expect(p.cellText({ type: "number", number: null })).toBe("");
  });
});
