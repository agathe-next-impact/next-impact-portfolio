import { describe, expect, it } from "vitest";
import {
  estColonneScore,
  estColonneSolution,
  etatVersion,
  lireReference,
  lireSolution,
  registreEncadre,
  statutScore,
} from "./lecture-audit";

describe("lecture d'un audit", () => {
  it("lit la référence en fin de puce : codes, effort, gravité", () => {
    expect(lireReference("Réinstaller proprement (SEC-05, 1 à 3 h).")).toEqual({
      reste: "Réinstaller proprement",
      codes: ["SEC-05"],
      effort: "1 à 3 h",
      gravite: null,
    });
    expect(lireReference("Durcissement (SEC-03, EXPL-02, 2 à 4 h).")?.codes).toEqual(["SEC-03", "EXPL-02"]);
    expect(lireReference("Fichier inconnu à la racine (C-001, critique).")).toMatchObject({
      codes: ["C-001"],
      gravite: "critique",
    });
    expect(lireReference("Refonte du thème (REF-01, 215 à 430 h).")?.effort).toBe("215 à 430 h");
  });

  it("laisse une source en texte", () => {
    expect(lireReference("Gain estimé (data/44).")).toBeNull();
    expect(lireReference("LCP 3,2 s (data/40, C-012).")).toBeNull();
    expect(lireReference("Sans parenthèse.")).toBeNull();
  });

  it("lit une solution ouverte par ses codes", () => {
    expect(lireSolution("SEC-02 : suppression de l'extension")).toEqual({
      codes: ["SEC-02"],
      texte: "suppression de l'extension",
    });
    expect(lireSolution("SEC-03, EXPL-02 : durcissement")?.codes).toEqual(["SEC-03", "EXPL-02"]);
    expect(lireSolution("Pas de code ici")).toBeNull();
  });

  it("range un encadré en situation ou en solution", () => {
    expect(registreEncadre("Problèmes majeurs")).toBe("situation");
    expect(registreEncadre("Points remarqués")).toBe("situation");
    expect(registreEncadre("Actions prioritaires")).toBe("solution");
    expect(registreEncadre("Préconisations importantes :")).toBe("solution");
    expect(registreEncadre("Serveur")).toBeNull();
  });

  it("reconnaît les colonnes de solution et de score", () => {
    expect(estColonneSolution("Solutions")).toBe(true);
    expect(estColonneSolution("Détails du problème")).toBe(false);
    expect(estColonneScore("Performances", ["65", "", "98"])).toBe(true);
    expect(estColonneScore("Leviers perfs", ["Images, cache"])).toBe(false);
    expect(estColonneScore("SEO", [""])).toBe(false);
  });

  it("applique les seuils Lighthouse", () => {
    expect(statutScore(95)).toBe("bon");
    expect(statutScore(90)).toBe("bon");
    expect(statutScore(65)).toBe("moyen");
    expect(statutScore(49)).toBe("faible");
  });

  it("compare version actuelle et dernière version", () => {
    expect(etatVersion("10.3.8", "11.1.1 (data/10)")).toBe("en-retard");
    expect(etatVersion("1.0.5", "Suppression recommandée")).toBe("a-supprimer");
    expect(etatVersion("1.6.0", "1.6.0, sans canal de mise à jour")).toBe("a-jour");
    expect(etatVersion("5.17.0", "Version alignée sur MailPoet")).toBe("a-jour");
  });
});
