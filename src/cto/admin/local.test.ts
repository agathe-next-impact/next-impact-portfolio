import { describe, expect, it } from "vitest";
import { lireServices, manquesDeSite, normaliserUrlSite, SERVICES, validerNouveauClient, validerSite } from "./local";

describe("adresse de site", () => {
  it("ajoute https et retire la barre finale", () => {
    expect(normaliserUrlSite("cafecitoyen.art/")).toBe("https://cafecitoyen.art");
    expect(normaliserUrlSite("  http://exemple.fr/blog/ ")).toBe("http://exemple.fr/blog");
  });

  it("refuse ce qui n'est pas un site", () => {
    expect(normaliserUrlSite("")).toBeNull();
    expect(normaliserUrlSite("localhost")).toBeNull();
    expect(normaliserUrlSite("deux mots.fr")).toBeNull();
    expect(normaliserUrlSite("ftp://exemple.fr")).toBeNull();
    expect(normaliserUrlSite(null)).toBeNull();
  });
});

describe("services", () => {
  it("ne garde que les services connus, sans doublon, dans l'ordre du catalogue", () => {
    expect(lireServices(["veille-technique", "inconnu", "audit", "veille-technique", "direction-technique"])).toEqual([
      "direction-technique",
      "veille-technique",
      "audit",
    ]);
    expect(lireServices([])).toEqual([]);
  });

  it("le catalogue couvre tous les codes de service de la synchro Notion", async () => {
    const { SERVICE_CODES } = await import("../notion/map");
    expect(SERVICES.map((s) => s.code).sort()).toEqual([...new Set(Object.values(SERVICE_CODES))].sort());
  });
});

describe("site saisi", () => {
  it("normalise l'adresse, nomme le site d'après son hôte et lit l'ID projet", () => {
    expect(validerSite({ url: "lesdoleances.fr", wpUmbrellaProjectId: "156490", watch: true })).toEqual({
      ok: true,
      value: {
        name: "lesdoleances.fr",
        url: "https://lesdoleances.fr",
        wpUmbrellaProjectId: 156490,
        watch: true,
        suiviFormule: null,
        sansSuivi: false,
      },
    });
  });

  it("nomme l'erreur : adresse ou ID projet invalide", () => {
    expect(validerSite({ url: "nimporte quoi", wpUmbrellaProjectId: "abc" })).toMatchObject({ ok: false });
    const r = validerSite({ url: "exemple.fr", wpUmbrellaProjectId: "-4" });
    expect(r.ok === false && r.erreurs[0]).toContain("ID projet WP Umbrella invalide");
  });

  it("ne retient qu'une formule publiée", () => {
    expect(validerSite({ url: "exemple.fr", suiviFormule: "Premium" })).toMatchObject({ ok: true, value: { suiviFormule: null } });
    expect(validerSite({ url: "exemple.fr", suiviFormule: "Actif" })).toMatchObject({ ok: true, value: { suiviFormule: "Actif" } });
  });
});

describe("nouveau client", () => {
  const base = { company: " Auger St Vincent ", contactName: "Claire", contactEmail: "Claire@Client.fr" };

  it("valide, normalise l'e-mail et ignore les lignes de site laissées en blanc", () => {
    const r = validerNouveauClient({
      ...base,
      tier: "referent",
      services: ["suivi-technique", "x"],
      sites: [{ url: "cafecitoyen.art", watch: true }, { url: "", name: "" }],
    });
    expect(r).toMatchObject({
      ok: true,
      value: {
        company: "Auger St Vincent",
        tier: "referent",
        services: ["suivi-technique"],
        contact: { name: "Claire", email: "claire@client.fr", role: null },
      },
    });
    expect(r.ok && r.value.sites).toHaveLength(1);
  });

  it("liste tout ce qui manque d'un coup", () => {
    const r = validerNouveauClient({ company: "", contactEmail: "pas-un-mail", sites: [{ url: "x y" }] });
    expect(r.ok).toBe(false);
    expect(!r.ok && r.erreurs).toHaveLength(4);
  });

  it("refuse deux fois le même site, et retombe sur le palier Direction", () => {
    expect(validerNouveauClient({ ...base, sites: [{ url: "a.fr" }, { url: "https://a.fr/" }] })).toMatchObject({ ok: false });
    expect(validerNouveauClient({ ...base, tier: "inconnu" })).toMatchObject({ ok: true, value: { tier: "direction" } });
  });
});

describe("services sans site pour les honorer", () => {
  it("signale la veille sans site coché et le suivi sans ID WP Umbrella", () => {
    const sites = [{ url: "https://a.fr", watch: false, wpUmbrellaProjectId: null }];
    expect(manquesDeSite(["veille-technique", "suivi-technique"], sites)).toHaveLength(2);
    expect(manquesDeSite(["audit"], sites)).toEqual([]);
    expect(manquesDeSite(["veille-technique", "suivi-technique"], [{ url: "https://a.fr", watch: true, wpUmbrellaProjectId: 4 }])).toEqual([]);
  });
});
