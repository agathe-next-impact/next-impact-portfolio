import type { ReactNode } from "react";
import { prestationsForClient, type AttachedFile, type Deliverable } from "@cto/deliverables";
import { deadlineTone, fichierPath, tailleLisible } from "./livrables";
import { EnPreparation, Espace, type EspaceContext } from "./shell";
import { formatAmount, formatDay, Groupe, Label, Panel, Repli, Stat, Tag, type Tone } from "./ui";
import type { Viewer } from "./viewer";

// ─────────────────────────────────────────────────────────────────────────────
// Les prestations : ce qui a été commandé, son tarif, ses règlements.
//
// Un seul écran pour deux lecteurs : l'espace client (Contrats → Prestations,
// ses seules prestations) et l'administration (`/admin-cto/pilotage/
// prestations`, toutes). Ce que l'un voit, l'autre le voit ; l'administration
// ajoute seulement le nom de l'accompagnement et le lien vers la page Notion.
// ─────────────────────────────────────────────────────────────────────────────

type Prestation = Deliverable<"prestation">;

/**
 * La base des adresses de fichiers d'une ligne : l'espace du client, ou son
 * miroir dans l'administration — la route de téléchargement y revérifie
 * l'appartenance de la pièce.
 */
type BaseFichiers = (item: Prestation) => string;

/** Ordre de lecture : ce qui est en cours d'abord. */
const STATUTS = ["En cours", "À venir", "Suspendue", "Terminée"] as const;
const SANS_STATUT = "Sans statut";

const TONE: Record<string, Tone> = {
  "En cours": "attention",
  "À venir": "neutre",
  Suspendue: "alerte",
  Terminée: "fait",
};

function somme(items: Prestation[]): number {
  return items.reduce((total, item) => total + (item.payload.montant ?? 0), 0);
}

/** Ce qui a été encaissé sur une prestation, d'après son échéancier. */
function encaisse(item: Prestation): number {
  return (item.payload.paiements ?? [])
    .filter((paiement) => paiement.statut === "Reçu")
    .reduce((total, paiement) => total + (paiement.montant ?? 0), 0);
}

/**
 * Ce qui reste dû. Seules comptent les prestations suivies (au moins un
 * règlement saisi) et chiffrées : sans échéancier, « tout reste dû » serait
 * faux pour les prestations réglées avant son arrivée.
 */
function resteDu(items: Prestation[]): number {
  return items.reduce((total, item) => {
    const montant = item.payload.montant;
    if (!item.payload.paiements?.length || typeof montant !== "number") return total;
    return total + Math.max(0, montant - encaisse(item));
  }, 0);
}

function montantOuZero(valeur: number): string {
  return formatAmount(valeur) ?? "0 €";
}

const pluriel = (n: number) => `${n} prestation${n > 1 ? "s" : ""}`;

/**
 * Les chiffres en tête, puis les prestations rangées par statut.
 *
 * `admin` n'ajoute que des liens : l'accompagnement de chaque ligne (quand la
 * liste en mélange plusieurs) et la page Notion où la ligne se corrige.
 */
