import { describe, expect, it } from "vitest";
import type { Block } from "../notion/blocks";
import {
  attaque,
  dateEcheance,
  estNoteDeMethode,
  lecture,
  pressionDe,
  priorites,
  structureLettre,
  texteDe,
} from "./structure";

const p = (t: string): Block => ({ k: "p", s: [{ t }] });
const pb = (gras: string, t: string): Block => ({ k: "p", s: [{ t: gras, b: true }, { t }] });
const h = (k: "h1" | "h2" | "h3", t: string): Block => ({ k, s: [{ t }] });

// Août 2026, lu à Paris : minuit à Paris le 1er août.
const PERIODE = new Date("2026-07-31T22:00:00.000Z");

const LETTRE: Block[] = [
  p("Note d'atelier."),
  h("h1", "Août 2026 : trois évolutions"),
  p("Trois évolutions d'août."),
  { k: "hr" },
  h("h2", "Lecture du mois"),
  p("La maintenance a occupé le mois."),
  h("h3", "Le tour des douze axes"),
  pb("Socle technique et architecture.", " Le paysage reste stable : rien ne bouge. WordPress 7.1 est sortie."),
  pb("Sécurité et maintenance.", " La pression monte, sur tous les socles. Détail."),
  pb("Données, mesure et consentement.", " Un axe à surveiller plus qu'à subir ce mois-ci. Détail."),
  pb("Visibilité.", " Le canal Google bouge fortement, la pression est en hausse. Détail."),
  { k: "hr" },
  h("h2", "À faire sur l'existant"),
  h("h3", "1. Correctifs de sécurité : tous les socles"),
  p("6 août - 27 août · WordPress 7.0.3 · wordpress.org, CERT-FR · axes 1 et 2"),
  pb("Ce qui s'est passé.", " WordPress a publié."),
  pb("Ce que ça change.", " Un site peut tomber."),
  pb("À faire cette semaine.", " Obtenir la version installée."),
  h("h3", "2. Google : mise à jour"),
  p("18 août - 31 août · Google Search · axes 4 et 7"),
  pb("À faire ce mois-ci.", " Annoter les dates."),
  { k: "hr" },
  h("h2", "Refonte : quelles solutions envisager"),
  pb("À considérer.", " Rester sur son socle."),
  pb("À différer.", " La 7.1 attend."),
  pb("Ordre de coût.", " 1 340 à 7 000 €."),
  h("h2", "Et aussi"),
  pb("Décisions automatisées.", " Uber sanctionné."),
  pb("Navigateurs.", " Chrome 152."),
  h("h2", "Échéancier"),
  p("Au 1er septembre, toute entreprise doit recevoir des factures."),
  p("Les 14 et 15 septembre, Relay coupe l'accès."),
  p("Le 9 décembre, Drupal 10 cesse d'être maintenu."),
  h("h2", "Questions à adresser au prestataire"),
  { k: "oli", s: [{ t: "Quelle version ?", b: true }] },
  { k: "oli", s: [{ t: "Quel coût ?", b: true }] },
  { k: "hr" },
  p("Agathe, Next Impact"),
];

