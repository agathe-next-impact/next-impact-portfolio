"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowUpRight, Globe, LayoutDashboard } from "lucide-react";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const SITE_URL = "https://www.next-event.fr/";

type TabId = "site" | "admin";

/**
 * HeroLivePreview — cadre navigateur autonome du héros, avec deux onglets
 * AU-DESSUS de la barre d'adresse : « Site » (le front moderne next-event.fr)
 * et « Admin WordPress » (le back-office réel, que le client garde). Démonstration
 * directe de « WordPress + front moderne ». Captures réelles, ratio fixe (zéro
 * CLS), onglets accessibles (clavier), sans contour gris.
 */
export default function HeroLivePreview() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const [tab, setTab] = useState<TabId>("site");
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const tabs: { id: TabId; label: string; icon: typeof Globe }[] = [
    { id: "site", label: "Site", icon: Globe },
    { id: "admin", label: isEn ? "WordPress admin" : "Admin WordPress", icon: LayoutDashboard },
  ];

  const url = tab === "admin" ? "next-event.fr/wp-admin" : "next-event.fr";

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const idx = tabs.findIndex((t) => t.id === tab);
    const nextIdx =
      e.key === "ArrowRight"
        ? (idx + 1) % tabs.length
        : (idx - 1 + tabs.length) % tabs.length;
    setTab(tabs[nextIdx].id);
    btnRefs.current[nextIdx]?.focus();
  };

  return (
    <div className="group flex w-full flex-col overflow-hidden rounded-sm bg-jet">
      {/* Onglets — au-dessus de l'adresse */}
      <div
        role="tablist"
        aria-label={isEn ? "Project preview" : "Aperçu du projet"}
        onKeyDown={onKeyDown}
        className="flex items-stretch border-b border-dark-gray bg-obsidian"
      >
        {tabs.map((t, i) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              ref={(el) => {
                btnRefs.current[i] = el;
              }}
              role="tab"
              type="button"
              id={`hero-tab-${t.id}`}
              aria-selected={active}
              aria-controls={`hero-panel-${t.id}`}
              tabIndex={active ? 0 : -1}
              onClick={() => setTab(t.id)}
              className={cn(
                "relative flex items-center gap-2 border-r border-dark-gray px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors",
                active
                  ? "bg-jet text-foreground"
                  : "text-mid-gray hover:bg-jet/40 hover:text-foreground",
              )}
            >
              {active && (
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-0.5 bg-accent-secondary"
                />
              )}
              <Icon size={13} className={active ? "text-accent-secondary" : undefined} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Barre d'adresse — sous les onglets */}
      <div className="flex items-center gap-2.5 border-y border-dark-gray bg-obsidian px-3.5 py-2.5">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-[7px] w-[7px] rounded-full border border-charcoal" />
          ))}
        </div>
        <div className="flex flex-1 items-center gap-1.5 bg-jet px-2.5 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-secondary" />
          <span className="font-mono text-[10px] tracking-[0.04em] text-mid-gray">{url}</span>
        </div>
      </div>

      {/* Panneaux — empilés, crossfade */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16 / 10" }}>
        {/* Site */}
        <div
          role="tabpanel"
          id="hero-panel-site"
          aria-labelledby="hero-tab-site"
          inert={tab !== "site"}
          className={cn(
            "absolute inset-0 transition-opacity duration-300",
            tab === "site" ? "opacity-100" : "opacity-0",
          )}
        >
          <Image
            src="/img/desktop-screen-next-event.jpg"
            alt={
              isEn
                ? "Next Event — Headless WordPress site built with Next.js"
                : "Next Event — site WordPress Headless réalisé avec Next.js"
            }
            fill
            sizes="(min-width: 1024px) 520px, 100vw"
            className="object-cover object-top transition-transform duration-1200 ease-out motion-safe:group-hover:scale-[1.03]"
          />
        </div>

        {/* Admin WordPress */}
        <div
          role="tabpanel"
          id="hero-panel-admin"
          aria-labelledby="hero-tab-admin"
          inert={tab !== "admin"}
          className={cn(
            "absolute inset-0 transition-opacity duration-300",
            tab === "admin" ? "opacity-100" : "opacity-0",
          )}
        >
          <Image
            src="/img/desktop-screen-wordpress.jpg"
            alt={
              isEn
                ? "The WordPress admin for the same site — the back-office you keep"
                : "L'admin WordPress du même site — le back-office que vous gardez"
            }
            fill
            sizes="(min-width: 1024px) 520px, 100vw"
            className="object-cover object-left-top"
          />
        </div>

        {/* Légende contextuelle */}
        {tab === "site" ? (
          <a
            href={SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 border border-dark-gray bg-obsidian/90 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-foreground backdrop-blur-sm transition-colors hover:bg-jet"
          >
            <span className="status-dot" />
            {isEn ? "Live demo" : "Démo live"}
            <ArrowUpRight
              size={11}
              className="text-accent-secondary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        ) : (
          <span className="absolute bottom-2 left-2 inline-flex items-center gap-1.5 border border-dark-gray bg-obsidian/90 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-mid-gray backdrop-blur-sm">
            <LayoutDashboard size={11} className="text-accent-secondary" />
            {isEn ? "The admin you already use" : "L'admin que vous gérez déjà"}
          </span>
        )}
      </div>
    </div>
  );
}
