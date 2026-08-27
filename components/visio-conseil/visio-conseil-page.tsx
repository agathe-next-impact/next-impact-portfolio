"use client";

// Page « Conseil » — charte éditoriale (DIRECTIVES-CHARTE-EDITORIALE.md §6) :
// porte d'entrée payante à faible engagement, réservée aux DEUX offres de
// conseil du catalogue (Visio conseil refonte 150 € · Audit + roadmap 650 €).
// La page se termine par le lien vers les trois trajectoires et deux CTA de
// deux températures. Tokens DS Blueprint uniquement, i18n inline, a11y.

import { useLocale } from "next-intl";
import {
  ArrowRight,
  ShieldCheck,
  FileText,
  Video,
  Receipt,
  CalendarCheck,
  Check,
} from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { BlueprintSection, SectionHeading, Separator } from "@/components/aspect/section";
import {
  PageHero,
  HERO_BTN_PRIMARY,
  HERO_BTN_SECONDARY,
} from "@/components/aspect/page-hero";
import { Stagger, StaggerItem } from "@/components/ui/reveal";
import { ConstellationTechno } from "@/components/visuals/constellation-techno";
import { OFFERS, FAQ, type ConseilOffer } from "@/lib/visio-conseil";

function OfferCard({ offer, isEn }: { offer: ConseilOffer; isEn: boolean }) {
  const copy = isEn ? offer.en : offer.fr;
  const tier = offer.tiers[0];
  const ctaLabel = offer.cta
    ? isEn
      ? offer.cta.en
      : offer.cta.fr
    : isEn
      ? "Book & pay"
      : "Réserver et payer";
  const ctaClass =
    "group mt-auto flex w-full items-center justify-center gap-1.5 px-5 py-3 font-mono text-xs uppercase tracking-[0.06em] no-underline transition-colors " +
    (offer.featured
      ? "border border-accent-secondary bg-accent-secondary text-obsidian hover:bg-accent-secondary/85"
      : "border border-dark-gray text-foreground hover:border-mid-gray");

  const tag = copy.tag ? (
    <span className="absolute right-4 top-4 border border-vermilion px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-vermilion">
      {copy.tag}
    </span>
  ) : null;

  const cta = offer.internalCta ? (
    <Link href={tier.calendlyUrl} className={ctaClass}>
      {ctaLabel}
      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
    </Link>
  ) : (
    <a href={tier.calendlyUrl} target="_blank" rel="noopener noreferrer" className={ctaClass}>
      {ctaLabel}
      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
    </a>
  );

  return (
    <div
      className={
        "relative flex flex-col gap-4 border bg-jet p-6 lg:p-8 " +
        (offer.featured ? "border-vermilion" : "border-dark-gray")
      }
    >
      {tag}
      <div>
        <h3 className="pr-20 text-lg font-medium text-foreground">{copy.name}</h3>
        <p className="mt-1 font-inter-tight text-sm text-mid-gray">{copy.tagline}</p>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-light tracking-tight text-foreground">{tier.price}</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-mid-gray">HT</span>
        <span className="font-mono text-xs text-mid-gray">
          · {isEn ? tier.duration.en : tier.duration.fr}
        </span>
      </div>
      {offer.credited && (
        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-accent-secondary">
          {isEn ? "Deducted from your project quote" : "Déduit du devis projet"}
        </p>
      )}
      <p className="font-inter-tight text-sm leading-relaxed text-foreground">{copy.forWho}</p>
      <ul className="mt-1 flex flex-col gap-2.5 border-t border-dark-gray pt-4">
        {copy.bullets.map((b) => (
          <li key={b} className="flex items-start gap-2.5">
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-secondary" />
            <span className="font-inter-tight text-sm leading-snug text-mid-gray">{b}</span>
          </li>
        ))}
      </ul>
      {cta}
    </div>
  );
}

