"use client";

// Page « Conseil » — porte d'entrée payante à faible engagement. Les TROIS
// lignes Conseil du catalogue, dans l'ordre d'engagement croissant : Visio
// conseil refonte 150 €, Audit + roadmap 650 €, puis l'expert technique
// externalisé (récurrent, à partir de 900 €/mois ; renommé de « CTO
// externalisé » le 2026-09-10, ADR-010).
//
// Arbitrage du 2026-09-10 (ADR-009) : l'expert technique externalisé reprend
// une section d'offre en propre, à la place du bandeau de renvoi. Il reste
// VENDU sur sa page dédiée /cto-externalise, où partent son CTA, l'item du
// mega menu et la FAQ : la section d'ici présente, elle ne conclut pas.
// Garde-fous inchangés (charte §5) : offre récurrente jamais en accroche,
// jamais en CTA froid ; le héros et son CTA principal restent sur la visio
// conseil.
//
// DS Blueprint, i18n inline, a11y.

import { useLocale } from "next-intl";
import {
  ArrowRight,
  ShieldCheck,
  FileText,
  Video,
  Receipt,
  CalendarCheck,
  AlertTriangle,
  Target,
  Compass,
} from "lucide-react";
import type { Locale } from "@/i18n/routing";
import {
  BlueprintSection,
  SectionHeading,
  Separator,
} from "@/components/aspect/section";
import {
  PageHero,
  HERO_BTN_PRIMARY,
  HERO_BTN_SECONDARY,
} from "@/components/aspect/page-hero";
import { HeroOfferStrip, type HeroOffer } from "@/components/aspect/hero-offer-strip";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { ConstellationTechno } from "@/components/visuals/constellation-techno";
import { ConseilOfferSections } from "@/components/visio-conseil/conseil-offer-sections";
import { CONSEIL_TLDR, FAQ } from "@/lib/visio-conseil";
import { CTO_PRICE_VALUE } from "@/lib/cto-externalise";

