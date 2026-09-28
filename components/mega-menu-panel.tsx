"use client";

import * as React from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useSamePageAnchor } from "@/hooks/use-same-page-anchor";
import type { Locale } from "@/i18n/routing";
import type { MegaSection, MegaItem } from "@/lib/mega-menu";

type NavHref = Parameters<typeof Link>[0]["href"];

// ─────────────────────────────────────────────────────────────────────────────
// Panneau de mega menu — style « Blueprint » (obsidian + bordures de grille +
// mono/vermilion). Deux ou trois cases, une par offre, rendues plein largeur
// sous la barre du header (pattern gap-px bg-dark-gray pour les traits de
// grille). La grille suit le nombre de cases : « Gérer » en compte deux.
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
  const price = item.price?.[locale];
  const tag = item.tag?.[locale];

  // Ancre vers une section de la page courante (ex. « Audit + roadmap » →
  // /conseil#architecture-projet-ia depuis /conseil) : le Link next-intl ne fait
  // qu'une navigation « même route » sans scroller. Le hook s'en charge, ici
  // comme dans l'accordéon mobile du header.
  const scrollToAnchor = useSamePageAnchor();

  const handleClick = (e: React.MouseEvent) => {
    scrollToAnchor(item.href, e);
    onNavigate();
  };

  // Trois niveaux de lecture distincts, pour que les cases ne se ressemblent
  // pas toutes : le nom en grand, le sous-titre en texte courant, le prix en
  // pied de case. La case gratuite ou recommandée prend le bord d'accent et
  // une pastille pleine ; les autres restent sobres.
  const className = `group flex min-h-[176px] flex-col p-6 no-underline transition-colors lg:p-8 ${
    item.featured
      ? "bg-obsidian shadow-[inset_0_0_0_1px_hsl(var(--accent-2))] hover:bg-jet"
      : "bg-jet hover:bg-obsidian"
  }`;

  const inner = (
    <>
      {tag && (
        <span className="mb-3 self-start rounded-full bg-accent-secondary px-2.5 py-0.5 font-mono text-2xs uppercase tracking-[0.12em] text-obsidian">
          {tag}
        </span>
      )}
      <h3
        className={`inline-flex items-center gap-1 text-2xl font-light leading-tight tracking-tight transition-colors group-hover:text-accent-secondary ${
          item.featured ? "text-accent-secondary" : "text-foreground"
        }`}
      >
        {label}
        {item.external && (
          <ArrowUpRight size={14} className="text-mid-gray transition-colors group-hover:text-accent-secondary" />
        )}
      </h3>
      <p className="mt-1.5 flex-1 font-inter-tight text-base leading-snug text-foreground/75">
        {desc}
      </p>
      <span className="mt-5 flex items-end justify-between gap-4 border-t border-dark-gray pt-3">
        <span className="text-lg tracking-tight text-foreground">{price}</span>
        {!item.external && (
          <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-2xs uppercase tracking-[0.08em] text-mid-gray transition-colors group-hover:text-accent-secondary">
            {locale === "en" ? "Discover" : "Découvrir"}
            <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
          </span>
        )}
      </span>
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

  if (item.horsLocale) {
    return (
      <a href={item.href} onClick={onNavigate} className={className}>
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
  const t = useTranslations("nav");
  // Le nom de l'entrée de nav (« Prestations ») : le bouton dit où il mène.
  const navLabel = t(section.key as Parameters<typeof t>[0]);

  return (
    <div id={`mega-${section.key}`} className="border-x border-b border-dark-gray">
      {/* Ligne supérieure : mène à la page mère, comme l'entrée de nav qui
          ouvre le panneau. À gauche le besoin, à droite un bouton qui dit où
          l'on va (« Voir la page Prestations »), toute la ligne cliquable. */}
      {/* Sans page mère (« À propos ») : le besoin seul, sans lien. */}
      {!section.href ? (
        <div className="flex flex-col gap-0.5 border-b border-dark-gray bg-obsidian px-6 py-4 lg:px-8">
          <span className="font-mono text-2xs uppercase tracking-[0.14em] text-mid-gray">
            {locale === "en" ? "Your need" : "Votre besoin"}
          </span>
          <span className="text-xl font-light tracking-tight text-foreground">
            {section.heading[locale]}
          </span>
        </div>
      ) : (
      <Link
        href={section.href as NavHref}
        onClick={onNavigate}
        className="group flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-dark-gray bg-obsidian px-6 py-4 no-underline transition-colors hover:bg-jet lg:px-8"
      >
        <span className="flex flex-col gap-0.5">
          <span className="font-mono text-2xs uppercase tracking-[0.14em] text-mid-gray">
            {locale === "en" ? "Your need" : "Votre besoin"}
          </span>
          <span className="text-xl font-light tracking-tight text-foreground">
            {section.heading[locale]}
          </span>
        </span>
        <span className="inline-flex min-h-10 items-center gap-2 rounded-sm border border-accent-secondary px-4 font-mono text-sm font-semibold uppercase tracking-[0.1em] text-accent-secondary transition-colors group-hover:bg-accent-secondary group-hover:text-obsidian">
          {locale === "en" ? `See the ${navLabel} page` : `Voir la page ${navLabel}`}
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
      )}

      {/* Une case par offre : deux ou trois colonnes selon le moment. */}
      <div
        className={`grid gap-px bg-dark-gray ${
          section.items.length === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3"
        }`}
      >
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
