import Link from "next/link";
import { sectionByKey } from "@cto/espace";
import { sentinelleStateFor } from "@cto/sentinelle";
import { EnPreparation, Espace, sectionHref, sectionOuverte, type EspaceContext } from "./shell";
import { formatDay, Label, Legende, Notice, Panel, Stat, Tag } from "./ui";
import type { Viewer } from "./viewer";

// ─────────────────────────────────────────────────────────────────────────────
// La fiche technique : de quoi le site est fait, composant par composant.
//
// Elle vit sous « Votre site » (elle répond à « comment va mon site ? ») et non
// plus au milieu de la veille technique, dont elle n'est que l'inventaire. Les
// alertes qui concernent un composant restent dans la veille ; ici, chaque
// ligne dit seulement si une alerte est ouverte, avec un renvoi.
//
// Tout vient du dernier export Sentinelle rangé par le balayage
// (`cto_sentinelle_snapshots`) : la page ne parle jamais à Sentinelle pendant
// une requête.
// ─────────────────────────────────────────────────────────────────────────────

/** Les familles de composants du scanner, dans l'ordre où on les lit. */
const FAMILLES: { type: string; libelle: string }[] = [
  { type: "cms", libelle: "Plateforme" },
  { type: "ecommerce", libelle: "E-commerce" },
  { type: "framework", libelle: "Framework" },
  { type: "cms_theme", libelle: "Thème" },
  { type: "cms_plugin", libelle: "Extensions" },
  { type: "js_library", libelle: "Bibliothèques JavaScript" },
  { type: "runtime", libelle: "Langage serveur" },
  { type: "server", libelle: "Serveur" },
  { type: "hosting", libelle: "Hébergement" },
  { type: "cdn", libelle: "Réseau de diffusion" },
  { type: "analytics", libelle: "Mesure d'audience" },
];

const AUTRES = "Autres composants";

function libelleFamille(type: string): string {
  return FAMILLES.find((famille) => famille.type === type)?.libelle ?? AUTRES;
}

function rangFamille(libelle: string): number {
  const rang = FAMILLES.findIndex((famille) => famille.libelle === libelle);
  return rang === -1 ? FAMILLES.length : rang;
}

/** « https://www.exemple.fr/ » → « exemple.fr » : de quoi reconnaître un site d'un coup d'œil. */
function nomDuSite(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
}

export async function VueFicheTechnique({ viewer, context }: { viewer: Viewer; context: EspaceContext }) {
  const state = await sentinelleStateFor(viewer.clientId);

  if (!state) {
    return (
      <Espace viewer={viewer} context={context} active="fiche-technique" title="Fiche technique">
        <EnPreparation>
          La surveillance de votre site est en cours de mise en place. La fiche technique, de quoi votre site est
          fait, apparaîtra ici après le premier relevé.
        </EnPreparation>
      </Espace>
    );
  }

  const { data } = state;
  const composants = data.stack.components;
  const sites = [...new Set(composants.map((composant) => composant.site ?? data.client.siteUrl))];
  const avecAlerte = composants.filter((composant) => composant.openAlerts > 0).length;
  const veilleOuverte = sectionOuverte(context, "veille-technique");
  const lienVeille = veilleOuverte ? sectionHref(sectionByKey("veille-technique"), viewer.base) : null;

  return (
    <Espace viewer={viewer} context={context} active="fiche-technique" title="Fiche technique">
      {state.error ? (
        <div className="mt-6">
          <Notice tone="erreur">
            Le dernier relevé n&rsquo;a pas pu être mis à jour. Les informations ci-dessous datent du{" "}
            {formatDay(state.fetchedAt)}.
          </Notice>
        </div>
      ) : null}

      <p className="mt-6 max-w-prose font-inter-tight text-sm text-mid-gray">
        Ce que la surveillance connaît de votre site, relevé depuis ses éléments publics. Les extensions qui ne se
        chargent qu&rsquo;en administration, la version de PHP ou l&rsquo;hébergeur ne se voient pas de l&rsquo;extérieur :
        une version fausse ou un composant absent, dites-le moi et je corrige la fiche.
      </p>

      <Panel className="mt-8 grid grid-cols-2 sm:grid-cols-4">
        <Stat label="Composants suivis" value={String(composants.length)} />
        <Stat
          label="Sans version connue"
          value={String(data.stack.withoutVersion)}
          tone={data.stack.withoutVersion > 0 ? "attention" : "neutre"}
          hint={data.stack.withoutVersion > 0 ? "la veille ne peut pas les juger" : undefined}
        />
        <Stat
          label="Alertes ouvertes"
          value={String(avecAlerte)}
          tone={avecAlerte > 0 ? "alerte" : "neutre"}
          hint={avecAlerte > 0 ? `composant${avecAlerte > 1 ? "s" : ""} concerné${avecAlerte > 1 ? "s" : ""}` : undefined}
        />
        <Stat label={sites.length > 1 ? "Sites surveillés" : "Site surveillé"} value={String(sites.length)} />
      </Panel>

      {composants.length === 0 ? (
        <Panel className="mt-10 px-5 py-6">
          <p className="font-inter-tight text-base text-mid-gray">Aucun composant relevé pour l&rsquo;instant.</p>
        </Panel>
      ) : (
        sites.map((site) => {
          const duSite = composants.filter((composant) => (composant.site ?? data.client.siteUrl) === site);
          const familles = [...new Set(duSite.map((composant) => libelleFamille(composant.type)))].sort(
            (a, b) => rangFamille(a) - rangFamille(b),
          );

          return (
            <section key={site} aria-labelledby={`site-${nomDuSite(site)}`} className="mt-10">
              <Legende id={`site-${nomDuSite(site)}`}>{`${nomDuSite(site)} (${duSite.length})`}</Legende>
              <Panel className="divide-y divide-dark-gray">
                {familles.map((famille) => (
                  <div key={famille} className="px-5 py-4">
                    <Label>{famille}</Label>
                    <ul className="mt-2 divide-y divide-dark-gray">
                      {duSite
                        .filter((composant) => libelleFamille(composant.type) === famille)
                        .map((composant) => (
                          <li
                            key={`${composant.type}-${composant.slug}`}
                            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2"
                          >
                            <p className="font-inter-tight text-[15px] text-foreground">{composant.label}</p>
                            <p className="flex items-baseline gap-3 font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">
                              {composant.openAlerts > 0 ? (
                                lienVeille ? (
                                  <Link href={lienVeille} className="hover:text-foreground">
                                    <Tag tone="alerte">
                                      {composant.openAlerts} alerte{composant.openAlerts > 1 ? "s" : ""}
                                    </Tag>
                                  </Link>
                                ) : (
                                  <Tag tone="alerte">
                                    {composant.openAlerts} alerte{composant.openAlerts > 1 ? "s" : ""}
                                  </Tag>
                                )
                              ) : null}
                              <span>{composant.version ? `version ${composant.version}` : "version inconnue"}</span>
                            </p>
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </Panel>
            </section>
          );
        })
      )}

      <p className="mt-6 font-inter-tight text-xs text-mid-gray">
        Relevé du {formatDay(state.fetchedAt)}
        {lienVeille ? (
          <>
            {" "}
            ·{" "}
            <Link href={lienVeille} className="underline underline-offset-4 hover:text-foreground">
              Alertes et fins de support dans la veille technique
            </Link>
          </>
        ) : null}
      </p>
    </Espace>
  );
}
