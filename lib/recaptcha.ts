// Vérification serveur des jetons reCAPTCHA v3.
//
// Le jeton est produit côté client par lib/recaptcha-client.ts et joint au corps
// JSON sous `recaptchaToken`. Chaque route vérifie : succès, action attendue,
// score >= RECAPTCHA_MIN_SCORE (0.5 par défaut).
//
// Sans RECAPTCHA_SECRET_KEY (dev local, préview non configurée), la vérification
// est désactivée : un formulaire de contact muet coûte plus cher qu'un spam.
// Même logique si Google est injoignable : on laisse passer et on trace.

const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

export type RecaptchaAction = "contact" | "newsletter" | "send_audit" | "sentinelle_scan";

export type RecaptchaVerdict =
  | { ok: true; skipped?: boolean; score?: number }
  | { ok: false; reason: "missing-token" | "invalid-token" | "wrong-action" | "low-score"; score?: number };

let warnedMissingSecret = false;

export async function verifyRecaptcha(
  token: unknown,
  expectedAction: RecaptchaAction,
  remoteIp?: string | null,
): Promise<RecaptchaVerdict> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    if (!warnedMissingSecret) {
      console.warn("[recaptcha] RECAPTCHA_SECRET_KEY absente : vérification désactivée");
      warnedMissingSecret = true;
    }
    return { ok: true, skipped: true };
  }

  if (typeof token !== "string" || !token) return { ok: false, reason: "missing-token" };

  const params = new URLSearchParams({ secret, response: token });
  if (remoteIp) params.set("remoteip", remoteIp);

  let data: { success?: boolean; score?: number; action?: string; "error-codes"?: string[] };
  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      body: params,
      signal: AbortSignal.timeout(5000),
    });
    data = await res.json();
  } catch (err) {
    console.error("[recaptcha] siteverify injoignable, requête acceptée :", err);
    return { ok: true, skipped: true };
  }

  if (!data.success) {
    console.warn("[recaptcha] jeton refusé :", data["error-codes"]);
    return { ok: false, reason: "invalid-token" };
  }
  if (data.action !== expectedAction) {
    return { ok: false, reason: "wrong-action", score: data.score };
  }

  // Variable vide ou invalide → 0.5 (Number("") vaudrait 0 et laisserait tout passer).
  const rawMin = process.env.RECAPTCHA_MIN_SCORE?.trim();
  const minScore = rawMin && !Number.isNaN(Number(rawMin)) ? Number(rawMin) : 0.5;
  const score = data.score ?? 0;
  if (score < minScore) {
    console.warn(`[recaptcha] score ${score} < ${minScore} (${expectedAction})`);
    return { ok: false, reason: "low-score", score };
  }

  return { ok: true, score };
}

/** IP client derrière le proxy Vercel (premier maillon de x-forwarded-for). */
export function requestIp(headers: Headers): string | null {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip");
}

export function recaptchaErrorMessage(isEn: boolean): string {
  return isEn
    ? "Anti-spam check failed. Please reload the page and try again, or email agathe@next-impact.digital."
    : "La vérification anti-spam a échoué. Rechargez la page et réessayez, ou écrivez à agathe@next-impact.digital.";
}
