import { NextResponse } from "next/server";

/**
 * Route désactivée (2026-09-27) : plus aucune page ne l'appelle.
 *
 * `/audit-site-web` a été refondu autour d'`AuditExperience.tsx`, qui ne fait
 * plus de rapport IA automatique — seulement de la capture de lead vers
 * Agathe (`/api/contact`). Le seul appelant restant, `GeminiSearch`
 * (`components/gemini/gemini-search.tsx`), n'est plus rendu par aucune page
 * vivante (`ClientGeminiBlock` et `GeminiSearchHomepage`, qui le montaient,
 * sont eux-mêmes du code mort — vérifié : aucun import de l'un ou l'autre
 * nulle part dans le repo). Cette route restait pourtant joignable en appel
 * direct, sans autre protection qu'un reCAPTCHA — un appel Gemini payant et un
 * e-mail par requête, sans plafond de volume. Fermée plutôt que protégée :
 * rien de légitime ne l'utilise.
 *
 * L'ancienne implémentation (analyse Gemini + gabarit d'e-mail
 * `lib/audit-email-renderer.ts`) est dans l'historique git, pas ici : la
 * ressusciter demande de rebrancher un appelant réel d'abord, et alors
 * seulement de lui redonner une protection (reCAPTCHA + plafond par IP).
 */
export async function POST() {
  return NextResponse.json({ error: "Cet outil n'est plus disponible." }, { status: 410 });
}
