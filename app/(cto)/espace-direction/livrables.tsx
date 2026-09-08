import type {
  CartographiePayload,
  DecisionPayload,
  Deliverable,
  RoadmapPayload,
} from "@cto/deliverables";
import Link from "next/link";
import { Dot, formatAmount, formatDay, Label, Panel, SectionNav, Stat, Tag, type Tone } from "./ui";
import { ESPACE_PATH } from "./session";

/**
 * L'adresse de chaque catégorie, et son intitulé.
 *
 * Des segments français : ces URL sont celles que le client met en favori et
 * lit dans sa barre d'adresse. `decision` reste au singulier côté code (c'est le
 * nom du type), `decisions` au pluriel côté URL (c'est une collection).
 */
export const CATEGORIES = {
  decision: { slug: "decisions", titre: "Relevé de décisions" },
  roadmap: { slug: "roadmap", titre: "Roadmap" },
  cartographie: { slug: "cartographie", titre: "Cartographie du système" },
} as const;

export type CategorieKind = keyof typeof CATEGORIES;

export function categoriePath(kind: CategorieKind): string {
  return `${ESPACE_PATH}/livrables/${CATEGORIES[kind].slug}`;
}

/** Retrouve le type depuis le segment d'URL. Rend null sur un segment inconnu. */
export function kindFromSlug(slug: string): CategorieKind | null {
  const entry = Object.entries(CATEGORIES).find(([, value]) => value.slug === slug);
  return entry ? (entry[0] as CategorieKind) : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// L'affichage des livrables.
//
// **Trois vues, pas trois listes.** Chaque type de livrable répond à une
// question différente et mérite donc une forme différente : la roadmap se lit en
// colonnes parce qu'on veut savoir ce qui bouge, les décisions en frise parce
// qu'on veut savoir quand, la cartographie en inventaire groupé parce qu'on
// veut savoir ce qui casse. Les rendre toutes les trois en liste à puces, comme
// au premier jet, économisait du code au prix du seul travail que cet écran
// doit faire : rendre l'état d'un système lisible en dix secondes.
//
// L'ordre est celui de la lecture, pas celui de la production : ce qui arrive,
// ce qui a été tranché, ce qui existe.
//
// Le bandeau de tête n'ajoute aucune donnée — il ne fait que remonter quatre
// chiffres déjà présents plus bas. C'est ce qui permet de repartir sans
// défiler, et c'est exactement l'usage d'un dirigeant entre deux réunions.
// ─────────────────────────────────────────────────────────────────────────────

/** Ordre de lecture de la roadmap : ce qui bloque d'abord, ce qui est fait ensuite. */
const STATUS_ORDER = ["Ouvert", "Décidé", "À venir", "Fait", "Écarté"];

const STATUS_TONE: Record<string, Tone> = {
  Ouvert: "attention",
  Décidé: "neutre",
  "À venir": "neutre",
  Fait: "fait",
  Écarté: "neutre",
};

/** Ordre de lecture de la cartographie : ce qui casse l'activité d'abord. */
const CRITICALITY_ORDER = ["Critique", "Importante", "Secondaire"];

const CRITICALITY_TONE: Record<string, Tone> = {
  Critique: "alerte",
  Importante: "attention",
  Secondaire: "neutre",
};

/**
 * Une échéance devient visible à trois mois.
 *
 * C'est le délai en deçà duquel un contrat ne se renégocie plus sereinement :
 * signaler plus tôt banaliserait l'alerte, plus tard la rendrait inutile.
 */
const HORIZON_MS = 90 * 24 * 60 * 60 * 1000;

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

function deadlineTone(date: Date | null, now: number): Tone {
  if (!date) return "neutre";
  const delta = date.getTime() - now;
  if (delta < 0) return "alerte";
  return delta <= HORIZON_MS ? "attention" : "neutre";
}

export function Livrables({ items }: { items: Deliverable[] }) {
  const now = Date.now();

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

  const sections = [
    { href: categoriePath("roadmap"), label: "Roadmap", count: roadmap.length },
    { href: categoriePath("decision"), label: "Décisions", count: decisions.length },
    { href: categoriePath("cartographie"), label: "Cartographie", count: carto.length },
  ].filter((section) => section.count > 0);

  // La synthèse compte TOUT, l'affichage ne montre que ce qui est à la une.
  // C'est délibéré : « quatre chantiers en cours » doit rester vrai même si
  // aucun n'a été mis en avant, sinon le repère devient un compte d'affichage
  // et ne répond plus à la question posée.
  const aLaUne = (list: Deliverable[]) => list.filter((item) => item.featured);

  return (
    <>
      <Synthese roadmap={roadmap} decisions={decisions} carto={carto} now={now} />
      <SectionNav items={sections} />
      {roadmap.length > 0 ? (
        <Roadmap items={aLaUne(roadmap)} now={now} total={roadmap.length} />
      ) : null}
      {decisions.length > 0 ? (
        <Decisions items={aLaUne(decisions)} total={decisions.length} />
      ) : null}
      {carto.length > 0 ? (
        <Cartographie items={aLaUne(carto)} now={now} total={carto.length} />
      ) : null}
    </>
  );
}

/**
 * Une catégorie complète, pour sa page dédiée.
 *
 * Aucune notion de « à la une » ici : la page de catégorie montre tout ce qui
 * est publié, mis en avant ou non. C'est l'endroit où le client vient chercher,
 * pas celui où on lui présente.
 */
export function Categorie({
  kind,
  items,
}: {
  kind: CategorieKind;
  items: Deliverable[];
}) {
  const now = Date.now();

  if (items.length === 0) {
    return (
      <Panel className="mt-6 px-5 py-6">
        <p className="font-inter-tight text-base text-mid-gray">
          Rien de publié dans cette catégorie pour l'instant.
        </p>
      </Panel>
    );
  }

  if (kind === "roadmap") {
    const tri = [...items].sort(
      (a, b) =>
        rank(STATUS_ORDER, (a.payload as RoadmapPayload).statut) -
          rank(STATUS_ORDER, (b.payload as RoadmapPayload).statut) || byDate(a, b, 1),
    );
    return <Roadmap items={tri} now={now} bare />;
  }

  if (kind === "decision") {
    return <Decisions items={[...items].sort((a, b) => byDate(a, b, -1))} bare />;
  }

  const tri = [...items].sort(
    (a, b) =>
      rank(CRITICALITY_ORDER, (a.payload as CartographiePayload).criticite) -
        rank(CRITICALITY_ORDER, (b.payload as CartographiePayload).criticite) ||
      byDate(a, b, 1),
  );
  return <Cartographie items={tri} now={now} bare />;
}

/** Les quatre chiffres qui répondent à « où en est-on ? » sans défiler. */
function Synthese({
  roadmap,
  decisions,
  carto,
  now,
}: {
  roadmap: Deliverable[];
  decisions: Deliverable[];
  carto: Deliverable[];
  now: number;
}) {
  const ouverts = roadmap.filter((item) => {
    const statut = (item.payload as RoadmapPayload).statut;
    return statut === "Ouvert" || statut === "Décidé";
  }).length;

  // La prochaine échéance se cherche dans les DEUX bases : un renouvellement de
  // contrat engage autant qu'un chantier, et le client ne fait pas la différence
  // entre les deux quand il demande « qu'est-ce qui tombe bientôt ? ».
  const prochaine = [...roadmap, ...carto]
    .filter((item) => item.occurredAt && item.occurredAt.getTime() >= now)
    .sort((a, b) => a.occurredAt!.getTime() - b.occurredAt!.getTime())[0];

  const critiques = carto.filter(
    (item) => (item.payload as CartographiePayload).criticite === "Critique",
  ).length;

  return (
    <section aria-label="Vue d'ensemble" className="mt-10">
      <Panel className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Chantiers en cours" value={String(ouverts)} />
        <Stat
          label="Prochaine échéance"
          value={prochaine ? formatDay(prochaine.occurredAt) : "—"}
          hint={prochaine?.title}
          tone={prochaine ? deadlineTone(prochaine.occurredAt, now) : "neutre"}
        />
        <Stat label="Décisions rendues" value={String(decisions.length)} />
        <Stat
          label="Points critiques"
          value={String(critiques)}
          tone={critiques > 0 ? "alerte" : "neutre"}
        />
      </Panel>
    </section>
  );
}

/**
 * En-tête de section.
 *
 * Quand `href` est fourni, le compte devient le lien vers la catégorie complète.
 * C'est volontairement le CHIFFRE qui est cliquable, et non un « voir tout »
 * ajouté à côté : le nombre d'entrées est déjà la raison d'aller voir.
 */
function SectionTitle({
  id,
  title,
  count,
  href,
}: {
  id: string;
  title: string;
  count: number;
  href?: string;
}) {
  const libelle = `${count} ${count > 1 ? "entrées" : "entrée"}`;

  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-dark-gray pb-3">
      <h2 id={id} className="scroll-mt-8 font-sans text-lg font-light text-foreground">
        {title}
      </h2>
      {href ? (
        <Link
          href={href}
          className="font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray transition-colors hover:text-accent-secondary"
        >
          Tout voir · {libelle} →
        </Link>
      ) : (
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">
          {libelle}
        </span>
      )}
    </div>
  );
}