describe("structureLettre", () => {
  const lettre = structureLettre(LETTRE, PERIODE)!;

  it("reconnaît le gabarit et retire le grand titre de l'accroche", () => {
    expect(lettre).not.toBeNull();
    expect(lettre.intro.map((b) => b.k)).toEqual(["p", "p"]);
    expect(lettre.sections.map((s) => s.kind)).toEqual([
      "prose",
      "axes",
      "actions",
      "options",
      "cartes",
      "echeancier",
      "questions",
    ]);
  });

  it("qualifie la pression de chaque axe par sa première phrase", () => {
    const axes = lettre.sections.find((s) => s.kind === "axes");
    if (axes?.kind !== "axes") throw new Error("axes absents");
    expect(axes.axes.map((a) => [a.numero, a.nom, a.pression])).toEqual([
      [1, "Socle technique et architecture", "stable"],
      [2, "Sécurité et maintenance", "hausse"],
      [3, "Données, mesure et consentement", "surveiller"],
      [4, "Visibilité", "hausse"],
    ]);
    expect(axes.axes[0].verdict).toBe("Le paysage reste stable : rien ne bouge.");
    expect(axes.axes[0].detail.map((s) => s.t).join("")).toBe("WordPress 7.1 est sortie.");
  });

  it("lit les repères, l'urgence et les rubriques d'une action", () => {
    const section = lettre.sections.find((s) => s.kind === "actions");
    if (section?.kind !== "actions") throw new Error("actions absentes");
    const [a, b] = section.actions;
    expect(a.titre).toBe("Correctifs de sécurité : tous les socles");
    expect(a.periode).toBe("6 août - 27 août");
    expect(a.sources).toEqual(["WordPress 7.0.3", "wordpress.org, CERT-FR"]);
    expect(a.axes).toEqual([1, 2]);
    expect(a.urgence).toBe("semaine");
    expect(a.echeance).toBe("Cette semaine");
    expect(a.contexte.map((c) => c.titre)).toEqual(["Ce qui s'est passé", "Ce que ça change"]);
    expect(b.urgence).toBe("mois");
    expect(b.axes).toEqual([4, 7]);
  });

  it("date les échéances dans l'année de l'édition", () => {
    const section = lettre.sections.find((s) => s.kind === "echeancier");
    if (section?.kind !== "echeancier") throw new Error("échéancier absent");
    expect(section.echeances.map((e) => [e.libelle, e.date?.toISOString().slice(0, 10)])).toEqual([
      ["Au 1er septembre", "2026-09-01"],
      ["Les 14 et 15 septembre", "2026-09-14"],
      ["Le 9 décembre", "2026-12-09"],
    ]);
    expect(section.echeances[1].texte.map((s) => s.t).join("")).toBe("Relay coupe l'accès.");
  });

  it("garde la signature après les questions", () => {
    const section = lettre.sections.find((s) => s.kind === "questions");
    if (section?.kind !== "questions") throw new Error("questions absentes");
    expect(section.questions).toHaveLength(2);
    expect(section.blocs).toEqual([p("Agathe, Next Impact")]);
  });

  it("renvoie null pour une lettre hors gabarit", () => {
    expect(structureLettre([p("Un seul paragraphe.")], PERIODE)).toBeNull();
    expect(structureLettre([h("h2", "Titre libre"), p("Du texte.")], PERIODE)).toBeNull();
  });
});

describe("outils", () => {
  it("pressionDe", () => {
    expect(pressionDe("Le marché est stable et de plus en plus lisible.")).toBe("stable");
    expect(pressionDe("La pression reste en hausse.")).toBe("hausse");
    expect(pressionDe("La pression se détend enfin.")).toBe("baisse");
    expect(pressionDe("Rien à signaler.")).toBe("inconnue");
  });

  it("attaque ignore un paragraphe sans gras", () => {
    expect(attaque([{ t: "Texte simple." }])).toBeNull();
  });

  it("dateEcheance passe à l'année suivante pour un mois déjà écoulé", () => {
    expect(dateEcheance("Le 15 janvier", PERIODE)?.toISOString().slice(0, 10)).toBe("2027-01-15");
    expect(dateEcheance("En mars 2028", PERIODE)?.toISOString().slice(0, 10)).toBe("2028-03-01");
    expect(dateEcheance("Bientôt", PERIODE)).toBeNull();
  });
});

