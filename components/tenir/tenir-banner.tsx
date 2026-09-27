"use client";

// Bandeau « Après la livraison » : bas de page de /solutions-web (ADR-012,
// amendé par l'ADR-013). Après une refonte, la question est « qui tient le
// site ? ». Il présente les DEUX abonnements du moment « Gérer », du plus
// léger au plus engageant, et renvoie vers la page du moment. Sentinelle n'est
// plus une marche : elle est incluse dans le suivi et se dit en pastille.
// Le nom du composant (TenirBanner) est un identifiant technique, inchangé.
//
// Offres de fin de parcours (charte §5) : jamais dans un héros ni en CTA
// froid. Prix lus dans leurs sources. Tokens DS, i18n inline, <Reveal>.

import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { BlueprintSection } from "@/components/aspect/section";
import { Reveal } from "@/components/ui/reveal";
import { CTO_PATH, CTO_PRICE } from "@/lib/cto-externalise";
import {
  MAINTENANCE_PATH,
  MAINTENANCE_PRICE,
  SUIVI_INCLUS_LABEL,
  SUIVI_INCLUS_MOIS,
} from "@/lib/maintenance-offer";

type Href = Parameters<typeof Link>[0]["href"];

export function TenirBanner({ tone = "jet" }: { tone?: "obsidian" | "jet" }) {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const l = isEn ? "en" : "fr";

  const rungs = [
    {
      kicker: isEn ? "Maintain" : "Entretenir",
      name: isEn ? "Care and maintenance" : "Suivi et maintenance",
      price: `${MAINTENANCE_PRICE[l].amount} ${MAINTENANCE_PRICE[l].period}`,
      href: MAINTENANCE_PATH,
    },
    {
      kicker: isEn ? "Steer" : "Piloter",
      name: isEn ? "Outsourced technical expert" : "Expert technique externalisé",
      price: `${CTO_PRICE[l].amount} ${CTO_PRICE[l].period}`,
      href: CTO_PATH,
    },
  ];

  return (
    <BlueprintSection tone={tone} innerClassName="px-6 py-12 lg:px-8 lg:py-16">
      <Reveal className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-2xs uppercase tracking-[0.14em] text-mid-gray">
            {isEn ? "After delivery" : "Après la livraison"}
          </p>
          <h3 className="text-2xl font-light tracking-tight text-foreground">
            {isEn ? "Who keeps the site running once it is live?" : "Une fois en ligne, qui tient le site ?"}
          </h3>
          <p className="max-w-3xl font-inter-tight text-base leading-relaxed text-mid-gray">
            {SUIVI_INCLUS_MOIS > 0
              ? isEn
                ? `Every package includes ${SUIVI_INCLUS_LABEL.en.replace(/ included$/, "")}. After that, two options, from the lightest to the most involved.`
                : `Chaque forfait inclut ${SUIVI_INCLUS_LABEL.fr.replace(/ inclus$/, "")}. Ensuite, deux possibilités, de la plus légère à la plus engageante.`
              : isEn
                ? "Two options, from the lightest to the most involved."
                : "Deux possibilités, de la plus légère à la plus engageante."}
          </p>
        </div>
        <div className="grid gap-px border border-dark-gray bg-dark-gray md:grid-cols-2">
          {rungs.map((r) => (
            <Link
              key={r.name}
              href={r.href as Href}
              className="group flex flex-col gap-1.5 bg-obsidian p-5 no-underline transition-colors hover:bg-jet"
            >
              <span className="font-mono text-2xs uppercase tracking-[0.14em] text-mid-gray">{r.kicker}</span>
              <span className="text-lg font-light tracking-tight text-foreground group-hover:text-accent-secondary">
                {r.name}
              </span>
              <span className="font-inter-tight text-base text-mid-gray">{r.price}</span>
            </Link>
          ))}
        </div>
        <p className="font-inter-tight text-sm leading-relaxed text-mid-gray">
          {isEn
            ? "Sentinelle, the watch letters and alerts on your site's components, is included from maintenance up."
            : "Sentinelle, les lettres de veille et les alertes sur les composants de votre site, est incluse dès la maintenance."}
        </p>
        <Link
          href={MAINTENANCE_PATH}
          className="group inline-flex items-center gap-1.5 self-start font-mono text-2xs uppercase tracking-[0.08em] text-accent-secondary no-underline hover:text-foreground"
        >
          {isEn ? "Compare the two options" : "Comparer les deux possibilités"}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Reveal>
    </BlueprintSection>
  );
}
