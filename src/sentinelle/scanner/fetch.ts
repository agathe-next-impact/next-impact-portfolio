import type { RawResponse } from "./evidence";

// ─────────────────────────────────────────────────────────────────────────────
// Couche réseau du scanner — la seule I/O du module.
//
// Contraintes de specs/scanner.md, toutes appliquées ici :
//   · analyse passive : on lit ce qu'un visiteur lit, rien d'autre ;
//   · liste blanche fermée de chemins (voir ALLOWED_PATHS) ;
//   · budget de requêtes par scan, pour ne jamais peser sur le site analysé ;
//   · User-Agent identifiable, pour qu'un administrateur puisse nous reconnaître
//     dans ses journaux et nous bloquer s'il le souhaite.
// ─────────────────────────────────────────────────────────────────────────────

export const USER_AGENT = "SentinelleBot (+https://next-impact.digital)";

/**
 * Liste blanche FERMÉE des chemins interrogeables.
 *
 * Toute addition est une décision, pas un détail d'implémentation : chaque
 * entrée doit être un endpoint public standard, servi aux visiteurs, et jamais
 * une tentative de découverte de chemins d'administration.
 */
export const ALLOWED_PATHS = [
  "/", // page d'accueil
  "/wp-json/", // API REST WordPress : confirme le CMS, donne parfois la version
  "/feed/", // flux RSS : balise <generator> souvent conservée
] as const;

export type AllowedPath = (typeof ALLOWED_PATHS)[number];

/** Nombre maximal de requêtes sortantes pour un scan (spec : ~8). */
export const REQUEST_BUDGET = 4;

/** Au-delà, on cesse de lire : une page d'accueil n'a pas besoin de 2 Mo. */
const MAX_BYTES = 1_500_000;

const TIMEOUT_MS = 8_000;

export interface Budget {
  spend(): boolean;
  spent(): number;
}

export function createBudget(max: number = REQUEST_BUDGET): Budget {
  let used = 0;
  return {
    spend: () => (used >= max ? false : (used++, true)),
    spent: () => used,
  };
}

/** Lecture bornée du corps : on tronque plutôt que d'ingérer un fichier énorme. */
async function readCapped(response: Response): Promise<string> {
  if (!response.body) return "";

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: false });
  let text = "";
  let size = 0;

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      text += decoder.decode(value, { stream: true });
      if (size >= MAX_BYTES) break;
    }
  } finally {
    await reader.cancel().catch(() => {});
  }

  return text;
}

export type FetchOutcome =
  | { ok: true; response: RawResponse }
  | { ok: false; reason: string };

/**
 * Récupère une page publique.
 *
 * Ne lève jamais : une panne réseau, un certificat invalide ou un blocage sont
 * des résultats de scan légitimes, pas des exceptions. Le rapport doit pouvoir
 * dire « je n'ai pas pu joindre ce site » sans faire échouer la tâche de fond.
 */
export async function fetchPage(url: string, budget: Budget): Promise<FetchOutcome> {
  if (!budget.spend()) {
    return { ok: false, reason: "budget de requêtes épuisé" };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": USER_AGENT,
        accept: "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8",
        "accept-language": "fr-FR,fr;q=0.9,en;q=0.8",
      },
    });

    const headers: Record<string, string> = {};
    response.headers.forEach((value, name) => {
      headers[name.toLowerCase()] = value;
    });

    // getSetCookie() conserve les cookies multiples, qu'une simple lecture
    // d'en-tête écraserait.
    const setCookies =
      typeof response.headers.getSetCookie === "function"
        ? response.headers.getSetCookie()
        : [];

    return {
      ok: true,
      response: {
        url,
        finalUrl: response.url || url,
        status: response.status,
        headers,
        setCookies,
        html: await readCapped(response),
      },
    };
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
