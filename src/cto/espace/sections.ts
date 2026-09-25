// ─────────────────────────────────────────────────────────────────────────────
// Quelles sections un accompagnement voit.
//
// Pur, testé. Deux familles, et la distinction est le cœur du fichier :
//
//  - **Toujours visibles** : le tableau de bord, la veille (la lettre générale
//    va à tous), le contact. Personne n'achète « le droit de voir son accueil ».
//  - **Activées par service** : ce que la colonne « Services » de la fiche
//    Notion coche (`cto_clients.services`).
//
// Et un régime de transition : `services === null` (colonne jamais
// renseignée) garde le comportement d'avant les services — une section
// s'affiche dès qu'elle a du contenu. C'est ce qui permet d'ajouter la colonne
// sans que les accompagnements existants perdent leurs sections du jour au
// lendemain.
// ─────────────────────────────────────────────────────────────────────────────

export type ServiceCode =
  | "direction-technique"
  | "suivi-technique"
  | "actions"
  | "veille-personnalisee"
  | "prestations";

export type SectionKey =
  | "tableau"
  | "direction-technique"
  | "suivi-technique"
  | "actions"
  | "veille"
  | "prestations";

export interface Section {
  key: SectionKey;
  /** Segment d'URL sous `/espace-direction`. Vide pour le tableau de bord. */
  slug: string;
  label: string;
  /** Le service qui l'ouvre, ou null si elle est toujours visible. */
  service: ServiceCode | null;
}

/** Dans l'ordre de la navigation : du plus général au plus opérationnel. */
export const SECTIONS: readonly Section[] = [
  { key: "tableau", slug: "", label: "Tableau de bord", service: null },
  { key: "direction-technique", slug: "direction-technique", label: "Direction technique", service: "direction-technique" },
  { key: "suivi-technique", slug: "suivi-technique", label: "Suivi technique", service: "suivi-technique" },
  { key: "actions", slug: "actions", label: "Actions en cours", service: "actions" },
  { key: "veille", slug: "veille", label: "Veille", service: null },
  { key: "prestations", slug: "prestations", label: "Prestations", service: "prestations" },
];

/** Ce qui existe dans l'espace d'un accompagnement, pour le régime historique. */
export interface Contents {
  decisions: number;
  cartographie: number;
  documents: number;
  roadmap: number;
  prestations: number;
  /** Vrai si un projet WP Umbrella est renseigné. */
  site: boolean;
}

function hasContent(key: SectionKey, contents: Contents): boolean {
  switch (key) {
    case "direction-technique":
      return contents.decisions + contents.cartographie + contents.documents > 0;
    case "suivi-technique":
      return contents.site;
    case "actions":
      return contents.roadmap > 0;
    case "prestations":
      return contents.prestations > 0;
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
    if (section.service === null) return true;
    if (services === null) return hasContent(section.key, contents);
    return services.includes(section.service);
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
