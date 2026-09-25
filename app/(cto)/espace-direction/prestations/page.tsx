import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { loadEspace, sectionOuverte } from "../shell";
import { ESPACE_PATH, requireSession } from "../session";
import { viewerFromSession } from "../viewer";
import { VuePrestations } from "../vues";

export const metadata: Metadata = {
  title: "Prestations",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/** Prestations commandées. L'écran vit dans `../vues.tsx`, partagé avec la vue admin. */
export default async function Page() {
  const session = await requireSession();
  const viewer = viewerFromSession(session);
  const context = await loadEspace(viewer.clientId);
  if (!sectionOuverte(context, "prestations")) redirect(ESPACE_PATH);

  return <VuePrestations viewer={viewer} context={context} />;
}
