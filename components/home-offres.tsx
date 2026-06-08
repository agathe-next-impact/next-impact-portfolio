"use client";

import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { SectionHeading } from "@/components/aspect/section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

type Stack = {
  subtitle: string;
  title: string;
  price: string;
  strengths: string[];
  target: string;
  recommended?: boolean;
};

const STACKS_FR: Stack[] = [
  {
    subtitle: "WordPress · thème sur-mesure",
    title: "Site vitrine performant",
    price: "dès 2 250 €",
    strengths: ["Administration simple, sans technique", "Rapide et bien référencé"],
    target: "Vitrine, blog, association",
  },
  {
    subtitle: "WordPress Headless + Next.js",
    title: "Site haute performance",
    price: "dès 4 000 €",
    strengths: ["Design sans limite, < 1 s de chargement", "Contenu géré dans WordPress"],
    target: "PME, ESS, site de croissance",
    recommended: true,
  },
  {
    subtitle: "architecture dédiée",
    title: "Plateforme métier sur-mesure",
    price: "sur devis",
    strengths: ["Logique métier, comptes utilisateurs", "Géoloc, hors-ligne, installable"],
    target: "Marketplace, plateforme, app terrain",
  },
];

const STACKS_EN: Stack[] = [
  {
    subtitle: "WordPress · bespoke theme",
    title: "High-performance brochure site",
    price: "from €2,250",
    strengths: ["Simple admin, no tech skills", "Fast and well-ranked"],
    target: "Brochure, blog, association",
  },
  {
    subtitle: "WordPress Headless + Next.js",
    title: "High-speed website",
    price: "from €4,000",
    strengths: ["Unlimited design, loads in < 1 s", "Content managed in WordPress"],
    target: "SME, NGO, growth site",
    recommended: true,
  },
  {
    subtitle: "dedicated architecture",
    title: "Custom business platform",
    price: "on quote",
    strengths: ["Business logic, user accounts", "Geoloc, offline, installable"],
    target: "Marketplace, platform, field app",
  },
];

export default function HomeOffres() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const stacks = isEn ? STACKS_EN : STACKS_FR;

  return (
    <section className="relative overflow-hidden bg-obsidian px-2.5 lg:px-0">
      <div className="relative mx-auto w-full max-w-[1200px] border-x border-dark-gray">
        {/* En-tête */}
        <Reveal className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
          <SectionHeading
            index="№ 03"
            kicker={isEn ? "Offerings" : "Formules"}
            title={
              isEn ? (
                <>The right offering <span className="text-accent-secondary">for your project</span></>
              ) : (
                <>La bonne formule <span className="text-accent-secondary">pour votre projet</span></>
              )
            }
            description={
              isEn
                ? "Most brochure projects fall under the first. Unsure? The 2-min diagnostic points you to the right one."
                : "La plupart des vitrines relèvent de la première. En cas de doute, le diagnostic en 2 min vous oriente."
            }
          />
        </Reveal>

        {/* Bento — pleine largeur, sans gouttière */}
        <Stagger className="grid md:grid-cols-3">
          {stacks.map((stack) => (
            <StaggerItem key={stack.title}>
              <div
                className={cn(
                  "group relative flex h-full flex-col p-6 transition-colors hover:bg-jet lg:p-8",
                  "border-b border-dark-gray md:border-b-0",
                  "md:border-r md:border-dark-gray md:[&:nth-child(3n)]:border-r-0",
                  stack.recommended && "bg-jet",
                )}
              >
                {stack.recommended && (
                  <span className="absolute inset-x-0 top-0 h-0.5 bg-accent-secondary" aria-hidden />
                )}

                <h3 className="text-xl font-light leading-tight tracking-tight text-foreground md:text-2xl">
                  {stack.title}
                </h3>
                <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-mid-gray">
                  {stack.subtitle}
                </div>

                <div className="mt-6 border-b border-dark-gray pb-5 font-mono text-[11px] tracking-[0.08em] text-foreground">
                  {stack.price}
                </div>

                <ul className="mt-6 flex flex-1 flex-col gap-2">
                  {stack.strengths.map((s) => (
                    <li key={s} className="flex gap-2 font-inter-tight text-sm leading-relaxed text-mid-gray">
                      <span className="shrink-0 pt-px font-mono text-[11px] text-accent-secondary">→</span>
                      {s}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 font-mono text-[9px] uppercase tracking-[0.12em] text-mid-gray">
                  {stack.target}
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Pied — liens internes (préférés aux détails) */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-dark-gray px-6 py-6 lg:px-8">
          <Link
            href="/documentation"
            className="font-mono text-[10px] tracking-[0.06em] text-mid-gray transition-colors hover:text-foreground"
          >
            {isEn ? "Architecture details →" : "Détails d'architecture →"}
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
