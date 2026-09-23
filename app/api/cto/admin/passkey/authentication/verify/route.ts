import { NextResponse } from "next/server";
import { z } from "zod";
import { finishAdminAuthentication } from "@cto/admin";
import { startSession } from "@/app/(cto)/admin-cto/session";

// Vérification d'une connexion par passkey admin, puis ouverture de session.

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  challengeId: z.string().uuid(),
  response: z.object({ id: z.string() }).passthrough(),
});

export async function POST(request: Request) {
  let parsed;
  try {
    parsed = bodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  try {
    const outcome = await finishAdminAuthentication(
      parsed.challengeId,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      parsed.response as any,
    );

    if (!outcome.ok) {
      return NextResponse.json({ error: outcome.reason }, { status: 401 });
    }

    await startSession();

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[cto] vérification de connexion admin impossible", error);
    return NextResponse.json({ error: "La connexion est momentanément indisponible." }, { status: 503 });
  }
}