export function TableauPrestations({
  items,
  admin,
  base,
}: {
  items: Prestation[];
  admin?: { accompagnement?: (item: Prestation) => ReactNode };
  /** D'où servir le devis et les factures PDF de chaque ligne. */
  base: BaseFichiers;
}) {
  const now = Date.now();

  // Un statut inconnu (renommé dans Notion) tombe dans « Sans statut » : la
  // ligne reste visible, son étiquette garde le libellé d'origine.
  const groupeDe = (item: Prestation): string =>
    (STATUTS as readonly string[]).includes(item.payload.statut ?? "") ? item.payload.statut! : SANS_STATUT;
  const groupes = [...STATUTS, SANS_STATUT]
    .map((statut) => ({
      statut,
      items: items
        .filter((item) => groupeDe(item) === statut)
        // Livraison la plus proche d'abord ; sans date, en fin de groupe.
        .sort((a, b) => (a.occurredAt?.getTime() ?? Infinity) - (b.occurredAt?.getTime() ?? Infinity)),
    }))
    .filter((groupe) => groupe.items.length > 0);

  const parStatut = (statut: string) => items.filter((item) => item.payload.statut === statut);
  const enCours = parStatut("En cours");
  const aVenir = parStatut("À venir");
  const terminees = parStatut("Terminée");
  const aEncaisser = resteDu(items.filter((item) => item.payload.statut !== "Suspendue"));
  const suivies = items.filter((item) => item.payload.paiements?.length).length;

  // Trois chiffres, pas cinq : ce qui court, ce qui a été signé en tout, ce
  // qui reste à régler. Le détail par statut est dans les groupes dessous.
  return (
    <>
      <Panel className="mt-8 grid grid-cols-2 sm:grid-cols-3">
        <Stat
          label="En cours"
          value={montantOuZero(somme(enCours))}
          hint={`${pluriel(enCours.length)} · HT`}
          tone={enCours.length > 0 ? "attention" : "neutre"}
        />
        <Stat
          label="Total signé"
          value={montantOuZero(somme(items))}
          hint={`${aVenir.length} à venir · ${terminees.length} terminée${terminees.length > 1 ? "s" : ""} · HT`}
        />
        <Stat
          label="Reste à régler"
          value={montantOuZero(aEncaisser)}
          hint={`sur ${pluriel(suivies)} avec échéancier · HT`}
          tone={aEncaisser > 0 ? "attention" : "neutre"}
        />
      </Panel>

      {/* Ce qui court ou arrive est ouvert ; le terminé, le suspendu et
          l'inclassable se replient derrière leur compteur. */}
      {groupes.map((groupe) => (
        <Groupe
          key={groupe.statut}
          titre={groupe.statut}
          count={groupe.items.length}
          aside={`${montantOuZero(somme(groupe.items))} HT`}
          ouvert={groupe.statut === "En cours" || groupe.statut === "À venir"}
        >
          <div className="mt-2 divide-y divide-dark-gray border border-dark-gray">
            {groupe.items.map((item) => (
              <LignePrestation key={item.id} item={item} now={now} admin={admin} base={base(item)} />
            ))}
          </div>
        </Groupe>
      ))}
    </>
  );
}

function LignePrestation({
  item,
  now,
  admin,
  base,
}: {
  item: Prestation;
  now: number;
  admin?: { accompagnement?: (item: Prestation) => ReactNode };
  base: string;
}) {
  const payload = item.payload;
  const prix = formatAmount(payload.montant);
  const debut = payload.debut ? new Date(payload.debut) : null;
  const avancement =
    typeof payload.avancement === "number" ? Math.max(0, Math.min(100, Math.round(payload.avancement * 100))) : null;
  const echeance = payload.statut === "Terminée" ? "neutre" : deadlineTone(item.occurredAt, now);
  const accompagnement = admin?.accompagnement?.(item);

  return (
    <article className="px-4 py-4">
      <header className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div>
          <h2 className="font-inter-tight text-base leading-snug text-foreground">{item.title}</h2>
          {accompagnement || (admin && item.version > 1) ? (
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">
              {accompagnement}
              {admin && item.version > 1 ? `${accompagnement ? " · " : ""}version ${item.version}` : null}
            </p>
          ) : null}
        </div>
        <p className="font-sans text-lg font-light text-foreground">
          {prix ? `${prix} HT` : <span className="text-mid-gray">Tarif non renseigné</span>}
        </p>
      </header>

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        <Tag tone={TONE[payload.statut ?? ""] ?? "neutre"}>{payload.statut ?? SANS_STATUT}</Tag>
        {debut ? <Tag>{`Depuis le ${formatDay(debut)}`}</Tag> : null}
        {item.occurredAt ? <Tag tone={echeance}>{`Livraison ${formatDay(item.occurredAt)}`}</Tag> : null}
      </div>

      {avancement !== null ? (
        <div className="mt-4 max-w-md">
          <div className="flex items-baseline justify-between">
            <Label>Avancement</Label>
            <span className="font-mono text-[11px] text-foreground">{avancement} %</span>
          </div>
          <div
            className="mt-1.5 h-1.5 w-full bg-dark-gray"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={avancement}
            aria-label={`Avancement de ${item.title}`}
          >
            <div className="h-full bg-accent-secondary" style={{ width: `${avancement}%` }} />
          </div>
        </div>
      ) : null}

      {payload.paiements?.length ? <Echeancier item={item} /> : null}

      {payload.devisFichiers?.length ? (
        <Pieces titre="Devis" pieces={payload.devisFichiers} base={base} />
      ) : null}
      {payload.factures?.length ? (
        <Pieces titre={payload.factures.length > 1 ? "Factures" : "Facture"} pieces={payload.factures} base={base} />
      ) : null}

      {payload.detail ? (
        <Repli resume="Détail de la mission" ouvert>{payload.detail}</Repli>
      ) : null}

      {/* Le lien « Devis » ne sert plus qu'à défaut de PDF déposé. */}
      {(payload.devis && !payload.devisFichiers?.length) || admin ? (
        <p className="mt-3 flex flex-wrap gap-4">
          {payload.devis && !payload.devisFichiers?.length ? (
            <LienExterne href={payload.devis}>Voir le devis ↗</LienExterne>
          ) : null}
          {admin ? <LienExterne href={notionHref(item.notionPageId)}>Ouvrir dans Notion ↗</LienExterne> : null}
        </p>
      ) : null}
    </article>
  );
}

