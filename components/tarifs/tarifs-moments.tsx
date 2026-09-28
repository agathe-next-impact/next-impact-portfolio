"use client";

import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { BlueprintSection, SectionHeading, Separator } from "@/components/aspect/section";
import { SituationRow } from "@/components/packs/pack-parts";
import { OFFER_PRICE_LABEL } from "@/lib/sentinelle-offer";
import { CTO_COMMITMENT, CTO_PATH, CTO_TIERS } from "@/lib/cto-externalise";
import {
  MAINTENANCE_COMMITMENT,
  MAINTENANCE_GRID_COLUMNS,
  MAINTENANCE_ONBOARDING,
  MAINTENANCE_PATH,
  MAINTENANCE_TIERS,
  SUIVI_INCLUS_LABEL,
  SUIVI_INCLUS_MOIS,
  maintenancePriceLabel,
} from "@/lib/maintenance-offer";
import { BESOINS, situationsDuBesoin } from "@/lib/situations";
import { TRAJECTOIRES, trajectoirePrice, variantePriceHT, type TrajectoireSlug } from "@/lib/trajectoires";
import { CTA_CHAUD } from "@/lib/visio-conseil";

// ─────────────────────────────────────────────────────────────────────────────
// /tarifs : la seule page qui montre à la fois les PACKS et le CATALOGUE (charte
// v1.6, ADR-014). D'abord les sept packs, rangés par besoin : le budget d'une
// situation. Ensuite les SEPT lignes du catalogue et leurs paliers, rangées par
// moment (Évoluer · Gérer, ADR-013) : les prix publics dont chaque budget est
// la somme. La section Diagnostiquer a été retirée le 2026-09-27 à la demande
// d'Agathe (ADR-022) : l'échange gratuit et l'audit + roadmap se lisent, avec
// leur prix, dans leurs lignes de la section 01. Elle sert le prospect qui
// vérifie.
//
// On compte les offres, pas les paliers : le démarrage du suivi est une
// condition, dite dans le détail de la ligne. Sentinelle n'est plus une ligne :
// elle est incluse dans le suivi et se vend depuis l'analyse du site. Son prix
// reste lisible ici, en note, pour le prospect qui vérifie.
//
// Aucun prix recopié ici : chaque ligne lit sa source unique. Contenu FR
// (locale EN en noindex).
// ─────────────────────────────────────────────────────────────────────────────

type Href = Parameters<typeof Link>[0]["href"];

type Row = {
  offre: string;
  detail: string;
  prix: string[];
  href: string;
  recommandee?: boolean;
  /** Offre gratuite : mise en avant, comme une recommandation. */
  gratuite?: boolean;
};

function Moment({
  index,
  kicker,
  title,
  description,
  rows,
  note,
  tone,
}: {
  index: string;
  kicker: string;
  title: React.ReactNode;
  description: string;
  rows: Row[];
  note?: React.ReactNode;
  tone?: "jet";
}) {
  return (
    <BlueprintSection tone={tone}>
      <div className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-14">
        <SectionHeading index={index} kicker={kicker} title={title} description={description} />
      </div>
      <div>
        {rows.map((r) => (
          <Link
            key={r.offre}
            href={r.href as Href}
            className="group grid gap-2 border-b border-dark-gray px-6 py-5 no-underline md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)_minmax(0,1fr)] md:gap-8 lg:px-8"
          >
            <span className="flex flex-wrap items-center gap-2">
              <span className="text-lg font-light tracking-tight text-foreground group-hover:text-accent-secondary">
                {r.offre}
              </span>
              {(r.recommandee || r.gratuite) && (
                <span className="rounded-full bg-accent-secondary px-2 py-0.5 font-mono text-2xs uppercase tracking-[0.12em] text-obsidian">
                  {r.gratuite ? "Gratuit, sans engagement" : "Recommandée"}
                </span>
              )}
            </span>
            <span className="font-inter-tight text-base leading-relaxed text-mid-gray">{r.detail}</span>
            <span className="flex flex-col gap-1 text-base text-foreground md:items-end md:text-right">
              {r.prix.map((p) => (
                <span key={p}>{p}</span>
              ))}
            </span>
          </Link>
        ))}
      </div>
      {note && <div className="px-6 py-5 font-inter-tight text-sm leading-relaxed text-mid-gray lg:px-8">{note}</div>}
    </BlueprintSection>
  );
}

