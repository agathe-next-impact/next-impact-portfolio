import { describe, expect, it } from "vitest";
import {
  alertSubject,
  initialContent,
  missingForValidation,
  parseAlertContent,
  serializeAlertContent,
} from "./content";
import type { DraftedAlert } from "@sentinelle/types";

const CONTENU: DraftedAlert = {
  verdict: "orange",
  title: "PHP 7.4 n'est plus corrigé",
  body: "La branche 7.4 de PHP ne reçoit plus de correctifs de sécurité depuis novembre 2022.",
  whatItChanges: "Une faille découverte aujourd'hui sur cette branche ne sera jamais corrigée.",
  recommendedAction: "Demandez à votre hébergeur de passer le site en PHP 8.2.",
  diyPossible: true,
  effortEstimate: "15 min chez la plupart des hébergeurs",
};

/** Sortie brute du modèle, telle que la décrit le prompt système. */
const GENERE = JSON.stringify({
  verdict: "orange",
  title: CONTENU.title,
  body: CONTENU.body,
  what_it_changes: CONTENU.whatItChanges,
  recommended_action: CONTENU.recommendedAction,
  diy_possible: true,
  effort_estimate: CONTENU.effortEstimate,
});

describe("parseAlertContent", () => {
  it("relit le vocabulaire du modèle (snake_case)", () => {
    expect(parseAlertContent(GENERE)).toEqual(CONTENU);
  });

  it("relit ce qu'il a lui-même écrit (camelCase) — aller-retour stable", () => {
    expect(parseAlertContent(serializeAlertContent(CONTENU))).toEqual(CONTENU);
  });

  it("renvoie null sur du texte libre, plutôt que d'inventer un titre", () => {
    expect(parseAlertContent("Bonjour, votre site est à jour.")).toBeNull();
    expect(parseAlertContent(null)).toBeNull();
    expect(parseAlertContent("   ")).toBeNull();
  });

  it("renvoie null sur un JSON incomplet ou de verdict inconnu", () => {
    expect(parseAlertContent(JSON.stringify({ verdict: "orange", title: "x" }))).toBeNull();
    expect(parseAlertContent(JSON.stringify({ ...CONTENU, verdict: "rouge" }))).toBeNull();
  });
});

describe("serializeAlertContent", () => {
  it("retire les espaces de bord sans toucher au contenu", () => {
    const sale = { ...CONTENU, title: "  PHP 7.4  ", body: "\nCorps\n" };
    expect(parseAlertContent(serializeAlertContent(sale))).toMatchObject({
      title: "PHP 7.4",
      body: "Corps",
    });
  });
});

describe("initialContent", () => {
  it("préfère le texte relu au texte généré", () => {
    const relu = serializeAlertContent({ ...CONTENU, title: "Titre réécrit" });
    const depart = initialContent({
      finalText: relu,
      generatedText: GENERE,
      verdict: "orange",
    });

    expect(depart.title).toBe("Titre réécrit");
  });

  it("amorce le formulaire depuis le texte généré quand rien n'a été relu", () => {
    expect(
      initialContent({ finalText: null, generatedText: GENERE, verdict: "orange" }),
    ).toEqual(CONTENU);
  });

  it("laisse le verdict de la base primer — c'est lui qu'ont abaissé les garde-fous", () => {
    const depart = initialContent({ finalText: null, generatedText: GENERE, verdict: "green" });
    expect(depart.verdict).toBe("green");
  });

  it("ne perd pas un texte libre : il atterrit dans le corps", () => {
    const depart = initialContent({
      finalText: "Note écrite à la main",
      generatedText: null,
      verdict: null,
    });

    expect(depart.body).toBe("Note écrite à la main");
    expect(depart.title).toBe("");
    expect(depart.verdict).toBe("info");
  });

  it("part d'une fiche vide quand il n'y a rien", () => {
    expect(initialContent({ finalText: null, generatedText: null, verdict: null })).toEqual({
      verdict: "info",
      title: "",
      body: "",
      whatItChanges: "",
      recommendedAction: "",
      diyPossible: false,
      effortEstimate: "",
    });
  });
});

describe("missingForValidation", () => {
  it("laisse passer un contenu complet", () => {
    expect(missingForValidation(CONTENU)).toEqual([]);
  });

  it("nomme chaque manque — un message d'erreur qui dit quoi faire", () => {
    expect(
      missingForValidation({ ...CONTENU, title: "  ", body: "", recommendedAction: "\n" }),
    ).toEqual(["le titre", "le corps du message", "l'action recommandée"]);
  });

  it("n'exige ni « ce que ça change » ni l'estimation d'effort", () => {
    expect(missingForValidation({ ...CONTENU, whatItChanges: "", effortEstimate: "" })).toEqual([]);
  });
});

describe("alertSubject", () => {
  it("préfixe le titre relu", () => {
    expect(alertSubject(CONTENU)).toBe("Sentinelle — PHP 7.4 n'est plus corrigé");
  });

  it("reste envoyable même sans titre", () => {
    expect(alertSubject({ ...CONTENU, title: "  " })).toBe("Sentinelle — Alerte de veille");
  });
});
