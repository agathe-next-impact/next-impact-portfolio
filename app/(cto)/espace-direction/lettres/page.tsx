import type { Metadata } from "next";
import { loadEspace } from "../shell";
import { requireSession } from "../session";
import { viewerFromSession } from "../viewer";
import { VueLettres } from "../vues";

export const metadata: Metadata = {
  title: "Votre veille",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Les archives de la veille. La fenêtre de six mois est appliquée en base
 * (`lettersForClient`), pas ici. L'écran vit dans `../vues.tsx`.
 */
export default async function Page() {
  const session = await requireSession();
  const viewer = viewerFromSession(session);
  return <VueLettres viewer={viewer} context={await loadEspace(viewer)} />;
}
