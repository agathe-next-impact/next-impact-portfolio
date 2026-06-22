"use client";

import * as React from "react";
import { X as CloseIcon, Menu as MenuIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { PROFILES } from "@/lib/documentation-profiles";

const NAV_LINKS = [
  { key: "services",      href: "/services" },
  { key: "caseStudies",   href: "/etudes-de-cas" },
  { key: "tools",         href: "/outils" },
  { key: "documentation", href: "/documentation" },
  { key: "about",         href: "/a-propos" },
] as const;

export default function Header() {
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { profileId, clearProfile } = useDocumentationMode();

  return (
    <header className="sticky top-0 z-50 bg-obsidian px-2.5 lg:px-0">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between border border-x-dark-gray border-b border-b-dark-gray border-t-0 px-5 lg:px-6">
        {/* Logotype */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-foreground no-underline"
        >
          <span className="text-[10px] text-vermilion">◼</span>
          NEXT IMPACT
        </Link>

        {/* Desktop nav */}
        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.key}
              href={item.href as Parameters<typeof Link>[0]["href"]}
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
          <Link
            href="/contact"
            className="inline-flex h-9 items-center rounded-sm bg-vermilion px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-white no-underline transition-colors hover:bg-vermilion-bright"
          >
            {t("contact")}
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

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-[48] bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed bottom-0 left-0 top-0 z-[49] flex w-[min(320px,85vw)] flex-col border-r border-dark-gray bg-obsidian">
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
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.key}
                  href={item.href as Parameters<typeof Link>[0]["href"]}
                  onClick={() => setMobileOpen(false)}
                  className="block border-b border-dark-gray px-5 py-4 font-mono text-[11px] uppercase tracking-[0.1em] text-mid-gray no-underline transition-colors hover:text-foreground"
                >
                  {t(item.key as Parameters<typeof t>[0])}
                </Link>
              ))}
              {profileId && (
                <button
                  type="button"
                  onClick={() => { clearProfile(); setMobileOpen(false); }}
                  className="flex w-full items-center justify-between border-b border-l-2 border-dark-gray border-l-vermilion px-5 py-3 text-left font-mono text-[9px] uppercase tracking-[0.12em] text-mid-gray transition-colors hover:text-foreground"
                >
                  <span>{PROFILES[profileId].label}</span>
                  <CloseIcon size={10} strokeWidth={2} />
                </button>
              )}

              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="block border-b border-dark-gray bg-vermilion px-5 py-4 font-mono text-[11px] uppercase tracking-[0.1em] text-white no-underline transition-colors hover:bg-vermilion-bright"
              >
                {t("contact")}
              </Link>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
