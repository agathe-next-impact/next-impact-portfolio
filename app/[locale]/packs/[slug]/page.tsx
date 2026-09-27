import * as React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ArrowRight, Plus } from "lucide-react";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd, FAQJsonLd, ServiceJsonLd } from "@/components/json-ld";
import { BlueprintSection, SectionHeading, Separator } from "@/components/aspect/section";
import { PageHero, HERO_BTN_PRIMARY, HERO_BTN_SECONDARY } from "@/components/aspect/page-hero";
import { BesoinTitle } from "@/components/aspect/besoin-title";
import { HeroNavCards, type HeroNavCard } from "@/components/aspect/hero-nav-cards";
import { CtaPaire, VeilleBloc } from "@/components/packs/pack-parts";
import Process from "@/components/process";
import { CtoPaliers, MaintenancePaliers } from "@/components/packs/gerer-paliers";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getCaseStudy, getResultHighlights } from "@/lib/case-studies-data";
import { MAINTENANCE_BILLING_UNIT_CODE, MAINTENANCE_PRIX_VALIDES } from "@/lib/maintenance-offer";
import {
  PACKS_PATH,
  getBesoin,
  getSituation,
  getSituationSlugs,
  packBudgetLabel,
  packHref,
  packNom,
  trajectoireDuPack,
  veilleDuPack,
} from "@/lib/situations";
import { formatEuros } from "@/lib/trajectoires";
import { CTA_ECHANGE } from "@/lib/visio-conseil";

// ─────────────────────────────────────────────────────────────────────────────
// Page d'un pack : une situation, le parcours qui y répond, son budget (charte
// v1.6, ADR-014). C'est la page d'atterrissage d'un message de prospection : un
// message par situation, une page par message.
//
// Ordre de conviction (charte §5) : la douleur et la promesse (héros), la
// preuve, le pack en trois étapes, la veille qui le distingue, le budget et ce
// qui est inclus, FAQ, deux boutons de deux
// températures. Les abonnements restent la dernière étape du parcours.
//
// Toutes les pages portent une section « La preuve » ; seules les prestations
// de réalisation (Optimisation, Refonte, Évolution) portent « Le processus »,
// la méthode Blueprint (demandes d'Agathe du 2026-09-27). Rendues par
// sectionProcessus et sectionPreuve.
//
// Pack d'abonnement détaillé (`page.concept`, `page.offres` ; Maintenance et
// Pilotage) : le concept et chaque offre ou palier en accordéon ouvert à
// cartes, puis le processus et la preuve ; `page.sansBudget` retire le
// budget. Suivent la veille, les paliers du service, la FAQ, les boutons.
//
// Page d'une prestation (Optimisation, Refonte, Évolution : `page.solution`) :
// le héros, la solution en accordéon (solution technique avec son prix de
// forfait, pas le budget de la première année, et situations types), le
// processus, la preuve, puis les deux boutons.
//
// Page réduite à la prestation (Audit + roadmap : `page.prestation`) :
// description, livrables et prix, le processus, la preuve, les deux boutons.
//
// Tout vient de lib/situations.ts : aucun prix, aucun chiffre de preuve n'est
// écrit ici. Les chiffres d'une étude de cas sont lus dans
// lib/case-studies-data.ts.
//
// Contenu FR uniquement (charte §3 : l'anglais suit la validation du
// français) ; la locale EN est en noindex, comme /maintenance-wordpress.
// ─────────────────────────────────────────────────────────────────────────────

export const revalidate = 86400;

type Href = Parameters<typeof Link>[0]["href"];

// dynamicParams = false (layout [locale]) : seuls les packs déclarés existent.
export function generateStaticParams() {
  return getSituationSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const situation = getSituation(slug);
  if (!situation) return {};

  return generatePageMetadata({
    title: situation.page.metaTitle,
    description: situation.page.metaDescription,
    path: packHref(situation.slug),
    eyebrow: packNom(situation, "fr"),
    keywords: situation.page.keywords,
    locale,
    noindex: locale === "en" || !MAINTENANCE_PRIX_VALIDES,
    alternateLocales: ["fr"],
  });
}

/**
 * Un volet de l'accordéon d'une page de prestation : numéro, titre, sous-titre,
 * contenu. Accordéon natif <details> : contenu dans le HTML servi, lisible par
 * les moteurs, accessible au clavier.
 */
