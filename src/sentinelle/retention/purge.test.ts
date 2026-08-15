import { describe, expect, it } from "vitest";
import { anonymousEmail, isAnonymizedEmail } from "./purge";

// Le module importe le client de base, mais `db()` est une fonction : rien ne se
// connecte tant qu'on ne l'appelle pas. Ces deux fonctions sont pures.

describe("adresses de fiches effacées", () => {
  const id = "3ba655a9-8bba-4bbc-9a5a-3cdc1ae68887";

  it("reconnaît ce qu'elle écrit elle-même", () => {
    expect(isAnonymizedEmail(anonymousEmail(id))).toBe(true);
  });

  it("ne prend pas une fiche de démonstration pour une fiche effacée", () => {
    // Le seed vit sur le même domaine `.invalid` sans avoir été purgé : refuser
    // son envoi « parce que la fiche est anonymisée » serait une explication
    // fausse, et elle enverrait chercher un bug là où il n'y en a pas.
    expect(isAnonymizedEmail("demo-nextjs@sentinelle.invalid")).toBe(false);
    expect(isAnonymizedEmail("demo-wordpress@sentinelle.invalid")).toBe(false);
  });

  it("ne se déclenche pas sur une adresse réelle", () => {
    expect(isAnonymizedEmail("client@exemple.fr")).toBe(false);
    expect(isAnonymizedEmail("efface-moi@exemple.fr")).toBe(false);
  });
});
