import { describe, expect, it } from "vitest";
import { isAffected } from "@sentinelle/matching";
import { intelFromVulnerability, segmentsFor } from "./osv";
import type { OsvTarget } from "./targets";

// Extrait réel de GHSA-gxr4-xjj5-5px2 (CVE-2020-11022, jQuery), réduit aux
// écosystèmes qui comptent ici : npm — celui qu'on interroge — et NuGet, qui
// doit être ignoré.
const JQUERY_XSS = {
  id: "GHSA-gxr4-xjj5-5px2",
  aliases: ["BIT-drupal-2020-11022", "CVE-2020-11022"],
  summary: "Potential XSS vulnerability in jQuery",
  published: "2020-04-29T22:18:55Z",
  database_specific: { severity: "MODERATE" },
  affected: [
    {
      package: { name: "jquery", ecosystem: "npm" },
      ranges: [{ type: "SEMVER", events: [{ introduced: "1.12.0" }, { fixed: "3.5.0" }] }],
    },
    {
      package: { name: "jquery", ecosystem: "NuGet" },
      ranges: [{ type: "ECOSYSTEM", events: [{ introduced: "1.12.0" }, { fixed: "3.5.0" }] }],
    },
  ],
};

const CIBLE: OsvTarget = {
  pkg: { ecosystem: "npm", name: "jquery" },
  slug: "jquery",
  type: "js_library",
  ecosystem: "npm",
  versions: ["1.12.4"],
};

describe("plages affectées", () => {
  it("ne lit que l'écosystème interrogé", () => {
    // Une plage NuGet appliquée à un paquet npm produirait une alerte chez le
    // mauvais client.
    expect(segmentsFor(JQUERY_XSS, { name: "jquery", ecosystem: "npm" })).toEqual([
      { range: ">= 1.12.0 < 3.5.0", fixedIn: "3.5.0" },
    ]);
    expect(segmentsFor(JQUERY_XSS, { name: "jquery", ecosystem: "PyPI" })).toEqual([]);
  });

  it("gère une borne haute « dernière version affectée »", () => {
    const vuln = {
      id: "X",
      affected: [
        {
          package: { name: "p", ecosystem: "npm" },
          ranges: [{ type: "SEMVER", events: [{ introduced: "2.0" }, { last_affected: "2.4.1" }] }],
        },
      ],
    };

    expect(segmentsFor(vuln, { name: "p", ecosystem: "npm" })).toEqual([
      { range: ">= 2.0 <= 2.4.1", fixedIn: null },
    ]);
  });

  it("découpe une faille à plusieurs plages disjointes", () => {
    // Notre grammaire ne gère pas la disjonction : chaque segment devient un
    // fait distinct, et les segments étant disjoints, un client n'en croise qu'un.
    const vuln = {
      id: "Y",
      affected: [
        {
          package: { name: "p", ecosystem: "npm" },
          ranges: [
            { type: "SEMVER", events: [{ introduced: "0" }, { fixed: "1.2.3" }] },
            { type: "SEMVER", events: [{ introduced: "2.0.0" }, { fixed: "2.0.5" }] },
          ],
        },
      ],
    };

    const items = intelFromVulnerability(vuln, { ...CIBLE, pkg: { ecosystem: "npm", name: "p" } });
    expect(items.map((item) => item.externalId)).toEqual(["Y#1", "Y#2"]);
    expect(items[0].affectedRange).toBe(">= 0 < 1.2.3");
    expect(isAffected({ version: "1.0.0", affectedRange: items[0].affectedRange })).toBe(true);
    expect(isAffected({ version: "1.0.0", affectedRange: items[1].affectedRange })).toBe(false);
  });

  it("garde une faille non corrigée, sans borne haute", () => {
    const vuln = {
      id: "Z",
      affected: [
        { package: { name: "p", ecosystem: "npm" }, ranges: [{ events: [{ introduced: "1.0" }] }] },
      ],
    };

    expect(segmentsFor(vuln, { name: "p", ecosystem: "npm" })).toEqual([
      { range: ">= 1.0", fixedIn: null },
    ]);
  });
});

describe("faits produits depuis OSV", () => {
  it("reprend le ciblage de la cible, pas celui de la source", () => {
    // OSV parle « npm » ; le modèle parle (slug, type, ecosystem). C'est la
    // cible qui fait foi, sans quoi le matching ne rattacherait rien.
    const [item] = intelFromVulnerability(JQUERY_XSS, CIBLE);

    expect(item).toMatchObject({
      kind: "vulnerability",
      source: "osv.dev",
      externalId: "GHSA-gxr4-xjj5-5px2",
      targetSlug: "jquery",
      targetType: "js_library",
      targetEcosystem: "npm",
      affectedRange: ">= 1.12.0 < 3.5.0",
      fixedIn: "3.5.0",
      severity: "medium",
    });
  });

  it("traduit les sévérités GitHub dans le vocabulaire du modèle", () => {
    const critique = { ...JQUERY_XSS, database_specific: { severity: "CRITICAL" } };
    expect(intelFromVulnerability(critique, CIBLE)[0].severity).toBe("critical");

    const inconnue = { ...JQUERY_XSS, database_specific: { severity: "???" } };
    // Une sévérité qu'on ne sait pas lire reste nulle : elle ne pourra fonder
    // qu'un orange, jamais un rouge.
    expect(intelFromVulnerability(inconnue, CIBLE)[0].severity).toBeNull();
  });

  it("préfère le titre de la source, et retombe sur le CVE", () => {
    const sansResume = { ...JQUERY_XSS, summary: null };
    expect(intelFromVulnerability(sansResume, CIBLE)[0].title).toBe(
      "Vulnérabilité CVE-2020-11022",
    );
  });

  it("n'écrit rien quand aucune plage n'est exploitable", () => {
    // Écrire un fait que le matching écarterait laisserait croire à une
    // couverture qui n'existe pas.
    expect(intelFromVulnerability({ id: "W", affected: [] }, CIBLE)).toEqual([]);
    expect(intelFromVulnerability({ pas: "du tout" }, CIBLE)).toEqual([]);
  });
});
