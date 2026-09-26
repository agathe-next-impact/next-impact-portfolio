import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { loadEspace, sectionOuverte } from "../shell";
import { ESPACE_PATH, requireSession } from "../session";
import { viewerFromSession } from "../viewer";
import { VueVeilleTechnique } from "../veille-technique";

export const metadata: Metadata = {
  title: "Veille technique",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * La veille technique (Sentinelle) : alertes, fins de support, fiche, lettres.
 * Ouverte seulement si un client Sentinelle est relié à la fiche. L'écran vit
 * dans `../veille-technique.tsx`, partagé avec la vue admin.
 */
export default async function Page() {
  const session = await requireSession();
  const viewer = viewerFromSession(session);
  const context = await loadEspace(viewer);
  if (!sectionOuverte(context, "veille-technique")) redirect(ESPACE_PATH);

  return <VueVeilleTechnique viewer={viewer} context={context} />;
}
