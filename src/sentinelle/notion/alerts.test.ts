import { describe, expect, it } from "vitest";
import type { NotionPage, NotionProperty } from "./client";
import { alertKey, parseAlertPage } from "./alerts";
import { PROPS } from "./schema";

// ─────────────────────────────────────────────────────────────────────────────
// `parseAlertPage` est le seul endroit qui traduit une page Notion en ce que le
// reste du produit (miroir Postgres, envoi) comprend. Une erreur ici se
// propagerait partout : mauvais verdict envoyé, mauvais statut mirroré.
// ─────────────────────────────────────────────────────────────────────────────

function title(value: string): NotionProperty {
  return { type: "title", title: [{ plain_text: value }] };
}
function richText(value: string): NotionProperty {
  return { type: "rich_text", rich_text: [{ plain_text: value }] };
}
function select(value: string): NotionProperty {
  return { type: "select", select: { name: value } };
}
function checkbox(value: boolean): NotionProperty {
  return { type: "checkbox", checkbox: value };
}
function date(value: string): NotionProperty {
  return { type: "date", date: { start: value } };
}

function page(properties: Record<string, NotionProperty>): NotionPage {
  return { id: "page-1", properties };
}

describe("parseAlertPage", () => {
  it("relit une page complète, validée, avec sa date d'envoi", () => {
    const record = parseAlertPage(
      page({
        [PROPS.title]: title("Une mise à jour de sécurité attend votre site"),
        [PROPS.key]: richText(alertKey("client-1", "intel-1")),
        [PROPS.clientId]: richText("client-1"),
        [PROPS.status]: select("Validée"),
        [PROPS.verdict]: select("Rouge"),
        [PROPS.body]: richText("Une faille corrigée dans la dernière version concerne votre site."),
        [PROPS.whatItChanges]: richText("Votre formulaire peut être détourné."),
        [PROPS.recommendedAction]: richText("Mettre à jour l'extension."),
        [PROPS.diyPossible]: checkbox(true),
        [PROPS.effortEstimate]: richText("15 min"),
        [PROPS.sentAt]: date("2026-09-10T08:00:00.000Z"),
      }),
    );

    expect(record).toMatchObject({
      pageId: "page-1",
      key: alertKey("client-1", "intel-1"),
      clientId: "client-1",
      status: "validated",
      verdict: "red",
      content: {
        verdict: "red",
        title: "Une mise à jour de sécurité attend votre site",
        recommendedAction: "Mettre à jour l'extension.",
        diyPossible: true,
        effortEstimate: "15 min",
      },
    });
    expect(record.sentAt?.toISOString()).toBe("2026-09-10T08:00:00.000Z");
  });

  it("rend des valeurs neutres pour une page tout juste créée par le matching", () => {
    // Ce que `createAlertPage` écrit avant que la rédaction ne passe : pas de
    // corps, pas de statut envoyé, un verdict proposé.
    const record = parseAlertPage(
      page({
        [PROPS.title]: title("(à rédiger)"),
        [PROPS.status]: select("Brouillon"),
        [PROPS.verdict]: select("Orange"),
      }),
    );

    expect(record.status).toBe("draft");
    expect(record.verdict).toBe("orange");
    expect(record.content.body).toBe("");
    expect(record.content.diyPossible).toBe(false);
    expect(record.sentAt).toBeNull();
  });

  it("ne lève jamais sur une page sans aucune propriété reconnue", () => {
    const record = parseAlertPage(page({}));

    expect(record.status).toBe("draft");
    expect(record.verdict).toBeNull();
    expect(record.content.title).toBe("");
    expect(record.key).toBeNull();
    expect(record.clientId).toBeNull();
  });
});
