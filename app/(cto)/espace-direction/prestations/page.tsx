import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { VuePrestations } from "../prestations";
import { loadEspace, sectionOuverte } from "../shell";
import { ESPACE_PATH, requireSession } from "../session";
import { viewerFromSession } from "../viewer";

export const metadata: Metadata = {
  title: "Prestations",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/** Contrats → Prestations. L'écran vit dans `../prestations.tsx`, partagé avec l'administration. */
export default async function Page() {
  const session = await requireSession();
  const viewer = viewerFromSession(session);
  const context = await loadEspace(viewer);
  if (!sectionOuverte(context, "prestations")) redirect(ESPACE_PATH);

  return <VuePrestations viewer={viewer} context={context} />;
}