describe("lettres personnalisées", () => {
  it("lit les axes « Veilles clients » avec flèche de tendance et rubriques", () => {
    const lettre = structureLettre(
      [
        h("h2", "Lecture du mois"),
        p("Deux calendriers se croisent."),
        h("h2", "Les onze axes du mois pour Mastora"),
        pb("1. Financements de la formation · Tendance : →", ""),
        p("Ce qui s'est passé : Aucune évolution."),
        p("Ce qui impacte votre projet : Chaque page doit être claire. Suite."),
        pb("2. Qualiopi · Tendance : ↑", ""),
        p("Ce qui s'est passé : Décret du 4 août."),
        p("Ce qui impacte votre projet : Chaque affirmation se justifie."),
        pb("3. Marchés · Tendance : ↓", ""),
        p("Ce qui impacte votre projet : Sans objet."),
        h("h2", "Les questions du mois"),
        { k: "oli", s: [{ t: "Quelle version ?" }] },
      ],
      PERIODE,
    )!;
    const axes = lettre.sections.find((s) => s.kind === "axes");
    if (axes?.kind !== "axes") throw new Error("axes absents");
    expect(axes.axes.map((a) => [a.numero, a.nom, a.pression])).toEqual([
      [1, "Financements de la formation", "stable"],
      [2, "Qualiopi", "hausse"],
      [3, "Marchés", "baisse"],
    ]);
    expect(axes.axes[0].verdict).toBe("Chaque page doit être claire.");
    expect(axes.axes[0].rubriques.map((r) => r.titre)).toEqual([
      "Ce qui s'est passé",
      "Ce qui impacte votre projet",
    ]);
    expect(lettre.sections.map((s) => s.kind)).toEqual(["prose", "axes", "questions"]);
  });

  it("lit une lettre rédigée à la main : décision, points en h3, chantiers", () => {
    const lettre = structureLettre(
      [
        h("h2", "À décider ce mois-ci"),
        h("h3", "Le nom de domaine expire le 14 novembre"),
        p("Il est enregistré sur un compte personnel."),
        { k: "li", s: [{ t: "Qui : la présidence." }] },
        h("h2", "Ce qui a bougé dans votre écosystème"),
        h("h3", "PHP 8.2 ne sera plus corrigé"),
        p("Votre site est en PHP 8.3."),
        h("h3", "Le Cyber Resilience Act"),
        p("Vous n'êtes pas visés."),
        h("h2", "Où en sont vos chantiers"),
        { k: "li", s: [{ t: "Formulaire de devis", b: true }, { t: " : 40 %. Livraison le 30 octobre." }] },
        { k: "li", s: [{ t: "Sortie de Divi", b: true }, { t: " : démarre le 2 novembre." }] },
        { k: "hr" },
        p("Prochain comité : mercredi 7 octobre."),
      ],
      PERIODE,
    )!;
    expect(lettre.sections.map((s) => s.kind)).toEqual(["actions", "cartes", "avancement"]);

    const [decision] = (lettre.sections[0] as Extract<typeof lettre.sections[0], { kind: "actions" }>).actions;
    expect(decision.titre).toBe("Le nom de domaine expire le 14 novembre");
    expect(decision.periode).toBeNull();
    expect(decision.echeance).toBe("Ce mois-ci");
    expect(decision.urgence).toBe("mois");
    expect(decision.contexte.map((c) => c.titre)).toEqual(["", "Qui"]);

    const avancement = lettre.sections[2];
    if (avancement.kind !== "avancement") throw new Error("avancement absent");
    expect(avancement.chantiers.map((c) => [c.titre, c.pourcentage, c.statut])).toEqual([
      ["Formulaire de devis", 40, "En cours"],
      ["Sortie de Divi", null, "À venir"],
    ]);
    expect(avancement.chantiers[0].texte.map((s) => s.t).join("")).toBe("Livraison le 30 octobre.");
    expect(avancement.blocs).toEqual([p("Prochain comité : mercredi 7 octobre.")]);
  });
});

