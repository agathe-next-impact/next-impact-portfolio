import type { Block } from "@cto/letters";
import { lireSynthese, type Fiche, type Gravite, type Rubrique, type Severites } from "@cto/espace";
import { CorpsLettre, Texte } from "./lettre";
import { formatAmount, Label } from "./ui";

// ─────────────────────────────────────────────────────────────────────────────
// La synthèse d'un audit, mise en page.
//
// La lecture (fiches, rubriques, phases, gravités) est dans
// `@cto/espace/synthese`, pure et testée. Ici, la forme, pensée pour qu'un
// dirigeant ait l'essentiel avant la réunion de restitution :
//
//  1. les fiches de la mission (site, auteur, rendez-vous) en bandeau ;
//  2. les constats par gravité, en barre — combien, et combien de graves ;
//  3. les rubriques côte à côte, chaque puce avec son titre détaché ;
//  4. la roadmap en phases, montant aligné à droite.
//
// Une synthèse qui ne suit pas cette forme retombe sur le rendu bloc par bloc.
// ─────────────────────────────────────────────────────────────────────────────

const GRAVITE_FOND: Record<Gravite, string> = {
  critique: "bg-[#ff8a7a]",
  eleve: "bg-[#f2c94c]",
  modere: "bg-accent-secondary/70",
  faible: "bg-mid-gray/50",
};

const GRAVITE_TEXTE: Record<Gravite, string> = {
  critique: "text-[#ff8a7a]",
  eleve: "text-[#f2c94c]",
  modere: "text-foreground",
  faible: "text-foreground",
};

/** P0 brûle, P1 approche, le reste suit. */
function phaseClass(code: string): string {
  if (code === "P0") return "border-[#ff8a7a]/60 text-[#ff8a7a]";
  if (code === "P1") return "border-[#f2c94c]/60 text-[#f2c94c]";
  return "border-dark-gray text-foreground";
}

function Fiches({ fiches }: { fiches: Fiche[] }) {
  return (
    <dl className="mt-6 grid gap-px border border-dark-gray bg-dark-gray sm:grid-cols-2 xl:grid-cols-4">
      {fiches.map((fiche) => {
        const [seul] = fiche.valeur;
        // Un rendez-vous à réserver est une action, pas une adresse à lire.
        const reservation = fiche.valeur.length === 1 && seul.h && /calendly\.com/.test(seul.h);
        return (
          <div key={fiche.label} className="bg-obsidian px-5 py-4">
            <dt>
              <Label>{fiche.label}</Label>
            </dt>
            <dd className="mt-2 break-words font-inter-tight text-sm leading-relaxed text-foreground">
              {reservation ? (
                <a
                  href={seul.h}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex border border-accent-secondary bg-accent-secondary px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-obsidian hover:opacity-90"
                >
                  Réserver ce rendez-vous ↗
                </a>
              ) : (
                <Texte spans={fiche.valeur} />
              )}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

function Gravites({ severites }: { severites: Severites }) {
  const somme = severites.niveaux.reduce((total, niveau) => total + niveau.n, 0);
  const total = severites.total ?? somme;

  return (
    <div className="mt-6 border border-dark-gray bg-jet/40 px-5 py-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <p className="font-sans text-3xl font-light text-foreground">
          {total} <span className="text-lg text-mid-gray">{total > 1 ? "constats" : "constat"}</span>
        </p>
        <Label>Répartition par gravité</Label>
      </div>
      <div className="mt-4 flex h-3 w-full gap-0.5" role="img" aria-label={severites.niveaux.map((n) => `${n.n} ${n.label.toLowerCase()}`).join(", ")}>
        {severites.niveaux.map((niveau) =>
          niveau.n > 0 ? (
            <span key={niveau.gravite} className={GRAVITE_FOND[niveau.gravite]} style={{ width: `${(niveau.n / somme) * 100}%` }} />
          ) : null,
        )}
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {severites.niveaux.map((niveau) => (
          <div key={niveau.gravite}>
            <dt className="flex items-center gap-2">
              <span aria-hidden className={`h-2 w-2 ${GRAVITE_FOND[niveau.gravite]}`} />
              <Label>{niveau.label}</Label>
            </dt>
            <dd className={`mt-1 font-sans text-2xl font-light tabular-nums ${GRAVITE_TEXTE[niveau.gravite]}`}>{niveau.n}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function CarteRubrique({ rubrique, base }: { rubrique: Rubrique; base: string }) {
  const nombre = rubrique.phases?.length ?? rubrique.points.length;

  return (
    <article className="flex flex-col border border-dark-gray bg-jet/40">
      <header className="flex items-baseline justify-between gap-4 border-b border-dark-gray px-5 py-4">
        <h3 className="font-sans text-lg font-normal text-foreground">{rubrique.titre}</h3>
        {nombre > 0 ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-mid-gray">
            {nombre} {rubrique.phases ? (nombre > 1 ? "phases" : "phase") : nombre > 1 ? "points" : "point"}
          </span>
        ) : null}
      </header>

      {rubrique.phases ? (
        <ol className="divide-y divide-dark-gray">
          {rubrique.phases.map((phase) => (
            <li key={phase.code} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-4 px-5 py-4">
              <span className={`border px-2 py-1 font-mono text-xs ${phaseClass(phase.code)}`}>{phase.code}</span>
              <div className="min-w-0">
                {phase.delai ? <Label>{phase.delai}</Label> : null}
                <p className={`font-inter-tight text-[15px] leading-relaxed text-foreground ${phase.delai ? "mt-1" : ""}`}>
                  {phase.texte.charAt(0).toUpperCase() + phase.texte.slice(1)}
                </p>
              </div>
              <span className="font-sans text-lg font-light tabular-nums text-foreground">
                {formatAmount(phase.montant) ?? "—"}
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <ul className="divide-y divide-dark-gray">
          {rubrique.points.map((point, index) => (
            <li key={index} className="px-5 py-4">
              {point.titre ? (
                <>
                  <p className="font-inter-tight text-[15px] font-medium leading-snug text-foreground">{point.titre}</p>
                  {point.texte.length > 0 ? (
                    <p className="mt-1.5 font-inter-tight text-sm leading-relaxed text-mid-gray">
                      <Texte spans={point.texte} />
                    </p>
                  ) : null}
                </>
              ) : (
                <p className="font-inter-tight text-[15px] leading-relaxed text-foreground/90">
                  <Texte spans={point.texte} />
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      {rubrique.autres.length > 0 ? (
        <div className="px-5 pb-5">
          <CorpsLettre body={rubrique.autres} large base={base} />
        </div>
      ) : null}
    </article>
  );
}

export function SyntheseAudit({ blocks, base }: { blocks: Block[]; base: string }) {
  const synthese = lireSynthese(blocks);
  if (!synthese) return <CorpsLettre body={blocks} large base={base} />;

  const colonnes =
    synthese.rubriques.length >= 3 ? "lg:grid-cols-2 2xl:grid-cols-3" : synthese.rubriques.length === 2 ? "lg:grid-cols-2" : "";

  return (
    <>
      {synthese.fiches.length > 0 ? <Fiches fiches={synthese.fiches} /> : null}
      {synthese.severites ? <Gravites severites={synthese.severites} /> : null}
      <div className={`mt-6 grid items-start gap-4 ${colonnes}`}>
        {synthese.rubriques.map((rubrique) => (
          <CarteRubrique key={rubrique.titre} rubrique={rubrique} base={base} />
        ))}
      </div>
      {synthese.reste.length > 0 ? <CorpsLettre body={synthese.reste} large base={base} /> : null}
    </>
  );
}
