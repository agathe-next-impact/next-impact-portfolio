"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { SectionHeading } from "@/components/aspect/section";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import { SUIVI_INCLUS_LABEL, SUIVI_INCLUS_MOIS } from "@/lib/maintenance-offer";
import {
  BESOINS,
  citer,
  estGratuit,
  packPrixEntree,
  situationsDuBesoin,
  type BesoinKey,
  type Situation,
} from "@/lib/situations";
import { trajectoireDuNom, type Lang } from "@/lib/trajectoires";
import { PackLink } from "@/components/packs/pack-link";

// ─────────────────────────────────────────────────────────────────────────────
// Home § 02 : l'offre par famille, en onglets (charte v1.7).
//
// Un onglet par famille, dans l'ordre Diagnostiquer, Évoluer, Gérer ; Évoluer
// est ouvert par défaut, c'est la décision que la home veut faire prendre.
// Chaque onglet montre le besoin, puis ses parcours en cartouches pleine largeur,
// réduits à l'essentiel : le nom seul, sans le mot « pack » (ADR-016, ADR-022), ce que c'est
// techniquement (ADR-015) ou l'offre au centre, la situation en ligne « pour
// qui », le budget et un lien. Le détail vit sur la page du pack.
//
// Les trois panneaux sont rendus dans le HTML (`hidden` sur les inactifs) :
// tous les packs restent lisibles par les moteurs et sans JavaScript. Onglets
// au clavier : flèches, Origine, Fin (motif ARIA « tabs »).
//
// Sous les onglets, les deux boutons. La veille, qui distingue chaque pack,
// est la section suivante (home-veille.tsx, § 03).
//
// Aucun prix recopié : chaque cartouche affiche le prix d'entrée publié de son
// offre (packPrixEntree), le même que le menu et /solutions-web ; le budget du
// parcours reste sur la page du pack. Tout vient de lib/situations.ts, qui lit chaque montant
// dans sa source et calcule le budget de chaque pack.
// ─────────────────────────────────────────────────────────────────────────────


const ONGLET_PAR_DEFAUT: BesoinKey = "refaire";

/**
 * Un parcours en cartouche pleine largeur : nom, technique, pour qui, budget.
 * Deux gabarits, pour que la liste ne soit pas un bloc uniforme : la cartouche
 * mise en avant (gratuite ou recommandée) est grande, bordée d'accent, avec sa
 * pastille ; les autres sont plus compactes et plus discrètes.
 */
function PackCartouche({ situation, lang }: { situation: Situation; lang: Lang }) {
  const isEn = lang === "en";
  const prestation = trajectoireDuNom(situation.offre.fr);
  // Sous le nom : la technique pour une prestation, sinon l'offre au centre.
  // Rien quand l'offre porte déjà le nom (« Audit + roadmap »).
  const sousTitre = prestation
    ? prestation.technique[lang]
    : situation.sousTitre
      ? situation.sousTitre[lang]
      : situation.offre[lang] !== situation.nom[lang]
      ? situation.offre[lang]
      : null;
  const gratuit = estGratuit(situation);
  const enAvant = situation.recommended || gratuit;
  return (
    <PackLink situation={situation}
      className={cn(
        "group grid items-center gap-3 rounded-md border no-underline transition-colors md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_auto] md:gap-8",
        enAvant
          ? "border-accent-secondary bg-jet px-5 py-6 shadow-[0_0_0_4px_hsl(var(--accent-2)/0.12)] lg:px-7 lg:py-8"
          : "border-charcoal bg-transparent px-5 py-4 hover:border-mid-gray hover:bg-jet lg:px-7",
      )}
    >
      <span className="flex flex-col gap-1">
        {enAvant && (
          <span className="mb-1 self-start rounded-full bg-accent-secondary px-2 py-0.5 font-mono text-2xs uppercase tracking-[0.12em] text-obsidian">
            {gratuit
              ? isEn ? "Free, no commitment" : "Gratuit, sans engagement"
              : isEn ? "Recommended" : "Recommandé"}
          </span>
        )}
        <span
          className={cn(
            "font-normal leading-tight tracking-tight",
            enAvant ? "text-3xl text-accent-secondary lg:text-4xl" : "text-xl text-foreground lg:text-2xl",
          )}
        >
          {situation.nom[lang]}
        </span>
        {sousTitre && (
          <span
            className={cn(
              "font-inter-tight leading-snug",
              enAvant ? "text-base text-foreground/85" : "text-sm text-mid-gray",
            )}
          >
            {sousTitre}
          </span>
        )}
      </span>
      <span
        className={cn(
          "font-inter-tight leading-relaxed",
          enAvant ? "text-base text-foreground/80" : "text-sm text-mid-gray",
        )}
      >
        {citer(situation.phrase, lang)}
      </span>
      <span className="flex flex-row flex-wrap items-baseline justify-between gap-x-4 gap-y-1 md:flex-col md:items-end md:text-right">
        <span className={cn("tracking-tight text-foreground", enAvant ? "text-xl" : "text-base")}>
          {packPrixEntree(situation, lang)}
        </span>
        <span className="inline-flex items-center gap-1 font-mono text-2xs uppercase tracking-[0.08em] text-accent-secondary transition-colors group-hover:text-foreground">
          {isEn ? "See the offer" : "Voir l'offre"}
          <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </span>
    </PackLink>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-charcoal px-3 py-1.5 font-inter-tight text-sm text-foreground/85">
      {children}
    </span>
  );
}

