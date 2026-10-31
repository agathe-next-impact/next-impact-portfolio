import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { loadEspace, sectionOuverte } from "../shell";
import { ESPACE_PATH, requireSession } from "../session";
import { viewerFromSession } from "../viewer";
import { VueFicheTechnique } from "../fiche-technique";

export const metadata: Metadata = {
  title: "Fiche technique",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * La fiche technique (Sentinelle) : de quoi le site est fait, composant par
 * composant. Sous « Votre site ». Ouverte seulement si un client Sentinelle est
 * relié à la fiche. L'écran vit dans `../fiche-technique.tsx`, partagé avec la
 * vue admin.
 */
export default async function Page() {
  const session = await requireSession();
  const viewer = viewerFromSession(session);
  const context = await loadEspace(viewer);
  if (!sectionOuverte(context, "fiche-technique")) redirect(ESPACE_PATH);

  return <VueFicheTechnique viewer={viewer} context={context} />;
}
