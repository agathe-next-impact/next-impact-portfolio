import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { loadEspace, sectionOuverte } from "../shell";
import { ESPACE_PATH, requireSession } from "../session";
import { viewerFromSession } from "../viewer";
import { VueActions } from "../vues";

export const metadata: Metadata = {
  title: "Actions en cours",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/** Actions en cours : la roadmap réduite à ce qui bouge maintenant. L'écran vit dans `../vues.tsx`, partagé avec la vue admin. */
export default async function Page() {
  const session = await requireSession();
  const viewer = viewerFromSession(session);
  const context = await loadEspace(viewer.clientId);
  if (!sectionOuverte(context, "actions")) redirect(ESPACE_PATH);

  return <VueActions viewer={viewer} context={context} />;
}
