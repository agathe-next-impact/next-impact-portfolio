import { lettersForClient } from "@cto/letters";
import { sentinelleStateFor, type SentinelleAlert, type SentinelleVerdict } from "@cto/sentinelle";
import { CarteLettre } from "./lettre";
import { EnPreparation, Espace, type EspaceContext } from "./shell";
import { Dot, formatDay, Label, Notice, Panel, SectionNav, Stat, Tag, type Tone } from "./ui";
import type { Viewer } from "./viewer";

// ─────────────────────────────────────────────────────────────────────────────
// La veille technique (Sentinelle), en entier, dans l'espace.
//
// Trois blocs, dans l'ordre où le client se pose les questions : qu'est-ce qui
// a été signalé (les alertes, avec leur texte relu et l'action recommandée),
// qu'est-ce qui approche (les fins de support), qu'est-ce qui est surveillé (la
// fiche). Puis les lettres bimensuelles, lisibles en entier.
//
// Tout vient du dernier export Sentinelle rangé par le balayage
// (`cto_sentinelle_snapshots`) : la page ne parle jamais à Sentinelle
// pendant une requête, et n'affiche que ce qu'un humain a validé là-bas.
// ─────────────────────────────────────────────────────────────────────────────

const VERDICT: Record<SentinelleVerdict, { tone: Tone; mot: string }> = {
  red: { tone: "alerte", mot: "Critique" },
  orange: { tone: "attention", mot: "À surveiller" },
  green: { tone: "fait", mot: "Sans risque" },
  info: { tone: "neutre", mot: "Information" },
};

const RANG: Record<SentinelleVerdict, number> = { red: 0, orange: 1, info: 2, green: 3 };

function verdictOf(alert: SentinelleAlert) {
  return VERDICT[alert.verdict ?? "info"];
}

/** Même ancre que les lignes du digest, pour qu'un renvoi « voir le constat » aboutisse ici aussi. */
function refAnchor(ref: string): string {
  return `fait-${ref.replace(/[^a-zA-Z0-9_-]+/g, "-")}`;
}

function CarteAlerte({ alert }: { alert: SentinelleAlert }) {
  const { tone, mot } = verdictOf(alert);
  return (
    <article id={refAnchor(alert.ref)} className="scroll-mt-24 px-5 py-5">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex items-center gap-3">
          <Dot tone={tone} label={mot} />
          <Tag tone={tone}>{mot}</Tag>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">{alert.component}</p>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">
          {formatDay(new Date(alert.at))}
        </p>
      </div>
      <h3 className="mt-3 font-sans text-base font-light leading-snug text-foreground">{alert.title}</h3>
      {alert.body ? (
        <p className="mt-2 max-w-[68ch] whitespace-pre-line font-inter-tight text-[15px] leading-relaxed text-mid-gray">
          {alert.body}
        </p>
      ) : null}
      {alert.recommendedAction ? (
        <div className="mt-4 max-w-[68ch] border-l-2 border-accent-secondary bg-jet/60 px-4 py-3">
          <Label>Action recommandée</Label>
          <p className="mt-1 font-inter-tight text-[15px] leading-snug text-foreground">{alert.recommendedAction}</p>
        </div>
      ) : null}
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray/80">
        Référence · {alert.ref}
      </p>
    </article>
  );
}

