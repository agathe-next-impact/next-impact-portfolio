import type { NotionPage } from "./api";
import * as p from "./properties";
import type {
  AuditPayload,
  CartographiePayload,
  DecisionPayload,
  DeliverableInput,
  DeliverableKind,
  DocumentPayload,
  PrestationPayload,
  PropositionPayload,
  RoadmapPayload,
  VeillePayload,
} from "../deliverables";
import type { ClientStatus } from "../access";

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
    /** Legacy : rattachement à la main d'avant `notion_page_id`. Voir schema.ts. */
    spaceId: "ID espace",
    organisation: "Organisation",
    status: "État",
    tier: "Palier",
    wpUmbrellaProjectId: "ID projet WP Umbrella",
    services: "Services",
    /** Relation vers la ligne du pipeline « Veilles clients » (Organisations). */
    veilleOrganisation: "Veille — organisation",
    /** UUID du client chez Sentinelle : la jointure avec la veille technique. */
    sentinelleClientId: "ID Sentinelle",
  },
  /**
   * Colonnes de la « Base des fiches organisation », qui vit hors de l'atelier
   * CTO et qu'aucune synchro ne balaie : on ne la lit qu'en suivant la relation.
   */
  organisation: {
    name: "Organisation",
    pack: "Pack de rattachement",
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
    source: "Lien",
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
  veille: {
    title: "Sujet",
    nature: "Nature",
    date: "Date",
    fact: "Ce qui change",
    impact: "Ce que ça implique",
    source: "Source",
    themes: "Thèmes",
  },
  document: {
    title: "Titre",
    type: "Type",
    date: "Date",
    vendor: "Prestataire",
    amount: "Montant",
    verdict: "Verdict",
    alternative: "Alternative chiffrée",
    file: "Fichier",
  },
  prestation: {
    title: "Prestation",
    status: "Statut",
    start: "Début",
    due: "Échéance",
    amount: "Montant",
    progress: "Avancement",
    quote: "Devis",
    detail: "Détail",
  },
  /**
   * Base « Audits » de l'atelier : une ligne par audit remis, qui pointe la
   * page de mission sous « Audits et Roadmap ». Le contenu vit dans la page,
   * pas dans la ligne.
   */
  audit: {
    title: "Audit",
    page: "Page de l'audit",
    date: "Date des mesures",
    site: "Site",
    annex: "Annexe",
  },
  /**
   * Base « Propositions » de l'atelier : une ligne par proposition envoyée,
   * qui pointe sa page sous CRM → Propositions. Comme pour un audit, le
   * contenu vit dans la page, pas dans la ligne.
   */
  proposition: {
    title: "Proposition",
    page: "Page de la proposition",
    date: "Date",
    status: "Statut",
  },
  /**
   * La base inline ROADMAP d'une page d'audit (modèle « Audit technique
   * WordPress », kit d'audit). Reconnue à son titre, lue pour relier les
   * actions validées par le client à la roadmap de l'espace.
   */
  auditRoadmap: {
    database: "ROADMAP",
    title: "Action",
    phase: "Phase",
    effortMin: "Effort min (h)",
    effortMax: "Effort max (h)",
    prerequisite: "Prérequis",
    criterion: "Critère de réussite",
    findings: "Constats liés",
    status: "Statut",
  },
  /**
   * Base « Éditions de veille » du pipeline Veilles clients — lue, jamais
   * écrite, et seulement pour les organisations reliées à un accompagnement.
   */
  editions: {
    title: "Titre",
    status: "Statut",
    date: "Date d'édition",
    organisation: "Organisation",
    veille: "Veille",
    number: "Numéro",
    period: "Période couverte",
    /** Reprise telle quelle par le digest hebdomadaire. */
    action: "Action de la semaine",
  },
  persons: {
    name: "Nom",
    email: "Email",
    role: "Rôle",
    revoked: "Révoquée",
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

const CLIENT_STATUSES: readonly ClientStatus[] = ["actif", "suspendu", "restitution", "clos"];

/**
 * L'état affiché dans l'atelier (colonne « État »), s'il correspond à une des
 * quatre valeurs connues de `cto_clients.status`. `null` sinon — un champ vide
 * ou une faute de frappe ne doit pas faire tomber un accompagnement dans un
 * état qu'il n'a pas choisi.
 */
export function clientStatus(page: NotionPage): ClientStatus | null {
  const value = p.select(page, PROPS.clients.status);
  return (CLIENT_STATUSES as readonly string[]).includes(value ?? "") ? (value as ClientStatus) : null;
}

/** Le palier souscrit (colonne « Palier »). Mêmes valeurs que `cto_clients.tier`, aucun mapping. */
export function clientTier(page: NotionPage): string | null {
  return p.select(page, PROPS.clients.tier);
}

/**
 * Libellé de la colonne « Services » → valeur de code de `cto_clients.services`.
 *
 * Table explicite plutôt que dérivation du libellé : renommer « Actions en
 * cours » en « Chantiers en cours » dans l'atelier ne doit pas changer une
 * valeur stockée que l'espace lit. Un libellé inconnu est ignoré (et remonte
 * au rapport), jamais inventé.
 */
export const SERVICE_CODES: Record<string, string> = {
  "direction technique": "direction-technique",
  "suivi technique": "suivi-technique",
  "actions en cours": "actions",
  "veille personnalisee": "veille-personnalisee",
  "prestations en cours": "prestations",
  audit: "audit",
};

/**
 * Les services cochés sur la fiche, en valeurs de code, et les libellés
 * qu'aucune valeur ne reconnaît.
 */
export function clientServices(page: NotionPage): { codes: string[]; unknown: string[] } {
  const codes: string[] = [];
  const unknown: string[] = [];
  for (const label of p.multiSelect(page, PROPS.clients.services)) {
    const code = SERVICE_CODES[normalize(label) ?? ""];
    if (code) {
      if (!codes.includes(code)) codes.push(code);
    } else {
      unknown.push(label);
    }
  }
  return { codes: codes.sort(), unknown };
}

/** Les lignes du pipeline de veille reliées à la fiche. */
export function clientVeilleOrganisations(page: NotionPage): string[] {
  return p.relation(page, PROPS.clients.veilleOrganisation);
}

/** Les pièces jointes d'un document, dans l'ordre de l'atelier. */
export function documentFiles(page: NotionPage): p.NotionFile[] {
  return p.files(page, PROPS.document.file);
}

/** Les pièces de la colonne « Annexe » d'un audit. */
export function auditAnnexFiles(page: NotionPage): p.NotionFile[] {
  return p.files(page, PROPS.audit.annex);
}

/**
 * L'identifiant de la page d'audit, tiré du lien collé dans la colonne
 * « Page de l'audit ».
 *
 * Un lien plutôt qu'une relation : la page de mission n'est pas une ligne de
 * base, Notion ne sait donc pas la relier. L'identifiant est les 32 derniers
 * caractères hexadécimaux du chemin, avec ou sans tirets — c'est la forme de
 * tous les liens Notion (`notion.so/…`, `app.notion.com/p/…`, titre en slug ou
 * non). `null` si le lien n'en contient pas.
 */
export function propositionPageId(page: NotionPage): string | null {
  const lien = p.url(page, PROPS.proposition.page) ?? p.text(page, PROPS.proposition.page);
  return pageIdFromUrl(lien);
}

export function auditPageId(page: NotionPage): string | null {
  const lien = p.url(page, PROPS.audit.page) ?? p.text(page, PROPS.audit.page);
  return pageIdFromUrl(lien);
}

export function pageIdFromUrl(lien: string | null): string | null {
  if (!lien) return null;
  let chemin = lien.trim();
  try {
    chemin = new URL(chemin).pathname;
  } catch {
    // Pas une URL : on cherche l'identifiant dans la chaîne telle quelle.
  }
  const segment = chemin.split("/").filter(Boolean).at(-1) ?? "";

  // Deux formes seulement : l'UUID à tirets, ou 32 caractères en fin de
  // segment après le titre en slug. Surtout pas « 32 hexadécimaux n'importe
  // où une fois les tirets ôtés » : le slug « …-Lean-France-3e2f… » deviendrait
  // « …France3e2f… », et le « ce » de France serait lu comme le début de
  // l'identifiant.
  const uuid = segment.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  const brut = (uuid ? segment.replace(/-/g, "") : segment.split("-").at(-1) ?? "").toLowerCase();
  if (!/^[0-9a-f]{32}$/.test(brut)) return null;
  return `${brut.slice(0, 8)}-${brut.slice(8, 12)}-${brut.slice(12, 16)}-${brut.slice(16, 20)}-${brut.slice(20)}`;
}

/**
 * Statut d'une action d'audit → statut de chantier de roadmap.
 *
 * Seules les actions engagées passent dans la roadmap de l'espace. `Proposé`
 * reste une recommandation de l'audit, lisible dans l'audit ; `Écarté` n'est
 * pas un chantier. « En cours » et « Fait » ne figurent pas dans le modèle du
 * kit : ce sont les options à ajouter à la base ROADMAP d'une mission pour la
 * suivre après la restitution.
 */
const AUDIT_ACTION_STATUSES: Record<string, string> = {
  "valide client": "Décidé",
  "en cours": "Ouvert",
  fait: "Fait",
};

/**
 * Une ligne de la base ROADMAP d'un audit, rendue en chantier de roadmap.
 *
 * `null` si l'action n'est pas engagée : elle n'a rien à faire dans la roadmap
 * de l'espace. La phase, le critère de réussite, les prérequis et les constats
 * liés passent dans le détail, en clair : c'est ce qui permet au client de
 * relier le chantier à l'audit qui l'a motivé.
 */
export function auditActionInput(
  page: NotionPage,
  clientId: string,
  auditTitle: string,
): DeliverableInput<"roadmap"> | null {
  const statut = AUDIT_ACTION_STATUSES[normalize(p.select(page, PROPS.auditRoadmap.status)) ?? ""];
  if (!statut) return null;

  const min = p.number(page, PROPS.auditRoadmap.effortMin);
  const max = p.number(page, PROPS.auditRoadmap.effortMax);
  const effort =
    min !== null && max !== null && min !== max
      ? `${min} à ${max} h`
      : min !== null || max !== null
        ? `${min ?? max} h`
        : null;

  const detail = [
    `Issue de l'audit « ${auditTitle} »`,
    p.select(page, PROPS.auditRoadmap.phase),
    labelled("Critère de réussite", p.text(page, PROPS.auditRoadmap.criterion)),
    labelled("Prérequis", p.text(page, PROPS.auditRoadmap.prerequisite)),
    labelled("Constats liés", p.text(page, PROPS.auditRoadmap.findings)),
  ]
    .filter(Boolean)
    .join(". ");

  const payload: RoadmapPayload = {
    nature: "chantier",
    statut,
    budget: null,
    effort,
    effet: null,
    detail: `${detail}.`,
    source: null,
  };
  return {
    clientId,
    notionPageId: page.id,
    kind: "roadmap",
    title: p.text(page, PROPS.auditRoadmap.title) ?? UNTITLED,
    payload,
    occurredAt: null,
    featured: false,
  };
}

function labelled(label: string, value: string | null): string | null {
  return value ? `${label} : ${value}` : null;
}

/** L'identifiant du site chez WP Umbrella, s'il est renseigné. */
export function clientWpUmbrellaProjectId(page: NotionPage): number | null {
  return p.number(page, PROPS.clients.wpUmbrellaProjectId);
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * L'identifiant Sentinelle saisi sur la fiche, ou null s'il est vide ou mal
 * formé. Un UUID tronqué au copier-coller ne doit pas devenir une requête vers
 * l'export d'un autre client : il est écarté, et la synchro le signale.
 */
export function clientSentinelleId(page: NotionPage): { id: string | null; invalid: boolean } {
  const value = p.text(page, PROPS.clients.sentinelleClientId)?.trim() ?? "";
  if (!value) return { id: null, invalid: false };
  return UUID.test(value) ? { id: value.toLowerCase(), invalid: false } : { id: null, invalid: true };
}

export function personName(page: NotionPage): string | null {
  return p.text(page, PROPS.persons.name);
}

export function personEmail(page: NotionPage): string | null {
  return p.email(page, PROPS.persons.email);
}

export function personRole(page: NotionPage): string | null {
  return p.text(page, PROPS.persons.role);
}

/** Case « Révoquée » de la base Personnes. Non cochée par défaut : accès ouvert. */
export function personRevoked(page: NotionPage): boolean {
  return p.checkbox(page, PROPS.persons.revoked);
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

function veilleNature(page: NotionPage): VeillePayload["nature"] {
  const value = normalize(p.select(page, PROPS.veille.nature));
  if (value === "note mensuelle") return "note";
  if (value === "alerte") return "alerte";
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
        source: p.url(page, PROPS.roadmap.source),
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
    case "veille": {
      const payload: VeillePayload = {
        nature: veilleNature(page),
        fait: p.text(page, PROPS.veille.fact),
        implication: p.text(page, PROPS.veille.impact),
        source: p.url(page, PROPS.veille.source),
        themes: p.multiSelect(page, PROPS.veille.themes),
      };
      return {
        clientId,
        notionPageId: page.id,
        kind,
        title: p.text(page, PROPS.veille.title) ?? UNTITLED,
        payload,
        occurredAt: p.date(page, PROPS.veille.date),
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
        // Rempli par la synchro APRÈS rapatriement : ce module est pur et ne
        // télécharge rien. `null` ici veut dire « pas encore vu ».
        fichier: null,
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
    case "audit": {
      const mesures = p.date(page, PROPS.audit.date);
      const payload: AuditPayload = {
        site: p.url(page, PROPS.audit.site),
        dateMesures: mesures ? mesures.toISOString() : null,
        // Remplis par la synchro après lecture de la page d'audit : ce module
        // est pur et ne descend dans aucune page.
        synthese: [],
        sections: [],
        annexe: null,
        fichiers: [],
      };
      return {
        clientId,
        notionPageId: page.id,
        kind,
        title: p.text(page, PROPS.audit.title) ?? UNTITLED,
        payload,
        occurredAt: mesures,
        featured: isFeatured(page),
      };
    }
    case "proposition": {
      const payload: PropositionPayload = {
        statut: p.select(page, PROPS.proposition.status),
        // Remplis par la synchro après lecture de la page : ce module est pur.
        corps: [],
        sections: [],
        fichiers: [],
      };
      return {
        clientId,
        notionPageId: page.id,
        kind,
        title: p.text(page, PROPS.proposition.title) ?? UNTITLED,
        payload,
        occurredAt: p.date(page, PROPS.proposition.date),
        featured: isFeatured(page),
      };
    }
    case "prestation": {
      const debut = p.date(page, PROPS.prestation.start);
      const payload: PrestationPayload = {
        statut: p.select(page, PROPS.prestation.status),
        // En texte ISO et non en Date : le payload est du JSON, et une Date y
        // redeviendrait une chaîne à la relecture de toute façon.
        debut: debut ? debut.toISOString() : null,
        montant: p.number(page, PROPS.prestation.amount),
        avancement: p.number(page, PROPS.prestation.progress),
        devis: p.url(page, PROPS.prestation.quote),
        detail: p.text(page, PROPS.prestation.detail),
      };
      return {
        clientId,
        notionPageId: page.id,
        kind,
        title: p.text(page, PROPS.prestation.title) ?? UNTITLED,
        payload,
        occurredAt: p.date(page, PROPS.prestation.due),
        featured: isFeatured(page),
      };
    }
  }
}
