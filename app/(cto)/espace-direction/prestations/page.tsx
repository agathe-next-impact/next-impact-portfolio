import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { previousLoginAt } from "@cto/access";
import { Prestations, sortPrestations } from "../livrables";
import { EnPreparation, Espace, loadEspace, sectionOuverte } from "../shell";
import { ESPACE_PATH, requireSession } from "../session";

export const metadata: Metadata = {
  title: "Prestations",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Les prestations vendues : ce qui est en cours, ce qui arrive, ce qui est
 * livré. Distinctes de la roadmap — un chantier est ce que le système demande,
 * une prestation est ce que vous avez commandé.
 */
export default async function PrestationsPage() {
  const session = await requireSession();
  const context = await loadEspace(session);
  if (!sectionOuverte(context, "prestations")) redirect(ESPACE_PATH);

  const since = await previousLoginAt(session.person.id);
  const items = sortPrestations(context.items.filter((item) => item.kind === "prestation"));

  return (
    <Espace
      session={session}
      context={context}
      active="prestations"
      title="Prestations"
      intro={
        <p className="max-w-prose font-inter-tight text-base text-mid-gray">
          Les missions commandées, leur avancement et leur date de livraison.
        </p>
      }
    >
      {items.length === 0 ? (
        <EnPreparation>
          Vos prestations en cours (missions ponctuelles, devis signés) apparaîtront ici avec
          leur avancement et leur date de livraison.
        </EnPreparation>
      ) : (
        <div className="mt-10">
          <Prestations items={items} now={Date.now()} since={since} bare />
        </div>
      )}
    </Espace>
  );
}
