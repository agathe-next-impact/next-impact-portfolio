// ─────────────────────────────────────────────────────────────────────────────
// Le strict nécessaire de l'API Notion, côté Sentinelle.
//
// Une copie volontaire de `@cto/notion/api.ts`, pas un partage : Sentinelle a sa
// propre intégration (son propre jeton, sa propre base), comme il a son propre
// transport SMTP plutôt que `lib/sendMail.ts`. Un import depuis `@cto/*` collerait
// l'extraction future de Sentinelle en sous-domaine à celle du CTO — exactement
// ce que la règle d'isolation existe pour éviter (voir README.md).
//
// Pas de SDK, pour la même raison que côté CTO : deux opérations (interroger une
// base, écrire une page), le reste serait une dépendance à suivre pour rien.
// ─────────────────────────────────────────────────────────────────────────────

const NOTION_VERSION = "2022-06-28";
const API = "https://api.notion.com/v1";

/** Limite annoncée par Notion : trois requêtes par seconde en moyenne. */
const MIN_INTERVAL_MS = 350;

/** Nombre de tentatives sur une réponse retryable (429, 5xx, coupure réseau). */
const MAX_ATTEMPTS = 4;

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
  const value = process.env.SENTINELLE_NOTION_SECRET?.trim();
  if (!value) {
    throw new NotionError(
      "SENTINELLE_NOTION_SECRET manquante. Créer une intégration interne dédiée sur " +
        "notion.so/profile/integrations (jamais celle du CTO), puis la partager sur la base " +
        "« Sentinelle — Alertes » (menu ••• → Connexions). Voir docs/sentinelle/notion-alertes.md.",
    );
  }
  return value;
}

/** Identifiant de la base « Sentinelle — Alertes ». */
export function alertsDatabaseId(): string {
  const value = process.env.SENTINELLE_NOTION_DB_ALERTES?.trim();
  if (!value) {
    throw new NotionError(
      "SENTINELLE_NOTION_DB_ALERTES manquante. L'identifiant figure dans l'URL de la base, " +
        "une fois créée (voir docs/sentinelle/notion-alertes.md).",
    );
  }
  return value;
}

/** Ce qui manque pour que le module puisse fonctionner, en une phrase, ou null. */
export function configurationIssue(): string | null {
  const missing = ["SENTINELLE_NOTION_SECRET", "SENTINELLE_NOTION_DB_ALERTES"].filter(
    (name) => !process.env[name]?.trim(),
  );
  if (missing.length === 0) return null;
  return `Variables manquantes : ${missing.join(", ")}.`;
}

let lastCall = 0;

/**
 * Espace les appels pour rester sous la limite de Notion.
 *
 * Un simple délai depuis le dernier appel : le volume attendu (quelques dizaines
 * d'alertes par passe, au plus) ne justifie pas un seau à jetons.
 */
async function throttle(): Promise<void> {
  const wait = lastCall + MIN_INTERVAL_MS - Date.now();
  if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
  lastCall = Date.now();
}

async function call(
  path: string,
  init: { method: "GET" | "POST" | "PATCH"; body?: unknown },
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
    const after = Number(response.headers.get("retry-after"));
    const delay = Number.isFinite(after) && after > 0 ? after * 1000 : attempt * 1000;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return call(path, init, attempt + 1);
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    if (response.status === 404) {
      throw new NotionError(
        "Notion répond 404. Soit l'identifiant de base est faux, soit la base « Sentinelle — " +
          "Alertes » n'a pas été partagée avec l'intégration (menu ••• → Connexions).",
        404,
      );
    }
    throw new NotionError(`Notion répond ${response.status} : ${detail.slice(0, 300)}`, response.status);
  }

  return response.json();
}

/**
 * Toutes les pages de la base, pagination suivie jusqu'au bout.
 *
 * La synchro a besoin de la liste complète pour savoir ce qui a changé de statut
 * depuis le dernier passage — un flux partiel ferait manquer une validation.
 */
export async function queryDatabase(databaseId: string, sorts?: unknown[]): Promise<NotionPage[]> {
  const pages: NotionPage[] = [];
  let cursor: string | null = null;

  do {
    const body: Record<string, unknown> = { page_size: 100 };
    if (sorts) body.sorts = sorts;
    if (cursor) body.start_cursor = cursor;

    const data = (await call(`/databases/${databaseId}/query`, { method: "POST", body })) as QueryResponse;
    pages.push(...data.results);
    cursor = data.has_more ? data.next_cursor : null;
  } while (cursor);

  return pages;
}

/** Crée une page dans la base, avec ces propriétés initiales. */
export async function createPage(
  databaseId: string,
  properties: Record<string, unknown>,
): Promise<NotionPage> {
  return (await call("/pages", {
    method: "POST",
    body: { parent: { database_id: databaseId }, properties },
  })) as NotionPage;
}

/** Met à jour les propriétés d'une page existante — celles omises ne changent pas. */
export async function updatePage(
  pageId: string,
  properties: Record<string, unknown>,
): Promise<NotionPage> {
  return (await call(`/pages/${pageId}`, { method: "PATCH", body: { properties } })) as NotionPage;
}

/** URL d'une page Notion, pour un lien direct depuis l'admin. */
export function pageUrl(pageId: string): string {
  return `https://notion.so/${pageId.replace(/-/g, "")}`;
}
