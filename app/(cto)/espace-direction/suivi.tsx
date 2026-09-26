import type { SiteReport, SiteSnapshot, SiteState } from "@cto/site";
import { fichierPath } from "./livrables";
import { ESPACE_PATH } from "./session";
import { formatDate, formatDay, Label, Notice, Panel, Stat, Tag, type Tone } from "./ui";

// ─────────────────────────────────────────────────────────────────────────────
// Le suivi technique du site : ce que WP Umbrella mesure, remis en français.
//
// Même logique que le bandeau des livrables : quatre chiffres d'abord, qui
// répondent à « mon site va-t-il bien ? » sans défiler — disponibilité, mises
// à jour en attente, failles connues, dernière sauvegarde. Le détail vient
// ensuite, pour qui veut vérifier.
//
// Aucun appel à WP Umbrella ici : la page lit le relevé que le Cron a écrit.
// Sa date est affichée, toujours — un relevé sans date ne prouve rien.
// ─────────────────────────────────────────────────────────────────────────────

const JOUR = 86_400_000;

function derniereSauvegarde(snapshot: SiteSnapshot) {
  return snapshot.backups.recent.find((backup) => backup.status === "finished") ?? null;
}

/** Une sauvegarde de plus de deux jours sur un site suivi mérite qu'on le dise. */
function sauvegardeTone(date: string | null, now: number): Tone {
  if (!date) return "alerte";
  const age = now - new Date(date).getTime();
  if (age > 7 * JOUR) return "alerte";
  if (age > 2 * JOUR) return "attention";
  return "fait";
}

function tailleLisible(octets: number | null): string | null {
  if (!octets || octets <= 0) return null;
  if (octets < 1024 ** 3) return `${Math.round(octets / 1024 / 1024)} Mo`;
  return `${(octets / 1024 ** 3).toFixed(1).replace(".", ",")} Go`;
}

function dureeLisible(secondes: number | null): string {
  if (secondes === null) return "en cours";
  if (secondes < 60) return `${secondes} s`;
  if (secondes < 3600) return `${Math.round(secondes / 60)} min`;
  return `${(secondes / 3600).toFixed(1).replace(".", ",")} h`;
}

/** Les quatre repères. Réutilisés tels quels sur le tableau de bord. */
export function IndicateursSite({ snapshot }: { snapshot: SiteSnapshot }) {
  const now = Date.now();
  const miseAJour = snapshot.updates.plugins.length + snapshot.updates.themes.length;
  const failles = snapshot.vulnerabilities.items.length;
  const sauvegarde = derniereSauvegarde(snapshot);
  const uptime = snapshot.uptime.percentage;

  return (
    <Panel className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <Stat
        label="Disponibilité 30 j"
        value={uptime === null ? "—" : `${uptime.toLocaleString("fr-FR")} %`}
        hint={
          snapshot.status.down
            ? "Site injoignable au dernier relevé"
            : snapshot.uptime.incidents.length > 0
              ? `${snapshot.uptime.incidents.length} incident${snapshot.uptime.incidents.length > 1 ? "s" : ""}`
              : uptime === null
                ? "Surveillance non activée"
                : "Aucun incident"
        }
        tone={snapshot.status.down ? "alerte" : uptime !== null && uptime < 99 ? "attention" : "neutre"}
      />
      <Stat
        label="Mises à jour en attente"
        value={String(miseAJour)}
        hint={miseAJour === 0 ? "Tout est à jour" : "Extensions et thèmes"}
        tone={miseAJour > 5 ? "attention" : "neutre"}
      />
      <Stat
        label="Failles connues"
        value={String(failles)}
        hint={failles === 0 ? "Aucune au dernier scan" : "À corriger en priorité"}
        tone={failles > 0 ? "alerte" : "neutre"}
      />
      <Stat
        label="Dernière sauvegarde"
        value={sauvegarde ? formatDay(new Date(sauvegarde.date)) : "—"}
        hint={sauvegarde ? tailleLisible(sauvegarde.sizeBytes) ?? undefined : "Aucune sauvegarde réussie récente"}
        tone={sauvegardeTone(sauvegarde?.date ?? null, now)}
      />
    </Panel>
  );
}

