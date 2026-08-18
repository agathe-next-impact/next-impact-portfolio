import { describe, expect, it } from "vitest";
import { guardLettre, normalizeUrl, wordCount } from "./guards";
import { AXES, type Dossier, type Lettre } from "./schema";

const SOURCE = "https://cert.ssi.gouv.fr/avis/CERTFR-2026-AVI-0001/";

function dossier(overrides: Partial<Dossier> = {}): Dossier {
  return {
    faits: [
      {
        enonce: "Publication d'un avis de sécurité sur le socle du site.",
        date: "2026-08-04",
        source: SOURCE,
        chiffre: "",
        perimetre: "",
        echeance: "",
        famille: "CMS classiques",
        toucheFiche: ["WordPress"],
      },
    ],
    observations: [
      {
        sujet: "Fraîcheur des contenus",
        constat: "Dernière publication datée de mars 2026.",
        statut: "constate",
        page: "https://exemple.fr/actualites",
      },
    ],
    publics: [],
    aConfirmer: [],
    pagesAnalysees: ["https://exemple.fr/"],
    pagesNonAnalysees: [],
    siteInjoignable: "",
    notesDeProduction: "",
    ...overrides,
  };
}

function lettre(overrides: Partial<Lettre> = {}): Lettre {
  return {
    titre: "Août 2026 — Ce que l'actualité change pour exemple.fr",
    ligneContexte: "Analyse externe, sans accès à l'administration.",
    chapeau: "Deux mouvements dominent la quinzaine.",
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
          faitDate: "Avis publié le 2026-08-04.",
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
      signauxDeDemande: ["La demande de refonte reste stable."],
      deFond: Array.from({ length: 4 }, (_, index) => ({
        mouvement: `Mouvement structurel ${index + 1}`,
        faitDate: "2026-08-04",
        qualification: "Neutre pour ce site.",
      })),
      ceQuiNeChangePas: ["Un site lisible reste un site lisible.", "La sauvegarde reste la base."],
      ...overrides.tendances,
    },
    synthese: {
      actions: [{ action: "Demander la version installée.", horizon: "cette semaine", pourquoi: "…" }],
      reste: "Le reste se traite dans la foulée.",
      scenarios: ["Consolider", "Faire évoluer par blocs", "Refondre"].map((nom) => ({
        nom,
        commandePar: "…",
        faitsDeMarche: "…",
        axesCouverts: "1, 2",
        ordreDeCout: "…",
        retourAttendu: "…",
        conditionDeDeclenchement: "Si la version n'est pas fournie sous quinze jours.",
      })),
      aDifferer: [],
      budget: {
        coutTroisACinqAns: "…",
        indicateurs: ["…"],
        pointDEquilibre: "…",
        siPasDeChiffres: "…",
      },
      commentDecider: [{ entree: "…", ceQuElleTeste: "…", date: "2026-09-01" }],
      ...overrides.synthese,
    },
    echeancier: [{ date: "2026-09-01", echeance: "Réexamen du socle", axe: 1 }],
    questions: [
      { question: "Quelle version est installée ?", axes: [2] },
      { question: "Qui applique les correctifs ?", axes: [2] },
      { question: "Quand la dernière sauvegarde a-t-elle été testée ?", axes: [1, 4] },
    ],
    sources: [
      {
        theme: "Sécurité",
        faits: [{ enonce: "Avis de sécurité.", date: "2026-08-04", source: SOURCE }],
      },
    ],
    ligneCloture: "Analyse externe ; les non-observables sont formulés en questions.",
    notesDeProduction: "",
    ...overrides,
  };
}

const FICHE = ["WordPress", "wordpress"];

describe("normalizeUrl", () => {
  it("ramène deux écritures de la même adresse à la même clé", () => {
    expect(normalizeUrl("https://Exemple.fr/page/")).toBe(normalizeUrl("http://exemple.fr/page"));
  });

  it("retire la ponctuation collée en fin d'URL", () => {
    expect(normalizeUrl("https://exemple.fr/page.")).toBe("exemple.fr/page");
  });
});

