// ─────────────────────────────────────────────────────────────────────────────
// Le strict nécessaire de l'API publique WP Umbrella.
//
// Référence : la spécification OpenAPI publiée par WP Umbrella
// (github.com/WP-Umbrella/umbrella-skill, `openapi-public.json`). Elle ne
// donne que des exemples de réponse ; la lecture défensive est dans
// `normalize.ts`, ce fichier ne fait que transporter.
//
// Même discipline que `src/cto/notion/api.ts` : pas de SDK, `fetch` et une
// reprise simple sur 429 et 5xx. Appelé par le Cron et par la commande, jamais
// pendant une requête client.
// ─────────────────────────────────────────────────────────────────────────────

const API = "https://public-api.wp-umbrella.com";
const MAX_ATTEMPTS = 3;

export class WpUmbrellaError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "WpUmbrellaError";
  }
}

/** Jeton de l'API publique, ou null si la variable n'est pas posée. */
export function wpUmbrellaToken(): string | null {
  return process.env.WP_UMBRELLA_TOKEN?.trim() || null;
}

/**
 * GET d'un endpoint, réponse déballée (`data`).
 *
 * Toutes les réponses arrivent sous la forme `{ code: "success", data }` ; le
 * déballage se fait ici une fois pour toutes.
 */
export async function getWpu(path: string, attempt = 1): Promise<unknown> {
  const token = wpUmbrellaToken();
  if (!token) throw new WpUmbrellaError("WP_UMBRELLA_TOKEN manquante.");

  let response: Response;
  try {
    response = await fetch(`${API}${path}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });
  } catch (error) {
    if (attempt >= MAX_ATTEMPTS) throw error;
    await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
    return getWpu(path, attempt + 1);
  }

  if ((response.status === 429 || response.status >= 500) && attempt < MAX_ATTEMPTS) {
    const after = Number(response.headers.get("retry-after"));
    const delay = Number.isFinite(after) && after > 0 ? after * 1000 : attempt * 2000;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return getWpu(path, attempt + 1);
  }

  const body = (await response.json().catch(() => null)) as
    | { data?: unknown; code?: string; message?: string }
    | null;

  if (!response.ok) {
    // 403 `invalid_scope` : le jeton existe mais n'est pas un jeton d'API
    // publique (c'est la confusion la plus probable — une clé de connexion de
    // site). Le dire en clair épargne une heure de recherche.
    if (response.status === 403 && body?.code === "invalid_scope") {
      throw new WpUmbrellaError(
        "jeton refusé (invalid_scope) : générer un jeton d'API PUBLIQUE dans WP Umbrella → Profil → Public API.",
        403,
      );
    }
    if (response.status === 401) {
      throw new WpUmbrellaError("jeton WP Umbrella invalide ou expiré (401).", 401);
    }
    if (response.status === 404) {
      throw new WpUmbrellaError("projet introuvable chez WP Umbrella (404) : vérifier l'identifiant.", 404);
    }
    throw new WpUmbrellaError(
      `WP Umbrella répond ${response.status}${body?.message ? ` : ${body.message}` : ""}.`,
      response.status,
    );
  }

  return body && "data" in body ? body.data : body;
}