export default function VisioConseilPage() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";

  const steps = isEn
    ? [
        [
          "You choose",
          "Pick the depth that matches the stakes: a one-hour call to settle a direction, or a full audit with its roadmap. The ongoing retainer always starts with that audit.",
        ],
        [
          "You send context",
          "Share the site, quote, proposal or project notes so I can prepare the useful questions.",
        ],
        [
          "You receive it in writing",
          "Video call, analysis, then a written opinion or the audit deliverables: recommendation, risks and the advised next step.",
        ],
      ]
    : [
        [
          "Vous choisissez",
          "Sélectionnez la profondeur adaptée à l'enjeu : une heure de visio pour trancher une direction, ou l'audit complet avec sa roadmap. L'accompagnement récurrent, lui, démarre toujours par cet audit.",
        ],
        [
          "Vous envoyez le contexte",
          "Partagez le site, le devis, la proposition ou les notes projet pour préparer les bonnes questions.",
        ],
        [
          "Vous recevez l'écrit",
          "Visio, analyse, puis l'avis écrit ou les livrables de l'audit : recommandation, risques et prochaine étape conseillée.",
        ],
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
        [
          CalendarCheck,
          "Réservation et paiement en ligne, confirmation immédiate",
        ],
        [Video, "Vraie visio avec partage d'écran, pas un chatbot"],
        [FileText, "Avis écrit ou livrables après l'appel"],
        [ShieldCheck, "Report ou annulation possible jusqu'à 24 h avant"],
      ];

  // Aperçu du catalogue Conseil dans le héros — trois ancres vers les sections
  // d'offre plus bas. L'expert technique externalisé y figure en DERNIER et
  // sans mention « recommandée » : c'est un aperçu du catalogue, pas
  // l'accroche. L'accroche (titre, description, CTA principal) reste sur la
  // visio conseil, offre froide et ponctuelle, comme l'exige la charte §5 pour
  // l'offre récurrente.
  const heroOffers: HeroOffer[] = isEn
    ? [
        {
          name: "Advisory call",
          price: "€150",
          benefit: "Settle a direction, written opinion within 48h.",
          href: "#choix-techno-ia",
          recommended: true,
        },
        {
          name: "Audit + roadmap",
          price: "€650",
          benefit: "The complete assessment and the roadmap, in writing.",
          href: "#architecture-projet-ia",
        },
        {
          name: "Outsourced technical expert",
          price: `from €${CTO_PRICE_VALUE}/mo`,
          benefit: "Technical direction on shared time, month after month.",
          href: "#cto-externalise",
        },
      ]
    : [
        {
          name: "Visio conseil",
          price: "150 €",
          benefit: "Trancher une direction, avis écrit sous 48 h.",
          href: "#choix-techno-ia",
          recommended: true,
        },
        {
          name: "Audit + roadmap",
          price: "650 €",
          benefit: "L'état des lieux complet et la feuille de route, par écrit.",
          href: "#architecture-projet-ia",
        },
        {
          name: "Expert technique externalisé",
          price: `dès ${CTO_PRICE_VALUE} €/mois`,
          benefit: "Une direction technique à temps partagé, mois après mois.",
          href: "#cto-externalise",
        },
      ];

  return (
    <main>
      {/* § 01 — Hero */}
      <PageHero
        index="№ 01"
        kicker={
          isEn
            ? "Redesign advice · One-off or ongoing"
            : "Conseil refonte · Ponctuel ou récurrent"
        }
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
              Conseillé{" "}
              <em className="font-normal not-italic text-accent-secondary">
                avant de s'engager
              </em>
              .
            </>
          )
        }
        description={
          isEn
            ? "Your site is aging and the trajectory is still open: stay, decouple or rebuild. Two one-off advisory formats before any quote and any line of code, and an ongoing retainer when the decisions come back every month."
            : "Votre site vieillit et la trajectoire reste à trancher : rester, découpler ou refonder. Deux formats de conseil ponctuel avant tout devis et toute ligne de code, et un accompagnement récurrent quand les décisions reviennent tous les mois."
        }
        actions={
          <>
            <a href="#choix-techno-ia" className={"group " + HERO_BTN_PRIMARY}>
              {isEn ? "Book the advisory call" : "Réserver la visio conseil"}
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5"
              />
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
      >
        <HeroOfferStrip
          label={
            isEn
              ? "Three offers, increasing commitment"
              : "Trois offres, un engagement croissant"
          }
          offers={heroOffers}
          recommendedLabel={isEn ? "Recommended" : "Recommandée"}
          ctaLabel={isEn ? "View" : "Voir"}
        />
      </PageHero>

      {/* § 01b — « En bref » : TL;DR autoportant, citable tel quel par les
          moteurs de réponse (même gabarit que la home, /a-propos et
          /cto-externalise). Le texte vient de CONSEIL_TLDR : le rendu visible et
          les fichiers llms disent la même chose, et les prix y sont dérivés du
          catalogue, jamais recopiés. Numéroté « 01b » pour ne pas décaler la
          numérotation des sections fixée par l'ADR-009. */}
      <BlueprintSection tone="obsidian" innerClassName="px-6 py-8 lg:px-10 lg:py-10">
        <Reveal
          as="aside"
          className="conseil-tldr border border-l-[3px] border-dark-gray border-l-accent-secondary bg-jet/40 px-6 py-5 lg:px-8"
        >
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-accent-secondary">
            {isEn ? CONSEIL_TLDR.label.en : CONSEIL_TLDR.label.fr}
          </p>
          <ul className="flex flex-col gap-2">
            {CONSEIL_TLDR.lines.map((line) => (
              <li
                key={line.fr}
                className="font-inter-tight text-sm leading-relaxed text-mid-gray md:text-[15px]"
              >
                {isEn ? line.en : line.fr}
              </li>
            ))}
          </ul>
        </Reveal>
      </BlueprintSection>
      <Separator />

      {/* § 02 — Le besoin, l'objectif, la solution du conseil */}
      <BlueprintSection tone="obsidian">
        <Reveal className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
          <SectionHeading
            index="№ 02"
            kicker={isEn ? "Why advice first" : "Pourquoi un conseil"}
            title={
              isEn ? (
                <>Settle the direction <span className="text-accent-secondary">before you spend</span></>
              ) : (
                <>Trancher la direction <span className="text-accent-secondary">avant de dépenser</span></>
              )
            }
            description={
              isEn
                ? "Before any quote, one decision has to be made: which trajectory your aging site should take. This is what the advice secures."
                : "Avant tout devis, une décision doit être prise : quelle trajectoire donner à un site qui vieillit. C'est ce que le conseil sécurise."
            }
          />
        </Reveal>

        <Stagger className="grid md:grid-cols-3">
          {([
            {
              Icon: AlertTriangle,
              label: isEn ? "The need" : "Le besoin",
              desc: isEn
                ? "Your WordPress site is aging and the trajectory is still open: stay, decouple or rebuild. Each direction commits months of work and a budget: getting it wrong is costly."
                : "Votre site WordPress vieillit et la trajectoire reste ouverte : rester, découpler ou refonder. Chaque direction engage des mois de travail et un budget : se tromper coûte cher.",
            },
            {
              Icon: Target,
              label: isEn ? "The main objective" : "L'objectif principal",
              desc: isEn
                ? "Decide with full clarity. Secure the technical choice before committing a single line of code, and make competing quotes comparable with each other."
                : "Décider en connaissance de cause. Sécuriser le choix technique avant d'engager la moindre ligne de code, et rendre les devis comparables entre eux.",
            },
            {
              Icon: Compass,
              label: isEn ? "The solution" : "La solution",
              desc: isEn
                ? "Independent, clear-cut advice: one hour to settle the direction, or a costed audit with its roadmap. You leave with a written direction, not a hunch."
                : "Un avis indépendant et tranché : une heure pour trancher la direction, ou un audit chiffré avec sa roadmap. Vous repartez avec une direction écrite, pas une intuition.",
            },
          ]).map((card, i, arr) => (
            <StaggerItem
              key={card.label}
              className={`group flex flex-col gap-4 p-6 transition-colors hover:bg-jet lg:p-8 ${
                i < arr.length - 1 ? "border-b border-dark-gray md:border-b-0 md:border-r" : ""
              }`}
            >
              <card.Icon
                size={24}
                strokeWidth={1.5}
                className="text-mid-gray transition-colors group-hover:text-accent-secondary"
              />
              <h3 className="text-lg font-light tracking-tight text-foreground">{card.label}</h3>
              <p className="font-inter-tight text-sm leading-relaxed text-mid-gray">{card.desc}</p>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Preuve : l'avis s'adosse a une veille formalisee — ligne sobre, pas
            un titre (le diplome est une raison de preferer, pas d'acheter). */}
        <Reveal className="border-t border-dark-gray px-6 py-8 lg:px-8">
          <p className="max-w-3xl border-l-2 border-accent-secondary/60 pl-4 font-inter-tight text-sm leading-relaxed text-foreground/80">
            {isEn
              ? "This advice draws on a continuous tech watch, a discipline learned through a Master's degree in Technology Watch and Innovation (Aix-Marseille) and practised since 2012, to recommend what is proven, not what is trendy."
              : "Cet avis s'adosse à une veille techno tenue en continu, une discipline apprise en master Veille technologique et innovation (Aix-Marseille) et pratiquée depuis 2012, pour recommander ce qui est éprouvé, pas ce qui est à la mode."}
          </p>
        </Reveal>
      </BlueprintSection>

      <Separator />

      {/* § 03 — Cadrage : les trois offres du catalogue Conseil + réassurance.
          L'offre récurrente (Expert technique externalisé) est présentée en
          § 06, mais reste vendue sur sa page dédiée : son CTA y renvoie. */}
      <BlueprintSection
        id="conseils"
        tone="obsidian"
        innerClassName="px-6 py-16 lg:px-8 lg:py-20"
      >
        <SectionHeading
          index="№ 03"
          kicker={isEn ? "Three advisory offers" : "Trois offres de conseil"}
          title={
            isEn ? (
              <>
                The call settles, the audit documents,{" "}
                <span className="text-accent-secondary">the expert steers</span>
              </>
            ) : (
              <>
                La visio tranche, l'audit documente,{" "}
                <span className="text-accent-secondary">l'expert pilote</span>
              </>
            )
          }
          description={
            isEn
              ? "The cost of a wrong trajectory is counted in months; the cost of the advice, in euros. One hour to settle a direction, a full audit with costed recommendations and a step-by-step roadmap, or a technical direction on shared time when one decision is never the last."
              : "Le coût d'une mauvaise trajectoire se compte en mois ; celui de l'avis, en euros. Une heure pour trancher une direction, un audit complet avec préconisations chiffrées et roadmap par étapes, ou une direction technique à temps partagé quand une décision n'est jamais la dernière."
          }
        />
        <p className="mt-6 max-w-3xl font-inter-tight text-sm leading-relaxed text-mid-gray">
          {isEn
            ? "Prices excl. VAT. The advisory call is fully deducted from your quote if a project starts within 30 days. The audit + roadmap is a standalone deliverable: it serves you even if the work goes to someone else. The outsourced technical expert is the only recurring line, and every retainer starts with that audit. The detail of each offer follows below."
            : "Prix HT. La visio conseil est déduite à 100 % de votre devis si un projet démarre sous 30 jours. L'audit + roadmap est un livrable à part entière : il vous sert même si la prestation est confiée à quelqu'un d'autre. L'expert technique externalisé est la seule ligne récurrente, et tout accompagnement démarre par cet audit. Le détail de chaque offre suit juste en dessous."}
        </p>

        {/* Engagements — réassurance sous le cadrage */}
        <div className="mt-10 grid gap-px border border-dark-gray bg-dark-gray sm:grid-cols-2 lg:grid-cols-3">
          {reassurance.map(([Icon, label]) => (
            <div key={label} className="flex items-start gap-3 bg-obsidian p-5">
              <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-secondary" />
              <span className="font-inter-tight text-sm leading-snug text-mid-gray">
                {label}
              </span>
            </div>
          ))}
        </div>
      </BlueprintSection>

      <Separator />

      {/* § 04–06 — Une section détaillée par offre (ancres du mega menu et du
          bandeau du héros) : #choix-techno-ia, #architecture-projet-ia,
          #cto-externalise. */}
      <ConseilOfferSections />
      <Separator />

      {/* § 07 — Comment ça marche. Fond obsidian : la § 06 (Expert technique
          externalisé) est en jet, l'alternance évite deux bandes identiques
          d'affilée. */}
      <BlueprintSection
        id="comment"
        tone="obsidian"
        innerClassName="px-6 py-16 lg:px-8 lg:py-20"
      >
        <SectionHeading
          index="№ 07"
          kicker={isEn ? "How it works" : "Comment ça marche"}
          title={
            isEn
              ? "From request to written opinion"
              : "De la demande à l'avis écrit"
          }
        />
        <Stagger className="mt-10 grid gap-px border border-dark-gray bg-dark-gray sm:grid-cols-3">
          {steps.map(([title, desc], i) => (
            <StaggerItem key={title} className="bg-obsidian p-6 lg:p-8">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-vermilion">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-lg font-light tracking-tight text-foreground">
                {title}
              </h3>
              <p className="mt-2 font-inter-tight text-sm leading-relaxed text-mid-gray">
                {desc}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </BlueprintSection>
      <Separator />

      {/* § 08 — FAQ */}
      <BlueprintSection tone="jet" innerClassName="px-6 py-16 lg:px-8 lg:py-20">
        <SectionHeading
          index="№ 08"
          kicker="FAQ"
          title={isEn ? "Frequently asked questions" : "Questions fréquentes"}
        />
        <div className="mt-10 grid gap-px border border-dark-gray bg-dark-gray md:grid-cols-2">
          {FAQ.map((item) => {
            const c = isEn ? item.en : item.fr;
            return (
              <div key={c.q} className="bg-jet p-6 lg:p-8">
                <h3 className="text-base font-medium text-foreground">{c.q}</h3>
                <p className="mt-3 font-inter-tight text-sm leading-relaxed text-mid-gray">
                  {c.a}
                </p>
              </div>
            );
          })}
        </div>
      </BlueprintSection>
    </main>
  );
}
