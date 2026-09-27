import { describe, expect, it } from "vitest";
import type { ScanResult } from "@sentinelle/types";
import { retenirConcurrents, retenirSecteur, versConcurrent } from "./concurrents";

const SITE = "https://mastora.fr/";
const obtenues = new Set(["comparatif.example/ecoles-de-vente", "annuaire.example/formation"]);

function concurrent(nom: string, site: string, source = "https://comparatif.example/ecoles-de-vente") {
  return { nom, site, motif: "Même offre.", source };
}

describe("retenirSecteur", () => {
  it("garde un secteur sourcé par la recherche ou par le site", () => {
    expect(retenirSecteur({ libelle: "École de vente", source: "https://mastora.fr/programmes" }, obtenues, SITE)).toBe(
      "École de vente",
    );
    expect(retenirSecteur({ libelle: "École de vente", source: "https://inventee.example" }, obtenues, SITE)).toBeNull();
    expect(retenirSecteur({ libelle: " ", source: "https://mastora.fr/" }, obtenues, SITE)).toBeNull();
  });
});

describe("retenirConcurrents", () => {
  it("écarte sources invérifiées, annuaires, le site lui-même et les doublons", () => {
    const retenus = retenirConcurrents(
      [
        concurrent("A", "https://www.ecole-a.fr"),
        concurrent("A bis", "ecole-a.fr/contact"),
        concurrent("B", "ecole-b.com"),
        concurrent("Soi", "https://www.mastora.fr"),
        concurrent("Annuaire", "https://www.pagesjaunes.fr/x"),
        concurrent("Réseau", "https://fr.linkedin.com/company/c"),
        concurrent("Inventé", "https://ecole-c.fr", "https://inventee.example/liste"),
      ],
      obtenues,
      SITE,
    );
    expect(retenus.map((c) => c.nom)).toEqual(["A", "B"]);
    expect(retenus[1]?.url.startsWith("https://ecole-b.com")).toBe(true);
  });

  it("s'arrête à quatre", () => {
    const liste = ["a", "b", "c", "d", "e"].map((x) => concurrent(x, `https://${x}-ecole.fr`));
    expect(retenirConcurrents(liste, obtenues, SITE)).toHaveLength(4);
  });
});

describe("versConcurrent", () => {
  it("reprend les mesures du scanner", () => {
    const result: ScanResult = {
      url: "https://ecole-a.fr/",
      platform: "wordpress",
      components: [
        { type: "cms", slug: "wordpress", label: "WordPress", ecosystem: null, version: "6.8", confidence: "high", versionConfidence: "high" },
        { type: "js_library", slug: "jquery", label: "jQuery", ecosystem: null, version: null, confidence: "high", versionConfidence: null },
      ],
      notes: [],
      scannedAt: "2026-09-27T10:00:00.000Z",
      site: {
        title: "École A",
        description: null,
        lang: "fr",
        h1: ["Devenez commercial"],
        h2: [],
        siteName: null,
        schemaTypes: ["Organization"],
        socialLinks: [],
        navLabels: [],
        excerpt: "",
        wordCount: 0,
        proofs: ["chiffres clés"],
        callsToAction: ["Candidater"],
        formCount: 0,
        contactLinks: 0,
        htmlBytes: 51_200,
        responseMs: 640,
        imageCount: 0,
        imagesWithoutAlt: 0,
        scriptCount: 22,
        thirdPartyHosts: ["a.com", "b.com"],
        hasViewport: true,
        hasCanonical: true,
        hasOpenGraph: true,
        https: true,
        securityHeaders: { hsts: true, csp: false, xFrameOptions: false },
      },
    };
    const mesure = versConcurrent({ ...concurrent("A", "ecole-a.fr"), url: "https://ecole-a.fr/" }, result);
    expect(mesure).toMatchObject({
      nom: "A",
      plateforme: "wordpress",
      composants: ["WordPress"],
      h1: "Devenez commercial",
      responseMs: 640,
      htmlKo: 50,
      scripts: 22,
      domainesTiers: 2,
      hsts: true,
      preuves: ["chiffres clés"],
      appelsAction: ["Candidater"],
    });
  });
});
