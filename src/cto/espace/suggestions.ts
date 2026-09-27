// ─────────────────────────────────────────────────────────────────────────────
// « Prochaine étape » : UNE suggestion à la fois, déclenchée par un fait de
// l'espace. Pur, testé.
//
// La règle du site s'applique ici aussi : prouver avant de demander. Chaque
// suggestion cite le fait qui la motive (une proposition en attente, une
// faille relevée, un audit remis), jamais une offre sortie de nulle part.
//
// L'ordre des déclencheurs est l'ordre de priorité : le premier qui s'applique
// gagne. Aucun montant (décision du 2026-09-27).
// ─────────────────────────────────────────────────────────────────────────────

/** Une suggestion masquée (« Pas maintenant ») ne revient pas avant ce délai. */
export const MASQUAGE_JOURS = 60;
/** La fin des mois de suivi inclus s'annonce ce nombre de jours avant. */
export const ANNONCE_FIN_SUIVI_JOURS = 30;
/** La fin de la veille offerte s'annonce ce nombre de jours avant… */
export const ANNONCE_FIN_VEILLE_JOURS = 7;
/** … et se rappelle jusqu'à ce nombre de jours après. */
export const RAPPEL_FIN_VEILLE_JOURS = 30;
/** À partir de combien d'opportunités en attente le palier Direction technique se justifie. */
export const SEUIL_ARBITRAGES = 3;

const JOUR = 86_400_000;

export interface Suggestion {
  /** Stable : c'est la clé du masquage et du journal. */
  id: string;
  titre: string;
  /** Le fait constaté, cité tel quel : la preuve avant la demande. */
  fait: string;
  texte: string;
  /** Où mène le bouton : une page de l'espace, ou un message à Agathe. */
  action: { libelle: string } & ({ vers: "page"; chemin: string } | { vers: "contact"; objet: string });
  /** Faux pour ce qui est une réponse attendue (une proposition), pas une offre. */
  masquable: boolean;
}

export interface FaitsEspace {
  status: string;
  tier: string;
  services: string[] | null;
  suggestionsCoupees: boolean;
  suiviInclusJusquau: Date | null;
  /** Fin de la veille offerte (client ponctuel) ; null pour un client récurrent. */
  veilleOfferteJusquau: Date | null;
  /** Propositions commerciales sans réponse, la plus récente d'abord. */
  propositionsEnAttente: { titre: string; chemin: string }[];
  audits: number;
  /** Opportunités de la roadmap en attente d'arbitrage. */
  arbitrages: number;
  /** Alertes critiques sur le site (relevé du suivi ou veille technique). */
  alertesCritiques: number;
  /** Suggestions masquées par la personne : id → ISO. */
  masquees: Record<string, string>;
  maintenant: Date;
}

const jourLisible = (date: Date) =>
  new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", timeZone: "Europe/Paris" }).format(date);

