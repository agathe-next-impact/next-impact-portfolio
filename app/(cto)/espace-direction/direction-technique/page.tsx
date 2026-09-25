import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { previousLoginAt } from "@cto/access";
import {
  Cartographie,
  Decisions,
  Documents,
  sortCartographie,
  sortRecentFirst,
} from "../livrables";
import { EnPreparation, Espace, loadEspace, sectionOuverte } from "../shell";
import { ESPACE_PATH, requireSession } from "../session";

export const metadata: Metadata = {
  title: "Direction technique",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Direction technique : l'audit et les préconisations, sous leurs trois formes
 * opposables — ce qui a été décidé, ce qui existe, ce qui a été relu.
 *
 * L'ordre est celui d'une reprise de dossier : les décisions d'abord (où en
 * est-on ?), la cartographie ensuite (sur quoi repose-t-on ?), les documents
 * enfin (qu'a-t-on signé ou relu ?).
 */
export default async function DirectionTechniquePage() {
  const session = await requireSession();
  const context = await loadEspace(session);
  if (!sectionOuverte(context, "direction-technique")) redirect(ESPACE_PATH);

  const since = await previousLoginAt(session.person.id);
  const now = Date.now();
  const decisions = sortRecentFirst(context.items.filter((item) => item.kind === "decision"));
  const carto = sortCartographie(context.items.filter((item) => item.kind === "cartographie"));
  const documents = sortRecentFirst(context.items.filter((item) => item.kind === "document"));
  const vide = decisions.length + carto.length + documents.length === 0;

  return (
    <Espace
      session={session}
      context={context}
      active="direction-technique"
      title="Direction technique"
      intro={
        <p className="max-w-prose font-inter-tight text-base text-mid-gray">
          Audit, préconisations et arbitrages : ce qui a été décidé, sur quoi repose votre système,
          et les documents relus pour vous.
        </p>
      }
    >
      {vide ? (
        <EnPreparation>
          Le relevé de décisions, la cartographie de votre système et les documents relus
          (devis, plans de continuité) apparaîtront ici dès leur première publication.
        </EnPreparation>
      ) : null}
      {decisions.length > 0 ? <Decisions items={decisions.slice(0, 8)} total={decisions.length} since={since} /> : null}
      {carto.length > 0 ? <Cartographie items={carto} total={carto.length} now={now} since={since} /> : null}
      {documents.length > 0 ? <Documents items={documents} total={documents.length} since={since} /> : null}
    </Espace>
  );
}
