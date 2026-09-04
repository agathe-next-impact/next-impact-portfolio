"use client";

import * as React from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { MegaSection, MegaItem } from "@/lib/mega-menu";

type NavHref = Parameters<typeof Link>[0]["href"];

// ─────────────────────────────────────────────────────────────────────────────
// Panneau de mega menu — style « Blueprint » (obsidian + bordures de grille +
// mono/vermilion). Trois cases, une par offre, rendues plein largeur sous la
// barre du header (pattern gap-px bg-dark-gray pour les traits de grille).
// ─────────────────────────────────────────────────────────────────────────────

function Card({
  item,
  locale,
  onNavigate,
}: {
  item: MegaItem;
  locale: Locale;
  onNavigate: () => void;
}) {
  const label = item.label[locale];
  const desc = item.desc[locale];
  const badge = item.badge?.[locale];
  const pathname = usePathname();

  // Ancre vers une section de la page courante (ex. « Vitrine simple » →
  // /solutions-web#forfait-classique depuis /solutions-web) : le Link next-intl
  // ne fait qu'une navigation « même route » sans scroller. On scrolle nous-mêmes.
  const [hrefPath, hrefHash] = item.href.split("#");
  const isSamePageAnchor = Boolean(hrefHash) && hrefPath === pathname;

  const handleClick = (e: React.MouseEvent) => {
    if (isSamePageAnchor) {
      const target = document.getElementById(hrefHash);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
        if (history.replaceState) history.replaceState(null, "", `#${hrefHash}`);
      }
    }
    onNavigate();
  };

  const className =
    "group flex min-h-[168px] flex-col bg-jet p-6 no-underline transition-colors hover:bg-obsidian lg:p-8";

  const inner = (
    <>
      {badge && (
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent-secondary">
          {badge}
        </span>
      )}
      <h3 className="mt-3 inline-flex items-center gap-1 text-lg font-light tracking-tight text-foreground transition-colors group-hover:text-accent-secondary">
        {label}
        {item.external && (
          <ArrowUpRight size={14} className="text-mid-gray transition-colors group-hover:text-accent-secondary" />
        )}
      </h3>
      <p className="mt-2 flex-1 font-inter-tight text-sm leading-relaxed text-mid-gray">
        {desc}
      </p>
      {!item.external && (
        <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-accent-secondary">
          {locale === "en" ? "Discover" : "Découvrir"}
          <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      )}
    </>
  );

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onNavigate}
        className={className}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={item.href as NavHref} onClick={handleClick} className={className}>
      {inner}
    </Link>
  );
}

export function MegaMenuPanel({
  section,
  onNavigate,
}: {
  section: MegaSection;
  onNavigate: () => void;
}) {
  const locale = useLocale() as Locale;

  return (
    <div className="border-x border-b border-dark-gray">
      {/* Ligne de catégorie — lien vers la page principale de la rubrique. */}
      <Link
        href={section.href as NavHref}
        onClick={onNavigate}
        className="group flex items-center justify-between gap-3 border-b border-dark-gray bg-jet px-6 py-3 no-underline lg:px-8"
      >
        <span className="inline-flex items-center gap-1 font-mono text-[13px] font-bold uppercase tracking-[0.16em] text-foreground transition-colors group-hover:text-accent-secondary">
          {section.heading[locale]}
          <ArrowUpRight size={14} className="text-mid-gray transition-colors group-hover:text-accent-secondary" />
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-mid-gray transition-colors group-hover:text-accent-secondary">
          {locale === "en" ? "See the page" : "Voir la page"}
          <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>

      {/* Les trois cases, une par offre. */}
      <div className="grid gap-px bg-dark-gray lg:grid-cols-3">
        {section.items.map((item) => (
          <Card
            key={`${item.label.fr}-${item.href}`}
            item={item}
            locale={locale}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  );
}
