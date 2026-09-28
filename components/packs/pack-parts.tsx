import * as React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { BlueprintSection, SectionHeading } from "@/components/aspect/section";
import { HERO_BTN_PRIMARY, HERO_BTN_SECONDARY } from "@/components/aspect/page-hero";
import { cn } from "@/lib/utils";
import type { Lang } from "@/lib/trajectoires";
import {
  VEILLE,
  VEILLE_TITRE,
  citer,
  estGratuit,
  packBudgetLabel,
  packPrixEntree,
  packNom,
  type Situation,
  type VeilleMode,
} from "@/lib/situations";
import { PackLink } from "@/components/packs/pack-link";
import { CTA_CHAUD } from "@/lib/visio-conseil";

// ─────────────────────────────────────────────────────────────────────────────
// Briques partagées par les pages de pack, leur index et /tarifs (charte v1.6,
// ADR-014). Composants sans hook : importables côté serveur comme côté client.
// Tout ce qui s'affiche vient de lib/situations.ts.
// ─────────────────────────────────────────────────────────────────────────────


/** Pastille posée sur une étape : la forme de veille qu'elle porte. */
export function VeilleTag({ mode, lang, className }: { mode: VeilleMode; lang: Lang; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full border border-accent-secondary/60 bg-accent-secondary/10 px-2.5 py-1 font-mono text-2xs uppercase tracking-[0.12em] text-accent-secondary",
        className,
      )}
    >
      {VEILLE[mode].label[lang]}
    </span>
  );
}

/**
 * La veille technique et stratégique, ce qui distingue chaque offre : une
 * première analyse avant de décider et de construire, puis une veille en
 * continu. `modes` restreint le bloc aux formes que le pack contient.
 */
export function VeilleBloc({
  lang,
  index,
  modes = ["premiere-analyse", "continu"],
  tone,
}: {
  lang: Lang;
  index?: string;
  modes?: VeilleMode[];
  tone?: "jet";
}) {
  const isEn = lang === "en";
  return (
    <BlueprintSection tone={tone} id="veille">
      <div className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          index={index}
          kicker={isEn ? "What sets each offer apart" : "Ce qui distingue chaque offre"}
          title={
            isEn ? (
              <>
                {VEILLE_TITRE.en}, <span className="text-accent-secondary">at every step</span>.
              </>
            ) : (
              <>
                {VEILLE_TITRE.fr}, <span className="text-accent-secondary">à chaque étape</span>.
              </>
            )
          }
          description={
            isEn
              ? "Technical: what threatens what you already run. Strategic: what the context makes possible and your site does not do yet."
              : "Technique : ce qui menace ce que vous faites déjà tourner. Stratégique : ce que le contexte rend possible et que votre site ne fait pas encore."
          }
        />
      </div>
      <div className={cn("grid", modes.length > 1 && "md:grid-cols-2")}>
        {modes.map((mode, i) => (
          <div
            key={mode}
            className={cn(
              "flex flex-col gap-3 border-b border-dark-gray p-6 md:border-b-0 lg:p-8",
              i === 0 && modes.length > 1 && "md:border-r",
            )}
          >
            <VeilleTag mode={mode} lang={lang} />
            <p className="text-lg font-light tracking-tight text-foreground">{VEILLE[mode].ou[lang]}</p>
            <p className="font-inter-tight text-base leading-relaxed text-mid-gray">{VEILLE[mode].detail[lang]}</p>
          </div>
        ))}
      </div>
      <div className="border-t border-dark-gray px-6 py-5 lg:px-8">
        <Link
          href="/veille#gratuite"
          className="font-mono text-2xs uppercase tracking-[0.08em] text-accent-secondary no-underline hover:text-foreground"
        >
          {isEn ? "Read the free watch letter →" : "Lire la lettre de veille gratuite →"}
        </Link>
      </div>
    </BlueprintSection>
  );
}

/** Un parcours en ligne : son nom, pour qui, ce qu'on obtient, son budget. */
/**
 * Une ligne de pack. Par défaut elle affiche le prix d'entrée publié de
 * l'offre (packPrixEntree), comme le menu et la home ; /tarifs passe
 * `prix="budget"` pour montrer le budget du parcours, détaillé plus bas.
 */
