import Link from "next/link";
import type { ApercuPayload, Deliverable } from "@cto/deliverables";
import { Acces } from "./acces";
import { historiquePath, Nouveaute, sortRecentFirst } from "./livrables";
import { EnPreparation, Espace, type EspaceContext } from "./shell";
import { buttonClass, formatDay, Panel, Tag } from "./ui";
import type { Viewer } from "./viewer";

// ─────────────────────────────────────────────────────────────────────────────
// Votre site → Versions de travail : les maquettes et le site en
// développement, chacun avec son lien et l'accès de son adresse de test.
//
// La plus récente en tête. Une version remplacée se retire dans Notion
// (décocher « Publié ») : un lien mort ou un mot de passe changé laissés en
// ligne feraient douter de tout le reste de l'espace.
// ─────────────────────────────────────────────────────────────────────────────

type Apercu = Deliverable<"apercu">;

const NATURES: Record<NonNullable<ApercuPayload["nature"]>, { tag: string; ouvrir: string }> = {
  maquette: { tag: "Maquette", ouvrir: "Ouvrir la maquette ↗" },
  developpement: { tag: "Site en développement", ouvrir: "Ouvrir le site de test ↗" },
};

/** L'adresse sans protocole ni barre finale : ce qu'on reconnaît d'un coup d'œil. */
function adresse(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function CarteApercu({ item, since, base }: { item: Apercu; since: Date | null; base: string }) {
  const { nature, url, identifiant, motDePasse, note } = item.payload;
  const libelles = nature ? NATURES[nature] : null;

  return (
    <article className="px-5 py-5">
      <div className="flex flex-wrap items-center gap-2">
        {libelles ? <Tag>{libelles.tag}</Tag> : null}
        <Nouveaute item={item} since={since} />
        {item.occurredAt ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray">
            {`Mise en ligne le ${formatDay(item.occurredAt)}`}
          </span>
        ) : null}
      </div>
      <h2 className="mt-3 font-inter-tight text-base leading-snug text-foreground">{item.title}</h2>
      {note ? (
        <p className="mt-2 max-w-prose whitespace-pre-line font-inter-tight text-sm leading-relaxed text-mid-gray">
          {note}
        </p>
      ) : null}

      <div className="mt-4 border-t border-dark-gray pt-4">
        <Acces identifiant={identifiant} motDePasse={motDePasse} />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
        {url ? (
          <>
            {/* `noreferrer` : l'adresse de l'espace ne part pas vers le serveur de test. */}
            <a href={url} target="_blank" rel="noreferrer noopener" className={buttonClass.primary}>
              {libelles?.ouvrir ?? "Ouvrir ↗"}
            </a>
            <span className="break-all font-mono text-[11px] text-mid-gray">{adresse(url)}</span>
          </>
        ) : (
          <span className="font-inter-tight text-sm text-mid-gray">Lien pas encore renseigné.</span>
        )}
      </div>

      {item.version > 1 ? (
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray">
          <Link
            href={historiquePath("apercu", item.notionPageId, base)}
            className="underline underline-offset-4 transition-colors hover:text-accent-secondary"
          >
            {`Mis à jour le ${formatDay(item.recordedAt)} · voir les ${item.version} versions`}
          </Link>
        </p>
      ) : null}
    </article>
  );
}

export async function VueApercus({ viewer, context }: { viewer: Viewer; context: EspaceContext }) {
  const items = sortRecentFirst(context.items.filter((item) => item.kind === "apercu")) as Apercu[];

  return (
    <Espace viewer={viewer} context={context} active="apercus" title="Versions de travail">
      {items.length === 0 ? (
        <EnPreparation>
          Les maquettes et le site en développement apparaîtront ici, avec leur lien et leur accès,
          dès la première version mise en ligne.
        </EnPreparation>
      ) : (
        <Panel className="mt-10 divide-y divide-dark-gray">
          {items.map((item) => (
            <CarteApercu key={item.id} item={item} since={context.since} base={viewer.base} />
          ))}
        </Panel>
      )}
    </Espace>
  );
}
