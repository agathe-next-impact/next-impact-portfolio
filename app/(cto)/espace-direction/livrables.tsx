import type {
  AuditPayload,
  CartographiePayload,
  DecisionPayload,
  Deliverable,
  DocumentPayload,
  PropositionPayload,
  RoadmapPayload,
  VeillePayload,
} from "@cto/deliverables";
import Link from "next/link";
import { Dot, formatAmount, formatDay, Label, Panel, Repli, Suite, Tag, type Tone } from "./ui";
import { ESPACE_PATH } from "./session";

/**
 * L'adresse de chaque catégorie, et son intitulé.
 *
 * Des segments français : ces URL sont celles que le client met en favori et
 * lit dans sa barre d'adresse. `decision` reste au singulier côté code (c'est le
 * nom du type), `decisions` au pluriel côté URL (c'est une collection).
 */
export const CATEGORIES = {
  decision: { slug: "decisions", titre: "Relevé de décisions", section: "decisions" },
  roadmap: { slug: "roadmap", titre: "Roadmap", section: "roadmap" },
  cartographie: { slug: "cartographie", titre: "Cartographie du système", section: "cartographie" },
  veille: { slug: "veille", titre: "Veille dédiée", section: "veille" },
  document: { slug: "documents", titre: "Documents", section: "documents" },
  audit: { slug: "audits", titre: "Audits", section: "audit" },
  proposition: { slug: "propositions", titre: "Propositions", section: "propositions" },
} as const;

/** L'adresse où télécharger une pièce jointe. La route vérifie session ET appartenance. */
export function fichierPath(fileId: string, base: string = ESPACE_PATH): string {
  return `${base}/fichiers/${fileId}`;
}

export type CategorieKind = keyof typeof CATEGORIES;

/**
 * Où se lit une catégorie en entier : sa section. Les anciennes pages
 * `/livrables/<catégorie>` répétaient la section à l'identique ; elles
 * redirigent désormais ici.
 */
export function categoriePath(kind: CategorieKind, base: string = ESPACE_PATH): string {
  return `${base}/${CATEGORIES[kind].section}`;
}

