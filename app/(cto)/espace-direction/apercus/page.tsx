import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { VueApercus } from "../apercus";
import { loadEspace, sectionOuverte } from "../shell";
import { ESPACE_PATH, requireSession } from "../session";
import { viewerFromSession } from "../viewer";

export const metadata: Metadata = {
  title: "Versions de travail",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/** Maquettes et site en développement. L'écran vit dans `../apercus.tsx`, partagé avec la vue admin. */
export default async function Page() {
  const session = await requireSession();
  const viewer = viewerFromSession(session);
  const context = await loadEspace(viewer);
  if (!sectionOuverte(context, "apercus")) redirect(ESPACE_PATH);

  return <VueApercus viewer={viewer} context={context} />;
}
