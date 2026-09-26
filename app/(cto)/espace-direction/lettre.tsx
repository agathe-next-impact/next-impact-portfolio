import Link from "next/link";
import type { Block, LetterSummary, Span } from "@cto/letters";
import { Encadre, PaireEncadres, PuceAudit, registreBox, TableauAudit } from "./audit-formes";
import { Label, Panel, Tag } from "./ui";
import { fichierPath } from "./livrables";
import { ESPACE_PATH } from "./session";

// ─────────────────────────────────────────────────────────────────────────────
// Les lettres de veille — affichage.
//
// Le corps arrive en blocs typés depuis la base (cf. `src/cto/notion/blocks.ts`),
// jamais en HTML ni en Markdown. Il n'y a donc ici ni `dangerouslySetInnerHTML`
// ni analyseur : chaque bloc est un composant, et une forme inconnue ne peut pas
// s'afficher de travers puisqu'elle n'existe pas dans le type.
//
// La typographie est celle d'un texte long, pas celle d'un tableau de bord :
// mesure de ligne courte, interlignage généreux, titres discrets. Un dirigeant
// lit cette lettre en entier ou pas du tout.
// ─────────────────────────────────────────────────────────────────────────────

export const LETTRES_PATH = `${ESPACE_PATH}/lettres`;

/** Les archives de la veille, sous la base de l'espace (client ou vue admin). */
export function lettresPath(base: string = ESPACE_PATH): string {
  return `${base}/lettres`;
}

const SCOPE_LABELS: Record<LetterSummary["scope"], string> = {
  generale: "Lettre générale",
  sectorielle: "Lettre sectorielle",
  personnalisee: "Lettre personnalisée",
};

/** Le mois d'une édition. Sans le jour : une lettre couvre un mois, pas une date. */
export function formatPeriode(date: Date | null): string {
  if (!date) return "—";
  const brut = new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).format(date);
  return brut.charAt(0).toUpperCase() + brut.slice(1);
}

/** Le jour d'une édition hebdomadaire ou bimensuelle, qui ne couvre pas un mois entier. */
function formatJour(date: Date | null): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).format(date);
}

/** Ce qu'est la lettre, en un mot : sa veille d'origine avant sa portée. */
export function libelleLettre(lettre: Pick<LetterSummary, "source" | "label" | "scope">): string {
  if (lettre.source === "sentinelle") return "Veille technique";
  if (lettre.source === "signaux-faibles") return `Signaux faibles${lettre.label ? ` · ${lettre.label}` : ""}`;
  return SCOPE_LABELS[lettre.scope];
}

export function Texte({ spans }: { spans: Span[] }) {
  return (
    <>
      {spans.map((span, index) => {
        let contenu = <>{span.t}</>;
        if (span.c) contenu = <code className="bg-jet/60 px-1 py-0.5 text-[0.9em]">{contenu}</code>;
        if (span.b) contenu = <strong className="font-medium text-foreground">{contenu}</strong>;
        if (span.i) contenu = <em>{contenu}</em>;
        if (span.h) {
          contenu = (
            <a
              href={span.h}
              target="_blank"
              rel="noreferrer noopener"
              className="underline underline-offset-4 transition-colors hover:text-accent-secondary"
            >
              {contenu}
            </a>
          );
        }
        return <span key={index}>{contenu}</span>;
      })}
    </>
  );
}

const ancreTitre = (index: number) => `titre-${index}`;

/** Les grands titres d'un corps, avec l'ancre que `CorpsLettre ancres` leur donne. */
export function grandsTitres(body: Block[]): { id: string; texte: string }[] {
  return body.flatMap((bloc, index) =>
    bloc.k === "h1" ? [{ id: ancreTitre(index), texte: bloc.s.map((span) => span.t).join("").trim() }] : [],
  );
}

