import { reglageClient, SERVICES, STATUTS, TIERS, type ReglageClient } from "@cto/admin";
import { BoutonEnvoi } from "../../../../bouton-envoi";
import { buttonClass, inputClass, Label, Panel, Tag } from "../../../../espace-direction/ui";
import {
  ajouterPersonne,
  ajouterSite,
  enregistrerSite,
  lancerScan,
  majCoordonnees,
  majServices,
  retirerSite,
} from "../../actions-clients";
import { ChampsSite } from "../../champs-site";

// ─────────────────────────────────────────────────────────────────────────────
// L'administration d'un client depuis l'admin : coordonnées, services, sites,
// lancement du scan Sentinelle.
//
// Un client piloté par Notion (fiche Notion) s'y affiche en lecture seule : le
// modifier ici serait écrasé à la prochaine synchro. Un client créé depuis
// l'admin est modifiable partout. (Les personnes se gèrent dans la section
// « Personnes » de la fiche.)
// ─────────────────────────────────────────────────────────────────────────────

const etiquette = "font-mono text-[10px] uppercase tracking-[0.1em] text-mid-gray";

function NoteNotion() {
  return (
    <Panel className="border-l-2 border-l-accent-secondary p-4">
      <Label>Piloté par Notion</Label>
      <p className="mt-2 max-w-prose font-inter-tight text-sm text-mid-gray">
        Ce client a une fiche dans l&rsquo;atelier Notion : ses services, ses coordonnées, ses personnes et ses sites
        se modifient là-bas, puis « Synchroniser ». Ce qui suit est en lecture seule.
      </p>
    </Panel>
  );
}

export async function Administration({ clientId }: { clientId: string }) {
  const reglage = await reglageClient(clientId);
  if (!reglage) return null;
  const { local } = reglage;
  const services = new Set(reglage.services ?? []);

  return (
    <section className="mt-10 space-y-10">
      <header>
        <h2 className="font-sans text-xl font-light text-foreground">Administration de l&rsquo;espace</h2>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Tag tone={local ? "fait" : "neutre"}>{local ? "Créé depuis l'admin" : "Piloté par Notion"}</Tag>
          {reglage.sentinelleClientId ? <Tag>Sentinelle reliée</Tag> : <Tag tone="attention">Sentinelle non reliée</Tag>}
        </div>
      </header>

      {local ? null : <NoteNotion />}

      <Coordonnees reglage={reglage} />

      <section>
        <Label>Services</Label>
        <form action={majServices} className="mt-3">
          <input type="hidden" name="clientId" value={reglage.id} />
          <Panel className="grid gap-3 p-5 sm:grid-cols-2">
            {SERVICES.map((service) => (
              <label key={service.code} className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="services"
                  value={service.code}
                  defaultChecked={services.has(service.code)}
                  disabled={!local}
                  className="mt-1"
                />
                <span>
                  <span className="font-inter-tight text-sm text-foreground">{service.label}</span>
                  <span className="block font-inter-tight text-xs text-mid-gray">{service.hint}</span>
                </span>
              </label>
            ))}
          </Panel>
          {local ? (
            <div className="mt-3">
              <BoutonEnvoi className={buttonClass.primary} enCours="Enregistrement…">
                Enregistrer les services
              </BoutonEnvoi>
              <p className="mt-2 max-w-prose font-inter-tight text-xs text-mid-gray">
                Cocher ouvre la section dans l&rsquo;espace du client, décocher la ferme. Rien n&rsquo;est supprimé : ce
                qui a été publié revient si le service est réactivé.
              </p>
            </div>
          ) : null}
        </form>
      </section>

      <Sites reglage={reglage} />

      <section>
        <Label>Sentinelle</Label>
        <Panel className="mt-3 flex flex-wrap items-center justify-between gap-4 p-5">
          <p className="max-w-prose font-inter-tight text-sm text-mid-gray">
            Crée ou aligne le client chez Sentinelle et relance l&rsquo;analyse de tous ses sites.{" "}
            {local
              ? "Site principal : le premier site « Veille technique » ; contact : la première personne dont l'accès est ouvert."
              : "Site principal et contact : ceux de sa fiche Notion (Site surveillé, Contact veille)."}{" "}
            Les composants détectés arrivent en quelques minutes. Désactiver le service ou clore le client désactive aussi
            sa veille chez Sentinelle.
          </p>
          <form action={lancerScan}>
            <input type="hidden" name="clientId" value={reglage.id} />
            <BoutonEnvoi className={buttonClass.primary} enCours="Lancement…">
              Lancer le scan Sentinelle
            </BoutonEnvoi>
          </form>
        </Panel>
      </section>

      {local ? <AjoutPersonne clientId={reglage.id} /> : null}
    </section>
  );
}

