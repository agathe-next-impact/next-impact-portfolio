"use client";

// Page « Visio conseil » — clone structurel de la page dépannage
// (components/wordpress-express/wordpress-express-page.tsx). Tokens DS Blueprint
// uniquement, i18n inline, accessibilité préservée. DEUX conseils par sujet
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
import { BlueprintSection, SectionHeading, Separator } from "@/components/aspect/section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { OFFERS, FAQ, CALENDLY_BASE, type ConseilOffer } from "@/lib/visio-conseil";
import { CalendlyInline } from "@/components/visio-conseil/calendly-embed";

function OfferCard({ offer, isEn }: { offer: ConseilOffer; isEn: boolean }) {
  const copy = isEn ? offer.en : offer.fr;
  const duration = isEn ? offer.duration.en : offer.duration.fr;
  return (
    <div
      className={
        "relative flex flex-col gap-4 border bg-jet p-6 lg:p-8 " +
        (offer.featured ? "border-vermilion" : "border-dark-gray")
      }
    >
      {copy.tag && (
        <span className="absolute right-4 top-4 border border-vermilion px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-vermilion">
          {copy.tag}
        </span>
      )}
      <div>
        <h3 className="pr-20 text-lg font-medium text-foreground">{copy.name}</h3>
        <p className="mt-1 font-inter-tight text-sm text-mid-gray">{copy.tagline}</p>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-light tracking-tight text-foreground">{offer.price}</span>
        <span className="font-mono text-xs text-mid-gray">/ {duration}</span>
        <span className="ml-1 font-mono text-[10px] uppercase tracking-[0.08em] text-mid-gray">HT</span>
      </div>
      <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-accent-secondary">
        {isEn ? "Credited to your project quote" : "Déduit du devis projet"}
      </p>
      <p className="font-inter-tight text-sm leading-relaxed text-foreground">
        {copy.forWho}
      </p>
      <ul className="mt-1 flex flex-col gap-2.5 border-t border-dark-gray pt-4">
        {copy.bullets.map((b) => (
          <li key={b} className="flex items-start gap-2.5">
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-secondary" />
            <span className="font-inter-tight text-sm leading-snug text-mid-gray">{b}</span>
          </li>
        ))}
      </ul>
      <a
        href={offer.calendlyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={
          "group mt-auto flex w-full items-center justify-center gap-1.5 px-5 py-3 font-mono text-xs uppercase tracking-[0.06em] no-underline transition-colors " +
          (offer.featured
            ? "border border-vermilion bg-vermilion text-white hover:bg-vermilion-bright"
            : "border border-dark-gray text-foreground hover:border-mid-gray")
        }
      >
        {isEn ? "Book & pay" : "Réserver et payer"}
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}

export default function VisioConseilPage() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";

  const steps = isEn
    ? [
        ["You book", "Pick your advice and a slot in the online calendar, and pay for the call at booking. Instant confirmation and video link."],
        ["You set the scene", "In a line or two, tell me your situation so I show up prepared and we don't waste a minute."],
        ["We talk + recap", "45 min to 1h over video, live analysis, then a written recap with my recommendation and next steps."],
      ]
    : [
        ["Vous réservez", "Choisissez votre conseil et un créneau dans le calendrier en ligne, et réglez la visio à la réservation. Confirmation et lien de visio immédiats."],
        ["Vous plantez le décor", "En une ligne ou deux, décrivez votre situation pour que j'arrive préparée et qu'on ne perde pas une minute."],
        ["On se parle + compte-rendu", "45 min à 1h en visio, analyse en direct, puis un compte-rendu écrit avec ma recommandation et les prochaines étapes."],
      ];

  const reassurance: Array<[typeof ShieldCheck, string]> = isEn
    ? [
        [Receipt, "Price credited to your quote if a project follows (within 30 days)"],
        [CalendarCheck, "Book and pay online — instant confirmation"],
        [Video, "Real video call with screen sharing — not a chatbot"],
        [FileText, "Written recap after the call"],
        [ShieldCheck, "Reschedule or cancel up to 24h before"],
      ]
    : [
        [Receipt, "Prix déduit du devis si un projet suit (sous 30 jours)"],
        [CalendarCheck, "Réservation et paiement en ligne — confirmation immédiate"],
        [Video, "Vraie visio avec partage d'écran — pas un chatbot"],
        [FileText, "Compte-rendu écrit après l'appel"],
        [ShieldCheck, "Report ou annulation possible jusqu'à 24h avant"],
      ];

  return (
    <main>
      {/* § 01 — Hero */}
      <BlueprintSection tone="obsidian" innerClassName="px-6 py-16 lg:px-8 lg:py-24">
        <Reveal>
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
            № 01 — {isEn ? "Advisory call · Credited to your quote" : "Visio conseil · Déduite du devis"}
          </p>
          <h1 className="max-w-3xl text-3xl font-light leading-[1.05] tracking-tight text-foreground md:text-4xl lg:text-5xl">
            {isEn
              ? "A web decision to make? A call to see clearly — not to be sold to."
              : "Une décision web à trancher ? Une visio pour y voir clair — pas pour vous vendre."}
          </h1>
          <p className="mt-5 max-w-2xl font-inter-tight text-base leading-relaxed text-mid-gray md:text-lg">
            {isEn
              ? "Which themes and plugins for your WordPress? Which technology for your project? Two focused advisory calls: live analysis, a written recap with the way forward — and the price is credited to your quote if we end up working together. You risk nothing."
              : "Quels thèmes et extensions pour votre WordPress ? Quelle techno pour votre projet ? Deux conseils ciblés : analyse en direct, compte-rendu écrit avec la marche à suivre — et le prix est déduit du devis si on travaille ensemble. Vous ne risquez rien."}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#reserver"
              className="group inline-flex h-11 items-center gap-2 border border-vermilion bg-vermilion px-5 font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-white no-underline transition-colors hover:bg-vermilion-bright"
            >
              {isEn ? "Request my call" : "Réserver mon créneau"}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#conseils"
              className="inline-flex h-11 items-center border border-dark-gray px-5 font-mono text-[12px] uppercase tracking-[0.08em] text-foreground no-underline transition-colors hover:border-mid-gray"
            >
              {isEn ? "See the two advisory calls" : "Voir les deux conseils"}
            </a>
          </div>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.08em] text-mid-gray">
            {isEn
              ? "Reply within 24 business hours · Written recap · Credited to your project quote"
              : "Réponse sous 24h ouvrées · Compte-rendu écrit · Déduite de votre devis projet"}
          </p>
        </Reveal>
      </BlueprintSection>
      <Separator />

      {/* § 02 — Les deux conseils */}
      <BlueprintSection id="conseils" tone="obsidian" innerClassName="px-6 py-16 lg:px-8 lg:py-20">
        <SectionHeading
          index="№ 02"
          kicker={isEn ? "Two advisory calls" : "Deux conseils"}
          title={isEn ? "Pick the one that fits you" : "Celui qui correspond à votre besoin"}
          description={
            isEn
              ? "Fixed duration, fixed price, no commitment. Every call ends with a written recap — and its price is credited to your quote if a project follows."
              : "Durée fixe, prix fixe, sans engagement. Chaque appel se termine par un compte-rendu écrit — et son prix est déduit du devis si un projet suit."
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
            ? "No subscription. Prices excl. VAT. If you start a project within 30 days, the call's price is deducted from your quote."
            : "Sans abonnement. Prix HT. Si vous lancez un projet dans les 30 jours, le prix de la visio est déduit de votre devis."}
        </p>
      </BlueprintSection>
      <Separator />

      {/* § 03 — Comment ça marche */}
      <BlueprintSection tone="jet" innerClassName="px-6 py-16 lg:px-8 lg:py-20">
        <SectionHeading
          index="№ 03"
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

      {/* § 04 — Réservation Calendly (paiement à la résa) */}
      <BlueprintSection id="reserver" tone="obsidian" innerClassName="px-6 py-16 lg:px-8 lg:py-20">
        <SectionHeading
          index="№ 04"
          kicker={isEn ? "Book online" : "Réservez en ligne"}
          title={isEn ? "Pick your slot" : "Choisissez votre créneau"}
          description={
            isEn
              ? "Choose your advice and a time below, pay securely at booking, and get an instant confirmation with the video link. The price is credited to your quote if a project follows."
              : "Choisissez votre conseil et un horaire ci-dessous, réglez en ligne à la réservation, et recevez aussitôt la confirmation avec le lien de visio. Le prix est déduit du devis si un projet suit."
          }
        />

        {/* Engagements — bandeau compact au-dessus du calendrier */}
        <div className="mt-10 grid gap-px border border-dark-gray bg-dark-gray sm:grid-cols-2 lg:grid-cols-3">
          {reassurance.map(([Icon, label]) => (
            <div key={label} className="flex items-start gap-3 bg-obsidian p-5">
              <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-secondary" />
              <span className="font-inter-tight text-sm leading-snug text-mid-gray">{label}</span>
            </div>
          ))}
        </div>

        {/* Calendrier Calendly (liste les deux conseils) */}
        <Reveal className="mt-px">
          <CalendlyInline url={CALENDLY_BASE} />
        </Reveal>
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