export function TarifsMoments() {
  const prestation = (slug: TrajectoireSlug, detail: string): Row => ({
    offre: TRAJECTOIRES[slug].name.fr,
    detail,
    // Une prestation à variantes (la Refonte, ADR-031) : une ligne par
    // variante, à égalité ; sinon le plancher.
    prix: TRAJECTOIRES[slug].variantes?.map(
      (v) => `${v.technique.fr} · ${variantePriceHT(v, "fr").replace(/^./, (c) => c.toLowerCase())}`,
    ) ?? [`${trajectoirePrice(slug, "fr")} HT`],
    href: TRAJECTOIRES[slug].href,
    recommandee: TRAJECTOIRES[slug].recommended,
  });
  const refaire: Row[] = [
    prestation(
      "forfait-classique",
      "WordPress optimisé : votre site actuel remis à niveau, sans reconstruction. Vitesse, extensions, sécurité, hébergement.",
    ),
    prestation(
      "forfait-headless",
      "WordPress sur mesure ou headless : le site est reconstruit, vos rédacteurs publient toujours dans WordPress.",
    ),
    prestation("forfait-webapp", "Web app, plateforme ou application mobile, reliée à vos outils."),
  ];

  // Le prix du suivi dépend du type de site : une ligne par palier et par colonne
  // de la grille (lib/maintenance-offer.ts).
  const prixSuivi = MAINTENANCE_GRID_COLUMNS.flatMap((col) =>
    MAINTENANCE_TIERS.map(
      (t) => `${col.label.fr} · ${t.name.fr} · ${maintenancePriceLabel(t.id, col.kind, "fr")}`,
    ),
  );

  const tenir: Row[] = [
    {
      offre: "Suivi et maintenance",
      detail: `Surveillance, sauvegardes, mises à jour vérifiées, rapport mensuel, veille en continu avec Sentinelle incluse. ${MAINTENANCE_COMMITMENT.fr} Le suivi démarre par un état des lieux : ${MAINTENANCE_ONBOARDING.fr.price}, offert pour un site que j'ai livré.`,
      prix: prixSuivi,
      href: MAINTENANCE_PATH,
    },
    {
      offre: "Expert technique externalisé",
      detail: `Direction technique à temps partagé, sans recruter. ${CTO_COMMITMENT.fr}.`,
      prix: CTO_TIERS.map((t) => `${t.name.fr} · ${t.priceLabel.fr} par mois`),
      href: CTO_PATH,
    },
  ];

  return (
    <>
      {/* Les packs : le budget d'une situation, par besoin. */}
      <BlueprintSection id="packs">
        <div className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-14">
          <SectionHeading
            index="№ 02"
            kicker="Les parcours, par besoin"
            title={
              <>
                Votre situation, <span className="text-accent-secondary">son budget</span>.
              </>
            }
            description="Un parcours met les offres du catalogue dans l'ordre : avant, pendant, après. Il ne crée ni prix ni remise : son budget est la somme des prix publics listés plus bas."
          />
        </div>
        {BESOINS.map((b) => (
          <div key={b.key}>
            <p className="border-b border-dark-gray bg-jet px-6 py-3 font-mono text-2xs uppercase tracking-[0.14em] text-mid-gray lg:px-8">
              {b.index} · {b.moment.fr} · « {b.phrase.fr} »
            </p>
            {situationsDuBesoin(b.key).map((s) => (
              <SituationRow key={s.slug} situation={s} lang="fr" prix="budget" />
            ))}
          </div>
        ))}
      </BlueprintSection>
      <Separator />
      <Moment
        index="№ 03"
        kicker="Évoluer"
        title={
          <>
            Trois prestations, <span className="text-accent-secondary">au forfait</span>.
          </>
        }
        description="Refonte ou création : mêmes forfaits, prix et délai écrits avant de commencer, 6 à 10 semaines."
        rows={refaire}
        note={`Chaque prestation comprend une première analyse de veille technique et stratégique.${
          SUIVI_INCLUS_MOIS > 0
            ? ` Chaque forfait inclut ${SUIVI_INCLUS_LABEL.fr.replace(/ inclus$/, "")} Essentiel après la mise en ligne.`
            : ""
        }`}
      />
      <Separator />
      <Moment
        index="№ 04"
        kicker="Gérer"
        title={
          <>
            Entretenir, <span className="text-accent-secondary">piloter</span>.
          </>
        }
        description="Les deux abonnements, du plus léger au plus engageant. Tous deux portent une veille en continu, et se suivent dans votre espace en ligne."
        rows={tenir}
        tone="jet"
        note={
          <>
            Sentinelle, la lettre de veille et les alertes sur les composants de votre site, est incluse dans le
            suivi et maintenance. Seule, elle se souscrit depuis l&apos;analyse de votre site : {OFFER_PRICE_LABEL},
            sans engagement.{" "}
            <Link href="/sentinelle" className="text-accent-secondary no-underline hover:text-foreground">
              Voir Sentinelle →
            </Link>
          </>
        }
      />
      <Separator />
      <BlueprintSection innerClassName="px-6 py-14 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="№ 05"
            kicker="Par où commencer"
            title={
              <>
                Vous hésitez ? <span className="text-accent-secondary">Commencez par analyser votre site</span>.
              </>
            }
            description="Gratuit, deux minutes, aucun accès demandé."
          />
          <div className="flex flex-wrap gap-3 lg:shrink-0">
            <a
              href="/scan"
              className="inline-flex items-center justify-center gap-2 border border-accent-secondary bg-accent-secondary px-6 py-3 font-mono text-sm font-semibold uppercase tracking-[0.14em] text-obsidian no-underline transition-opacity hover:opacity-90"
            >
              Analysez votre site
              <ArrowRight size={14} />
            </a>
            <a
              href={CTA_CHAUD.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-dark-gray px-6 py-3 font-mono text-sm font-semibold uppercase tracking-[0.14em] text-mid-gray no-underline transition-colors hover:text-foreground"
            >
              Discutons de votre projet
            </a>
          </div>
        </div>
      </BlueprintSection>
    </>
  );
}
