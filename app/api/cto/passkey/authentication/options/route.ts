import { NextResponse } from "next/server";
import { startAuthentication } from "@cto/access";

// Ouverture d'une cérémonie de connexion.
//
// Route publique, et elle doit le rester : on ne sait pas encore qui se
// présente. Elle ne prend aucune entrée, ne révèle rien, et se contente d'émettre
// un défi aléatoire. Un tiers qui l'appellerait en boucle n'obtiendrait que des
// nombres au hasard et des lignes de défi qui expirent en cinq minutes — le
// balayage de `purgeExpiredAccess` s'en charge.

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const { challengeId, options } = await startAuthentication();
    return NextResponse.json({ challengeId, options });
  } catch (error) {
    console.error("[cto] ouverture de connexion impossible", error);
    return NextResponse.json(
      { error: "La connexion est momentanément indisponible." },
      { status: 503 },
    );
  }
}
