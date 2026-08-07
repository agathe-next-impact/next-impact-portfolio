"use client";

import * as React from "react";
import { X as CloseIcon, Menu as MenuIcon, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { PROFILES } from "@/lib/documentation-profiles";

type NavHref = Parameters<typeof Link>[0]["href"];

// ── Menu « Ressources » ────────────────────────────────────────────────────
// La documentation passe au second niveau (un clic), elle ne disparaît pas :
// aucune URL n'est modifiée. Groupe 1 = les 7 rubriques du hub, groupe 2 = les
// outils, puis un lien de pied vers toute la documentation.
const RESOURCE_GROUPS = [
  {
    labelKey: "groupByQuestion",
    items: [
      { key: "rubChoisir",      href: "/documentation/choisir" },
      { key: "rubIa",           href: "/documentation/ia-et-code" },
      { key: "rubReparer",      href: "/documentation/reparer" },
      { key: "rubAvantSigner",  href: "/documentation/avant-signer" },
      { key: "rubOutilsMetier", href: "/documentation/outils-metier" },
      { key: "rubPresence",     href: "/documentation/presence" },
      { key: "rubEtreTrouve",   href: "/documentation/etre-trouve" },
    ],
  },
  {
    labelKey: "groupTools",
    items: [
      { key: "boussole", href: "/outils/boussole" },
      { key: "allTools", href: "/outils" },
    ],
  },
] as const;

const RESOURCES_ALL = { key: "allDocumentation", href: "/documentation" } as const;

// Tous les liens du menu, à plat — sert à la navigation clavier (flèches) et à
// la construction du menu mobile.
const RESOURCE_HREFS = [
  ...RESOURCE_GROUPS.flatMap((g) => g.items.map((i) => i.href)),
  RESOURCES_ALL.href,
];

// Nav principale — l'offre d'abord (un prospect froid doit voir ce qu'on vend),
// la documentation à un clic sous « Ressources », puis À propos.
const NAV_BEFORE = [
  { key: "conseil",     href: "/conseil" },
  { key: "services",    href: "/solutions-web" },
  { key: "caseStudies", href: "/etudes-de-cas" },
] as const;

const NAV_AFTER = [
  { key: "about", href: "/a-propos" },
] as const;

/**
 * Menu déroulant « Ressources » (desktop).
 *
 * Le panneau est TOUJOURS rendu dans le DOM — il porte le maillage interne vers
 * la documentation, donc ses liens doivent être présents dans le HTML servi
 * (SSR), pas injectés au clic. L'état fermé passe par `visibility: hidden`, qui
 * retire nativement les liens de l'ordre de tabulation et de l'arbre
 * d'accessibilité, sans les retirer du HTML.
 */
function ResourcesMenu({ t }: { t: ReturnType<typeof useTranslations> }) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const itemRefs = React.useRef<(HTMLAnchorElement | null)[]>([]);
  // Mémorise qu'une ouverture au clavier doit déplacer le focus dans le menu.
  const focusOnOpen = React.useRef<"first" | "last" | null>(null);

  // Fermeture au clic extérieur.
  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Le panneau devient focusable seulement une fois visible : on déplace le
  // focus après le rendu.
  React.useEffect(() => {
    if (!open || !focusOnOpen.current) return;
    const items = itemRefs.current.filter(Boolean);
    const target = focusOnOpen.current === "first" ? items[0] : items[items.length - 1];
    focusOnOpen.current = null;
    target?.focus();
  }, [open]);

  const close = React.useCallback((refocus = true) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  }, []);

  const moveFocus = (delta: number, from: number) => {
    const items = itemRefs.current.filter(Boolean) as HTMLAnchorElement[];
    if (!items.length) return;
    const next = (from + delta + items.length) % items.length;
    items[next]?.focus();
  };

  const onTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      focusOnOpen.current = e.key === "ArrowDown" ? "first" : "last";
      setOpen(true);
    } else if (e.key === "Escape" && open) {
      e.preventDefault();
      close();
    }
  };

  const onItemKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>, index: number) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      moveFocus(1, index);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      moveFocus(-1, index);
    } else if (e.key === "Home") {
      e.preventDefault();
      moveFocus(1, -1);
    } else if (e.key === "End") {
      e.preventDefault();
      moveFocus(-1, 0);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };

  // Tab qui sort du menu (avant ou après) le referme, sans voler le focus.
  const onBlurCapture = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!containerRef.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
  };

  let itemIndex = -1;

  return (
    <div ref={containerRef} className="relative" onBlurCapture={onBlurCapture}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="resources-menu"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onTriggerKeyDown}
        className="inline-flex items-center gap-1 px-3 py-2 text-sm text-mid-gray transition-colors hover:text-foreground aria-expanded:text-foreground"
      >
        {t("resources")}
        <ChevronDown
          className={"h-3.5 w-3.5 transition-transform " + (open ? "rotate-180" : "")}
          aria-hidden
        />
      </button>

      <div
        id="resources-menu"
        className={
          "absolute left-0 top-full z-50 w-[min(560px,92vw)] border border-dark-gray bg-obsidian transition-opacity duration-150 " +
          (open ? "visible opacity-100" : "invisible opacity-0")
        }
      >
        {RESOURCE_GROUPS.map((group) => (
          <div key={group.labelKey}>
            <p className="border-b border-dark-gray px-4 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-mid-gray">
              {t(group.labelKey as Parameters<typeof t>[0])}
            </p>
            <div className="grid grid-cols-2">
              {group.items.map((item, i) => {
                itemIndex += 1;
                const index = itemIndex;
                return (
                  <Link
                    key={item.key}
                    href={item.href as NavHref}
                    ref={(el) => { itemRefs.current[index] = el; }}
                    onClick={() => setOpen(false)}
                    onKeyDown={(e) => onItemKeyDown(e, index)}
                    className={
                      "border-b border-dark-gray px-4 py-3 text-sm text-mid-gray no-underline transition-colors hover:bg-jet hover:text-foreground focus-visible:bg-jet focus-visible:text-foreground " +
                      (i % 2 === 0 ? "border-r" : "")
                    }
                  >
                    {t(item.key as Parameters<typeof t>[0])}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        <Link
          href={RESOURCES_ALL.href as NavHref}
          ref={(el) => { itemRefs.current[RESOURCE_HREFS.length - 1] = el; }}
          onClick={() => setOpen(false)}
          onKeyDown={(e) => onItemKeyDown(e, RESOURCE_HREFS.length - 1)}
          className="block px-4 py-3 font-mono text-[10px] uppercase tracking-[0.1em] text-accent-secondary no-underline transition-colors hover:bg-jet hover:text-foreground focus-visible:bg-jet focus-visible:text-foreground"
        >
          {t(RESOURCES_ALL.key)}
        </Link>
      </div>
    </div>
  );
}

export default function Header() {
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = React.useState(false);
  const { profileId, clearProfile } = useDocumentationMode();

  return (
    // `id="top"` = cible du lien « ↑ Haut de page » du footer.
    <header id="top" className="sticky top-0 z-50 bg-obsidian px-2.5 lg:px-0">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between border border-x-dark-gray border-b border-b-dark-gray border-t-0 px-5 lg:px-6">
        {/* Logotype */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-foreground no-underline"
        >
          <span className="text-[10px] text-vermilion">◼</span>
          NEXT IMPACT
        </Link>

        {/* Desktop nav — Conseil · Solutions web · Études de cas · Ressources ▾ · À propos */}
        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          {NAV_BEFORE.map((item) => (
            <Link
              key={item.key}
              href={item.href as NavHref}
              className="px-3 py-2 text-sm text-mid-gray no-underline transition-colors hover:text-foreground"
            >
              {t(item.key as Parameters<typeof t>[0])}
            </Link>
          ))}

          <ResourcesMenu t={t} />

          {NAV_AFTER.map((item) => (
            <Link
              key={item.key}
              href={item.href as NavHref}
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
              + « Diagnostic 2 min » (froid, vermillon, dominant). */}
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
              {NAV_BEFORE.map((item) => (
                <Link
                  key={item.key}
                  href={item.href as NavHref}
                  onClick={() => setMobileOpen(false)}
                  className="block border-b border-dark-gray px-5 py-4 font-mono text-[11px] uppercase tracking-[0.1em] text-mid-gray no-underline transition-colors hover:text-foreground"
                >
                  {t(item.key as Parameters<typeof t>[0])}
                </Link>
              ))}

              {/* « Ressources » — section dépliable, mêmes groupes que le desktop */}
              <button
                type="button"
                aria-expanded={mobileResourcesOpen}
                aria-controls="mobile-resources"
                onClick={() => setMobileResourcesOpen((v) => !v)}
                className="flex w-full items-center justify-between border-b border-dark-gray px-5 py-4 text-left font-mono text-[11px] uppercase tracking-[0.1em] text-mid-gray transition-colors hover:text-foreground"
              >
                {t("resources")}
                <ChevronDown
                  className={
                    "h-4 w-4 transition-transform " + (mobileResourcesOpen ? "rotate-180" : "")
                  }
                  aria-hidden
                />
              </button>
              {mobileResourcesOpen && (
                <div id="mobile-resources" className="bg-jet">
                  {RESOURCE_GROUPS.map((group) => (
                    <div key={group.labelKey}>
                      <p className="border-b border-dark-gray px-5 pb-2 pt-4 font-mono text-[9px] uppercase tracking-[0.14em] text-mid-gray">
                        {t(group.labelKey as Parameters<typeof t>[0])}
                      </p>
                      {group.items.map((item) => (
                        <Link
                          key={item.key}
                          href={item.href as NavHref}
                          onClick={() => setMobileOpen(false)}
                          className="block border-b border-dark-gray px-5 py-3.5 text-sm text-mid-gray no-underline transition-colors hover:text-foreground"
                        >
                          {t(item.key as Parameters<typeof t>[0])}
                        </Link>
                      ))}
                    </div>
                  ))}
                  <Link
                    href={RESOURCES_ALL.href as NavHref}
                    onClick={() => setMobileOpen(false)}
                    className="block border-b border-dark-gray px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.1em] text-accent-secondary no-underline transition-colors hover:text-foreground"
                  >
                    {t(RESOURCES_ALL.key)}
                  </Link>
                </div>
              )}

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
