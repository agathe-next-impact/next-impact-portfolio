import type { SyncRun } from "@cto/admin";
import { formatDate, Label, Notice, Panel, Tag } from "../../espace-direction/ui";
import { Points } from "./points";

// ─────────────────────────────────────────────────────────────────────────────
// Le dernier balayage inscrit au journal — d'abord celui du Cron de 4 h, que
// personne n'a vu tourner. Un balayage à blanc n'y figure pas : il n'a rien
// écrit (`src/cto/admin/runs.ts`).
// ─────────────────────────────────────────────────────────────────────────────

const SOURCE_LABEL: Record<string, string> = {
  cron: "Balayage de 4 h",
  admin: "Lancé depuis cet écran",
  commande: "Lancé en ligne de commande",
};

export function DernierBalayage({ run }: { run: SyncRun | null }) {
  if (!run) {
    return (
      <Panel className="p-5">
        <Label>Dernier balayage</Label>
        <p className="mt-2 max-w-prose font-inter-tight text-sm text-mid-gray">
          Aucun balayage au journal pour l&rsquo;instant. Le prochain, de nuit ou lancé d&rsquo;ici, y laissera
          son rapport.
        </p>
      </Panel>
    );
  }

  return (
    <Panel className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Label>Dernier balayage</Label>
        <div className="flex flex-wrap items-center gap-2">
          <Tag>{SOURCE_LABEL[run.source] ?? run.source}</Tag>
          <Tag>{formatDate(run.at)}</Tag>
          {run.alertedAt ? <Tag tone="attention">Alerte envoyée par e-mail</Tag> : null}
        </div>
      </div>
      <div className="mt-4 space-y-3">
        <Notice tone={run.ok ? "succes" : "erreur"}>
          {run.ok ? (
            run.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))
          ) : (
            <span className="block">Le balayage a échoué : {run.error}</span>
          )}
        </Notice>
        <Points warnings={run.warnings} alerts={run.ok ? run.alerts : []} />
      </div>
    </Panel>
  );
}
