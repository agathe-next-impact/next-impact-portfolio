import type { Metadata } from "next";
import { previousLoginAt } from "@cto/access";
import { ARCHIVE_MONTHS, lettersForClient } from "@cto/letters";
import { ListeLettres } from "../lettre";
import { sortRecentFirst, Veille } from "../livrables";
import { Espace, loadEspace } from "../shell";
import { requireSession } from "../session";

export const metadata: Metadata = {
  title: "Veille",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * La veille, générale et personnalisée.
 *
 * Deux temps : les dernières nouvelles (les signaux isolés, alertes comprises,
 * publiés entre deux lettres), puis les lettres elles-mêmes, archives
 * comprises. Section toujours visible : la lettre générale va à tous les
 * accompagnements, qu'ils aient souscrit la veille personnalisée ou non.
 */
export default async function VeillePage() {
  const session = await requireSession();
  const context = await loadEspace(session);

  const [lettres, since] = await Promise.all([
    lettersForClient(session.person.clientId),
    previousLoginAt(session.person.id),
  ]);
  const nouvelles = sortRecentFirst(context.items.filter((item) => item.kind === "veille"));

  return (
    <Espace
      session={session}
      context={context}
      active="veille"
      title="Veille"
      intro={
        <p className="max-w-prose font-inter-tight text-base text-mid-gray">
          Ce qui change dans votre environnement numérique, et ce que ça implique pour vous.
        </p>
      }
    >
      {nouvelles.length > 0 ? (
        <Veille items={nouvelles.slice(0, 6)} total={nouvelles.length} since={since} />
      ) : null}

      <section className="mt-12">
        <h2 className="mb-5 font-sans text-lg font-light text-foreground">Lettres de veille</h2>
        <ListeLettres lettres={lettres} />
        <p className="mt-6 font-inter-tight text-sm text-mid-gray">
          Les archives couvrent les {ARCHIVE_MONTHS} derniers mois. Les éditions antérieures vous
          sont restituées avec le reste en fin d'accompagnement.
        </p>
      </section>
    </Espace>
  );
}
