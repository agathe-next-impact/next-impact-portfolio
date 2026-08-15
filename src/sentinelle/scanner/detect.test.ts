import { describe, expect, it } from "vitest";
import { buildEvidence } from "./evidence";
import { detect } from "./detect";
import { FINGERPRINTS } from "./fingerprints";
import type { Fingerprint } from "./types";
import {
  SITE_DRUPAL,
  SITE_MUET,
  SITE_NEXTJS,
  SITE_SHOPIFY,
  WORDPRESS_DURCI,
  WORDPRESS_TYPIQUE,
} from "./__fixtures__/pages";
import type { RawResponse } from "./evidence";

function scan(fixture: RawResponse) {
  const components = detect(buildEvidence(fixture), FINGERPRINTS);
  return {
    components,
    slugs: components.map((component) => component.slug),
    bySlug: (slug: string) => components.find((component) => component.slug === slug),
  };
}

describe("détection agnostique — le moteur ne présuppose aucune technologie", () => {
  it("reconnaît un WordPress typique, sa version, son serveur et son PHP", () => {
    const { slugs, bySlug } = scan(WORDPRESS_TYPIQUE);

    expect(slugs).toContain("wordpress");
    expect(bySlug("wordpress")).toMatchObject({
      version: "6.4.3",
      confidence: "high",
      ecosystem: "wordpress",
      type: "cms",
    });
    expect(bySlug("php")).toMatchObject({ version: "8.1.27", ecosystem: "endoflife" });
    expect(bySlug("apache")).toMatchObject({ version: "2.4.57" });
    // Version lue dans ?ver= : la présence est certaine, la version l'est moins.
    expect(bySlug("jquery")).toMatchObject({
      version: "3.7.1",
      type: "js_library",
      confidence: "high",
      versionConfidence: "medium",
    });
    expect(bySlug("woocommerce")).toMatchObject({ ecosystem: "wordpress" });
  });

  it("reconnaît un WordPress durci malgré l'absence de generator et de versions", () => {
    const { slugs, bySlug } = scan(WORDPRESS_DURCI);

    expect(slugs).toContain("wordpress");
    // Sans generator, la version reste inconnue : on ne l'invente pas.
    expect(bySlug("wordpress")?.version).toBeNull();
    expect(slugs).toContain("cloudflare");
    // Pas de PHP annoncé : on ne le déduit pas de la présence de WordPress.
    expect(slugs).not.toContain("php");
  });

  it("reconnaît un site Next.js sans le confondre avec un CMS", () => {
    const { slugs, bySlug } = scan(SITE_NEXTJS);

    expect(slugs).toContain("next");
    expect(slugs).toContain("vercel");
    expect(slugs).not.toContain("wordpress");
    expect(slugs).not.toContain("php");
    expect(bySlug("next")).toMatchObject({ type: "framework", ecosystem: "npm" });
  });

  it("reconnaît Drupal, son écosystème et son serveur", () => {
    const { slugs, bySlug } = scan(SITE_DRUPAL);

    expect(bySlug("drupal")).toMatchObject({
      version: "10",
      ecosystem: "drupal",
      confidence: "high",
    });
    expect(bySlug("nginx")).toMatchObject({ version: "1.24.0" });
    expect(bySlug("php")).toMatchObject({ version: "8.2.15" });
    expect(slugs).not.toContain("wordpress");
  });

  it("reconnaît une plateforme SaaS et ne lui invente pas d'écosystème de veille", () => {
    const { bySlug, slugs } = scan(SITE_SHOPIFY);

    expect(bySlug("shopify")).toMatchObject({ confidence: "high", ecosystem: null });
    expect(slugs).not.toContain("wordpress");
  });

  it("ne détecte rien plutôt que d'inventer, sur une page muette", () => {
    expect(scan(SITE_MUET).slugs).toEqual([]);
  });
});

