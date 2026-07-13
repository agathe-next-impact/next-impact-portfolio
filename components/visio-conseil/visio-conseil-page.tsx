"use client";

// Page « Visio conseil » — même structure que les pages offre du site. Tokens
// DS Blueprint uniquement, i18n inline, accessibilité préservée. DEUX conseils par sujet
// (WordPress thèmes/plugins · choix de techno), pas par durée. L'offre est
// TIÈDE : elle vient APRÈS la preuve (l'audit gratuit), jamais en CTA froid.
// Argument d'ancrage répété : le prix est déduit du devis projet.

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
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { OFFERS, FAQ, type ConseilOffer } from "@/lib/visio-conseil";

function OfferCard({
  offer,
  isEn,
  wide = false,
}: {
  offer: ConseilOffer;
  isEn: boolean;
  wide?: boolean;
}) {
  const copy = isEn ? offer.en : offer.fr;
  const single = offer.tiers.length === 1;
  const cheapest = offer.tiers.reduce((a, b) => (a.value <= b.value ? a : b));
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
      ? "border border-vermilion bg-vermilion text-white hover:bg-vermilion-bright"
      : "border border-dark-gray text-foreground hover:border-mid-gray");

  const tag = copy.tag ? (
    <span className="absolute right-4 top-4 border border-vermilion px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-vermilion">
      {copy.tag}
    </span>
  ) : null;

  const header = (
    <div>
      <h3 className="pr-20 text-lg font-medium text-foreground">{copy.name}</h3>
      <p className="mt-1 font-inter-tight text-sm text-mid-gray">{copy.tagline}</p>
    </div>
  );

  const priceBlock = (
    <div className="flex items-baseline gap-1">
      {!single && (
        <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.08em] text-mid-gray">
          {isEn ? "From" : "Dès"}
        </span>
      )}
      <span className="text-2xl font-light tracking-tight text-foreground">{cheapest.price}</span>
      {single && (
        <span className="font-mono text-xs text-mid-gray">
          / {isEn ? cheapest.duration.en : cheapest.duration.fr}
        </span>
      )}
      <span className="ml-1 font-mono text-[10px] uppercase tracking-[0.08em] text-mid-gray">HT</span>
    </div>
  );

  const note = (offer.credited || offer.recurring) && (
    <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-accent-secondary">
      {offer.credited
        ? isEn
          ? "Credited to your project quote"
          : "Déduit du devis projet"
        : isEn
          ? "Monthly · no time commitment"
          : "Abonnement mensuel · sans engagement"}
    </p>
  );

  const forWho = (
    <p className="font-inter-tight text-sm leading-relaxed text-foreground">{copy.forWho}</p>
  );

  const bulletItems = copy.bullets.map((b) => (
    <li key={b} className="flex items-start gap-2.5">
      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-secondary" />
      <span className="font-inter-tight text-sm leading-snug text-mid-gray">{b}</span>
    </li>
  ));

  const cta = single ? (
    offer.internalCta ? (
      <Link href={cheapest.calendlyUrl} className={ctaClass}>
        {ctaLabel}
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </Link>
    ) : (
      <a
        href={cheapest.calendlyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={ctaClass}
      >
        {ctaLabel}
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </a>
    )
  ) : (
    <div className="mt-auto flex flex-col gap-2 border-t border-dark-gray pt-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray">
        {isEn ? "Choose your duration" : "Choisissez la durée"}
      </p>
      {offer.tiers.map((tier) => (
        <a
          key={tier.calendlyUrl}
          href={tier.calendlyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={
            "group flex items-center justify-between gap-3 border px-4 py-3 no-underline transition-colors " +
            (tier.featured
              ? "border-vermilion bg-vermilion/10 hover:bg-vermilion/20"
              : "border-dark-gray hover:border-mid-gray")
          }
        >
          <span className="flex flex-col gap-0.5">
            <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-foreground">
              {isEn ? tier.duration.en : tier.duration.fr} · {tier.price} HT
            </span>
            {tier.note && (
              <span className="font-inter-tight text-[11px] leading-snug text-accent-secondary">
                {isEn ? tier.note.en : tier.note.fr}
              </span>
            )}
          </span>
          <span className="inline-flex flex-shrink-0 items-center gap-1 font-mono text-[10px] uppercase tracking-[0.06em] text-mid-gray transition-colors group-hover:text-foreground">
            {isEn ? "Book" : "Réserver"}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </a>
      ))}
    </div>
  );

  if (wide) {
    return (
      <div
        className={
          "relative grid gap-6 border bg-jet p-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 lg:p-8 " +
          (offer.featured ? "border-vermilion" : "border-dark-gray")
        }
      >
        {tag}
        <div className="flex flex-col gap-4">
          {header}
          {priceBlock}
          {note}
          {forWho}
          {cta}
        </div>
        <ul className="grid content-start gap-2.5 sm:grid-cols-2 lg:border-l lg:border-dark-gray lg:pl-10">
          {bulletItems}
        </ul>
      </div>
    );
  }

  return (
    <div
      className={
        "relative flex flex-col gap-4 border bg-jet p-6 lg:p-8 " +
        (offer.featured ? "border-vermilion" : "border-dark-gray")
      }
    >
      {tag}
      {header}
      {priceBlock}
      {note}
      {forWho}
      <ul className="mt-1 flex flex-col gap-2.5 border-t border-dark-gray pt-4">{bulletItems}</ul>
      {cta}
    </div>
  );
}

export default function VisioConseilPage() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";

  const steps = isEn
    ? [
        ["You choose", "Pick the level that matches your situation: choose a technology, scope the architecture or leave with a build pack."],
        ["You send context", "Share the site, quote, proposal or project notes so I can prepare the useful questions."],
        ["We decide", "Video call, analysis and written recap with recommendation, risks and the advised next step."],
      ]
    : [
        ["Vous choisissez", "Sélectionnez le niveau adapté : choisir une techno, cadrer l'architecture ou repartir avec un pack de mise en œuvre."],
        ["Vous envoyez le contexte", "Partagez le site, le devis, la proposition ou les notes projet pour préparer les bonnes questions."],
        ["On décide", "Visio, analyse puis compte-rendu écrit avec recommandation, risques et prochaine étape conseillée."],
      ];

  const reassurance: Array<[typeof ShieldCheck, string]> = isEn
    ? [
        [Receipt, "Tech choice call credited to your project quote"],
        [CalendarCheck, "Book and pay online — instant confirmation"],
        [Video, "Real video call with screen sharing — not a chatbot"],
        [FileText, "Written recap after the call"],
        [ShieldCheck, "Reschedule or cancel up to 24h before"],
      ]
    : [
        [Receipt, "Visio choix de techno créditée sur votre devis projet"],
        [CalendarCheck, "Réservation et paiement en ligne — confirmation immédiate"],
        [Video, "Vraie visio avec partage d'écran — pas un chatbot"],
        [FileText, "Compte-rendu écrit après l'appel"],
        [ShieldCheck, "Report ou annulation possible jusqu'à 24h avant"],
      ];

  const decisionMatrix = isEn
    ? [
        ["I want a website", "Rebuilding too fast", "Check whether to fix, optimize or rebuild"],
        ["I want an app", "Having something too heavy coded", "Check whether WordPress, Airtable, Notion, no-code or SaaS is enough"],
        ["AI can code it", "Creating a fragile tool", "Assess maintenance, security, data, hosting and technical debt"],
        ["I want to use AI", "Adding a gadget", "Identify a real use case and a measurable gain"],
        ["I want a directory or map", "Installing a random plugin", "Choose between plugin, structured data, Headless or dedicated app"],
        ["I have a quote", "Signing without understanding", "Challenge the technology, risks and future cost"],
      ]
    : [
        ["Je veux un site", "Refaire trop vite", "Vérifier s'il faut réparer, optimiser ou refondre"],
        ["Je veux une appli", "Faire coder trop lourd", "Vérifier si WordPress, Airtable, Notion, no-code ou SaaS suffit"],
        ["Je peux le coder avec l'IA", "Créer un outil fragile", "Évaluer maintenance, sécurité, données, hébergement et dette technique"],
        ["Je veux utiliser l'IA", "Ajouter un gadget", "Identifier un vrai cas d'usage et un gain mesurable"],
        ["Je veux un annuaire ou une carte", "Installer un plugin au hasard", "Choisir entre plugin, données structurées, Headless ou app dédiée"],
        ["J'ai un devis", "Signer sans comprendre", "Challenger la techno, les risques et le coût futur"],
      ];

  return (
    <main>
      {/* § 01 — Hero */}
      <BlueprintSection tone="obsidian" innerClassName="px-6 py-16 lg:px-8 lg:py-24">
        <Reveal>
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
            № 01 — {isEn ? "Tech advice · From decision to direction" : "Conseil techno · De la décision au pilotage"}
          </p>
          <h1 className="max-w-3xl text-3xl font-light leading-[1.05] tracking-tight text-foreground md:text-4xl lg:text-5xl">
            {isEn
              ? "Web technology advice in the age of AI."
              : "Conseil techno web à l'heure de l'IA."}
          </h1>
          <p className="mt-5 max-w-2xl font-inter-tight text-base leading-relaxed text-mid-gray md:text-lg">
            {isEn
              ? "AI can code fast. Next Impact helps you decide what to build, with which technology, and how far to go: WordPress, no-code, AI coding, SaaS, Headless, directory, automation or custom business tool."
              : "L'IA peut coder vite. Next Impact vous aide à choisir quoi construire, avec quelle techno, et jusqu'où aller : WordPress, no-code, IA coding, SaaS, Headless, annuaire, automatisation ou outil métier."}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#conseils"
              className="group inline-flex h-11 items-center gap-2 border border-vermilion bg-vermilion px-5 font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-white no-underline transition-colors hover:bg-vermilion-bright"
            >
              {isEn ? "Book the compass call" : "Réserver la boussole"}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#comment"
              className="inline-flex h-11 items-center border border-dark-gray px-5 font-mono text-[12px] uppercase tracking-[0.08em] text-foreground no-underline transition-colors hover:border-mid-gray"
            >
              {isEn ? "How it works" : "Comment ça marche"}
            </a>
          </div>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.08em] text-mid-gray">
            {isEn
              ? "Architecture · Priorities · Maintenance · Business coherence"
              : "Architecture · Priorités · Maintenance · Cohérence business"}
          </p>
        </Reveal>
      </BlueprintSection>
      <Separator />

      {/* § 02 — Les deux conseils */}
      <BlueprintSection id="conseils" tone="obsidian" innerClassName="px-6 py-16 lg:px-8 lg:py-20">
        <SectionHeading
          index="№ 02"
          kicker={isEn ? "Web & AI Tech Compass" : "Boussole Techno Web & IA"}
          title={isEn ? "Decide what deserves to be built" : "Décider ce qui mérite d'être construit"}
          description={
            isEn
              ? "A paid advisory path for small teams: choose a technology, scope the architecture, leave with an AI build pack, then steer over time across WordPress, no-code, AI coding, SaaS, Headless, custom — or not building at all."
              : "Un parcours de conseil payant pour les petites structures : choisir une techno, cadrer l'architecture, repartir avec un pack de mise en œuvre IA, puis piloter dans la durée entre WordPress, no-code, IA coding, SaaS, Headless, sur-mesure — ou ne rien construire du tout."
          }
        />
        <Stagger className="mt-10 grid gap-4 md:grid-cols-3">
          {OFFERS.slice(0, 3).map((offer) => (
            <StaggerItem key={offer.id}>
              <OfferCard offer={offer} isEn={isEn} />
            </StaggerItem>
          ))}
        </Stagger>
        {OFFERS[3] && (
          <Reveal className="mt-4">
            <OfferCard offer={OFFERS[3]} isEn={isEn} wide />
          </Reveal>
        )}
        <p className="mt-6 max-w-3xl font-inter-tight text-sm leading-relaxed text-mid-gray">
          {isEn
            ? "Prices excl. VAT, no time commitment. Only the web tech choice call is deducted from your quote if a project follows within 30 days — the architecture advice and build pack are complete deliverables, the tech direction a monthly subscription."
            : "Prix HT, sans engagement de durée. Seul le choix de techno est déduit de votre devis si un projet suit sous 30 jours — le conseil architecture et le pack de mise en œuvre sont des livrables complets, la direction technique un abonnement mensuel."}
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

      {/* § 03 — Matrice de décision */}
      <BlueprintSection tone="jet" innerClassName="px-6 py-16 lg:px-8 lg:py-20">
        <SectionHeading
          index="№ 03"
          kicker={isEn ? "Decision matrix" : "Matrice de décision"}
          title={
            isEn
              ? "The first question is not always technical"
              : "La première question n'est pas toujours technique"
          }
          description={
            isEn
              ? "AI, no-code and SaaS make production faster. That is exactly why the decision before production matters more."
              : "IA, no-code et SaaS rendent la production plus rapide. C'est précisément pour cela que la décision avant production compte davantage."
          }
        />
        <div className="mt-10 overflow-hidden border border-dark-gray">
          <div className="hidden border-b border-dark-gray bg-obsidian md:grid md:grid-cols-3">
            {(isEn
              ? ["Client situation", "Possible bad reflex", "Next Impact role"]
              : ["Situation client", "Mauvais réflexe possible", "Rôle de Next Impact"]
            ).map((head) => (
              <div key={head} className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-accent-secondary">
                {head}
              </div>
            ))}
          </div>
          <Stagger>
            {decisionMatrix.map(([situation, reflex, role]) => (
              <StaggerItem key={situation} className="grid grid-cols-1 border-b border-dark-gray last:border-b-0 md:grid-cols-3">
                <div className="bg-jet px-4 py-4 text-sm font-medium text-foreground">{situation}</div>
                <div className="bg-jet px-4 py-4 font-inter-tight text-sm text-mid-gray md:border-l md:border-dark-gray">{reflex}</div>
                <div className="bg-jet px-4 py-4 font-inter-tight text-sm text-mid-gray md:border-l md:border-dark-gray">{role}</div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </BlueprintSection>
      <Separator />

      {/* § 04 — Comment ça marche */}
      <BlueprintSection id="comment" tone="jet" innerClassName="px-6 py-16 lg:px-8 lg:py-20">
        <SectionHeading
          index="№ 04"
          kicker={isEn ? "How it works" : "Comment ça marche"}
          title={isEn ? "From request to recap" : "De la demande au compte-rendu"}
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

      {/* § 05 — FAQ */}
      <BlueprintSection tone="jet" innerClassName="px-6 py-16 lg:px-8 lg:py-20">
        <SectionHeading
          index="№ 05"
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
    </main>
  );
}
