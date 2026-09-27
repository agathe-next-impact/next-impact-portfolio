import { describe, expect, it } from "vitest";
import { onePerEmail, type PersonLine } from "./persons";

// Ce que ces tests protègent : deux lignes pour la même adresse ne doivent plus
// faire tomber le balayage sur l'index unique `cto_person_email`. Une seule est
// retenue, et c'est toujours la même d'un balayage à l'autre.

const ligne = (id: string, email: string | null, name: string | null = id): PersonLine => ({ id, email, name });

describe("une adresse, une ligne", () => {
  it("ne signale rien quand chaque adresse est seule", () => {
    expect(onePerEmail([ligne("a", "camille@exemple.fr"), ligne("b", "louis@exemple.fr")], new Map())).toEqual([]);
  });

  it("retient la plus ancienne de deux lignes nouvelles", () => {
    const [doublon] = onePerEmail(
      [ligne("ancienne", "camille@exemple.fr"), ligne("recente", "camille@exemple.fr")],
      new Map(),
    );
    expect(doublon.kept.id).toBe("ancienne");
    expect(doublon.ignored.map((line) => line.id)).toEqual(["recente"]);
  });

  it("retient la ligne que l'accès existant désigne déjà, même plus récente", () => {
    const [doublon] = onePerEmail(
      [ligne("ancienne", "camille@exemple.fr"), ligne("recente", "camille@exemple.fr")],
      new Map([["camille@exemple.fr", "recente"]]),
    );
    expect(doublon.kept.id).toBe("recente");
    expect(doublon.ignored.map((line) => line.id)).toEqual(["ancienne"]);
  });

  it("revient à la plus ancienne quand l'accès désigne une ligne disparue", () => {
    const [doublon] = onePerEmail(
      [ligne("b", "camille@exemple.fr"), ligne("c", "camille@exemple.fr")],
      new Map([["camille@exemple.fr", "supprimee"]]),
    );
    expect(doublon.kept.id).toBe("b");
  });

  it("ignore toutes les lignes en trop, pas seulement la deuxième", () => {
    const [doublon] = onePerEmail(
      [ligne("a", "x@exemple.fr"), ligne("b", "x@exemple.fr"), ligne("c", "x@exemple.fr")],
      new Map(),
    );
    expect(doublon.ignored).toHaveLength(2);
  });

  it("ne prend pas deux lignes sans adresse pour des doublons", () => {
    expect(onePerEmail([ligne("a", null), ligne("b", null)], new Map())).toEqual([]);
  });
});