function Volet({
  numero,
  titre,
  sousTitre,
  open = false,
  children,
}: {
  numero: string;
  titre: string;
  sousTitre?: string;
  open?: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className="border-b border-dark-gray">
      <details className="group" open={open}>
        <summary className="grid cursor-pointer list-none grid-cols-[3rem_minmax(0,1fr)_auto] items-baseline gap-4 px-6 py-6 hover:bg-obsidian md:gap-8 lg:px-8 [&::-webkit-details-marker]:hidden">
          <span className="font-mono text-2xs uppercase tracking-[0.14em] text-accent-secondary">{numero}</span>
          <span className="flex flex-col gap-1">
            {/* Titre d'accordéon : un cran plus grand, en bleu (demande d'Agathe du 2026-09-27). */}
            <span className="text-xl font-light tracking-tight text-accent-secondary">{titre}</span>
            {sousTitre && <span className="font-inter-tight text-sm text-mid-gray">{sousTitre}</span>}
          </span>
          <span
            aria-hidden="true"
            className="inline-flex h-9 w-9 items-center justify-center self-center border border-accent-secondary/60 text-accent-secondary transition-[transform,background-color,color] group-open:rotate-45 group-hover:bg-accent-secondary group-hover:text-obsidian"
          >
            <Plus size={18} strokeWidth={1.75} />
          </span>
        </summary>
        <div className="px-6 pb-8 md:pl-[calc(3rem+4rem)] lg:px-8 lg:pl-[calc(3rem+4.5rem)]">{children}</div>
      </details>
    </li>
  );
}

