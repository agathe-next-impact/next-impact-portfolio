import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { kindFromSlug } from "../../livrables";
import { loadEspace } from "../../shell";
import { requireSession } from "../../session";
import { viewerFromSession } from "../../viewer";
import { VueCategorie } from "../../vues";

export const metadata: Metadata = {
  title: "Livrables",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Une catégorie de livrables, en entier (à la une ou non). La garde est refaite
 * ici : une page n'hérite d'aucune autorisation de celle qui a produit le lien.
 */
export default async function Page({ params }: { params: Promise<{ categorie: string }> }) {
  const { categorie } = await params;
  const kind = kindFromSlug(categorie);
  if (!kind) notFound();

  const session = await requireSession();
  const viewer = viewerFromSession(session);
  return <VueCategorie viewer={viewer} context={await loadEspace(viewer.clientId)} kind={kind} />;
}
