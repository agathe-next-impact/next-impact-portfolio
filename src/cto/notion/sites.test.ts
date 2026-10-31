import { describe, expect, it } from "vitest";
import { fusionnerProjets } from "../site/store";
import { fusionOrganisations } from "./map";
import { siteLePlusUrgent } from "../espace/pilotage";
import { nomDuSite, planifier, type SiteExistant, type SiteVoulu } from "./sites";

const voulu = (page: string, extra: Partial<SiteVoulu> = {}): SiteVoulu => ({
  notionPageId: page,
  clientId: "c1",
  name: `Site ${page}`,
  url: null,
  wpUmbrellaProjectId: 10,
  watch: false,
  suiviFormule: null,
  sansSuivi: false,
  position: 0,
  ...extra,
});

const existant = (page: string, extra: Partial<SiteExistant> = {}): SiteExistant => ({
  id: `id-${page}`,
  clientId: "c1",
  notionPageId: page,
  name: `Site ${page}`,
  url: null,
  wpUmbrellaProjectId: 10,
  watch: false,
  suiviFormule: null,
  sansSuivi: false,
  position: 0,
  removedAt: null,
  ...extra,
});

describe("nom d'un site", () => {
  it("préfère le nom saisi, puis l'adresse nue, puis un repli", () => {
    expect(nomDuSite("  Boutique ", "https://exemple.fr")).toBe("Boutique");
    expect(nomDuSite(null, "https://exemple.fr/")).toBe("exemple.fr");
    expect(nomDuSite(null, null)).toBe("Site");
  });
});

describe("plan de la synchro des sites", () => {
  it("crée un site nouveau, sans toucher aux autres", () => {
    const plan = planifier([voulu("a"), voulu("b")], [existant("a")], new Set(["a", "b"]));
    expect(plan.creer.map((s) => s.notionPageId)).toEqual(["b"]);
    expect(plan.mettreAJour).toEqual([]);
    expect(plan.retirer).toEqual([]);
  });

  it("ne met à jour que ce qui a changé, et rouvre un site retiré", () => {
    const plan = planifier(
      [voulu("a", { url: "https://a.fr", wpUmbrellaProjectId: 11 }), voulu("b")],
      [existant("a"), existant("b", { removedAt: new Date("2026-10-01") })],
      new Set(["a", "b"]),
    );
    expect(plan.mettreAJour).toEqual([
      { id: "id-a", patch: { url: "https://a.fr", wpUmbrellaProjectId: 11 } },
      { id: "id-b", patch: { removedAt: null } },
    ]);
  });

  it("rattache à un autre client un site dont la ligne a changé de client", () => {
    const plan = planifier([voulu("a", { clientId: "c2" })], [existant("a")], new Set(["a"]));
    expect(plan.mettreAJour).toEqual([{ id: "id-a", patch: { clientId: "c2" } }]);
  });

  it("retire un site dont la ligne a disparu, mais pas une ligne vue et non rattachable", () => {
    const plan = planifier([], [existant("a"), existant("b"), existant("c", { removedAt: new Date() })], new Set(["b"]));
    expect(plan.retirer.map((s) => s.notionPageId)).toEqual(["a"]);
  });
});

describe("projets d'un accompagnement", () => {
  const site = (projectId: number, position: number, name: string | null = null) => ({
    formule: null,
    projectId,
    name,
    url: null,
    position,
  });

  it("garde le projet de la fiche comme site de plus tant que la base ne le reprend pas", () => {
    expect(fusionnerProjets([site(2, 1), site(3, 0)], 9).map((s) => s.projectId)).toEqual([3, 2, 9]);
  });

  it("ne le double pas quand un site de la base le reprend", () => {
    expect(fusionnerProjets([site(9, 0, "Boutique")], 9)).toEqual([site(9, 0, "Boutique")]);
  });

  it("rend le seul projet de la fiche, comme avant la base Sites", () => {
    expect(fusionnerProjets([], 9).map((s) => s.projectId)).toEqual([9]);
    expect(fusionnerProjets([], null)).toEqual([]);
  });
});

describe("organisations d'un client", () => {
  it("garde la raison sociale de la fiche client à plusieurs organisations, et réunit tous les packs sans doublon", () => {
    expect(
      fusionOrganisations(
        [
          { name: "Fédération Nord", pack: "pack-sport" },
          { name: "Ligue Sud", pack: "pack-culture" },
          { name: "Club Est", pack: "pack-sport" },
        ],
        "Auger St Vincent",
      ),
    ).toEqual({
      company: "Auger St Vincent",
      sector: "pack-sport",
      sectors: ["pack-sport", "pack-culture"],
      organisations: ["Fédération Nord", "Ligue Sud", "Club Est"],
    });
  });

  it("nomme le client d'après son organisation quand il n'en a qu'une", () => {
    expect(fusionOrganisations([{ name: "Mastora SAS", pack: "pack-formation" }], "Mastora")).toMatchObject({
      company: "Mastora SAS",
      sector: "pack-formation",
    });
    expect(fusionOrganisations([{ name: null, pack: null }], "Mastora")?.company).toBe("Mastora");
  });

  it("ne devine pas de pack quand aucune organisation n'en a", () => {
    expect(fusionOrganisations([{ name: null, pack: null }, { name: "Ligue", pack: null }], "Actuel")).toEqual({
      company: "Actuel",
      sector: null,
      sectors: null,
      organisations: ["Ligue"],
    });
  });

  it("ne touche à rien sans fiche lisible", () => {
    expect(fusionOrganisations([], "Actuel")).toBeNull();
  });
});

describe("niveaux de service par site", () => {
  const site = (projectId: number, formule: string | null = null) => ({
    projectId,
    name: `Site ${projectId}`,
    url: null,
    formule,
    position: projectId,
  });

  it("ne rend pas par la fiche client un projet marqué « Sans suivi »", () => {
    expect(fusionnerProjets([site(2)], 9, [9]).map((s) => s.projectId)).toEqual([2]);
    expect(fusionnerProjets([], 9, [9])).toEqual([]);
  });

  it("garde la formule de chaque site", () => {
    expect(fusionnerProjets([site(1, "Actif"), site(2, "Essentiel"), site(3)], null).map((s) => "formule" in s && s.formule)).toEqual([
      "Actif",
      "Essentiel",
      null,
    ]);
  });
});

describe("plan : niveaux de service", () => {
  it("met à jour la formule et le « Sans suivi » d'un site", () => {
    const plan = planifier(
      [voulu("a", { suiviFormule: "Actif", sansSuivi: true })],
      [existant("a")],
      new Set(["a"]),
    );
    expect(plan.mettreAJour).toEqual([{ id: "id-a", patch: { suiviFormule: "Actif", sansSuivi: true } }]);
  });
});

describe("site le plus urgent avec des sites non supervisés", () => {
  const etat = (projectId: number | null, nom: string) => ({
    projectId,
    name: nom,
    url: null,
    snapshot: null,
    fetchedAt: null,
    error: null,
    errorAt: null,
  });

  it("préfère un site supervisé à un site sans projet, même placé après", () => {
    expect(siteLePlusUrgent([etat(null, "EGC"), etat(7, "Café citoyen")])?.name).toBe("Café citoyen");
  });

  it("garde le seul site sans projet quand il n'y en a pas d'autre", () => {
    expect(siteLePlusUrgent([etat(null, "EGC")])?.name).toBe("EGC");
  });
});
