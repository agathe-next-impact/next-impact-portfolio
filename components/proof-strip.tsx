"use client";

import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { CountUp } from "@/components/ui/count-up";
import { Stagger, StaggerItem } from "@/components/ui/reveal";

const FIGARO_URL =
  "https://www.lefigaro.fr/economie/wordpress-headless-comment-les-pme-peuvent-moderniser-leur-site-sans-tout-reconstruire-avec-next-impact-digital-20260512";

type ProofItem = {
  value: string;
  /** Décompte animé (CountUp) pour les valeurs numériques ; absent = texte statique. */
  count?: { end: number; suffix?: string };
  label: string;
  href?: string;
  external?: boolean;
};

/**
 * ProofStrip — bande de preuve chiffrée, placée près des points de décision
 * (page pilier /wordpress-headless ; retirée de la home le 2026-09-04, où la
 * preuve vit désormais dans le hero — logos clients — et la section
 * réalisation phare). Chaque chiffre est vérifiable au clic : le 45 → 98
 * renvoie à l'étude de cas Proditec, les 26 projets aux études de cas
 * (source : lib/case-studies-data.ts, statut « publie »), la citation presse
 * à l'article source. Aucun chiffre non démontrable.
 */
export function ProofStrip({ className = "" }: { className?: string }) {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";

  const items: ProofItem[] = isEn
    ? [
        { value: "45 → 98", label: "Google speed score, before and after redesign", href: "/etudes-de-cas/proditec" },
        { value: "26", count: { end: 26 }, label: "documented projects", href: "/etudes-de-cas" },
        { value: "CWV", label: "the three Google speed measures, live on this site" },
        { value: "Le Figaro", label: "featured · May 2026", href: FIGARO_URL, external: true },
      ]
    : [
        { value: "45 → 98", label: "score de vitesse Google, avant et après refonte", href: "/etudes-de-cas/proditec" },
        { value: "26", count: { end: 26 }, label: "projets documentés", href: "/etudes-de-cas" },
        { value: "CWV", label: "les trois mesures de vitesse Google, en direct sur ce site" },
        { value: "Le Figaro", label: "cité · mai 2026", href: FIGARO_URL, external: true },
      ];

  return (
    <div className={`bg-obsidian px-2.5 lg:px-0 ${className}`}>
      {/* Cellules en cascade (Stagger) : la grille (bordures Blueprint) reste
          statique, le contenu des cellules se révèle et les chiffres se
          construisent (CountUp) — la preuve accroche l'œil sans layout shift. */}
      <Stagger className="mx-auto grid w-full max-w-[1200px] grid-cols-2 border-x border-b border-dark-gray lg:grid-cols-4">
        {items.map((item) => {
          const inner = (
            <StaggerItem className="flex w-full flex-col gap-1">
              <span className="flex items-baseline gap-1.5">
                <span className="font-mono text-lg tracking-tight text-foreground md:text-xl">
                  {item.count ? (
                    <CountUp end={item.count.end} suffix={item.count.suffix ?? ""} />
                  ) : (
                    item.value
                  )}
                </span>
                {item.href && (
                  <ArrowUpRight
                    className="h-3 w-3 text-mid-gray transition-colors group-hover:text-accent-secondary"
                    aria-hidden
                  />
                )}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-mid-gray">
                {item.label}
              </span>
            </StaggerItem>
          );

          const cellClass =
            "group flex border-r border-dark-gray px-5 py-4 no-underline last:border-r-0 max-lg:[&:nth-child(2n)]:border-r-0 max-lg:[&:nth-child(-n+2)]:border-b";

          if (item.external && item.href) {
            return (
              <a
                key={item.value}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${cellClass} transition-colors hover:bg-jet/40`}
              >
                {inner}
              </a>
            );
          }
          if (item.href) {
            return (
              <Link
                key={item.value}
                href={item.href as never}
                className={`${cellClass} transition-colors hover:bg-jet/40`}
              >
                {inner}
              </Link>
            );
          }
          return (
            <div key={item.value} className={cellClass}>
              {inner}
            </div>
          );
        })}
      </Stagger>
    </div>
  );
}
