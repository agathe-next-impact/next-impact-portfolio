import type { Metadata } from "next";
import { loadEspace } from "../shell";
import { requireSession } from "../session";
import { viewerFromSession } from "../viewer";
import { VueAgir } from "../vues";

export const metadata: Metadata = {
  title: "Actions",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/** À traiter puis à arbitrer, sur une seule page. Toujours visible. L'écran vit dans `../vues.tsx`, partagé avec la vue admin. */
export default async function Page() {
  const session = await requireSession();
  const viewer = viewerFromSession(session);
  const context = await loadEspace(viewer);

  return <VueAgir viewer={viewer} context={context} />;
}
