import { describe, expect, it } from "vitest";
import { planProvision, ProvisionRequestSchema, type ExistingClient } from "./plan";

const ID = "0b9c6f0e-2b1a-4c3d-9e8f-1a2b3c4d5e6f";

const existing = (overrides: Partial<ExistingClient> = {}): ExistingClient => ({
  id: ID,
  email: "dsi@client.fr",
  name: "Client SAS",
  company: "Client SAS",
  siteUrl: "https://client.fr/",
  sector: null,
  active: true,
  components: 4,
  ...overrides,
});

const active = {
  active: true as const,
  email: "DSI@client.fr",
  name: "Client SAS",
  company: "Client SAS",
  siteUrl: "client.fr",
};

describe("planProvision", () => {
  it("crée et analyse un client inconnu", () => {
    const plan = planProvision(active, null);
    expect(plan).toMatchObject({ kind: "create", scan: true, values: { email: "dsi@client.fr" } });
  });

  it("ne fait rien quand la fiche est déjà alignée", () => {
    const current = existing({ siteUrl: planSite("client.fr") });
    expect(planProvision({ ...active, id: ID }, current)).toEqual({ kind: "noop", id: ID });
  });

  it("relance l'analyse quand le site change", () => {
    const plan = planProvision({ ...active, id: ID, siteUrl: "https://nouveau.fr" }, existing());
    expect(plan).toMatchObject({ kind: "update", scan: true, patch: { siteUrl: expect.stringContaining("nouveau.fr") } });
  });

  it("adopte un abonné existant trouvé par son adresse, sans l'analyser à nouveau", () => {
    const current = existing({ siteUrl: planSite("client.fr"), name: "Ancien nom" });
    const plan = planProvision(active, current);
    expect(plan).toMatchObject({ kind: "update", adopted: true, scan: false, patch: { name: "Client SAS" } });
  });

  it("réactive et rescanne une fiche désactivée", () => {
    const plan = planProvision({ ...active, id: ID }, existing({ active: false }));
    expect(plan).toMatchObject({ kind: "update", scan: true, patch: { active: true } });
  });

  it("désactive, et ne désactive pas deux fois", () => {
    expect(planProvision({ id: ID, active: false }, existing())).toEqual({ kind: "deactivate", id: ID });
    expect(planProvision({ id: ID, active: false }, existing({ active: false }))).toEqual({ kind: "noop", id: ID });
  });

  it("refuse un identifiant inconnu et un site invalide", () => {
    expect(planProvision({ ...active, id: ID }, null)).toMatchObject({ kind: "reject", status: 404 });
    expect(planProvision({ ...active, siteUrl: "pas une adresse" }, null)).toMatchObject({ kind: "reject", status: 400 });
  });

  it("n'efface pas un secteur connu avec une colonne vide", () => {
    const plan = planProvision({ ...active, id: ID, sector: null }, existing({ sector: "BTP", siteUrl: planSite("client.fr") }));
    expect(plan).toEqual({ kind: "noop", id: ID });
  });
});

describe("ProvisionRequestSchema", () => {
  it("accepte une désactivation réduite à l'identifiant", () => {
    expect(ProvisionRequestSchema.safeParse({ id: ID, active: false }).success).toBe(true);
  });

  it("exige l'adresse, le nom et le site pour une activation", () => {
    expect(ProvisionRequestSchema.safeParse({ active: true, email: "x@y.fr" }).success).toBe(false);
  });
});

/** Le site tel que `planProvision` le normalise, pour construire une fiche déjà alignée. */
function planSite(raw: string): string {
  const plan = planProvision({ ...active, siteUrl: raw }, null);
  if (plan.kind !== "create") throw new Error("normalisation inattendue");
  return plan.values.siteUrl;
}
