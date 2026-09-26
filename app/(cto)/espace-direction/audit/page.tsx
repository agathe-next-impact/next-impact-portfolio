import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { loadEspace, sectionOuverte } from "../shell";
import { ESPACE_PATH, requireSession } from "../session";
import { viewerFromSession } from "../viewer";
import { VueAudit } from "../vues";

export const metadata: Metadata = {
  title: "Audit",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/** Audit : l'audit remis s'il est seul, la liste sinon. L'écran vit dans `../vues.tsx`, partagé avec la vue admin. */
export default async function Page() {
  const session = await requireSession();
  const viewer = viewerFromSession(session);
  const context = await loadEspace(viewer);
  if (!sectionOuverte(context, "audit")) redirect(ESPACE_PATH);

  return <VueAudit viewer={viewer} context={context} />;
}
