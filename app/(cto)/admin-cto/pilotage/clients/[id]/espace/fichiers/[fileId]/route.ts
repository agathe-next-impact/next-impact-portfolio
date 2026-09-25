import { NextResponse, type NextRequest } from "next/server";
import { fileBelongsTo, readFile } from "@cto/files";
import { hasSession } from "../../../../../../session";

export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Une pièce jointe, vue depuis la supervision.
 *
 * Un Route Handler n'hérite d'aucun layout : la session admin est vérifiée
 * ICI. L'appartenance aussi — la pièce doit être celle de l'accompagnement de
 * l'URL, pour qu'un lien de la vue admin désigne sans ambiguïté ce que le
 * client, lui, peut télécharger.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; fileId: string }> },
) {
  const { id, fileId } = await params;
  if (!UUID.test(id) || !/^[a-f0-9]{64}$/.test(fileId)) return new NextResponse(null, { status: 404 });
  if (!(await hasSession())) return new NextResponse(null, { status: 404 });
  if (!(await fileBelongsTo(fileId, id))) return new NextResponse(null, { status: 404 });

  const file = await readFile(fileId);
  if (!file) return new NextResponse(null, { status: 404 });

  const disposition = file.ref.mime === "application/pdf" ? "inline" : "attachment";
  return new NextResponse(Buffer.from(file.bytes), {
    status: 200,
    headers: {
      "Content-Type": file.ref.mime,
      "Content-Length": String(file.ref.size),
      "Content-Disposition": `${disposition}; filename*=UTF-8''${encodeURIComponent(file.ref.name)}`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex",
    },
  });
}