/**
 * Le corps d'une lettre.
 *
 * Les puces consécutives sont regroupées en une seule liste : Notion les livre
 * une par une, et les rendre séparément produirait autant de listes d'un élément,
 * avec les espacements qui vont avec.
 *
 * Sert aussi au corps d'un audit, qui ajoute trois formes (encadré, tableau,
 * image) : `large` lève la mesure de ligne, qu'un tableau à six colonnes ne
 * tient pas, et `base` situe les images sous l'espace courant (client ou admin).
 */
export function CorpsLettre({
  body,
  large = false,
  base = ESPACE_PATH,
  ancres = false,
}: {
  body: Block[];
  large?: boolean;
  base?: string;
  /** Donne une ancre à chaque grand titre, pour un sommaire (cf. `grandsTitres`). */
  ancres?: boolean;
}) {
  const rendus: React.ReactNode[] = [];
  let liste: { ordonnee: boolean; items: Span[][] } | null = null;

  const viderListe = (cle: number) => {
    if (!liste) return;
    const Tag_ = liste.ordonnee ? "ol" : "ul";
    rendus.push(
      <Tag_
        key={`l${cle}`}
        className={`mt-4 space-y-2 pl-5 font-inter-tight text-[15px] leading-relaxed text-foreground/90 ${
          liste.ordonnee ? "list-decimal" : "list-disc"
        }`}
      >
        {liste.items.map((spans, index) => (
          <li key={index} className="pl-1">
            {large ? <PuceAudit spans={spans} /> : <Texte spans={spans} />}
          </li>
        ))}
      </Tag_>,
    );
    liste = null;
  };

  // Un encadré « situation » suivi d'un encadré « solutions » : rendus en paire.
  const apparie = new Set<number>();

  body.forEach((bloc, index) => {
    if (apparie.has(index)) return;
    if (bloc.k === "li" || bloc.k === "oli") {
      const ordonnee = bloc.k === "oli";
      if (!liste || liste.ordonnee !== ordonnee) {
        viderListe(index);
        liste = { ordonnee, items: [] };
      }
      liste.items.push(bloc.s);
      return;
    }

    viderListe(index);

    switch (bloc.k) {
      case "h1":
        rendus.push(
          <h2
            key={index}
            id={ancres ? ancreTitre(index) : undefined}
            className="mt-10 scroll-mt-8 font-sans text-xl font-light text-foreground"
          >
            <Texte spans={bloc.s} />
          </h2>,
        );
        break;
      case "h2":
        rendus.push(
          <h3 key={index} className="mt-9 font-sans text-lg font-light text-foreground">
            <Texte spans={bloc.s} />
          </h3>,
        );
        break;
      case "h3":
        rendus.push(
          <h4
            key={index}
            className="mt-7 font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray"
          >
            <Texte spans={bloc.s} />
          </h4>,
        );
        break;
      case "quote":
      case "callout":
        rendus.push(
          <blockquote
            key={index}
            className="mt-5 border-l-2 border-l-accent-secondary pl-4 font-inter-tight text-[15px] leading-relaxed text-foreground"
          >
            <Texte spans={bloc.s} />
          </blockquote>,
        );
        break;
      case "hr":
        rendus.push(<hr key={index} className="mt-9 border-dark-gray" />);
        break;
      case "code":
        rendus.push(
          <pre
            key={index}
            className="mt-5 overflow-x-auto border border-dark-gray bg-jet/40 p-4 font-mono text-xs text-foreground"
          >
            {bloc.t}
          </pre>,
        );
        break;
      case "box": {
        const suivant = body[index + 1];
        if (large && registreBox(bloc) === "situation" && suivant?.k === "box" && registreBox(suivant) === "solution") {
          apparie.add(index + 1);
          rendus.push(<PaireEncadres key={index} situation={bloc} solution={suivant} large={large} base={base} />);
        } else {
          rendus.push(<Encadre key={index} bloc={bloc} large={large} base={base} />);
        }
        break;
      }
      case "table":
        rendus.push(<TableauAudit key={index} bloc={bloc} />);
        break;
      case "img":
        rendus.push(
          <figure key={index} className="mt-6">
            {/* Servie par la route des pièces jointes, qui vérifie session ET
                appartenance : pas de next/image, dont l'optimiseur ne porte
                pas les cookies de l'espace. */}
            <img
              src={fichierPath(bloc.f, base)}
              alt={bloc.alt}
              loading="lazy"
              className={`${large ? "h-auto w-full" : "max-w-full"} border border-dark-gray`}
            />
            {bloc.alt ? (
              <figcaption className="mt-2 font-inter-tight text-xs text-mid-gray">{bloc.alt}</figcaption>
            ) : null}
          </figure>,
        );
        break;
      default:
        rendus.push(
          <p
            key={index}
            className="mt-4 font-inter-tight text-[15px] leading-relaxed text-foreground/90"
          >
            <Texte spans={bloc.s} />
          </p>,
        );
    }
  });

  viderListe(body.length);

  return <div className={large ? undefined : "max-w-[68ch]"}>{rendus}</div>;
}

