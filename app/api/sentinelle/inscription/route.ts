import {
  notifierDemande,
  parseSubscriptionRequest,
  recordSubscriptionRequest,
} from "@sentinelle/inscriptions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Demande d'inscription à Sentinelle depuis la page d'offre (2026-09-27).
 *
 * Opt-in : nom, organisation, e-mail, site. Rien n'est créé ni envoyé au
 * demandeur ; la demande attend la validation d'Agathe, qui est prévenue à la
 * première demande d'une adresse. Le formulaire du rapport d'analyse passe par
 * `PATCH /api/sentinelle/scan/[id]`, qui enregistre la même demande.
 */
export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return Response.json({ error: "Demande illisible." }, { status: 400 });
  }

  const parsed = parseSubscriptionRequest(payload);
  if (!parsed.ok) return Response.json({ error: parsed.message }, { status: 400 });

  const { isNew } = await recordSubscriptionRequest(parsed.value);
  // La notification suit l'enregistrement et n'en conditionne pas la réponse.
  if (isNew) await notifierDemande(parsed.value);

  return Response.json({ ok: true });
}
