import type Anthropic from "@anthropic-ai/sdk";
import { describe, expect, it } from "vitest";
import type { ScanResult, SiteSignals } from "@sentinelle/types";
import { renderRedactionBrief } from "./context";
import {
  accorderConclusion,
  bornerGrille,
  bornerLignes,
  bornerMots,
  retenirFaits,
  sansTiret,
  selonCharte,
  urlsObtenues,
} from "./guards";
import { MAX_CARACTERES, MAX_LIGNES, MAX_MOTS, type Grille } from "./schema";

function reponse(urls: string[]): Anthropic.Message {
  return {
    content: [
      {
        type: "web_search_tool_result",
        tool_use_id: "t",
        content: urls.map((url) => ({ type: "web_search_result", url, title: "", encrypted_content: "", page_age: null })),
      },
    ],
  } as unknown as Anthropic.Message;
}

describe("urlsObtenues / retenirFaits", () => {
  const obtenues = urlsObtenues([reponse(["https://www.societe.com/atelier-dupont/"])]);

  it("ne retient que les sources réellement obtenues ou du site analysé", () => {
    const faits = retenirFaits(
      [
        { rubrique: "organisation", enonce: "Société de 20 salariés.", source: "http://www.societe.com/atelier-dupont" },
        { rubrique: "organisation", enonce: "Fondée en 1982.", source: "https://atelier-dupont.fr/histoire" },
        { rubrique: "ecosysteme", enonce: "Citée par la presse.", source: "https://inventee.example/article" },
        { rubrique: "ecosysteme", enonce: "Lien piégé.", source: "javascript:alert(1)" },
      ],
      obtenues,
      "https://www.atelier-dupont.fr/",
    );
    expect(faits.map((f) => f.enonce)).toEqual(["Société de 20 salariés.", "Fondée en 1982."]);
  });

  it("écarte les doublons d'énoncé", () => {
    const fait = { rubrique: "organisation" as const, enonce: "Même fait.", source: "https://atelier-dupont.fr/" };
    expect(retenirFaits([fait, { ...fait }], obtenues, "https://atelier-dupont.fr/")).toHaveLength(1);
  });
});

describe("bornerLignes", () => {
  it("retire les tirets cadratins mais garde les intervalles", () => {
    expect(sansTiret("Vitesse — correcte")).toBe("Vitesse, correcte");
    expect(sansTiret("Entre 2020–2024 – stable")).toBe("Entre 2020–2024, stable");
  });

  it("tient deux phrases, sans puces, avec leur point final", () => {
    const lignes = bornerLignes(["- Un constat", "• Deux constats.", "Trois.", "  "]);
    expect(lignes).toEqual(["Un constat.", "Deux constats."]);
    expect(lignes).toHaveLength(MAX_LIGNES);
  });

  it("tient vingt mots par ligne", () => {
    const longue = bornerLignes(["mot ".repeat(80)])[0] ?? "";
    expect(longue.split(" ")).toHaveLength(MAX_MOTS);
    expect(longue.length).toBeLessThanOrEqual(MAX_CARACTERES);
    expect(longue.endsWith("…")).toBe(true);

    // Coupe à la ponctuation quand elle tombe dans la seconde moitié.
    const phrase =
      "Votre page convainc les directions commerciales et les équipes RH par ses preuves chiffrées, mais elle ne propose qu'une porte d'entrée";
    expect(bornerMots(phrase)).toBe(
      "Votre page convainc les directions commerciales et les équipes RH par ses preuves chiffrées.",
    );
  });
});

describe("selonCharte", () => {
  it("retire mots bannis et superlatif hors citation", () => {
    expect(selonCharte("Une offre clé en main et très lisible.")).toBe("Une offre et lisible.");
    expect(selonCharte("Votre promesse « clé en main » est très claire")).toBe(
      "Votre promesse « clé en main » est claire",
    );
    expect(selonCharte("Des maîtres d'œuvre ultra-rapides")).toBe("Des maîtres d'œuvre rapides");
  });
});

describe("bornerGrille", () => {
  const base: Grille = {
    organisation: { tonalite: "solide", lignes: ["A."] },
    ecosysteme: { tonalite: "indetermine", lignes: ["B."] },
    dispositif: { tonalite: "fragile", lignes: ["C."] },
    conclusion: { issue: "refonte", besoin: "utile", objectif: "Convaincre", lignes: ["D."] },
    examens: [
      { prestation: "optimisation", besoin: "pas_prioritaire", strategique: "S.", commercial: "C." },
      { prestation: "refonte", besoin: "utile", strategique: "S.", commercial: "C." },
      { prestation: "evolution", besoin: "pas_prioritaire", strategique: "S.", commercial: "C." },
    ],
  };

  it("rend la grille bornée", () => {
    expect(bornerGrille(base)).toEqual(base);
  });

  it("refuse une grille sans l'examen des trois prestations", () => {
    expect(bornerGrille({ ...base, examens: base.examens.slice(0, 2) })).toBeNull();
  });

  it("range les examens dans l'ordre du catalogue", () => {
    const grille = bornerGrille({ ...base, examens: [...base.examens].reverse() });
    expect(grille?.examens.map((e) => e.prestation)).toEqual(["optimisation", "refonte", "evolution"]);
  });

  it("accorde la recommandation au besoin le plus fort", () => {
    const examens = base.examens.map((e) =>
      e.prestation === "optimisation" ? { ...e, besoin: "necessaire" as const } : e,
    );
    expect(accorderConclusion(base.conclusion, examens)).toMatchObject({
      issue: "optimisation",
      besoin: "necessaire",
    });
    // À égalité, le choix du modèle tient, avec le besoin de son examen.
    expect(accorderConclusion({ ...base.conclusion, besoin: "necessaire" }, base.examens)).toMatchObject({
      issue: "refonte",
      besoin: "utile",
    });
  });

  it("refuse une grille dont une case est vide", () => {
    expect(bornerGrille({ ...base, dispositif: { tonalite: "fragile", lignes: ["  ", "—"] } })).toBeNull();
  });
});

describe("renderRedactionBrief", () => {
  const site: SiteSignals = {
    title: "Atelier Dupont",
    description: null,
    lang: "fr",
    h1: ["Menuiserie"],
    h2: [],
    siteName: null,
    schemaTypes: [],
    socialLinks: [],
    navLabels: [],
    excerpt: "Texte",
    wordCount: 1,
    proofs: ["témoignages"],
    callsToAction: ["Demander un devis"],
    formCount: 1,
    contactLinks: 2,
    htmlBytes: 20_480,
    responseMs: 1_800,
    imageCount: 0,
    imagesWithoutAlt: 0,
    scriptCount: 3,
    thirdPartyHosts: [],
    hasViewport: true,
    hasCanonical: false,
    hasOpenGraph: false,
    https: true,
    securityHeaders: { hsts: false, csp: false, xFrameOptions: false },
  };
  const result: ScanResult = {
    url: "https://atelier-dupont.fr/",
    platform: "wordpress",
    components: [],
    notes: ["Analyse externe."],
    scannedAt: "2026-09-27T10:00:00.000Z",
  };

  it("donne au modèle les mesures et dit l'absence de faits externes", () => {
    const brief = renderRedactionBrief(result, site, []);
    expect(brief).toContain("1800 ms");
    expect(brief).toContain("20 Ko");
    expect(brief).toContain("Aucun fait externe retenu");
    expect(brief).toContain("Plateforme reconnue : wordpress");
    expect(brief).toContain("Preuves repérées : témoignages");
    expect(brief).toContain("Appels à l'action : Demander un devis");
  });
});
