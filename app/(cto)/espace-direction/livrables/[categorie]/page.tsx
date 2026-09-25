import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { previousLoginAt } from "@cto/access";
import type { SectionKey } from "@cto/espace";
import { Label } from "../../ui";
import { CATEGORIES, Categorie, kindFromSlug, type CategorieKind } from "../../livrables";
import { Espace, loadEspace } from "../../shell";
import { requireSession } from "../../session";

/** L'onglet de navigation auquel une catégorie appartient. */
const SECTION_OF: Record<CategorieKind, SectionKey> = {
  decision: "direction-technique",
  cartographie: "direction-technique",
  document: "direction-technique",
  roadmap: "actions",
  veille: "veille",
  prestation: "prestations",
};

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
  const [context, since] = await Promise.all([
    loadEspace(session),
    previousLoginAt(session.person.id),
  ]);
  const items = context.items.filter((item) => item.kind === kind);
  const section = SECTION_OF[kind];

  return (
    <Espace
      session={session}
      context={context}
      // L'onglet n'est marqué que si la section fait partie de l'accompagnement :
      // une catégorie consultée hors services reste lisible, sans prétendre être
      // un onglet qui n'existe pas.
      active={context.sections.some((s) => s.key === section) ? section : null}
      title={CATEGORIES[kind].titre}
      intro={
        <Label>
          {items.length} {items.length > 1 ? "entrées publiées" : "entrée publiée"}
        </Label>
      }
    >
      <div className="mt-10">
        <Categorie kind={kind} items={items} since={since} />
      </div>
    </Espace>
  );
}
