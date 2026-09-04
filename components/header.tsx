"use client";

import * as React from "react";
import {
  X as CloseIcon,
  Menu as MenuIcon,
  ChevronDown,
  ArrowUpRight,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { ThemeToggle } from "@/components/theme-toggle";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { PROFILES } from "@/lib/documentation-profiles";
import { MEGA_SECTIONS } from "@/lib/mega-menu";
import { MegaMenuPanel } from "@/components/mega-menu-panel";

type NavHref = Parameters<typeof Link>[0]["href"];

// Nav principale — l'offre, puis À propos.
//
// Le menu déroulant « Ressources » a été retiré le 2026-08-16 (l'observateur de
// prefetch comptait son panneau masqué comme visible). Il est remplacé ici par
// des mega menus par rubrique (Veille · Conseil · Services), dérivés de
// lib/mega-menu.ts : le panneau n'est monté dans le DOM que lorsqu'il est ouvert,
// ce qui évite le préchargement fantôme des destinations.
// Nav : Veille · Conseil · Services · Études de cas · À propos.
// La visio conseil est portée par le bouton CTA ; le diagnostic reste accessible
// depuis le footer et la home.

// Les trois rubriques à mega menu (clé = clé de traduction `nav`).
const MEGA_KEYS = ["veille", "conseil", "services"] as const;

// Les entrées de nav simples (sans panneau).
const NAV_PLAIN_BEFORE = [{ key: "caseStudies", href: "/etudes-de-cas" }] as const;
const NAV_AFTER = [{ key: "about", href: "/a-propos" }] as const;

export default function Header() {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = React.useState<string | null>(null);
  const { profileId, clearProfile } = useDocumentationMode();

  const closeMenu = React.useCallback(() => setActiveMenu(null), []);

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
            <span className="text-[10px] text-vermilion">◼</span>
            NEXT IMPACT
          </Link>

          {/* Desktop nav — Veille · Conseil · Services (mega) · Études de cas · À propos */}
          <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {MEGA_KEYS.map((key) => {
              const section = MEGA_SECTIONS[key];
              const open = activeMenu === key;
              return (
                <Link
                  key={key}
                  href={section.href as NavHref}
                  aria-haspopup="true"
                  aria-expanded={open}
                  onMouseEnter={() => setActiveMenu(key)}
                  onFocus={() => setActiveMenu(key)}
                  className={`inline-flex items-center gap-1 px-3 py-2 text-sm no-underline transition-colors hover:text-foreground ${
                    open ? "text-foreground" : "text-mid-gray"
                  }`}
                >
                  {t(key as Parameters<typeof t>[0])}
                  <ChevronDown
                    size={13}
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

            {NAV_AFTER.map((item) => (
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
              <span className="inline-flex items-center gap-2 border-l-2 border-vermilion pl-2 font-mono text-[9px] uppercase tracking-[0.12em] text-mid-gray">
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

            <ThemeToggle />

            {/* CTA unique : la visio conseil prend la place du contact. */}
            <Link
              href="/conseil#choix-techno-ia"
              onMouseEnter={closeMenu}
              className="inline-flex h-9 items-center rounded-sm bg-accent-secondary px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-obsidian no-underline transition-colors hover:bg-accent-secondary/85"
            >
              {t("visioConseil")}
            </Link>
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

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-[48] bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed bottom-0 left-0 top-0 z-[49] flex w-[min(340px,88vw)] flex-col border-r border-dark-gray bg-obsidian">
            <div className="flex h-16 items-center justify-between border-b border-dark-gray px-5">
              <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-foreground">
                <span className="text-[9px] text-vermilion">◼</span>
                NEXT IMPACT
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label={t("closeMenu")}
                className="flex items-center text-foreground"
              >
                <CloseIcon className="h-[18px] w-[18px]" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto">
              {/* Rubriques à mega menu — accordéon. */}
              {MEGA_KEYS.map((key) => {
                const section = MEGA_SECTIONS[key];
                const expanded = mobileExpanded === key;
                return (
                  <div key={key} className="border-b border-dark-gray">
                    <div className="flex items-stretch">
                      <Link
                        href={section.href as NavHref}
                        onClick={() => setMobileOpen(false)}
                        className="flex-1 px-5 py-4 font-mono text-[11px] uppercase tracking-[0.1em] text-mid-gray no-underline transition-colors hover:text-foreground"
                      >
                        {t(key as Parameters<typeof t>[0])}
                      </Link>
                      <button
                        type="button"
                        aria-label={t(key as Parameters<typeof t>[0])}
                        aria-expanded={expanded}
                        onClick={() =>
                          setMobileExpanded((cur) => (cur === key ? null : key))
                        }
                        className="flex w-12 items-center justify-center border-l border-dark-gray text-mid-gray transition-colors hover:text-foreground"
                      >
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${expanded ? "rotate-180" : ""}`}
                        />
                      </button>
                    </div>

                    {expanded && (
                      <ul className="flex flex-col bg-jet px-5 pb-4 pt-1">
                        {section.items.map((item) => (
                          <li key={`${item.label.fr}-${item.href}`}>
                            {item.external ? (
                              <a
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-1 py-2.5 text-sm text-foreground/90 no-underline transition-colors hover:text-accent-secondary"
                              >
                                {item.label[locale]}
                                {item.badge && (
                                  <span className="ml-1 font-mono text-[9px] uppercase tracking-[0.1em] text-accent-secondary">
                                    · {item.badge[locale]}
                                  </span>
                                )}
                                <ArrowUpRight size={12} className="text-mid-gray" />
                              </a>
                            ) : (
                              <Link
                                href={item.href as NavHref}
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-1 py-2.5 text-sm text-foreground/90 no-underline transition-colors hover:text-accent-secondary"
                              >
                                {item.label[locale]}
                                {item.badge && (
                                  <span className="ml-1 font-mono text-[9px] uppercase tracking-[0.1em] text-accent-secondary">
                                    · {item.badge[locale]}
                                  </span>
                                )}
                              </Link>
                            )}
                          </li>
                        ))}
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
                  className="block border-b border-dark-gray px-5 py-4 font-mono text-[11px] uppercase tracking-[0.1em] text-mid-gray no-underline transition-colors hover:text-foreground"
                >
                  {t(item.key as Parameters<typeof t>[0])}
                </Link>
              ))}

              {NAV_AFTER.map((item) => (
                <Link
                  key={item.key}
                  href={item.href as NavHref}
                  onClick={() => setMobileOpen(false)}
                  className="block border-b border-dark-gray px-5 py-4 font-mono text-[11px] uppercase tracking-[0.1em] text-mid-gray no-underline transition-colors hover:text-foreground"
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
                  className="flex w-full items-center justify-between border-b border-l-2 border-dark-gray border-l-vermilion px-5 py-3 text-left font-mono text-[9px] uppercase tracking-[0.12em] text-mid-gray transition-colors hover:text-foreground"
                >
                  <span>{PROFILES[profileId].label}</span>
                  <CloseIcon size={10} strokeWidth={2} />
                </button>
              )}

              {/* CTA unique : la visio conseil, comme sur desktop */}
              <div className="flex flex-col gap-3 p-5">
                <Link
                  href="/conseil#choix-techno-ia"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex min-h-11 items-center justify-center rounded-sm bg-accent-secondary px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-obsidian no-underline transition-colors hover:bg-accent-secondary/85"
                >
                  {t("visioConseil")}
                </Link>
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
