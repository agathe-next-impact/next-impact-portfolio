import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { previousLoginAt } from "@cto/access";
import type { RoadmapPayload } from "@cto/deliverables";
import { categoriePath, Roadmap, sortRoadmap } from "../livrables";
import { EnPreparation, Espace, loadEspace, sectionOuverte } from "../shell";
import { ESPACE_PATH, requireSession } from "../session";

export const metadata: Metadata = {
  title: "Actions en cours",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/** Les statuts qui font d'un chantier une action EN COURS. */
const EN_COURS = new Set(["Ouvert", "Décidé"]);

/**
 * Actions en cours : la roadmap, réduite à ce qui bouge maintenant.
 *
 * Pas une base de plus : une vue filtrée de la roadmap, pour qu'un chantier
 * n'existe qu'à un endroit. Ce qui est fait, écarté ou lointain reste dans la
 * roadmap complète, à un clic.
 */
export default async function ActionsPage() {
  const session = await requireSession();
  const context = await loadEspace(session);
  if (!sectionOuverte(context, "actions")) redirect(ESPACE_PATH);

  const since = await previousLoginAt(session.person.id);
  const roadmap = context.items.filter((item) => item.kind === "roadmap");
  const enCours = sortRoadmap(
    roadmap.filter((item) => EN_COURS.has((item.payload as RoadmapPayload).statut ?? "")),
  );
  const aVenir = sortRoadmap(
    roadmap.filter((item) => (item.payload as RoadmapPayload).statut === "À venir"),
  );

  return (
    <Espace
      session={session}
      context={context}
      active="actions"
      title="Actions en cours"
      intro={
        <p className="max-w-prose font-inter-tight text-base text-mid-gray">
          Les chantiers ouverts et décidés, et ceux qui suivent. La roadmap complète, avec ce qui
          est fait ou écarté, reste{" "}
          <Link href={categoriePath("roadmap")} className="text-foreground underline underline-offset-4 hover:text-accent-secondary">
            consultable ici
          </Link>
          .
        </p>
      }
    >
      {enCours.length + aVenir.length === 0 ? (
        <EnPreparation>
          Aucun chantier en cours pour l'instant. Les actions décidées en comité apparaîtront
          ici, avec leur échéance et leur budget.
        </EnPreparation>
      ) : null}
      {enCours.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-sans text-lg font-light text-foreground">En cours</h2>
          <Roadmap items={enCours} now={Date.now()} since={since} bare />
        </section>
      ) : null}
      {aVenir.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-sans text-lg font-light text-foreground">Ensuite</h2>
          <Roadmap items={aVenir} now={Date.now()} since={since} bare />
        </section>
      ) : null}
    </Espace>
  );
}
