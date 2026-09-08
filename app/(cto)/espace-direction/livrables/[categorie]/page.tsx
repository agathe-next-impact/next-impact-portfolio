import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { previousLoginAt } from "@cto/access";
import { listForClient } from "@cto/deliverables";
import { BackLink, Label, Notice, PageHeader } from "../../ui";
import { CATEGORIES, Categorie, kindFromSlug } from "../../livrables";
import { ESPACE_PATH, requireSession } from "../../session";

export const metadata: Metadata = {
  title: "Livrables",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Une catégorie de livrables, en entier.
 *
 * L'accueil ne montre que ce qui est à la une ; cette page montre tout, mis en
 * avant ou non. Une route dynamique plutôt que trois pages jumelles : les trois
 * catégories partagent la garde, le chargement et le gabarit, et n'auraient
 * différé que par une constante.
 *
 * La garde est refaite ici, pour son propre compte. Une page n'hérite d'aucune
 * autorisation de celle qui a produit le lien.
 */
export default async function CategoriePage({
  params,
}: {
  params: Promise<{ categorie: string }>;
}) {
  const { categorie } = await params;
  const kind = kindFromSlug(categorie);
  if (!kind) notFound();

  const session = await requireSession();
  const [tous, since] = await Promise.all([
    listForClient(session.person.clientId),
    previousLoginAt(session.person.id),
  ]);
  const items = tous.filter((item) => item.kind === kind);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <div className="mb-8">
        <BackLink href={ESPACE_PATH}>Votre espace</BackLink>
      </div>

      <PageHeader company={session.person.company} title={CATEGORIES[kind].titre}>
        <Label>
          {items.length} {items.length > 1 ? "entrées publiées" : "entrée publiée"}
        </Label>
      </PageHeader>

      {session.decision.notice ? (
        <div className="mt-8">
          <Notice tone="info">{session.decision.notice}</Notice>
        </div>
      ) : null}

      <div className="mt-10">
        <Categorie kind={kind} items={items} since={since} />
      </div>
    </main>
  );
}
