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
  | "prestations"
  | "accompagnement";

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
  /**
   * Visible dès que l'accompagnement a souscrit quelque chose (un service
   * coché, ou le régime historique). Un prospect qui n'a qu'une proposition
   * n'a pas encore d'accompagnement à décrire.
   */
  siSouscrit?: true;
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
  // Ce que l'on a, ce que l'on pourrait avoir : la destination de toutes les
  // suggestions « Prochaine étape ». Sans montants (décision du 2026-09-27).
  {
    key: "accompagnement",
    slug: "accompagnement",
    label: "Votre accompagnement",
    group: "contrats",
    services: null,
    siSouscrit: true,
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
    if (section.siSouscrit) return services === null || services.length > 0;
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

// ─── Groupes ─────────────────────────────────────────────────────────────
//
// Un groupe de plusieurs entrées a sa page de synthèse, sous
// `/espace-direction/synthese/<slug>` : une carte par entrée, la réponse en une
// phrase et le lien vers le détail. Dans la barre latérale, le groupe devient
// un accordéon dont l'intitulé mène à cette synthèse.
//
// Un segment `synthese/` plutôt que le slug du groupe à la racine : « veille »
// et « agir » y sont déjà des entrées, et leurs adresses sont en favori.
//
// Un groupe réduit à une seule entrée (Agir, toujours ; Veille sans veille
// technique) n'a pas de synthèse : elle répéterait la page qu'elle résume.

export const SYNTHESE_SEGMENT = "synthese";

export const GROUP_SLUGS: Record<SectionGroup, string> = {
  missions: "pilotage",
  site: "votre-site",
  agir: "agir",
  veille: "veille",
  contrats: "contrats",
};

/** La question à laquelle répond la synthèse du groupe, en tête de page. */
export const GROUP_QUESTIONS: Record<SectionGroup, string> = {
  missions: "Où en est votre système : chantiers, décisions, audits et pièces remises.",
  site: "Comment va votre site, et de quoi votre système est fait.",
  agir: "Ce qui demande votre intervention, puis ce qui attend votre arbitrage.",
  veille: "Ce qui change autour de vous, et ce qui concerne vos composants.",
  contrats: "Ce qui attend votre accord, et ce qui est signé.",
};

export function groupFromSlug(slug: string): SectionGroup | null {
  const entry = Object.entries(GROUP_SLUGS).find(([, value]) => value === slug);
  return entry ? (entry[0] as SectionGroup) : null;
}

export interface VisibleGroup {
  group: SectionGroup;
  label: string;
  sections: Section[];
  /** Vrai si le groupe a sa page de synthèse (deux entrées ou plus). */
  synthese: boolean;
}

/** Les groupes des sections visibles, dans l'ordre de la navigation. L'accueil n'en fait pas partie. */
export function visibleGroups(sections: readonly Section[]): VisibleGroup[] {
  const groups: VisibleGroup[] = [];
  for (const section of sections) {
    if (!section.group) continue;
    let groupe = groups.find((candidate) => candidate.group === section.group);
    if (!groupe) {
      groupe = { group: section.group, label: GROUP_LABELS[section.group], sections: [], synthese: false };
      groups.push(groupe);
    }
    groupe.sections.push(section);
    groupe.synthese = groupe.sections.length > 1;
  }
  return groups;
}

/**
 * La partie « À arbitrer » de la page Actions est-elle souscrite ? Mêmes
 * services que la roadmap, dont elle arbitre les opportunités.
 */
export function arbitrageOuvert(sections: readonly Section[]): boolean {
  return sections.some((section) => section.key === "roadmap");
}

/** Une section cochée mais vide quitte la navigation après ce délai (décision du 2026-09-27). */
export const SOMMEIL_JOURS = 7;

/** Vide, pour les sections dont l'espace sait mesurer le contenu. `null` : jamais mise en sommeil. */
function vide(key: SectionKey, contents: Contents): boolean | null {
  switch (key) {
    case "missions":
      return contents.roadmap + contents.decisions + contents.audits === 0;
    case "roadmap":
      return contents.roadmap === 0;
    case "decisions":
      return contents.decisions === 0;
    case "audit":
      return contents.audits === 0;
    case "documents":
      return contents.documents === 0;
    case "cartographie":
      return contents.cartographie === 0;
    case "site":
      return !contents.site;
    case "veille-technique":
      return contents.sentinelle !== true;
    default:
      // Accueil, Actions, Veille, Contrats : toujours utiles, ou déjà ouvertes
      // au seul contenu. Les prestations : leur nombre n'est pas dans `Contents`.
      return null;
  }
}

/**
 * Les sections « en sommeil » : ouvertes par un service coché, encore vides,
 * et ouvertes depuis plus de `SOMMEIL_JOURS`. Elles quittent la navigation —
 * une entrée qui ne mène qu'à « En préparation » est du bruit — mais restent
 * accessibles (elles figurent dans « Votre accompagnement »), et reviennent
 * d'elles-mêmes au premier contenu.
 *
 * La semaine se compte depuis l'OUVERTURE de la section (date où son service a
 * été vu coché, `servicesOuverts`), pas depuis aujourd'hui : un client tout
 * juste lancé garde ses sections le temps que le premier livrable arrive. Sans
 * date connue (régime historique), rien n'est mis en sommeil.
 */
export function sectionsEnSommeil(
  sections: readonly Section[],
  contents: Contents,
  ouverts: Record<string, string>,
  maintenant: Date,
): Set<SectionKey> {
  const seuil = maintenant.getTime() - SOMMEIL_JOURS * 86_400_000;
  const sommeil = new Set<SectionKey>();
  for (const section of sections) {
    if (!section.services || vide(section.key, contents) !== true) continue;
    const dates = section.services
      .map((code) => ouverts[code])
      .filter((date): date is string => Boolean(date))
      .map((date) => new Date(date).getTime());
    if (dates.length === 0) continue;
    if (Math.min(...dates) < seuil) sommeil.add(section.key);
  }
  return sommeil;
}