describe("toutes sources : la forme décide, pas l'origine", () => {
  // Une édition Signaux Faibles du 14 septembre 2026, lue à Paris.
  const EDITION = new Date("2026-09-13T22:00:00.000Z");

  it("découpe sur les h1 quand ils sont plusieurs, et lit leur niveau de signal", () => {
    const lettre = structureLettre(
      [
        pb("Format", " : veille hebdomadaire."),
        h("h1", "Actualité secteur — FORT"),
        pb("Impact FORT. La RSE devient un critère", " — Événements & Conventions, 16/07/2026. Mesure carbone."),
        pb("Impact MOYEN. Budgets sous tension", " — étude MICE 2026."),
        h("h1", "Actualité acteurs — RAS"),
        pb("Veille réputation : RAS.", " Aucune retombée presse."),
        pb("Abbaye de Belval.", " Signal de fragilité."),
        h("h1", "Action suggérée de la semaine"),
        pb("Immédiat, avant le 1er août : s'inscrire au Festival Oasis.", " Une occasion unique."),
        pb("Chantier à ouvrir dans la foulée :", " audit des pages."),
      ],
      EDITION,
    )!;

    expect(lettre.intro).toHaveLength(1);
    expect(lettre.sections.map((s) => [s.kind, texteDe(s.titre!), s.signal])).toEqual([
      ["cartes", "Actualité secteur", "fort"],
      ["cartes", "Actualité acteurs", "ras"],
      ["actions", "Action suggérée de la semaine", undefined],
    ]);

    const secteur = lettre.sections[0];
    if (secteur.kind !== "cartes") throw new Error("cartes absentes");
    expect(secteur.cartes.map((c) => [c.titre, c.signal])).toEqual([
      ["La RSE devient un critère", "fort"],
      ["Budgets sous tension", "moyen"],
    ]);
    expect(texteDe(secteur.cartes[0].texte)).toBe("Événements & Conventions, 16/07/2026. Mesure carbone.");

    const acteurs = lettre.sections[1];
    if (acteurs.kind !== "cartes") throw new Error("cartes absentes");
    expect(acteurs.cartes[0]).toMatchObject({ titre: "Veille réputation", signal: "ras" });

    const actions = lettre.sections[2];
    if (actions.kind !== "actions") throw new Error("actions absentes");
    expect(actions.actions.map((a) => [a.titre, a.echeance, a.urgence])).toEqual([
      ["S'inscrire au Festival Oasis", "Immédiat, avant le 1er août", "semaine"],
      ["Chantier à ouvrir dans la foulée", "Cette semaine", "semaine"],
    ]);
  });

  it("h1 de rubrique et h2 de thème : chaque thème est une section, ses sources suivent la carte", () => {
    const lettre = structureLettre(
      [
        pb("Note de méthode.", " Fenêtre élargie à 7 jours."),
        h("h1", "L'essentiel du jour"),
        { k: "li", s: [{ t: "La rentrée s'ouvre " }, { t: "sans opérateur national", b: true }] },
        h("h1", "Actualités par thème"),
        h("h2", "① Politique publique & financement — MOYEN"),
        pb("La doctrine de l'après-guichet.", " Le socle reste la réponse du ministère."),
        p("Ce que cela change pour vous : rien avant le PLF."),
        p("Source : Sénat, question écrite n°307984"),
        h("h2", "② Lieux emblématiques — RAS"),
        p("RAS vérifiable cette semaine."),
      ],
      EDITION,
    )!;

    expect(lettre.sections.map((s) => [s.kind, s.titre ? texteDe(s.titre) : null, s.signal])).toEqual([
      ["prose", "L'essentiel du jour", undefined],
      ["prose", "Actualités par thème", undefined],
      ["cartes", "① Politique publique & financement", "moyen"],
      ["prose", "② Lieux emblématiques", "ras"],
    ]);
    const theme = lettre.sections[2];
    if (theme.kind !== "cartes") throw new Error("cartes absentes");
    expect(theme.cartes).toHaveLength(1);
    expect(theme.cartes[0].suite?.map(texteDe)).toEqual(["Ce que cela change pour vous : rien avant le PLF."]);
    expect(theme.cartes[0].sources?.map(texteDe)).toEqual(["Source : Sénat, question écrite n°307984"]);
    expect(theme.blocs).toEqual([]);
  });

  it("une actualité chiffrée en pourcentage n'est pas un chantier", () => {
    const lettre = structureLettre(
      [
        h("h1", "Actualité secteur — FORT"),
        pb("Impact FORT. Séminaires.", " 35 % des événements."),
        pb("Impact MOYEN. Budgets.", " 12 % de baisse."),
        h("h1", "Actualité acteurs — MOYEN"),
        pb("Belval.", " Fragile."),
        pb("Neuville.", " Muette."),
      ],
      EDITION,
    )!;
    expect(lettre.sections.map((s) => s.kind)).toEqual(["cartes", "cartes"]);
  });

  it("le geste de la période : une action, ses rubriques et ses étapes", () => {
    const lettre = structureLettre(
      [
        h("h1", "L'essentiel"),
        p("Une semaine calme."),
        h("h1", "Le geste de la période"),
        pb("Vérifier notre raccordement avant le lundi 14 septembre.", " Une demi-journée."),
        { k: "oli", s: [{ t: "Identifier l'interlocuteur." }] },
        { k: "oli", s: [{ t: "Lui demander la plateforme." }] },
        pb("Pourquoi cette semaine", " : l'obligation court."),
        pb("C'est fait quand", " vous avez trois réponses."),
      ],
      new Date("2026-09-06T22:00:00.000Z"),
    )!;
    const geste = lettre.sections[1];
    if (geste.kind !== "actions") throw new Error("actions absentes");
    expect(geste.actions).toHaveLength(1);
    const [action] = geste.actions;
    expect(action.echeance).toBe("Avant le lundi 14 septembre");
    expect(action.urgence).toBe("semaine");
    expect(action.contexte.map((c) => [c.titre, texteDe(c.texte)])).toEqual([
      ["", "Une demi-journée."],
      ["", "1. Identifier l'interlocuteur."],
      ["", "2. Lui demander la plateforme."],
      ["Pourquoi cette semaine", "l'obligation court."],
      ["C'est fait quand", "vous avez trois réponses."],
    ]);
  });

  it("Sentinelle : axes en h3 numérotés, verdict « À traiter », échéancier en dates ISO", () => {
    const lettre = structureLettre(
      [
        h("h2", "Les douze axes"),
        h("h3", "1. Commercial : offre, conversion, tunnel"),
        p("Un visiteur peut-il demander un devis ?"),
        pb("À traiter", " · Cette semaine : vérifier le formulaire."),
        h("h3", "2. Marketing : acquisition"),
        p("Mon contenu paraît-il vivant ?"),
        pb("À surveiller", " · Réexamen mi-septembre."),
        h("h3", "3. Technique : socle"),
        p("Mon socle est-il à jour ?"),
        h("h3", "Ce qui ne change pas"),
        { k: "li", s: [{ t: "Aucune fin de support connue." }] },
        h("h2", "Échéancier à six mois"),
        { k: "li", s: [{ t: "2026-08-27", b: true }, { t: " · Vérifier le formulaire (axe 1)" }] },
        { k: "li", s: [{ t: "2026-09-15", b: true }, { t: " · Réexaminer les contenus (axe 2)" }] },
      ],
      new Date("2026-08-19T22:00:00.000Z"),
    )!;

    expect(lettre.sections.map((s) => s.kind)).toEqual(["axes", "prose", "echeancier"]);
    const axes = lettre.sections[0];
    if (axes.kind !== "axes") throw new Error("axes absents");
    expect(axes.axes.map((a) => [a.numero, a.nom, a.pression, a.verdict])).toEqual([
      [1, "Commercial", "traiter", "Cette semaine : vérifier le formulaire."],
      [2, "Marketing", "surveiller", "Réexamen mi-septembre."],
      [3, "Technique", "inconnue", "Mon socle est-il à jour ?"],
    ]);
    expect(texteDe(lettre.sections[1].titre!)).toBe("Ce qui ne change pas");

    const echeancier = lettre.sections[2];
    if (echeancier.kind !== "echeancier") throw new Error("échéancier absent");
    expect(
      echeancier.echeances.map((e) => [e.libelle, e.date?.toISOString().slice(0, 10), texteDe(e.texte)]),
    ).toEqual([
      ["27 août 2026", "2026-08-27", "Vérifier le formulaire (axe 1)"],
      ["15 septembre 2026", "2026-09-15", "Réexaminer les contenus (axe 2)"],
    ]);
  });

  it("un h1 unique reste le grand titre, retiré de l'accroche", () => {
    const lettre = structureLettre(LETTRE, PERIODE)!;
    expect(lettre.intro.some((b) => b.k === "h1")).toBe(false);
    expect(lettre.sections[0].titre && texteDe(lettre.sections[0].titre)).toBe("Lecture du mois");
  });
});

