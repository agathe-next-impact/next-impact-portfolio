import type { Metadata } from "next";
import { ARCHIVE_MONTHS, lettersForClient } from "@cto/letters";
import { Label } from "../ui";
import { ListeLettres } from "../lettre";
import { Espace, loadEspace } from "../shell";
import { requireSession } from "../session";

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
  const [context, lettres] = await Promise.all([
    loadEspace(session),
    lettersForClient(session.person.clientId),
  ]);

  return (
    <Espace
      session={session}
      context={context}
      active="veille"
      title="Votre veille"
      intro={
        <Label>
          {lettres.length} {lettres.length > 1 ? "éditions accessibles" : "édition accessible"}
        </Label>
      }
    >
      <div className="mt-10">
        <ListeLettres lettres={lettres} />
      </div>

      <p className="mt-10 font-inter-tight text-sm text-mid-gray">
        Les archives couvrent les {ARCHIVE_MONTHS} derniers mois. Les éditions
        antérieures sortent de l'espace sans être détruites : elles vous sont
        restituées avec le reste en fin d'accompagnement.
      </p>
    </Espace>
  );
}
