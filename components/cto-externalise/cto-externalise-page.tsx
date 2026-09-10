"use client";

// Page « Expert technique externalisé » — offre récurrente de direction technique à temps
// partagé. Ordre de conviction de la charte (§5) : douleur, promesse, rôle
// expliqué, paliers, livrables, périmètre, bannière « Commencer », FAQ.
// Tout le texte vient de lib/cto-externalise.ts (source unique) ; seul l'habillage vit ici.
// Tokens DS Blueprint uniquement, i18n inline, a11y.

import { useLocale } from "next-intl";
import { ArrowRight, Check, Plus } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { BlueprintSection, SectionHeading, Separator } from "@/components/aspect/section";
import {
  PageHero,
  HERO_BTN_PRIMARY,
  HERO_BTN_SECONDARY,
} from "@/components/aspect/page-hero";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import {
  CTO_PROCESS,
  CTO_TIERS,
  CTO_TIER_ROWS,
  CTO_TERMS,
  DELIVERABLES,
  PERIMETER,
  CTO_FAQ,
  CTO_TLDR,
  CTO_PRICE,
  CTO_CONTACT_HREF,
} from "@/lib/cto-externalise";

export default function CtoExternalisePage() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const lang = isEn ? "en" : "fr";
  const price = CTO_PRICE[lang];

  return (
    <main>
      {/* § 01 — Héros : la douleur d'abord, le nom de l'offre traduit juste après. */}
      <PageHero
        index="№ 01"
        kicker={
          isEn
            ? "Outsourced technical expert · Shared technical direction"
            : "Expert technique externalisé · Direction technique à temps partagé"
        }
        title={
          isEn ? (
            <>
              Technical decisions to make,{" "}
              <em className="font-normal not-italic text-accent-secondary">
                nobody in-house to settle them
              </em>
              .
            </>
          ) : (
            <>
              Direction technique,{" "}
              <em className="font-normal not-italic text-accent-secondary">
                externalisée
              </em>
              .
            </>
          )
        }
        description={
          isEn
            ? "An outsourced technical expert is technical direction on shared time for your customer-facing digital estate: someone who decides, writes it down, steers your vendors and answers for what is decided. A few days a month, without hiring."
            : "L'expert technique externalisé, c'est une direction technique à temps partagé pour votre numérique visible : quelqu'un qui décide, l'écrit, pilote vos prestataires et répond de ce qui est décidé. Quelques jours par mois, sans recruter."
        }
        actions={
          <>
            <Link href={CTO_CONTACT_HREF} className={"group " + HERO_BTN_PRIMARY}>
              {isEn ? "Set up a retainer" : "Cadrer un accompagnement"}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a href="#paliers" className={HERO_BTN_SECONDARY}>
              {isEn ? "See the two tiers" : "Voir les deux paliers"}
            </a>
          </>
        }
        note={
          isEn
            ? `${price.amount} ${price.period} · Reply within 48h · Single point of contact`
            : `${price.amount} ${price.period} · Réponse sous 48 h · Interlocutrice unique`
        }
      />

      {/* § 01b — « En bref » : TL;DR autoportant, citable tel quel par les
          moteurs de réponse (même gabarit que la home et /a-propos). Le texte
          vient de CTO_TLDR : rendu visible et fichiers llms disent la même chose. */}
      <BlueprintSection tone="obsidian" innerClassName="px-6 py-8 lg:px-10 lg:py-10">
        <Reveal
          as="aside"
          className="cto-tldr border border-l-[3px] border-dark-gray border-l-accent-secondary bg-jet/40 px-6 py-5 lg:px-8"
        >
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-accent-secondary">
            {CTO_TLDR.label[lang]}
          </p>
          <ul className="flex flex-col gap-2">
            {CTO_TLDR.lines.map((line) => (
              <li
                key={line.fr}
                className="font-inter-tight text-sm leading-relaxed text-mid-gray md:text-[15px]"
              >
                {line[lang]}
              </li>
            ))}
          </ul>
        </Reveal>
      </BlueprintSection>
      <Separator />

      {/* § 02 — Ce qu'est un expert technique externalisé, montré par le COMMENT : le mois
          type en timeline, une étape par rythme. Arbitrage : la section ne
          plaide pas (« pourquoi ») et ne trie pas (« pour qui »), elle montre le
          fonctionnement. Le « pour qui » et le « pourquoi » se traitent en FAQ.
          Texte : CTO_PROCESS. Le périmètre ferme la section, en bandeau. */}
      <BlueprintSection tone="obsidian" innerClassName="px-6 py-16 lg:px-8 lg:py-20">
        <SectionHeading
          index="№ 02"
          kicker={isEn ? "The role, in practice" : "Le service"}
          title={isEn ? "What an outsourced technical expert is" : "L'expert technique externalisé, en pratique"}
          description={
            isEn
              ? "Technical direction on shared time, for a company that has none in-house. Here is the month, step by step, once it is running."
              : "Une direction technique à temps partagé, pour une structure qui n'en a pas en interne. Voici le mois type, une fois en place."
          }
        />
        {/* Timeline : la périodicité forme une COLONNE à gauche du rail, cadrée
            à droite contre lui. Le lecteur balaie les rythmes (chaque mois, en
            continu, sous 24 h) sans lire les intitulés, puis entre dans le
            détail. Le rail s'arrête au dernier repère au lieu de descendre dans
            le vide. */}
        <Stagger stagger={0.08} className="mt-10">
          {CTO_PROCESS.map((step, i) => {
            const isLast = i === CTO_PROCESS.length - 1;
            return (
              <StaggerItem
                key={step.id}
                className="grid gap-x-8 gap-y-1 lg:grid-cols-[10rem_1fr]"
              >
                <span className="font-mono text-[11px] uppercase leading-5 tracking-[0.14em] text-accent-secondary lg:pt-1 lg:text-right">
                  {step.when[lang]}
                </span>
                <div
                  className={
                    "relative border-l pl-6 " +
                    (isLast ? "border-l-transparent pb-0" : "border-dark-gray pb-9")
                  }
                >
                  <span
                    aria-hidden
                    className="absolute -left-1 top-1.5 h-2 w-2 rotate-45 bg-vermilion"
                  />
                  <h3 className="text-lg font-light leading-tight tracking-tight text-foreground md:text-xl">
                    {step[lang].title}
                  </h3>
                  <p className="mt-2 max-w-2xl font-inter-tight text-sm leading-relaxed text-mid-gray">
                    {step[lang].body}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>

        {/* Le périmètre, en bandeau balayable : il dit sur quoi porte le rôle,
            donc il complète la définition plutôt que les livrables. Énoncé par
            ce qu'il COUVRE (arbitrage du 2026-09-08) ; les limites se traitent
            en FAQ, jamais en section mise en avant. */}
        <Reveal className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border border-l-[3px] border-dark-gray border-l-accent-secondary bg-jet/40 px-6 py-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent-secondary">
            {isEn ? "Scope" : "Le périmètre"}
          </span>
          {PERIMETER.map((item) => (
            <span
              key={item.fr}
              className="flex items-center gap-2 font-inter-tight text-sm text-mid-gray"
            >
              <Check className="h-3.5 w-3.5 flex-shrink-0 text-accent-secondary" />
              {item[lang]}
            </span>
          ))}
        </Reveal>
      </BlueprintSection>
      <Separator />

      {/* § 03 — Les deux paliers. Le troisième palier de la synthèse d'offre
          (Renforcée) n'est pas publié : il se cadre en conversation. Le
          comparatif défile horizontalement sur petit écran plutôt que de
          compresser les colonnes. */}
      <BlueprintSection id="paliers" tone="jet" innerClassName="px-6 py-16 lg:px-8 lg:py-20">
        <SectionHeading
          index="№ 03"
          kicker={isEn ? "The two tiers" : "Les deux paliers"}
          title={isEn ? "A displayed price, no time sheet" : "Un prix affiché, sans décompte d'heures"}
          description={
            isEn
              ? "Two tiers, depending on how much your systems ask of you. Same role, same deliverables: what changes is the pace and the depth of the vendor management."
              : "Deux paliers, selon ce que votre système vous demande. Même rôle, mêmes livrables : ce qui change, c'est le rythme et la profondeur du pilotage des prestataires."
          }
        />

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {CTO_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={
                "flex flex-col gap-4 border bg-jet p-6 lg:p-8 " +
                (tier.featured ? "border-vermilion" : "border-dark-gray")
              }
            >
              {tier.featured && (
                <span className="self-start border border-vermilion px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-vermilion">
                  {isEn ? "The common case" : "Le cas courant"}
                </span>
              )}
              <h3 className="text-lg font-medium text-foreground">{tier.name[lang]}</h3>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-3xl font-light tracking-tight text-foreground">
                  {tier.priceLabel[lang]}
                </span>
                <span className="font-mono text-xs uppercase tracking-[0.08em] text-mid-gray">
                  {isEn ? "per month" : "par mois"}
                </span>
              </div>
              <p className="font-inter-tight text-sm leading-relaxed text-mid-gray">
                {tier.forWho[lang]}
              </p>
              <Link
                href={CTO_CONTACT_HREF}
                className={
                  "group mt-auto flex w-full items-center justify-center gap-1.5 px-5 py-3 font-mono text-xs uppercase tracking-[0.06em] no-underline transition-colors " +
                  (tier.featured
                    ? "border border-accent-secondary bg-accent-secondary text-obsidian hover:bg-accent-secondary/85"
                    : "border border-dark-gray text-foreground hover:border-mid-gray")
                }
              >
                {isEn ? "Set up a retainer" : "Cadrer un accompagnement"}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          ))}
        </div>

        {/* Comparatif ligne à ligne. */}
        <div className="mt-4 overflow-x-auto">
          <div className="grid min-w-[38rem] gap-px border border-dark-gray bg-dark-gray">
            <div className="grid grid-cols-[minmax(11rem,1.3fr)_1fr_1fr] gap-px bg-dark-gray">
              <div className="bg-obsidian px-4 py-3" />
              {CTO_TIERS.map((tier) => (
                <div key={tier.id} className="bg-obsidian px-4 py-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent-secondary">
                    {tier.name[lang]}
                  </span>
                </div>
              ))}
            </div>
            {CTO_TIER_ROWS.map((row) => (
              <div
                key={row.label.fr}
                className="grid grid-cols-[minmax(11rem,1.3fr)_1fr_1fr] gap-px bg-dark-gray"
              >
                <div className="bg-jet px-4 py-3">
                  <span className="font-inter-tight text-sm text-foreground">
                    {row.label[lang]}
                  </span>
                </div>
                {row.values.map((value, i) => (
                  <div key={CTO_TIERS[i].id} className="bg-jet px-4 py-3">
                    <span className="font-inter-tight text-sm text-mid-gray">{value[lang]}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Conditions communes aux deux paliers. */}
        <ul className="mt-4 flex flex-col gap-3 border border-l-[3px] border-dark-gray border-l-accent-secondary bg-obsidian/40 px-6 py-5">
          {CTO_TERMS.map((term) => (
            <li key={term.fr} className="flex items-start gap-2.5">
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-secondary" />
              <span className="font-inter-tight text-sm leading-relaxed text-mid-gray">
                {term[lang]}
              </span>
            </li>
          ))}
        </ul>
      </BlueprintSection>
      <Separator />

      {/* § 04 — Les livrables, en accordéon : huit titres scannables d'un
          coup d'œil, le détail à la demande. Ce sont eux qui distinguent une
          direction technique d'un abonnement au conseil : le client repart avec
          des documents opposables. Le périmètre, lui, a rejoint la § 02 : il éclaire
          la définition du rôle, pas les documents. */}
      <BlueprintSection id="livrables" tone="obsidian" innerClassName="px-6 py-16 lg:px-8 lg:py-20">
        <SectionHeading
          index="№ 04"
          kicker={isEn ? "Deliverables" : "suivi en continu"}
          title={
            isEn ? "What proves the direction was held" : "Les livrables"
          }
          description={
            isEn
              ? "Not the memory of a conversation: documents that belong to you, read without me, and can be held up to any vendor."
              : "Pas le souvenir d'une conversation : des documents qui vous appartiennent, se lisent sans moi et s'opposent à n'importe quel prestataire."
          }
        />
        {/* Accordéon natif <details> : même motif que la FAQ de la home, donc
            rendu serveur, accessible au clavier et sans JS. Les huit titres
            restent lus d'un coup d'œil, le détail s'ouvre à la demande ; le
            texte reste dans le DOM, donc indexable et citable. */}
        <Stagger className="mt-10 border-t border-dark-gray">
          {DELIVERABLES.map((item, i) => (
            <StaggerItem
              as="details"
              key={item.fr.title}
              className="group border-b border-dark-gray"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 [&::-webkit-details-marker]:hidden">
                <span className="flex items-baseline gap-4">
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-vermilion">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-inter-tight text-[15px] font-regular text-foreground md:text-base">
                    {item[lang].title}
                  </h3>
                </span>
                <Plus
                  size={16}
                  className="shrink-0 text-mid-gray transition-transform group-open:rotate-45"
                />
              </summary>
              <p className="max-w-3xl pb-6 pl-9 font-inter-tight text-sm leading-relaxed text-mid-gray">
                {item[lang].body}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </BlueprintSection>
      <Separator />

      {/* § 05 — Bannière « Commencer ». Remplace le parcours en trois étapes,
          retiré le 2026-09-08 : la seule marche à connaître avant d'écrire,
          c'est l'audit préalable ; le reste se dit en conversation. Elle porte
          aussi les deux températures de CTA exigées par la charte §5.7, la
          section de clôture ayant été supprimée. */}
      <BlueprintSection tone="jet" innerClassName="px-6 py-12 lg:px-8 lg:py-16">
        <Reveal className="flex flex-col gap-8 border border-l-[3px] border-dark-gray border-l-accent-secondary bg-obsidian/40 px-6 py-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div className="max-w-xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent-secondary">
              {isEn ? "Getting started" : "Commencer"}
            </p>
            <h2 className="mt-3 text-2xl font-light tracking-tight text-foreground md:text-3xl">
              {isEn
                ? "You describe your situation, I reply within 48h"
                : "Vous décrivez votre situation, je réponds sous 48 h"}
            </h2>
            <p className="mt-3 font-inter-tight text-sm leading-relaxed text-mid-gray">
              {isEn ? (
                <>
                  Every retainer starts with the audit and roadmap (€650 excl. VAT, three weeks).
                  A single decision to settle?{" "}
                  <Link href="/conseil" className="text-foreground underline underline-offset-4">
                    The one-off advice
                  </Link>{" "}
                  is enough.
                </>
              ) : (
                <>
                  Tout accompagnement démarre par l'audit + roadmap (650 € HT, trois semaines).
                  Une seule décision à trancher ?{" "}
                  <Link href="/conseil" className="text-foreground underline underline-offset-4">
                    Le conseil ponctuel
                  </Link>{" "}
                  suffit.
                </>
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 lg:flex-shrink-0">
            <Link href={CTO_CONTACT_HREF} className={"group " + HERO_BTN_PRIMARY}>
              {isEn ? "Set up a retainer" : "Cadrer un accompagnement"}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href="/audit-site-web" className={HERO_BTN_SECONDARY}>
              {isEn ? "Book my free audit" : "Réserver mon audit gratuit"}
            </Link>
          </div>
        </Reveal>
      </BlueprintSection>
      <Separator />

      {/* § 06 — FAQ. Le schéma FAQPage est porté par la route (page.tsx). */}
      <BlueprintSection tone="obsidian" innerClassName="px-6 py-16 lg:px-8 lg:py-20">
        <SectionHeading
          index="№ 06"
          kicker="FAQ"
          title={isEn ? "Frequently asked questions" : "Questions fréquentes"}
        />
        <div className="mt-10 grid gap-px border border-dark-gray bg-dark-gray md:grid-cols-2">
          {CTO_FAQ.map((item) => {
            const c = item[lang];
            return (
              <div key={c.q} className="bg-jet p-6 lg:p-8">
                <h3 className="text-base font-medium text-foreground">{c.q}</h3>
                <p className="mt-3 font-inter-tight text-sm leading-relaxed text-mid-gray">{c.a}</p>
              </div>
            );
          })}
        </div>
      </BlueprintSection>
    </main>
  );
}
