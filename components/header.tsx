"use client";

import * as React from "react";
import {
  X as CloseIcon,
  Menu as MenuIcon,
  KeyRound,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { ThemeToggle } from "@/components/theme-toggle";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { PROFILES } from "@/lib/documentation-profiles";
import { packHref } from "@/lib/situations";
import { CTO_PATH } from "@/lib/cto-externalise";
import { CTA_CHAUD } from "@/lib/visio-conseil";

type NavHref = Parameters<typeof Link>[0]["href"];

// Nav principale — trois moments, puis la preuve et la personne.
//
// Nav : Audit · Prestations web · Accompagnement (Maintenance + Référent technique externalisé, ADR-046) · Études de cas (libellés
// choisis par Agathe le 2026-09-27, ADR-022 ; « La veille » retirée et
// « Pilotage » remplacé par Maintenance et Conseil le 2026-10-14, ADR-043 et
// ADR-044 ; auparavant Diagnostiquer · Évoluer · Gérer · La veille, charte
// v1.5, ADR-013). Audit et Prestations (clé `refaire`) sont des mega menus dérivés de
// lib/mega-menu.ts :
// le panneau n'est monté dans le DOM que lorsqu'il est ouvert, ce qui évite le
// préchargement fantôme des destinations (le menu « Ressources » avait été
// retiré le 2026-08-16 pour cette raison).
// Les abonnements (suivi et maintenance, expert technique externalisé) vivent
// dans « Gérer », toujours en dernier : offres de fin de parcours, jamais en
// porte d'entrée froide. Les clés `decider`, `refaire`, `tenir` sont des
// identifiants techniques : seuls les libellés affichés ont changé.
//
// Bouton du header = l'échange gratuit sur Calendly, « Discutons-en »
// (2026-09-28, remplace le lien vers /contact). L'analyse du site (CTA froid) et la prise de
// rendez-vous (CTA chaud) restent dans le tiroir mobile et en fin de page.

// Plus aucun mega menu : « Audit » (clé `decider`), « Prestations web » (clé
// `refaire`) et « CTO externe » sont des liens directs vers leur page. Les
// panneaux « Agents de veille IA » et « Suivi et Pilotage » étaient retirés
// le 2026-10-14 (ADR-043, ADR-044).
const DIRECT_LINKS = [
  { key: "decider", href: packHref("etat-des-lieux") },
  { key: "refaire", href: "/solutions-web" },
  { key: "ctoExterne", href: CTO_PATH },
] as const;

// Puis des liens simples, sans sous-menu (demandes d'Agathe du 2026-10-14) :
// « Maintenance » (offre suivi et maintenance), « Conseil » (offre expert
// technique externalisé, la direction technique), « Études de cas » (clé `realisation`, études de
// cas, remplace le mega menu « À propos »).
const SIMPLE_LINKS = [
  { key: "realisation", href: "/etudes-de-cas" },
] as const;

// CTA froid : /scan vit hors de app/[locale]/ (groupe (sentinelle)) — balise
// <a> et non le Link i18n, qui donnerait /en/scan en anglais.
const SCAN_HREF = "/scan";
// CTA chaud (navbar et tiroir mobile) : l'échange de 15 minutes, source unique CTA_CHAUD
// (lib/visio-conseil.ts, ADR-023), libellé fixe de la charte §7.
const CTA_HREF = CTA_CHAUD.href;

export default function Header() {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { profileId, clearProfile } = useDocumentationMode();

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

  return (
    // `id="top"` = cible du lien « ↑ Haut de page » du footer.
    <header id="top" className="sticky top-0 z-50 bg-obsidian px-2.5 lg:px-0">
      {/* Wrapper relatif : porte la barre. */}
      <div
        className="relative mx-auto w-full max-w-[1200px]"
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

          {/* Desktop nav : Audit (lien) · Prestations web · Accompagnement (mega) · Études de cas */}
          <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {DIRECT_LINKS.map(({ key, href }) => (
              <Link
                key={key}
                href={href as NavHref}
                className="inline-flex items-center px-3 py-2 text-sm text-mid-gray no-underline transition-colors hover:text-foreground"
              >
                {t(key)}
              </Link>
            ))}
            {SIMPLE_LINKS.map(({ key, href }) => (
              <Link
                key={key}
                href={href}
                className="inline-flex items-center px-3 py-2 text-sm text-mid-gray no-underline transition-colors hover:text-foreground"
              >
                {t(key)}
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

            {/* Espace client : accès direct à l'espace des accompagnements.
                Balise <a> : /espace-direction vit hors de app/[locale]/, le
                Link i18n la préfixerait en /en/… */}
            <a
              href="/espace-direction"
              className="inline-flex items-center gap-1.5 px-2 py-2 text-sm text-mid-gray no-underline transition-colors hover:text-foreground"
            >
              <KeyRound size={14} aria-hidden />
              {t("espaceClient")}
            </a>

            <ThemeToggle />

            {/* CTA de la navbar : l'échange gratuit sur Calendly, nouvel
                onglet (demande d'Agathe du 2026-09-28, remplace /contact). */}
            <a
              href={CTA_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center rounded-sm bg-accent-secondary px-4 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-obsidian no-underline transition-colors hover:bg-accent-secondary/85"
            >
              {t("discutonsEn")}
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
              {DIRECT_LINKS.map(({ key, href }) => (
                <Link
                  key={key}
                  href={href as NavHref}
                  onClick={() => setMobileOpen(false)}
                  className="flex min-h-16 w-full items-center border-b border-dark-gray px-5 py-3 text-xl font-light tracking-tight text-foreground no-underline"
                >
                  {t(key)}
                </Link>
              ))}
              {SIMPLE_LINKS.map(({ key, href }) => (
                <Link
                  key={key}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="flex min-h-16 w-full items-center border-b border-dark-gray px-5 py-3 text-xl font-light tracking-tight text-foreground no-underline"
                >
                  {t(key)}
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

              <a
                href="/espace-direction"
                onClick={() => setMobileOpen(false)}
                className="flex min-h-12 items-center gap-2 px-5 font-inter-tight text-sm text-mid-gray no-underline"
              >
                <KeyRound size={14} aria-hidden />
                {t("espaceClient")}
              </a>
            </nav>

            {/* Deux températures, toujours visibles : l'analyse (froid), l'échange (chaud). */}
            <div className="grid shrink-0 grid-cols-1 gap-2 border-t border-dark-gray bg-obsidian p-4 pb-[max(1rem,env(safe-area-inset-bottom))] min-[380px]:grid-cols-2">
              <a
                href={SCAN_HREF}
                onClick={() => setMobileOpen(false)}
                className="inline-flex min-h-12 items-center justify-center rounded-sm bg-accent-secondary px-3 text-center font-mono text-xs font-semibold uppercase tracking-[0.1em] text-obsidian no-underline"
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
                {t("echangeGratuit")}
              </a>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