describe("lecture groupée", () => {
  const EDITION = new Date("2026-09-13T22:00:00.000Z");
  const SF: Block[] = [
    pb("Note de méthode.", " Fenêtre élargie."),
    h("h1", "L'essentiel du jour"),
    { k: "li", s: [{ t: "Rentrée sans opérateur national." }] },
    h("h1", "Actualités par thème"),
    h("h2", "① Politique publique — MOYEN"),
    pb("La doctrine de l'après-guichet.", " Texte."),
    p("Source : Sénat"),
    h("h2", "② Lieux emblématiques — RAS"),
    p("RAS vérifiable."),
    h("h2", "③ Réseaux — FORT"),
    pb("Portes ouvertes nationales.", " Texte."),
    pb("Recensement 2026.", " Texte."),
    h("h1", "Trois idées de posts de fond"),
    { k: "oli", s: [{ t: "Idée un.", b: true }, { t: " Angle." }] },
    { k: "oli", s: [{ t: "Idée deux.", b: true }, { t: " Angle." }] },
    h("h1", "Le geste de la période"),
    pb("Écrire à la Région avant le vendredi 2 octobre.", " Une demi-heure."),
    h("h1", "Ce qui suit"),
    pb("Réécrire le message.", " Texte."),
    pb("Immédiat : relancer le prestataire.", " Texte."),
    h("h1", "Agenda des quinze jours"),
    p("Vendredi 25 septembre, visioconférence des tiers-lieux."),
    p("Le 1er octobre, fin de la subrogation."),
  ];

  it("range en trois temps : à faire, ce qui bouge, le reste ; l'essentiel à part", () => {
    const lu = lecture(structureLettre(SF, EDITION)!);
    const titres = (liste: { section: { titre: unknown } }[]) =>
      liste.map((p) => texteDe(p.section.titre as never));

    expect(lu.enBref && texteDe(lu.enBref.section.titre!)).toBe("L'essentiel du jour");
    expect(titres(lu.agir)).toEqual(["Le geste de la période", "Ce qui suit", "Agenda des quinze jours"]);
    expect(titres(lu.suivre)).toEqual(["① Politique publique", "③ Réseaux"]);
    expect(lu.suivre.map((p) => p.section.rubrique && texteDe(p.section.rubrique))).toEqual([
      "Actualités par thème",
      "Actualités par thème",
    ]);
    expect(titres(lu.sansSignal)).toEqual(["② Lieux emblématiques"]);
    expect(titres(lu.reste)).toEqual(["Trois idées de posts de fond"]);
  });

  it("remonte les actions les plus pressées, les signaux forts et les prochaines échéances", () => {
    const prio = priorites(structureLettre(SF, EDITION)!, EDITION);
    expect(prio.actions.map((a) => [a.action.titre, a.action.urgence])).toEqual([
      ["Relancer le prestataire", "semaine"],
      ["Écrire à la Région avant le vendredi 2 octobre", "mois"],
      ["Réécrire le message", "plus-tard"],
    ]);
    expect(prio.signaux.map((s) => [s.titre, s.signal])).toEqual([
      ["Portes ouvertes nationales", "fort"],
      ["Recensement 2026", "fort"],
    ]);
    expect(prio.echeances.map((e) => [e.echeance.libelle, e.rang])).toEqual([
      ["Vendredi 25 septembre", 1],
      ["Le 1er octobre", 2],
    ]);
  });

  it("reconnaît une note de méthode en guise de chapô", () => {
    expect(estNoteDeMethode("Note de méthode. L'actualité est pauvre.")).toBe(true);
    expect(estNoteDeMethode("Format : référentiel de veille.")).toBe(true);
    expect(estNoteDeMethode("Trois évolutions à considérer ce mois-ci.")).toBe(false);
  });
});
