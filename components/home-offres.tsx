"use client";

import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { SectionHeading } from "@/components/aspect/section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

type Offer = {
  subtitle: string;
  title: string;
  price: string;
  items: string[];
  target: string;
  href: string;
  cta: string;
  recommended?: boolean;
};

const OFFERS_FR: Offer[] = [
  {
    subtitle: "Veiller",
    title: "Veille techno",
    price: "dès 0 €",
    items: [
      "« Quelle techno pour mon site web à l'heure de l'IA ? », la lettre gratuite : synthèse mensuelle + focus hebdo",
      "Sentinelle 19 €/mois : veille personnalisée + aide à la décision : maintenir, refondre ou créer",
      "Écrit pour décider, relu par un humain avant envoi",
    ],
    target: "Pour rester devant, sans y passer vos soirées",
    href: "/veille",
    cta: "Découvrir la veille",
  },
  {
    subtitle: "Décider",
    title: "Conseil refonte",
    price: "dès 150 € HT",
    items: [
      "Visio conseil refonte (150 €) : un avis écrit sous 48 h, rester, découpler ou refonder",
      "Audit + roadmap (650 €) : rapport d'audit, préconisations chiffrées, plan par étapes",
      "CTO externalisé (dès 490 €/mois) : un décideur technique à vos côtés, sur la durée",
      "Visio déduite du devis si un projet démarre sous 30 jours",
    ],
    target: "Pour trancher avant d'engager un budget",
    href: "/conseil",
    cta: "Voir le conseil",
    recommended: true,
  },
  {
    subtitle: "Construire",
    title: "Prestations Refonte",
    price: "dès 2 250 € HT",
    items: [
      "Consolider : refonte WordPress optimisée, dès 2 250 € HT",
      "Découpler (recommandée) : WordPress headless, back-office conservé, dès 4 000 € HT",
      "Refonder : web app ou plateforme, dès 6 500 € HT",
    ],
    target: "Prix et délai fixés avant de commencer",
    href: "/solutions-web",
    cta: "Voir les trajectoires",
  },
];

const OFFERS_EN: Offer[] = [
  {
    subtitle: "Watch",
    title: "Tech watch",
    price: "from €0",
    items: [
      "The free newsletter: a monthly digest + a weekly focus on web & AI",
      "Sentinelle €19/month: personalized watch + decision support: maintain, rebuild or create",
      "Written to help you decide, human-reviewed before sending",
    ],
    target: "Stay ahead, without spending your evenings on it",
    href: "/veille",
    cta: "Discover the watch",
  },
  {
    subtitle: "Decide",
    title: "Redesign advice",
    price: "from €150 excl. VAT",
    items: [
      "Advisory call (€150): a written opinion within 48h, stay, decouple or rebuild",
      "Audit + roadmap (€650): audit report, costed recommendations, step-by-step plan",
      "Fractional CTO (from €490/month): a technical decision-maker by your side, over time",
      "Call deducted from the quote if a project starts within 30 days",
    ],
    target: "To decide before committing a budget",
    href: "/conseil",
    cta: "See the advice",
    recommended: true,
  },
  {
    subtitle: "Build",
    title: "Three trajectories",
    price: "from €2,250 excl. VAT",
    items: [
      "Consolidate: optimized WordPress redesign, from €2,250 excl. VAT",
      "Decouple (recommended): headless WordPress, back office kept, from €4,000 excl. VAT",
      "Rebuild: web app or platform, from €6,500 excl. VAT",
    ],
    target: "Price and timeline fixed before we start",
    href: "/solutions-web",
    cta: "See the trajectories",
  },
];

