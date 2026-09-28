import Link from "next/link";
import type { ApercuPayload, Deliverable } from "@cto/deliverables";
import { Acces } from "./acces";
import { historiquePath, Nouveaute, sortRecentFirst } from "./livrables";
import { sectionByKey } from "@cto/espace";
import { EnPreparation, Espace, sectionHref, type EspaceContext } from "./shell";
import { buttonClass, formatDay, Label, Panel, Tag } from "./ui";
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
      <h2 className="mt-3 break-words font-inter-tight text-base leading-snug text-foreground">{item.title}</h2>
      {note ? (
        <p className="mt-2 max-w-prose whitespace-pre-line font-inter-tight text-sm leading-relaxed text-mid-gray">
          {note}
        </p>
      ) : null}

      <div className="mt-4 border-t border-dark-gray pt-4">
        <Acces identifiant={identifiant} motDePasse={motDePasse} />
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-x-5">
        {url ? (
          <>
            {/* `noreferrer` : l'adresse de l'espace ne part pas vers le serveur de test. */}
            <a
              href={url}
              target="_blank"
              rel="noreferrer noopener"
              className={`${buttonClass.primary} w-full sm:w-auto sm:shrink-0`}
            >
              {libelles?.ouvrir ?? "Ouvrir ↗"}
            </a>
            <span className="min-w-0 break-all font-mono text-[11px] text-mid-gray">{adresse(url)}</span>
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

/** Combien de versions l'accueil montre ; les autres attendent dans leur section. */
const APERCUS_ACCUEIL = 3;

/**
 * Le bloc « Versions de travail » de l'accueil : la maquette ou le site de test
 * à regarder, ouvrable d'un clic. Les accès (identifiant, mot de passe) restent
 * dans la section, un clic plus loin : l'accueil ne les étale pas.
 */
export function CarteApercus({ viewer, context }: { viewer: Viewer; context: EspaceContext }) {
  const items = sortRecentFirst(context.items.filter((item) => item.kind === "apercu")) as Apercu[];
  if (items.length === 0) return null;
  const section = sectionHref(sectionByKey("apercus"), viewer.base);

  return (
    <section aria-labelledby="apercus-titre" className="mt-10">
      <h2 id="apercus-titre">
        <Label>Versions de travail</Label>
      </h2>
      <Panel className="mt-3 divide-y divide-dark-gray">
        {items.slice(0, APERCUS_ACCUEIL).map((item) => {
          const libelles = item.payload.nature ? NATURES[item.payload.nature] : null;
          return (
            // Sur mobile : étiquettes, puis intitulé, puis bouton pleine largeur.
            // En ligne unique, le libellé long du bouton écrasait l'intitulé.
            <div key={item.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-4 sm:py-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {libelles ? <Tag>{libelles.tag}</Tag> : null}
                  <Nouveaute item={item} since={context.since} />
                  {item.occurredAt ? (
                    <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-mid-gray">
                      {formatDay(item.occurredAt)}
                    </span>
                  ) : null}
                </div>
                <Link
                  href={section}
                  className="mt-2 block break-words font-inter-tight text-sm underline-offset-4 hover:underline"
                >
                  {item.title}
                </Link>
              </div>
              {item.payload.url ? (
                <a
                  href={item.payload.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={`${buttonClass.ghost} w-full sm:w-auto sm:shrink-0`}
                >
                  {libelles?.ouvrir ?? "Ouvrir ↗"}
                </a>
              ) : null}
            </div>
          );
        })}
        <Link
          href={section}
          className="block px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors hover:text-foreground"
        >
          {items.length > APERCUS_ACCUEIL ? `Les ${items.length} versions et leurs accès →` : "Accès et détails →"}
        </Link>
      </Panel>
    </section>
  );
}
