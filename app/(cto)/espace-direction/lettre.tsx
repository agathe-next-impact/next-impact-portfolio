import Link from "next/link";
import type { Block, LetterSummary, Span } from "@cto/letters";
import { estRubriqueEnListe, phrasesEnListe } from "@cto/espace";
import { Encadre, PaireEncadres, PuceAudit, registreBox, TableauAudit, type PropositionDeScenario } from "./audit-formes";
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
/** La date d'une lettre telle qu'on la lit : le mois pour une lettre d'atelier, le jour sinon. */
export function dateLettre(lettre: Pick<LetterSummary, "source" | "period">): string {
  return lettre.source === "atelier" ? formatPeriode(lettre.period) : formatJour(lettre.period);
}

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
        if (span.h?.startsWith("/")) {
          // Un lien vers une page de l'espace s'ouvre sur place, pas dans un onglet.
          contenu = (
            <Link href={span.h} className="underline underline-offset-4 transition-colors hover:text-accent-secondary">
              {contenu}
            </Link>
          );
        } else if (span.h) {
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
  propositions,
}: {
  body: Block[];
  large?: boolean;
  base?: string;
  /** Donne une ancre à chaque grand titre, pour un sommaire (cf. `grandsTitres`). */
  ancres?: boolean;
  /** Dans un audit : lie chaque scénario à sa proposition publiée. */
  propositions?: PropositionDeScenario;
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
  // Dans un audit, sous un grand titre d'inventaire (« Architecture et fichiers »).
  let rubriqueEnListe = false;

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

    if (bloc.k === "h1") rubriqueEnListe = large && estRubriqueEnListe(bloc.s);

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
          rendus.push(<PaireEncadres key={index} situation={bloc} solution={suivant} large={large} base={base} propositions={propositions} />);
        } else {
          rendus.push(<Encadre key={index} bloc={bloc} large={large} base={base} propositions={propositions} />);
        }
        break;
      }
      case "table":
        rendus.push(<TableauAudit key={index} bloc={bloc} propositions={propositions} />);
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
      default: {
        // Sur mobile, un paragraphe d'inventaire se lit en liste, un constat
        // par ligne ; à partir de `sm`, il reste le paragraphe écrit.
        const phrases = rubriqueEnListe ? phrasesEnListe(bloc) : null;
        rendus.push(
          <p
            key={index}
            className={`mt-4 font-inter-tight text-[15px] leading-relaxed text-foreground/90 ${phrases ? "hidden sm:block" : ""}`}
          >
            <Texte spans={bloc.s} />
          </p>,
        );
        if (phrases) {
          rendus.push(
            <ul
              key={`${index}-liste`}
              className="mt-4 list-disc space-y-2 pl-5 font-inter-tight text-[15px] leading-relaxed text-foreground/90 sm:hidden"
            >
              {phrases.map((phrase, i) => (
                <li key={i} className="pl-1">
                  {phrase}
                </li>
              ))}
            </ul>,
          );
        }
      }
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
      {/* Empilé : la nature de la lettre, puis sa date, puis le titre. Côte à côte,
          l'étiquette longue écrasait la date sur les cartes étroites. */}
      <div className="flex flex-col items-start gap-2">
        <Tag>{libelleLettre(lettre)}</Tag>
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">
          {lettre.source === "atelier" ? formatPeriode(lettre.period) : formatJour(lettre.period)}
        </p>
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

/** La liste des archives, la plus récente en tête. */
export function ListeLettres({
  lettres,
  base = ESPACE_PATH,
  libelle = "Six derniers mois",
}: {
  lettres: LetterSummary[];
  base?: string;
  /** Le repère au-dessus de la liste : la fenêtre des archives, ou « Les plus récentes ». */
  libelle?: string;
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
      <Label>{libelle}</Label>
      <Panel className="mt-3 divide-y divide-dark-gray">
        {lettres.map((lettre) => (
          <CarteLettre key={lettre.notionPageId} lettre={lettre} base={base} />
        ))}
      </Panel>
    </>
  );
}
