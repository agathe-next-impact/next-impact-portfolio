import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { loadEspace, sectionOuverte } from "../shell";
import { ESPACE_PATH, requireSession } from "../session";
import { viewerFromSession } from "../viewer";
import { VueCartographie } from "../vues";

export const metadata: Metadata = {
  title: "Cartographie",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/** La cartographie du système, groupée par nature. L'écran vit dans `../vues.tsx`, partagé avec la vue admin. */
export default async function Page() {
  const session = await requireSession();
  const viewer = viewerFromSession(session);
  const context = await loadEspace(viewer);
  if (!sectionOuverte(context, "cartographie")) redirect(ESPACE_PATH);

  return <VueCartographie viewer={viewer} context={context} />;
}
