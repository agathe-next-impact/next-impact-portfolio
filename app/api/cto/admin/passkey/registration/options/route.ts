import { NextResponse } from "next/server";
import { startAdminRegistration } from "@cto/admin";
import { currentSession } from "@/app/(cto)/admin-cto/session";

// Ouverture d'une cérémonie d'enrôlement admin. Route PRIVÉE : on n'ajoute une
// passkey qu'à une session déjà ouverte — la porte d'entrée reste le lien de
// secours envoyé à agathe@next-impact.digital.

export const dynamic = "force-dynamic";

export async function POST() {
  const session = await currentSession();
  if (!session) {
    return NextResponse.json({ error: "Session expirée." }, { status: 401 });
  }

  try {
    const { challengeId, options } = await startAdminRegistration();
    return NextResponse.json({ challengeId, options });
  } catch (error) {
    console.error("[cto] ouverture d'enrôlement admin impossible", error);
    return NextResponse.json({ error: "L'enregistrement est momentanément indisponible." }, { status: 503 });
  }
}