function Coordonnees({ reglage }: { reglage: ReglageClient }) {
  return (
    <section>
      <Label>Coordonnées et statut</Label>
      <form action={majCoordonnees} className="mt-3">
        <input type="hidden" name="clientId" value={reglage.id} />
        <Panel className="grid gap-4 p-5 sm:grid-cols-3">
          <label className="sm:col-span-3">
            <span className={etiquette}>Raison sociale</span>
            <input name="company" defaultValue={reglage.company} disabled={!reglage.local} className={`${inputClass} mt-1`} />
          </label>
          <label>
            <span className={etiquette}>Palier</span>
            <select name="tier" defaultValue={reglage.tier} disabled={!reglage.local} className={`${inputClass} mt-1`}>
              {TIERS.map((tier) => (
                <option key={tier.code} value={tier.code}>
                  {tier.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className={etiquette}>Statut</span>
            <select name="status" defaultValue={reglage.status} disabled={!reglage.local} className={`${inputClass} mt-1`}>
              {STATUTS.map((statut) => (
                <option key={statut.code} value={statut.code}>
                  {statut.label}
                </option>
              ))}
            </select>
          </label>
        </Panel>
        {reglage.local ? (
          <div className="mt-3">
            <BoutonEnvoi className={buttonClass.ghost} enCours="Enregistrement…">
              Enregistrer
            </BoutonEnvoi>
          </div>
        ) : null}
      </form>
    </section>
  );
}

function Sites({ reglage }: { reglage: ReglageClient }) {
  return (
    <section>
      <Label>Sites ({reglage.sites.length})</Label>
      <div className="mt-3 divide-y divide-dark-gray border border-dark-gray">
        {reglage.sites.length === 0 ? (
          <p className="px-5 py-6 font-inter-tight text-sm text-mid-gray">Aucun site associé.</p>
        ) : null}

        {reglage.sites.map((site) =>
          reglage.local && site.origine === "admin" ? (
            <div key={site.id} className="p-5">
              <form action={enregistrerSite}>
                <input type="hidden" name="clientId" value={reglage.id} />
                <input type="hidden" name="siteId" value={site.id} />
                <ChampsSite n={0} valeurs={site} />
                <div className="mt-3 flex flex-wrap gap-3">
                  <BoutonEnvoi className={buttonClass.ghost} enCours="Enregistrement…">
                    Enregistrer ce site
                  </BoutonEnvoi>
                </div>
              </form>
              <form action={retirerSite} className="mt-2">
                <input type="hidden" name="clientId" value={reglage.id} />
                <input type="hidden" name="siteId" value={site.id} />
                <BoutonEnvoi className={buttonClass.quiet} enCours="Retrait…">
                  Retirer ce site
                </BoutonEnvoi>
              </form>
            </div>
          ) : (
            <div key={site.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div>
                <p className="font-inter-tight text-base text-foreground">{site.name}</p>
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">{site.url}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Tag>{site.origine === "notion" ? "Base Notion Sites" : "Admin"}</Tag>
                {site.wpUmbrellaProjectId ? <Tag>WP Umbrella {site.wpUmbrellaProjectId}</Tag> : <Tag tone="attention">Sans supervision</Tag>}
                {site.watch ? <Tag tone="fait">Veille</Tag> : null}
                {site.suiviFormule ? <Tag>Suivi {site.suiviFormule}</Tag> : null}
                {site.sansSuivi ? <Tag>Sans suivi</Tag> : null}
              </div>
            </div>
          ),
        )}
      </div>

      {reglage.local ? (
        <form action={ajouterSite} className="mt-4">
          <input type="hidden" name="clientId" value={reglage.id} />
          <Panel className="p-5">
            <Label>Ajouter un site</Label>
            <div className="mt-3">
              <ChampsSite n={0} />
            </div>
            <div className="mt-3">
              <BoutonEnvoi className={buttonClass.primary} enCours="Ajout…">
                Ajouter le site
              </BoutonEnvoi>
            </div>
          </Panel>
        </form>
      ) : null}
    </section>
  );
}

function AjoutPersonne({ clientId }: { clientId: string }) {
  return (
    <section>
      <Label>Ajouter une personne</Label>
      <form action={ajouterPersonne} className="mt-3">
        <input type="hidden" name="clientId" value={clientId} />
        <Panel className="grid gap-4 p-5 sm:grid-cols-3">
          <label>
            <span className={etiquette}>Nom</span>
            <input name="name" required autoComplete="off" className={`${inputClass} mt-1`} />
          </label>
          <label>
            <span className={etiquette}>E-mail</span>
            <input name="email" type="email" required autoComplete="off" className={`${inputClass} mt-1`} />
          </label>
          <label>
            <span className={etiquette}>Rôle (facultatif)</span>
            <input name="role" className={`${inputClass} mt-1`} />
          </label>
        </Panel>
        <div className="mt-3">
          <BoutonEnvoi className={buttonClass.ghost} enCours="Ajout…">
            Ajouter la personne
          </BoutonEnvoi>
        </div>
      </form>
    </section>
  );
}
