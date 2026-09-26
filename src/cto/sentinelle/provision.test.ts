import { describe, expect, it } from "vitest";
import { decideProvision, digestOf, type WatchState, type WatchWish } from "./provision";

const ID = "0b9c6f0e-2b1a-4c3d-9e8f-1a2b3c4d5e6f";

const wish = (overrides: Partial<WatchWish> = {}): WatchWish => ({
  clientId: "cto-1",
  company: "Client SAS",
  wanted: true,
  site: "https://client.fr",
  contact: "dsi@client.fr",
  ...overrides,
});

const state = (overrides: Partial<WatchState> = {}): WatchState => ({
  sentinelleClientId: null,
  digest: null,
  contactName: null,
  ...overrides,
});

describe("decideProvision", () => {
  it("demande la création d'un client quand le service est coché pour la première fois", () => {
    const decision = decideProvision(wish(), state());
    expect(decision).toMatchObject({
      kind: "send",
      body: { active: true, email: "dsi@client.fr", siteUrl: "https://client.fr", company: "Client SAS" },
    });
    expect(decision.kind === "send" && "id" in decision.body).toBe(false);
  });

  it("prend le nom de la personne quand le contact en est une", () => {
    const decision = decideProvision(wish(), state({ contactName: "Prénom Nom" }));
    expect(decision).toMatchObject({ kind: "send", body: { name: "Prénom Nom" } });
  });

  it("aligne une fiche déjà reliée, par son identifiant", () => {
    const decision = decideProvision(wish(), state({ sentinelleClientId: ID }));
    expect(decision).toMatchObject({ kind: "send", body: { id: ID, active: true } });
  });

  it("ne rappelle pas Sentinelle quand rien n'a changé", () => {
    const first = decideProvision(wish(), state({ sentinelleClientId: ID }));
    if (first.kind !== "send") throw new Error("attendu : send");
    expect(decideProvision(wish(), state({ sentinelleClientId: ID, digest: first.digest }))).toEqual({ kind: "skip" });
  });

  it("dit ce qui manque au lieu d'envoyer une demande incomplète", () => {
    expect(decideProvision(wish({ site: null, contact: null }), state())).toEqual({
      kind: "incomplete",
      missing: ["« Site surveillé »", "« Contact veille »"],
    });
  });

  it("désactive un client relié quand le service est décoché, et ignore une fiche jamais reliée", () => {
    expect(decideProvision(wish({ wanted: false }), state({ sentinelleClientId: ID }))).toMatchObject({
      kind: "send",
      body: { id: ID, active: false },
    });
    expect(decideProvision(wish({ wanted: false }), state())).toEqual({ kind: "skip" });
  });

  it("ne désactive pas deux fois", () => {
    const body = { id: ID, active: false as const };
    expect(decideProvision(wish({ wanted: false }), state({ sentinelleClientId: ID, digest: digestOf(body) }))).toEqual({
      kind: "skip",
    });
  });
});
