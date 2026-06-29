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
    subtitle: "Explorer",
    title: "Diagnostic",
    price: "gratuit",
    items: [
      "Diagnostic projet & audit IA de votre site",
      "Simulateur AGEFIPH, diagnostic d'opportunité PWA",
      "Générateur de cahier des charges",
    ],
    target: "Pour s'auto-évaluer, sans engagement",
    href: "/outils",
    cta: "Ouvrir les outils",
  },
  {
    subtitle: "Décider",
    title: "Conseil techno web & IA",
    price: "dès 180 € HT",
    items: [
      "Visio décision : trancher WordPress, no-code, IA, Headless ou sur-mesure",
      "Second avis sur un devis, une stack ou un prototype IA",
      "Roadmap projet web avant production",
    ],
    target: "Pour trancher avant d'investir",
    href: "/conseil",
    cta: "Voir le conseil",
    recommended: true,
  },
  {
    subtitle: "Construire",
    title: "Création de solutions web",
    price: "dès 2 250 € HT",
    items: [
      "WordPress optimisé, Headless + Next.js ou outil métier",
      "Web app, PWA et applications sur-mesure",
      "Dépannage WordPress dès 69 € HT",
    ],
    target: "Quand le besoin le justifie",
    href: "/services",
    cta: "Voir les services",
  },
];

const OFFERS_EN: Offer[] = [
  {
    subtitle: "Explore",
    title: "Tools",
    price: "free",
    items: [
      "Project diagnostic & AI audit of your site",
      "AGEFIPH simulator, PWA opportunity diagnostic",
      "Specifications generator",
    ],
    target: "Self-assess, no commitment",
    href: "/outils",
    cta: "Open the tools",
  },
  {
    subtitle: "Decide",
    title: "Tech advice",
    price: "from €180 excl. VAT",
    items: [
      "Decision call: settle WordPress, no-code, AI, Headless or custom",
      "Second opinion on a quote, stack or AI prototype",
      "Web project roadmap before production",
    ],
    target: "To decide before investing",
    href: "/conseil",
    cta: "See the advice",
    recommended: true,
  },
  {
    subtitle: "Build",
    title: "Services",
    price: "from €2,250 excl. VAT",
    items: [
      "Optimized WordPress, Headless + Next.js or business tool",
      "Web apps, PWAs and custom applications",
      "WordPress support from €69 excl. VAT",
    ],
    target: "When the need justifies it",
    href: "/services",
    cta: "See the services",
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
            kicker={isEn ? "Web & AI Tech Compass" : "Boussole Techno Web & IA"}
            title={
              isEn ? (
                <>AI can code. <span className="text-accent-secondary">It cannot decide everything.</span></>
              ) : (
                <>L'IA peut coder. <span className="text-accent-secondary">Elle ne peut pas tout décider.</span></>
              )
            }
            description={
              isEn
                ? "The real choice is no longer only WordPress vs Headless. It is WordPress, no-code, AI coding, SaaS, custom development, or not building at all."
                : "Le vrai choix n'est plus seulement WordPress ou Headless. C'est WordPress, no-code, IA coding, SaaS, sur-mesure, ou ne rien construire du tout."
            }
          />
        </Reveal>

        {/* 3 cartes : Outils · Conseil techno · Services (pleine largeur, sans gouttière) */}
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

                <h3 className="text-xl font-light leading-tight tracking-tight text-foreground md:text-2xl">
                  {offer.title}
                </h3>
                <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-mid-gray">
                  {offer.subtitle}
                </div>

                <div className="mt-6 border-b border-dark-gray pb-5 font-mono text-[11px] tracking-[0.08em] text-foreground">
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
            href="/tarifs"
            className="font-mono text-[10px] tracking-[0.06em] text-mid-gray transition-colors hover:text-foreground"
          >
            {isEn ? "Pricing simulator →" : "Simulateur de tarifs →"}
          </Link>
          <Link
            href="/services"
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
