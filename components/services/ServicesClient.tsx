"use client";

import { Link } from "@/i18n/navigation";
import { FileText, Globe, Leaf, ScanLine, Monitor, SlidersHorizontal, ArrowRight, type LucideIcon } from "lucide-react";
import { PricingCards } from "@/components/services/PricingCards";
import AppsSection from "@/components/services/AppsSection";
import { ServicesComparisonTable } from "@/components/services/ServicesComparisonTable";
import Process from "@/components/process";
import ServicesFAQ from "@/components/services/ServicesFAQ";
import { HeadlessExplainer } from "@/components/headless-explainer";
import HomeDiagnostic from "@/components/home-diagnostic";
import { useLocale, useTranslations } from "next-intl";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { getServicesPageVariants } from "@/lib/homepage-profiles";
import type { Locale } from "@/i18n/routing";
import { BlueprintSection, SectionHeading, Separator } from "@/components/aspect/section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { WordAppear } from "@/components/visuals/word-appear";
import { SignalPaths } from "@/components/visuals/signal-paths";

export default function ServicesClient() {
  const { profileId } = useDocumentationMode();
  const locale = useLocale() as Locale;
  const servicesVariants = getServicesPageVariants(locale);
  const variant = profileId ? servicesVariants[profileId] : servicesVariants.default;
  const t = useTranslations("servicesPage");
  const isEn = locale === "en";

  return (
    <main>
      {/* Héros */}
      <BlueprintSection
        tone="obsidian"
        backdrop={
          <div className="absolute inset-x-0 bottom-0 h-1/2 opacity-30">
            <SignalPaths />
          </div>
        }
        innerClassName="px-6 py-16 lg:px-8 lg:py-24"
      >
        <Reveal className="flex flex-col gap-4">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
            <span>№ 01</span>
            <span className="h-px w-6 bg-accent-secondary/50" />
            <span className="text-mid-gray">Services</span>
          </div>
          <h1 className="max-w-4xl text-4xl font-extralight leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            <WordAppear text={variant.titre} />
          </h1>
        </Reveal>
      </BlueprintSection>

      <Separator />

      {/* § 02 — Comparatif des stacks (encore en style « Suisse ») */}
      <BlueprintSection tone="obsidian" innerClassName="px-6 py-12 lg:px-8 lg:py-16">
        <HeadlessExplainer />
      </BlueprintSection>

      <Separator />

      {/* § 03 — Tarifs */}
      <PricingCards />

      <Separator />

      {/* § 04 — Tableau comparatif */}
      <ServicesComparisonTable />

      <Separator />

      {/* § 05 — Comment choisir */}
      <BlueprintSection tone="obsidian">
        <Reveal className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
          <SectionHeading
            index="№ 05"
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

      {/* § 06 — Diagnostic projet */}
      <HomeDiagnostic />

      <Separator />

      {/* § 07 — Stack sur-mesure (web app) */}
      <AppsSection />

      <Separator />

      {/* § 08 — Méthode */}
      <BlueprintSection tone="obsidian" innerClassName="border-t border-dark-gray px-6 py-16 lg:px-8 lg:py-20">
        <Process />
      </BlueprintSection>

      <Separator />

      {/* § 09 — FAQ */}
      <ServicesFAQ faqs={variant.faqs} />

      <Separator />

      {/* § 10 — Raccourcis */}
      <BlueprintSection tone="obsidian">
        <Reveal className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
          <SectionHeading
            index="№ 10"
            kicker={isEn ? "Go further" : "Aller plus loin"}
            title={isEn ? "Useful shortcuts" : "Raccourcis utiles"}
          />
        </Reveal>

        <Stagger className="grid md:grid-cols-3">
          {([
            { href: "/outils", Icon: ScanLine, title: t("shortcuts.tools.title"), desc: t("shortcuts.tools.description") },
            { href: "/demo", Icon: Monitor, title: t("shortcuts.demo.title"), desc: t("shortcuts.demo.description") },
            { href: "/services/eligibilite", Icon: SlidersHorizontal, title: t("shortcuts.stack.title"), desc: t("shortcuts.stack.description") },
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
