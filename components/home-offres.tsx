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
      "« Quelle techno pour mon site web à l'heure de l'IA ? » — la lettre gratuite : synthèse mensuelle + focus hebdo",
      "Aide à la décision — maintenir, refondre ou créer",
      "Écrit pour décider, relu par un humain avant envoi",
    ],
    target: "Pour rester devant, sans y passer vos soirées",
    href: "/veille",
    cta: "Découvrir la veille",
  },
  {
    subtitle: "Décider",
    title: "Conseil web & IA",
    price: "dès 150 € HT",
    items: [
      "Choix de techno web en 30 min : WordPress, no-code, IA, Headless ou sur-mesure",
      "Conseil architecture + cahier des charges et spécifications",
      "Pack de prompts et agents pour construire (Claude Code / Codex)",
    ],
    target: "Pour trancher avant d'investir",
    href: "/conseil",
    cta: "Voir le conseil",
    recommended: true,
  },
  {
    subtitle: "Construire",
    title: "Prestations web",
    price: "dès 2 250 € HT",
    items: [
      "WordPress optimisé, Headless + Next.js ou outil métier",
      "Web app, PWA et applications sur-mesure",
    ],
    target: "Quand le besoin le justifie",
    href: "/solutions-web",
    cta: "Voir les prestations web",
  },
];

const OFFERS_EN: Offer[] = [
  {
    subtitle: "Watch",
    title: "Tech watch",
    price: "from €0",
    items: [
      "The free newsletter: a monthly digest + a weekly focus on web & AI",
      "Decision support — maintain, rebuild or create",
      "Written to help you decide, human-reviewed before sending",
    ],
    target: "Stay ahead, without spending your evenings on it",
    href: "/veille",
    cta: "Discover the watch",
  },
  {
    subtitle: "Decide",
    title: "Tech advice",
    price: "from €150 excl. VAT",
    items: [
      "Web tech choice in 30 min: WordPress, no-code, AI, Headless or custom",
      "Architecture advice + specifications and requirements",
      "Pack of prompts and agents to build (Claude Code / Codex)",
    ],
    target: "To decide before investing",
    href: "/conseil",
    cta: "See the advice",
    recommended: true,
  },
  {
    subtitle: "Build",
    title: "Web services",
    price: "from €2,250 excl. VAT",
    items: [
      "Optimized WordPress, Headless + Next.js or business tool",
      "Web apps, PWAs and custom applications",
    ],
    target: "When the need justifies it",
    href: "/solutions-web",
    cta: "See our web services",
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
            kicker={isEn ? "Web & AI tech selector" : "Sélecteur techno web & IA"}
            title={
              isEn ? (
                <>AI can code. <span className="text-accent-secondary">It cannot decide everything.</span></>
              ) : (
                <>Accompagner <span className="text-accent-secondary">votre projet web</span> à l'heure de l'IA.</>
              )
            }
            description={
              isEn
                ? "The real choice is no longer only WordPress vs Headless. It is WordPress, no-code, AI coding, SaaS, custom development, or not building at all."
                : "Le vrai choix n'est plus seulement WordPress ou Headless. C'est WordPress, no-code, IA coding, SaaS, sur-mesure, ou ne rien construire du tout."
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
                <span className="text-foreground">production is easier</span>{" "}
                — judgment, architecture and maintenance still matter.
              </>
            ) : (
              <>
                Idée clé :{" "}
                <span className="text-foreground">produire devient plus facile</span>{" "}
                — le jugement, l'architecture et la maintenance restent décisifs.
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
