import type { Metadata } from "next";
import { SERVICES, TIERS } from "@cto/admin";
import { BoutonEnvoi } from "../../../bouton-envoi";
import { BackLink, buttonClass, inputClass, Label, Panel } from "../../../espace-direction/ui";
import { creerClient } from "../actions-clients";
import { ChampsSite } from "../champs-site";
import { PILOTAGE_LARGEUR } from "../largeur";

export const metadata: Metadata = { title: "Nouveau client" };
export const dynamic = "force-dynamic";

/** Les lignes de site proposées d'emblée ; les lignes laissées vides sont ignorées. */
const LIGNES_DE_SITE = 4;

const etiquette = "font-mono text-[10px] uppercase tracking-[0.1em] text-mid-gray";

/**
 * Crée un client directement dans l'admin : coordonnées, services, premier
 * accès et sites. Un client créé ici n'a pas de fiche Notion — l'admin en est
 * la source de vérité, la synchro n'y touche pas.
 */
export default function NouveauClientPage() {
  return (
    <main className={PILOTAGE_LARGEUR}>
      <BackLink href="/admin-cto/pilotage">Tous les accompagnements</BackLink>
      <h1 className="mt-6 font-sans text-2xl font-light text-foreground sm:text-3xl">Nouveau client</h1>
      <p className="mt-2 max-w-prose font-inter-tight text-sm text-mid-gray">
        Le client est créé ici, sans fiche Notion : ses services, ses coordonnées et ses sites se règlent depuis son
        écran d&rsquo;administration. Rien n&rsquo;est envoyé au client tant que vous ne l&rsquo;invitez pas.
      </p>

      <form action={creerClient} className="mt-10 space-y-10">
        <section>
          <Label>Coordonnées</Label>
          <Panel className="mt-3 grid gap-4 p-5 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className={etiquette}>Raison sociale</span>
              <input name="company" required className={`${inputClass} mt-1`} />
            </label>
            <label>
              <span className={etiquette}>Contact : nom</span>
              <input name="contactName" required autoComplete="off" className={`${inputClass} mt-1`} />
            </label>
            <label>
              <span className={etiquette}>Contact : e-mail</span>
              <input name="contactEmail" type="email" required autoComplete="off" className={`${inputClass} mt-1`} />
            </label>
            <label>
              <span className={etiquette}>Rôle (facultatif)</span>
              <input name="contactRole" placeholder="Dirigeant" className={`${inputClass} mt-1`} />
            </label>
            <label>
              <span className={etiquette}>Palier</span>
              <select name="tier" defaultValue="direction" className={`${inputClass} mt-1`}>
                {TIERS.map((tier) => (
                  <option key={tier.code} value={tier.code}>
                    {tier.label}
                  </option>
                ))}
              </select>
            </label>
          </Panel>
        </section>

        <section>
          <Label>Services activés</Label>
          <Panel className="mt-3 grid gap-3 p-5 sm:grid-cols-2">
            {SERVICES.map((service) => (
              <label key={service.code} className="flex items-start gap-3">
                <input type="checkbox" name="services" value={service.code} className="mt-1" />
                <span>
                  <span className="font-inter-tight text-sm text-foreground">{service.label}</span>
                  <span className="block font-inter-tight text-xs text-mid-gray">{service.hint}</span>
                </span>
              </label>
            ))}
          </Panel>
        </section>

        <section>
          <Label>Sites du client</Label>
          <p className="mt-2 max-w-prose font-inter-tight text-xs text-mid-gray">
            Un site peut être associé sans projet WP Umbrella. Cochez « Veille technique » sur les sites que Sentinelle
            doit surveiller (le premier coché est le site principal) ; renseignez l&rsquo;ID projet pour le suivi
            technique.
          </p>
          <Panel className="mt-3 divide-y divide-dark-gray p-5">
            {Array.from({ length: LIGNES_DE_SITE }, (_, n) => (
              <div key={n} className={n === 0 ? "pb-6" : "py-6"}>
                <ChampsSite n={n} />
              </div>
            ))}
          </Panel>
        </section>

        <section className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2 font-inter-tight text-sm text-foreground">
            <input type="checkbox" name="inviter" />
            Envoyer l&rsquo;invitation au contact tout de suite
          </label>
          <BoutonEnvoi className={buttonClass.primary} enCours="Création…">
            Créer le client
          </BoutonEnvoi>
        </section>
      </form>
    </main>
  );
}
