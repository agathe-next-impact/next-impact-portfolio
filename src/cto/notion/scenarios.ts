import type { AuditSection, DeliverableInput, PropositionPayload } from "../deliverables";
import {
  estTableauScenarios,
  lireNomScenario,
  lireStatutScenario,
  roleColonneScenario,
  type StatutScenario,
} from "../espace/lecture-audit";
import type { Block, Span } from "./blocks";

// ─────────────────────────────────────────────────────────────────────────────
// Les scénarios d'un audit validé, rendus en propositions.
//
// Pur, testé. Un audit compare des scénarios (optimiser, refondre, découpler…)
// dans un tableau dont la première colonne s'appelle « Scénario ». Tant que
// l'audit n'est pas validé, ce tableau reste une comparaison, lisible dans
// l'audit seulement. Une fois la case « Validé » cochée sur sa ligne de la base
// Audits, chaque scénario devient une proposition de l'espace, à laquelle le
// client répond — sans ressaisie dans la base Propositions.
//
// **Tous les scénarios, écartés compris.** Un scénario écarté par l'audit reste
// une option que le client peut préférer ; la proposition le dit en tête.
//
// **L'identifiant se déduit, il ne se stocke pas.** Une ligne de tableau n'a pas
// d'identifiant Notion : la proposition est adressée par l'audit et le nom du
// scénario. Retoucher le coût ou le délai écrit une version de plus ; renommer
// le scénario retire l'ancienne proposition et en publie une nouvelle.
// ─────────────────────────────────────────────────────────────────────────────

/** Préfixe des propositions issues d'un audit : les distingue de celles de la base Propositions. */
export const PREFIXE_SCENARIO = "scenario-";

export function isScenarioProposition(notionPageId: string): boolean {
  return notionPageId.startsWith(PREFIXE_SCENARIO);
}

function texteDe(cellule: Span[] | undefined): string {
  return (cellule ?? []).map((span) => span.t).join("").trim();
}

function slug(texte: string): string {
  return (
    texte
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "sans-nom"
  );
}

/** Les tableaux de scénarios, dans l'ordre de lecture, encadrés compris. */
function tableauxScenarios(blocs: Block[]): Extract<Block, { k: "table" }>[] {
  const out: Extract<Block, { k: "table" }>[] = [];
  for (const bloc of blocs) {
    if (bloc.k === "box") out.push(...tableauxScenarios(bloc.c));
    else if (bloc.k === "table" && bloc.head && estTableauScenarios(bloc.head.map(texteDe))) out.push(bloc);
  }
  return out;
}

const RECOMMANDATION: Record<StatutScenario, string> = {
  retenu: "Scénario recommandé par l'audit.",
  possible: "Scénario envisageable, présenté par l'audit comme une alternative.",
  ecarte: "Scénario écarté par l'audit, présenté pour comparaison : vous pouvez tout de même le retenir.",
};

export interface AuditValide {
  /** Identifiant de la ligne de la base Audits. */
  notionPageId: string;
  clientId: string;
  title: string;
  occurredAt: Date | null;
  synthese: Block[];
  sections: AuditSection[];
}

/**
 * Une proposition par scénario de l'audit, quel que soit le nombre de tableaux
 * où il figure.
 *
 * Le corps reprend la ligne elle-même, en tableau d'une ligne sous les mêmes
 * en-têtes : l'espace la rend en carte, comme dans l'audit. Le statut de la
 * proposition se lit dans une colonne « Réponse client » si le tableau en a
 * une, et vaut sinon « en attente de réponse ».
 */
export function scenarioPropositions(audit: AuditValide): DeliverableInput<"proposition">[] {
  const blocs = [...audit.synthese, ...audit.sections.flatMap((section) => section.corps)];

  // Un même scénario revient souvent dans plusieurs tableaux d'un audit : la
  // base des scénarios, et un récapitulatif dans la roadmap ou la synthèse. Le
  // client n'a qu'une décision à prendre par scénario : une seule proposition,
  // tirée du tableau le plus complet (le plus de colonnes ; à égalité, le
  // premier lu). Elle garde la place du scénario à sa première apparition.
  const retenus = new Map<string, { tableau: Extract<Block, { k: "table" }>; ligne: Span[][]; nom: string; statut: StatutScenario | null }>();
  for (const tableau of tableauxScenarios(blocs)) {
    for (const ligne of tableau.rows) {
      const lu = lireNomScenario(texteDe(ligne[0]));
      if (!lu.nom) continue;
      const cle = slug(lu.nom);
      const deja = retenus.get(cle);
      if (!deja || (tableau.head?.length ?? 0) > (deja.tableau.head?.length ?? 0)) {
        retenus.set(cle, { tableau, ligne, nom: lu.nom, statut: lu.statut });
      }
    }
  }

  const out: DeliverableInput<"proposition">[] = [];
  for (const [cle, { tableau, ligne, nom, statut }] of retenus) {
    const roles = (tableau.head ?? []).map(texteDe).map(roleColonneScenario);
    const colStatut = roles.indexOf("statut");
    const colReponse = roles.indexOf("reponse");
    const recommandation = (colStatut >= 0 ? lireStatutScenario(texteDe(ligne[colStatut])) : null) ?? statut;

    const corps: Block[] = [
      { k: "p", s: [{ t: "Proposition issue de l'audit « " }, { t: audit.title, b: true }, { t: " »." }] },
    ];
    if (recommandation) corps.push({ k: "callout", s: [{ t: RECOMMANDATION[recommandation] }] });
    corps.push({ k: "table", title: tableau.title, head: tableau.head, rows: [ligne] });

    const payload: PropositionPayload = {
      statut: colReponse >= 0 ? texteDe(ligne[colReponse]) || null : null,
      corps,
      sections: [],
      // Aucune image dans une ligne de tableau : rien à déclarer au contrôle d'appartenance.
      fichiers: [],
    };
    out.push({
      clientId: audit.clientId,
      notionPageId: `${PREFIXE_SCENARIO}${audit.notionPageId}-${cle}`,
      kind: "proposition",
      title: `${nom} · ${audit.title}`,
      payload,
      occurredAt: audit.occurredAt,
      featured: false,
    });
  }

  return out;
}
