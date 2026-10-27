"use client";

// Section « Suivi et maintenance » de /solutions-web : après la livraison, la
// maintenance se présente ici, sur la page des prestations, plutôt que dans le
// menu « Accompagnement ». Paliers, prix et inclus lus dans
// lib/maintenance-offer.ts (aucun chiffre écrit ici). Tokens DS, i18n inline.

import { ArrowRight, Check } from "lucide-react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { BlueprintSection, SectionHeading } from "@/components/aspect/section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import {
  MAINTENANCE_COMMITMENT,
  MAINTENANCE_PATH,
  MAINTENANCE_TIERS,
  SUIVI_INCLUS_LABEL,
  SUIVI_INCLUS_MOIS,
} from "@/lib/maintenance-offer";

export function MaintenanceSection({ index = "№ 06" }: { index?: string }) {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const l = isEn ? "en" : "fr";

  return (
    <BlueprintSection tone="obsidian">
      <Reveal className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          index={index}
          kicker={isEn ? "After delivery · Care and maintenance" : "Après la livraison · Suivi et maintenance"}
          title={
            isEn ? (
              <>Later <span className="text-accent-secondary">maintenance</span></>
            ) : (
              <>Maintenance <span className="text-accent-secondary">ultérieure</span></>
            )
          }
          description={
            isEn
              ? `Backups, updates, security and monitoring, handled every month and reported in your online workspace.${
                  SUIVI_INCLUS_MOIS > 0 ? ` ${SUIVI_INCLUS_LABEL.en} with every package.` : ""
                }`
              : `Sauvegardes, mises à jour, sécurité et surveillance, tenues chaque mois et rapportées dans votre espace en ligne.${
                  SUIVI_INCLUS_MOIS > 0 ? ` ${SUIVI_INCLUS_LABEL.fr} avec chaque forfait.` : ""
                }`
          }
        />
      </Reveal>

      <Stagger className="grid md:grid-cols-2">
        {MAINTENANCE_TIERS.map((tier, i, arr) => (
          <StaggerItem
            key={tier.id}
            className={`flex flex-col gap-4 p-6 lg:p-8 ${
              i < arr.length - 1 ? "border-b border-dark-gray md:border-b-0 md:border-r" : ""
            }`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-lg font-light tracking-tight text-foreground">{tier.name[l]}</h3>
              <span className="font-mono text-2xs uppercase tracking-[0.08em] text-accent-secondary">
                {tier.price[l]}
              </span>
            </div>
            <p className="font-inter-tight text-base leading-relaxed text-mid-gray">{tier.forWhom[l]}</p>
            <ul className="flex flex-col gap-2">
              {tier.items[l].map((item) => (
                <li key={item} className="flex gap-2 font-inter-tight text-sm leading-relaxed text-foreground/85">
                  <Check size={14} strokeWidth={1.5} className="mt-1 shrink-0 text-accent-secondary" />
                  {item}
                </li>
              ))}
            </ul>
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal className="flex flex-col gap-4 border-t border-dark-gray px-6 py-8 lg:px-8">
        <p className="font-inter-tight text-sm leading-relaxed text-mid-gray">{MAINTENANCE_COMMITMENT[l]}</p>
        <Link
          href={MAINTENANCE_PATH as Parameters<typeof Link>[0]["href"]}
          className="group inline-flex items-center gap-1.5 self-start font-mono text-2xs uppercase tracking-[0.08em] text-accent-secondary no-underline hover:text-foreground"
        >
          {isEn ? "See care and maintenance" : "Voir le suivi et la maintenance"}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Reveal>
    </BlueprintSection>
  );
}
