import { describe, expect, it } from "vitest";
import type { ScanResult } from "@sentinelle/types";
import {
  mergeStack,
  normalizeVersion,
  parseDeclaredComponents,
  resolveDeclared,
  slugify,
  stackItemsFromScan,
  type StackDraft,
} from "./stack";

describe("slugify", () => {
  it("rend un identifiant utilisable depuis un nom saisi à la main", () => {
    expect(slugify("Contact Form 7")).toBe("contact-form-7");
    expect(slugify("  WordPress  ")).toBe("wordpress");
    expect(slugify("Élémentor")).toBe("elementor");
  });

  it("ne rend rien pour une saisie sans lettre ni chiffre", () => {
    expect(slugify("   ")).toBe("");
    expect(slugify("???")).toBe("");
  });
});

describe("normalizeVersion", () => {
  it("accepte les formes qu'un client a réellement sous les yeux", () => {
    expect(normalizeVersion("6.4.3")).toBe("6.4.3");
    expect(normalizeVersion("v2.0")).toBe("2.0");
    expect(normalizeVersion(" 8.2.15-1 ")).toBe("8.2.15-1");
  });

  it("refuse une phrase plutôt que de la comparer un jour à une plage", () => {
    // « à jour » comparé à « < 6.7 » ne produirait pas une erreur : il
    // produirait un verdict, et ce verdict serait faux.
    expect(normalizeVersion("à jour")).toBeNull();
    expect(normalizeVersion("la dernière")).toBeNull();
    expect(normalizeVersion("je ne sais pas")).toBeNull();
    expect(normalizeVersion("")).toBeNull();
    expect(normalizeVersion(null)).toBeNull();
  });
});

describe("resolveDeclared", () => {
  it("impose le type et l'écosystème canoniques d'un composant connu", () => {
    // Le client range PHP dans « service tiers » : le catalogue a raison.
    expect(resolveDeclared("PHP", "saas", null)).toEqual({
      type: "runtime",
      slug: "php",
      ecosystem: "endoflife",
    });
  });

  it("rattrape les écritures courantes qui rateraient le slug", () => {
    expect(resolveDeclared("Node.js", "runtime", null)).toMatchObject({ slug: "nodejs" });
    expect(resolveDeclared("Next.js", "framework", null)).toMatchObject({ slug: "next" });
  });

  it("rattache une extension inconnue à l'écosystème de la plateforme du site", () => {
    // C'est ce qui rend un plugin déclaré immédiatement surveillé : sans ça,
    // la seule chose que l'onboarding apporte vraiment ne servirait à rien.
    expect(resolveDeclared("Advanced Custom Fields", "cms_plugin", "wordpress")).toEqual({
      type: "cms_plugin",
      slug: "advanced-custom-fields",
      ecosystem: "wordpress",
    });
  });

  it("n'invente pas d'écosystème quand la plateforme n'en a pas de catalogue public", () => {
    expect(resolveDeclared("Un module maison", "cms_plugin", "drupal")).toMatchObject({
      ecosystem: null,
    });
    expect(resolveDeclared("o2switch", "hosting", "wordpress")).toMatchObject({
      ecosystem: null,
    });
  });

  it("ne rend rien sur une saisie vide", () => {
    expect(resolveDeclared("  ", "saas", null)).toBeNull();
  });
});

describe("parseDeclaredComponents", () => {
  it("ignore les lignes vides du formulaire", () => {
    const outcome = parseDeclaredComponents([
      { label: "", type: "cms_plugin", version: "" },
      { label: "PHP", type: "runtime", version: "8.2.15" },
    ]);

    expect(outcome.items).toHaveLength(1);
    expect(outcome.rejected).toHaveLength(0);
  });

  it("déclare la version certaine — c'est ce qui autorise un verdict rouge", () => {
    const outcome = parseDeclaredComponents([
      { label: "PHP", type: "runtime", version: "8.2.15" },
    ]);

    expect(outcome.items[0]).toMatchObject({
      source: "declared",
      version: "8.2.15",
      meta: { versionConfidence: "high" },
    });
  });

  it("écarte une version inexploitable au lieu de l'écrire en base", () => {
    const outcome = parseDeclaredComponents([
      { label: "PHP", type: "runtime", version: "la dernière" },
    ]);

    expect(outcome.items).toHaveLength(0);
    expect(outcome.rejected[0].reason).toMatch(/n'est pas un numéro de version/);
  });

  it("fusionne deux lignes identiques plutôt que de faire échouer l'enregistrement", () => {
    // L'index unique (client, slug, type) rejetterait l'insertion entière : une
    // fiche perdue parce qu'on a tapé deux fois « PHP » serait absurde.
    const outcome = parseDeclaredComponents([
      { label: "PHP", type: "runtime", version: "8.2.15" },
      { label: "php", type: "runtime", version: "8.2.16" },
    ]);

    expect(outcome.items).toHaveLength(1);
    expect(outcome.items[0].version).toBe("8.2.16");
  });

  it("signale les composants qu'aucune source ne couvre", () => {
    const outcome = parseDeclaredComponents([
      { label: "o2switch", type: "hosting", version: "" },
      { label: "PHP", type: "runtime", version: "8.2.15" },
    ]);

    expect(outcome.unwatched).toEqual(["o2switch"]);
    expect(outcome.items).toHaveLength(2);
  });
});

describe("stackItemsFromScan", () => {
  const result: ScanResult = {
    url: "https://exemple.fr",
    platform: "wordpress",
    scannedAt: "2026-08-15T10:00:00.000Z",
    notes: [],
    components: [
      {
        type: "cms",
        slug: "wordpress",
        label: "WordPress",
        ecosystem: "wordpress",
        version: "6.4.3",
        confidence: "high",
        versionConfidence: "medium",
        evidence: "meta generator",
      },
    ],
  };

  it("conserve la confiance dans la version — c'est elle qui bride le rouge", () => {
    const [item] = stackItemsFromScan(result);

    expect(item).toMatchObject({
      source: "scanned",
      slug: "wordpress",
      meta: { versionConfidence: "medium", evidence: "meta generator" },
    });
  });
});

describe("mergeStack", () => {
  const scanned: StackDraft = {
    type: "cms",
    slug: "wordpress",
    label: "WordPress",
    version: "6.4.3",
    ecosystem: "wordpress",
    source: "scanned",
    meta: { versionConfidence: "medium" },
  };

  it("laisse gagner le déclaré, jusqu'à la version", () => {
    // Un client qui corrige sa fiche doit voir sa correction tenir, sinon il ne
    // la fera pas deux fois.
    const declared: StackDraft = { ...scanned, version: "6.7.1", source: "declared" };
    const merged = mergeStack([scanned], [declared]);

    expect(merged).toHaveLength(1);
    expect(merged[0]).toMatchObject({ version: "6.7.1", source: "declared" });
  });

  it("garde les deux quand ils ne parlent pas du même composant", () => {
    const autre: StackDraft = {
      type: "runtime",
      slug: "php",
      label: "PHP",
      version: "8.2.15",
      ecosystem: "endoflife",
      source: "declared",
      meta: null,
    };

    expect(mergeStack([scanned], [autre])).toHaveLength(2);
  });
});