export function SituationRow({
  situation,
  lang,
  prix = "entree",
}: {
  situation: Situation;
  lang: Lang;
  prix?: "entree" | "budget";
}) {
  const isEn = lang === "en";
  // L'offre au centre, seulement quand elle ne porte pas déjà le nom du pack ;
  // sinon le sous-titre du parcours, quand il en a un (Expert technique
  // externalisé : « Direction technique sans embaucher », 2026-09-28).
  const offre =
    situation.offre[lang] !== situation.nom[lang]
      ? situation.offre[lang]
      : (situation.sousTitre?.[lang] ?? null);
  return (
    <PackLink situation={situation}
      className="group grid gap-2 border-b border-dark-gray px-6 py-5 no-underline transition-colors hover:bg-jet md:grid-cols-[minmax(0,1.5fr)_minmax(0,1.3fr)_minmax(0,1fr)] md:gap-8 lg:px-8"
    >
      <span className="flex flex-col gap-2">
        <span className="text-xl font-normal leading-snug tracking-tight text-foreground group-hover:text-accent-secondary">
          {packNom(situation, lang)}
        </span>
        <span className="font-inter-tight text-base leading-relaxed text-mid-gray">
          {citer(situation.phrase, lang)}
        </span>
        {(offre || situation.recommended || estGratuit(situation)) && (
          <span className="flex flex-wrap items-center gap-2 font-mono text-2xs uppercase tracking-[0.14em] text-mid-gray">
            {offre}
            {estGratuit(situation) ? (
              <span className="rounded-full bg-accent-secondary px-2 py-0.5 tracking-[0.12em] text-obsidian">
                {isEn ? "Free, no commitment" : "Gratuit, sans engagement"}
              </span>
            ) : situation.recommended && (
              <span className="rounded-full bg-accent-secondary px-2 py-0.5 tracking-[0.12em] text-obsidian">
                {isEn ? "Recommended" : "Recommandé"}
              </span>
            )}
          </span>
        )}
      </span>
      <span className="font-inter-tight text-base leading-relaxed text-mid-gray">{situation.resultat[lang]}</span>
      <span className="flex flex-col gap-1 text-base text-foreground md:items-end md:text-right">
        <span>{prix === "budget" ? packBudgetLabel(situation, lang) : packPrixEntree(situation, lang)}</span>
        <span className="inline-flex items-center gap-1 font-mono text-2xs uppercase tracking-[0.08em] text-accent-secondary">
          {isEn ? "See the offer" : "Voir l'offre"}
          <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </span>
    </PackLink>
  );
}

/** Fin de page : deux boutons, deux températures, libellés fixes (charte §7). */
export function CtaPaire({
  lang,
  index,
  contactHref = "/contact",
  tone = "jet",
}: {
  lang: Lang;
  index?: string;
  contactHref?: string;
  tone?: "jet";
}) {
  const isEn = lang === "en";
  return (
    <BlueprintSection tone={tone} innerClassName="px-6 py-14 lg:px-8 lg:py-20">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          index={index}
          kicker={isEn ? "Where to start" : "Par où commencer"}
          title={
            isEn ? (
              <>
                First, see <span className="text-accent-secondary">what your site is made of</span>.
              </>
            ) : (
              <>
                Voyez d&apos;abord <span className="text-accent-secondary">de quoi votre site est fait</span>.
              </>
            )
          }
          description={
            isEn
              ? "The analysis is free and needs no access: it lists the components of your site and those at risk."
              : "L'analyse est gratuite et ne demande aucun accès : elle liste les composants de votre site et ceux qui sont à risque."
          }
        />
        <div className="flex flex-wrap gap-3 lg:shrink-0">
          {/* /scan vit hors de app/[locale]/ : balise <a>, pas le Link i18n. */}
          <a href="/scan" className={HERO_BTN_PRIMARY}>
            {isEn ? "Analyze your site" : "Analysez votre site"}
            <ArrowRight size={14} />
          </a>
          <a href={CTA_CHAUD.href} target="_blank" rel="noopener noreferrer" className={HERO_BTN_SECONDARY}>
            {CTA_CHAUD.label[isEn ? "en" : "fr"]}
          </a>
        </div>
      </div>
    </BlueprintSection>
  );
}
