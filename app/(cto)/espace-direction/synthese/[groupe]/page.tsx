import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { groupFromSlug, visibleGroups } from "@cto/espace";
import { groupeAvecSynthese, VueGroupe } from "../../groupes";
import { loadEspace, sectionHref } from "../../shell";
import { ESPACE_PATH, requireSession } from "../../session";
import { viewerFromSession } from "../../viewer";

export const metadata: Metadata = {
  title: "Synthèse",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * La synthèse d'un groupe (Pilotage, Votre site…). L'écran vit dans `../../groupes.tsx`.
 *
 * Un groupe réduit à une entrée n'a pas de synthèse : on mène à l'entrée. Un
 * groupe absent de l'accompagnement ramène à l'accueil.
 */
export default async function Page({ params }: { params: Promise<{ groupe: string }> }) {
  const { groupe: slug } = await params;
  const session = await requireSession();
  const viewer = viewerFromSession(session);
  const context = await loadEspace(viewer);

  const group = groupFromSlug(slug);
  const groupe = group ? groupeAvecSynthese(context, group) : null;
  if (!groupe) {
    const seul = visibleGroups(context.sections).find((candidate) => candidate.group === group);
    redirect(seul ? sectionHref(seul.sections[0], viewer.base) : ESPACE_PATH);
  }

  return <VueGroupe viewer={viewer} context={context} groupe={groupe} />;
}
