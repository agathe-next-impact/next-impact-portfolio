import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { kindFromSlug } from "../../../livrables";
import { loadEspace } from "../../../shell";
import { requireSession } from "../../../session";
import { viewerFromSession } from "../../../viewer";
import { VueHistorique } from "../../../vues";

export const metadata: Metadata = {
  title: "Historique d'un livrable",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * L'historique d'un livrable. `history()` filtre elle-même sur le client : un
 * identifiant d'un autre accompagnement rend une liste vide, donc un 404.
 */
export default async function Page({
  params,
}: {
  params: Promise<{ categorie: string; id: string }>;
}) {
  const { categorie, id } = await params;
  const kind = kindFromSlug(categorie);
  if (!kind) notFound();

  const session = await requireSession();
  const viewer = viewerFromSession(session);
  const vue = await VueHistorique({ viewer, context: await loadEspace(viewer.clientId), kind, id });
  if (!vue) notFound();
  return vue;
}