export default function VisioConseilPage() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";

  const steps = isEn
    ? [
        ["You choose", "Pick the depth that matches the stakes: a one-hour call to settle a direction, or a full audit with its roadmap."],
        ["You send context", "Share the site, quote, proposal or project notes so I can prepare the useful questions."],
        ["You receive it in writing", "Video call, analysis, then a written opinion or the audit deliverables: recommendation, risks and the advised next step."],
      ]
    : [
        ["Vous choisissez", "Sélectionnez la profondeur adaptée à l'enjeu : une heure de visio pour trancher une direction, ou l'audit complet avec sa roadmap."],
        ["Vous envoyez le contexte", "Partagez le site, le devis, la proposition ou les notes projet pour préparer les bonnes questions."],
        ["Vous recevez l'écrit", "Visio, analyse, puis l'avis écrit ou les livrables de l'audit : recommandation, risques et prochaine étape conseillée."],
      ];

  const reassurance: Array<[typeof ShieldCheck, string]> = isEn
    ? [
        [Receipt, "Advisory call deducted from your project quote"],
        [CalendarCheck, "Book and pay online, instant confirmation"],
        [Video, "Real video call with screen sharing, not a chatbot"],
        [FileText, "Written opinion or deliverables after the call"],
        [ShieldCheck, "Reschedule or cancel up to 24h before"],
      ]
    : [
        [Receipt, "Visio conseil déduite du devis projet"],
        [CalendarCheck, "Réservation et paiement en ligne, confirmation immédiate"],
        [Video, "Vraie visio avec partage d'écran, pas un chatbot"],
        [FileText, "Avis écrit ou livrables après l'appel"],
        [ShieldCheck, "Report ou annulation possible jusqu'à 24 h avant"],
      ];

  const trajectories = isEn
    ? [
        {
          name: "Consolidate",
          offer: "Optimized WordPress redesign",
          when: "The problem is the theme and the plugin pile-up, not WordPress.",
          price: "From €2,250 excl. VAT",
          recommended: false,
        },
        {
          name: "Decouple",
          offer: "Headless WordPress redesign: your editors keep publishing in WordPress, your visitors see a fast, modern site",
          when: "The site is slow and the editorial team is settled in.",
          price: "From €4,000 excl. VAT",
          recommended: true,
        },
        {
          name: "Rebuild",
          offer: "Web app, platform or mobile application",
          when: "The site has become a working tool.",
          price: "From €6,500 excl. VAT",
          recommended: false,
        },
      ]
    : [
        {
          name: "Consolider",
          offer: "Refonte WordPress optimisée",
          when: "Le problème, c'est le thème et l'empilement de plugins, pas WordPress.",
          price: "À partir de 2 250 € HT",
          recommended: false,
        },
        {
          name: "Découpler",
          offer: "Refonte WordPress headless : vos rédacteurs continuent de publier dans WordPress, vos visiteurs voient un site rapide et moderne",
          when: "Le site est lent, l'équipe éditoriale est installée.",
          price: "À partir de 4 000 € HT",
          recommended: true,
        },
        {
          name: "Refonder",
          offer: "Web app, plateforme ou application mobile",
          when: "Le site est devenu un outil de travail.",
          price: "À partir de 6 500 € HT",
          recommended: false,
        },
      ];

  return (
    <main>
      {/* § 01 — Hero */}
      <PageHero
        index="№ 01"
        kicker={isEn ? "Redesign advice · Two entry points" : "Conseil refonte · Deux portes d'entrée"}
        backdrop={
          /* Constellation projet ↔ technos : la métaphore du conseil. */
          <div className="absolute -right-24 top-1/2 hidden w-[560px] -translate-y-1/2 opacity-20 lg:block">
            <ConstellationTechno showTags={false} />
          </div>
        }
        title={
          isEn ? (
            <>
              A clear-cut opinion{" "}
              <em className="font-normal not-italic text-accent-secondary">
                before you commit a budget
              </em>
              .
            </>
          ) : (
            <>
              Un avis tranché{" "}
              <em className="font-normal not-italic text-accent-secondary">
                avant d'engager un budget
              </em>
              .
            </>
          )
        }
        description={
          isEn
            ? "Your site is aging and the trajectory is still open: stay, decouple or rebuild. Two independent advisory formats, at a displayed price, before any quote."
            : "Votre site vieillit et la trajectoire reste à trancher : rester, découpler ou refonder. Deux formats de conseil indépendant, au prix affiché, avant tout devis."
        }
        actions={
          <>
            <a href="#conseils" className={"group " + HERO_BTN_PRIMARY}>
              {isEn ? "Book the advisory call" : "Réserver la visio conseil"}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <a href="#comment" className={HERO_BTN_SECONDARY}>
              {isEn ? "How it works" : "Comment ça marche"}
            </a>
          </>
        }
        note={
          isEn
            ? "Written opinion · Displayed prices · Reply within 48h"
            : "Avis écrit · Prix affichés · Réponse sous 48 h"
        }
      />
      <Separator />

      {/* § 02 — Les deux offres de conseil */}
      <BlueprintSection id="conseils" tone="obsidian" innerClassName="px-6 py-16 lg:px-8 lg:py-20">
        <SectionHeading
          index="№ 02"
          kicker={isEn ? "Two advisory offers" : "Deux offres de conseil"}
          title={isEn ? "The call settles, the audit documents" : "La visio tranche, l'audit documente"}
          description={
            isEn
              ? "The cost of a wrong trajectory is counted in months; the cost of the advice, in euros. One hour to settle a direction, or a full audit with costed recommendations and a step-by-step roadmap."
              : "Le coût d'une mauvaise trajectoire se compte en mois ; celui de l'avis, en euros. Une heure pour trancher une direction, ou un audit complet avec préconisations chiffrées et roadmap par étapes."
          }
        />
        <Stagger className="mt-10 grid gap-4 md:grid-cols-2">
          {OFFERS.map((offer) => (
            <StaggerItem key={offer.id}>
              <OfferCard offer={offer} isEn={isEn} />
            </StaggerItem>
          ))}
        </Stagger>
        <p className="mt-6 max-w-3xl font-inter-tight text-sm leading-relaxed text-mid-gray">
          {isEn
            ? "Prices excl. VAT. The advisory call is fully deducted from your quote if a project starts within 30 days. The audit + roadmap is a standalone deliverable: it serves you even if the work goes to someone else."
            : "Prix HT. La visio conseil est déduite à 100 % de votre devis si un projet démarre sous 30 jours. L'audit + roadmap est un livrable à part entière : il vous sert même si la prestation est confiée à quelqu'un d'autre."}
        </p>

        {/* Engagements — réassurance sous les offres */}
        <div className="mt-10 grid gap-px border border-dark-gray bg-dark-gray sm:grid-cols-2 lg:grid-cols-3">
          {reassurance.map(([Icon, label]) => (
            <div key={label} className="flex items-start gap-3 bg-obsidian p-5">
              <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-secondary" />
              <span className="font-inter-tight text-sm leading-snug text-mid-gray">{label}</span>
            </div>
          ))}
        </div>
      </BlueprintSection>
      <Separator />

      {/* § 03 — Comment ça marche */}
      <BlueprintSection id="comment" tone="jet" innerClassName="px-6 py-16 lg:px-8 lg:py-20">
        <SectionHeading
          index="№ 03"
          kicker={isEn ? "How it works" : "Comment ça marche"}
          title={isEn ? "From request to written opinion" : "De la demande à l'avis écrit"}
        />
        <Stagger className="mt-10 grid gap-px border border-dark-gray bg-dark-gray sm:grid-cols-3">
          {steps.map(([title, desc], i) => (
            <StaggerItem key={title} className="bg-jet p-6 lg:p-8">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-vermilion">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-lg font-light tracking-tight text-foreground">{title}</h3>
              <p className="mt-2 font-inter-tight text-sm leading-relaxed text-mid-gray">{desc}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </BlueprintSection>
      <Separator />

      {/* § 04 — FAQ */}
      <BlueprintSection tone="jet" innerClassName="px-6 py-16 lg:px-8 lg:py-20">
        <SectionHeading
          index="№ 04"
          kicker="FAQ"
          title={isEn ? "Frequently asked questions" : "Questions fréquentes"}
        />
        <div className="mt-10 grid gap-px border border-dark-gray bg-dark-gray md:grid-cols-2">
          {FAQ.map((item) => {
            const c = isEn ? item.en : item.fr;
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

      {/* § 05 — La suite : les trois trajectoires + deux CTA de deux températures */}
      <BlueprintSection tone="obsidian" innerClassName="px-6 py-16 lg:px-8 lg:py-20">
        <SectionHeading
          index="№ 05"
          kicker={isEn ? "What comes next" : "La suite"}
          title={
            isEn
              ? "Three trajectories for an aging WordPress site"
              : "Trois trajectoires pour un site WordPress qui vieillit"
          }
          description={
            isEn
              ? "The advice leads to a direction. The direction leads to one of three trajectories, each with a displayed starting price and a committed timeline."
              : "Le conseil débouche sur une direction. La direction débouche sur l'une des trois trajectoires, chacune avec un prix de départ affiché et un délai annoncé."
          }
        />
        <Stagger className="mt-10 grid gap-4 md:grid-cols-3">
          {trajectories.map((traj) => (
            <StaggerItem
              key={traj.name}
              className={
                "relative flex flex-col gap-3 border bg-jet p-6 " +
                (traj.recommended ? "border-vermilion" : "border-dark-gray")
              }
            >
              {traj.recommended && (
                <span className="absolute right-4 top-4 border border-vermilion px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-vermilion">
                  {isEn ? "Recommended" : "Recommandée"}
                </span>
              )}
              <h3 className="text-lg font-medium text-foreground">{traj.name}</h3>
              <p className="font-inter-tight text-sm leading-relaxed text-mid-gray">{traj.when}</p>
              <p className="font-inter-tight text-sm leading-relaxed text-foreground">{traj.offer}</p>
              <p className="mt-auto pt-2 font-mono text-xs uppercase tracking-[0.06em] text-accent-secondary">
                {traj.price}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
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
