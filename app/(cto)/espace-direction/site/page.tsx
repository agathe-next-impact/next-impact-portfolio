import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { loadEspace, sectionOuverte } from "../shell";
import { ESPACE_PATH, requireSession } from "../session";
import { viewerFromSession } from "../viewer";
import { VueSite } from "../vues";

export const metadata: Metadata = {
  title: "État du site",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/** État du site : le relevé WP Umbrella de la nuit. L'écran vit dans `../vues.tsx`, partagé avec la vue admin. */
export default async function Page() {
  const session = await requireSession();
  const viewer = viewerFromSession(session);
  const context = await loadEspace(viewer);
  if (!sectionOuverte(context, "site")) redirect(ESPACE_PATH);

  return <VueSite viewer={viewer} context={context} />;
}
