"use client";

import * as React from "react";
import {
  X as CloseIcon,
  Menu as MenuIcon,
  ChevronDown,
  ArrowRight,
  ArrowUpRight,
  KeyRound,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { ThemeToggle } from "@/components/theme-toggle";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { PROFILES } from "@/lib/documentation-profiles";
import { MEGA_SECTIONS } from "@/lib/mega-menu";
import { MegaMenuPanel } from "@/components/mega-menu-panel";
import { useSamePageAnchor } from "@/hooks/use-same-page-anchor";
import { CTA_CHAUD } from "@/lib/visio-conseil";

type NavHref = Parameters<typeof Link>[0]["href"];

// Nav principale — trois moments, puis la preuve et la personne.
//
// Nav : Audit · Prestations · Pilotage · Veille · Études de cas (libellés
// choisis par Agathe le 2026-09-27, ADR-022 ; auparavant Diagnostiquer ·
// Évoluer · Gérer · La veille, charte
// v1.5, ADR-013 ; « La veille » placée avant les études de cas à la demande
// d'Agathe). Les trois moments et « La veille » (clé technique `surveiller` :
// lettre de veille, Sentinelle) sont des mega menus dérivés de
// lib/mega-menu.ts :
// le panneau n'est monté dans le DOM que lorsqu'il est ouvert, ce qui évite le
// préchargement fantôme des destinations (le menu « Ressources » avait été
// retiré le 2026-08-16 pour cette raison).
// Les abonnements (suivi et maintenance, expert technique externalisé) vivent
// dans « Gérer », toujours en dernier : offres de fin de parcours, jamais en
// porte d'entrée froide. Les clés `decider`, `refaire`, `tenir` sont des
// identifiants techniques : seuls les libellés affichés ont changé.
//
// Bouton du header = le CTA froid unique du site : l'analyse du site (/scan),
// libellé court. La prise de rendez-vous (CTA chaud) reste dans le tiroir
// mobile et en fin de chaque page.

// Les entrées à mega menu (clé = clé de traduction `nav`) : les trois moments,
// puis « La veille ».
const MEGA_KEYS = ["decider", "refaire", "tenir", "surveiller"] as const;

// Les entrées de nav simples (sans panneau).
const NAV_PLAIN_BEFORE = [{ key: "caseStudies", href: "/etudes-de-cas" }] as const;

// CTA froid : /scan vit hors de app/[locale]/ (groupe (sentinelle)) — balise
// <a> et non le Link i18n, qui donnerait /en/scan en anglais.
const SCAN_HREF = "/scan";
// CTA chaud (tiroir mobile) : l'échange de 15 minutes, source unique CTA_CHAUD
// (lib/visio-conseil.ts, ADR-023), libellé fixe de la charte §7.
const CTA_HREF = CTA_CHAUD.href;

export default function Header() {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = React.useState<string | null>(null);
  const { profileId, clearProfile } = useDocumentationMode();

  // Les destinations du mega menu et du CTA sont des ancres d'offre : une fois
  // sur la page cible, c'est ce handler qui scrolle (le Link next-intl, lui, ne
  // ferait qu'une navigation « même route » sans bouger la vue).
  const scrollToAnchor = useSamePageAnchor();

  const closeMenu = React.useCallback(() => setActiveMenu(null), []);

  // Tiroir mobile ouvert : la page derrière ne défile plus, Échap le ferme.
  React.useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  // Escape ferme le panneau ouvert.
  React.useEffect(() => {
    if (!activeMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveMenu(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [activeMenu]);

  return (
    // `id="top"` = cible du lien « ↑ Haut de page » du footer.
    <header id="top" className="sticky top-0 z-50 bg-obsidian px-2.5 lg:px-0">
      {/* Wrapper relatif : porte la barre + le panneau de mega menu. Le survol
          qui quitte l'ensemble ferme le panneau ; le focus qui sort aussi. */}
      <div
        className="relative mx-auto w-full max-w-[1200px]"
        onMouseLeave={closeMenu}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) closeMenu();
        }}
      >
        <div className="flex h-16 items-center justify-between border border-x-dark-gray border-b border-b-dark-gray border-t-0 px-5 lg:px-6">
          {/* Logotype */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-foreground no-underline"
          >
            <span className="text-2xs text-vermilion">◼</span>
            NEXT IMPACT
          </Link>

          {/* Desktop nav : Audit · Prestations · Pilotage · Veille (mega) · Études de cas */}
          <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {MEGA_KEYS.map((key) => {
              const section = MEGA_SECTIONS[key];
              const open = activeMenu === key;
              return (
                // L'entrée mène à sa page mère (demande d'Agathe du
                // 2026-09-27, revient sur l'ADR-022 §13) ; le survol et le
                // focus ouvrent toujours le panneau.
                <Link
                  key={key}
                  href={section.href as NavHref}
                  aria-haspopup="true"
                  aria-expanded={open}
                  aria-controls={`mega-${key}`}
                  onMouseEnter={() => setActiveMenu(key)}
                  onFocus={() => setActiveMenu(key)}
                  onClick={closeMenu}
                  className={`inline-flex items-center gap-1 px-3 py-2 text-sm no-underline transition-colors hover:text-foreground ${
                    open ? "text-foreground" : "text-mid-gray"
                  }`}
                >
                  {t(key as Parameters<typeof t>[0])}
                  <ChevronDown
                    size={13}
                    aria-hidden
                    className={`transition-transform ${open ? "rotate-180" : ""}`}
                  />
                </Link>
              );
            })}

            {NAV_PLAIN_BEFORE.map((item) => (
              <Link
                key={item.key}
                href={item.href as NavHref}
                onMouseEnter={closeMenu}
                onFocus={closeMenu}
                className="px-3 py-2 text-sm text-mid-gray no-underline transition-colors hover:text-foreground"
              >
                {t(item.key as Parameters<typeof t>[0])}
              </Link>
            ))}
          </nav>

          {/* Desktop right */}
          <div className="hidden items-center gap-3 lg:flex">
            {/* Profile tag — visible only when a profile is active */}
            <div
              className="overflow-hidden whitespace-nowrap transition-all duration-200"
              style={{ maxWidth: profileId ? 160 : 0, opacity: profileId ? 1 : 0 }}
            >
              <span className="inline-flex items-center gap-2 border-l-2 border-vermilion pl-2 font-mono text-2xs uppercase tracking-[0.12em] text-mid-gray">
                {profileId && PROFILES[profileId].label}
                <button
                  type="button"
                  onClick={clearProfile}
                  aria-label="Réinitialiser le profil"
                  className="flex items-center text-mid-gray transition-colors hover:text-foreground"
                >
                  <CloseIcon size={10} strokeWidth={2} />
                </button>
              </span>
            </div>

            {/* Espace client : signale son existence au prospect, sert l'accès
                aux clients. Page vitrine qui aiguille vers les deux connexions. */}
            <Link
              href="/espace-client"
              onMouseEnter={closeMenu}
              className="inline-flex items-center gap-1.5 px-2 py-2 text-sm text-mid-gray no-underline transition-colors hover:text-foreground"
            >
              <KeyRound size={14} aria-hidden />
              {t("espaceClient")}
            </Link>

            <ThemeToggle />

            {/* CTA froid unique : l'analyse du site. */}
            <a
              href={SCAN_HREF}
              onMouseEnter={closeMenu}
              className="inline-flex h-9 items-center rounded-sm bg-accent-secondary px-4 font-mono text-2xs font-semibold uppercase tracking-[0.1em] text-obsidian no-underline transition-colors hover:bg-accent-secondary/85"
            >
              {t("analyserSite")}
            </a>
          </div>

          {/* Mobile right */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(true)}
              aria-label={t("openMenu")}
              className="flex h-9 w-9 items-center justify-center rounded-sm border border-dark-gray text-foreground transition-colors hover:bg-ebony"
            >
              <MenuIcon className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>

        {/* Panneau de mega menu (desktop) — monté seulement à l'ouverture. */}
        {activeMenu && (
          <div className="absolute left-0 right-0 top-16 z-50 hidden lg:block">
            <MegaMenuPanel section={MEGA_SECTIONS[activeMenu]} onNavigate={closeMenu} />
          </div>
        )}
      </div>

      {/* Tiroir mobile, pensé pour un usage simple (demande d'Agathe du
          2026-09-27, ADR-022) :
          – chaque rubrique est une grande ligne lisible : son nom, et dessous
            le besoin qu'elle sert (« Je veux pouvoir décider »), pour savoir
            quoi ouvrir sans connaître le vocabulaire ;
          – une rubrique ouverte liste ses offres en cibles tactiles d'au moins
            48 px : nom, sous-titre, prix à droite ; l'offre mise en avant garde
            son accent ; la page mère ferme la liste (« Voir la page … ») ;
          – les deux actions (analyse du site, échange) restent épinglées en
            bas, visibles sans défiler ;
          – Échap ferme le tiroir, la page derrière ne défile plus. */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-[48] bg-black/60 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-y-0 left-0 z-[49] flex w-full max-w-[420px] flex-col border-r border-dark-gray bg-obsidian lg:hidden"
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-dark-gray px-5">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-foreground no-underline"
              >
                <span className="text-2xs text-vermilion">◼</span>
                NEXT IMPACT
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label={t("closeMenu")}
                className="flex h-11 w-11 items-center justify-center rounded-sm border border-dark-gray text-foreground"
              >
                <CloseIcon className="h-[18px] w-[18px]" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto overscroll-contain">
              {MEGA_KEYS.map((key) => {
                const section = MEGA_SECTIONS[key];
                const expanded = mobileExpanded === key;
                const label = t(key as Parameters<typeof t>[0]);
                return (
                  <div key={key} className="border-b border-dark-gray">
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={`mobile-${key}`}
                      onClick={() => setMobileExpanded((cur) => (cur === key ? null : key))}
                      className="flex min-h-16 w-full items-center justify-between gap-4 px-5 py-3 text-left"
                    >
                      <span className="flex flex-col gap-0.5">
                        <span
                          className={`text-xl font-light tracking-tight ${
                            expanded ? "text-accent-secondary" : "text-foreground"
                          }`}
                        >
                          {label}
                        </span>
                        <span className="font-inter-tight text-sm text-mid-gray">
                          {section.heading[locale]}
                        </span>
                      </span>
                      <ChevronDown
                        size={20}
                        aria-hidden
                        className={`shrink-0 text-mid-gray transition-transform ${expanded ? "rotate-180" : ""}`}
                      />
                    </button>

                    {expanded && (
                      <ul id={`mobile-${key}`} className="flex flex-col gap-2 bg-jet px-3 pb-4 pt-3">
                        {section.items.map((item) => {
                          const inner = (
                            <>
                              <span className="flex min-w-0 flex-col gap-0.5">
                                <span
                                  className={`inline-flex items-center gap-1 text-base ${
                                    item.featured ? "text-accent-secondary" : "text-foreground"
                                  }`}
                                >
                                  {item.label[locale]}
                                  {item.external && <ArrowUpRight size={12} className="text-mid-gray" />}
                                </span>
                                <span className="font-inter-tight text-sm leading-snug text-mid-gray">
                                  {item.desc[locale]}
                                </span>
                              </span>
                              <span className="flex shrink-0 flex-col items-end gap-1 text-right">
                                {item.tag && (
                                  <span className="rounded-full bg-accent-secondary px-2 py-0.5 font-mono text-2xs uppercase tracking-[0.1em] text-obsidian">
                                    {item.tag[locale]}
                                  </span>
                                )}
                                {item.price && (
                                  <span className="max-w-[9rem] font-inter-tight text-sm leading-snug text-foreground">
                                    {item.price[locale]}
                                  </span>
                                )}
                              </span>
                            </>
                          );
                          const cls = `flex min-h-12 items-center justify-between gap-3 rounded-sm border px-3 py-3 no-underline transition-colors ${
                            item.featured
                              ? "border-accent-secondary bg-obsidian"
                              : "border-dark-gray bg-obsidian/40 active:bg-obsidian"
                          }`;
                          return (
                            <li key={`${item.label.fr}-${item.href}`}>
                              {item.external ? (
                                <a
                                  href={item.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => setMobileOpen(false)}
                                  className={cls}
                                >
                                  {inner}
                                </a>
                              ) : (
                                <Link
                                  href={item.href as NavHref}
                                  onClick={(e) => {
                                    scrollToAnchor(item.href, e);
                                    setMobileOpen(false);
                                  }}
                                  className={cls}
                                >
                                  {inner}
                                </Link>
                              )}
                            </li>
                          );
                        })}
                        {/* La page mère, en fin de liste (ADR-022). */}
                        <li>
                          <Link
                            href={section.href as NavHref}
                            onClick={() => setMobileOpen(false)}
                            className="flex min-h-12 items-center justify-center gap-2 rounded-sm px-3 font-mono text-xs uppercase tracking-[0.1em] text-accent-secondary no-underline"
                          >
                            {locale === "en" ? `See the ${label} page` : `Voir la page ${label}`}
                            <ArrowRight size={14} />
                          </Link>
                        </li>
                      </ul>
                    )}
                  </div>
                );
              })}

              {NAV_PLAIN_BEFORE.map((item) => (
                <Link
                  key={item.key}
                  href={item.href as NavHref}
                  onClick={() => setMobileOpen(false)}
                  className="flex min-h-16 items-center border-b border-dark-gray px-5 text-xl font-light tracking-tight text-foreground no-underline"
                >
                  {t(item.key as Parameters<typeof t>[0])}
                </Link>
              ))}

              {profileId && (
                <button
                  type="button"
                  onClick={() => {
                    clearProfile();
                    setMobileOpen(false);
                  }}
                  className="flex min-h-12 w-full items-center justify-between border-b border-l-2 border-dark-gray border-l-vermilion px-5 text-left font-mono text-2xs uppercase tracking-[0.12em] text-mid-gray"
                >
                  <span>{PROFILES[profileId].label}</span>
                  <CloseIcon size={12} strokeWidth={2} />
                </button>
              )}

              <Link
                href="/espace-client"
                onClick={() => setMobileOpen(false)}
                className="flex min-h-12 items-center gap-2 px-5 font-inter-tight text-sm text-mid-gray no-underline"
              >
                <KeyRound size={14} aria-hidden />
                {t("espaceClient")}
              </Link>
            </nav>

            {/* Deux températures, toujours visibles : l'analyse (froid), l'échange (chaud). */}
            <div className="grid shrink-0 grid-cols-1 gap-2 border-t border-dark-gray bg-obsidian p-4 pb-[max(1rem,env(safe-area-inset-bottom))] min-[380px]:grid-cols-2">
              <a
                href={SCAN_HREF}
                onClick={() => setMobileOpen(false)}
                className="inline-flex min-h-12 items-center justify-center rounded-sm bg-accent-secondary px-3 text-center font-mono text-2xs font-semibold uppercase tracking-[0.1em] text-obsidian no-underline"
              >
                {t("analyserSite")}
              </a>
              <a
                href={CTA_HREF}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="inline-flex min-h-12 items-center justify-center rounded-sm border border-dark-gray px-3 text-center font-mono text-2xs uppercase tracking-[0.1em] text-foreground no-underline"
              >
                {t("startWebApp")}
              </a>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
