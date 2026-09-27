import { notFound, redirect } from "next/navigation";
import { categoriePath, kindFromSlug } from "../../livrables";
import { requireSession } from "../../session";
import { viewerFromSession } from "../../viewer";

export const dynamic = "force-dynamic";

/**
 * Ancienne page de catégorie : elle répétait sa section à l'identique. Elle
 * redirige désormais vers la section, qui montre tout (le détail se déplie).
 * Seul l'historique des versions reste sous `/livrables/<catégorie>/<id>`.
 */
export default async function Page({ params }: { params: Promise<{ categorie: string }> }) {
  const { categorie } = await params;
  const kind = kindFromSlug(categorie);
  if (!kind) notFound();

  const viewer = viewerFromSession(await requireSession());
  redirect(categoriePath(kind, viewer.base));
}