function Bloc({ titre, compte, children }: { titre: string; compte?: number; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <div className="flex items-baseline justify-between gap-4 border-b border-dark-gray pb-3">
        <h2 className="font-sans text-lg font-light text-foreground">{titre}</h2>
        {typeof compte === "number" ? (
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">{compte}</span>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export function SuiviTechnique({ state }: { state: SiteState }) {
  const snapshot = state.snapshot;

  return (
    <>
      {state.error ? (
        <div className="mt-8">
          <Notice tone="erreur">
            Le dernier relevé n'a pas pu être actualisé ({formatDate(state.errorAt)}).
            {snapshot ? " Les données ci-dessous datent du relevé précédent." : ""}
          </Notice>
        </div>
      ) : null}

      {!snapshot ? (
        <Panel className="mt-10 px-5 py-6">
          <Label>En préparation</Label>
          <p className="mt-2 font-inter-tight text-base leading-relaxed text-mid-gray">
            Le premier relevé de votre site sera disponible après le prochain passage de la
            supervision (chaque nuit). Il couvrira la disponibilité, les mises à jour, les
            failles connues, les sauvegardes et les interventions de maintenance.
          </p>
        </Panel>
      ) : (
        <>
          <section className="mt-10">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <div>
                <p className="font-inter-tight text-base text-foreground">
                  {snapshot.site.name ?? "Votre site"}
                </p>
                {snapshot.site.url ? (
                  <a
                    href={snapshot.site.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-mono text-[11px] text-mid-gray underline underline-offset-4 hover:text-accent-secondary"
                  >
                    {snapshot.site.url.replace(/^https?:\/\//, "")}
                  </a>
                ) : null}
              </div>
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">
                Relevé du {formatDate(state.fetchedAt)}
              </p>
            </div>
            <div className="mt-5">
              <IndicateursSite snapshot={snapshot} />
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {snapshot.site.wordpress ? <Tag>{`WordPress ${snapshot.site.wordpress}`}</Tag> : null}
              {snapshot.site.php ? (
                <Tag tone={snapshot.site.phpSecure === false ? "alerte" : "neutre"}>
                  {`PHP ${snapshot.site.php}${snapshot.site.phpSecure === false ? " · plus maintenu" : ""}`}
                </Tag>
              ) : null}
              {snapshot.site.ssl === false ? <Tag tone="alerte">Sans HTTPS</Tag> : null}
              {snapshot.site.ssl === true ? <Tag tone="fait">HTTPS</Tag> : null}
              {snapshot.site.performance !== null ? (
                <Tag tone={snapshot.site.performance < 50 ? "alerte" : snapshot.site.performance < 80 ? "attention" : "fait"}>
                  {`Performance ${snapshot.site.performance}/100`}
                </Tag>
              ) : null}
              {snapshot.status.disconnected ? <Tag tone="alerte">Supervision déconnectée</Tag> : null}
            </div>
          </section>

          {snapshot.vulnerabilities.items.length > 0 ? (
            <Bloc titre="Failles connues" compte={snapshot.vulnerabilities.items.length}>
              <Panel className="mt-5 divide-y divide-dark-gray">
                {snapshot.vulnerabilities.items.slice(0, 15).map((v, i) => (
                  <div key={i} className="px-4 py-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <p className="font-inter-tight text-sm text-foreground">{v.title}</p>
                      {v.cvss !== null ? (
                        <Tag tone={v.cvss >= 7 ? "alerte" : "attention"}>{`CVSS ${v.cvss}`}</Tag>
                      ) : null}
                    </div>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-mid-gray">
                      {v.component}
                      {v.fixedIn ? ` · corrigée en ${v.fixedIn}` : ""}
                    </p>
                  </div>
                ))}
              </Panel>
            </Bloc>
          ) : null}

          {snapshot.updates.plugins.length + snapshot.updates.themes.length > 0 ? (
            <Bloc
              titre="Mises à jour en attente"
              compte={snapshot.updates.plugins.length + snapshot.updates.themes.length}
            >
              <Panel className="mt-5 divide-y divide-dark-gray">
                {[...snapshot.updates.plugins, ...snapshot.updates.themes].map((u, i) => (
                  <div key={i} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 px-4 py-3">
                    <p className="font-inter-tight text-sm text-foreground">{u.name}</p>
                    <p className="font-mono text-[11px] text-mid-gray">
                      {u.version ?? "?"} → {u.newVersion ?? "dernière version"}
                    </p>
                  </div>
                ))}
              </Panel>
            </Bloc>
          ) : null}

          {snapshot.maintenance.recent.length > 0 ? (
            <Bloc titre="Interventions récentes" compte={snapshot.maintenance.recent.length}>
              <Panel className="mt-5 divide-y divide-dark-gray">
                {snapshot.maintenance.recent.slice(0, 12).map((t, i) => (
                  <div key={i} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 px-4 py-3">
                    <p className="font-inter-tight text-sm text-foreground">
                      {t.label}
                      {t.target ? ` — ${t.target}` : ""}
                      {t.from && t.to ? (
                        <span className="text-mid-gray">{` (${t.from} → ${t.to})`}</span>
                      ) : null}
                    </p>
                    <p className="font-mono text-[11px] text-mid-gray">{formatDay(new Date(t.date))}</p>
                  </div>
                ))}
              </Panel>
            </Bloc>
          ) : null}

          {snapshot.uptime.incidents.length > 0 ? (
            <Bloc titre="Incidents de disponibilité" compte={snapshot.uptime.incidents.length}>
              <Panel className="mt-5 divide-y divide-dark-gray">
                {snapshot.uptime.incidents.slice(0, 10).map((incident, i) => (
                  <div key={i} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 px-4 py-3">
                    <p className="font-inter-tight text-sm text-foreground">
                      {formatDate(new Date(incident.startedAt))}
                    </p>
                    <Tag tone={incident.endedAt ? "neutre" : "alerte"}>
                      {`Durée ${dureeLisible(incident.durationSeconds)}`}
                    </Tag>
                  </div>
                ))}
              </Panel>
            </Bloc>
          ) : null}

          {snapshot.backups.recent.length > 0 ? (
            <Bloc titre="Sauvegardes" compte={snapshot.backups.recent.length}>
              <Panel className="mt-5 divide-y divide-dark-gray">
                {snapshot.backups.recent.map((b, i) => (
                  <div key={i} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 px-4 py-3">
                    <p className="font-inter-tight text-sm text-foreground">{formatDate(new Date(b.date))}</p>
                    <div className="flex gap-1.5">
                      {tailleLisible(b.sizeBytes) ? <Tag>{tailleLisible(b.sizeBytes)}</Tag> : null}
                      <Tag tone={b.status === "finished" ? "fait" : b.status === "error" ? "alerte" : "neutre"}>
                        {b.status === "finished" ? "Réussie" : b.status === "error" ? "Échec" : "En cours"}
                      </Tag>
                    </div>
                  </div>
                ))}
              </Panel>
            </Bloc>
          ) : null}
        </>
      )}

    </>
  );
}

/**
 * Les rapports mensuels de maintenance, en PDF.
 *
 * Leur propre entrée dans la barre latérale : on vient les chercher pour les
 * transmettre (à un comité, à un auditeur), pas en lisant l'état du site.
 */
export function RapportsMaintenance({ reports, base = ESPACE_PATH }: { reports: SiteReport[]; base?: string }) {
  return (
    <>
      {reports.length === 0 ? (
        <Panel className="mt-5 px-5 py-6">
          <p className="font-inter-tight text-sm text-mid-gray">
            Les rapports mensuels de maintenance seront archivés ici, en PDF, au fil des mois.
          </p>
        </Panel>
      ) : (
        <Panel className="mt-5 divide-y divide-dark-gray">
          {reports.map((report) => (
            <div key={report.id} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-2 px-4 py-3">
              <div>
                <p className="font-inter-tight text-sm text-foreground">{report.name}</p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-mid-gray">
                  {report.periodStart && report.periodEnd
                    ? `Du ${formatDay(report.periodStart)} au ${formatDay(report.periodEnd)}`
                    : formatDay(report.generatedAt)}
                </p>
              </div>
              {report.fileId ? (
                <a
                  href={fichierPath(report.fileId, base)}
                  className="font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray underline underline-offset-4 transition-colors hover:text-accent-secondary"
                >
                  Télécharger le PDF
                </a>
              ) : null}
            </div>
          ))}
        </Panel>
      )}
    </>
  );
}