/** L'échéancier d'une prestation : chaque règlement, puis réglé et reste dû. */
function Echeancier({ item }: { item: Prestation }) {
  const paiements = item.payload.paiements ?? [];
  const recu = encaisse(item);
  const total = item.payload.montant;
  const reste = typeof total === "number" ? Math.max(0, total - recu) : null;

  // La ligne de synthèse se lit sans ouvrir ; le détail des règlements se déplie.
  return (
    <div className="mt-4 max-w-md">
      <div className="flex items-baseline justify-between gap-4">
        <Label>Règlements</Label>
        <span className="font-mono text-[11px] text-foreground">
          {`${montantOuZero(recu)} réglé${reste !== null ? ` · reste ${montantOuZero(reste)}` : ""}`}
        </span>
      </div>
      {/* Déplié d'emblée : l'échéancier est ce qu'on vient lire ici. */}
      <Repli resume={`Détail des ${paiements.length} règlement${paiements.length > 1 ? "s" : ""}`} ouvert>
      <ul className="mt-1.5 divide-y divide-dark-gray border border-dark-gray">
        {paiements.map((paiement, index) => {
          const estRecu = paiement.statut === "Reçu";
          const date = paiement.date ? new Date(paiement.date) : null;
          const etat = `${estRecu ? "Réglé" : "Prévu"}${date ? ` le ${formatDay(date)}` : ""}`;
          return (
            <li key={index} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
              <span className="font-inter-tight text-sm text-foreground">{paiement.libelle}</span>
              <span className="flex flex-wrap items-center gap-1.5">
                <span className="font-mono text-[11px] text-foreground">
                  {formatAmount(paiement.montant) ?? "Montant non renseigné"}
                </span>
                <Tag tone={estRecu ? "fait" : "neutre"}>{etat}</Tag>
              </span>
            </li>
          );
        })}
      </ul>
      </Repli>
    </div>
  );
}

/** L'adresse de la page dans l'atelier : c'est là qu'une prestation se corrige. */
function notionHref(pageId: string): string {
  return `https://www.notion.so/${pageId.replace(/-/g, "")}`;
}

function LienExterne({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray underline underline-offset-4 transition-colors hover:text-accent-secondary"
    >
      {children}
    </a>
  );
}

/** Les devis ou les factures de la prestation, dans l'ordre où ils ont été déposés. */
export function Pieces({ titre, pieces, base }: { titre: string; pieces: AttachedFile[]; base: string }) {
  return (
    <div className="mt-4 max-w-md">
      <Label>{pieces.length > 1 ? `${titre} · ${pieces.length}` : titre}</Label>
      <ul className="mt-1.5 divide-y divide-dark-gray border border-dark-gray">
        {pieces.map((piece) => (
          <li key={piece.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
            <span className="min-w-0 truncate font-inter-tight text-sm text-foreground">
              {piece.name.replace(/\.pdf$/i, "")}
            </span>
            <LienPdf fichier={piece} base={base}>Ouvrir</LienPdf>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Un devis ou une facture : s'ouvre dans le lecteur PDF du navigateur (la
 * route sert les PDF en `inline`), dans un nouvel onglet pour ne pas perdre
 * l'écran.
 */
export function LienPdf({ fichier, base, children }: { fichier: AttachedFile; base: string; children: ReactNode }) {
  return (
    <a
      href={fichierPath(fichier.id, base)}
      target="_blank"
      rel="noopener"
      title={fichier.name}
      className="font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray underline underline-offset-4 transition-colors hover:text-accent-secondary"
    >
      {children} · PDF {tailleLisible(fichier.size)}
    </a>
  );
}

/** Contrats → Prestations, dans l'espace du client. */
export async function VuePrestations({ viewer, context }: { viewer: Viewer; context: EspaceContext }) {
  const items = await prestationsForClient(viewer.clientId);

  return (
    <Espace
      viewer={viewer}
      context={context}
      active="prestations"
      title="Missions en cours"
    >
      {items.length === 0 ? (
        <EnPreparation>
          Vos prestations apparaîtront ici dès la signature du premier devis, avec leur tarif et leur
          échéancier de règlement.
        </EnPreparation>
      ) : (
        <TableauPrestations items={items} base={() => viewer.base} />
      )}
    </Espace>
  );
}
