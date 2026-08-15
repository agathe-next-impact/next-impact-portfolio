import { describe, expect, it } from "vitest";
import type { DraftedAlert } from "@sentinelle/types";
import { renderAlertEmail } from "./render";

const CONTENU: DraftedAlert = {
  verdict: "orange",
  title: "PHP 7.4 ne reçoit plus de correctifs",
  body: "Premier paragraphe du corps.\n\nSecond paragraphe, séparé par une ligne vide.",
  whatItChanges: "Une faille découverte demain sur cette branche ne sera pas corrigée.",
  recommendedAction: "Demandez à votre hébergeur de basculer le site en PHP 8.2.",
  diyPossible: true,
  effortEstimate: "15 min",
};

const PROPS = {
  content: CONTENU,
  component: { label: "PHP", version: "7.4.33" },
  siteUrl: "https://exemple.fr/",
  sentAt: new Date("2026-08-15T07:00:00Z"),
};

describe("renderAlertEmail", () => {
  it("rend un objet, un HTML et un texte", async () => {
    const mail = await renderAlertEmail(PROPS);

    expect(mail.subject).toBe("Sentinelle — PHP 7.4 ne reçoit plus de correctifs");
    expect(mail.html).toContain("<!DOCTYPE html");
    expect(mail.text.length).toBeGreaterThan(0);
  });

  it("porte tout le contenu relu — rien ne peut être perdu en route", async () => {
    const { html, text } = await renderAlertEmail(PROPS);

    for (const source of [html, text]) {
      expect(source).toContain("PHP 7.4 ne reçoit plus de correctifs");
      expect(source).toContain("Premier paragraphe du corps.");
      expect(source).toContain("Second paragraphe, séparé par une ligne vide.");
      expect(source).toContain("Une faille découverte demain");
      expect(source).toContain("Demandez à votre hébergeur");
    }
  });

  it("affiche le verdict en clair plutôt qu'en couleur seule", async () => {
    const { text } = await renderAlertEmail(PROPS);
    // Une pastille colorée ne dit rien à qui lit en texte brut, ni à un lecteur
    // d'écran : le libellé doit être écrit.
    expect(text).toContain("À surveiller");
  });

  it("distingue « faisable seul » de « à faire faire »", async () => {
    const seul = await renderAlertEmail(PROPS);
    expect(seul.text).toContain("Faisable de votre côté");
    expect(seul.text).toContain("15 min");

    const accompagne = await renderAlertEmail({
      ...PROPS,
      content: { ...CONTENU, diyPossible: false },
    });
    expect(accompagne.text).toContain("À faire faire");
  });

  it("nomme le composant et sa version — la pièce justificative de l'alerte", async () => {
    const { text } = await renderAlertEmail(PROPS);
    expect(text).toContain("PHP");
    expect(text).toContain("7.4.33");

    const sansVersion = await renderAlertEmail({
      ...PROPS,
      component: { label: "nginx", version: null },
    });
    expect(sansVersion.text).toContain("version inconnue");
  });

  it("omet le bloc « ce que ça change » quand il est vide, sans laisser d'intitulé orphelin", async () => {
    const { text } = await renderAlertEmail({
      ...PROPS,
      content: { ...CONTENU, whatItChanges: "" },
    });

    expect(text).not.toContain("Ce que ça change pour vous");
    expect(text).toContain("Action recommandée");
  });

  it("date le message en heure de Paris et rappelle le site surveillé", async () => {
    const { text } = await renderAlertEmail(PROPS);
    expect(text).toContain("15 août 2026");
    expect(text).toContain("exemple.fr");
  });

  it("dit pourquoi le destinataire reçoit ce message", async () => {
    const { text } = await renderAlertEmail(PROPS);
    expect(text).toContain("surveillance Sentinelle");
  });
});
