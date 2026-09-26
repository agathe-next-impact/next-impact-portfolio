import type { Metadata } from "next";
import { loadEspace } from "../shell";
import { requireSession } from "../session";
import { viewerFromSession } from "../viewer";
import { VueATraiter } from "../vues";

export const metadata: Metadata = {
  title: "À traiter",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/** Ce qui demande une intervention. Toujours visible : vide, la page dit « rien d'urgent ». L'écran vit dans `../vues.tsx`, partagé avec la vue admin. */
export default async function Page() {
  const session = await requireSession();
  const viewer = viewerFromSession(session);
  const context = await loadEspace(viewer);

  return <VueATraiter viewer={viewer} context={context} />;
}