/** Une ligne sous les cartouches, propre à chaque famille. */
function PiedOnglet({ besoin, lang }: { besoin: BesoinKey; lang: Lang }) {
  const isEn = lang === "en";
  if (besoin === "decider") return null;
  if (besoin === "refaire") {
    return (
      <div className="flex flex-wrap gap-2">
        {SUIVI_INCLUS_MOIS > 0 && <Pill>{SUIVI_INCLUS_LABEL[lang]}</Pill>}
        <Pill>{isEn ? "Price and timeline in writing before we start" : "Prix et délai écrits avant de commencer"}</Pill>
        <Pill>{isEn ? "No site yet? Same offers" : "Pas encore de site ? Mêmes offres"}</Pill>
      </div>
    );
  }
  return (
    <div className="flex flex-wrap gap-2">
      <Link href="/espace-client" className="no-underline">
        <Pill>{isEn ? "Tracked in your online workspace →" : "Suivi dans votre espace en ligne →"}</Pill>
      </Link>
    </div>
  );
}

export default function HomeOffres() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const l: Lang = isEn ? "en" : "fr";

  const [tab, setTab] = useState<BesoinKey>(ONGLET_PAR_DEFAUT);

  // Indicateur d'onglet glissant : mesuré (domAnimation ne gère pas `layout`).
  const tabRefs = useRef<Partial<Record<BesoinKey, HTMLButtonElement | null>>>({});
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

  const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = BESOINS.length - 1;
    const next =
      e.key === "ArrowRight" ? (i === last ? 0 : i + 1)
      : e.key === "ArrowLeft" ? (i === 0 ? last : i - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    const key = BESOINS[next].key;
    setTab(key);
    tabRefs.current[key]?.focus();
  };

  return (
    <section className="relative overflow-hidden bg-obsidian px-2.5 lg:px-0">
      <div className="relative mx-auto w-full max-w-[1200px] border-x border-dark-gray">
        {/* En-tête */}
        <Reveal className="border-b border-dark-gray px-6 pt-12 lg:px-8 lg:pt-16">
          <SectionHeading
            index="№ 02"
            kicker={isEn ? "Your need · your offer" : "Votre besoin · votre offre"}
            title={
              isEn ? (
                <>One need = <span className="text-accent-secondary">one offer</span></>
              ) : (
                <>Un besoin = <span className="text-accent-secondary">une offre</span></>
              )
            }
          />

          {/* Onglets : une famille par onglet */}
          <div
            role="tablist"
            aria-label={isEn ? "Choose a family of offers" : "Choisir une famille d'offres"}
            className="relative mt-8 flex overflow-x-auto lg:mt-10"
          >
            {BESOINS.map((b, i) => {
              const selected = b.key === tab;
              return (
                <button
                  key={b.key}
                  id={`offres-tab-${b.key}`}
                  ref={(el) => {
                    tabRefs.current[b.key] = el;
                  }}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`offres-panel-${b.key}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setTab(b.key)}
                  onKeyDown={(e) => onTabKeyDown(e, i)}
                  className={cn(
                    "flex shrink-0 items-baseline gap-2 px-4 py-4 font-mono text-sm font-regular uppercase tracking-[0.06em] transition-colors duration-200 sm:px-6 sm:text-base",
                    selected ? "text-accent-secondary" : "text-mid-gray hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "text-xs font-normal transition-colors duration-200",
                      selected ? "text-accent-secondary" : "text-mid-gray/70",
                    )}
                  >
                    {b.index} ·
                  </span>
                  {b.moment[l]}
                </button>
              );
            })}
            {/* Indicateur glissant : trait épais */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 h-[3px] bg-accent-secondary transition-[left,width] duration-300 ease-out motion-reduce:transition-none"
              style={{ left: indicator.left, width: indicator.width }}
            />
          </div>
        </Reveal>

        {/* Panneaux : tous rendus, un seul visible */}
        {BESOINS.map((b) => (
          <div
            key={b.key}
            id={`offres-panel-${b.key}`}
            role="tabpanel"
            aria-labelledby={`offres-tab-${b.key}`}
            hidden={b.key !== tab}
            className={cn(
              // `flex` l'emporterait sur l'attribut `hidden` : classe conditionnelle.
              b.key === tab ? "flex" : "hidden",
              "flex-col gap-4 p-6 duration-300 animate-in fade-in-0 slide-in-from-bottom-1 motion-reduce:animate-none lg:p-8",
            )}
          >
            <h3 className="text-xl font-light leading-snug tracking-tight text-foreground lg:text-2xl">
              {citer(b.phrase, l)}
            </h3>
            {situationsDuBesoin(b.key).map((s) => (
              <PackCartouche key={s.slug} situation={s} lang={l} />
            ))}
            <PiedOnglet besoin={b.key} lang={l} />
          </div>
        ))}

        {/* Bandeau vidé à la demande d'Agathe (2026-09-27) : conservé comme
            respiration sous les onglets, à mi-hauteur de l'ancien bandeau
            « Vous hésitez ? ». Les deux CTA de la home sont ceux du héros. */}
        <div aria-hidden="true" className="border-t border-dark-gray py-10" />
      </div>
    </section>
  );
}
