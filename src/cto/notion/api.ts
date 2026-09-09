// ─────────────────────────────────────────────────────────────────────────────
// Le strict nécessaire de l'API Notion.
//
// Pas de SDK : ce module fait deux choses — interroger une base et suivre sa
// pagination. Ajouter une dépendance pour cinquante lignes de `fetch` coûterait
// plus cher en surface de mise à jour que ce qu'elle ferait gagner, et le SDK
// officiel change de forme à chaque version d'API.
//
// **Version d'API épinglée.** Depuis `2025-09-03`, une base Notion expose des
// *data sources* et l'interrogation passe par `/v1/data_sources/{id}/query`.
// Tant que chaque base n'a qu'une source — c'est le cas des cinq nôtres —,
// `2022-06-28` fait exactement le même travail avec un identifiant de moins à
// tenir. Les identifiants de data source sont notés sur la page Notion, pour le
// jour où la migration s'imposera.
// ─────────────────────────────────────────────────────────────────────────────

const NOTION_VERSION = "2022-06-28";
const API = "https://api.notion.com/v1";

/** Limite annoncée par Notion : trois requêtes par seconde en moyenne. */
const MIN_INTERVAL_MS = 350;

/** Nombre de tentatives sur une réponse retryable (429, 5xx, coupure réseau). */
const MAX_ATTEMPTS = 4;

export interface NotionRichText {
  plain_text?: string;
  href?: string | null;
  annotations?: { bold?: boolean; italic?: boolean; code?: boolean };
}

export interface NotionProperty {
  type: string;
  [key: string]: unknown;
}

export interface NotionPage {
  id: string;
  properties: Record<string, NotionProperty>;
  last_edited_time?: string;
}

interface QueryResponse {
  results: NotionPage[];
  next_cursor: string | null;
  has_more: boolean;
}

export class NotionError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "NotionError";
  }
}

function token(): string {
  const value = process.env.CTO_NOTION_TOKEN?.trim();
  if (!value) {
    throw new NotionError(
      "CTO_NOTION_TOKEN manquante. Créer une intégration interne sur notion.so/profile/integrations, " +
        "puis la partager sur la page « Direction technique — clients » (menu ••• → Connexions).",
    );
  }
  return value;
}

let lastCall = 0;

/**
 * Espace les appels pour rester sous la limite de Notion.
 *
 * Un simple délai depuis le dernier appel, pas un seau à jetons : la synchro est
 * séquentielle et fait moins de dix requêtes. Une mécanique plus fine serait du
 * code à maintenir pour un problème qui n'existe pas ici.
 */
async function throttle(): Promise<void> {
  const wait = lastCall + MIN_INTERVAL_MS - Date.now();
  if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
  lastCall = Date.now();
}

async function call(
  path: string,
  init: { method: "GET" | "POST"; body?: unknown },
  attempt = 1,
): Promise<unknown> {
  await throttle();

  let response: Response;
  try {
    response = await fetch(`${API}${path}`, {
      method: init.method,
      headers: {
        Authorization: `Bearer ${token()}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
    });
  } catch (error) {
    if (attempt >= MAX_ATTEMPTS) throw error;
    await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
    return call(path, init, attempt + 1);
  }

  if (response.status === 429 || response.status >= 500) {
    if (attempt >= MAX_ATTEMPTS) {
      throw new NotionError(
        `Notion répond ${response.status} après ${MAX_ATTEMPTS} tentatives.`,
        response.status,
      );
    }
    // `Retry-After` est en secondes quand Notion le fournit ; sinon on recule
    // d'une seconde de plus à chaque tentative.
    const after = Number(response.headers.get("retry-after"));
    const delay = Number.isFinite(after) && after > 0 ? after * 1000 : attempt * 1000;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return call(path, init, attempt + 1);
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    // Le 404 mérite son propre message : c'est l'erreur qu'on obtient quand la
    // base existe mais n'a pas été partagée avec l'intégration, et le message
    // brut de Notion ne le dit pas.
    if (response.status === 404) {
      throw new NotionError(
        "Notion répond 404. Soit l'identifiant de base est faux, soit la page « Direction technique " +
          "— clients » n'a pas été partagée avec l'intégration (menu ••• → Connexions).",
        404,
      );
    }
    throw new NotionError(`Notion répond ${response.status} : ${detail.slice(0, 300)}`, response.status);
  }

  return response.json();
}

function post(path: string, body: unknown): Promise<unknown> {
  return call(path, { method: "POST", body });
}

/** Lecture simple. Partage la limite de débit et les reprises avec les écritures. */
export function getJson(path: string): Promise<unknown> {
  return call(path, { method: "GET" });
}

/**
 * Toutes les pages d'une base, filtre optionnel appliqué côté Notion.
 *
 * La pagination est suivie jusqu'au bout et le résultat rendu d'un bloc : la
 * synchro a besoin de la liste COMPLÈTE pour décider ce qui a disparu. Rendre un
 * flux partiel ferait retirer des livrables encore publiés au premier incident
 * réseau.
 */
export async function queryDatabase(
  databaseId: string,
  filter?: unknown,
): Promise<NotionPage[]> {
  const pages: NotionPage[] = [];
  let cursor: string | null = null;

  do {
    const body: Record<string, unknown> = { page_size: 100 };
    if (filter) body.filter = filter;
    if (cursor) body.start_cursor = cursor;

    const data = (await post(`/databases/${databaseId}/query`, body)) as QueryResponse;
    pages.push(...data.results);
    cursor = data.has_more ? data.next_cursor : null;
  } while (cursor);

  return pages;
}

/**
 * Une page seule, avec ses propriétés.
 *
 * Sert à suivre une relation vers une base que la synchro ne balaie pas — la
 * fiche organisation, par exemple. Une requête par page : à quatre
 * accompagnements, c'est moins cher que de charger une base entière pour n'en
 * lire que quatre lignes.
 */
export async function fetchPage(pageId: string): Promise<NotionPage> {
  return (await getJson(`/pages/${pageId}`)) as NotionPage;
}

/** Filtre « la case Publié est cochée ». Le seul interrupteur de visibilité. */
export function publishedFilter(property: string): unknown {
  return { property, checkbox: { equals: true } };
}
