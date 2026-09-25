import type { Metadata } from "next";
import { loadEspace } from "../shell";
import { requireSession } from "../session";
import { viewerFromSession } from "../viewer";
import { VueVeille } from "../vues";

export const metadata: Metadata = {
  title: "Veille",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/** Veille générale et personnalisée — toujours visible. L'écran vit dans `../vues.tsx`. */
export default async function Page() {
  const session = await requireSession();
  const viewer = viewerFromSession(session);
  return <VueVeille viewer={viewer} context={await loadEspace(viewer.clientId)} />;
}
