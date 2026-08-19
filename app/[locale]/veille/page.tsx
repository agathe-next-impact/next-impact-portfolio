import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { BlueprintSection, SectionHeading } from "@/components/aspect/section";
import {
  PageHero,
  HERO_BTN_PRIMARY as BTN_PRIMARY,
  HERO_BTN_SECONDARY as BTN_SECONDARY,
} from "@/components/aspect/page-hero";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { NEWSLETTER_LINKEDIN_URL } from "@/lib/newsletter";
import { Sonar } from "@/components/visuals/sonar";

// ─────────────────────────────────────────────────────────────────────────────
// Page « Veille techno » — hiérarchie : la newsletter d'abord, les ressources ensuite.
//
// Ordre de priorité (décidé le 2026-08-18) :
//   1. PRIMAIRE — la lettre gratuite « Quelle techno pour mon site web à l'heure
//      de l'IA ? » (LinkedIn : une synthèse mensuelle + un focus hebdo). C'est
//      l'accès mis en avant : héros et premier bloc, CTA principal « S'abonner ».
//   2. SECONDAIRE — les ressources : le hub /documentation et les outils /outils,
//      en fin de page.
//
// Sentinelle (produit payant) n'apparaît PAS ici : elle a sa page dédiée
// /sentinelle. La veille grand public de cette page, c'est la lettre gratuite.
//
// Contenu FR uniquement (locale EN en noindex), comme /sentinelle.
// ─────────────────────────────────────────────────────────────────────────────

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  return generatePageMetadata({
    title: isEn
      ? "Tech watch — a free newsletter to choose your website technology"
      : "Veille techno — la lettre gratuite pour choisir la techno de votre site",
    description: isEn
      ? "A free newsletter for decision-makers who must choose their website technology in the age of AI: a monthly digest and a weekly focus. Plus free resources — documentation and diagnostic tools — to go deeper."
      : "La lettre gratuite des décideurs qui doivent choisir la technologie de leur site à l'heure de l'IA : une synthèse par mois, un focus par semaine. Plus des ressources gratuites — documentation et outils de diagnostic — pour aller au fond.",
    path: "/veille",
    keywords: isEn
      ? [
          "web technology newsletter",
          "tech watch website",
          "AI web trends newsletter",
          "website technology newsletter",
        ]
      : [
          "newsletter techno web",
          "veille technologique site web",
          "newsletter web IA",
          "lettre techno gratuite",
          "quelle techno pour mon site web",
        ],
    locale,
    // Contenu FR uniquement pour l'instant — même règle que /sentinelle.
    noindex: isEn,
  });
}

const LETTRE_GRATUITE = [
  {
    index: "01",
    titre: "Une synthèse par mois",
    corps:
      "Ce qui a réellement compté le mois passé — modèles IA, CMS, outils, réglementation — trié selon une seule question : est-ce que cela change une décision pour votre site ? Ce qui n'en change aucune n'y figure pas.",
  },
  {
    index: "02",
    titre: "Un focus par semaine",
    corps:
      "Un sujet chaud de l'actualité, pris à part et décrypté : ce que c'est, qui est concerné, ce que je ferais à votre place. Cinq minutes de lecture, sans jargon.",
  },
];

// Accès secondaire : les ressources — le hub documentation et les outils
// (tous deux liés depuis le footer ; ici en fin de page veille).
const RESSOURCES = [
  {
    titre: "La documentation",
    corps:
      "Le fond, pas l'actualité : comment choisir, migrer, sécuriser et rendre visible un site web à l'heure de l'IA. Des guides sans jargon, écrits pour décider.",
    cta: { libelle: "Ouvrir la documentation", href: "/documentation" as const },
  },
  {
    titre: "Les outils",
    corps:
      "Des diagnostics gratuits pour situer votre site : visibilité dans les moteurs IA, réparer ou refaire, décrypteur de devis, sélecteur de techno, checklist GEO…",
    cta: { libelle: "Voir les outils", href: "/outils" as const },
  },
];