export default function HomeOffres() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const offers = isEn ? OFFERS_EN : OFFERS_FR;

  return (
    <section className="relative overflow-hidden bg-obsidian px-2.5 lg:px-0">
      <div className="relative mx-auto w-full max-w-[1200px] border-x border-dark-gray">
        {/* En-tête */}
        <Reveal className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
          <SectionHeading
            index="№ 02"
            kicker={isEn ? "Watch · Decide · Build" : "Veiller · Décider · Construire"}
            title={
              isEn ? (
                <>What you keep, <span className="text-accent-secondary">what you change.</span></>
              ) : (
                <>Une <span className="text-accent-secondary">refonte </span>organisée.</>
              )
            }
            description={
              isEn
                ? "The real question is not WordPress or not WordPress: it is what you keep and what you change. Three ways to move forward, with displayed prices."
                : "La vraie question n'est pas WordPress ou pas WordPress : c'est ce que vous gardez et ce que vous changez. Trois façons d'avancer, aux prix affichés."
            }
          />
        </Reveal>

        {/* 3 cartes : Veille · Conseil techno · Prestations (pleine largeur, sans gouttière) */}
        <Stagger className="grid md:grid-cols-3">
          {offers.map((offer) => (
            <StaggerItem
              key={offer.title}
              className={cn(
                "border-b border-dark-gray md:border-b-0",
                "md:border-r md:border-dark-gray md:last:border-r-0",
              )}
            >
              <Link
                href={offer.href as Parameters<typeof Link>[0]["href"]}
                className={cn(
                  "group relative flex h-full flex-col p-6 transition-colors hover:bg-jet lg:p-8",
                  offer.recommended && "bg-jet",
                )}
              >
                {offer.recommended && (
                  <span className="absolute inset-x-0 top-0 h-0.5 bg-accent-secondary" aria-hidden />
                )}

                {/* Repères d'angle « blueprint » — micro-anim au survol : deux
                    crochets vermillon (calage type dessin technique) qui se
                    recentrent dans les angles. Vocabulaire distinct du reste de la
                    page (reveal translateY, typewriter, sweep). Opacity + léger
                    recentrage, mouvement en motion-safe uniquement. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-1.5 top-1.5 h-2.5 w-2.5 border-l border-t border-accent-secondary opacity-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 motion-safe:-translate-x-1 motion-safe:-translate-y-1 motion-safe:group-hover:translate-x-0 motion-safe:group-hover:translate-y-0 motion-reduce:transition-none"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute bottom-1.5 right-1.5 h-2.5 w-2.5 border-b border-r border-accent-secondary opacity-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 motion-safe:translate-x-1 motion-safe:translate-y-1 motion-safe:group-hover:translate-x-0 motion-safe:group-hover:translate-y-0 motion-reduce:transition-none"
                />

                <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-mid-gray">
                  {offer.subtitle}
                </div>
                <h3 className="mt-2 text-2xl font-normal leading-tight tracking-tight text-foreground md:text-3xl">
                  {offer.title}
                </h3>

                <div className="mt-6 border-b border-dark-gray pb-5 text-xl font-light font-mono leading-none tracking-tight text-foreground lg:text-2xl">
                  {offer.price}
                </div>

                <ul className="mt-6 flex flex-1 flex-col gap-2">
                  {offer.items.map((s) => (
                    <li key={s} className="flex gap-2 font-inter-tight text-sm leading-relaxed text-mid-gray">
                      <span className="shrink-0 pt-px font-mono text-[11px] text-accent-secondary">→</span>
                      {s}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 font-mono text-[9px] uppercase tracking-[0.12em] text-mid-gray">
                  {offer.target}
                </div>

                <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-accent-secondary transition-colors group-hover:text-foreground">
                  {offer.cta}
                  <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Comment ça marche — fil rouge « garder WordPress » */}
        <div className="border-t border-dark-gray px-6 py-5 lg:px-8">
          <p className="font-inter-tight text-sm leading-relaxed text-mid-gray">
            {isEn ? (
              <>
                Key idea:{" "}
                <span className="text-foreground">change what is visible, keep what works</span>.
                A redesign is judged by the speed measured on delivery day, not by the mockup.
              </>
            ) : (
              <>
                Idée clé :{" "}
                <span className="text-foreground">on change ce qui est visible, on garde ce qui fonctionne</span>.
                Une refonte se juge à la vitesse mesurée le jour de la livraison, pas à la maquette.
              </>
            )}
          </p>
        </div>

        {/* Pied — comparatif détaillé */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-dark-gray px-6 py-6 lg:px-8">
          <Link
            href="/solutions-web"
            className="font-mono text-[10px] tracking-[0.06em] text-mid-gray transition-colors hover:text-foreground"
          >
            {isEn ? "Pricing simulator →" : "Simulateur de tarifs →"}
          </Link>
          <Link
            href="/solutions-web"
            className="group inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-accent-secondary transition-colors hover:text-foreground"
          >
            {isEn ? "Compare in detail" : "Comparer en détail"}
            <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
