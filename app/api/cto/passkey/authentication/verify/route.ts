import { NextResponse } from "next/server";
import { z } from "zod";
import {
  accessDecision,
  finishAuthentication,
  findPersonById,
  record,
  type ClientStatus,
} from "@cto/access";
import { startSession } from "@/app/(cto)/espace-direction/session";

// Vérification d'une connexion par passkey, puis ouverture de session.
//
// Deux contrôles se suivent et ne se remplacent pas :
//   1. la signature prouve QUI se présente (`finishAuthentication`) ;
//   2. l'état de l'accompagnement dit si cette personne a encore le droit
//      d'entrer (`accessDecision`).
// Un espace `clos` refuse ici, même avec une passkey parfaitement valide — et le
// refus est journalisé, parce qu'une tentative après clôture est précisément le
// genre d'événement qu'on veut pouvoir dater.

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  challengeId: z.string().uuid(),
  // La réponse WebAuthn est validée en profondeur par la bibliothèque ; ici on
  // vérifie seulement que c'est un objet, pour ne pas lui passer n'importe quoi.
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
    const outcome = await finishAuthentication(
      parsed.challengeId,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      parsed.response as any,
    );

    if (!outcome.ok) {
      await record({ event: "acces_refuse", detail: outcome.reason });
      return NextResponse.json({ error: outcome.reason }, { status: 401 });
    }

    const person = await findPersonById(outcome.personId);
    if (!person) {
      await record({ event: "acces_refuse", detail: "personne introuvable ou révoquée" });
      return NextResponse.json({ error: "Cet accès a été révoqué." }, { status: 401 });
    }

    const decision = accessDecision(person.status as ClientStatus);
    if (!decision.allowed) {
      await record({
        event: "acces_refuse",
        personId: person.id,
        clientId: person.clientId,
        detail: `espace ${person.status}`,
      });
      return NextResponse.json({ error: "Cet espace est clos." }, { status: 403 });
    }

    await startSession(person.id);
    await record({
      event: "connexion_passkey",
      personId: person.id,
      clientId: person.clientId,
      detail: outcome.label,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[cto] vérification de connexion impossible", error);
    return NextResponse.json(
      { error: "La connexion est momentanément indisponible." },
      { status: 503 },
    );
  }
}
