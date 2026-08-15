import { describe, expect, it } from "vitest";
import { buildEvidence } from "../evidence";
import {
  detectWordPressComponents,
  humanizeSlug,
  isPlausibleVersion,
  versionFromQuery,
} from "./wordpress";
import {
  SITE_NEXTJS,
  WORDPRESS_DURCI,
  WORDPRESS_TYPIQUE,
} from "../__fixtures__/pages";

describe("versionFromQuery", () => {
  it("lit une version numérique", () => {
    expect(versionFromQuery("/style.css?ver=5.9.3")).toBe("5.9.3");
    expect(versionFromQuery("/a.js?x=1&ver=6.4")).toBe("6.4");
  });

  it("ignore une empreinte de cache", () => {
    // Beaucoup de sites mettent un hash dans ?ver= : ce n'est pas une version.
    expect(versionFromQuery("/a.js?ver=a1b2c3")).toBeNull();
    expect(versionFromQuery("/a.js?ver=")).toBeNull();
    expect(versionFromQuery("/a.js")).toBeNull();
  });

  it("ignore un horodatage de cache", () => {
    // Cas réel relevé sur wordpress.org : ?ver=1785161844 est un timestamp.
    // Le laisser passer produirait « version 1785161844 » dans le rapport, et
    // une comparaison de plage absurde au matching.
    expect(versionFromQuery("/style.css?ver=1785161844")).toBeNull();
    expect(versionFromQuery("/style.css?ver=20240115")).toBeNull();
  });

  it("accepte les formes de version plausibles", () => {
    expect(versionFromQuery("/a.js?ver=3")).toBe("3");
    expect(versionFromQuery("/a.js?ver=6.4")).toBe("6.4");
    expect(versionFromQuery("/a.js?ver=1.2.3.4")).toBe("1.2.3.4");
  });
});

describe("isPlausibleVersion", () => {
  it("distingue une version d'un horodatage", () => {
    expect(isPlausibleVersion("6.4.3")).toBe(true);
    expect(isPlausibleVersion("12")).toBe(true);
    expect(isPlausibleVersion("1785161844")).toBe(false);
    expect(isPlausibleVersion("20260815")).toBe(false);
  });
});

describe("humanizeSlug", () => {
  it("rend un slug lisible", () => {
    expect(humanizeSlug("contact-form-7")).toBe("Contact Form 7");
    expect(humanizeSlug("wp_super_cache")).toBe("Wp Super Cache");
  });
});

describe("detectWordPressComponents", () => {
  it("énumère extensions et thème d'un WordPress typique", () => {
    const components = detectWordPressComponents(buildEvidence(WORDPRESS_TYPIQUE));
    const bySlug = (slug: string) => components.find((c) => c.slug === slug);

    expect(bySlug("contact-form-7")).toMatchObject({
      type: "cms_plugin",
      label: "Contact Form 7",
      ecosystem: "wordpress",
      version: "5.9.3",
      versionConfidence: "medium",
      confidence: "high",
    });
    expect(bySlug("woocommerce")?.version).toBe("8.6.1");
    expect(bySlug("elementor")?.version).toBe("3.19.4");
    expect(bySlug("astra")).toMatchObject({ type: "cms_theme", version: "4.6.2" });
  });

  it("trouve les extensions même sans version affichée", () => {
    const components = detectWordPressComponents(buildEvidence(WORDPRESS_DURCI));
    const wordfence = components.find((c) => c.slug === "wordfence");

    expect(wordfence).toMatchObject({
      type: "cms_plugin",
      // La présence est certaine — le fichier est chargé — mais la version non.
      confidence: "high",
      version: null,
      versionConfidence: null,
    });
    expect(components.find((c) => c.slug === "maison")?.type).toBe("cms_theme");
  });

  it("ne trouve rien sur un site qui n'est pas WordPress", () => {
    expect(detectWordPressComponents(buildEvidence(SITE_NEXTJS))).toEqual([]);
  });

  it("ne compte qu'une fois une extension chargée plusieurs fois", () => {
    const evidence = buildEvidence({
      url: "https://x.fr",
      finalUrl: "https://x.fr/",
      status: 200,
      headers: {},
      setCookies: [],
      html: `
        <link href="/wp-content/plugins/yoast-seo/a.css" />
        <script src="/wp-content/plugins/yoast-seo/b.js?ver=21.5"></script>
        <script src="/wp-content/plugins/yoast-seo/c.js"></script>`,
    });

    const yoast = detectWordPressComponents(evidence).filter((c) => c.slug === "yoast-seo");
    expect(yoast).toHaveLength(1);
    // La version vue sur l'une des ressources est conservée.
    expect(yoast[0].version).toBe("21.5");
  });

  it("reconnaît les mu-plugins", () => {
    const evidence = buildEvidence({
      url: "https://x.fr",
      finalUrl: "https://x.fr/",
      status: 200,
      headers: {},
      setCookies: [],
      html: '<script src="/wp-content/mu-plugins/pilote/main.js"></script>',
    });

    expect(detectWordPressComponents(evidence)[0]).toMatchObject({
      slug: "pilote",
      type: "cms_plugin",
    });
  });

  it("donne le même résultat au deuxième passage", () => {
    const evidence = buildEvidence(WORDPRESS_TYPIQUE);
    const first = detectWordPressComponents(evidence).map((c) => c.slug);
    const second = detectWordPressComponents(evidence).map((c) => c.slug);
    expect(second).toEqual(first);
  });
});

describe("non-contamination des versions", () => {
  it("n'attribue pas à un composant la version d'un autre", () => {
    // Régression constatée sur wordpress.org : le ?ver= était cherché dans le
    // HTML entier, si bien que tous les composants héritaient de la première
    // version rencontrée.
    const evidence = buildEvidence({
      url: "https://x.fr",
      finalUrl: "https://x.fr/",
      status: 200,
      headers: {},
      setCookies: [],
      html: `
        <link href="/wp-content/themes/mon-theme/style.css?ver=1.4.0" />
        <script src="/wp-content/plugins/alpha/a.js?ver=9.9.9"></script>
        <script src="/wp-content/plugins/beta/b.js?ver=2.0.1"></script>
        <script src="/wp-content/plugins/gamma/c.js"></script>`,
    });

    const bySlug = (slug: string) =>
      detectWordPressComponents(evidence).find((c) => c.slug === slug);

    expect(bySlug("alpha")?.version).toBe("9.9.9");
    expect(bySlug("beta")?.version).toBe("2.0.1");
    expect(bySlug("mon-theme")?.version).toBe("1.4.0");
    // Sans ?ver= sur sa propre ressource, gamma n'a pas de version — surtout
    // pas celle de son voisin.
    expect(bySlug("gamma")?.version).toBeNull();
  });
});
