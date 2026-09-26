import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { loadEspace, sectionOuverte } from "../shell";
import { ESPACE_PATH, requireSession } from "../session";
import { viewerFromSession } from "../viewer";
import { VuePropositions } from "../vues";

export const metadata: Metadata = {
  title: "Propositions",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/** Les propositions remises. L'écran vit dans `../vues.tsx`, partagé avec la vue admin. */
export default async function Page() {
  const session = await requireSession();
  const viewer = viewerFromSession(session);
  const context = await loadEspace(viewer);
  if (!sectionOuverte(context, "propositions")) redirect(ESPACE_PATH);

  return <VuePropositions viewer={viewer} context={context} />;
}
