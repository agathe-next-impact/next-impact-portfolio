import { describe, expect, it } from "vitest";
import { buildEvidence } from "./evidence";
import { detect } from "./detect";
import { FINGERPRINTS } from "./fingerprints";
import {
  buildNotes,
  detectPlatform,
  NOTE_DECLARATIF,
  NOTE_PUBLIC,
  NOTE_VERSIONS,
  NOTE_WORDPRESS,
} from "./platform";
import {
  SITE_DRUPAL,
  SITE_MUET,
  SITE_NEXTJS,
  SITE_SHOPIFY,
  WORDPRESS_DURCI,
  WORDPRESS_TYPIQUE,
} from "./__fixtures__/pages";
import type { RawResponse } from "./evidence";

function componentsOf(fixture: RawResponse) {
  return detect(buildEvidence(fixture), FINGERPRINTS);
}

describe("plateforme détectée", () => {
  it("nomme le CMS quand il y en a un", () => {
    expect(detectPlatform(componentsOf(WORDPRESS_TYPIQUE))).toBe("wordpress");
    expect(detectPlatform(componentsOf(WORDPRESS_DURCI))).toBe("wordpress");
    expect(detectPlatform(componentsOf(SITE_DRUPAL))).toBe("drupal");
    expect(detectPlatform(componentsOf(SITE_SHOPIFY))).toBe("shopify");
  });

  it("retombe sur le méta-framework quand aucun CMS n'est détecté", () => {
    expect(detectPlatform(componentsOf(SITE_NEXTJS))).toBe("next");
  });

  it("répond null plutôt que d'inventer une plateforme", () => {
    expect(detectPlatform(componentsOf(SITE_MUET))).toBeNull();
  });

  it("préfère le CMS à la boutique qui l'implique", () => {
    // WooCommerce est détecté sur la fixture WordPress : c'est WordPress qu'on
    // met à jour, pas la boutique.
    const components = componentsOf(WORDPRESS_TYPIQUE);
    expect(components.map((component) => component.slug)).toContain("woocommerce");
    expect(detectPlatform(components)).toBe("wordpress");
  });
});

describe("notes du rapport — une par cas, jamais deux qui se contredisent", () => {
  it("annonce toujours la limite du scan public, et une seule note de portée", () => {
    for (const fixture of [WORDPRESS_TYPIQUE, SITE_DRUPAL, SITE_SHOPIFY, SITE_MUET]) {
      const notes = buildNotes(componentsOf(fixture));
      expect(notes[0]).toBe(NOTE_PUBLIC);

      const portee = notes.filter(
        (note) =>
          note === NOTE_WORDPRESS ||
          note === NOTE_DECLARATIF ||
          note.startsWith("Les composants internes de "),
      );
      expect(portee).toHaveLength(1);
    }
  });

  it("WordPress : énumération partielle des extensions", () => {
    expect(buildNotes(componentsOf(WORDPRESS_TYPIQUE))).toContain(NOTE_WORDPRESS);
  });

  it("Drupal : ne prétend plus qu'aucun CMS n'a été détecté", () => {
    // Non-régression du bug constaté sur drupal.org le 2026-08-15 : le rapport
    // affichait « Drupal 10 » puis, deux lignes plus bas, « Ce site n'utilise
    // pas de CMS détecté publiquement ».
    const notes = buildNotes(componentsOf(SITE_DRUPAL));

    expect(notes).not.toContain(NOTE_DECLARATIF);
    expect(notes).not.toContain(NOTE_WORDPRESS);
    expect(notes.some((note) => note.includes("Les composants internes de Drupal"))).toBe(true);
  });

  it("Shopify : même traitement, sans parler d'extensions WordPress", () => {
    const notes = buildNotes(componentsOf(SITE_SHOPIFY));

    expect(notes).not.toContain(NOTE_DECLARATIF);
    expect(notes.some((note) => note.includes("Les composants internes de Shopify"))).toBe(true);
  });

  it("site sans CMS : fiche déclarative", () => {
    expect(buildNotes(componentsOf(SITE_MUET))).toContain(NOTE_DECLARATIF);
    // Un Next.js n'a pas plus de CMS qu'un site muet : la note est la même.
    expect(buildNotes(componentsOf(SITE_NEXTJS))).toContain(NOTE_DECLARATIF);
  });

  it("prévient quand une version est déduite d'une adresse de fichier", () => {
    // jQuery lu dans un ?ver= sur la fixture WordPress.
    expect(buildNotes(componentsOf(WORDPRESS_TYPIQUE))).toContain(NOTE_VERSIONS);
    // Rien de déduit sur la fixture Drupal : pas d'avertissement inutile.
    expect(buildNotes(componentsOf(SITE_DRUPAL))).not.toContain(NOTE_VERSIONS);
  });
});
