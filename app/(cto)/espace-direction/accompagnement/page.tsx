import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { VueAccompagnement } from "../accompagnement";
import { loadEspace, sectionOuverte } from "../shell";
import { ESPACE_PATH, requireSession } from "../session";
import { viewerFromSession } from "../viewer";

export const metadata: Metadata = {
  title: "Votre accompagnement",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/** Contrats → Votre accompagnement. L'écran vit dans `../accompagnement.tsx`, partagé avec la vue admin. */
export default async function Page() {
  const session = await requireSession();
  const viewer = viewerFromSession(session);
  const context = await loadEspace(viewer);
  if (!sectionOuverte(context, "accompagnement")) redirect(ESPACE_PATH);

  return <VueAccompagnement viewer={viewer} context={context} />;
}
