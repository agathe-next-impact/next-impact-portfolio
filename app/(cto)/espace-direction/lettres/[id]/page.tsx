import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadEspace } from "../../shell";
import { requireSession } from "../../session";
import { viewerFromSession } from "../../viewer";
import { VueLettre } from "../../vues";

export const metadata: Metadata = {
  title: "Lettre de veille",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * La lecture d'une lettre. Les contrôles (publiée, dans la fenêtre, visible par
 * CET accompagnement) sont dans la requête de `letterForClient`.
 */
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireSession();
  const viewer = viewerFromSession(session);
  const vue = await VueLettre({ viewer, context: await loadEspace(viewer.clientId), id });
  if (!vue) notFound();
  return vue;
}
