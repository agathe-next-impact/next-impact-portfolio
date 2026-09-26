import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { LEGACY_SLUGS, sectionByKey } from "@cto/espace";
import { kindFromSlug } from "../../../../../../espace-direction/livrables";
import { loadEspace } from "../../../../../../espace-direction/shell";
import {
  VueAArbitrer,
  VueATraiter,
  VueAudit,
  VueCartographie,
  VueCategorie,
  VueDecisions,
  VueDocuments,
  VueHistorique,
  VueLettre,
  VueLectureAudit,
  VueLettres,
  VueMissions,
  VuePrestations,
  VueRapports,
  VueSite,
  VueTableau,
  VueVeille,
} from "../../../../../../espace-direction/vues";
import { viewerForClient } from "../acces";

export const metadata: Metadata = {
  title: "Espace client — vue admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * L'espace d'un client, en entier, vu depuis la supervision.
 *
 * Une seule route pour tous les écrans : elle reproduit l'arborescence de
 * `/espace-direction` sous `…/clients/<id>/espace/…` et rend les MÊMES vues
 * (`espace-direction/vues.tsx`), avec un `Viewer` admin. Ce que l'admin voit
 * est donc, par construction, ce que le client voit — à une différence près :
 * les sections non souscrites restent ouvertes ici, signalées comme telles.
 *
 * Garde : le layout de `/admin-cto/pilotage` exige la session admin avant tout
 * rendu. L'identifiant d'accompagnement vient de l'URL, ce qui est légitime ici
 * et seulement ici : l'admin a, par définition, accès à tous.
 */
export default async function EspaceAdminPage({
  params,
}: {
  params: Promise<{ id: string; chemin?: string[] }>;
}) {
  const { id, chemin = [] } = await params;
  const viewer = await viewerForClient(id);
  if (!viewer) notFound();

  const context = await loadEspace(viewer);
  const [tete, suite, fin] = chemin;

  if (chemin.length === 0) return <VueTableau viewer={viewer} context={context} />;

  if (chemin.length === 1) {
    switch (tete) {
      case "missions":
        return <VueMissions viewer={viewer} context={context} />;
      case "prestations":
        return <VuePrestations viewer={viewer} context={context} />;
      case "decisions":
        return <VueDecisions viewer={viewer} context={context} />;
      case "audit":
        return <VueAudit viewer={viewer} context={context} />;
      case "site":
        return <VueSite viewer={viewer} context={context} />;
      case "rapports":
        return <VueRapports viewer={viewer} context={context} />;
      case "cartographie":
        return <VueCartographie viewer={viewer} context={context} />;
      case "a-traiter":
        return <VueATraiter viewer={viewer} context={context} />;
      case "a-arbitrer":
        return <VueAArbitrer viewer={viewer} context={context} />;
      case "veille":
        return <VueVeille viewer={viewer} context={context} />;
      case "documents":
        return <VueDocuments viewer={viewer} context={context} />;
      case "lettres":
        return <VueLettres viewer={viewer} context={context} />;
    }
    // Anciennes adresses : la supervision suit la même carte que le client.
    const nouvelle = LEGACY_SLUGS[tete];
    if (nouvelle) redirect(`${viewer.base}/${sectionByKey(nouvelle).slug}`);
    notFound();
  }

  if (tete === "audit" && chemin.length === 2) {
    const vue = await VueLectureAudit({ viewer, context, id: suite });
    if (!vue) notFound();
    return vue;
  }

  if (tete === "lettres" && chemin.length === 2) {
    const vue = await VueLettre({ viewer, context, id: suite });
    if (!vue) notFound();
    return vue;
  }

  if (tete === "livrables") {
    const kind = kindFromSlug(suite ?? "");
    if (!kind) notFound();
    if (chemin.length === 2) return <VueCategorie viewer={viewer} context={context} kind={kind} />;
    if (chemin.length === 3) {
      const vue = await VueHistorique({ viewer, context, kind, id: fin });
      if (!vue) notFound();
      return vue;
    }
  }

  notFound();
}
