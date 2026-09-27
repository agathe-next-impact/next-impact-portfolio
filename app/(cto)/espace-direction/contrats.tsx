import Link from "next/link";
import { prestationsForClient, type Deliverable } from "@cto/deliverables";
import { sectionByKey } from "@cto/espace";
import { ActionTag, actionMeta, LigneCarte, LigneVide, livrableHref } from "./pilotage";
import { sectionOuverte, type EspaceContext } from "./shell";
import { formatAmount, formatDay, Label, Suite, Tag } from "./ui";
import type { Viewer } from "./viewer";

// ─────────────────────────────────────────────────────────────────────────────
// Le bloc « Contrats » de l'accueil : deux colonnes, jamais mêlées.
//
// À gauche ce qui attend l'accord du client (propositions sans réponse), à
// droite ce qui est signé et court (prestations à venir ou en cours). La
// frontière est la signature : une proposition acceptée n'est plus ici, elle
// revient à droite sous la forme de sa prestation.
// ─────────────────────────────────────────────────────────────────────────────

const LIEN_PIED =
  "block border-t border-dark-gray px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-accent-secondary transition-colors hover:text-foreground";

/** Signées et pas finies : ce que « en cours » veut dire pour le client. */
const EN_COURS = new Set(["En cours", "À venir"]);

export async function CarteContrats({ viewer, context }: { viewer: Viewer; context: EspaceContext }) {
  const avecPropositions = sectionOuverte(context, "propositions");
  const avecMissions = sectionOuverte(context, "prestations");
  if (!avecPropositions && !avecMissions) return null;

  const aValider = context.actions.aValider;
  const missions = avecMissions
    ? (await prestationsForClient(viewer.clientId))
        .filter((item) => EN_COURS.has(item.payload.statut ?? ""))
        .sort((a, b) => (a.occurredAt?.getTime() ?? Infinity) - (b.occurredAt?.getTime() ?? Infinity))
    : [];

  const colonnes = (avecPropositions ? 1 : 0) + (avecMissions ? 1 : 0);

  return (
    <section aria-labelledby="contrats-titre" className="mt-10">
      <h2 id="contrats-titre">
        <Label>Contrats</Label>
      </h2>
      <div
        className={`mt-3 grid border border-dark-gray bg-jet/40 ${
          colonnes === 2 ? "md:grid-cols-2 md:divide-x md:divide-dark-gray max-md:divide-y max-md:divide-dark-gray" : ""
        }`}
      >
        {avecPropositions ? (
          <Colonne
            titre="À valider"
            sousTitre="Propositions qui attendent votre accord"
            nombre={aValider.length}
            pied={{ href: `${viewer.base}/${sectionByKey("propositions").slug}`, label: "Toutes les propositions" }}
          >
            {aValider.length === 0 ? (
              <LigneVide>Aucune proposition en attente de votre réponse.</LigneVide>
            ) : (
              <Plafond
                items={aValider}
                ligne={(action) => (
                  <LigneCarte
                    key={action.id}
                    titre={action.title}
                    href={action.item ? livrableHref(action.item, context, viewer.base) : null}
                    tag={<ActionTag action={action} />}
                    meta={actionMeta(action)}
                  />
                )}
              />
            )}
          </Colonne>
        ) : null}

        {avecMissions ? (
          <Colonne
            titre="En cours"
            sousTitre="Missions signées, en cours ou à venir"
            nombre={missions.length}
            pied={{ href: `${viewer.base}/${sectionByKey("prestations").slug}`, label: "Détail et règlements" }}
          >
            {missions.length === 0 ? (
              <LigneVide>Aucune mission en cours.</LigneVide>
            ) : (
              <Plafond
                items={missions}
                ligne={(item) => (
                  <LigneCarte
                    key={item.id}
                    titre={item.title}
                    href={`${viewer.base}/${sectionByKey("prestations").slug}`}
                    tag={<Tag tone={item.payload.statut === "En cours" ? "attention" : "neutre"}>{item.payload.statut}</Tag>}
                    meta={metaMission(item)}
                    avancement={
                      typeof item.payload.avancement === "number" ? Math.round(item.payload.avancement * 100) : null
                    }
                  />
                )}
              />
            )}
          </Colonne>
        ) : null}
      </div>
    </section>
  );
}

/** Lignes visibles par colonne ; la suite se déplie sur place. */
const VISIBLES = 3;

function Plafond<T>({ items, ligne }: { items: T[]; ligne: (item: T) => React.ReactNode }) {
  return (
    <>
      {items.slice(0, VISIBLES).map(ligne)}
      {items.length > VISIBLES ? (
        <li>
          <Suite count={items.length - VISIBLES}>
            <ul className="divide-y divide-dark-gray border-t border-dark-gray">{items.slice(VISIBLES).map(ligne)}</ul>
          </Suite>
        </li>
      ) : null}
    </>
  );
}

function Colonne({
  titre,
  sousTitre,
  nombre,
  pied,
  children,
}: {
  titre: string;
  sousTitre: string;
  nombre: number;
  pied: { href: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <article className="flex flex-col">
      <header className="border-b border-dark-gray px-4 py-4">
        <p className="flex items-baseline justify-between gap-3 font-sans text-lg font-normal leading-snug text-foreground">
          <span>{titre}</span>
          <span className="font-mono text-sm text-mid-gray">{nombre}</span>
        </p>
        <p className="mt-1 font-inter-tight text-sm text-mid-gray">{sousTitre}</p>
      </header>
      <ul className="divide-y divide-dark-gray">{children}</ul>
      <Link href={pied.href} className={`mt-auto ${LIEN_PIED}`}>
        {pied.label} →
      </Link>
    </article>
  );
}

/** Tarif, livraison et reste à régler : ce qu'on vient chercher sur une mission signée. */
function metaMission(item: Deliverable<"prestation">): string | null {
  const payload = item.payload;
  const regle = (payload.paiements ?? [])
    .filter((paiement) => paiement.statut === "Reçu")
    .reduce((total, paiement) => total + (paiement.montant ?? 0), 0);
  const reste =
    payload.paiements?.length && typeof payload.montant === "number" ? Math.max(0, payload.montant - regle) : null;
  const morceaux = [
    formatAmount(payload.montant) ? `${formatAmount(payload.montant)} HT` : null,
    item.occurredAt ? `livraison ${formatDay(item.occurredAt)}` : null,
    reste !== null ? (reste > 0 ? `reste ${formatAmount(reste)}` : "réglée") : null,
  ].filter(Boolean);
  return morceaux.length > 0 ? morceaux.join(" · ") : null;
}
