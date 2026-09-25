import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { loadEspace, sectionOuverte } from "../shell";
import { ESPACE_PATH, requireSession } from "../session";
import { viewerFromSession } from "../viewer";
import { VueSuivi } from "../vues";

export const metadata: Metadata = {
  title: "Suivi technique",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/** Suivi technique : le relevé WP Umbrella de la nuit. L'écran vit dans `../vues.tsx`, partagé avec la vue admin. */
export default async function Page() {
  const session = await requireSession();
  const viewer = viewerFromSession(session);
  const context = await loadEspace(viewer.clientId);
  if (!sectionOuverte(context, "suivi-technique")) redirect(ESPACE_PATH);

  return <VueSuivi viewer={viewer} context={context} />;
}
