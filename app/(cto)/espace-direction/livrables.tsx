import type {
  CartographiePayload,
  DecisionPayload,
  Deliverable,
  RoadmapPayload,
} from "@cto/deliverables";
import { formatAmount, formatDay, Label, Panel, Tag } from "./ui";

// ─────────────────────────────────────────────────────────────────────────────
// L'affichage des livrables.
//
// Trois sections dans un ordre qui n'est pas celui de la production mais celui
// de la lecture : ce qui arrive (roadmap), ce qui a été tranché (décisions), ce
// qui existe (cartographie). Un dirigeant ouvre cet écran pour savoir où on en
// est, pas pour relire l'inventaire.
//
// Rien n'est replié, rien n'est paginé. À quelques dizaines de lignes par
// accompagnement, un accordéon cacherait la preuve pour économiser un défilement
// — et c'est la preuve qu'on est venu chercher.
// ─────────────────────────────────────────────────────────────────────────────

/** Ordre de lecture de la roadmap : ce qui bloque d'abord, ce qui est fait ensuite. */
const STATUS_ORDER = ["Ouvert", "Décidé", "À venir", "Fait", "Écarté"];

/** Ordre de lecture de la cartographie : ce qui casse l'activité d'abord. */
const CRITICALITY_ORDER = ["Critique", "Importante", "Secondaire"];

function rank(order: string[], value: string | null): number {
  const index = value ? order.indexOf(value) : -1;
  return index === -1 ? order.length : index;
}

function byDate(a: Deliverable, b: Deliverable, direction: 1 | -1): number {
  // Une ligne sans date passe après celles qui en ont une, dans les deux sens :
  // elle est en attente de datation, pas au bout de la file.
  if (!a.occurredAt && !b.occurredAt) return 0;
  if (!a.occurredAt) return 1;
  if (!b.occurredAt) return -1;
  return (a.occurredAt.getTime() - b.occurredAt.getTime()) * direction;
}

export function Livrables({ items }: { items: Deliverable[] }) {
  const roadmap = items.filter((item) => item.kind === "roadmap");
  const decisions = items.filter((item) => item.kind === "decision");
  const carto = items.filter((item) => item.kind === "cartographie");

  if (items.length === 0) {
    return (
      <section className="mt-10">
        <Label>Vos livrables</Label>
        <Panel className="mt-3 px-5 py-6">
          <p className="font-inter-tight text-base text-mid-gray">
            Vos livrables (relevé de décisions, roadmap, cartographie du système)
            apparaîtront ici dès la première publication.
          </p>
        </Panel>
      </section>
    );
  }

  roadmap.sort(
    (a, b) =>
      rank(STATUS_ORDER, (a.payload as RoadmapPayload).statut) -
        rank(STATUS_ORDER, (b.payload as RoadmapPayload).statut) || byDate(a, b, 1),
  );
  decisions.sort((a, b) => byDate(a, b, -1));
  carto.sort(
    (a, b) =>
      rank(CRITICALITY_ORDER, (a.payload as CartographiePayload).criticite) -
        rank(CRITICALITY_ORDER, (b.payload as CartographiePayload).criticite) ||
      byDate(a, b, 1),
  );

  return (
    <>
      <Section title="Roadmap" items={roadmap} render={(item) => <RoadmapItem item={item} />} />
      <Section
        title="Relevé de décisions"
        items={decisions}
        render={(item) => <DecisionItem item={item} />}
      />
      <Section
        title="Cartographie du système"
        items={carto}
        render={(item) => <CartoItem item={item} />}
      />
    </>
  );
}

function Section({
  title,
  items,
  render,
}: {
  title: string;
  items: Deliverable[];
  render: (item: Deliverable) => React.ReactNode;
}) {
  if (items.length === 0) return null;

  return (
    <section className="mt-10">
      <Label>{title}</Label>
      <Panel className="mt-3 divide-y divide-dark-gray">
        {items.map((item) => (
          <article key={item.id} className="px-5 py-5">
            {render(item)}
          </article>
        ))}
      </Panel>
    </section>
  );
}

/**
 * En-tête commun : le titre, la date qui compte, et la mention de correction.
 *
 * `version > 1` est affiché à dessein. Un livrable corrigé sans le dire vaudrait
 * moins qu'un livrable corrigé et daté : c'est ce qui permet au client de dire
 * « ce n'est pas ce que j'avais lu », et d'avoir raison.
 */
function Head({ item, meta }: { item: Deliverable; meta?: React.ReactNode }) {
  return (
    <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <h3 className="font-inter-tight text-base text-foreground">{item.title}</h3>
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">
        {meta ?? formatDay(item.occurredAt)}
        {item.version > 1 ? ` · corrigé le ${formatDay(item.recordedAt)}` : ""}
      </p>
    </header>
  );
}

function RoadmapItem({ item }: { item: Deliverable }) {
  const payload = item.payload as RoadmapPayload;
  const budget = formatAmount(payload.budget);

  return (
    <>
      <Head item={item} />
      <div className="mt-3 flex flex-wrap gap-2">
        {payload.statut ? <Tag>{payload.statut}</Tag> : null}
        {payload.nature === "opportunite" ? <Tag>Opportunité</Tag> : null}
        {budget ? <Tag>{budget}</Tag> : null}
        {/* Les deux axes ne se montrent que s'ils sont tous les deux posés :
            un effort sans effet ne classe rien, il occupe une ligne. */}
        {payload.effort && payload.effet ? (
          <Tag>{`Effort ${payload.effort} · effet ${payload.effet}`}</Tag>
        ) : null}
      </div>
      {payload.detail ? (
        <p className="mt-3 font-inter-tight text-sm text-mid-gray">{payload.detail}</p>
      ) : null}
    </>
  );
}

function DecisionItem({ item }: { item: Deliverable }) {
  const payload = item.payload as DecisionPayload;

  return (
    <>
      <Head item={item} />
      {payload.nature === "ecartee" || payload.portee.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {payload.nature === "ecartee" ? <Tag>Proposition écartée</Tag> : null}
          {payload.portee.map((scope) => (
            <Tag key={scope}>{scope}</Tag>
          ))}
        </div>
      ) : null}
      {payload.motif ? (
        <p className="mt-3 font-inter-tight text-sm text-foreground">{payload.motif}</p>
      ) : null}
      {payload.optionEcartee ? (
        <p className="mt-2 font-inter-tight text-sm text-mid-gray">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em]">
            Option écartée —{" "}
          </span>
          {payload.optionEcartee}
        </p>
      ) : null}
    </>
  );
}

function CartoItem({ item }: { item: Deliverable }) {
  const payload = item.payload as CartographiePayload;
  const cost = formatAmount(payload.coutAnnuel);
  // L'échéance porte ici son propre libellé : sur une ligne de contrat, une date
  // nue se lit comme une date de création et non comme une fin d'engagement.
  const meta = item.occurredAt ? `Échéance ${formatDay(item.occurredAt)}` : undefined;

  return (
    <>
      <Head item={item} meta={meta} />
      <div className="mt-3 flex flex-wrap gap-2">
        {payload.type ? <Tag>{payload.type}</Tag> : null}
        {payload.criticite ? <Tag>{payload.criticite}</Tag> : null}
        {cost ? <Tag>{`${cost} / an`}</Tag> : null}
        {payload.detenteur ? <Tag>{`Détenu par ${payload.detenteur}`}</Tag> : null}
      </div>
      {payload.risque ? (
        <p className="mt-3 font-inter-tight text-sm text-mid-gray">{payload.risque}</p>
      ) : null}
    </>
  );
}
