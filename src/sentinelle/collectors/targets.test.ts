import { describe, expect, it } from "vitest";
import { sourcesFor } from "./catalog";
import { canonicalOf, planCollection, type WatchedComponent } from "./targets";

const AUCUNE_BASE: string[] = [];

function composant(overrides: Partial<WatchedComponent> & { slug: string }): WatchedComponent {
  const canonical = canonicalOf(overrides.slug);
  return {
    type: canonical?.type ?? "cms_plugin",
    ecosystem: canonical?.ecosystem ?? "wordpress",
    version: null,
    ...overrides,
  };
}

describe("catalogue de sources", () => {
  it("route chaque écosystème vers la base qui le couvre", () => {
    expect(sourcesFor({ slug: "php", type: "runtime", ecosystem: "endoflife" })).toEqual({
      endoflife: "php",
    });
    expect(sourcesFor({ slug: "jquery", type: "js_library", ecosystem: "npm" })).toMatchObject({
      osv: { ecosystem: "npm", name: "jquery" },
    });
    expect(sourcesFor({ slug: "drupal", type: "cms", ecosystem: "drupal" })).toMatchObject({
      endoflife: "drupal",
      osv: { ecosystem: "Packagist", name: "drupal/core" },
    });
  });

  it("traduit les noms qui diffèrent chez la source", () => {
    // Deviner « apache-http-server » depuis « apache » est impossible ; les
    // inventer produirait des 404 quotidiens.
    expect(sourcesFor({ slug: "apache", type: "server", ecosystem: "endoflife" })).toEqual({
      endoflife: "apache-http-server",
    });
    expect(sourcesFor({ slug: "next", type: "framework", ecosystem: "npm" })).toMatchObject({
      endoflife: "nextjs",
    });
  });

  it("déduit le rôle WordPress du type, sans nommer les extensions une à une", () => {
    expect(sourcesFor({ slug: "wordpress", type: "cms", ecosystem: "wordpress" })).toMatchObject({
      wordpress: "core",
    });
    expect(
      sourcesFor({ slug: "contact-form-7", type: "cms_plugin", ecosystem: "wordpress" }),
    ).toEqual({ wordpress: "plugin" });
    expect(sourcesFor({ slug: "astra", type: "cms_theme", ecosystem: "wordpress" })).toEqual({
      wordpress: "theme",
    });
  });

  it("ne fabrique pas de coordonnée quand elle ne se devine pas", () => {
    // Un hébergeur n'a rien à surveiller ; un paquet Packagist inconnu ne se
    // devine pas depuis un slug (« vendor/paquet »).
    expect(sourcesFor({ slug: "o2switch", type: "hosting", ecosystem: null })).toEqual({});
    expect(sourcesFor({ slug: "inconnu", type: "framework", ecosystem: "packagist" })).toEqual({});
  });
});

describe("plan de collecte", () => {
  it("déduplique les cibles entre clients", () => {
    // Dix sites sous le même WordPress : une requête, pas dix.
    const plan = planCollection(
      [
        composant({ slug: "wordpress", version: "6.4.3" }),
        composant({ slug: "wordpress", version: "6.4.3" }),
        composant({ slug: "wordpress", version: "6.5.2" }),
      ],
      { baseline: AUCUNE_BASE },
    );

    expect(plan.endoflife).toEqual(["wordpress"]);
    expect(plan.wordpress).toHaveLength(1);
    expect(plan.wordpress[0].versions).toEqual(["6.4.3", "6.5.2"]);
  });

  it("n'interroge que les sources concernées", () => {
    const plan = planCollection(
      [composant({ slug: "php", version: "7.4.33" })],
      { baseline: AUCUNE_BASE },
    );

    expect(plan.endoflife).toEqual(["php"]);
    expect(plan.osv).toEqual([]);
    expect(plan.wordpress).toEqual([]);
  });

  it("journalise ce qu'il ignore au lieu de le taire", () => {
    const plan = planCollection(
      [
        composant({ slug: "cloudflare", type: "cdn", ecosystem: null }),
        composant({ slug: "cloudflare", type: "cdn", ecosystem: null }),
      ],
      { baseline: AUCUNE_BASE },
    );

    // Une seule entrée malgré le doublon : le journal doit rester lisible.
    expect(plan.skipped).toHaveLength(1);
    expect(plan.skipped[0]).toMatchObject({ slug: "cloudflare" });
  });

  it("surveille le socle même sans aucun client", () => {
    // La veille a de la valeur au premier jour, et un nouvel abonné est couvert
    // à la seconde où sa fiche est créée.
    const plan = planCollection([]);

    expect(plan.endoflife).toContain("php");
    expect(plan.endoflife).toContain("wordpress");
    expect(plan.osv).toEqual([]);
  });

  it("ne perd pas les versions nulles de vue, il les écarte", () => {
    const plan = planCollection(
      [composant({ slug: "jquery", version: null }), composant({ slug: "jquery", version: "3.7.1" })],
      { baseline: AUCUNE_BASE },
    );

    expect(plan.osv[0].versions).toEqual(["3.7.1"]);
  });
});

describe("identité canonique", () => {
  it("reprend le vocabulaire du catalogue d'empreintes", () => {
    // C'est la seule façon que la clé de jointure du matching soit la même des
    // deux côtés.
    expect(canonicalOf("wordpress")).toEqual({ type: "cms", ecosystem: "wordpress" });
    expect(canonicalOf("php")).toEqual({ type: "runtime", ecosystem: "endoflife" });
    expect(canonicalOf("nodejs")).toEqual({ type: "runtime", ecosystem: "endoflife" });
    expect(canonicalOf("inconnu-au-bataillon")).toBeNull();
  });
});
