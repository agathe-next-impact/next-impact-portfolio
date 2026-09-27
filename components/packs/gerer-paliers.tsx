import * as React from "react";
import { Link } from "@/i18n/navigation";
import { BlueprintSection, SectionHeading } from "@/components/aspect/section";
import { OFFER_PRICE_LABEL } from "@/lib/sentinelle-offer";
import { CTO_COMMITMENT, CTO_PATH, CTO_TIER_ROWS, CTO_TIERS } from "@/lib/cto-externalise";
import {
  MAINTENANCE_COMMITMENT,
  MAINTENANCE_GRID_COLUMNS,
  MAINTENANCE_MAX_SITES,
  MAINTENANCE_ONBOARDING,
  MAINTENANCE_TIERS,
  maintenancePriceLabel,
} from "@/lib/maintenance-offer";

// ─────────────────────────────────────────────────────────────────────────────
// Les paliers des deux services du moment « Gérer », chacun sur la page de son
// pack (demande d'Agathe du 2026-09-27) : le suivi et maintenance sur
// /packs/site-a-tenir, l'expert technique externalisé sur
// /packs/decisions-techniques. La page mère /maintenance-wordpress ne les montre
// plus. Tout vient de lib/maintenance-offer.ts et lib/cto-externalise.ts.
// Ancre #paliers dans les deux cas.
// ─────────────────────────────────────────────────────────────────────────────

type Props = { index?: string; tone?: "jet" };

/** Suivi et maintenance : deux paliers, grille par type de site, démarrage. */
export function MaintenancePaliers({ index, tone }: Props) {
  return (
    <BlueprintSection tone={tone} id="paliers">
      <div className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          index={index}
          kicker="Suivi et maintenance"
          title={
            <>
              Deux paliers, selon ce que votre site <span className="text-accent-secondary">porte pour vous</span>.
            </>
          }
          description={`Surveillance, sauvegardes, mises à jour, corrections, et un rapport mensuel. ${MAINTENANCE_COMMITMENT.fr}`}
        />
      </div>
      <div className="grid md:grid-cols-2">
        {MAINTENANCE_TIERS.map((tier) => (
          <div
            key={tier.id}
            className={
              tier.recommended
                ? "border-b border-dark-gray bg-jet p-6 md:border-b-0 lg:p-8"
                : "border-b border-dark-gray p-6 md:border-b-0 md:border-r lg:p-8"
            }
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-2xs uppercase tracking-[0.14em] text-mid-gray">Palier</p>
              {tier.recommended && (
                <span className="rounded-full bg-accent-secondary px-2.5 py-1 font-mono text-2xs uppercase tracking-[0.12em] text-obsidian">
                  Le cas courant
                </span>
              )}
            </div>
            <h3 className="mt-2 text-3xl font-light tracking-tight text-foreground">{tier.name.fr}</h3>
            <dl className="mt-3 flex flex-col gap-1">
              {MAINTENANCE_GRID_COLUMNS.map((col, i) => (
                <div key={col.kind} className="flex flex-wrap items-baseline justify-between gap-x-6">
                  <dt className="font-inter-tight text-base text-mid-gray">{col.label.fr}</dt>
                  <dd className={i === 0 ? "text-xl tracking-tight text-foreground" : "text-base text-foreground"}>
                    {maintenancePriceLabel(tier.id, col.kind, "fr")}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 font-inter-tight text-base leading-relaxed text-mid-gray">{tier.forWhom.fr}</p>
            <ul className="mt-6 flex flex-col gap-2">
              {tier.items.fr.map((item) => (
                <li key={item} className="flex gap-2 font-inter-tight text-base leading-relaxed text-foreground/85">
                  <span className="shrink-0 pt-px font-mono text-2xs text-accent-secondary">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-dark-gray px-6 py-8 lg:px-8">
        <p className="font-mono text-2xs uppercase tracking-[0.14em] text-mid-gray">{MAINTENANCE_ONBOARDING.fr.price}</p>
        <h3 className="mt-2 text-xl font-light tracking-tight text-foreground">{MAINTENANCE_ONBOARDING.fr.title}</h3>
        <p className="mt-2 max-w-3xl font-inter-tight text-base leading-relaxed text-mid-gray">{MAINTENANCE_ONBOARDING.fr.body}</p>
        <p className="mt-4 font-inter-tight text-sm text-mid-gray">
          {MAINTENANCE_MAX_SITES} sites suivis au maximum en même temps : chaque rapport est relu.
        </p>
      </div>
      <div className="border-t border-dark-gray px-6 py-5 lg:px-8">
        <p className="max-w-3xl font-inter-tight text-sm leading-relaxed text-mid-gray">
          Vous avez déjà un prestataire, ou vous intervenez vous-même ? La veille se souscrit seule depuis
          l&apos;analyse de votre site : Sentinelle, {OFFER_PRICE_LABEL}, sans engagement.{" "}
          <Link href="/sentinelle" className="text-accent-secondary no-underline hover:text-foreground">
            Voir Sentinelle →
          </Link>
        </p>
      </div>
    </BlueprintSection>
  );
}

/** Expert technique externalisé : deux paliers et leur comparatif. */
export function CtoPaliers({ index, tone }: Props) {
  return (
    <BlueprintSection tone={tone} id="paliers">
      <div className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          index={index}
          kicker="Expert technique externalisé"
          title={
            <>
              Une direction technique <span className="text-accent-secondary">à temps partagé</span>.
            </>
          }
          description={`Les décisions techniques reviennent tous les mois : je les tranche par écrit, je pilote vos prestataires et je propose ce qui doit évoluer, sans que vous ayez à recruter. ${CTO_COMMITMENT.fr}.`}
        />
      </div>
      <div className="grid md:grid-cols-2">
        {CTO_TIERS.map((tier, t) => (
          <div
            key={tier.id}
            className={
              tier.featured
                ? "border-b border-dark-gray bg-obsidian p-6 md:border-b-0 lg:p-8"
                : "border-b border-dark-gray p-6 md:border-b-0 md:border-r lg:p-8"
            }
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-2xs uppercase tracking-[0.14em] text-mid-gray">Palier</p>
              {tier.featured && (
                <span className="rounded-full bg-accent-secondary px-2.5 py-1 font-mono text-2xs uppercase tracking-[0.12em] text-obsidian">
                  Le cas courant
                </span>
              )}
            </div>
            <h3 className="mt-2 text-3xl font-light tracking-tight text-foreground">{tier.name.fr}</h3>
            <p className="mt-3 text-xl tracking-tight text-foreground">{tier.priceLabel.fr} par mois</p>
            <p className="mt-3 font-inter-tight text-base leading-relaxed text-mid-gray">{tier.forWho.fr}</p>
            <dl className="mt-6 flex flex-col gap-2">
              {CTO_TIER_ROWS.map((row) => (
                <div key={row.label.fr} className="flex flex-wrap items-baseline justify-between gap-x-6">
                  <dt className="font-inter-tight text-base text-mid-gray">{row.label.fr}</dt>
                  <dd className="font-inter-tight text-base text-foreground/85">{row.values[t].fr}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
      <div className="border-t border-dark-gray px-6 py-5 lg:px-8">
        <Link
          href={CTO_PATH}
          className="font-mono text-2xs uppercase tracking-[0.08em] text-accent-secondary no-underline hover:text-foreground"
        >
          Voir l&apos;offre d&apos;expert technique externalisé →
        </Link>
      </div>
    </BlueprintSection>
  );
}
