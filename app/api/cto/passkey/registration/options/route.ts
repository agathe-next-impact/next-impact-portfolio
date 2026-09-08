import { NextResponse } from "next/server";
import { startRegistration } from "@cto/access";
import { currentSession } from "@/app/(cto)/espace-direction/session";

// Ouverture d'une cérémonie d'enrôlement.
//
// Route PRIVÉE : on n'ajoute une passkey qu'à un compte dont on prouve déjà la
// possession. C'est ce qui interdit à un tiers de greffer son appareil sur
// l'accès d'un dirigeant — la porte d'entrée reste le lien de secours envoyé à
// l'adresse enregistrée.

export const dynamic = "force-dynamic";

export async function POST() {
  const session = await currentSession();
  if (!session) {
    return NextResponse.json({ error: "Session expirée." }, { status: 401 });
  }

  try {
    const { challengeId, options } = await startRegistration(session.person.id);
    return NextResponse.json({ challengeId, options });
  } catch (error) {
    console.error("[cto] ouverture d'enrôlement impossible", error);
    return NextResponse.json(
      { error: "L'enregistrement est momentanément indisponible." },
      { status: 503 },
    );
  }
}