/** Les déclencheurs, dans l'ordre de priorité. Chacun rend sa suggestion ou null. */
const DECLENCHEURS: ((f: FaitsEspace) => Suggestion | null)[] = [
  // 1. Une réponse attendue passe avant toute offre.
  (f) => {
    const [proposition] = f.propositionsEnAttente;
    if (!proposition) return null;
    return {
      id: "proposition",
      titre: "Une proposition attend votre réponse",
      fait: `« ${proposition.titre} »`,
      texte: "Un scénario vous convient, ou vous voulez l'ajuster ? La proposition se lit et se commente en ligne.",
      action: { libelle: "Lire la proposition", vers: "page", chemin: proposition.chemin },
      masquable: false,
    };
  },

  // 2. La veille offerte à l'ouverture de l'espace se termine (client ponctuel) :
  //    annoncée une semaine avant, rappelée un mois après.
  (f) => {
    const fin = f.veilleOfferteJusquau;
    if (!fin) return null;
    const ecart = fin.getTime() - f.maintenant.getTime();
    if (ecart > ANNONCE_FIN_VEILLE_JOURS * JOUR || ecart < -RAPPEL_FIN_VEILLE_JOURS * JOUR) return null;
    const terminee = ecart < 0;
    return {
      id: `veille-offerte-${fin.toISOString().slice(0, 10)}`,
      titre: terminee ? "Votre veille offerte s'est terminée" : "Votre veille offerte se termine",
      fait: `Le ${jourLisible(fin)}`,
      texte:
        "Les lettres déjà reçues restent dans votre espace. Pour continuer à suivre votre écosystème et les alertes sur votre site, la veille peut se prolonger.",
      action: { libelle: "En parler", vers: "contact", objet: "Continuer la veille" },
      masquable: true,
    };
  },

  // 3. La fin des mois de suivi inclus dans un forfait : le moment naturel de la suite.
  (f) => {
    const fin = f.suiviInclusJusquau;
    if (!fin) return null;
    const reste = fin.getTime() - f.maintenant.getTime();
    if (reste < 0 || reste > ANNONCE_FIN_SUIVI_JOURS * JOUR) return null;
    return {
      // Daté : une nouvelle période incluse repose la question, même masquée.
      id: `suivi-inclus-${fin.toISOString().slice(0, 10)}`,
      titre: "Vos mois de suivi inclus se terminent",
      fait: `Le ${jourLisible(fin)}`,
      texte:
        "Pour que votre site reste à jour, sauvegardé et surveillé chaque nuit ensuite, choisissez la formule qui vous convient.",
      action: { libelle: "En parler", vers: "contact", objet: "Continuer le suivi et maintenance" },
      masquable: true,
    };
  },

  // 4. Des failles relevées sur un site que personne ne maintient.
  (f) => {
    if (f.alertesCritiques === 0 || f.services?.includes("suivi-technique")) return null;
    const n = f.alertesCritiques;
    return {
      id: "suivi-alertes",
      titre: "Des failles concernent votre site",
      fait: `${n} alerte${n > 1 ? "s" : ""} critique${n > 1 ? "s" : ""} relevée${n > 1 ? "s" : ""}`,
      texte: "Le suivi et maintenance les corrige, et tient ensuite votre site à jour chaque mois.",
      action: { libelle: "En parler", vers: "contact", objet: "Ajouter le suivi et maintenance" },
      masquable: true,
    };
  },

  // 5. Un audit remis, et personne pour dérouler sa roadmap.
  (f) => {
    const pilote = f.services?.some((code) => code === "actions" || code === "direction-technique");
    if (f.audits === 0 || pilote) return null;
    return {
      id: "audit-pilotage",
      titre: "Passer de l'audit à l'action",
      fait: "Votre audit est remis",
      texte: "Le palier Référent vous accompagne pour dérouler la roadmap, avec un comité chaque mois.",
      action: { libelle: "Voir ce qu'il comprend", vers: "page", chemin: "accompagnement" },
      masquable: true,
    };
  },

  // 6. Un Référent qui ne suit plus le rythme des décisions.
  (f) => {
    if (f.tier !== "referent" || f.arbitrages < SEUIL_ARBITRAGES) return null;
    return {
      id: "palier-direction",
      titre: "Beaucoup de décisions en attente",
      fait: `${f.arbitrages} opportunités à arbitrer`,
      texte:
        "Le palier Direction technique double le temps de comité, répond sous 24 h et chiffre chaque mois les évolutions.",
      action: { libelle: "Comparer les paliers", vers: "page", chemin: "accompagnement" },
      masquable: true,
    };
  },
];

function masquee(suggestion: Suggestion, f: FaitsEspace): boolean {
  if (!suggestion.masquable) return false;
  const le = f.masquees[suggestion.id];
  return Boolean(le) && f.maintenant.getTime() - new Date(le).getTime() < MASQUAGE_JOURS * JOUR;
}

/**
 * La suggestion à montrer, ou null. Jamais pour un accompagnement qui n'est
 * pas actif (suspendu, en restitution, clos — la démo est suspendue), ni
 * quand la fiche coupe les suggestions.
 */
export function prochaineEtape(f: FaitsEspace): Suggestion | null {
  if (f.status !== "actif" || f.suggestionsCoupees) return null;
  for (const declencheur of DECLENCHEURS) {
    const suggestion = declencheur(f);
    if (suggestion && !masquee(suggestion, f)) return suggestion;
  }
  return null;
}
