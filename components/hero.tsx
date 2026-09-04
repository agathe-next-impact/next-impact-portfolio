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
  "inline-flex min-h-11 items-center gap-2 py-2.5 border border-accent-secondary bg-accent-secondary px-5 font-mono text-[12px] font-regular uppercase tracking-[0.08em] text-obsidian transition-colors hover:bg-accent-secondary/85";

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
      id: "veille" as TabId,
      label: isEn ? "Watch" : "Veille",
      description: isEn
        ? "The web market moves every week, and your site ages quietly. Two letters take care of it: a free one that tracks the market, and Sentinelle, the personalized watch that helps you decide: maintain, rebuild or create."
        : "Le marché web bouge chaque semaine, et votre site vieillit en silence. Deux lettres s'en chargent : la gratuite suit l'actualité, Sentinelle surveille votre site et vous aide à décider : maintenir, refondre ou créer.",
      chips: isEn
        ? ["Free newsletter", "Sentinelle €19/month", "Human-reviewed", "No commitment"]
        : ["Lettre gratuite", "Sentinelle 19 €/mois", "Relu par un humain", "Sans engagement"],
      cta: { label: isEn ? "Discover the watch" : "Découvrir la veille", href: "/veille" },
    },
    {
      id: "conseil" as TabId,
      label: isEn ? "Advice" : "Conseil",
      description: isEn
        ? "Before you commit a budget, a clear-cut opinion on your redesign: advisory call (€150, written opinion within 48h) or audit + roadmap (€650, deliverables). And a fractional CTO by your side if the need is recurring."
        : "Avant d'engager un budget, un avis tranché sur votre refonte : visio conseil (150 €, avis écrit sous 48 h) ou audit + roadmap (650 €, livrables). Et un CTO externalisé à vos côtés si le besoin est récurrent.",
      chips: isEn
        ? ["Independent advice", "Call €150", "Audit + roadmap €650", "Fractional CTO from €490/mo"]
        : ["Avis indépendant", "Visio 150 €", "Audit + roadmap 650 €", "CTO externalisé dès 490 €/mois"],
      cta: { label: isEn ? "See the advice" : "Voir le conseil", href: "/conseil" },
    },
    {
      id: "prestations" as TabId,
      label: isEn ? "Redesign" : "Refonte",
      description: isEn
        ? "Three trajectories for an aging site: consolidate, decouple or rebuild. Price and timeline fixed before we start, performance measured at delivery."
        : "Trois trajectoires pour un site qui vieillit : consolider, découpler ou refonder. Prix et délai fixés avant de commencer, performance mesurée à la livraison.",
      chips: isEn
        ? ["+25 projects shipped", "PageSpeed 45 → 98", "Fixed price & timeline", "A single point of contact"]
        : ["+25 projets livrés", "PageSpeed 45 → 98", "Prix & délai fixés", "Une interlocutrice unique"],
      cta: { label: isEn ? "See the trajectories" : "Voir les trajectoires", href: "/solutions-web" },
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
      {/* En-tête — héros charte : titre, description et CTA pilotés par
          HERO_VARIANTS.default (lib/homepage-profiles*.ts, FR + EN). */}
      <Reveal className="flex flex-col gap-4">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
          <span>№ 01</span>
          <span className="h-px w-6 bg-accent-secondary/50" />
          <span className="text-mid-gray">
            {isEn
              ? "WordPress site redesign · 6 to 10 weeks"
              : "Refonte de site WordPress · 6 à 10 semaines"}
          </span>
        </div>
        <h1 className="w-3/4 text-4xl font-extralight leading-[1.05] tracking-tight text-accent-secondary sm:text-5xl lg:text-6xl">
          <WordAppear text={variant.headline} />{" "}
          <span className="text-foreground">{variant.subHeadline}</span>
        </h1>
        <p className="max-w-2xl font-inter-tight text-base leading-relaxed text-mid-gray">
          {variant.description}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <Link
            href={variant.ctaPrimary.href as Parameters<typeof Link>[0]["href"]}
            className={BTN_PRIMARY}
          >
            {variant.ctaPrimary.label}
          </Link>
          <Link
            href={variant.ctaSecondary.href as Parameters<typeof Link>[0]["href"]}
            className="inline-flex min-h-11 items-center gap-2 py-2.5 border border-dark-gray px-5 font-mono text-[12px] font-regular uppercase tracking-[0.08em] text-foreground transition-colors hover:bg-jet"
          >
            {variant.ctaSecondary.label}
          </Link>
        </div>
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

          {/* Logos clients — preuve sociale discrète */}
          <div className="mt-12 flex flex-col gap-4 border-t border-dark-gray pt-6">
            <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-mid-gray">
              {isEn ? "Trusted by" : "Ils m'ont fait confiance"}
            </span>
            {/* Ligne de logos — uniquement des assets détourés (fond
                transparent vérifié). Écartés faute de variante sans fond :
                SUNEIDO, Senza Nature, Connexion Plus, Panorama Pub, CODE. */}
            <div className="flex flex-wrap items-center gap-x-[62px] gap-y-[42px]">
              {[
                { src: "/img/logo-sowee_1.webp", alt: "Sowee" },
                { src: "/img/logo-geofit.webp", alt: "Geofit" },
                { src: "/img/logo-aquitaine-robotics.webp", alt: "Aquitaine Robotics" },
                { src: "/img/logo-proditec.webp", alt: "Proditec" },
                { src: "/img/logo-transitions-pro.webp", alt: "Transitions Pro" },
                { src: "/img/logo-sdevo.webp", alt: "SDEVO" },
                { src: "/img/logo-infralliance.webp", alt: "Infralliance" },
                { src: "/img/logo-hermitage.webp", alt: "Tiers Lieu L'Hermitage" },
                { src: "/img/logo-wagner-hamisky_3.webp", alt: "Wagner Hamisky" },
                { src: "/img/logo-salondelacarrosserie.webp", alt: "Salon des professionnels de la carrosserie" },
                { src: "/img/logo-next-event.webp", alt: "Next Event" },
                { src: "/img/logo-mediatico.webp", alt: "Mediatico" },
                { src: "/img/logo-erp-services.webp", alt: "ERP Services" },
                { src: "/img/logo-itavera.webp", alt: "Itavera Asset Management" },
                { src: "/img/logo-egc.webp", alt: "Les États Généraux Communaux" },
                { src: "/img/logo-naturedea.webp", alt: "Naturedéa" },
              ].map((logo) => (
                <Image
                  key={logo.src}
                  src={logo.src}
                  alt={logo.alt}
                  width={108}
                  height={27}
                  className="h-[27px] w-auto opacity-90 transition-opacity hover:opacity-100"
                />
              ))}
            </div>
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
                    ? "Live · next-event.fr · event portal delivered"
                    : "En ligne · next-event.fr · portail événementiel livré"}
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
