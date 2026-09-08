import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { history } from "@cto/deliverables";
import { BackLink, Label, PageHeader } from "../../../ui";
import { Historique } from "../../../historique";
import { CATEGORIES, categoriePath, kindFromSlug } from "../../../livrables";
import { requireSession } from "../../../session";

export const metadata: Metadata = {
  title: "Historique d'un livrable",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * L'historique d'un seul livrable.
 *
 * L'identifiant en URL est celui de la page Notion d'origine : il est stable là
 * où l'identifiant d'une version change à chaque correction, et c'est bien
 * l'objet dans la durée qu'on veut adresser, pas un de ses états.
 *
 * La garde tient en une ligne parce que `history()` filtre elle-même sur le
 * client : un identifiant valide appartenant à un autre accompagnement rend une
 * liste vide, donc un 404. Le contrôle est dans la requête, pas ici — un jour
 * quelqu'un écrirait cette page une seconde fois et oublierait de le refaire.
 */
export default async function HistoriquePage({
  params,
}: {
  params: Promise<{ categorie: string; id: string }>;
}) {
  const { categorie, id } = await params;
  const kind = kindFromSlug(categorie);
  if (!kind) notFound();

  const session = await requireSession();
  const versions = await history(id, session.person.clientId);
  if (versions.length === 0) notFound();

  const courante = versions[0];

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <div className="mb-8">
        <BackLink href={categoriePath(kind)}>{CATEGORIES[kind].titre}</BackLink>
      </div>

      <PageHeader company={session.person.company} title={courante.title}>
        <Label>
          {versions.length > 1
            ? `${versions.length} versions — la plus récente date du ${formatCourt(courante.recordedAt)}`
            : "Une seule version"}
        </Label>
      </PageHeader>

      <Historique versions={versions} />
    </main>
  );
}

function formatCourt(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeZone: "Europe/Paris",
  }).format(date);
}
