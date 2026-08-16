"use client";

import { Link } from "@/i18n/navigation";
import { FileText, Globe, Leaf, ScanLine, Monitor, SlidersHorizontal, ArrowRight, Palette, Sparkles, Accessibility, type LucideIcon } from "lucide-react";
import { PricingCards } from "@/components/services/PricingCards";
import AppsSection from "@/components/services/AppsSection";
import { ServicesComparisonTable } from "@/components/services/ServicesComparisonTable";
import Process from "@/components/process";
import ServicesFAQ from "@/components/services/ServicesFAQ";
import { HeadlessExplainer } from "@/components/headless-explainer";
import HomePerf from "@/components/home-perf";
import MiniDiag from "@/components/services/MiniDiag";
import { useLocale, useTranslations } from "next-intl";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { getServicesPageVariants } from "@/lib/homepage-profiles";
import type { Locale } from "@/i18n/routing";
import { BlueprintSection, SectionHeading, Separator } from "@/components/aspect/section";
import {
  PageHero,
  HERO_BTN_PRIMARY,
  HERO_BTN_SECONDARY,
} from "@/components/aspect/page-hero";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import ConseilModal from "@/components/ui/conseil-modal";
import { useSeen } from "@/components/ui/use-seen";
import { BlueprintGrid } from "@/components/visuals/blueprint-grid";

