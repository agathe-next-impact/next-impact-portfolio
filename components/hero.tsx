"use client";

import { useEffect, useRef, useState } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { getHeroVariants } from "@/lib/homepage-profiles";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { BlueprintSection } from "@/components/aspect/section";
import { Reveal } from "@/components/ui/reveal";
import { AuroraGlow } from "@/components/visuals/aurora-glow";
import { WordAppear } from "@/components/visuals/word-appear";
import { CodeToSite } from "@/components/visuals/code-to-site";
import { DUR, EASE_OUT } from "@/lib/motion-tokens";

// Transition partagée du panneau au changement d'onglet (crossfade sobre).
const PANEL_TRANSITION = { duration: DUR.ui, ease: EASE_OUT } as const;

const BTN_PRIMARY =
  "inline-flex h-11 items-center gap-2 border border-accent-secondary bg-accent-secondary px-5 font-mono text-[12px] font-regular uppercase tracking-[0.08em] text-obsidian transition-colors hover:bg-accent-secondary/85";

type TabId = "conseil" | "prestations" | "veille";

export default function Hero() {
  const locale = useLocale() as Locale;
  const t = useTranslations("hero");
  const variant = getHeroVariants(locale).default;
  const isEn = locale === "en";

  const [tab, setTab] = useState<TabId>("conseil");

  // Indicateur d'onglet glissant : mesuré (domAnimation ne gère pas `layout`).
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({
    conseil: null,
    prestations: null,
    veille: null,
  });
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const measure = () => {
      const el = tabRefs.current[tab];
      if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
    // locale change → largeur des libellés différente
  }, [tab, locale]);

  // Contenu piloté par les onglets (les 2 CTA sont devenus des tabs).
  const TABS = [
    {
      id: "conseil" as TabId,
      label: isEn ? "Advice" : "Conseil",
      description: isEn
        ? "Before you invest — in AI, an agency or a rebuild — check what your site actually needs. Independent advice, from €150."
        : "Avant d'investir, explorez les solutions pour votre projet web à l'heure de l'IA. Avis indépendant, dès 150 €.",
      chips: isEn
        ? ["Independent advice", "From €150", "No commitment", "Reply within 48h"]
        : ["Avis indépendant", "Dès 150 €", "Sans engagement", "Réponse sous 48 h"],
      cta: { label: isEn ? "Book a consult" : "Réserver un conseil", href: "/conseil" },
    },
    {
      id: "prestations" as TabId,
      label: isEn ? "Services" : "Prestations",
      description: isEn
        ? "Once the direction is set, I design, build and ship — WordPress, a custom Next.js front-end or a web app. Price and timeline fixed upfront."
        : "Une fois la voie tranchée, je peux concevoir, développer et livrer des projets web : site vitrine, site e-commerce, application web. Prix et délai fixés d'avance.",
      chips: isEn
        ? ["+25 projects shipped", "PageSpeed 45 → 98", "Fixed price & timeline", "Turnkey delivery"]
        : ["+25 projets livrés", "PageSpeed 45 → 98", "Prix & délai fixés", "Livré clé en main"],
      cta: { label: isEn ? "See services" : "Voir les prestations", href: "/solutions-web" },
    },
    {
      id: "veille" as TabId,
      label: isEn ? "Watch" : "Veille",
      description: isEn
        ? "The web & AI market moves every week, and your site ages quietly. A free newsletter takes care of it: it tracks the market and helps you decide — maintain, rebuild or create."
        : "Le marché web & IA bouge chaque semaine, et votre site vieillit en silence. Une lettre gratuite s'en charge : elle suit l'actualité et vous aide à décider — maintenir, refondre ou créer.",
      chips: isEn
        ? ["Free newsletter", "One digest / month", "One focus / week", "No commitment"]
        : ["Lettre gratuite", "Une synthèse / mois", "Un focus / semaine", "Sans engagement"],
      cta: { label: isEn ? "Discover the watch" : "Découvrir la veille", href: "/veille" },
    },
  ];

  const active = TABS.find((tb) => tb.id === tab) ?? TABS[0];

  return (
    <BlueprintSection
      tone="obsidian"
      ticks
      backdrop={
        <>
          <AuroraGlow intensity="subtle" />
          {/** <div className="absolute inset-0 opacity-50">
            <Fiber hubX={0.8} hubY={0.5} />
          </div>
          */}
        </>
      }
      innerClassName="px-6 py-16 lg:px-10 lg:py-24 border-b border-dark-gray"
    >
      {/* En-tête */}
      <Reveal className="flex flex-col gap-4">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
          <span>№ 01</span>
          <span className="h-px w-6 bg-accent-secondary/50" />
          <span className="text-mid-gray">
            {isEn
              ? "Before you invest — AI, agency or rebuild"
              : "Avant d'investir — IA, agence ou refonte"}
          </span>
        </div>
        <h1 className="w-3/4 text-4xl font-extralight leading-[1.05] tracking-tight text-accent-secondary sm:text-5xl lg:text-6xl">
          <WordAppear text={variant.headline} />{" " }
          <span className="text-foreground">{variant.subHeadline}</span>
        </h1>
      </Reveal>

      {/* Onglets — les 2 CTA pilotent le contenu de la section 2 colonnes */}
      <div
        role="tablist"
        aria-label={isEn ? "Choose a path" : "Choisir un parcours"}
        className="relative mt-10 flex border-b border-dark-gray"
      >
        {TABS.map((tb, i) => {
          const selected = tb.id === tab;
          const num = String(i + 1).padStart(2, "0");
          return (
            <button
              key={tb.id}
              id={`hero-tab-${tb.id}`}
              ref={(el) => {
                tabRefs.current[tb.id] = el;
              }}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`hero-panel-${tb.id}`}
              onClick={() => setTab(tb.id)}
              className={`flex items-baseline gap-2 px-6 py-4 font-mono text-[16px] font-regular uppercase tracking-[0.06em] transition-colors duration-200 ${
                selected ? "text-accent-secondary" : "text-mid-gray hover:text-foreground"
              }`}
            >
              <span
                className={`text-[12px] font-normal transition-colors duration-200 ${
                  selected ? "text-accent-secondary" : "text-mid-gray/70"
                }`}
              >
                {num} ·
              </span>
              {tb.label}
            </button>
          );
        })}
        {/* Indicateur glissant — trait épais */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-px h-[3px] bg-accent-secondary transition-[left,width] duration-300 ease-out motion-reduce:transition-none"
          style={{ left: indicator.left, width: indicator.width }}
        />
      </div>

      {/* 2 colonnes — contenu piloté par l'onglet actif */}
      <div
        id={`hero-panel-${active.id}`}
        role="tabpanel"
        aria-labelledby={`hero-tab-${active.id}`}
        className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start"
      >
        {/* Texte — crossfade au changement d'onglet */}
        <Reveal delay={0.08} className="flex flex-col">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={PANEL_TRANSITION}
            >
              <p className="max-w-xl font-inter-tight text-base leading-relaxed text-foreground">
                {active.description}
              </p>
              {/* Réassurance — marqueurs de preuve (pas d'énumération techno en accroche) */}
              <div className="mt-5 flex flex-wrap gap-2">
                {active.chips.map((chip) => (
                  <span
                    key={chip}
                    className="inline-flex items-center gap-1.5 border border-dark-gray px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-mid-gray"
                  >
                    <span className="h-1 w-1 rounded-full bg-accent-secondary" />
                    {chip}
                  </span>
                ))}
              </div>

              {/* CTA du parcours actif */}
              <div className="mt-9">
                <Link
                  href={active.cta.href as Parameters<typeof Link>[0]["href"]}
                  className={BTN_PRIMARY}
                >
                  {active.cta.label}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Logos techno — preuve discrète */}
          <div className="mt-12 flex flex-col gap-4 border-t border-dark-gray pt-6">
            {/* Ligne de logos */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              {[
                { src: "/img/logos_technos/logo_claude.png", alt: "Claude" },
                { src: "/img/logos_technos/logo_openai.png", alt: "OpenAI" },
                { src: "/img/logos_technos/logo_lovable.png", alt: "Lovable" },
                { src: "/img/logos_technos/logo_bolt.webp", alt: "Bolt" },
                { src: "/img/logos_technos/logo_v0.webp", alt: "v0" },
              ].map((logo) => (
                <Image
                  key={logo.src}
                  src={logo.src}
                  alt={logo.alt}
                  width={96}
                  height={24}
                  className="h-6 w-auto opacity-60 transition-opacity hover:opacity-90"
                />
              ))}
            </div>
            {/* Ligne de texte — sous les logos */}
            <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-mid-gray">
              {isEn
                ? "AI can generate code. It cannot decide your architecture for you."
                : "L'IA peut générer du code. Elle ne décide pas votre architecture à votre place."}
            </span>
          </div>
        </Reveal>

        {/* Visuel — change selon l'onglet actif */}
        <Reveal delay={0.16} className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-dark-gray bg-obsidian">
            <AnimatePresence initial={false}>
              {tab === "prestations" ? (
                /* Prestations — animation « du code au site » (livrable en ligne) */
                <motion.div
                  key="presta"
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={PANEL_TRANSITION}
                >
                  <CodeToSite url="next-event.fr" />
                </motion.div>
              ) : (
                /* Conseil — preuve humaine : qui livre réellement le projet */
                <motion.div
                  key="conseil"
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={PANEL_TRANSITION}
                >
                  <Image
                    src="/img/agathe.png"
                    alt={
                      isEn
                        ? "Agathe Karinthi-Martin, founder of Next Impact Digital, at her workstation"
                        : "Agathe Karinthi-Martin, fondatrice de Next Impact Digital, à son poste de travail"
                    }
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="(min-width: 1024px) 420px, 100vw"
                  />
                  {/* Dégradé bas pour intégrer la légende (photo toujours sombre) */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                  {/* Légende identité — preuve humaine */}
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-3 py-2.5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-white">
                      Agathe Karinthi-Martin
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/70">
                      Next · Impact · Digital
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Badge disponible */}
          <div className="absolute -top-3 right-0 flex items-center gap-1.5 border border-dark-gray bg-jet px-3 py-1">
            <span className="status-dot" />
            <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-foreground">
              {t("available")}
            </span>
          </div>

          {/* Tag d'angle — signale « projet réel » en un coup d'œil (Prestations) */}
          <AnimatePresence initial={false}>
            {tab === "prestations" && (
              <motion.div
                key="presta-tag"
                className="absolute -top-3 left-0 flex items-center gap-1.5 border border-dark-gray bg-jet px-3 py-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={PANEL_TRANSITION}
              >
                <span className="h-1 w-1 rounded-full bg-vermilion" />
                <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-foreground">
                  {isEn ? "Real project" : "Réalisation"}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Légende — ancre la maquette dans le réel : site en ligne + preuve */}
          <AnimatePresence initial={false}>
            {tab === "prestations" && (
              <motion.div
                key="presta-caption"
                className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={PANEL_TRANSITION}
              >
                <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.08em] text-mid-gray">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]" />
                  {isEn
                    ? "Live · next-event.fr — event portal delivered"
                    : "En ligne · next-event.fr — portail événementiel livré"}
                </span>
                <Link
                  href={"/etudes-de-cas/next-event" as Parameters<typeof Link>[0]["href"]}
                  className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.08em] text-foreground underline-offset-4 transition-colors hover:text-vermilion hover:underline"
                >
                  {isEn ? "Case study →" : "Étude de cas →"}
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </BlueprintSection>
  );
}
