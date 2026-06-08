"use client";

import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { BlueprintSection, SectionHeading } from "@/components/aspect/section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

type Offer = {
  name: string;
  tech: string;
  target: string;
  concept: string;
  icon: string;
  color: string;
  features: string[];
  recommended: boolean;
};

export default function ServicesOffers({ offers }: { offers: Offer[] }) {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";

  return (
    <BlueprintSection id="offres" tone="obsidian">
      {/* En-tête */}
      <Reveal className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          index="№ 02"
          kicker={isEn ? "Offerings" : "Formules"}
          title={
            isEn ? (
              <>The right offering <span className="text-accent-secondary">for your project</span></>
            ) : (
              <>La bonne formule <span className="text-accent-secondary">pour votre projet</span></>
            )
          }
        />
      </Reveal>

      {/* Bento — pleine largeur, sans gouttière */}
      <Stagger className="grid md:grid-cols-3">
        {offers.map((offer, index) => (
          <StaggerItem key={index} className="h-full">
            <div
              className={cn(
                "group relative flex h-full flex-col p-6 transition-colors hover:bg-jet lg:p-8",
                "border-b border-dark-gray md:border-b-0",
                "md:border-r md:border-dark-gray md:[&:nth-child(3n)]:border-r-0",
                offer.recommended && "bg-jet",
              )}
            >
              {offer.recommended && (
                <span className="absolute inset-x-0 top-0 h-0.5 bg-accent-secondary" aria-hidden />
              )}

              {/* En-tête de carte : icône encadrée + nom/tech */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-overlay-gray p-2">
                  <Image
                    src={offer.icon}
                    alt=""
                    className="object-contain"
                    width={32}
                    height={32}
                  />
                </div>
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
                    {offer.name}
                  </div>
                  <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-mid-gray">
                    {offer.tech}
                  </div>
                </div>
              </div>

              <p className="mt-6 border-b border-dark-gray pb-5 font-inter-tight text-base leading-relaxed text-foreground">
                {offer.concept}
              </p>

              <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                {offer.features.map((feature, fidx) => (
                  <li
                    key={fidx}
                    className="flex items-start gap-2 font-inter-tight text-sm leading-relaxed text-mid-gray"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-secondary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 font-mono text-[9px] uppercase tracking-[0.12em] text-mid-gray">
                {offer.target}
              </div>

              <a
                href="https://calendar.app.google/ZagmCTp8PBTczTnJA"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-sm px-5 font-mono text-[12px] uppercase tracking-[0.08em] transition-colors",
                  offer.recommended
                    ? "border border-charcoal bg-vermilion text-white hover:bg-vermilion-bright"
                    : "border border-dark-gray text-foreground hover:bg-obsidian",
                )}
              >
                {isEn ? "Learn more" : "En savoir plus"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </BlueprintSection>
  );
}
