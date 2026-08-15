import { describe, expect, it } from "vitest";
import { decide, versionConfidenceOf, type MatchableIntel, type MatchableStackItem } from "./match";

const MAINTENANT = new Date("2026-08-15T00:00:00.000Z");

function stack(overrides: Partial<MatchableStackItem> = {}): MatchableStackItem {
  return {
    id: "stack-1",
    clientId: "client-1",
    slug: "wordpress",
    type: "cms",
    ecosystem: "wordpress",
    version: "6.4.3",
    label: "WordPress",
    source: "scanned",
    meta: { versionConfidence: "high" },
    ...overrides,
  };
}

function intel(overrides: Partial<MatchableIntel> = {}): MatchableIntel {
  return {
    id: "intel-1",
    kind: "vulnerability",
    source: "wpscan",
    targetSlug: "wordpress",
    targetType: "cms",
    targetEcosystem: "wordpress",
    affectedRange: "< 6.5",
    fixedIn: "6.5",
    severity: "high",
    title: "Faille",
    publishedAt: null,
    ...overrides,
  };
}

describe("jointure — deux technologies homonymes ne se croisent jamais", () => {
  it("croise sur le slug, le type ET l'écosystème", () => {
    expect(decide(stack(), intel(), MAINTENANT).matched).toBe(true);
  });

  it("refuse le paquet npm « wordpress » face au CMS du même nom", () => {
    const decision = decide(
      stack({ slug: "wordpress", type: "cms", ecosystem: "wordpress" }),
      intel({ targetSlug: "wordpress", targetType: "js_library", targetEcosystem: "npm" }),
      MAINTENANT,
    );

    expect(decision).toMatchObject({ matched: false });
    expect(decision.reason).toContain("composant différent");
  });

  it("traite deux écosystèmes nuls comme une égalité", () => {
    const decision = decide(
      stack({ slug: "hugo", type: "framework", ecosystem: null, version: "0.120.0" }),
      intel({
        targetSlug: "hugo",
        targetType: "framework",
        targetEcosystem: null,
        affectedRange: "< 0.130",
      }),
      MAINTENANT,
    );

    expect(decision.matched).toBe(true);
  });
});

describe("versions", () => {
  it("n'alerte pas sans version connue", () => {
    const decision = decide(stack({ version: null }), intel(), MAINTENANT);

    expect(decision).toMatchObject({ matched: false });
    expect(decision.reason).toContain("version inconnue");
  });

  it("n'alerte pas hors de la plage affectée", () => {
    const decision = decide(stack({ version: "6.6.1" }), intel(), MAINTENANT);

    expect(decision).toMatchObject({ matched: false });
    expect(decision.reason).toContain("hors plage");
  });

  it("laisse passer une plage illisible plutôt que de l'interpréter", () => {
    // Une disjonction « || » n'est pas gérée : mieux vaut manquer le fait que
    // de le lire de travers.
    const decision = decide(
      stack(),
      intel({ affectedRange: "< 6.5 || >= 7.0", fixedIn: null }),
      MAINTENANT,
    );

    expect(decision).toMatchObject({ matched: false });
    expect(decision.reason).toContain("illisible");
  });
});

describe("verdicts — le rouge se mérite", () => {
  it("rouge : version affectée, sévérité haute, version certaine", () => {
    expect(decide(stack(), intel({ severity: "critical" }), MAINTENANT)).toMatchObject({
      matched: true,
      verdict: "red",
    });
  });

  it("orange, jamais rouge, sur une version probable", () => {
    // La règle qui protège la crédibilité du service : un `?ver=` peut porter la
    // version du site plutôt que celle du composant.
    const decision = decide(
      stack({ meta: { versionConfidence: "medium" } }),
      intel({ severity: "critical" }),
      MAINTENANT,
    );

    expect(decision).toMatchObject({ matched: true, verdict: "orange" });
    expect(decision.reason).toContain("à vérifier");
  });

  it("orange sur une sévérité modérée, même avec une version certaine", () => {
    expect(decide(stack(), intel({ severity: "medium" }), MAINTENANT)).toMatchObject({
      verdict: "orange",
    });
  });

  it("orange quand la branche n'est plus corrigée", () => {
    const decision = decide(
      stack({ slug: "php", type: "runtime", ecosystem: "endoflife", version: "7.4.33" }),
      intel({
        kind: "eol",
        source: "endoflife.date",
        targetSlug: "php",
        targetType: "runtime",
        targetEcosystem: "endoflife",
        affectedRange: ">= 7.4 < 7.5",
        severity: null,
        publishedAt: new Date("2022-11-28T00:00:00.000Z"),
      }),
      MAINTENANT,
    );

    expect(decision).toMatchObject({ matched: true, verdict: "orange" });
  });

  it("info quand la fin de support approche, silence quand elle est lointaine", () => {
    const eol = (date: string) =>
      decide(
        stack({ slug: "php", type: "runtime", ecosystem: "endoflife", version: "8.2.15" }),
        intel({
          kind: "eol",
          targetSlug: "php",
          targetType: "runtime",
          targetEcosystem: "endoflife",
          affectedRange: ">= 8.2 < 8.3",
          severity: null,
          publishedAt: new Date(date),
        }),
        MAINTENANT,
      );

    expect(eol("2026-12-31T00:00:00.000Z")).toMatchObject({ matched: true, verdict: "info" });
    // Une fin de support en 2029 n'est pas une nouvelle : c'est du bruit.
    expect(eol("2029-12-31T00:00:00.000Z")).toMatchObject({ matched: false });
  });

  it("info sur une version plus récente disponible", () => {
    expect(
      decide(
        stack({ slug: "jquery", type: "js_library", ecosystem: "npm", version: "3.5.1" }),
        intel({
          kind: "release",
          targetSlug: "jquery",
          targetType: "js_library",
          targetEcosystem: "npm",
          affectedRange: ">= 3 < 3.7.1",
          fixedIn: "3.7.1",
          severity: null,
        }),
        MAINTENANT,
      ),
    ).toMatchObject({ matched: true, verdict: "info" });
  });
});

describe("confiance dans la version", () => {
  it("suit la métadonnée quand elle existe", () => {
    expect(versionConfidenceOf(stack({ meta: { versionConfidence: "low" } }))).toBe("low");
  });

  it("fait confiance à ce que le client a déclaré", () => {
    expect(versionConfidenceOf(stack({ source: "declared", meta: null }))).toBe("high");
  });

  it("retombe sur « probable » quand la métadonnée manque — jamais sur « certain »", () => {
    // Une donnée manquante ne doit pas ouvrir la porte au verdict le plus grave.
    expect(versionConfidenceOf(stack({ source: "scanned", meta: null }))).toBe("medium");
  });
});
