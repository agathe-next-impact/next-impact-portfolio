// ─────────────────────────────────────────────────────────────────────────────
// Couche réseau des collecteurs — la seule I/O du module.
//
// Trois contraintes, toutes appliquées ici plutôt que rappelées dans chaque
// collecteur :
//
//  1. **Le nombre d'appels sortants est borné et journalisé.** Le jour où un
//     client aura soixante composants, le cron ne doit pas partir en soixante
//     requêtes par source. Le budget est partagé par toute la passe.
//  2. **Aucune exception ne remonte.** Une source indisponible est un résultat
//     — « rien collecté aujourd'hui chez untel » — pas un échec de tâche. Une
//     source qui tombe ne doit pas emporter les trois autres.
//  3. **User-Agent identifiable.** Ces API sont gratuites et tenues par des
//     bénévoles : elles doivent pouvoir nous reconnaître et nous joindre.
// ─────────────────────────────────────────────────────────────────────────────

export const USER_AGENT = "SentinelleBot (+https://next-impact.digital)";

/** Plafond d'appels sortants pour une passe de collecte, toutes sources confondues. */
export const CALL_BUDGET = 120;

const TIMEOUT_MS = 12_000;

export interface CallBudget {
  spend(): boolean;
  spent(): number;
  remaining(): number;
}

export function createCallBudget(max: number = CALL_BUDGET): CallBudget {
  let used = 0;
  return {
    spend: () => (used >= max ? false : (used++, true)),
    spent: () => used,
    remaining: () => Math.max(0, max - used),
  };
}

export type JsonOutcome<T> = { ok: true; data: T } | { ok: false; reason: string };

export interface JsonRequest {
  url: string;
  method?: "GET" | "POST";
  body?: unknown;
  headers?: Record<string, string>;
}

/**
 * Requête JSON vers une source de veille.
 *
 * Ne lève jamais. Le type de retour force l'appelant à traiter l'échec, ce qui
 * évite le `try/catch` oublié qui transforme une API en panne en cron rouge.
 */
export async function fetchJson<T>(
  request: JsonRequest,
  budget: CallBudget,
): Promise<JsonOutcome<T>> {
  if (!budget.spend()) {
    return { ok: false, reason: "budget d'appels épuisé" };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(request.url, {
      method: request.method ?? "GET",
      signal: controller.signal,
      headers: {
        "user-agent": USER_AGENT,
        accept: "application/json",
        ...(request.body ? { "content-type": "application/json" } : {}),
        ...request.headers,
      },
      body: request.body ? JSON.stringify(request.body) : undefined,
    });

    if (!response.ok) {
      return { ok: false, reason: `HTTP ${response.status}` };
    }

    return { ok: true, data: (await response.json()) as T };
  } catch (error) {
    const reason =
      error instanceof Error && error.name === "AbortError"
        ? `délai dépassé (${TIMEOUT_MS / 1000} s)`
        : error instanceof Error
          ? error.message
          : "erreur réseau";
    return { ok: false, reason };
  } finally {
    clearTimeout(timer);
  }
}
