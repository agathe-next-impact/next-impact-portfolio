import { describe, expect, it } from "vitest";
import {
  estColonneScore,
  estColonneSolution,
  estTableauScenarios,
  etatVersion,
  lireEtiquettesPoint,
  lireNomScenario,
  lireNombre,
  lirePlanAction,
  lireReference,
  lireSolution,
  registreEncadre,
  roleColonneScenario,
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

  it("reconnaît un tableau de scénarios et le rôle de ses colonnes", () => {
    expect(estTableauScenarios(["Scénario", "Coût (fourchette)", "Délai"])).toBe(true);
    expect(estTableauScenarios(["Critère", "Poids", "Optimisation"])).toBe(false);
    const roles = [
      "Scénario",
      "Note pondérée",
      "Constats restants",
      "Constats résolus",
      "Statut",
      "Condition de choix",
      "Coût 3 ans max",
      "Coût 3 ans min",
      "Coût min",
      "Risques",
      "Coût max",
      "Délai",
      "Résumé",
    ].map(roleColonneScenario);
    expect(roles).toEqual([
      "nom",
      "note",
      "restants",
      "resolus",
      "statut",
      "detail",
      "cout-3ans-max",
      "cout-3ans-min",
      "cout-min",
      "detail",
      "cout-max",
      "delai",
      "resume",
    ]);
    expect(roleColonneScenario("Coût (fourchette)", 1)).toBe("cout");
    expect(roleColonneScenario("À choisir si", 4)).toBe("detail");
  });

  it("lit le nom, le statut et les nombres d'un scénario", () => {
    expect(lireNomScenario("1. Optimisation (retenu)")).toEqual({ nom: "Optimisation", statut: "retenu" });
    expect(lireNomScenario("Refonte headless")).toEqual({ nom: "Refonte headless", statut: null });
    expect(lireNomScenario("Refonte (thème en blocs)")).toEqual({ nom: "Refonte (thème en blocs)", statut: null });
    expect(lireNombre("15 700")).toBe(15700);
    expect(lireNombre("4,05")).toBe(4.05);
    expect(lireNombre("2 500 € HT, lots 1 et 2")).toBeNull();
    expect(lireNombre("")).toBeNull();
  });

  it("donne un domaine et une gravité aux points de synthèse", () => {
    expect(
      lireEtiquettesPoint("Un fichier exécutable d'origine inconnue à la racine du site, et aucune sauvegarde vérifiable."),
    ).toEqual({ domaine: "Sécurité", gravite: "critique", coupe: 0 });
    expect(lireEtiquettesPoint("Données personnelles exposées : 10 496 comptes exportables.")).toMatchObject({
      domaine: "Données personnelles",
      gravite: "critique",
    });
    expect(lireEtiquettesPoint("Cœur ramené à une version antérieure, 27 extensions sur 35 en retard")).toMatchObject({
      domaine: "Maintenance",
      gravite: "eleve",
    });
    expect(
      lireEtiquettesPoint("2 000 lignes de code métier dans le thème : sa mise à jour entraînerait la perte du code, ne pas le mettre à jour expose."),
    ).toMatchObject({ domaine: "Dette technique", gravite: "eleve" });
    expect(lireEtiquettesPoint("Motif déterminant : le thème Vela n’est pas évolutif.")).toMatchObject({
      domaine: "Dette technique",
      gravite: "eleve",
    });
    expect(lireEtiquettesPoint("Optimisation 2 500 € HT, refonte du thème 2 200 € HT")).toMatchObject({
      domaine: "Budget",
      gravite: null,
    });
    expect(lireEtiquettesPoint("Rien à signaler ici.")).toEqual({ domaine: null, gravite: null, coupe: 0 });
  });

  it("préfère la mention explicite en fin de puce", () => {
    const brut = "Les formulaires ne sont pas suivis (Mesure d'audience, élevée).";
    expect(lireEtiquettesPoint(brut)).toEqual({
      domaine: "Mesure d'audience",
      gravite: "eleve",
      coupe: " (Mesure d'audience, élevée).".length,
    });
    // Une parenthèse qui n'est pas une mention reste du texte.
    expect(lireEtiquettesPoint("Mobile lent (data/40).").coupe).toBe(0);
  });
});

describe("plan d'action chiffré", () => {
  const entetes = ["Nom", "Axe", "Fréquence", "Heures", "Proposition"];
  const lignes = [
    ["Sauvegardes", "Disponibilité", "Mensuel", "1", "Monitoring & maintenance"],
    ["Thème sur-mesure", "Développement", "Ponctuel", "120", "Proposition 2 - Refonte"],
    ["Balises de suivi", "Conversion", "Ponctuel", "2", "Proposition 1 - Optimisation"],
    ["Compression des médias", "Performance", "Ponctuel", "3,5", "Proposition 1 - Optimisation"],
    ["Robots et sitemap", "SEO", "Ponctuel", "1", "Proposition 1 - Optimisation"],
    ["Reporting", "Pilotage", "Mensuel", "2", "Monitoring & maintenance"],
    ["Mise à jour ponctuelle", "Technique", "Ponctuel", "4", "Monitoring & maintenance"],
  ];

  it("groupe les tâches par proposition, numérotées d'abord", () => {
    const plan = lirePlanAction(entetes, lignes);
    expect(plan?.groupes.map((g) => g.nom)).toEqual([
      "Proposition 1 - Optimisation",
      "Proposition 2 - Refonte",
      "Monitoring & maintenance",
    ]);
  });

  it("trie par axe dans chaque groupe", () => {
    const plan = lirePlanAction(entetes, lignes)!;
    expect(plan.groupes[0].lignes.map((i) => lignes[i][0])).toEqual([
      "Balises de suivi",
      "Compression des médias",
      "Robots et sitemap",
    ]);
  });

  it("totalise les heures, ponctuelles et mensuelles à part", () => {
    const plan = lirePlanAction(entetes, lignes)!;
    expect(plan.groupes[0].heures).toEqual({ ponctuel: 6.5, mensuel: 0 });
    expect(plan.groupes[2].heures).toEqual({ ponctuel: 4, mensuel: 3 });
    expect(plan.groupes[0].cout).toBeNull();
  });

  it("reconnaît « Scénario ou volet » et une colonne de coût", () => {
    const plan = lirePlanAction(
      ["Nom de l'action", "Axe", "Coût estimé (€)", "Fréquence", "Heures", "Scénario ou volet"],
      [
        ["Cadrage", "Cadrage", "450", "Ponctuel", "5", "Scénario 1"],
        ["Suivi", "Reporting", "90", "Mensuel", "1", "Monitoring et maintenance"],
      ],
    );
    expect(plan?.colGroupe).toBe(5);
    expect(plan?.groupes[1].cout).toEqual({ ponctuel: 0, mensuel: 90 });
  });

  it("laisse un tableau ordinaire tel quel", () => {
    expect(lirePlanAction(["Nom", "Heures"], [["a", "1"]])).toBeNull();
    expect(lirePlanAction(["Nom", "Proposition"], [["a", "P1"], ["b", "P2"]])).toBeNull();
    expect(lirePlanAction(entetes, lignes.map((l) => [...l.slice(0, 4), "Proposition 1"]))).toBeNull();
  });
});