describe("déductions", () => {
  it("déduit WordPress de WooCommerce, en confiance dégradée", () => {
    const evidence = buildEvidence({
      url: "https://boutique.fr",
      finalUrl: "https://boutique.fr/",
      status: 200,
      headers: {},
      setCookies: ["woocommerce_cart_hash=abc; path=/"],
      html: "<html><body></body></html>",
    });

    const components = detect(evidence, FINGERPRINTS);
    const wordpress = components.find((component) => component.slug === "wordpress");

    expect(wordpress).toBeDefined();
    expect(wordpress?.confidence).toBe("medium");
    expect(wordpress?.evidence).toContain("déduit de WooCommerce");
  });

  it("n'écrase pas une détection directe par une déduction", () => {
    const { bySlug } = scan(WORDPRESS_TYPIQUE);
    // WooCommerce est présent, mais WordPress a été vu directement : sa version
    // et sa confiance haute doivent survivre.
    expect(bySlug("wordpress")).toMatchObject({ confidence: "high", version: "6.4.3" });
  });
});

describe("robustesse du moteur", () => {
  it("donne le même résultat au deuxième passage (pas d'état résiduel de regex)", () => {
    // Piège classique : une expression /g partagée conserve son curseur.
    const first = scan(WORDPRESS_TYPIQUE).slugs;
    const second = scan(WORDPRESS_TYPIQUE).slugs;
    expect(second).toEqual(first);
  });

  it("retient la confiance la plus forte quand plusieurs signaux touchent", () => {
    const catalogue: Fingerprint[] = [
      {
        slug: "essai",
        label: "Essai",
        type: "cms",
        signals: [
          { on: "html", match: /faible/, confidence: "low" },
          { on: "html", match: /forte/, confidence: "high" },
        ],
      },
    ];

    const evidence = buildEvidence({
      url: "https://x.fr",
      finalUrl: "https://x.fr/",
      status: 200,
      headers: {},
      setCookies: [],
      html: "<html>faible forte</html>",
    });

    expect(detect(evidence, catalogue)[0].confidence).toBe("high");
  });

  it("ne capture une version que si elle est réellement présente", () => {
    const catalogue: Fingerprint[] = [
      {
        slug: "essai",
        label: "Essai",
        type: "cms",
        signals: [{ on: "generator", match: /Essai/, version: /Essai\s+([\d.]+)/ }],
      },
    ];

    const evidence = buildEvidence({
      url: "https://x.fr",
      finalUrl: "https://x.fr/",
      status: 200,
      headers: {},
      setCookies: [],
      html: '<meta name="generator" content="Essai">',
    });

    expect(detect(evidence, catalogue)[0].version).toBeNull();
  });

  it("un catalogue vide ne détecte rien et ne lève pas", () => {
    expect(detect(buildEvidence(SITE_MUET), [])).toEqual([]);
  });
});

describe("qualité du catalogue", () => {
  it("n'a pas de slug en double", () => {
    const slugs = FINGERPRINTS.map((print) => print.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("ne déclare que des implications existantes", () => {
    const slugs = new Set(FINGERPRINTS.map((print) => print.slug));
    for (const print of FINGERPRINTS) {
      for (const implied of print.implies ?? []) {
        expect(slugs.has(implied), `${print.slug} implique ${implied}`).toBe(true);
      }
    }
  });

  it("donne au moins un signal à chaque empreinte", () => {
    for (const print of FINGERPRINTS) {
      expect(print.signals.length, print.slug).toBeGreaterThan(0);
    }
  });

  it("couvre plusieurs familles de technologies", () => {
    const types = new Set(FINGERPRINTS.map((print) => print.type));
    // La veille se veut agnostique : si le catalogue se réduit à un CMS,
    // c'est que la promesse a été perdue en route.
    for (const type of ["cms", "framework", "server", "runtime", "hosting", "cdn", "js_library"]) {
      expect(types.has(type as never), `type manquant : ${type}`).toBe(true);
    }
  });
});
