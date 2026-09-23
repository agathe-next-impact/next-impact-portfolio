import { NextResponse } from "next/server";
import { z } from "zod";
import { finishAdminRegistration, sendAdminEnrollmentNotice } from "@cto/admin";
import { currentSession } from "@/app/(cto)/admin-cto/session";

// Vérification d'un enrôlement admin, enregistrement de la passkey, notification.
//
// La notification n'est pas attendue par la réponse : un serveur de messagerie
// lent ne doit pas faire échouer un enrôlement qui a réussi (même raison que
// `app/api/cto/passkey/registration/verify/route.ts`).

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  challengeId: z.string().uuid(),
  response: z.object({ id: z.string() }).passthrough(),
});

export async function POST(request: Request) {
  const session = await currentSession();
  if (!session) {
    return NextResponse.json({ error: "Session expirée." }, { status: 401 });
  }

  let parsed;
  try {
    parsed = bodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  try {
    const outcome = await finishAdminRegistration(
      parsed.challengeId,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      parsed.response as any,
    );

    if (!outcome.ok) {
      return NextResponse.json({ error: outcome.reason }, { status: 400 });
    }

    void sendAdminEnrollmentNotice(outcome.label, new Date()).catch((error) => {
      console.error("[cto] notification d'enrôlement admin non envoyée", error);
    });

    return NextResponse.json({ ok: true, label: outcome.label });
  } catch (error) {
    console.error("[cto] enrôlement admin impossible", error);
    return NextResponse.json({ error: "L'enregistrement est momentanément indisponible." }, { status: 503 });
  }
}
