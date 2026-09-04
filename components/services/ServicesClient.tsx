"use client";

import { Link } from "@/i18n/navigation";
import { FileText, Globe, Leaf, ArrowRight, Palette, Sparkles, Accessibility, type LucideIcon } from "lucide-react";
import { PricingCards } from "@/components/services/PricingCards";
import { OfferSections } from "@/components/services/OfferSections";
import AppsSection from "@/components/services/AppsSection";
import Process from "@/components/process";
import ServicesFAQ from "@/components/services/ServicesFAQ";
import HomePerf from "@/components/home-perf";
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
import { HeroOfferStrip, type HeroOffer } from "@/components/aspect/hero-offer-strip";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { BlueprintGrid } from "@/components/visuals/blueprint-grid";

// Titre du hero en bichromie : la portion saillante passe à l'accent (bleu),
// selon la convention de PageHero (`<em>` accent-secondary). Le titre vient de
// homepage-profiles (chaîne simple), on colore le segment ciblé par locale.
function heroTitle(titre: string, marker: string): React.ReactNode {
  const idx = titre.toLowerCase().indexOf(marker.toLowerCase());
  if (idx === -1) return titre;
  return (
    <>
      {titre.slice(0, idx)}
      <em className="font-normal not-italic text-accent-secondary">
        {titre.slice(idx, idx + marker.length)}
      </em>
      {titre.slice(idx + marker.length)}
    </>
  );
}

export default function ServicesClient() {
  const { profileId } = useDocumentationMode();
  const locale = useLocale() as Locale;
  const servicesVariants = getServicesPageVariants(locale);
  const variant = profileId ? servicesVariants[profileId] : servicesVariants.default;
  const t = useTranslations("servicesPage");
  const isEn = locale === "en";

  // Aperçu des trois trajectoires dans le héros — ancres vers les cartes tarifs.
  const heroOffers: HeroOffer[] = isEn
    ? [
        {
          name: "Simple showcase site",
          price: "from €2,250",
          benefit: "Consolidate: bespoke theme, controlled cost.",
          href: "#forfait-classique",
        },
        {
          name: "Complex site",
          price: "from €4,000",
          benefit: "Decouple: back office kept, fast modern front end.",
          href: "#forfait-headless",
          recommended: true,
        },
        {
          name: "Platform & app",
          price: "from €6,500",
          benefit: "Rebuild: platform, multisite, business tool.",
          href: "#forfait-webapp",
        },
      ]
    : [
        {
          name: "Vitrine simple",
          price: "dès 2 250 €",
          benefit: "Consolider : thème sur-mesure, coût maîtrisé.",
          href: "#forfait-classique",
        },
        {
          name: "Site complexe",
          price: "dès 4 000 €",
          benefit: "Découpler : back-office conservé, front rapide et moderne.",
          href: "#forfait-headless",
          recommended: true,
        },
        {
          name: "Plateforme et app",
          price: "dès 6 500 €",
          benefit: "Refonder : plateforme, multisite, outil métier.",
          href: "#forfait-webapp",
        },
      ];

  return (
    <main>
      {/* § 01 — Héros (harmonisé /veille) */}
      <PageHero
        index="№ 01"
        kicker={isEn ? "Redesign · Three trajectories" : "Refonte · Trois trajectoires"}
        title={heroTitle(variant.titre, isEn ? "for an aging WordPress site" : "pour une refonte")}
        description={variant.sousTitre}
        backdrop={
          /* Quadrillage blueprint : le plan de construction — la métaphore des
             solutions web bâties sur mesure. */
          <BlueprintGrid />
        }
        actions={
          <>
            <Link href="/solutions-web/eligibilite" className={HERO_BTN_PRIMARY}>
              {isEn ? "Run the diagnostic: 2 min" : "Lancer le diagnostic : 2 min"}
              <ArrowRight size={14} />
            </Link>
            <a href="#tarifs" className={HERO_BTN_SECONDARY}>
              {isEn ? "See pricing" : "Voir les tarifs"}
            </a>
          </>
        }
      >
        <HeroOfferStrip
          label={isEn ? "Three trajectories" : "Trois trajectoires"}
          offers={heroOffers}
        />
      </PageHero>

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
                ? "A bespoke design, never an off-the-shelf template, with smooth, clear and accessible navigation. A refined experience for your visitors and your teams alike."
                : "Un design sur-mesure, jamais un template générique, et une navigation fluide, claire et accessible. Une expérience soignée pour vos visiteurs comme pour vos équipes."
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

      {/* § 03 — Aperçu des trois trajectoires (prix · pour quand · inclus) */}
      <PricingCards />

      <Separator />

      {/* § 04–06 — Une section par offre (ancres du mega menu) */}
      <OfferSections />

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
    </main>
  );
}
