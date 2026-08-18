import { describe, expect, it } from "vitest";
import { render } from "@react-email/render";
import { ApercuEmail, type ApercuDone } from "./ApercuEmail";
import { previewApercuEmail, renderApercuEmail } from "./render";

const APERCU: ApercuDone = {
  status: "done",
  titre: "Ce que votre site donne à voir — et ce que Sentinelle en surveillerait",
  chapeau:
    "Votre site tourne sur WordPress 6.2, une version qui a deux ans.\n\n" +
    "Voici ce que les cinq thèmes de la lettre en disent.",
  siteEnUnePhrase: "Un site WordPress 6.2 servi par nginx, avec une mesure d'audience Matomo.",
  ligneCloture: "La prochaine lecture dira si cette version a bougé.",
  themes: [
    { theme: "socle", statut: "surveiller", texte: "WordPress 6.2 date de 2023." },
    { theme: "visibilite", statut: "rien_a_signaler", texte: "Rien d'observable n'appelle d'action." },
    { theme: "performance", statut: "non_observable", texte: "Aucune mesure dans ce dossier." },
    { theme: "ia-donnees", statut: "rien_a_signaler", texte: "Matomo est auto-hébergé." },
    { theme: "couts", statut: "surveiller", texte: "La dépendance au thème est forte." },
  ],
  cap: { scenario: "evoluer", texte: "Une mise à jour majeure est raisonnable." },
  genereLe: "2026-08-18T09:00:00.000Z",
};

const PROPS = {
  apercu: APERCU,
  siteUrl: "https://exemple.fr/",
  genereLe: new Date(APERCU.genereLe),
};

async function texte(props: typeof PROPS): Promise<string> {
  return render(ApercuEmail(props), { plainText: true });
}

describe("ApercuEmail", () => {
  it("rend un document HTML complet, prêt pour l'iframe du rapport", async () => {
    const html = await previewApercuEmail(PROPS);
    expect(html).toContain("<!DOCTYPE html");
  });

  it("porte tout l'habillage et le contenu de la lettre-échantillon", async () => {
    const text = await texte(PROPS);

    expect(text).toContain("Ce que votre site donne à voir");
    expect(text).toContain("Votre site tourne sur WordPress 6.2");
    expect(text).toContain("Un site WordPress 6.2 servi par nginx");
    expect(text).toContain("Socle technique & sécurité");
    expect(text).toContain("Rien à signaler");
    expect(text).toContain("Faire évoluer");
    expect(text).toContain("La prochaine lecture dira si cette version a bougé.");
  });

  it("dit ce qu'il est — un échantillon non relu, pas une surveillance active", async () => {
    const text = await texte(PROPS);

    expect(text).toContain("non relu");
    expect(text).toContain("pas sous surveillance");
    // La phrase par défaut de l'enveloppe — écrite pour un abonné — ne doit
    // jamais apparaître sous les yeux d'un prospect.
    expect(text).not.toContain("parce que votre site est sous surveillance");
  });

  it("annonce ce que l'abonnement ajoute — la démo vend le produit, pas l'inverse", async () => {
    const text = await texte(PROPS);
    expect(text).toContain("Douze axes de lecture");
    expect(text).toContain("relecture humaine");
  });

  it("part par e-mail avec un objet qui nomme le site et dit « échantillon »", async () => {
    const mail = await renderApercuEmail({
      ...PROPS,
      rapportUrl: "http://localhost:3000/scan/abc-123",
    });

    expect(mail.subject).toBe(
      "Sentinelle — l'échantillon de votre lettre de veille pour exemple.fr",
    );
    expect(mail.html).toContain("http://localhost:3000/scan/abc-123");
    expect(mail.text).toContain("revoir votre rapport");
    expect(mail.text.length).toBeGreaterThan(0);
  });

  it("ne rend pas de lien de rapport dans l'iframe — la page est déjà le rapport", async () => {
    const html = await previewApercuEmail(PROPS);
    expect(html).not.toContain("revoir votre rapport");
  });

  it("rend un aperçu d'avant l'habillage (2026-08-18) sans rien casser", async () => {
    const ancien: ApercuDone = {
      status: "done",
      themes: APERCU.themes,
      cap: APERCU.cap,
      genereLe: APERCU.genereLe,
    };
    const text = await texte({ ...PROPS, apercu: ancien });

    expect(text).toContain("Ce que Sentinelle surveillerait pour exemple.fr");
    expect(text).not.toContain("Votre site en une phrase");
    expect(text).toContain("Socle technique & sécurité");
  });
});