/** Une lettre en carte : ce qu'il faut pour décider de l'ouvrir, et rien de plus. */
export function CarteLettre({
  lettre,
  principale = false,
  base = ESPACE_PATH,
}: {
  lettre: LetterSummary;
  principale?: boolean;
  base?: string;
}) {
  return (
    <article className={principale ? "px-5 py-6" : "px-5 py-5"}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">
          {lettre.source === "atelier" ? formatPeriode(lettre.period) : formatJour(lettre.period)}
        </p>
        <Tag>{libelleLettre(lettre)}</Tag>
      </div>

      <h3
        className={`mt-2 font-sans font-light leading-snug text-foreground ${
          principale ? "text-xl" : "text-base"
        }`}
      >
        {lettre.title}
      </h3>

      {lettre.chapo ? (
        <p
          className={`mt-3 font-inter-tight leading-relaxed text-mid-gray ${
            principale ? "text-[15px]" : "line-clamp-2 text-sm"
          }`}
        >
          {lettre.chapo}
        </p>
      ) : null}

      <div className="mt-4">
        <Link
          href={`${lettresPath(base)}/${lettre.notionPageId}`}
          className="font-mono text-[11px] uppercase tracking-[0.14em] text-foreground underline underline-offset-4 transition-colors hover:text-accent-secondary"
        >
          Lire la lettre →
        </Link>
      </div>
    </article>
  );
}

/**
 * Le bloc « veille » de l'accueil : la dernière lettre, et le chemin des archives.
 *
 * Une seule lettre en avant. Le client vient lire celle du mois ; lui en
 * présenter six revient à ne rien mettre en avant du tout.
 */
export function DerniereLettre({
  lettres,
  base = ESPACE_PATH,
}: {
  lettres: LetterSummary[];
  base?: string;
}) {
  if (lettres.length === 0) return null;

  const [derniere, ...archives] = lettres;

  return (
    <section className="mt-12">
      <div className="flex items-baseline justify-between gap-4 border-b border-dark-gray pb-3">
        <h2 className="font-sans text-lg font-light text-foreground">Votre veille</h2>
        {archives.length > 0 ? (
          <Link
            href={lettresPath(base)}
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray transition-colors hover:text-accent-secondary"
          >
            Archives · {archives.length + 1} éditions →
          </Link>
        ) : null}
      </div>
      <Panel className="mt-5">
        <CarteLettre lettre={derniere} principale base={base} />
      </Panel>
    </section>
  );
}

/** La liste des archives, la plus récente en tête. */
export function ListeLettres({
  lettres,
  base = ESPACE_PATH,
}: {
  lettres: LetterSummary[];
  base?: string;
}) {
  if (lettres.length === 0) {
    return (
      <Panel className="mt-6 px-5 py-6">
        <p className="font-inter-tight text-base text-mid-gray">
          Aucune lettre publiée pour l'instant.
        </p>
      </Panel>
    );
  }

  return (
    <>
      <Label>Six derniers mois</Label>
      <Panel className="mt-3 divide-y divide-dark-gray">
        {lettres.map((lettre) => (
          <CarteLettre key={lettre.notionPageId} lettre={lettre} base={base} />
        ))}
      </Panel>
    </>
  );
}
