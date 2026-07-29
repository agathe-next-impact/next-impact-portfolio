"use client";

import * as React from "react";
import { X as CloseIcon, Menu as MenuIcon, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { PROFILES } from "@/lib/documentation-profiles";

// Le hub « Quelle techno web ? » — méga-menu : les 6 pages thématiques
// (parcours 4 temps) + accès aux outils et à la bibliothèque.
const HUB_RUBRIQUES = [
  { key: "rubChoisir",      href: "/documentation/choisir" },
  { key: "rubIa",           href: "/documentation/ia-et-code" },
  { key: "rubReparer",      href: "/documentation/reparer" },
  { key: "rubAvantSigner",  href: "/documentation/avant-signer" },
  { key: "rubOutilsMetier", href: "/documentation/outils-metier" },
  { key: "rubPresence",     href: "/documentation/presence" },
  { key: "rubEtreTrouve",   href: "/documentation/etre-trouve" },
] as const;

const HUB_LINKS = [
  { key: "selecteurTechno", href: "/outils/selecteur-techno" },
  { key: "allTools",     href: "/outils" },
  { key: "allResources", href: "/documentation" },
] as const;

// Nav principale — exprime le funnel : Conseil (décider) → Services (construire)
// → Réalisations (preuve) → À propos. Le hub a son propre méga-menu à gauche.
const NAV_LINKS = [
  { key: "conseil",     href: "/conseil" },
  { key: "services",    href: "/solutions-web" },
  { key: "caseStudies", href: "/etudes-de-cas" },
  { key: "about",       href: "/a-propos" },
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
          {/* Méga-menu hub « Quelle techno web ? » — ouvre au survol ET au focus
              clavier (CSS pur, 0 JS), comme l'ancien menu « À la demande ». */}
          <div className="group relative">
            <button
              type="button"
              aria-haspopup="menu"
              className="inline-flex items-center gap-1 px-3 py-2 text-sm text-mid-gray transition-colors hover:text-foreground group-focus-within:text-foreground"
            >
              {t("hub")}
              <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
            </button>
            <div className="invisible absolute left-0 top-full z-50 w-[min(560px,92vw)] border border-dark-gray bg-obsidian opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <div className="grid grid-cols-2">
                {HUB_RUBRIQUES.map((item, i) => (
                  <Link
                    key={item.key}
                    href={item.href as Parameters<typeof Link>[0]["href"]}
                    className={
                      "border-b border-dark-gray px-4 py-3 text-sm text-mid-gray no-underline transition-colors hover:bg-jet hover:text-foreground " +
                      (i % 2 === 0 ? "border-r" : "")
                    }
                  >
                    {t(item.key as Parameters<typeof t>[0])}
                  </Link>
                ))}
              </div>
              <div className="flex">
                {HUB_LINKS.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href as Parameters<typeof Link>[0]["href"]}
                    className="flex-1 border-r border-dark-gray px-4 py-3 font-mono text-[10px] uppercase tracking-[0.1em] text-accent-secondary no-underline transition-colors last:border-r-0 hover:bg-jet hover:text-foreground"
                  >
                    {t(item.key as Parameters<typeof t>[0])}
                  </Link>
                ))}
              </div>
            </div>
          </div>

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

          {/* CTA à deux températures : « Réserver une visio » (tiède, secondaire)
              + « Audit gratuit » (froid, vermillon, dominant). */}
          <Link
            href="/conseil"
            className="text-sm text-mid-gray no-underline transition-colors hover:text-foreground"
          >
            {t("bookVisio")}
          </Link>
          <Link
            href="/audit-site-web"
            className="inline-flex h-9 items-center rounded-sm bg-vermilion px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-white no-underline transition-colors hover:bg-vermilion-bright"
          >
            {t("freeAudit")}
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
              {/* Hub « Quelle techno web ? » + ses rubriques */}
              <div className="border-b border-dark-gray px-5 pb-2 pt-5 font-mono text-[9px] uppercase tracking-[0.14em] text-mid-gray">
                {t("hub")}
              </div>
              {HUB_RUBRIQUES.map((item) => (
                <Link
                  key={item.key}
                  href={item.href as Parameters<typeof Link>[0]["href"]}
                  onClick={() => setMobileOpen(false)}
                  className="block border-b border-dark-gray px-5 py-3.5 font-mono text-[11px] uppercase tracking-[0.1em] text-mid-gray no-underline transition-colors hover:text-foreground"
                >
                  {t(item.key as Parameters<typeof t>[0])}
                </Link>
              ))}
              {HUB_LINKS.map((item) => (
                <Link
                  key={item.key}
                  href={item.href as Parameters<typeof Link>[0]["href"]}
                  onClick={() => setMobileOpen(false)}
                  className="block border-b border-dark-gray px-5 py-3.5 font-mono text-[11px] uppercase tracking-[0.1em] text-accent-secondary no-underline transition-colors hover:text-foreground"
                >
                  {t(item.key as Parameters<typeof t>[0])}
                </Link>
              ))}

              {/* Nav principale */}
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

              {/* CTA à deux températures */}
              <div className="flex flex-col gap-3 p-5">
                <Link
                  href="/audit-site-web"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-11 items-center justify-center rounded-sm bg-vermilion px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-white no-underline transition-colors hover:bg-vermilion-bright"
                >
                  {t("freeAudit")}
                </Link>
                <Link
                  href="/conseil"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-11 items-center justify-center rounded-sm border border-dark-gray px-4 font-mono text-[11px] uppercase tracking-[0.1em] text-mid-gray no-underline transition-colors hover:text-foreground"
                >
                  {t("bookVisio")}
                </Link>
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
