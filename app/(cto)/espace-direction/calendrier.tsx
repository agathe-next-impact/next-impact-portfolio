import Link from "next/link";
import { dayKey, monthGrid, upcoming, type CalendarEvent, type EventKind } from "@cto/espace";
import { formatDay, Panel, Tag, type Tone } from "./ui";

// ─────────────────────────────────────────────────────────────────────────────
// Le calendrier du tableau de bord.
//
// Deux lectures du même axe, côte à côte sur grand écran : la GRILLE du mois
// montre la densité (« le 14 est chargé »), la LISTE des quatre-vingt-dix jours
// dit quoi. La grille seule oblige à survoler chaque case ; la liste seule
// perd la sensation du mois. Sur mobile, la liste passe devant : c'est elle
// qui répond à la question.
// ─────────────────────────────────────────────────────────────────────────────

const KIND_LABEL: Record<EventKind, string> = {
  chantier: "Chantier",
  echeance: "Échéance",
  prestation: "Livraison",
  lettre: "Lettre",
};

/** Une couleur par nature d'événement, toujours doublée de son libellé. */
const KIND_FILL: Record<EventKind, string> = {
  chantier: "bg-[#f2c94c]",
  echeance: "bg-[#ff8a7a]",
  prestation: "bg-accent-secondary",
  lettre: "bg-[#7fd8a4]",
};

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];

function tone(event: CalendarEvent): Tone {
  if (event.overdue) return "alerte";
  return event.kind === "echeance" ? "attention" : "neutre";
}

export function Calendrier({ events, now = new Date() }: { events: CalendarEvent[]; now?: Date }) {
  const [year, month] = dayKey(now).split("-").map(Number);
  const grid = monthGrid(year, month - 1, events, now);
  const prochains = upcoming(events, now, 90);
  const titreMois = new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).format(now);

  return (
    <section aria-labelledby="calendrier-titre" className="mt-12">
      <div className="flex items-baseline justify-between gap-4 border-b border-dark-gray pb-3">
        <h2 id="calendrier-titre" className="font-sans text-lg font-light text-foreground">
          Calendrier
        </h2>
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">
          90 prochains jours
        </span>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)]">
        <Panel className="order-2 p-4 lg:order-1">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-foreground">{titreMois}</p>
          <table className="mt-3 w-full table-fixed border-collapse text-center">
            <thead>
              <tr>
                {WEEKDAYS.map((day, index) => (
                  <th
                    key={index}
                    scope="col"
                    className="pb-2 font-mono text-[10px] font-normal uppercase text-mid-gray"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grid.map((week, w) => (
                <tr key={w}>
                  {week.map((day) => {
                    const libelle =
                      day.events.length > 0
                        ? `${formatDay(day.date)} : ${day.events.map((e) => `${KIND_LABEL[e.kind]} ${e.title}`).join(", ")}`
                        : undefined;
                    return (
                      <td key={day.date.toISOString()} className="p-0.5 align-top">
                        <div
                          title={libelle}
                          aria-label={libelle}
                          className={`flex h-9 flex-col items-center justify-start pt-1 ${
                            day.isToday ? "border border-accent-secondary" : ""
                          }`}
                        >
                          <span
                            className={`font-inter-tight text-xs ${
                              day.inMonth ? "text-foreground" : "text-mid-gray/40"
                            }`}
                          >
                            {day.date.getUTCDate()}
                          </span>
                          {day.events.length > 0 ? (
                            <span className="mt-0.5 flex gap-0.5" aria-hidden>
                              {day.events.slice(0, 3).map((event, i) => (
                                <span key={i} className={`h-1.5 w-1.5 ${KIND_FILL[event.kind]}`} />
                              ))}
                            </span>
                          ) : null}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5" aria-label="Légende">
            {(Object.keys(KIND_LABEL) as EventKind[]).map((kind) => (
              <li key={kind} className="flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 ${KIND_FILL[kind]}`} aria-hidden />
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-mid-gray">
                  {KIND_LABEL[kind]}
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        <div className="order-1 lg:order-2">
          {prochains.length === 0 ? (
            <Panel className="px-5 py-6">
              <p className="font-inter-tight text-sm text-mid-gray">
                Rien de daté dans les trois prochains mois. Les échéances de chantiers,
                renouvellements de contrats et livraisons apparaîtront ici dès qu'elles seront
                publiées.
              </p>
            </Panel>
          ) : (
            <Panel className="divide-y divide-dark-gray">
              {prochains.slice(0, 10).map((event, index) => (
                <div key={index} className="flex gap-3 px-4 py-3">
                  <span className={`mt-[7px] h-2 w-2 shrink-0 ${KIND_FILL[event.kind]}`} aria-hidden />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      {event.href ? (
                        <Link
                          href={event.href}
                          className="font-inter-tight text-sm text-foreground underline-offset-4 hover:text-accent-secondary hover:underline"
                        >
                          {event.title}
                        </Link>
                      ) : (
                        <span className="font-inter-tight text-sm text-foreground">{event.title}</span>
                      )}
                      <Tag tone={tone(event)}>
                        {event.overdue ? "En retard · " : ""}
                        {formatDay(event.date)}
                      </Tag>
                    </div>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-mid-gray">
                      {KIND_LABEL[event.kind]}
                    </p>
                  </div>
                </div>
              ))}
              {prochains.length > 10 ? (
                <p className="px-4 py-3 font-inter-tight text-xs text-mid-gray">
                  Et {prochains.length - 10} autre{prochains.length - 10 > 1 ? "s" : ""} sur la période.
                </p>
              ) : null}
            </Panel>
          )}
        </div>
      </div>
    </section>
  );
}
