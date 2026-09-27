"use client";

import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { BlueprintSection, SectionHeading, Separator } from "@/components/aspect/section";
import { getTiers } from "@/components/services/PricingCards";
import { OFFERS as CONSEIL_OFFERS, CREDIT_WINDOW_DAYS } from "@/lib/visio-conseil";
import { OFFER_PRICE_LABEL } from "@/lib/sentinelle-offer";
import { CTO_COMMITMENT, CTO_PATH, CTO_TIERS } from "@/lib/cto-externalise";
import {
  MAINTENANCE_COMMITMENT,
  MAINTENANCE_ONBOARDING,
  MAINTENANCE_PATH,
  MAINTENANCE_TIERS,
  SUIVI_INCLUS_LABEL,
  SUIVI_INCLUS_MOIS,
} from "@/lib/maintenance-offer";

// ─────────────────────────────────────────────────────────────────────────────
// /tarifs — la seule page qui liste TOUTES les offres et leurs paliers, rangées
// par moment (Décider · Refaire · Tenir). Elle sert le prospect qui vérifie ;
// partout ailleurs, une carte n'affiche qu'un prix « à partir de ».
//
// Composant client parce que les prix des trajectoires vivent dans
// PricingCards.getTiers (module client). Aucun prix recopié ici : chaque ligne
// lit sa source unique. Contenu FR (locale EN en noindex).
// ─────────────────────────────────────────────────────────────────────────────

type Href = Parameters<typeof Link>[0]["href"];

type Row = {
  offre: string;
  detail: string;
  prix: string[];
  href: string;
  recommandee?: boolean;
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
              {r.recommandee && (
                <span className="rounded-full bg-accent-secondary px-2 py-0.5 font-mono text-2xs uppercase tracking-[0.12em] text-obsidian">
                  Recommandée
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
  const tiers = getTiers(false);
  const tier = (slug: string) => tiers.find((t) => t.slug === slug)!;
  const visio = CONSEIL_OFFERS.find((o) => o.id === "choix-techno-ia")!.tiers[0];
  const audit = CONSEIL_OFFERS.find((o) => o.id === "architecture-projet-ia")!.tiers[0];

  const decider: Row[] = [
    {
      offre: "Visio conseil refonte",
      detail: "Une heure en visio, un avis écrit sous 48 h : garder, faire évoluer ou refaire.",
      prix: [`${visio.price.fr} HT`],
      href: "/conseil#choix-techno-ia",
    },
    {
      offre: "Audit + roadmap",
      detail: "Rapport d'audit, préconisations chiffrées et roadmap, remis dans votre espace en ligne.",
      prix: [`${audit.price.fr} HT`],
      href: "/conseil#architecture-projet-ia",
    },
    {
      offre: "Veille et ressources",
      detail: "La lettre gratuite, les ressources pour décider et les outils de diagnostic.",
      prix: ["Gratuit"],
      href: "/veille",
    },
  ];

  const refaire: Row[] = [
    {
      offre: "Consolider",
      detail: "Refonte WordPress optimisée : thème sur mesure, extensions réduites, sécurité durcie.",
      prix: [`${tier("forfait-classique").price} HT`],
      href: "/solutions-web#forfait-classique",
    },
    {
      offre: "Découpler",
      detail: "Refonte WordPress headless : vos rédacteurs publient dans WordPress, vos visiteurs voient un site rapide et moderne.",
      prix: [`${tier("forfait-headless").price} HT`],
      href: "/solutions-web#forfait-headless",
      recommandee: true,
    },
    {
      offre: "Refonder",
      detail: "Web app, plateforme ou application mobile, reliée à vos outils.",
      prix: [`${tier("forfait-webapp").price} HT`],
      href: "/solutions-web#forfait-webapp",
    },
  ];

  const tenir: Row[] = [
    {
      offre: "Sentinelle",
      detail: "Lettre de veille deux fois par mois et alertes sur les composants installés sur votre site. Sans engagement.",
      prix: [OFFER_PRICE_LABEL],
      href: "/sentinelle",
    },
    {
      offre: "Suivi et maintenance",
      detail: `Surveillance, sauvegardes, mises à jour vérifiées, rapport mensuel, Sentinelle incluse. ${MAINTENANCE_COMMITMENT.fr}`,
      prix: MAINTENANCE_TIERS.map((t) => `${t.name.fr} · ${t.price.fr}`).concat(
        `Démarrage · ${MAINTENANCE_ONBOARDING.fr.price}`,
      ),
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
      <Moment
        index="№ 01"
        kicker="Décider"
        title={
          <>
            Avant d&apos;engager un budget, <span className="text-accent-secondary">un avis tranché</span>.
          </>
        }
        description="Les deux portes d'entrée payantes, et ce qui est gratuit."
        rows={decider}
        note={`La visio est déduite du devis si un projet démarre sous ${CREDIT_WINDOW_DAYS} jours.`}
      />
      <Separator />
      <Moment
        index="№ 02"
        kicker="Refaire"
        title={
          <>
            Trois trajectoires, <span className="text-accent-secondary">au forfait</span>.
          </>
        }
        description="Refonte ou création : mêmes forfaits, prix et délai écrits avant de commencer, 6 à 10 semaines."
        rows={refaire}
        note={
          SUIVI_INCLUS_MOIS > 0
            ? `Chaque forfait inclut ${SUIVI_INCLUS_LABEL.fr.replace(/ inclus$/, "")} Essentiel après la mise en ligne.`
            : undefined
        }
        tone="jet"
      />
      <Separator />
      <Moment
        index="№ 03"
        kicker="Tenir"
        title={
          <>
            Prévenir, entretenir, <span className="text-accent-secondary">décider</span>.
          </>
        }
        description="Les trois abonnements, du plus léger au plus engageant. Chacun se suit dans votre espace en ligne."
        rows={tenir}
      />
      <Separator />
      <BlueprintSection tone="jet" innerClassName="px-6 py-14 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="№ 04"
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
              className="inline-flex items-center justify-center gap-2 border border-accent-secondary bg-accent-secondary px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-obsidian no-underline transition-opacity hover:opacity-90"
            >
              Analysez votre site en 2 minutes
              <ArrowRight size={14} />
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 border border-dark-gray px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-mid-gray no-underline transition-colors hover:text-foreground"
            >
              Discutons de votre projet
            </Link>
          </div>
        </div>
      </BlueprintSection>
    </>
  );
}
