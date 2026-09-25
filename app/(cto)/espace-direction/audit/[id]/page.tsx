import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadEspace } from "../../shell";
import { requireSession } from "../../session";
import { viewerFromSession } from "../../viewer";
import { VueLectureAudit } from "../../vues";

export const metadata: Metadata = {
  title: "Audit",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * La lecture d'un audit. Le contrôle d'appartenance est dans la vue : elle ne
 * cherche l'audit que parmi les livrables publiés de CET accompagnement.
 */
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireSession();
  const viewer = viewerFromSession(session);
  const vue = await VueLectureAudit({ viewer, context: await loadEspace(viewer.clientId), id });
  if (!vue) notFound();
  return vue;
}
