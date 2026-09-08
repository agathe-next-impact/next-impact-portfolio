import type { NotionPage } from "./api";
import * as p from "./properties";
import type {
  CartographiePayload,
  DecisionPayload,
  DeliverableInput,
  DeliverableKind,
  DocumentPayload,
  RoadmapPayload,
} from "../deliverables";

// ─────────────────────────────────────────────────────────────────────────────
// D'une page Notion à un livrable.
//
// C'est le seul endroit du dépôt qui connaît les noms des colonnes de
// l'atelier. Renommer « Motif » dans Notion casse la synchro ici, et nulle part
// ailleurs — d'où la table `PROPS` en tête, qui rend la correction évidente et
// vérifiable d'un coup d'œil contre la page Notion.
//
// Pur, sans réseau ni base : testable ligne à ligne, et testé.
// ─────────────────────────────────────────────────────────────────────────────

/** Les noms de colonnes de l'atelier, à l'identique. */
export const PROPS = {
  /** Présent sur les quatre bases de contenu, sous le même nom. */
  client: "Client",
  published: "Publié",
  placement: "Affichage",
  clients: {
    company: "Raison sociale",
    spaceId: "ID espace",
  },
  decision: {
    title: "Décision",
    nature: "Nature",
    date: "Date du comité",
    motif: "Motif",
    ruledOut: "Option écartée",
    scope: "Portée",
  },
  roadmap: {
    title: "Chantier",
    nature: "Nature",
    status: "Statut",
    due: "Échéance",
    budget: "Budget",
    effort: "Effort",
    effect: "Effet",
    detail: "Détail",
  },
  cartographie: {
    title: "Élément",
    type: "Type",
    holder: "Détenteur",
    yearlyCost: "Coût annuel",
    due: "Échéance",
    criticality: "Criticité",
    risk: "Risque",
  },
  document: {
    title: "Titre",
    type: "Type",
    date: "Date",
    vendor: "Prestataire",
    amount: "Montant",
    verdict: "Verdict",
    alternative: "Alternative chiffrée",
  },
} as const;

/**
 * Titre de repli.
 *
 * Un livrable publié sans titre est une erreur de saisie, pas une raison de
 * l'escamoter : il part dans l'espace avec cette étiquette, qui se remarque, et
 * la synchro le signale. Le taire le rendrait invisible des deux côtés.
 */
export const UNTITLED = "(sans titre)";

/** Le lien vers la fiche client, tel que la relation le porte. */
export function clientPageIds(page: NotionPage): string[] {
  return p.relation(page, PROPS.client);
}

/** L'UUID d'accompagnement inscrit sur une fiche de la base Clients. */
export function spaceId(page: NotionPage): string | null {
  return p.text(page, PROPS.clients.spaceId);
}

export function companyName(page: NotionPage): string | null {
  return p.text(page, PROPS.clients.company);
}

/**
 * Normalise un libellé d'atelier en valeur de code.
 *
 * Les accents et la casse sont laissés à l'atelier — c'est là qu'ils se lisent —
 * et le code ne manipule que des valeurs stables. Une valeur inconnue rend
 * `null` : ajouter une option dans Notion ne doit pas faire échouer une synchro,
 * seulement laisser un champ vide, visible.
 */
function normalize(value: string | null): string | null {
  if (!value) return null;
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * La ligne remonte-t-elle sur la page d'accueil de l'espace ?
 *
 * Opt-in strict : seule la valeur « À la une » met en avant. Vide ou
 * « Archive », la ligne reste consultable dans la page de sa catégorie. Le
 * défaut inverse aurait fait de la page d'accueil un déversoir qu'il aurait
 * fallu vider ligne à ligne.
 */
export function isFeatured(page: NotionPage): boolean {
  return normalize(p.select(page, PROPS.placement)) === "a la une";
}

function decisionNature(page: NotionPage): DecisionPayload["nature"] {
  const value = normalize(p.select(page, PROPS.decision.nature));
  if (value === "arbitrage") return "arbitrage";
  if (value === "proposition ecartee") return "ecartee";
  return null;
}

function roadmapNature(page: NotionPage): RoadmapPayload["nature"] {
  const value = normalize(p.select(page, PROPS.roadmap.nature));
  if (value === "chantier") return "chantier";
  if (value === "opportunite") return "opportunite";
  return null;
}

/**
 * Une page de l'atelier, rendue en livrable.
 *
 * `occurredAt` diffère par base et ce n'est pas un détail : c'est la date que le
 * client cherche des yeux. Pour une décision, celle du comité ; pour un chantier
 * ou une ligne de cartographie, l'échéance ; pour un document, sa date.
 */
export function mapPage(
  kind: DeliverableKind,
  page: NotionPage,
  clientId: string,
): DeliverableInput {
  switch (kind) {
    case "decision": {
      const payload: DecisionPayload = {
        nature: decisionNature(page),
        motif: p.text(page, PROPS.decision.motif),
        optionEcartee: p.text(page, PROPS.decision.ruledOut),
        portee: p.multiSelect(page, PROPS.decision.scope),
      };
      return {
        clientId,
        notionPageId: page.id,
        kind,
        title: p.text(page, PROPS.decision.title) ?? UNTITLED,
        payload,
        occurredAt: p.date(page, PROPS.decision.date),
        featured: isFeatured(page),
      };
    }
    case "roadmap": {
      const payload: RoadmapPayload = {
        nature: roadmapNature(page),
        statut: p.select(page, PROPS.roadmap.status),
        budget: p.number(page, PROPS.roadmap.budget),
        effort: p.select(page, PROPS.roadmap.effort),
        effet: p.select(page, PROPS.roadmap.effect),
        detail: p.text(page, PROPS.roadmap.detail),
      };
      return {
        clientId,
        notionPageId: page.id,
        kind,
        title: p.text(page, PROPS.roadmap.title) ?? UNTITLED,
        payload,
        occurredAt: p.date(page, PROPS.roadmap.due),
        featured: isFeatured(page),
      };
    }
    case "cartographie": {
      const payload: CartographiePayload = {
        type: p.select(page, PROPS.cartographie.type),
        detenteur: p.text(page, PROPS.cartographie.holder),
        coutAnnuel: p.number(page, PROPS.cartographie.yearlyCost),
        criticite: p.select(page, PROPS.cartographie.criticality),
        risque: p.text(page, PROPS.cartographie.risk),
      };
      return {
        clientId,
        notionPageId: page.id,
        kind,
        title: p.text(page, PROPS.cartographie.title) ?? UNTITLED,
        payload,
        occurredAt: p.date(page, PROPS.cartographie.due),
        featured: isFeatured(page),
      };
    }
    case "document": {
      const payload: DocumentPayload = {
        type: p.select(page, PROPS.document.type),
        prestataire: p.text(page, PROPS.document.vendor),
        montant: p.number(page, PROPS.document.amount),
        verdict: p.select(page, PROPS.document.verdict),
        alternative: p.text(page, PROPS.document.alternative),
      };
      return {
        clientId,
        notionPageId: page.id,
        kind,
        title: p.text(page, PROPS.document.title) ?? UNTITLED,
        payload,
        occurredAt: p.date(page, PROPS.document.date),
        featured: isFeatured(page),
      };
    }
  }
}
