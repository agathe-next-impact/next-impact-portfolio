import { NextResponse } from "next/server";
import { startAdminAuthentication } from "@cto/admin";

// Ouverture d'une cérémonie de connexion admin. Route publique, comme côté
// client : elle n'émet qu'un défi aléatoire, sans rien révéler.

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const { challengeId, options } = await startAdminAuthentication();
    return NextResponse.json({ challengeId, options });
  } catch (error) {
    console.error("[cto] ouverture de connexion admin impossible", error);
    return NextResponse.json({ error: "La connexion est momentanément indisponible." }, { status: 503 });
  }
}