export default async function PackPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const situation = getSituation(slug);
  // Un pack sans page (lienExterne, Arbitrage) n'a pas d'adresse /packs.
  if (!situation || situation.lienExterne) notFound();

  const { page, budget } = situation;
  const besoin = getBesoin(situation.besoin);
  const budgetLabel = packBudgetLabel(situation, "fr");
  const modes = veilleDuPack(situation);

  // Les deux packs du moment « Gérer » portent les paliers de leur service
  // (déplacés de /maintenance-wordpress, demande d'Agathe du 2026-09-27).
  const Paliers =
    situation.slug === "site-a-tenir"
      ? MaintenancePaliers
      : situation.slug === "decisions-techniques"
      ? CtoPaliers
      : undefined;
  // Un pack d'abonnement décrit par son concept et ses offres détaillées
  // (page.concept, page.offres) : ni preuve, ni trois étapes ; sans budget
  // quand page.sansBudget (demandes d'Agathe du 2026-09-27).
  const concept = page.concept;
  const offres = page.offres ?? [];
  const detaille = Boolean(concept) || offres.length > 0 || Boolean(page.sansParcours);
  const paliersAvant = Boolean(Paliers && page.paliersAvantVeille);
  // Page d'une prestation : le prix affiché est celui du forfait, pas le
  // budget de la première année (demande d'Agathe du 2026-09-27).
  const solution = page.solution;
  const trajectoire = solution ? trajectoireDuPack(situation) : undefined;
  const prixForfait = trajectoire ? `à partir de ${formatEuros(trajectoire.priceValue, "fr")} HT` : undefined;

  // La méthode Blueprint (section « Le processus ») ne s'affiche que sur les
  // prestations de réalisation de site web : Optimisation, Refonte, Évolution
  // (demande d'Agathe du 2026-09-27). Ni sur l'Audit, ni sur Maintenance et
  // Pilotage.
  const avecMethode = Boolean(trajectoire);
  // Numéros des sections après le héros, dans l'ordre où elles s'affichent.
  const sections = [
    ...(detaille ? [...(concept ? ["concept"] : []), ...offres.map((o) => `offre-${o.id}`)] : []),
    // La preuve : sur toutes les pages ; le processus : sur les prestations
    // de réalisation seulement (demandes d'Agathe du 2026-09-27).
    ...(avecMethode ? ["processus"] : []),
    ...(page.sansPreuve ? [] : ["preuve"]),
    ...(paliersAvant ? ["paliers", "veille"] : ["veille"]),
    ...(page.sansBudget ? [] : ["budget"]),
    ...(Paliers && !paliersAvant ? ["paliers"] : []),
    "faq",
    "cta",
  ];
  const n = (key: string) => `№ ${String(sections.indexOf(key) + 1).padStart(2, "0")}`;

  const caseStudy = page.preuve.caseStudy ? getCaseStudy("fr", page.preuve.caseStudy) : undefined;
  const highlights = page.preuve.caseStudy ? getResultHighlights("fr", page.preuve.caseStudy) : undefined;

  // Colonne droite du héros : les sections qui comptent, en cartes-ancres.
  // Pas de carte tarifs ni FAQ dans un héros (demande d'Agathe du
  // 2026-09-27) : le prix reste lisible sur la carte de la prestation ou du
  // parcours.
  const prixTotal = `${formatEuros(budget.total, "fr")} HT`;
  const carteProcessus = {
    key: "processus",
    label: "Le processus",
    detail: "Méthode Blueprint : 5 phases, un livrable à chacune",
    href: "#processus",
  };
  const cartePreuve = {
    key: "preuve",
    label: "La preuve",
    value: highlights?.[0]?.value,
    detail: highlights?.[0]?.label ?? page.preuve.titre,
    href: "#preuve",
  };
  const sansCle = ({ key: _key, ...card }: HeroNavCard & { key: string }) => card;
  const heroCards: HeroNavCard[] = trajectoire
    ? [
        {
          index: "01",
          label: "La solution",
          value: `Forfait ${prixForfait}`,
          detail: "Solution technique et situations types",
          href: "#solution",
        },
        { index: "02", ...sansCle(carteProcessus) },
        { index: "03", ...sansCle(cartePreuve) },
      ]
    : page.prestation
    ? [
        {
          index: "01",
          label: "La prestation",
          value: prixTotal,
          detail: `${page.prestation.livrables.length} livrables, décrits un par un`,
          href: "#prestation",
        },
        { index: "02", ...sansCle(cartePreuve) },
      ]
    : [
        ...(concept ? [{ label: "Le concept", detail: concept.points.map((pt) => pt.titre).join(" · "), href: "#concept" }] : []),
        ...offres.map((o) => ({
          label: o.carte,
          detail: o.volets.map((v) => v.titre).join(" · "),
          href: `#${o.id}`,
        })),
        ...[
          ...(avecMethode ? [carteProcessus] : []),
          ...(page.sansPreuve ? [] : [cartePreuve]),
          ...(Paliers
            ? [
                {
                  key: "paliers",
                  label: "Les paliers",
                  value: situation.mensuel ? `dès ${formatEuros(situation.mensuel, "fr")} HT/mois` : undefined,
                  detail: "Deux paliers et ce que comprend chacun",
                  href: "#paliers",
                },
              ]
            : []),
          { key: "veille", label: "La veille", detail: "Ce qui distingue ce pack", href: "#veille" },
        ]
          .sort((x, y) => sections.indexOf(x.key) - sections.indexOf(y.key))
          .map(({ key: _key, ...card }) => card),
      ].map((card, i) => ({ index: String(i + 1).padStart(2, "0"), ...card }));

  // ── Le processus : la méthode Blueprint, la même pour toutes les
  // prestations (demande d'Agathe du 2026-09-27). Source unique :
  // components/process.tsx, aussi rendue sur la home et /solutions-web. ──
  const sectionProcessus = (index: string) => (
    <>
      <BlueprintSection tone="jet" id="processus" innerClassName="px-6 py-16 lg:px-8 lg:py-20">
        <Process index={index} />
      </BlueprintSection>
      <Separator />
    </>
  );

  // ── La preuve : chiffres d'une étude de cas, témoignage, lien ──────────
  const sectionPreuve = (index: string) => (
    <>
      <BlueprintSection id="preuve">
        <div className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
          <SectionHeading index={index} kicker="La preuve" title={page.preuve.titre} description={page.preuve.texte} />
        </div>
        {highlights && (
          <div className="grid md:grid-cols-3">
            {highlights.map((h) => (
              <div key={h.label} className="border-b border-dark-gray p-6 md:border-b-0 md:border-r md:last:border-r-0 lg:p-8">
                <p className="text-3xl font-light tracking-tight text-accent-secondary">{h.value}</p>
                <p className="mt-2 font-inter-tight text-base leading-relaxed text-mid-gray">{h.label}</p>
              </div>
            ))}
          </div>
        )}
        {caseStudy?.testimonial && (
          <figure className="border-t border-dark-gray px-6 py-8 lg:px-8">
            <blockquote className="max-w-3xl font-inter-tight text-base leading-relaxed text-foreground/85">
              « {caseStudy.testimonial.content} »
            </blockquote>
            <figcaption className="mt-3 font-mono text-2xs uppercase tracking-[0.14em] text-mid-gray">
              {caseStudy.testimonial.author} · {caseStudy.testimonial.position}
            </figcaption>
          </figure>
        )}
        <div className="border-t border-dark-gray px-6 py-5 lg:px-8">
          <Link
            href={page.preuve.href as Href}
            className="font-mono text-2xs uppercase tracking-[0.08em] text-accent-secondary no-underline hover:text-foreground"
          >
            {page.preuve.lien} →
          </Link>
        </div>
      </BlueprintSection>
      <Separator />
    </>
  );

  return (
    <main>
      <BreadcrumbJsonLd
        locale={locale}
        items={[
          { name: "Accueil", url: "/" },
          { name: "Packs", url: PACKS_PATH },
          { name: packNom(situation, "fr"), url: packHref(situation.slug) },
        ]}
      />
      <ServiceJsonLd
        locale={locale}
        name={packNom(situation, "fr")}
        description={page.metaDescription}
        serviceType={situation.offre.fr}
        url={packHref(situation.slug)}
        offer={
          situation.mensuel
            ? { minPrice: situation.mensuel, billingUnitCode: MAINTENANCE_BILLING_UNIT_CODE }
            : { minPrice: trajectoire ? trajectoire.priceValue : budget.total }
        }
      />
      {/* La FAQ structurée ne décrit que ce qui est affiché : pas de FAQ sur une page réduite. */}
      {!page.prestation && !trajectoire && <FAQJsonLd questions={page.faq} />}

      {/* ── Héros : la douleur, puis la promesse ───────────────────────── */}
      <PageHero
        index={`№ ${besoin.index}`}
        kicker={besoin.moment.fr}
        // h1 = nom de la case du mega menu (packNom, même source que le menu) ;
        // l'ancien titre, le bénéfice, ouvre la description.
        title={
          <BesoinTitle
            phrase={page.h1 ?? packNom(situation, "fr")}
            accent={page.h1Accent ?? page.h1 ?? packNom(situation, "fr")}
          />
        }
        // Prestation de réalisation : la solution technique en sous-titre
        // (demande d'Agathe du 2026-09-27).
        subtitle={trajectoire?.technique.fr}
        description={`${page.titre.avant}${page.titre.accent}${page.titre.apres} ${page.promesse}`}
        actions={
          <>
            {/* L'échange gratuit en premier (Calendly, nouvel onglet) ; /scan vit
                hors de app/[locale]/ : balise <a>, pas le Link i18n. */}
            <a href={CTA_ECHANGE.href} target="_blank" rel="noopener noreferrer" className={HERO_BTN_PRIMARY}>
              {CTA_ECHANGE.label.fr}
              <ArrowRight size={14} />
            </a>
            <a href="/scan" className={HERO_BTN_SECONDARY}>
              Analysez votre site en 2 minutes
            </a>
          </>
        }
        note={`« ${situation.phrase.fr} » · ${trajectoire ? `Forfait ${prixForfait}` : budgetLabel}`}
        aside={<HeroNavCards label="Sur cette page" cards={heroCards} />}
      />

      <Separator />

      {solution && trajectoire ? (
        <>
          {/* ── Page d'une prestation : une section, la solution en accordéon ── */}
          <BlueprintSection tone="jet" id="solution">
            {/* Surtitre : le nom de l'offre. Titre : la solution technique.
                Le tarif, à part, sous le titre. */}
            <div className="flex flex-col gap-8 border-b border-dark-gray px-6 py-12 md:flex-row md:items-end md:justify-between lg:px-8 lg:py-16">
              <SectionHeading
                index="№ 01"
                kicker={trajectoire.name.fr}
                title={trajectoire.technique.fr}
                description={trajectoire.enClair.fr}
              />
              <div className="shrink-0 md:text-right">
                <p className="font-mono text-2xs uppercase tracking-[0.14em] text-mid-gray">Forfait</p>
                <p className="mt-2 text-2xl font-light tracking-tight text-accent-secondary first-letter:uppercase md:text-3xl">
                  {prixForfait}
                </p>
                <p className="mt-2 font-inter-tight text-sm text-mid-gray">Hors taxes, écrit avant de commencer.</p>
              </div>
            </div>
            <ol>
              <Volet numero="01" titre="La solution technique" sousTitre="Ce que je fais, la stack, ce qui est inclus" open>
                <div className="grid gap-8 md:grid-cols-2">
                  <p className="font-inter-tight text-base leading-relaxed text-foreground">{solution.detail}</p>
                  <div>
                    <p className="mb-2.5 font-mono text-2xs uppercase tracking-[0.12em] text-mid-gray">Stack technique</p>
                    <p className="font-inter-tight text-base leading-relaxed text-mid-gray">{solution.stack}</p>
                  </div>
                </div>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {page.inclus.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-charcoal px-3 py-1.5 font-inter-tight text-sm text-foreground/85"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </Volet>

              {/* Prestations de mise en œuvre : tous les volets ouverts au chargement
                  (demande d'Agathe du 2026-09-27). */}
              <Volet numero="02" titre="Pour quelles situations" sousTitre={`« ${situation.phrase.fr} »`} open>
                <ul className="flex flex-col gap-3">
                  {solution.situations.map((item) => (
                    <li
                      key={item}
                      className="border-l-2 border-accent-secondary/60 pl-4 font-inter-tight text-base leading-relaxed text-mid-gray"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 font-inter-tight text-base leading-relaxed text-foreground">{situation.resultat.fr}</p>
              </Volet>

            </ol>
            <p className="px-6 py-5 font-inter-tight text-sm leading-relaxed text-mid-gray lg:px-8">
              Prix du forfait hors taxes, écrit avant de commencer. Le suivi, après les mois inclus, se facture au mois.{" "}
              <Link
                href="/tarifs"
                className="font-mono text-2xs uppercase tracking-[0.08em] text-accent-secondary no-underline hover:text-foreground"
              >
                Tous les tarifs →
              </Link>
            </p>
          </BlueprintSection>
          <Separator />
          {sectionProcessus("№ 02")}
          {sectionPreuve("№ 03")}
        </>
      ) : page.prestation ? (
        <>
          {/* ── Page réduite à la prestation : description, livrables, prix ── */}
          <BlueprintSection tone="jet" id="prestation">
            <div className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
              <SectionHeading
                index="№ 01"
                kicker="La prestation"
                title={
                  <>
                    {situation.offre.fr},{" "}
                    <span className="text-accent-secondary">{formatEuros(budget.total, "fr")} HT</span>
                  </>
                }
                description={page.prestation.description}
              />
            </div>
            <ol>
              {page.prestation.livrables.map((livrable, i) => {
                const numero = (
                  <span className="font-mono text-2xs uppercase tracking-[0.14em] text-accent-secondary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                );
                const entete = (
                  <span className="flex flex-col gap-1">
                    {/* Livrable en accordéon (cartes) : titre d'accordéon, plus grand et en bleu. */}
                    <span
                      className={
                        livrable.cartes
                          ? "text-xl font-light tracking-tight text-accent-secondary"
                          : "text-lg font-light tracking-tight text-foreground"
                      }
                    >
                      {livrable.titre}
                    </span>
                    {livrable.sousTitre && (
                      <span className="font-inter-tight text-sm text-mid-gray">{livrable.sousTitre}</span>
                    )}
                  </span>
                );

                // Deux livrables regroupés : accordéon natif, deux cartes dedans.
                if (livrable.cartes) {
                  return (
                    <li key={livrable.titre} className="border-b border-dark-gray">
                      <details className="group">
                        <summary className="grid cursor-pointer list-none grid-cols-[3rem_minmax(0,1fr)_auto] items-baseline gap-4 px-6 py-6 hover:bg-obsidian md:gap-8 lg:px-8 [&::-webkit-details-marker]:hidden">
                          {numero}
                          {entete}
                          <span
                            aria-hidden="true"
                            className="inline-flex h-9 w-9 items-center justify-center self-center border border-accent-secondary/60 text-accent-secondary transition-[transform,background-color,color] group-open:rotate-45 group-hover:bg-accent-secondary group-hover:text-obsidian"
                          >
                            <Plus size={18} strokeWidth={1.75} />
                          </span>
                        </summary>
                        <div className="grid gap-4 px-6 pb-6 md:grid-cols-2 md:pl-[calc(3rem+4rem)] lg:px-8 lg:pl-[calc(3rem+4.5rem)]">
                          {livrable.cartes.map((carte) => (
                            <div key={carte.titre} className="border border-dark-gray bg-obsidian p-5">
                              <h3 className="text-base font-normal tracking-tight text-foreground">{carte.titre}</h3>
                              <p className="mt-2 font-inter-tight text-sm leading-relaxed text-mid-gray">
                                {carte.detail}
                              </p>
                            </div>
                          ))}
                        </div>
                      </details>
                    </li>
                  );
                }

                return (
                  <li
                    key={livrable.titre}
                    className="grid gap-2 border-b border-dark-gray px-6 py-6 md:grid-cols-[3rem_minmax(0,1fr)_minmax(0,2fr)] md:gap-8 lg:px-8"
                  >
                    {numero}
                    {entete}
                    {livrable.detail && (
                      <p className="font-inter-tight text-base leading-relaxed text-mid-gray">{livrable.detail}</p>
                    )}
                  </li>
                );
              })}
            </ol>
            <p className="px-6 py-5 font-inter-tight text-sm leading-relaxed text-mid-gray lg:px-8">
              Prix hors taxes, écrit avant de commencer.{" "}
              <Link
                href="/tarifs"
                className="font-mono text-2xs uppercase tracking-[0.08em] text-accent-secondary no-underline hover:text-foreground"
              >
                Tous les tarifs →
              </Link>
            </p>
          </BlueprintSection>
          <Separator />
          {sectionPreuve("№ 02")}
        </>
      ) : (
        <>
        {detaille ? (
          <>
            {/* ── Le concept de l'offre ─────────────────────────────────── */}
            {concept && (
              <>
                <BlueprintSection id="concept">
                  <div className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
                    <SectionHeading
                      index={n("concept")}
                      kicker={concept.kicker}
                      title={
                        <>
                          {concept.titre.avant}
                          <span className="text-accent-secondary">{concept.titre.accent}</span>.
                        </>
                      }
                      description={concept.description}
                    />
                  </div>
                  <div className="grid md:grid-cols-3">
                    {concept.points.map((pt) => (
                      <div
                        key={pt.titre}
                        className="border-b border-dark-gray p-6 md:border-b-0 md:border-r md:last:border-r-0 lg:p-8"
                      >
                        <h3 className="text-xl font-light tracking-tight text-foreground">{pt.titre}</h3>
                        <p className="mt-3 font-inter-tight text-base leading-relaxed text-mid-gray">{pt.texte}</p>
                      </div>
                    ))}
                  </div>
                  {concept.perimetre && (
                    <div className="border-t border-dark-gray px-6 py-6 lg:px-8">
                      <p className="font-mono text-2xs uppercase tracking-[0.14em] text-mid-gray">Ce que je prends en charge</p>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {concept.perimetre.map((item) => (
                          <li
                            key={item}
                            className="rounded-full border border-charcoal px-3 py-1.5 font-inter-tight text-sm text-foreground/85"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </BlueprintSection>

                <Separator />
              </>
            )}

            {/* ── Chaque offre détaillée, en accordéon ouvert ───────────── */}
            {offres.map((offre, k) => (
              <React.Fragment key={offre.id}>
                <BlueprintSection tone={k % 2 === 0 ? "jet" : undefined} id={offre.id}>
                  <div className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
                    <SectionHeading
                      index={n(`offre-${offre.id}`)}
                      kicker={offre.kicker}
                      title={
                        <>
                          {offre.titre.avant}
                          <span className="text-accent-secondary">{offre.titre.accent}</span>.
                        </>
                      }
                      description={offre.description}
                    />
                  </div>
                  <ol>
                    {offre.volets.map((v, i) => (
                      <Volet
                        key={v.titre}
                        numero={String(i + 1).padStart(2, "0")}
                        titre={v.titre}
                        sousTitre={v.sousTitre}
                        open={i === 0}
                      >
                        <div className="grid gap-4 md:grid-cols-3">
                          {v.cartes.map((carte) => (
                            <div key={carte.titre} className="border border-dark-gray bg-obsidian p-5">
                              <h3 className="text-base font-normal tracking-tight text-foreground">{carte.titre}</h3>
                              <p className="mt-2 font-inter-tight text-sm leading-relaxed text-mid-gray">{carte.detail}</p>
                            </div>
                          ))}
                        </div>
                      </Volet>
                    ))}
                  </ol>
                </BlueprintSection>

                <Separator />
              </React.Fragment>
            ))}
          </>
        ) : null}

        {/* ── Le processus (réalisation seulement), puis la preuve ────────── */}
        {avecMethode && sectionProcessus(n("processus"))}
        {!page.sansPreuve && sectionPreuve(n("preuve"))}

        {/* ── Les paliers avant la veille (pack Pilotage) ────────────────── */}
        {Paliers && paliersAvant && (
          <>
            <Paliers index={n("paliers")} />
            <Separator />
          </>
        )}

        {/* ── Ce qui distingue le pack : la veille ───────────────────────── */}
        <VeilleBloc lang="fr" index={n("veille")} modes={modes} />

        <Separator />

        {/* ── Le budget, calculé, et ce qui est inclus ───────────────────── */}
        {!page.sansBudget && (
          <>
        <BlueprintSection tone="jet" id="budget">
          <div className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
            <SectionHeading
              index={n("budget")}
              kicker="Le budget"
              title={
                <>
                  {formatEuros(budget.total, "fr")} HT,{" "}
                  <span className="text-accent-secondary">{budget.periode.fr}</span>.
                </>
              }
              description="Un budget plancher, hors taxes, calculé sur les prix publics. Le prix et le délai de votre projet sont écrits avant de commencer."
            />
          </div>
          <dl>
            {budget.lines.map((line) => (
              <div
                key={line.label.fr}
                className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-b border-dark-gray px-6 py-4 lg:px-8"
              >
                <dt className="font-inter-tight text-base text-mid-gray">{line.label.fr}</dt>
                <dd className="text-base text-foreground">
                  {line.display ? line.display.fr : `${formatEuros(line.amount, "fr")} HT`}
                </dd>
              </div>
            ))}
            <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-b border-dark-gray bg-obsidian px-6 py-5 lg:px-8">
              <dt className="text-lg font-light tracking-tight text-foreground">Total, {budget.periode.fr}</dt>
              <dd className="text-xl tracking-tight text-accent-secondary">{formatEuros(budget.total, "fr")} HT</dd>
            </div>
          </dl>
          {budget.variante && (
            <p className="border-b border-dark-gray px-6 py-4 font-inter-tight text-sm leading-relaxed text-mid-gray lg:px-8">
              {budget.variante.label.fr} : {formatEuros(budget.variante.total, "fr")} HT.
            </p>
          )}
          <ul className="flex flex-wrap gap-2 px-6 py-6 lg:px-8">
            {page.inclus.map((item) => (
              <li
                key={item}
                className="rounded-full border border-charcoal px-3 py-1.5 font-inter-tight text-sm text-foreground/85"
              >
                {item}
              </li>
            ))}
          </ul>
          <div className="border-t border-dark-gray px-6 py-5 lg:px-8">
            <Link
              href="/tarifs"
              className="font-mono text-2xs uppercase tracking-[0.08em] text-accent-secondary no-underline hover:text-foreground"
            >
              Tous les tarifs, paliers compris →
            </Link>
          </div>
        </BlueprintSection>

        <Separator />
          </>
        )}

        {/* ── Les paliers du service, pour les deux packs « Gérer » ─────── */}
        {Paliers && !paliersAvant && (
          <>
            <Paliers index={n("paliers")} />
            <Separator />
          </>
        )}

        {/* ── FAQ ───────────────────────────────────────────────────────── */}
        <BlueprintSection id="faq">
          <div className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
            <SectionHeading index={n("faq")} kicker="Questions fréquentes" title="Avant de vous décider" />
          </div>
          <div>
            {page.faq.map((f) => (
              <details key={f.question} className="group border-b border-dark-gray px-6 py-5 last:border-b-0 lg:px-8">
                <summary className="cursor-pointer list-none text-lg font-light tracking-tight text-foreground marker:hidden">
                  {f.question}
                </summary>
                <p className="mt-3 max-w-3xl font-inter-tight text-base leading-relaxed text-mid-gray">{f.answer}</p>
              </details>
            ))}
          </div>
        </BlueprintSection>

        <Separator />
        </>
      )}

      {/* ── Deux boutons, deux températures ────────────────────────────── */}
      <CtaPaire lang="fr" index={trajectoire ? "№ 04" : page.prestation ? "№ 03" : n("cta")} contactHref={page.contactHref} />
    </main>
  );
}
