import { describe, expect, it } from "vitest";
import { render } from "@react-email/render";
import { AXES, type Lettre } from "@sentinelle/lettre";
import { NewsletterEmail } from "./NewsletterEmail";
import { renderEchantillonEmail } from "./render";

// Le gabarit abonné en mode échantillon : même numéro, même mise en page, mais
// l'enveloppe doit dire ce que c'est. Ce qui se teste ici est la frontière
// entre les deux modes — un abonné ne doit jamais voir « échantillon », un
// prospect ne doit jamais lire qu'il est « sous surveillance ».

function lettre(): Lettre {
  return {
    titre: "Août 2026 — Ce que l'actualité change pour exemple.fr",
    ligneContexte: "Analyse externe, sans accès à l'administration.",
    chapeau: "Deux mouvements dominent la semaine.",
    siteEnUnePhrase: "Un site WordPress vivant, dont les contenus datent de mars.",
    axes: AXES.map((nom, index) => ({
      numero: index + 1,
      nom,
      question: `Question de l'axe ${index + 1} ?`,
      analyse: "Rien de nouveau sur cet axe pour ce site.",
      statut: index === 0 ? ("agir" as const) : ("nonConcerne" as const),
      horizon: index === 0 ? "ce mois-ci" : "sans objet",
    })),
    tendances: {
      duMois: [
        {
          tendance: "Les avis de sécurité s'accélèrent.",
          faitDate: "Avis publié le 2026-08-14.",
          sens: "menace",
          pourCeSite: "Le socle est concerné ; la version installée reste à confirmer.",
        },
      ],
      marche: [
        {
          famille: "CMS classiques",
          mouvement: "Consolidation autour de quelques éditeurs.",
          trajectoire: "stable",
          lecture: "Rien qui impose de bouger cette année.",
        },
      ],
      signauxDeDemande: [],
      deFond: [
        {
          mouvement: "Les moteurs IA prennent une part des recherches.",
          faitDate: "2026-08-12",
          qualification: "Neutre pour ce site à ce stade.",
        },
      ],
      ceQuiNeChangePas: ["La sauvegarde reste la base."],
    },
    synthese: {
      actions: [
        {
          action: "Demander la version installée.",
          horizon: "cette semaine",
          pourquoi: "Sans elle, aucune alerte de sécurité n'est vérifiable.",
        },
      ],
      reste: "",
      scenarios: ["Consolider", "Faire évoluer par blocs", "Refondre"].map((nom) => ({
        nom,
        commandePar: "Le budget disponible.",
        faitsDeMarche: "Le marché reste stable.",
        axesCouverts: "1, 2",
        ordreDeCout: "quelques centaines d'euros",
        retourAttendu: "un socle vérifiable",
        conditionDeDeclenchement: "Si la version n'est pas fournie sous quinze jours.",
      })),
      aDifferer: [],
      budget: {
        coutTroisACinqAns: "À établir avec les chiffres du site.",
        indicateurs: ["Trafic mensuel."],
        pointDEquilibre: "Non calculable sans chiffres.",
        siPasDeChiffres: "Commencer par mesurer.",
      },
      commentDecider: [],
    },
    echeancier: [],
    questions: [],
    sources: [],
    ligneCloture: "Analyse externe ; les non-observables sont formulés en questions.",
    notesDeProduction: "",
  };
}

const PROPS = {
  lettre: lettre(),
  siteUrl: "https://exemple.fr/",
  issueDate: new Date("2026-08-18T09:00:00.000Z"),
};

describe("NewsletterEmail — les deux modes", () => {
  it("un numéro abonné ne mentionne jamais l'échantillon", async () => {
    const text = await render(NewsletterEmail(PROPS), { plainText: true });

    expect(text).not.toContain("échantillon");
    expect(text).toContain("parce que votre site est sous surveillance");
  });

  it("l'échantillon porte le numéro entier mais dit ce qu'il est", async () => {
    const mail = await renderEchantillonEmail({
      ...PROPS,
      echantillon: { rapportUrl: "http://localhost:3000/scan/abc-123" },
    });

    expect(mail.subject).toBe(
      "Sentinelle — l'échantillon de votre lettre de veille pour exemple.fr",
    );
    // Le contenu du numéro est là, intégral.
    expect(mail.text).toContain("Ce que l'actualité change pour exemple.fr");
    expect(mail.text).toContain("Les avis de sécurité s'accélèrent.");
    expect(mail.text).toContain("Demander la version installée.");
    // L'enveloppe est celle d'une démonstration, pas d'une surveillance.
    expect(mail.text).toContain("Lettre de veille · échantillon");
    expect(mail.text).toContain("pas sous surveillance");
    expect(mail.text).not.toContain("parce que votre site est sous surveillance");
    // L'encart annonce l'abonnement et ramène au rapport.
    expect(mail.text).toContain("relecture humaine");
    expect(mail.html).toContain("http://localhost:3000/scan/abc-123");
  });

  it("l'iframe du rapport n'a pas de lien vers elle-même", async () => {
    const html = await render(NewsletterEmail({ ...PROPS, echantillon: {} }));
    expect(html).not.toContain("revoir votre rapport");
  });
});
