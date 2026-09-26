// ─────────────────────────────────────────────────────────────────────────────
// Quelles sections un accompagnement voit, et dans quel groupe.
//
// Pur, testé. La navigation est rangée par QUESTION du client, pas par base
// Notion : « où en sont les missions ? » (Missions), « comment va mon site ? »
// (Votre site), « que puis-je faire ? » (Agir), plus la Veille. Chaque entrée
// garde son interrupteur de service — c'est toujours la fiche Notion qui décide
// de ce qu'un client voit, entrée par entrée.
//
// Deux familles :
//
//  - **Toujours visibles** : l'accueil, « À traiter » (vide = « rien
//    d'urgent », ce qui est aussi une réponse), la veille (la lettre générale
//    va à tous). Personne n'achète « le droit de voir son accueil ».
//  - **Activées par service** : ce que la colonne « Services » de la fiche
//    Notion coche (`cto_clients.services`). Une entrée peut dépendre de
//    plusieurs services : elle s'ouvre dès que l'un d'eux est coché.
//
// Et un régime de transition : `services === null` (colonne jamais
// renseignée) garde le comportement d'avant les services — une entrée
// s'affiche dès qu'elle a du contenu.
// ─────────────────────────────────────────────────────────────────────────────

export type ServiceCode =
  | "audit"
  | "direction-technique"
  | "suivi-technique"
  | "actions"
  | "veille-personnalisee"
  | "prestations";

export type SectionKey =
  | "tableau"
  | "missions"
  | "prestations"
  | "decisions"
  | "audit"
  | "site"
  | "rapports"
  | "cartographie"
  | "a-traiter"
  | "a-arbitrer"
  | "veille"
  | "documents";

export type SectionGroup = "missions" | "site" | "agir" | "veille";

export const GROUP_LABELS: Record<SectionGroup, string> = {
  missions: "Missions",
  site: "Votre site",
  agir: "Agir",
  veille: "Veille",
};

export interface Section {
  key: SectionKey;
  /** Segment d'URL sous `/espace-direction`. Vide pour l'accueil. */
  slug: string;
  label: string;
  /** Null pour l'accueil, qui se tient hors des groupes. */
  group: SectionGroup | null;
  /** Les services qui l'ouvrent (un seul suffit), ou null si elle est toujours visible. */
  services: readonly ServiceCode[] | null;
}

/** Dans l'ordre de la navigation. */
export const SECTIONS: readonly Section[] = [
  { key: "tableau", slug: "", label: "Accueil", group: null, services: null },

  // Missions : d'abord la vue d'ensemble (passé, présent, avenir), puis le
  // détail par nature. L'audit ferme le groupe : c'est le point de départ, il
  // se consulte plus qu'il ne se suit.
  {
    key: "missions",
    slug: "missions",
    label: "Vue d'ensemble",
    group: "missions",
    services: ["actions", "prestations", "direction-technique", "audit"],
  },
  { key: "prestations", slug: "prestations", label: "Prestations", group: "missions", services: ["prestations"] },
  { key: "decisions", slug: "decisions", label: "Décisions", group: "missions", services: ["direction-technique"] },
  { key: "audit", slug: "audit", label: "Audit", group: "missions", services: ["audit"] },

  { key: "site", slug: "site", label: "État du site", group: "site", services: ["suivi-technique"] },
  { key: "rapports", slug: "rapports", label: "Rapports", group: "site", services: ["suivi-technique"] },
  { key: "cartographie", slug: "cartographie", label: "Cartographie", group: "site", services: ["direction-technique"] },

  { key: "a-traiter", slug: "a-traiter", label: "À traiter", group: "agir", services: null },
  {
    key: "a-arbitrer",
    slug: "a-arbitrer",
    label: "À arbitrer",
    group: "agir",
    services: ["actions", "direction-technique"],
  },

  { key: "veille", slug: "veille", label: "Lettres et alertes", group: "veille", services: null },
  { key: "documents", slug: "documents", label: "Documents", group: "veille", services: ["direction-technique"] },
];

/** Ce qui existe dans l'espace d'un accompagnement, pour le régime historique. */
export interface Contents {
  decisions: number;
  cartographie: number;
  documents: number;
  roadmap: number;
  prestations: number;
  audits: number;
  /** Vrai si un projet WP Umbrella est renseigné. */
  site: boolean;
}

function hasContent(key: SectionKey, contents: Contents): boolean {
  switch (key) {
    case "missions":
      return contents.roadmap + contents.prestations + contents.decisions + contents.audits > 0;
    case "prestations":
      return contents.prestations > 0;
    case "decisions":
      return contents.decisions > 0;
    case "audit":
      return contents.audits > 0;
    case "site":
    case "rapports":
      return contents.site;
    case "cartographie":
      return contents.cartographie > 0;
    case "a-arbitrer":
      return contents.roadmap > 0;
    case "documents":
      return contents.documents > 0;
    default:
      return true;
  }
}

/**
 * Les sections à afficher, dans l'ordre de la navigation.
 *
 * Service coché mais section vide : la section s'affiche quand même, avec un
 * état « en préparation » — le client doit voir ce qu'il a acheté dès le
 * premier jour, pas le découvrir le jour où le premier livrable tombe.
 */
export function visibleSections(services: string[] | null, contents: Contents): Section[] {
  return SECTIONS.filter((section) => {
    if (section.services === null) return true;
    if (services === null) return hasContent(section.key, contents);
    return section.services.some((service) => services.includes(service));
  });
}

/** La veille personnalisée est-elle souscrite ? (La générale, elle, va à tous.) */
export function hasPersonalisedWatch(services: string[] | null): boolean {
  return services === null || services.includes("veille-personnalisee");
}

export function sectionByKey(key: SectionKey): Section {
  const section = SECTIONS.find((s) => s.key === key);
  if (!section) throw new Error(`section inconnue : ${key}`);
  return section;
}

/**
 * Les anciennes adresses de section, et où elles mènent désormais.
 *
 * Les clients ont ces URL en favori et dans leurs e-mails de notification :
 * elles redirigent, elles ne cassent pas.
 */
export const LEGACY_SLUGS: Record<string, SectionKey> = {
  "direction-technique": "decisions",
  actions: "missions",
  "suivi-technique": "site",
};