export async function VueVeilleTechnique({ viewer, context }: { viewer: Viewer; context: EspaceContext }) {
  const [state, lettres] = await Promise.all([
    sentinelleStateFor(viewer.clientId),
    lettersForClient(viewer.clientId),
  ]);
  const lettresTechniques = lettres.filter((lettre) => lettre.source === "sentinelle");

  const intro = (
    <p className="max-w-prose font-inter-tight text-base text-mid-gray">
      Ce qui est surveillé sur votre site, ce qui a été signalé et ce qu&rsquo;il faut faire. Chaque
      alerte a été relue avant de vous parvenir.
    </p>
  );

  if (!state) {
    return (
      <Espace viewer={viewer} context={context} active="veille-technique" title="Veille technique" intro={intro}>
        <EnPreparation>
          La surveillance de votre site est en cours de mise en place. Les alertes, la fiche technique et
          les lettres de veille apparaîtront ici après le premier relevé.
        </EnPreparation>
      </Espace>
    );
  }

  const { data } = state;
  const alertes = [...data.alerts].sort(
    (a, b) => RANG[a.verdict ?? "info"] - RANG[b.verdict ?? "info"] || b.at.localeCompare(a.at),
  );
  const critiques = alertes.filter((a) => a.verdict === "red").length;
  const aSurveiller = alertes.filter((a) => a.verdict === "orange").length;
  const radar = [...data.radar].sort((a, b) => a.daysLeft - b.daysLeft);
  const prochaine = radar.find((entry) => entry.daysLeft >= 0) ?? null;

  return (
    <Espace viewer={viewer} context={context} active="veille-technique" title="Veille technique" intro={intro}>
      {state.error ? (
        <div className="mt-6">
          <Notice tone="erreur">
            Le dernier relevé n&rsquo;a pas pu être mis à jour. Les informations ci-dessous datent du{" "}
            {formatDay(state.fetchedAt)}.
          </Notice>
        </div>
      ) : null}

      <Panel className="mt-8 grid grid-cols-2 sm:grid-cols-4">
        <Stat label="Composants suivis" value={String(data.stack.components.length)} />
        <Stat
          label="Alertes · 6 mois"
          value={String(alertes.length)}
          tone={critiques > 0 ? "alerte" : aSurveiller > 0 ? "attention" : "neutre"}
          hint={critiques > 0 ? `dont ${critiques} critique${critiques > 1 ? "s" : ""}` : undefined}
        />
        <Stat
          label="Prochaine fin de support"
          value={prochaine ? `${prochaine.daysLeft} j` : "Aucune"}
          tone={prochaine && prochaine.daysLeft <= 90 ? "attention" : "neutre"}
          hint={prochaine ? `${prochaine.label}${prochaine.version ? ` ${prochaine.version}` : ""}` : undefined}
        />
        <Stat label="Lettres de veille" value={String(lettresTechniques.length)} />
      </Panel>

      <SectionNav
        items={[
          { href: "#alertes", label: "Alertes", count: alertes.length },
          { href: "#fins-de-support", label: "Fins de support", count: radar.length },
          { href: "#fiche", label: "Fiche technique", count: data.stack.components.length },
          { href: "#lettres", label: "Lettres", count: lettresTechniques.length },
        ]}
      />

      <section id="alertes" className="mt-12 scroll-mt-24">
        <h2 className="mb-5 font-sans text-lg font-light text-foreground">Alertes</h2>
        {alertes.length === 0 ? (
          <Panel className="px-5 py-6">
            <p className="font-inter-tight text-base text-mid-gray">
              Aucune alerte ces six derniers mois : rien de ce qui a été publié ne concernait votre site.
            </p>
          </Panel>
        ) : (
          <Panel className="divide-y divide-dark-gray">
            {alertes.map((alert) => (
              <CarteAlerte key={alert.id} alert={alert} />
            ))}
          </Panel>
        )}
      </section>

      <section id="fins-de-support" className="mt-12 scroll-mt-24">
        <h2 className="mb-5 font-sans text-lg font-light text-foreground">Fins de support à venir</h2>
        {radar.length === 0 ? (
          <Panel className="px-5 py-6">
            <p className="font-inter-tight text-base text-mid-gray">
              Aucune fin de support connue pour les composants de votre site.
            </p>
          </Panel>
        ) : (
          <Panel className="divide-y divide-dark-gray">
            {radar.map((entry) => {
              const tone: Tone = entry.daysLeft <= 30 ? "alerte" : entry.daysLeft <= 90 ? "attention" : "neutre";
              const mot = entry.daysLeft < 0 ? "Dépassée" : `Dans ${entry.daysLeft} jours`;
              return (
                <div key={`${entry.label}-${entry.endsOn}`} className="flex items-start gap-3 px-5 py-4">
                  <Dot tone={tone} label={mot} />
                  <div className="min-w-0 flex-1">
                    <p className="font-inter-tight text-[15px] text-foreground">{entry.title}</p>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">
                      {entry.label}
                      {entry.version ? ` ${entry.version}` : ""} · le {formatDay(new Date(entry.endsOn))}
                    </p>
                  </div>
                  <Tag tone={tone}>{mot}</Tag>
                </div>
              );
            })}
          </Panel>
        )}
      </section>

      <section id="fiche" className="mt-12 scroll-mt-24">
        <h2 className="mb-2 font-sans text-lg font-light text-foreground">Fiche technique</h2>
        <p className="mb-5 max-w-prose font-inter-tight text-sm text-mid-gray">
          Ce que la surveillance connaît de votre site, relevé depuis ses éléments publics.
          {data.stack.withoutVersion > 0
            ? ` ${data.stack.withoutVersion} composant${data.stack.withoutVersion > 1 ? "s" : ""} sans version connue : la veille ne peut pas dire s'ils sont concernés par une faille.`
            : ""}
        </p>
        {data.stack.components.length === 0 ? (
          <Panel className="px-5 py-6">
            <p className="font-inter-tight text-base text-mid-gray">Aucun composant relevé pour l&rsquo;instant.</p>
          </Panel>
        ) : (
          <Panel className="divide-y divide-dark-gray">
            {data.stack.components.map((component) => (
              <div
                key={`${component.type}-${component.slug}`}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 py-3"
              >
                <p className="font-inter-tight text-[15px] text-foreground">{component.label}</p>
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">
                  {component.version ? `version ${component.version}` : "version inconnue"}
                </p>
              </div>
            ))}
          </Panel>
        )}
        <p className="mt-3 font-inter-tight text-xs text-mid-gray">
          Relevé du {formatDay(state.fetchedAt)} · {data.client.siteUrl}
        </p>
      </section>

      <section id="lettres" className="mt-12 scroll-mt-24">
        <h2 className="mb-5 font-sans text-lg font-light text-foreground">Lettres de veille technique</h2>
        {lettresTechniques.length === 0 ? (
          <Panel className="px-5 py-6">
            <p className="font-inter-tight text-base text-mid-gray">
              La première lettre de veille technique paraîtra le 1er ou le 15 du mois.
            </p>
          </Panel>
        ) : (
          <Panel className="divide-y divide-dark-gray">
            {lettresTechniques.map((lettre) => (
              <CarteLettre key={lettre.notionPageId} lettre={lettre} base={viewer.base} />
            ))}
          </Panel>
        )}
      </section>
    </Espace>
  );
}
