"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { getHomeContent } from "@/lib/home-content";
import { BesoinTitle } from "@/components/aspect/besoin-title";
import { CTA_ECHANGE } from "@/lib/visio-conseil";

import type { Locale } from "@/i18n/routing";
import { BlueprintSection } from "@/components/aspect/section";
import { Reveal } from "@/components/ui/reveal";
import { AuroraGlow } from "@/components/visuals/aurora-glow";
import { Marquee } from "@/components/visuals/marquee";

// ─────────────────────────────────────────────────────────────────────────────
// Héros de la home, refait le 2026-11-21 (ADR-047) : la home ne reflète plus
// que l'offre du Studio digital.
//
// Une seule décision : se reconnaître dans l'un des deux points de départ. Le
// h1 est le nom de l'offre, « Studio Digital », le surtitre « Next Impact » ;
// la place du sous-titre reste vide (demande d'Agathe), l'accroche pose la
// règle, les deux prix suivent. Deux boutons : le renvoi vers les deux cartes,
// juste sous la bande de preuve, puis l'échange gratuit (chaud). La preuve chiffrée vient dessous (ProofStrip) ; ici, la présence
// humaine (photo) et les logos clients.
//
// Titre, accroche et prix : `hero` de lib/home-content.ts, qui lit
// noms et prix dans lib/prestations-web.ts.
// ─────────────────────────────────────────────────────────────────────────────

const BTN_PRIMARY =
  "inline-flex min-h-11 items-center gap-2 border border-accent-secondary bg-accent-secondary px-5 py-2.5 font-mono text-sm font-semibold uppercase tracking-[0.08em] text-obsidian no-underline transition-colors hover:bg-accent-secondary/85";
const BTN_SECONDARY =
  "inline-flex min-h-11 items-center gap-2 border border-dark-gray px-5 py-2.5 font-mono text-sm font-semibold uppercase tracking-[0.08em] text-foreground no-underline transition-colors hover:bg-jet";

const LOGOS = [
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
];

export default function Hero() {
  const locale = useLocale() as Locale;
  const t = useTranslations("hero");
  const { hero } = getHomeContent(locale);
  const isEn = locale === "en";

  return (
    <BlueprintSection
      tone="obsidian"
      ticks
      backdrop={<AuroraGlow intensity="subtle" />}
      innerClassName="px-6 py-16 lg:px-10 lg:py-24"
    >
      <div className="grid gap-12 lg:grid-cols-[1.45fr_1fr] lg:items-center">
        {/* Les deux points de départ, la règle, les deux prix, deux boutons */}
        <Reveal className="flex flex-col gap-6">
          <div className="flex items-center gap-2 font-mono text-2xs uppercase tracking-[0.14em] text-accent-secondary">
            <span>№ 01</span>
            <span className="h-px w-6 bg-accent-secondary/50" />
            <span className="text-mid-gray">{hero.kicker}</span>
          </div>
          {/* Le h1 est le nom de l'offre, « Studio Digital ». */}
          <h1 className="text-5xl font-extralight leading-[1.02] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            <BesoinTitle phrase={hero.titre} accent={hero.titreAccent} />
          </h1>
          {/* Sous-titre retiré à la demande d'Agathe (2026-11-21) ; sa place
              reste vide : deux lignes de la même hauteur, sans texte. */}
          <div aria-hidden className="h-[3.45rem] md:h-[4.15rem]" />
          <p className="max-w-2xl font-inter-tight text-base leading-relaxed text-mid-gray md:text-lg">
            {hero.accroche}
          </p>
          {/* Les deux prix, écrits dès le héros. */}
          <ul className="flex flex-col gap-1.5 font-mono text-xs uppercase tracking-[0.08em] text-foreground sm:flex-row sm:flex-wrap sm:gap-x-6">
            {hero.prix.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span aria-hidden className="h-1 w-1 rounded-full bg-accent-secondary" />
                {item}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-3">
            {/* Ordre inversé à la demande d'Agathe (2026-11-21). Premier bouton,
                plein : les deux cartes, juste sous la bande de preuve. */}
            <a href="#prestations" className={BTN_PRIMARY}>
              Voir les deux prestations
              <ArrowRight size={14} />
            </a>
            {/* Second bouton, en filet : l'échange gratuit de 15 minutes, sur
                Calendly (ADR-023), lien externe, nouvel onglet. */}
            <a href={CTA_ECHANGE.href} target="_blank" rel="noopener noreferrer" className={BTN_SECONDARY}>
              {CTA_ECHANGE.label.fr}
            </a>
          </div>
        </Reveal>

        {/* Qui le fait : la présence humaine */}
        <Reveal delay={0.12} className="relative mx-auto w-full max-w-[420px]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-dark-gray bg-obsidian">
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
            {/* Légende de la photo (nom et phrase) retirée à la demande d'Agathe
                (2026-11-21), avec son dégradé. Le texte alternatif garde le nom. */}
          </div>
          <div className="absolute -top-3 right-0 flex items-center gap-1.5 border border-dark-gray bg-jet px-3 py-1">
            <span className="status-dot" />
            <span className="font-mono text-2xs uppercase tracking-[0.1em] text-foreground">
              {t("available")}
            </span>
          </div>
        </Reveal>
      </div>

      {/* Logos clients : preuve sociale discrète */}
      {/* `gap-10` : marge agrandie entre le surtitre et les logos (demande
          d'Agathe du 2026-11-21, 16 → 40 px). */}
      <div className="mt-14 flex flex-col gap-10 border-t border-dark-gray pt-6">
        <span className="font-mono text-2xs uppercase tracking-[0.12em] text-mid-gray">
          {isEn ? "Trusted by" : "Ils m'ont fait confiance"}
        </span>
        {/* Uniquement des assets détourés (fond transparent vérifié). */}
        <Marquee gap={80} duration={90}>
          {LOGOS.map((logo) => (
            <Image
              key={logo.src}
              src={logo.src}
              alt={logo.alt}
              width={160}
              height={40}
              // Monochromes au repos (demande d'Agathe du 2026-11-21) : noirs
              // sur fond clair (`brightness-0`), blancs sur fond sombre
              // (`dark:invert`). La couleur d'origine revient au survol, en
              // ease-in.
              className="h-10 w-auto max-w-none shrink-0 opacity-90 brightness-0 transition-[filter,opacity] duration-300 ease-in hover:opacity-100 hover:brightness-100 dark:invert dark:hover:invert-0"
            />
          ))}
        </Marquee>
      </div>
    </BlueprintSection>
  );
}
