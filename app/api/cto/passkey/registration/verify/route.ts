import { NextResponse } from "next/server";
import { z } from "zod";
import { finishRegistration, record, sendEnrollmentNotice } from "@cto/access";
import { currentSession, ESPACE_PATH } from "@/app/(cto)/espace-direction/session";

// Vérification d'un enrôlement, enregistrement de la passkey, notification.
//
// La notification part vers la personne concernée et n'est PAS attendue par la
// réponse : un serveur de messagerie lent ne doit pas faire échouer un
// enrôlement qui a réussi. En contrepartie, son échec est journalisé — un
// message qui ne part jamais et que personne ne remarque vaut moins que pas de
// notification du tout, puisqu'il donne l'illusion d'une surveillance.

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  challengeId: z.string().uuid(),
  response: z.object({ id: z.string() }).passthrough(),
});

function manageUrl(): string {
  const base = process.env.CTO_ORIGIN?.split(",")[0]?.trim() || "https://next-impact.digital";
  return `${base}${ESPACE_PATH}/appareils`;
}

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
    const outcome = await finishRegistration(
      session.person.id,
      parsed.challengeId,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      parsed.response as any,
    );

    if (!outcome.ok) {
      return NextResponse.json({ error: outcome.reason }, { status: 400 });
    }

    await record({
      event: "passkey_ajoutee",
      personId: session.person.id,
      clientId: session.person.clientId,
      detail: outcome.label,
    });

    void sendEnrollmentNotice(
      { email: session.person.email, name: session.person.name },
      outcome.label,
      new Date(),
      manageUrl(),
    ).catch((error) => {
      console.error("[cto] notification d'enrôlement non envoyée", error);
    });

    return NextResponse.json({ ok: true, label: outcome.label });
  } catch (error) {
    console.error("[cto] enrôlement impossible", error);
    return NextResponse.json(
      { error: "L'enregistrement est momentanément indisponible." },
      { status: 503 },
    );
  }
}