describe("régime de sourçage", () => {
  it("accepte une lettre dont toutes les sources viennent du dossier", () => {
    const outcome = guardLettre(lettre(), { dossier: dossier(), ficheNames: FICHE, quiet: true });
    expect(outcome.violations).toEqual([]);
    expect(outcome.ok).toBe(true);
  });

  it("refuse une source que le dossier ne contient pas", () => {
    // La fabrication la plus coûteuse du produit, et la plus facile à attraper.
    const invente = lettre({
      sources: [
        {
          theme: "Marché",
          faits: [
            { enonce: "Étude sectorielle.", date: "2026-08-01", source: "https://inconnu.example/etude" },
          ],
        },
      ],
    });

    const outcome = guardLettre(invente, { dossier: dossier(), ficheNames: FICHE, quiet: true });
    expect(outcome.ok).toBe(false);
    expect(outcome.violations.join(" ")).toMatch(/sources absentes du dossier/);
  });

  it("ne compte pas les pages du site (domaine du client) comme sources inventées", () => {
    // Un numéro de semaine calme, sans fait extérieur, peut renvoyer vers les
    // pages du site (/blog, /entreprises) sans qu'on lui reproche une source
    // absente du dossier. Seul le domaine du client est concerné.
    const avecPagesSite = lettre({
      axes: lettre().axes.map((axe) =>
        axe.numero === 1
          ? { ...axe, analyse: "Voir https://www.exemple.fr/blog et https://exemple.fr/entreprises." }
          : axe,
      ),
      sources: [],
    });

    const outcome = guardLettre(avecPagesSite, {
      dossier: dossier({ faits: [] }),
      ficheNames: FICHE,
      quiet: true,
      siteUrl: "https://exemple.fr",
    });
    expect(outcome.violations.join(" ")).not.toMatch(/sources absentes/);
  });

  it("attrape toujours une source externe inventée, même avec un siteUrl", () => {
    const faux = lettre({
      sources: [
        {
          theme: "Marché",
          faits: [{ enonce: "Étude.", date: "2026-08-01", source: "https://inconnu.example/x" }],
        },
      ],
    });
    const outcome = guardLettre(faux, {
      dossier: dossier(),
      ficheNames: FICHE,
      quiet: true,
      siteUrl: "https://exemple.fr",
    });
    expect(outcome.violations.join(" ")).toMatch(/sources absentes.*inconnu\.example/);
  });

  it("refuse une source citée sans date", () => {
    const sansDate = lettre({
      sources: [{ theme: "Sécurité", faits: [{ enonce: "Avis.", date: "", source: SOURCE }] }],
    });

    const outcome = guardLettre(sansDate, { dossier: dossier(), ficheNames: FICHE, quiet: true });
    expect(outcome.violations.join(" ")).toMatch(/sans date/);
  });

  it("refuse une lettre muette alors que le dossier a des faits", () => {
    const outcome = guardLettre(lettre({ sources: [] }), {
      dossier: dossier(),
      ficheNames: FICHE,
      quiet: true,
    });
    expect(outcome.violations.join(" ")).toMatch(/aucune source citée/);
  });
});

describe("régime de vocabulaire", () => {
  it("laisse le marché nommer des technologies que le client n'a pas", () => {
    // C'est le sujet même des tendances : l'ancien garde-fou d'alerte
    // refuserait ce numéro, celui-ci doit l'accepter.
    const marche = lettre({
      tendances: {
        ...lettre().tendances,
        marche: [
          {
            famille: "Générateurs IA",
            mouvement: "Webflow et Shopify accélèrent sur la génération assistée.",
            trajectoire: "hausse",
            lecture: "Rien qui vous concerne cette année.",
          },
        ],
      },
    });

    const outcome = guardLettre(marche, { dossier: dossier(), ficheNames: FICHE, quiet: true });
    expect(outcome.ok).toBe(true);
  });

  it("refuse une technologie attribuée au site hors fiche et hors dossier", () => {
    const faux = lettre({
      axes: lettre().axes.map((axe) =>
        axe.numero === 1 ? { ...axe, analyse: "Votre site tourne sous Drupal 10." } : axe,
      ),
    });

    const outcome = guardLettre(faux, { dossier: dossier(), ficheNames: FICHE, quiet: true });
    expect(outcome.ok).toBe(false);
    expect(outcome.violations.join(" ")).toMatch(/Drupal/);
  });

  it("accepte dans un axe une technologie que le dossier a réellement rapportée", () => {
    // Elle a été trouvée dans une source ouverte pendant la collecte : elle n'a
    // pas été inventée à la rédaction.
    const avecDrupal = dossier({
      faits: [
        {
          enonce: "Drupal publie une version de sécurité.",
          date: "2026-08-04",
          source: SOURCE,
          chiffre: "",
          perimetre: "",
          echeance: "",
          famille: "CMS classiques",
          toucheFiche: [],
        },
      ],
    });

    const cite = lettre({
      axes: lettre().axes.map((axe) =>
        axe.numero === 1
          ? { ...axe, analyse: "L'avis vise Drupal, pas votre socle : non concerné." }
          : axe,
      ),
    });

    expect(guardLettre(cite, { dossier: avecDrupal, ficheNames: FICHE, quiet: true }).ok).toBe(true);
  });
});