export default async function VeillePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";

  const breadcrumbItems = [
    { name: isEn ? "Home" : "Accueil", url: "/" },
    { name: isEn ? "Tech watch" : "Veille techno", url: "/veille" },
  ];

  return (
    <main>
      <BreadcrumbJsonLd items={breadcrumbItems} />

      {/* ── Héros : la lettre gratuite, mise en avant ────────────────────── */}
      <PageHero
        index="№ 00"
        kicker="Veille techno"
        backdrop={
          /* Sonar : la métaphore de la veille — balayage discret, côté droit. */
          <div className="absolute inset-y-0 right-0 w-2/3 opacity-25 lg:w-1/2">
            <Sonar className="h-full w-full" />
          </div>
        }
        title={
          <>
            La newsletter techno web & IA,{" "}
            <em className="font-normal not-italic text-accent-secondary">
              pour choisir sans devenir développeur
            </em>
          </>
        }
        description={
          <>
            La lettre des décideurs qui doivent trancher sur la technologie de
            leur site, à l'heure de l'IA : une synthèse par mois, un focus par
            semaine. Gratuite.
          </>
        }
        actions={
          <>
            <a
              href={NEWSLETTER_LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={BTN_PRIMARY}
            >
              S'abonner — gratuit
            </a>
            <Link href="/documentation" className={BTN_SECONDARY}>
              Parcourir les ressources
            </Link>
          </>
        }
        note="Gratuit · désinscription en un clic"
      >
        {/* Les deux rendez-vous de la lettre gratuite. */}
        <div className="mt-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-mid-gray">
            Deux rendez-vous, gratuits
          </p>
          <ul className="mt-3 flex max-w-3xl flex-wrap gap-1.5">
            {["Une synthèse par mois", "Un focus par semaine"].map((rdv) => (
              <li
                key={rdv}
                className="border border-dark-gray px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-mid-gray"
              >
                {rdv}
              </li>
            ))}
          </ul>
        </div>
      </PageHero>

      {/* ── PRIMAIRE — la lettre gratuite : deux rendez-vous ─────────────── */}
      <BlueprintSection
        id="gratuite"
        tone="jet"
        className="border-t border-dark-gray"
        innerClassName="px-6 py-14 lg:px-12 lg:py-20"
      >
        <SectionHeading
          index="№ 01"
          kicker="La lettre gratuite"
          title={"La newsletter techno web & IA"}
          description="La lettre des décideurs qui doivent choisir la bonne technologie web, sans devenir développeur. Deux rendez-vous, gratuits, sur LinkedIn."
        />

        <div className="mt-12 grid gap-px border border-dark-gray bg-dark-gray md:grid-cols-2">
          {LETTRE_GRATUITE.map((bloc) => (
            <div key={bloc.index} className="bg-jet p-8">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
                № {bloc.index}
              </span>
              <h3 className="mt-4 text-xl font-light tracking-tight text-foreground">
                {bloc.titre}
              </h3>
              <p className="mt-3 font-inter-tight text-base leading-relaxed text-mid-gray">
                {bloc.corps}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={NEWSLETTER_LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={BTN_PRIMARY}
          >
            S'abonner — gratuit
          </a>
        </div>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">
          Gratuit · désinscription en un clic
        </p>
      </BlueprintSection>

      {/* ── SECONDAIRE — les ressources : documentation & outils ─────────── */}
      <BlueprintSection
        id="ressources"
        className="border-t border-dark-gray"
        innerClassName="px-6 py-14 lg:px-12 lg:py-20"
      >
        <SectionHeading
          index="№ 02"
          kicker="Les ressources"
          title="Pour aller au fond, entre deux lettres"
          description="La veille suit l'actualité ; les ressources donnent le fond. Documentation et outils sont en accès libre, sans inscription."
        />

        <div className="mt-12 grid gap-px border border-dark-gray bg-dark-gray md:grid-cols-2">
          {RESSOURCES.map((bloc) => (
            <div key={bloc.titre} className="flex flex-col bg-jet p-8">
              <h3 className="text-xl font-light tracking-tight text-foreground">
                {bloc.titre}
              </h3>
              <p className="mt-3 flex-1 font-inter-tight text-base leading-relaxed text-mid-gray">
                {bloc.corps}
              </p>
              <div className="mt-8">
                <Link href={bloc.cta.href} className={BTN_SECONDARY}>
                  {bloc.cta.libelle}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </BlueprintSection>
    </main>
  );
}
