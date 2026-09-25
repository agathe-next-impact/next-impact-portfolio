import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { siteReportsFor, siteStateFor } from "@cto/site";
import { EnPreparation, Espace, loadEspace, sectionOuverte } from "../shell";
import { SuiviTechnique } from "../suivi";
import { ESPACE_PATH, requireSession } from "../session";

export const metadata: Metadata = {
  title: "Suivi technique",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Suivi technique : maintenance et état du système actuel.
 *
 * Le relevé est résolu depuis l'accompagnement de la SESSION — jamais depuis
 * un identifiant de projet passé dans l'URL (règle posée sur
 * `cto_clients.wp_umbrella_project_id`).
 */
export default async function SuiviTechniquePage() {
  const session = await requireSession();
  const context = await loadEspace(session);
  if (!sectionOuverte(context, "suivi-technique")) redirect(ESPACE_PATH);

  const [state, reports] = await Promise.all([
    siteStateFor(session.person.clientId),
    siteReportsFor(session.person.clientId),
  ]);

  return (
    <Espace
      session={session}
      context={context}
      active="suivi-technique"
      title="Suivi technique"
      intro={
        <p className="max-w-prose font-inter-tight text-base text-mid-gray">
          Maintenance et état de votre site : disponibilité, mises à jour, failles connues,
          sauvegardes et rapports mensuels. Relevé chaque nuit.
        </p>
      }
    >
      {state ? (
        <SuiviTechnique state={state} reports={reports} />
      ) : (
        <EnPreparation>
          La supervision de votre site est en cours de mise en place. Le relevé quotidien
          (disponibilité, mises à jour, sauvegardes) apparaîtra ici dès qu'elle sera branchée.
        </EnPreparation>
      )}
    </Espace>
  );
}