/**
 * Ce qui s'affiche à la place d'une section dont rien n'est à la une.
 *
 * Une section vide sur l'accueil ne doit pas ressembler à une section vide tout
 * court : le client a des entrées, elles sont simplement rangées. Le dire évite
 * l'impression d'un espace inachevé.
 */
function RienALaUne({ href, count }: { href: string; count: number }) {
  return (
    <Panel className="mt-3 px-5 py-4">
      <p className="font-inter-tight text-sm text-mid-gray">
        Rien à la une pour l'instant.{" "}
        <Link href={href} className="text-foreground underline underline-offset-4 hover:text-accent-secondary">
          Consulter les {count} entrées
        </Link>
        .
      </p>
    </Panel>
  );
}

/**
 * La roadmap en colonnes de statut.
 *
 * C'est la seule vue où la position vaut autant que le texte : voir trois
 * chantiers empilés sous « Ouvert » et un seul sous « Fait » dit quelque chose
 * qu'une liste chronologique ne dit pas. Les colonnes vides ne s'affichent pas —
 * un statut inutilisé est du bruit, pas une information.
 */
function Roadmap({
  items,
  now,
  total,
  bare = false,
}: {
  items: Deliverable[];
  now: number;
  total?: number;
  bare?: boolean;
}) {
  if (!bare && items.length === 0) {
    return (
      <section className="mt-12">
        <SectionTitle
          id="roadmap"
          title="Roadmap"
          count={total ?? 0}
          href={categoriePath("roadmap")}
        />
        <RienALaUne href={categoriePath("roadmap")} count={total ?? 0} />
      </section>
    );
  }

  const groupes = STATUS_ORDER.map((statut) => ({
    statut,
    lignes: items.filter((item) => (item.payload as RoadmapPayload).statut === statut),
  })).filter((groupe) => groupe.lignes.length > 0);

  const orphelines = items.filter(
    (item) => !STATUS_ORDER.includes((item.payload as RoadmapPayload).statut ?? ""),
  );
  if (orphelines.length > 0) groupes.push({ statut: "Sans statut", lignes: orphelines });

  return (
    <section className={bare ? "" : "mt-12"}>
      {bare ? null : (
        <SectionTitle
          id="roadmap"
          title="Roadmap"
          count={total ?? items.length}
          href={categoriePath("roadmap")}
        />
      )}
      {/* Défilement horizontal sur petit écran plutôt qu'un empilement : les
          colonnes perdraient leur sens à se retrouver les unes sous les autres. */}
      <div className="-mx-6 mt-5 overflow-x-auto px-6 pb-2">
        <div className="grid min-w-[38rem] auto-cols-fr grid-flow-col gap-3">
          {groupes.map((groupe) => (
            <div key={groupe.statut}>
              <div className="flex items-center gap-2 pb-2">
                <Dot
                  tone={STATUS_TONE[groupe.statut] ?? "neutre"}
                  label={`Statut ${groupe.statut}`}
                />
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">
                  {groupe.statut} · {groupe.lignes.length}
                </p>
              </div>
              <div className="space-y-3">
                {groupe.lignes.map((item) => (
                  <ChantierCard key={item.id} item={item} now={now} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ChantierCard({ item, now }: { item: Deliverable; now: number }) {
  const payload = item.payload as RoadmapPayload;
  const budget = formatAmount(payload.budget);
  const tone = deadlineTone(item.occurredAt, now);

  return (
    <article className="border border-dark-gray bg-jet/40 p-4">
      <h3 className="font-inter-tight text-sm leading-snug text-foreground">{item.title}</h3>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {item.occurredAt ? <Tag tone={tone}>{formatDay(item.occurredAt)}</Tag> : null}
        {budget ? <Tag>{budget}</Tag> : null}
        {payload.nature === "opportunite" ? <Tag>Opportunité</Tag> : null}
        {/* Les deux axes ne se montrent qu'ensemble : un effort sans effet ne
            classe rien, il occupe une ligne. */}
        {payload.effort && payload.effet ? (
          <Tag>{`Effort ${payload.effort} · effet ${payload.effet}`}</Tag>
        ) : null}
      </div>
      {payload.detail ? (
        <p className="mt-3 font-inter-tight text-xs leading-relaxed text-mid-gray">
          {payload.detail}
        </p>
      ) : null}
      <Correction item={item} />
    </article>
  );
}

/**
 * Les décisions en frise.
 *
 * La date passe à gauche, sur son propre rail : c'est la première chose que
 * cherche quelqu'un qui revient sur un arbitrage, et la ligne verticale rend le
 * rythme des comités visible sans qu'on ait à le raconter.
 *
 * L'option écartée se replie. Elle est le cœur de la preuve — une décision sans
 * alternative documentée n'est pas un arbitrage — mais treize alternatives
 * dépliées noient les treize décisions. Repliée, elle reste à un clic, et le
 * `<details>` natif la rend accessible au clavier sans une ligne de JavaScript.
 */
function Decisions({
  items,
  total,
  bare = false,
}: {
  items: Deliverable[];
  total?: number;
  bare?: boolean;
}) {
  if (!bare && items.length === 0) {
    return (
      <section className="mt-12">
        <SectionTitle
          id="decisions"
          title="Relevé de décisions"
          count={total ?? 0}
          href={categoriePath("decision")}
        />
        <RienALaUne href={categoriePath("decision")} count={total ?? 0} />
      </section>
    );
  }

  return (
    <section className={bare ? "" : "mt-12"}>
      {bare ? null : (
        <SectionTitle
          id="decisions"
          title="Relevé de décisions"
          count={total ?? items.length}
          href={categoriePath("decision")}
        />
      )}
      <ol className="mt-5">
        {items.map((item) => {
          const payload = item.payload as DecisionPayload;

          return (
            <li key={item.id} className="flex gap-4 sm:gap-6">
              <div className="w-24 shrink-0 pt-5 text-right sm:w-32">
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">
                  {item.occurredAt ? formatDay(item.occurredAt) : "sans date"}
                </p>
              </div>

              <div className="relative flex-1 border-l border-dark-gray pb-8 pl-5 pt-5 sm:pl-6">
                <span
                  aria-hidden
                  className={`absolute -left-[4.5px] top-[26px] h-2 w-2 ${
                    payload.nature === "ecartee" ? "bg-mid-gray/50" : "bg-accent-secondary"
                  }`}
                />
                <h3 className="font-inter-tight text-base leading-snug text-foreground">
                  {item.title}
                </h3>

                {payload.nature === "ecartee" || payload.portee.length > 0 ? (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {payload.nature === "ecartee" ? <Tag>Proposition écartée</Tag> : null}
                    {payload.portee.map((scope) => (
                      <Tag key={scope}>{scope}</Tag>
                    ))}
                  </div>
                ) : null}

                {payload.motif ? (
                  <p className="mt-3 font-inter-tight text-sm leading-relaxed text-foreground/90">
                    {payload.motif}
                  </p>
                ) : null}

                {payload.optionEcartee ? (
                  <details className="group mt-3">
                    <summary className="cursor-pointer list-none font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray transition-colors hover:text-accent-secondary">
                      <span className="group-open:hidden">+ Ce qui a été écarté</span>
                      <span className="hidden group-open:inline">− Ce qui a été écarté</span>
                    </summary>
                    <p className="mt-2 border-l border-dark-gray pl-4 font-inter-tight text-sm leading-relaxed text-mid-gray">
                      {payload.optionEcartee}
                    </p>
                  </details>
                ) : null}

                <Correction item={item} />
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/**
 * La cartographie, groupée par nature d'élément.
 *
 * Un inventaire à plat oblige à relire chaque ligne pour retrouver « quels
 * contrats ai-je ? ». Groupé, le regard va directement au bloc voulu, et le
 * total annuel par groupe donne la réponse budgétaire sans calcul.
 */
function Cartographie({
  items,
  now,
  total,
  bare = false,
}: {
  items: Deliverable[];
  now: number;
  total?: number;
  bare?: boolean;
}) {
  if (!bare && items.length === 0) {
    return (
      <section className="mt-12">
        <SectionTitle
          id="cartographie"
          title="Cartographie du système"
          count={total ?? 0}
          href={categoriePath("cartographie")}
        />
        <RienALaUne href={categoriePath("cartographie")} count={total ?? 0} />
      </section>
    );
  }

  const types = Array.from(
    new Set(items.map((item) => (item.payload as CartographiePayload).type ?? "Autres")),
  );

  return (
    <section className={bare ? "" : "mt-12"}>
      {bare ? null : (
        <SectionTitle
          id="cartographie"
          title="Cartographie du système"
          count={total ?? items.length}
          href={categoriePath("cartographie")}
        />
      )}
      <div className="mt-5 space-y-6">
        {types.map((type) => {
          const lignes = items.filter(
            (item) => ((item.payload as CartographiePayload).type ?? "Autres") === type,
          );
          const total = lignes.reduce(
            (sum, item) => sum + ((item.payload as CartographiePayload).coutAnnuel ?? 0),
            0,
          );
          const totalLisible = total > 0 ? formatAmount(total) : null;

          return (
            <div key={type}>
              <div className="flex items-baseline justify-between gap-4">
                <Label>{type}</Label>
                {totalLisible ? (
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">
                    {totalLisible} / an
                  </span>
                ) : null}
              </div>
              <Panel className="mt-2 divide-y divide-dark-gray">
                {lignes.map((item) => (
                  <ElementRow key={item.id} item={item} now={now} />
                ))}
              </Panel>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ElementRow({ item, now }: { item: Deliverable; now: number }) {
  const payload = item.payload as CartographiePayload;
  const criticite = payload.criticite ?? "Secondaire";
  const cost = formatAmount(payload.coutAnnuel);
  const echeance = deadlineTone(item.occurredAt, now);

  return (
    <article className="flex gap-3 px-4 py-4">
      <Dot tone={CRITICALITY_TONE[criticite] ?? "neutre"} label={`Criticité ${criticite}`} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="font-inter-tight text-sm text-foreground">{item.title}</h3>
          {item.occurredAt ? (
            <span
              className={`font-mono text-[10px] uppercase tracking-[0.12em] ${
                echeance === "neutre" ? "text-mid-gray" : ""
              }`}
            >
              {echeance === "neutre" ? (
                `Échéance ${formatDay(item.occurredAt)}`
              ) : (
                <Tag tone={echeance}>
                  {echeance === "alerte" ? "Échue le " : "Échéance "}
                  {formatDay(item.occurredAt)}
                </Tag>
              )}
            </span>
          ) : null}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Tag tone={CRITICALITY_TONE[criticite] ?? "neutre"}>{criticite}</Tag>
          {cost ? <Tag>{`${cost} / an`}</Tag> : null}
          {payload.detenteur ? <Tag>{`Détenu par ${payload.detenteur}`}</Tag> : null}
        </div>
        {payload.risque ? (
          <p className="mt-2.5 font-inter-tight text-xs leading-relaxed text-mid-gray">
            {payload.risque}
          </p>
        ) : null}
        <Correction item={item} />
      </div>
    </article>
  );
}

/**
 * La mention de correction, partout sous la même forme.
 *
 * Affichée dès la deuxième version, à dessein : le client doit pouvoir dire
 * « ce n'est pas ce que j'avais lu » et avoir raison. Une correction silencieuse
 * vaudrait moins qu'une correction datée.
 */
function Correction({ item }: { item: Deliverable }) {
  if (item.version <= 1) return null;

  return (
    <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray">
      Corrigé le {formatDay(item.recordedAt)} · version {item.version}
    </p>
  );
}