describe("structure", () => {
  it("refuse un numéro amputé d'un axe", () => {
    const ampute = lettre({ axes: lettre().axes.slice(0, 4) });
    const outcome = guardLettre(ampute, { dossier: dossier(), ficheNames: FICHE, quiet: true });

    expect(outcome.ok).toBe(false);
    expect(outcome.violations.join(" ")).toMatch(/axes manquants : 5/);
  });

  it("refuse un axe « agir » sans horizon", () => {
    const sansHorizon = lettre({
      axes: lettre().axes.map((axe) => (axe.numero === 1 ? { ...axe, horizon: "" } : axe)),
    });

    expect(
      guardLettre(sansHorizon, { dossier: dossier(), ficheNames: FICHE, quiet: true }).violations.join(" "),
    ).toMatch(/sans horizon/);
  });

  it("refuse plus de trois actions prioritaires", () => {
    const base = lettre();
    const trop = lettre({
      synthese: {
        ...base.synthese,
        actions: Array.from({ length: 4 }, (_, index) => ({
          action: `Action ${index}`,
          horizon: "ce mois-ci",
          pourquoi: "…",
        })),
      },
    });

    expect(
      guardLettre(trop, { dossier: dossier(), ficheNames: FICHE, quiet: true }).violations.join(" "),
    ).toMatch(/trois au maximum/);
  });

  it("refuse un scénario sans condition de déclenchement observable", () => {
    const base = lettre();
    const flou = lettre({
      synthese: {
        ...base.synthese,
        scenarios: base.synthese.scenarios.map((scenario, index) =>
          index === 0 ? { ...scenario, conditionDeDeclenchement: "" } : scenario,
        ),
      },
    });

    expect(
      guardLettre(flou, { dossier: dossier(), ficheNames: FICHE, quiet: true }).violations.join(" "),
    ).toMatch(/condition de déclenchement/);
  });

  it("refuse un renvoi vers un axe inexistant", () => {
    const horsBornes = lettre({
      questions: lettre().questions.map((question, index) =>
        index === 0 ? { ...question, axes: [13] } : question,
      ),
    });

    expect(
      guardLettre(horsBornes, { dossier: dossier(), ficheNames: FICHE, quiet: true }).violations.join(" "),
    ).toMatch(/axe inexistant/);
  });
});

describe("signalements", () => {
  it("signale une longueur hors cible sans bloquer", () => {
    const outcome = guardLettre(lettre(), { dossier: dossier(), ficheNames: FICHE, quiet: false });

    expect(outcome.ok).toBe(true);
    expect(outcome.warnings.join(" ")).toMatch(/numéro court/);
  });

  it("signale un site non analysé", () => {
    const outcome = guardLettre(lettre(), {
      dossier: dossier({ siteInjoignable: "connexion refusée" }),
      ficheNames: FICHE,
      quiet: true,
    });

    expect(outcome.warnings.join(" ")).toMatch(/site non analysé/);
  });

  it("signale l'absence totale de « non concerné »", () => {
    const tout = lettre({
      axes: lettre().axes.map((axe) => ({ ...axe, statut: "surveiller" as const, horizon: "…" })),
    });

    expect(
      guardLettre(tout, { dossier: dossier(), ficheNames: FICHE, quiet: true }).warnings.join(" "),
    ).toMatch(/aucun axe en « non concerné »/);
  });

  it("compte les mots du texte destiné au client, pas de l'encart de production", () => {
    const avecNotes = lettre({ notesDeProduction: "mot ".repeat(500) });
    expect(wordCount(avecNotes)).toBe(wordCount(lettre()));
  });
});
