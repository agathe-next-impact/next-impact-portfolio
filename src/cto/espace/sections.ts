// ─────────────────────────────────────────────────────────────────────────────
// Quelles sections un accompagnement voit, et dans quel groupe.
//
// Pur, testé. La navigation est rangée par QUESTION du client, pas par base
// Notion : « où en est mon système ? » (Pilotage), « comment va mon site ? »
// (Votre site), « que puis-je faire ? » (Agir), la Veille, et « qu'ai-je
// signé, que me propose-t-on ? » (Contrats). Chaque entrée
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
  | "veille-technique"
  // « Prestations en cours » dans la fiche Notion : ouvre le groupe Contrats
  // (prestations, tarifs, règlements — le même écran que l'administration).
  | "prestations";

export type SectionKey =
  | "tableau"
  | "missions"
  | "roadmap"
  | "decisions"
  | "audit"
  | "site"
  | "cartographie"
  | "agir"
  | "propositions"
  | "veille"
  | "veille-technique"
  | "documents"
  | "prestations";

export type SectionGroup = "missions" | "site" | "agir" | "veille" | "contrats";

export const GROUP_LABELS: Record<SectionGroup, string> = {
  // « Pilotage » et non plus « Missions » : le mot désigne désormais, dans
  // Contrats, les prestations signées. Un même mot pour deux choses était
  // précisément la confusion à lever. Le code garde la clé `missions`.
  missions: "Pilotage",
  site: "Votre site",
  agir: "Agir",
  veille: "Veille",
  contrats: "Contrats",
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
  /**
   * Visible dès qu'elle a du contenu, et seulement alors, quels que soient les
   * services. Une proposition s'envoie aussi à un prospect qui n'a encore rien
   * souscrit ; une entrée vide « Propositions » n'aurait, elle, rien à dire.
   */
  siContenu?: true;
}

/** Dans l'ordre de la navigation. */
export const SECTIONS: readonly Section[] = [
  { key: "tableau", slug: "", label: "Accueil", group: null, services: null },

  // Pilotage : d'abord la vue d'ensemble (passé, présent, avenir), puis le
  // détail par nature — la roadmap complète, les décisions, l'audit, et les
  // documents (revues de devis, notes de comité), qui relèvent du pilotage et
  // non de la veille.
  {
    key: "missions",
    slug: "missions",
    label: "Vue d'ensemble",
    group: "missions",
    services: ["actions", "direction-technique", "audit"],
  },
  { key: "roadmap", slug: "roadmap", label: "Roadmap", group: "missions", services: ["actions", "direction-technique"] },
  { key: "decisions", slug: "decisions", label: "Décisions", group: "missions", services: ["direction-technique"] },
  { key: "audit", slug: "audit", label: "Audit", group: "missions", services: ["audit"] },
  { key: "documents", slug: "documents", label: "Documents", group: "missions", services: ["direction-technique"] },

  { key: "site", slug: "site", label: "État du site", group: "site", services: ["suivi-technique"] },
  { key: "cartographie", slug: "cartographie", label: "Cartographie", group: "site", services: ["direction-technique"] },

  // Une seule page pour agir : ce qui est à traiter, puis ce qui est à
  // arbitrer (ouvert par les mêmes services que la roadmap, cf. `arbitrageOuvert`).
  { key: "agir", slug: "agir", label: "Actions", group: "agir", services: null },

  { key: "veille", slug: "veille", label: "Lettres et alertes", group: "veille", services: null },
  // Le service « Veille technique » de la fiche Notion l'ouvre, et c'est le même
  // service qui fait créer le client Sentinelle (`src/cto/sentinelle/provision.ts`).
  // Régime historique (colonne Services vide) : ouverte dès qu'un client
  // Sentinelle est relié.
  {
    key: "veille-technique",
    slug: "veille-technique",
    label: "Veille technique",
    group: "veille",
    services: ["veille-technique"],
  },

  // Contrats : le commercial, séparé du pilotage. Ce qui attend votre accord
  // (propositions), puis ce qui est signé et court (prestations, avec tarif et
  // règlements). Les propositions s'ouvrent au contenu : un prospect n'a encore
  // rien souscrit ; les prestations, au seul service coché.
  { key: "propositions", slug: "propositions", label: "Propositions", group: "contrats", services: null, siContenu: true },
  {
    key: "prestations",
    slug: "prestations",
    label: "Missions en cours",
    group: "contrats",
    services: ["prestations"],
  },
];

/** Ce qui existe dans l'espace d'un accompagnement, pour le régime historique. */
export interface Contents {
  decisions: number;
  cartographie: number;
  documents: number;
  roadmap: number;
  audits: number;
  propositions: number;
  /** Vrai si un projet WP Umbrella est renseigné. */
  site: boolean;
  /** Vrai si un client Sentinelle est relié. */
  sentinelle?: boolean;
}

function hasContent(key: SectionKey, contents: Contents): boolean {
  switch (key) {
    case "missions":
      return contents.roadmap + contents.decisions + contents.audits > 0;
    case "decisions":
      return contents.decisions > 0;
    case "audit":
      return contents.audits > 0;
    case "site":
      return contents.site;
    case "cartographie":
      return contents.cartographie > 0;
    case "roadmap":
      return contents.roadmap > 0;
    case "documents":
      return contents.documents > 0;
    case "propositions":
      return contents.propositions > 0;
    case "veille-technique":
      return contents.sentinelle === true;
    // Des tarifs ne s'ouvrent pas « parce qu'il y a du contenu » : seul le
    // service coché dans la fiche les montre, régime historique compris.
    case "prestations":
      return false;
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
    if (section.siContenu) return hasContent(section.key, contents);
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
  // Les rapports vivent en bas de l'état du site ; à traiter et à arbitrer
  // sont réunis sur une seule page.
  rapports: "site",
  "a-traiter": "agir",
  "a-arbitrer": "agir",
};

/**
 * La partie « À arbitrer » de la page Actions est-elle souscrite ? Mêmes
 * services que la roadmap, dont elle arbitre les opportunités.
 */
export function arbitrageOuvert(sections: readonly Section[]): boolean {
  return sections.some((section) => section.key === "roadmap");
}
