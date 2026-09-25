import { NextResponse, type NextRequest } from "next/server";
import { fileBelongsTo, readFile } from "@cto/files";
import { currentSession } from "../../session";

export const dynamic = "force-dynamic";

/**
 * Sert une pièce jointe — document de l'atelier ou rapport de maintenance.
 *
 * Deux contrôles, et aucun n'est facultatif : une session ouverte, ET un
 * fichier qui appartient à SON accompagnement (`fileBelongsTo`). L'identifiant
 * dans l'URL est l'empreinte du contenu : il ne se devine pas, mais il se
 * transmet — un lien recopié dans un e-mail ne doit rien ouvrir à qui n'est
 * pas du bon accompagnement.
 *
 * Un refus répond 404 et non 403 : dire « ce fichier existe mais pas pour
 * vous » renseignerait déjà sur un autre client.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!/^[a-f0-9]{64}$/.test(id)) return new NextResponse(null, { status: 404 });

  const session = await currentSession();
  if (!session) return new NextResponse(null, { status: 404 });

  if (!(await fileBelongsTo(id, session.person.clientId))) {
    return new NextResponse(null, { status: 404 });
  }

  const file = await readFile(id);
  if (!file) return new NextResponse(null, { status: 404 });

  // `inline` pour un PDF (il s'ouvre dans le navigateur), pièce jointe sinon.
  const disposition = file.ref.mime === "application/pdf" ? "inline" : "attachment";

  return new NextResponse(Buffer.from(file.bytes), {
    status: 200,
    headers: {
      "Content-Type": file.ref.mime,
      "Content-Length": String(file.ref.size),
      "Content-Disposition": `${disposition}; filename*=UTF-8''${encodeURIComponent(file.ref.name)}`,
      // Privé et jamais mis en cache partagé : c'est un document client.
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex",
    },
  });
}