/** L'historique des versions d'un livrable, seule page restée sous `/livrables`. */
export function historiquePath(kind: CategorieKind, notionPageId: string, base: string = ESPACE_PATH): string {
  return `${base}/livrables/${CATEGORIES[kind].slug}/${notionPageId}`;
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
export const STATUS_ORDER = ["Ouvert", "Décidé", "À venir", "Fait", "Écarté"];

const STATUS_TONE: Record<string, Tone> = {
  Ouvert: "attention",
  Décidé: "neutre",
  "À venir": "neutre",
  Fait: "fait",
  Écarté: "neutre",
};

/** Ordre de lecture de la cartographie : ce qui casse l'activité d'abord. */
export const CRITICALITY_ORDER = ["Critique", "Importante", "Secondaire"];

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

/**
 * Ce qu'un livrable est devenu depuis la connexion précédente.
 *
 * `version === 1` distingue une publication d'une correction : les deux méritent
 * un signalement, mais pas le même mot. « Corrigé » sur un livrable que le
 * client n'avait jamais vu serait faux et inquiétant.
 */
export function nouveaute(item: Deliverable, since: Date | null): "nouveau" | "corrige" | null {
  if (!since || item.recordedAt.getTime() <= since.getTime()) return null;
  return item.version === 1 ? "nouveau" : "corrige";
}

/** La pastille qui signale ce qui a bougé. Rien si la fenêtre n'existe pas. */
export function Nouveaute({ item, since }: { item: Deliverable; since: Date | null }) {
  const etat = nouveaute(item, since);
  if (!etat) return null;
  return etat === "nouveau" ? (
    <Tag tone="fait">Nouveau</Tag>
  ) : (
    <Tag tone="attention">Corrigé</Tag>
  );
}

export function rank(order: string[], value: string | null): number {
  const index = value ? order.indexOf(value) : -1;
  return index === -1 ? order.length : index;
}

export function byDate(a: Deliverable, b: Deliverable, direction: 1 | -1): number {
  // Une ligne sans date passe après celles qui en ont une, dans les deux sens :
  // elle est en attente de datation, pas au bout de la file.
  if (!a.occurredAt && !b.occurredAt) return 0;
  if (!a.occurredAt) return 1;
  if (!b.occurredAt) return -1;
  return (a.occurredAt.getTime() - b.occurredAt.getTime()) * direction;
}

export function deadlineTone(date: Date | null, now: number): Tone {
  if (!date) return "neutre";
  const delta = date.getTime() - now;
  if (delta < 0) return "alerte";
  return delta <= HORIZON_MS ? "attention" : "neutre";
}

export function sortRoadmap(items: Deliverable[]): Deliverable[] {
  return [...items].sort(
    (a, b) =>
      rank(STATUS_ORDER, (a.payload as RoadmapPayload).statut) -
        rank(STATUS_ORDER, (b.payload as RoadmapPayload).statut) || byDate(a, b, 1),
  );
}

export function sortCartographie(items: Deliverable[]): Deliverable[] {
  return [...items].sort(
    (a, b) =>
      rank(CRITICALITY_ORDER, (a.payload as CartographiePayload).criticite) -
        rank(CRITICALITY_ORDER, (b.payload as CartographiePayload).criticite) ||
      byDate(a, b, 1),
  );
}

export function sortRecentFirst(items: Deliverable[]): Deliverable[] {
  return [...items].sort((a, b) => byDate(a, b, -1));
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
export function Roadmap({
  base = ESPACE_PATH,
  items,
  now,
  total,
  since = null,
  bare = false,
}: {
  base?: string;
  items: Deliverable[];
  now: number;
  total?: number;
  since?: Date | null;
  bare?: boolean;
}) {
  if (!bare && items.length === 0) {
    return (
      <section className="mt-12">
        <SectionTitle
          id="roadmap"
          title="Roadmap"
          count={total ?? 0}
          href={categoriePath("roadmap", base)}
        />
        <RienALaUne href={categoriePath("roadmap", base)} count={total ?? 0} />
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
          href={categoriePath("roadmap", base)}
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
                  <ChantierCard key={item.id} item={item} now={now} since={since} base={base} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ChantierCard({
  base = ESPACE_PATH,
  item,
  now,
  since,
}: {
  base?: string;
  item: Deliverable;
  now: number;
  since: Date | null;
}) {
  const payload = item.payload as RoadmapPayload;
  const budget = formatAmount(payload.budget);
  const tone = deadlineTone(item.occurredAt, now);

  return (
    <article className="border border-dark-gray bg-jet/40 p-4">
      <h3 className="font-inter-tight text-sm leading-snug text-foreground">{item.title}</h3>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Nouveaute item={item} since={since} />
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
      {payload.source ? (
        <p className="mt-3">
          <a
            href={payload.source}
            target="_blank"
            rel="noreferrer noopener"
            className="font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray underline underline-offset-4 transition-colors hover:text-accent-secondary"
          >
            Voir le document ↗
          </a>
        </p>
      ) : null}
      <Correction item={item} base={base} />
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
export function Decisions({
  base = ESPACE_PATH,
  items,
  total,
  since = null,
  bare = false,
}: {
  base?: string;
  items: Deliverable[];
  total?: number;
  since?: Date | null;
  bare?: boolean;
}) {
  if (!bare && items.length === 0) {
    return (
      <section className="mt-12">
        <SectionTitle
          id="decisions"
          title="Relevé de décisions"
          count={total ?? 0}
          href={categoriePath("decision", base)}
        />
        <RienALaUne href={categoriePath("decision", base)} count={total ?? 0} />
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
          href={categoriePath("decision", base)}
        />
      )}
      <ol className="mt-5">
        {items.slice(0, DECISIONS_VISIBLES).map((item) => (
          <DecisionEntree key={item.id} item={item} since={since} base={base} />
        ))}
      </ol>
      <Suite count={items.length - DECISIONS_VISIBLES} className="border-t border-dark-gray">
        <ol>
          {items.slice(DECISIONS_VISIBLES).map((item) => (
            <DecisionEntree key={item.id} item={item} since={since} base={base} />
          ))}
        </ol>
      </Suite>
    </section>
  );
}

/** Les décisions les plus récentes, avant « Voir les N autres ». */
const DECISIONS_VISIBLES = 8;

function DecisionEntree({ item, since, base }: { item: Deliverable; since: Date | null; base: string }) {
  const payload = item.payload as DecisionPayload;

  return (
    <li className="flex gap-4 sm:gap-6">
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

        {payload.nature === "ecartee" ||
        payload.portee.length > 0 ||
        nouveaute(item, since) ? (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <Nouveaute item={item} since={since} />
            {payload.nature === "ecartee" ? <Tag>Proposition écartée</Tag> : null}
            {payload.portee.map((scope) => (
              <Tag key={scope}>{scope}</Tag>
            ))}
          </div>
        ) : null}

        {/* Le titre dit la décision ; le motif et l'option écartée la
            justifient, et se lisent à la demande. */}
        {payload.motif || payload.optionEcartee ? (
          <Repli resume={payload.optionEcartee ? "Motif et option écartée" : "Motif"}>
            {payload.motif ? <p>{payload.motif}</p> : null}
            {payload.optionEcartee ? (
              <div className="mt-3 border-l border-dark-gray pl-4 text-mid-gray">
                <Label>Ce qui a été écarté</Label>
                <p className="mt-1.5">{payload.optionEcartee}</p>
              </div>
            ) : null}
          </Repli>
        ) : null}

        <Correction item={item} base={base} />
      </div>
    </li>
  );
}

/**
 * La cartographie, groupée par nature d'élément.
 *
 * Un inventaire à plat oblige à relire chaque ligne pour retrouver « quels
 * contrats ai-je ? ». Groupé, le regard va directement au bloc voulu, et le
 * total annuel par groupe donne la réponse budgétaire sans calcul.
 */
export function Cartographie({
  base = ESPACE_PATH,
  items,
  now,
  total,
  since = null,
  bare = false,
}: {
  base?: string;
  items: Deliverable[];
  now: number;
  total?: number;
  since?: Date | null;
  bare?: boolean;
}) {
  if (!bare && items.length === 0) {
    return (
      <section className="mt-12">
        <SectionTitle
          id="cartographie"
          title="Cartographie du système"
          count={total ?? 0}
          href={categoriePath("cartographie", base)}
        />
        <RienALaUne href={categoriePath("cartographie", base)} count={total ?? 0} />
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
          href={categoriePath("cartographie", base)}
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
                  <ElementRow key={item.id} item={item} now={now} since={since} base={base} />
                ))}
              </Panel>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ElementRow({
  base = ESPACE_PATH,
  item,
  now,
  since,
}: {
  base?: string;
  item: Deliverable;
  now: number;
  since: Date | null;
}) {
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
          <Nouveaute item={item} since={since} />
          <Tag tone={CRITICALITY_TONE[criticite] ?? "neutre"}>{criticite}</Tag>
          {cost ? <Tag>{`${cost} / an`}</Tag> : null}
          {payload.detenteur ? <Tag>{`Détenu par ${payload.detenteur}`}</Tag> : null}
        </div>
        {payload.risque ? <Repli resume="Risque">{payload.risque}</Repli> : null}
        <Correction item={item} base={base} />
      </div>
    </article>
  );
}

/**
 * La veille dédiée.
 *
 * Chronologique, la plus récente en tête : une veille se lit comme un fil, pas
 * comme un inventaire. Chaque item porte les trois éléments qui la distinguent
 * d'une revue de presse — le fait, sa source, et ce qu'il implique pour ce
 * client. L'implication est mise en avant typographiquement parce que c'est la
 * seule partie qu'on ne trouverait nulle part ailleurs.
 *
 * Les alertes ne sont pas isolées dans leur propre bloc : les mêler au fil, avec
 * leur étiquette, préserve la chronologie. Un client qui cherche « ce qui s'est
 * dit en juin » ne doit pas avoir deux endroits à regarder.
 */
export function Veille({
  base = ESPACE_PATH,
  items,
  total,
  since = null,
  bare = false,
  visibles,
}: {
  base?: string;
  items: Deliverable[];
  total?: number;
  since?: Date | null;
  bare?: boolean;
  /** Combien d'entrées d'emblée ; la suite se déplie. Tout, si absent. */
  visibles?: number;
}) {
  if (!bare && items.length === 0) {
    return (
      <section className="mt-12">
        <SectionTitle
          id="veille"
          title="Veille dédiée"
          count={total ?? 0}
          href={categoriePath("veille", base)}
        />
        <RienALaUne href={categoriePath("veille", base)} count={total ?? 0} />
      </section>
    );
  }

  return (
    <section className={bare ? "" : "mt-12"}>
      {bare ? null : (
        <SectionTitle
          id="veille"
          title="Veille dédiée"
          count={total ?? items.length}
          href={categoriePath("veille", base)}
        />
      )}
      <Panel className="mt-5 divide-y divide-dark-gray">
        {items.slice(0, visibles ?? items.length).map((item) => (
          <VeilleEntree key={item.id} item={item} since={since} base={base} />
        ))}
        <Suite count={items.length - (visibles ?? items.length)}>
          <div className="divide-y divide-dark-gray border-t border-dark-gray">
            {items.slice(visibles ?? items.length).map((item) => (
              <VeilleEntree key={item.id} item={item} since={since} base={base} />
            ))}
          </div>
        </Suite>
      </Panel>
    </section>
  );
}

function VeilleEntree({ item, since, base }: { item: Deliverable; since: Date | null; base: string }) {
  const payload = item.payload as VeillePayload;

  return (
    <article className="px-5 py-5">
      <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="font-inter-tight text-base leading-snug text-foreground">
          {item.title}
        </h3>
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">
          {formatDay(item.occurredAt)}
        </p>
      </header>

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        <Nouveaute item={item} since={since} />
        {payload.nature === "alerte" ? <Tag tone="alerte">Alerte</Tag> : null}
        {payload.themes.map((theme) => (
          <Tag key={theme}>{theme}</Tag>
        ))}
      </div>

      {/* L'implication reste visible : c'est la seule partie propre à ce
          client. Le fait et sa source, qui la fondent, se déplient. */}
      {payload.implication ? (
        <div className="mt-3 border-l-2 border-l-accent-secondary pl-4">
          <Label>Ce que ça implique pour vous</Label>
          <p className="mt-1.5 font-inter-tight text-sm leading-relaxed text-foreground">
            {payload.implication}
          </p>
        </div>
      ) : null}

      {payload.fait || payload.source ? (
        <Repli resume="Le fait et sa source">
          {payload.fait ? <p>{payload.fait}</p> : null}
          {payload.source ? (
            <p className="mt-2">
              <a
                href={payload.source}
                target="_blank"
                rel="noreferrer noopener"
                className="font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray underline underline-offset-4 transition-colors hover:text-accent-secondary"
              >
                Source ↗
              </a>
            </p>
          ) : null}
        </Repli>
      ) : null}

      <Correction item={item} base={base} />
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
function Correction({ item, base = ESPACE_PATH }: { item: Deliverable; base?: string }) {
  if (item.version <= 1) return null;

  // La mention devient un lien : dire « corrigé » sans permettre de voir ce qui
  // a changé demande de croire sur parole, ce que cet espace est justement censé
  // remplacer par des documents opposables.
  return (
    <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray">
      Corrigé le {formatDay(item.recordedAt)} ·{" "}
      <Link
        href={historiquePath(item.kind as CategorieKind, item.notionPageId, base)}
        className="underline underline-offset-4 transition-colors hover:text-accent-secondary"
      >
        voir les {item.version} versions
      </Link>
    </p>
  );
}

/**
 * Les documents opposables : revue de devis, note de comité, plan de continuité.
 *
 * Une liste, pas une grille : un document se cherche par sa date et son titre.
 * Le verdict d'une revue de devis est mis en avant — c'est la réponse que le
 * client est venu chercher, le reste en est la justification.
 */
export function Documents({
  base = ESPACE_PATH,
  items,
  total,
  since = null,
  bare = false,
}: {
  base?: string;
  items: Deliverable[];
  total?: number;
  since?: Date | null;
  bare?: boolean;
}) {
  if (!bare && items.length === 0) {
    return (
      <section className="mt-12">
        <SectionTitle
          id="documents"
          title="Documents"
          count={total ?? 0}
          href={categoriePath("document", base)}
        />
        <RienALaUne href={categoriePath("document", base)} count={total ?? 0} />
      </section>
    );
  }

  return (
    <section className={bare ? "" : "mt-12"}>
      {bare ? null : (
        <SectionTitle
          id="documents"
          title="Documents"
          count={total ?? items.length}
          href={categoriePath("document", base)}
        />
      )}
      <Panel className="mt-5 divide-y divide-dark-gray">
        {items.map((item) => {
          const payload = item.payload as DocumentPayload;
          const montant = formatAmount(payload.montant);
          const verdictTone: Tone =
            payload.verdict === "Favorable"
              ? "fait"
              : payload.verdict === "Défavorable"
                ? "alerte"
                : payload.verdict
                  ? "attention"
                  : "neutre";

          return (
            <article key={item.id} className="px-5 py-5">
              <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="font-inter-tight text-base leading-snug text-foreground">{item.title}</h3>
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">
                  {item.occurredAt ? formatDay(item.occurredAt) : "sans date"}
                </p>
              </header>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                <Nouveaute item={item} since={since} />
                {payload.type ? <Tag>{payload.type}</Tag> : null}
                {payload.verdict ? <Tag tone={verdictTone}>{payload.verdict}</Tag> : null}
                {payload.prestataire ? <Tag>{payload.prestataire}</Tag> : null}
                {montant ? <Tag>{`${montant} HT`}</Tag> : null}
              </div>
              {/* Le verdict, en étiquette, est la réponse ; l'alternative en est
                  la justification, dépliée à la demande. */}
              {payload.alternative ? <Repli resume="Alternative chiffrée">{payload.alternative}</Repli> : null}
              {payload.fichier ? (
                <p className="mt-3">
                  <a
                    href={fichierPath(payload.fichier.id, base)}
                    className="font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray underline underline-offset-4 transition-colors hover:text-accent-secondary"
                  >
                    Télécharger · {payload.fichier.name} ({tailleLisible(payload.fichier.size)})
                  </a>
                </p>
              ) : null}
              <Correction item={item} base={base} />
            </article>
          );
        })}
      </Panel>
    </section>
  );
}

/** L'adresse de lecture d'un audit. */
export function auditPath(notionPageId: string, base: string = ESPACE_PATH): string {
  return `${base}/audit/${notionPageId}`;
}

/**
 * Les audits remis : de quoi choisir lequel ouvrir.
 *
 * Le plus souvent il n'y en a qu'un, et la section Audit l'ouvre directement ;
 * cette liste sert quand un second audit vient mesurer le premier.
 */
export function Audits({
  base = ESPACE_PATH,
  items,
  since = null,
}: {
  base?: string;
  items: Deliverable[];
  since?: Date | null;
}) {
  return (
    <Panel className="mt-5 divide-y divide-dark-gray">
      {items.map((item) => {
        const payload = item.payload as AuditPayload;
        return (
          <article key={item.id} className="px-5 py-5">
            <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="font-inter-tight text-base leading-snug text-foreground">
                <Link
                  href={auditPath(item.notionPageId, base)}
                  className="underline-offset-4 hover:text-accent-secondary hover:underline"
                >
                  {item.title}
                </Link>
              </h3>
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">
                {item.occurredAt ? `Mesures du ${formatDay(item.occurredAt)}` : "sans date"}
              </p>
            </header>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              <Nouveaute item={item} since={since} />
              {payload.site ? <Tag>{payload.site.replace(/^https?:\/\//, "").replace(/\/$/, "")}</Tag> : null}
              <Tag>{`${payload.sections.length} parties`}</Tag>
              {payload.annexe ? <Tag>Annexe de preuves</Tag> : null}
            </div>
            <Correction item={item} base={base} />
          </article>
        );
      })}
    </Panel>
  );
}

/** L'adresse de lecture d'une proposition. */
export function propositionPath(notionPageId: string, base: string = ESPACE_PATH): string {
  return `${base}/propositions/${notionPageId}`;
}

/** Ton d'un statut de proposition : acceptée = réglé, déclinée = neutre, le reste attend. */
export function propositionTone(statut: string | null): Tone {
  if (statut === "Acceptée" || statut === "Signée") return "fait";
  if (statut === "Déclinée" || statut === "Refusée") return "neutre";
  return "attention";
}

/** Les propositions remises : de quoi choisir laquelle ouvrir. */
export function Propositions({
  base = ESPACE_PATH,
  items,
  since = null,
}: {
  base?: string;
  items: Deliverable[];
  since?: Date | null;
}) {
  return (
    <Panel className="mt-5 divide-y divide-dark-gray">
      {items.map((item) => {
        const payload = item.payload as PropositionPayload;
        return (
          <article key={item.id} className="px-5 py-5">
            <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="font-inter-tight text-base leading-snug text-foreground">
                <Link
                  href={propositionPath(item.notionPageId, base)}
                  className="underline-offset-4 hover:text-accent-secondary hover:underline"
                >
                  {item.title}
                </Link>
              </h3>
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">
                {item.occurredAt ? formatDay(item.occurredAt) : "sans date"}
              </p>
            </header>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              <Nouveaute item={item} since={since} />
              <Tag tone={propositionTone(payload.statut)}>{payload.statut ?? "En attente de réponse"}</Tag>
              {payload.sections.length > 0 ? <Tag>{`${payload.sections.length} parties`}</Tag> : null}
            </div>
            <Correction item={item} base={base} />
          </article>
        );
      })}
    </Panel>
  );
}

/** Taille de fichier lisible, sans fausse précision. */
export function tailleLisible(octets: number): string {
  if (octets < 1024 * 1024) return `${Math.max(1, Math.round(octets / 1024))} Ko`;
  return `${(octets / 1024 / 1024).toFixed(1).replace(".", ",")} Mo`;
}

