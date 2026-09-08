"use client";

// Page « CTO externalisé » — offre récurrente de direction technique à temps
// partagé. Ordre de conviction de la charte (§5), en version courte : douleur,
// promesse, ce que ça couvre, prix, garde-fous, parcours, FAQ, CTA de deux
// températures. Tout le texte vient de lib/cto-externalise.ts (source unique) ;
// seul l'habillage vit ici. Tokens DS Blueprint uniquement, i18n inline, a11y.

import { useLocale } from "next-intl";
import { ArrowRight, Check, Minus, CalendarClock, Compass } from "lucide-react";
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
  SIGNALS,
  COVERAGE,
  BOUNDARIES,
  STEPS,
  CTO_FAQ,
  CTO_TLDR,
  CTO_PRICE,
  CTO_COMMITMENT,
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
            ? "Fractional CTO · Shared technical direction"
            : "CTO externalisé · Direction technique à temps partagé"
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
              Des décisions techniques à prendre,{" "}
              <em className="font-normal not-italic text-accent-secondary">
                personne en interne pour les trancher
              </em>
              .
            </>
          )
        }
        description={
          isEn
            ? "A fractional CTO is a technical director on shared time: a few days a month, without an employment contract. One steering call a month, your vendor quotes reviewed, a roadmap kept up to date."
            : "Le CTO externalisé, c'est un directeur technique à temps partagé : quelques jours par mois, sans contrat de travail. Une visio de pilotage par mois, vos devis relus, une roadmap tenue à jour."
        }
        actions={
          <>
            <Link href={CTO_CONTACT_HREF} className={"group " + HERO_BTN_PRIMARY}>
              {isEn ? "Set up a retainer" : "Cadrer un accompagnement"}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a href="#couverture" className={HERO_BTN_SECONDARY}>
              {isEn ? "What it covers" : "Ce que ça couvre"}
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

      {/* § 02 — Pour qui : les signes qu'un pilotage récurrent est la bonne réponse. */}
      <BlueprintSection tone="obsidian" innerClassName="px-6 py-16 lg:px-8 lg:py-20">
        <SectionHeading
          index="№ 02"
          kicker={isEn ? "Who it is for" : "Pour qui"}
          title={isEn ? "The signs you need one" : "Les signes que vous en avez besoin"}
          description={
            isEn
              ? "You do not have a technical profile in-house, but you have to arbitrate, prioritize and secure your web and AI choices continuously. Without hiring, and without depending on a single vendor."
              : "Vous n'avez pas de profil technique en interne, mais vous devez arbitrer, prioriser et sécuriser vos choix web et IA en continu. Sans embaucher, et sans dépendre d'un prestataire unique."
          }
        />
        <Stagger className="mt-10 grid gap-px border border-dark-gray bg-dark-gray sm:grid-cols-2">
          {SIGNALS.map((signal) => (
            <StaggerItem key={signal.fr} className="flex items-start gap-3 bg-obsidian p-6">
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-secondary" />
              <span className="font-inter-tight text-sm leading-relaxed text-mid-gray">
                {signal[lang]}
              </span>
            </StaggerItem>
          ))}
        </Stagger>
      </BlueprintSection>
      <Separator />

      {/* § 03 — Ce que couvre l'abonnement. */}
      <BlueprintSection id="couverture" tone="jet" innerClassName="px-6 py-16 lg:px-8 lg:py-20">
        <SectionHeading
          index="№ 03"
          kicker={isEn ? "What it covers" : "Ce que ça couvre"}
          title={
            isEn ? "Your technical direction, every month" : "Votre direction technique, chaque mois"
          }
          description={
            isEn
              ? "Not a fixed number of hours to burn: a role held continuously, with one appointment a month to anchor it."
              : "Pas un quota d'heures à consommer : un rôle tenu en continu, avec un rendez-vous mensuel pour l'ancrer."
          }
        />
        <Stagger className="mt-10 grid gap-px border border-dark-gray bg-dark-gray md:grid-cols-2 lg:grid-cols-3">
          {COVERAGE.map((item, i) => (
            <StaggerItem key={item.fr.title} className="bg-jet p-6 lg:p-8">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-vermilion">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-lg font-light tracking-tight text-foreground">
                {item[lang].title}
              </h3>
              <p className="mt-2 font-inter-tight text-sm leading-relaxed text-mid-gray">
                {item[lang].body}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </BlueprintSection>
      <Separator />

      {/* § 04 — Prix et engagement : une seule décision, affichée en clair. */}
      <BlueprintSection tone="obsidian" innerClassName="px-6 py-16 lg:px-8 lg:py-20">
        <SectionHeading
          index="№ 04"
          kicker={isEn ? "Price and commitment" : "Prix et engagement"}
          title={isEn ? "A displayed price, no time sheet" : "Un prix affiché, sans décompte d'heures"}
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="flex flex-col gap-4 border border-vermilion bg-jet p-6 lg:p-8">
            <span className="self-start border border-vermilion px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-vermilion">
              {isEn ? "Recurring" : "Récurrent"}
            </span>
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-3xl font-light tracking-tight text-foreground">
                {price.amount}
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.08em] text-mid-gray">
                {price.period}
              </span>
            </div>
            <p className="font-inter-tight text-sm leading-relaxed text-foreground">
              {CTO_COMMITMENT[lang]}.{" "}
              {isEn
                ? "The perimeter is scoped and the price fixed before the first call."
                : "Le périmètre est cadré et le tarif fixé avant la première visio."}
            </p>
            <Link
              href={CTO_CONTACT_HREF}
              className="group mt-auto flex w-full items-center justify-center gap-1.5 border border-accent-secondary bg-accent-secondary px-5 py-3 font-mono text-xs uppercase tracking-[0.06em] text-obsidian no-underline transition-colors hover:bg-accent-secondary/85"
            >
              {isEn ? "Set up a retainer" : "Cadrer un accompagnement"}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Garde-fous : ce que l'offre n'est pas. Rassure avant de demander. */}
          <div className="flex flex-col gap-4 border border-dark-gray bg-jet p-6 lg:p-8">
            <h3 className="text-lg font-medium text-foreground">
              {isEn ? "What it is not" : "Ce que ce n'est pas"}
            </h3>
            <ul className="flex flex-col gap-3">
              {BOUNDARIES.map((boundary) => (
                <li key={boundary.fr} className="flex items-start gap-2.5">
                  <Minus className="mt-0.5 h-4 w-4 flex-shrink-0 text-mid-gray" />
                  <span className="font-inter-tight text-sm leading-relaxed text-mid-gray">
                    {boundary[lang]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </BlueprintSection>
      <Separator />

      {/* § 05 — Comment ça démarre. */}
      <BlueprintSection tone="jet" innerClassName="px-6 py-16 lg:px-8 lg:py-20">
        <SectionHeading
          index="№ 05"
          kicker={isEn ? "How it starts" : "Comment ça démarre"}
          title={isEn ? "From first message to monthly rhythm" : "Du premier message au rythme mensuel"}
        />
        <Stagger className="mt-10 grid gap-px border border-dark-gray bg-dark-gray sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <StaggerItem key={step.fr.title} className="bg-jet p-6 lg:p-8">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-vermilion">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-lg font-light tracking-tight text-foreground">
                {step[lang].title}
              </h3>
              <p className="mt-2 font-inter-tight text-sm leading-relaxed text-mid-gray">
                {step[lang].body}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </BlueprintSection>
      <Separator />

      {/* § 06 — FAQ. Le schéma FAQPage est porté par la route (page.tsx). */}
      <BlueprintSection tone="jet" innerClassName="px-6 py-16 lg:px-8 lg:py-20">
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
      <Separator />

      {/* § 07 — Deux CTA de deux températures (charte §5.7) + repli vers le conseil ponctuel. */}
      <BlueprintSection tone="obsidian" innerClassName="px-6 py-16 lg:px-8 lg:py-20">
        <SectionHeading
          index="№ 07"
          kicker={isEn ? "Where to start" : "Par où commencer"}
          title={
            isEn
              ? "A recurring retainer, or a one-off opinion"
              : "Un accompagnement récurrent, ou un avis ponctuel"
          }
          description={
            isEn
              ? "If decisions come up every month, the retainer is the right answer. If a single direction has to be settled, the advisory call is enough."
              : "Si les décisions reviennent tous les mois, l'accompagnement est la bonne réponse. Si une seule direction est à trancher, la visio conseil suffit."
          }
        />
        <div className="mt-10 grid gap-px border border-dark-gray bg-dark-gray md:grid-cols-2">
          <Link
            href="/conseil"
            className="group flex flex-col gap-2 bg-obsidian p-6 no-underline lg:p-8"
          >
            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-accent-secondary">
              <Compass className="h-3.5 w-3.5" />
              {isEn ? "One-off advice" : "Conseil ponctuel"}
            </span>
            <span className="text-lg font-light tracking-tight text-foreground">
              {isEn
                ? "Advisory call (€150) or audit + roadmap (€650)"
                : "Visio conseil (150 €) ou audit + roadmap (650 €)"}
            </span>
            <span className="font-inter-tight text-sm leading-relaxed text-mid-gray">
              {isEn
                ? "Stay, decouple or rebuild: a written opinion within 48h, before any budget."
                : "Rester, découpler ou refonder : un avis écrit sous 48 h, avant tout budget."}
            </span>
            <span className="mt-2 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.06em] text-foreground">
              {isEn ? "See the advice" : "Voir le conseil"}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
          <Link
            href={CTO_CONTACT_HREF}
            className="group flex flex-col gap-2 bg-obsidian p-6 no-underline lg:p-8"
          >
            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-vermilion">
              <CalendarClock className="h-3.5 w-3.5" />
              {isEn ? "Recurring retainer" : "Accompagnement récurrent"}
            </span>
            <span className="text-lg font-light tracking-tight text-foreground">
              {isEn ? "Fractional CTO" : "CTO externalisé"}
            </span>
            <span className="font-inter-tight text-sm leading-relaxed text-mid-gray">
              {isEn
                ? `${price.amount} ${price.period}. ${CTO_COMMITMENT.en}.`
                : `${price.amount} ${price.period}. ${CTO_COMMITMENT.fr}.`}
            </span>
            <span className="mt-2 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.06em] text-foreground">
              {isEn ? "Set up a retainer" : "Cadrer un accompagnement"}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link href="/audit-site-web" className={"group " + HERO_BTN_PRIMARY}>
            {isEn
              ? "See what slows your site down in 2 minutes"
              : "Voyez ce qui ralentit votre site en 2 minutes"}
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link href="/contact" className={HERO_BTN_SECONDARY}>
            {isEn ? "Let's talk about your project" : "Discutons de votre projet"}
          </Link>
        </div>
      </BlueprintSection>
    </main>
  );
}
