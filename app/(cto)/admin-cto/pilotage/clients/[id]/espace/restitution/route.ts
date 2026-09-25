import { NextResponse, type NextRequest } from "next/server";
import { collectRestitution, renderRestitutionPdf } from "@cto/restitution";
import { hasSession, LOGIN_PATH } from "../../../../../session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Le dossier de restitution d'un client, généré depuis la supervision — le
 * même PDF que celui que le client télécharge lui-même.
 *
 * Session admin vérifiée ICI : un Route Handler n'hérite d'aucun layout.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await hasSession())) return NextResponse.redirect(new URL(LOGIN_PATH, request.url));

  const { id } = await params;
  if (!UUID.test(id)) return new NextResponse(null, { status: 404 });

  const data = await collectRestitution(id);
  const pdf = renderRestitutionPdf(data);
  const slug = data.company
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const date = new Intl.DateTimeFormat("fr-CA", { timeZone: "Europe/Paris" }).format(data.generatedAt);

  return new NextResponse(Buffer.from(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="restitution-${slug || "espace"}-${date}.pdf"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
