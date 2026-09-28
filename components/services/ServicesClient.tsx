"use client";

import { FileText, Globe, Leaf, ArrowRight, Palette, Sparkles, Accessibility, type LucideIcon } from "lucide-react";
import { OfferSections } from "@/components/services/OfferSections";
import AppsSection from "@/components/services/AppsSection";
import Process from "@/components/process";
import ServicesFAQ from "@/components/services/ServicesFAQ";
import HomePerf from "@/components/home-perf";
import { EnBref } from "@/components/en-bref";
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
import { HeroNavCards, heroCardsEnfants } from "@/components/aspect/hero-nav-cards";
import { MEGA_SECTIONS } from "@/lib/mega-menu";
import { CTA_ECHANGE } from "@/lib/visio-conseil";
import { BesoinTitle } from "@/components/aspect/besoin-title";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { BlueprintGrid } from "@/components/visuals/blueprint-grid";
import { SUIVI_INCLUS_MOIS } from "@/lib/maintenance-offer";
import {
  TRAJECTOIRES,
  trajectoirePrice,
  variantePriceHT,
  type TrajectoireSlug,
  type VarianteSlug,
} from "@/lib/trajectoires";

export default function ServicesClient() {
  const { profileId } = useDocumentationMode();
  const locale = useLocale() as Locale;
  const servicesVariants = getServicesPageVariants(locale);
  const variant = profileId ? servicesVariants[profileId] : servicesVariants.default;
  const t = useTranslations("servicesPage");
  const isEn = locale === "en";

  const l = isEn ? "en" : "fr";

  // Nom et prix de chaque prestation : lus dans lib/trajectoires.ts (charte
  // v1.6, ADR-014), jamais recopiés.
  const nom = (slug: TrajectoireSlug) => TRAJECTOIRES[slug].name[l];
  const aPartirDe = (slug: TrajectoireSlug) =>
    `${trajectoirePrice(slug, l).replace(/^./, (c) => c.toLowerCase())} ${isEn ? "excl. VAT" : "HT"}`;
  // Les deux variantes de la Refonte (ADR-031), à égalité.
  const aPartirDeVariante = (v: VarianteSlug) => {
    const variante = TRAJECTOIRES["forfait-headless"].variantes?.find((x) => x.slug === v);
    return variante ? variantePriceHT(variante, l).replace(/^./, (c) => c.toLowerCase()) : "";
  };

  // Colonne droite du héros (page mère) : ses pages enfants, et elles seules,
  // les parcours du panneau « Évoluer » du menu.
  const heroCards = heroCardsEnfants(MEGA_SECTIONS.refaire, l);

  return (
    <main>
      {/* § 01 — Héros (harmonisé /veille) */}
      <PageHero
        index="№ 01"
        kicker={isEn ? "Evolve · Three services" : "Évoluer · Trois prestations"}
        // h1 fixé par Agathe le 2026-09-27 (ADR-022, puis reformulé le même
        // jour), identique pour tous les profils. Il ne reprend plus le titre
        // du panneau du mega menu.
        title={
          <BesoinTitle
            phrase={isEn ? "Delivering web projects" : "Réalisation de projets web"}
            accent={isEn ? "web projects" : "projets web"}
          />
        }
        description={variant.sousTitre}
        backdrop={
          /* Quadrillage blueprint : le plan de construction — la métaphore des
             solutions web bâties sur mesure. */
          <BlueprintGrid />
        }
        actions={
          <>
            {/* Premier bouton de chaque héros : l'échange gratuit (Calendly, nouvel
                onglet). Puis le bouton froid, l'analyse (/scan), libellé fixe :
                /scan vit hors de app/[locale]/, balise <a>, pas le Link i18n. */}
            <a href={CTA_ECHANGE.href} target="_blank" rel="noopener noreferrer" className={HERO_BTN_PRIMARY}>
              {isEn ? CTA_ECHANGE.label.en : CTA_ECHANGE.label.fr}
              <ArrowRight size={14} />
            </a>
            <a href="/scan" className={HERO_BTN_SECONDARY}>
              {isEn ? "Analyze your site" : "Analysez votre site"}
            </a>
            <a href="#tarifs" className={HERO_BTN_SECONDARY}>
              {isEn ? "See pricing" : "Voir les tarifs"}
            </a>
          </>
        }
        aside={
          <HeroNavCards
            label={isEn ? "The services" : "Les prestations"}
            cards={heroCards}
            recommendedLabel={isEn ? "Recommended" : "Recommandée"}
            fill
          />
        }
      />

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
              <p className="font-inter-tight text-base leading-relaxed text-mid-gray">{card.desc}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </BlueprintSection>

      <Separator />

      {/* § 03–05 — Une section par offre (ancres du mega menu). La section
          « Construire sur le besoin » (PricingCards) est supprimée (demande
          d'Agathe, 2026-09-27) : l'ancre #tarifs du bouton « Voir les tarifs »
          mène désormais ici, où chaque offre porte son prix. */}
      <div id="tarifs" className="scroll-mt-24">
        <OfferSections />
      </div>

      <Separator />

      {/* § 06 — Comment je choisis votre stack */}
      <BlueprintSection tone="obsidian">
        <Reveal className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
          <SectionHeading
            index="№ 06"
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
              <p className="font-inter-tight text-base leading-relaxed text-mid-gray">
                {card.desc}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </BlueprintSection>

      <Separator />

      {/* § 07 — Preuve de performance (socle technique) */}
      <HomePerf index="№ 07" />

      <Separator />

      {/* § 08 — Méthode */}
      <BlueprintSection tone="obsidian" innerClassName="border-t border-dark-gray px-6 py-16 lg:px-8 lg:py-20">
        <Process index="№ 08" />
      </BlueprintSection>

      <Separator />

      {/* « L'essentiel » : résumé autoportant des trois prestations, citable
          tel quel par un moteur de réponse (GEO), juste avant la FAQ (ADR-024).
          Intention distincte du TL;DR de la home, qui présente l'offre
          d'ensemble : ici, le détail par prestation. Chaque chiffre est celui
          affiché plus haut (OfferSections). La classe `.services-tldr` est la
          cible du SpeakableSpecification. */}
      <EnBref
        className="services-tldr"
        label={isEn ? "Key points" : "L'essentiel"}
        lines={
          (isEn
            ? [
                `Three services for an aging WordPress site: ${nom("forfait-classique")}, ${nom("forfait-headless")} or ${nom("forfait-webapp")}. The real question is not WordPress or not WordPress, it is what you keep and what you change.`,
                `${nom("forfait-classique")}: optimized WordPress, ${aPartirDe("forfait-classique")}. Your current site and its theme are kept and brought up to standard: speed, plugins, security, hosting. No rebuild.`,
                `${nom("forfait-headless")}, the recommended service: the site is rebuilt and your editors still publish in WordPress, ${aPartirDe("forfait-headless")}. Two variants on an equal footing: custom WordPress (${aPartirDeVariante("sur-mesure")}) when the care budget must stay light, headless WordPress (${aPartirDeVariante("headless")}) when speed, design or traffic are decisive.`,
                `${nom("forfait-webapp")}: web app, platform or mobile application, ${aPartirDe("forfait-webapp")}, when the site has become a working tool.`,
                "Every service starts with a first technical and strategic watch analysis: what is moving around your site, and what the context makes possible.",
                "Price and timeline in writing before we start, performance measured before and after, a single point of contact from quote to launch.",
                `No site yet? ${nom("forfait-headless")} and ${nom("forfait-webapp")} start from a blank page instead of the existing one, same timelines. Every package includes ${SUIVI_INCLUS_MOIS} months of care after launch.`,
              ]
            : [
                `Trois prestations pour un site WordPress qui vieillit : ${nom("forfait-classique")}, ${nom("forfait-headless")} ou ${nom("forfait-webapp")}. La vraie question n'est pas WordPress ou pas WordPress, c'est ce que vous gardez et ce que vous changez.`,
                `${nom("forfait-classique")} : WordPress optimisé, ${aPartirDe("forfait-classique")}. Votre site actuel et son thème sont gardés et remis à niveau : vitesse, extensions, sécurité, hébergement. Sans reconstruction.`,
                `${nom("forfait-headless")}, la prestation recommandée : le site est reconstruit et vos rédacteurs publient toujours dans WordPress, ${aPartirDe("forfait-headless")}. Deux variantes à égalité : WordPress sur mesure (${aPartirDeVariante("sur-mesure")}) quand le budget de suivi doit rester léger, WordPress headless (${aPartirDeVariante("headless")}) quand la vitesse, le design ou le trafic sont décisifs.`,
                `${nom("forfait-webapp")} : web app, plateforme ou application mobile, ${aPartirDe("forfait-webapp")}, quand le site est devenu un outil de travail.`,
                "Chaque prestation commence par une première analyse de veille technique et stratégique : ce qui bouge autour de votre site, et ce que le contexte rend possible.",
                "Prix et délai écrits avant de commencer, performance mesurée avant et après, une interlocutrice unique du devis à la mise en ligne.",
                `Pas encore de site ? La ${nom("forfait-headless")} et l'${nom("forfait-webapp")} partent d'une page blanche au lieu de l'existant, mêmes délais. Chaque forfait inclut ${SUIVI_INCLUS_MOIS} mois de suivi après la mise en ligne.`,
              ]
          )
        }
      />

      <Separator />

      {/* § 09 — FAQ */}
      <ServicesFAQ faqs={variant.faqs} />
    </main>
  );
}