export default function ServicesClient() {
  const [pricingRef, pricingSeen] = useSeen<HTMLDivElement>();
  const { profileId } = useDocumentationMode();
  const locale = useLocale() as Locale;
  const servicesVariants = getServicesPageVariants(locale);
  const variant = profileId ? servicesVariants[profileId] : servicesVariants.default;
  const t = useTranslations("servicesPage");
  const isEn = locale === "en";

  return (
    <main>
      {/* § 01 — Héros (harmonisé /veille) */}
      <PageHero
        index="№ 01"
        kicker={isEn ? "Web solutions" : "Solutions web"}
        title={variant.titre}
        description={variant.sousTitre}
        backdrop={
          /* Quadrillage blueprint : le plan de construction — la métaphore des
             solutions web bâties sur mesure. */
          <BlueprintGrid />
        }
        actions={
          <>
            <Link href="/solutions-web/eligibilite" className={HERO_BTN_PRIMARY}>
              {isEn ? "Run the diagnostic — 2 min" : "Lancer le diagnostic — 2 min"}
              <ArrowRight size={14} />
            </Link>
            <a href="#tarifs" className={HERO_BTN_SECONDARY}>
              {isEn ? "See pricing" : "Voir les tarifs"}
            </a>
          </>
        }
      />

      <Separator />

      {/* § 02 — Avantage : UI/UX moderne */}
      <BlueprintSection tone="obsidian">
        <Reveal className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
          <SectionHeading
            index="№ 02"
            kicker={isEn ? "Advantage · UI/UX" : "Avantage · UI/UX"}
            title={
              isEn ? (
                <>A modern interface, <span className="text-accent-secondary">a pleasure to use</span></>
              ) : (
                <>Une interface digne <span className="text-accent-secondary">de 2026</span></>
              )
            }
            description={
              isEn
                ? "A bespoke design — never an off-the-shelf template — with smooth, clear and accessible navigation. A refined experience for your visitors and your teams alike."
                : "Un design sur-mesure — jamais un template générique — et une navigation fluide, claire et accessible. Une expérience soignée pour vos visiteurs comme pour vos équipes."
            }
          />
        </Reveal>

        <Stagger className="grid md:grid-cols-3">
          {([
            {
              Icon: Palette,
              title: isEn ? "Bespoke design" : "Design sur-mesure",
              desc: isEn
                ? "A unique identity, not a bought theme. Every screen built for your brand and your journeys."
                : "Une identité unique, pas un thème acheté. Chaque écran pensé pour votre marque et vos parcours.",
            },
            {
              Icon: Sparkles,
              title: isEn ? "Smooth experience" : "Navigation fluide",
              desc: isEn
                ? "Crafted transitions, no perceived wait, clear paths — the feel of a modern app."
                : "Transitions soignées, zéro temps mort ressenti, parcours clairs — l'expérience d'une app moderne.",
            },
            {
              Icon: Accessibility,
              title: isEn ? "Accessible & responsive" : "Accessible & responsive",
              desc: isEn
                ? "Readable and usable everywhere (WCAG, mobile, keyboard). An experience that excludes no one."
                : "Lisible et utilisable partout (WCAG, mobile, clavier). Une expérience qui n'exclut personne.",
            },
          ] as { Icon: LucideIcon; title: string; desc: string }[]).map((card, i, arr) => (
            <StaggerItem
              key={card.title}
              className={`group flex flex-col gap-4 p-6 transition-colors hover:bg-jet lg:p-8 ${
                i < arr.length - 1 ? "border-b border-dark-gray md:border-b-0 md:border-r" : ""
              }`}
            >
              <card.Icon
                size={24}
                strokeWidth={1.5}
                className="text-mid-gray transition-colors group-hover:text-accent-secondary"
              />
              <h3 className="text-lg font-light tracking-tight text-foreground">{card.title}</h3>
              <p className="font-inter-tight text-sm leading-relaxed text-mid-gray">{card.desc}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </BlueprintSection>

      <Separator />

      {/* § 03 — Diagnostic express (orienteur) */}
      <MiniDiag index="№ 03" />

      <Separator />

      {/* § 04 — Tarifs */}
      <PricingCards />

      <Separator />

      {/* § 05 — Tableau comparatif */}
      <ServicesComparisonTable />

      {/* Le visiteur a vu les prix et le comparatif : c'est le moment où se joue
          l'arbitrage entre trois paliers séparés par plusieurs milliers d'euros.
          La visio à 150 €, seul palier crédité, est l'assurance contre le
          mauvais choix — d'où l'armement de la popup ici et pas plus haut. */}
      <div ref={pricingRef} aria-hidden="true" className="h-px w-full" />
      <ConseilModal source="solutions-web" armed={pricingSeen} />

      <Separator />

      {/* § 06 — Comprendre le Headless (explicatif) */}
      <BlueprintSection tone="obsidian" innerClassName="px-6 py-12 lg:px-8 lg:py-16">
        <HeadlessExplainer />
      </BlueprintSection>

      <Separator />

      {/* § 07 — Comment je choisis votre stack */}
      <BlueprintSection tone="obsidian">
        <Reveal className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
          <SectionHeading
            index="№ 07"
            kicker={t("stackMethod.label")}
            title={t("stackMethod.title")}
          />
        </Reveal>

        <Stagger className="grid md:grid-cols-3">
          {([
            { Icon: FileText, title: t("stackMethod.scope.title"), desc: t("stackMethod.scope.description") },
            { Icon: Globe, title: t("stackMethod.volume.title"), desc: t("stackMethod.volume.description") },
            { Icon: Leaf, title: t("stackMethod.scalability.title"), desc: t("stackMethod.scalability.description") },
          ] as { Icon: LucideIcon; title: string; desc: string }[]).map((card, i, arr) => (
            <StaggerItem
              key={card.title}
              className={`group flex flex-col gap-4 p-6 transition-colors hover:bg-jet lg:p-8 ${
                i < arr.length - 1 ? "border-b border-dark-gray md:border-b-0 md:border-r" : ""
              }`}
            >
              <card.Icon
                size={24}
                strokeWidth={1.5}
                className="text-mid-gray transition-colors group-hover:text-accent-secondary"
              />
              <h3 className="text-lg font-light tracking-tight text-foreground">
                {card.title}
              </h3>
              <p className="font-inter-tight text-sm leading-relaxed text-mid-gray">
                {card.desc}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </BlueprintSection>

      <Separator />

      {/* § 08 — Preuve de performance (socle technique) */}
      <HomePerf index="№ 08" />

      <Separator />

      {/* § 09 — Méthode */}
      <BlueprintSection tone="obsidian" innerClassName="border-t border-dark-gray px-6 py-16 lg:px-8 lg:py-20">
        <Process index="№ 09" />
      </BlueprintSection>

      <Separator />

      {/* § 10 — FAQ */}
      <ServicesFAQ faqs={variant.faqs} />

      {/* § 11 — Raccourcis */}
      <BlueprintSection tone="obsidian">
        <Reveal className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
          <SectionHeading
            index="№ 11"
            kicker={isEn ? "Go further" : "Aller plus loin"}
            title={isEn ? "Useful shortcuts" : "Raccourcis utiles"}
          />
        </Reveal>

        <Stagger className="grid md:grid-cols-3">
          {([
            { href: "/outils", Icon: ScanLine, title: t("shortcuts.tools.title"), desc: t("shortcuts.tools.description") },
            { href: "/demo", Icon: Monitor, title: t("shortcuts.demo.title"), desc: t("shortcuts.demo.description") },
            { href: "/solutions-web/eligibilite", Icon: SlidersHorizontal, title: t("shortcuts.stack.title"), desc: t("shortcuts.stack.description") },
          ] as { href: string; Icon: LucideIcon; title: string; desc: string }[]).map((card, i, arr) => (
            <StaggerItem key={card.href}>
              <Link
                href={card.href as Parameters<typeof Link>[0]["href"]}
                className={`group flex h-full flex-col gap-3 p-6 transition-colors hover:bg-jet lg:p-8 ${
                  i < arr.length - 1 ? "border-b border-dark-gray md:border-b-0 md:border-r" : ""
                }`}
              >
                <card.Icon
                  size={24}
                  strokeWidth={1.5}
                  className="text-mid-gray transition-colors group-hover:text-accent-secondary"
                />
                <h3 className="text-lg font-light tracking-tight text-foreground">
                  {card.title}
                </h3>
                <p className="flex-1 font-inter-tight text-sm leading-relaxed text-mid-gray">
                  {card.desc}
                </p>
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-accent-secondary transition-colors group-hover:text-foreground">
                  {card.title}
                  <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </BlueprintSection>
    </main>
  );
}
