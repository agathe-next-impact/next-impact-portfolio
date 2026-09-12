// ─────────────────────────────────────────────────────────────────────────────
// Derniers numéros publiés sur Substack — lecture publique, sans clé d'API.
//
// Source : l'archive JSON de la publication (`/api/v1/archive`). Elle rend déjà
// le titre, le sous-titre, l'URL canonique, la date et l'image de une : rien à
// parser. Le flux RSS `/feed` porte les mêmes champs mais exigerait un parseur
// XML — aucune dépendance de ce genre dans le projet, et on n'en ajoute pas
// pour une carte.
//
// Cet endpoint n'est pas documenté par Substack : on ne lui fait donc pas
// confiance. Chaque champ est vérifié, et toute anomalie — réseau, HTTP, forme
// inattendue — renvoie une liste vide. À l'appelant d'afficher sa version
// statique : un flux tiers ne doit jamais casser une page de la vitrine, ni
// faire échouer le build.
//
// Fraîcheur : `next.revalidate` place la réponse dans le Data Cache. La
// fraîcheur réelle reste bornée par le `revalidate` du segment appelant — une
// page en ISR 86400 ne verra le nouveau numéro qu'une fois par jour.
// ─────────────────────────────────────────────────────────────────────────────

import { NEWSLETTER_PUBLICATION_URL } from "@/lib/newsletter";

export interface LettreSubstack {
  /** Titre brut tel que Substack le publie, crochet compris. */
  titre: string;
  /**
   * Étiquette sectorielle extraite du crochet de tête — « Asso », « Indutrie »…
   * `null` sur les numéros généralistes, qui sont la majorité.
   */
  etiquette: string | null;
  /** Le titre sans son crochet : la forme à afficher. */
  titreCourt: string;
  /** Sous-titre du numéro, souvent absent. */
  sousTitre: string | null;
  /** URL canonique du numéro sur Substack. */
  url: string;
  /** Date de publication, ISO 8601. */
  date: string;
  /** Image de une — absente sur la majorité des numéros : prévoir sans. */
  image: string | null;
}

/** La lettre paraît chaque semaine : inutile d'interroger plus souvent. */
const REVALIDATE_S = 3600;
const TIMEOUT_MS = 5000;

/** Plafond de l'API ; on demande un peu plus que le besoin (voir plus bas). */
const MAX_ENTREES = 12;

interface EntreeArchive {
  title?: unknown;
  subtitle?: unknown;
  canonical_url?: unknown;
  post_date?: unknown;
  cover_image?: unknown;
  audience?: unknown;
  type?: unknown;
}

/**
 * Les numéros sectoriels sont titrés « [Asso - #sept 2026] Le vrai titre ».
 * Le crochet est une convention d'écriture de la lettre, pas du contenu : on le
 * sort ici, une fois, pour que chaque vue décide de l'afficher ou non. Sans
 * crochet, le titre ressort intact.
 */
function decouperTitre(titre: string): {
  etiquette: string | null;
  titreCourt: string;
} {
  const decoupe = /^\[([^\]]{1,48})\]\s*(.+)$/.exec(titre);
  if (!decoupe) return { etiquette: null, titreCourt: titre };
  return { etiquette: decoupe[1].trim(), titreCourt: decoupe[2].trim() };
}

function normaliser(entree: EntreeArchive): LettreSubstack | null {
  const titre = typeof entree.title === "string" ? entree.title.trim() : "";
  const url =
    typeof entree.canonical_url === "string" ? entree.canonical_url : "";
  const date = typeof entree.post_date === "string" ? entree.post_date : "";

  // Sans l'un de ces trois, la carte n'a rien à montrer ni où mener.
  if (!titre || !url.startsWith("https://") || !date) return null;
  if (Number.isNaN(Date.parse(date))) return null;

  // On n'expose que les numéros lisibles par tous : un numéro réservé aux
  // abonnés payants mènerait le lecteur droit sur un mur.
  if (entree.audience !== "everyone") return null;
  // L'archive mêle numéros, podcasts et fils de discussion.
  if (entree.type !== "newsletter") return null;

  const sousTitre =
    typeof entree.subtitle === "string" ? entree.subtitle.trim() : "";
  const image = typeof entree.cover_image === "string" ? entree.cover_image : "";

  return {
    titre,
    ...decouperTitre(titre),
    sousTitre: sousTitre || null,
    url,
    date,
    image: image.startsWith("https://") ? image : null,
  };
}

/**
 * Les `limite` derniers numéros publics, du plus récent au plus ancien.
 * Renvoie une liste vide plutôt que de lever : l'appelant doit prévoir le cas.
 */
export async function getDernieresLettres(
  limite = 3,
): Promise<LettreSubstack[]> {
  const voulu = Math.min(Math.max(limite, 1), MAX_ENTREES);
  // On demande une marge : les entrées écartées (podcast, numéro payant, forme
  // inattendue) ne doivent pas rendre la liste plus courte que demandé.
  const demande = Math.min(voulu + 3, MAX_ENTREES);

  try {
    const reponse = await fetch(
      `${NEWSLETTER_PUBLICATION_URL}/api/v1/archive?sort=new&limit=${demande}`,
      {
        headers: {
          // Identifiable dans les journaux de Substack, comme SentinelleBot.
          "user-agent": "next-impact.digital (+https://next-impact.digital)",
          accept: "application/json",
        },
        signal: AbortSignal.timeout(TIMEOUT_MS),
        next: { revalidate: REVALIDATE_S, tags: ["substack"] },
      },
    );
    if (!reponse.ok) return [];

    const donnees: unknown = await reponse.json();
    if (!Array.isArray(donnees)) return [];

    return donnees
      .map((entree) =>
        entree && typeof entree === "object"
          ? normaliser(entree as EntreeArchive)
          : null,
      )
      .filter((lettre): lettre is LettreSubstack => lettre !== null)
      .slice(0, voulu);
  } catch {
    // DNS, timeout, JSON invalide : on dégrade en silence, jamais en erreur.
    return [];
  }
}

/** Le dernier numéro public, ou `null` si le flux est indisponible. */
export async function getDerniereLettre(): Promise<LettreSubstack | null> {
  const [derniere] = await getDernieresLettres(1);
  return derniere ?? null;
}
