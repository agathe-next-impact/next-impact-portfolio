import type { Metadata } from "next";
import { ARCHIVE_MONTHS, lettersForClient } from "@cto/letters";
import { BackLink, Label, PageHeader } from "../ui";
import { ListeLettres } from "../lettre";
import { ESPACE_PATH, requireSession } from "../session";

export const metadata: Metadata = {
  title: "Votre veille",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Les archives de la veille.
 *
 * La fenêtre de six mois n'est pas un réglage d'affichage : elle est appliquée
 * en base (`lettersForClient`). Une lettre plus ancienne n'arrive pas jusqu'ici,
 * donc aucune page ne peut la laisser fuir par distraction.
 */
export default async function LettresPage() {
  const session = await requireSession();
  const lettres = await lettersForClient(session.person.clientId);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <div className="mb-8">
        <BackLink href={ESPACE_PATH}>Votre espace</BackLink>
      </div>

      <PageHeader company={session.person.company} title="Votre veille">
        <Label>
          {lettres.length} {lettres.length > 1 ? "éditions accessibles" : "édition accessible"}
        </Label>
      </PageHeader>

      <div className="mt-10">
        <ListeLettres lettres={lettres} />
      </div>

      <p className="mt-10 font-inter-tight text-sm text-mid-gray">
        Les archives couvrent les {ARCHIVE_MONTHS} derniers mois. Les éditions
        antérieures sortent de l'espace sans être détruites : elles vous sont
        restituées avec le reste en fin d'accompagnement.
      </p>
    </main>
  );
}
