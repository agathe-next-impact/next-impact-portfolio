import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd, ServiceJsonLd } from "@/components/json-ld";
import { BlueprintSection, SectionHeading, Separator } from "@/components/aspect/section";
import {
  PageHero,
  HERO_BTN_PRIMARY,
  HERO_BTN_SECONDARY,
} from "@/components/aspect/page-hero";
import { Sonar } from "@/components/visuals/sonar";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { CTA_ECHANGE } from "@/lib/visio-conseil";

// ─────────────────────────────────────────────────────────────────────────────
// Page « Signaux Faibles » (demande d'Agathe, 2026-10-27) : décrit le produit
// de veille automatisée, avec à côté l'offre « Veille sur mesure ».
//
// Faits repris de l'étude de cas `signaux-faibles` (lib/case-studies-data.ts).
// Aucun prix publié pour l'un comme pour l'autre : les deux formules se chiffrent
// après l'échange gratuit, donc aucun montant affiché ici.
// Contenu FR uniquement (locale EN en 404, version EN fermée).
// ─────────────────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    title: "Signaux Faibles : la veille automatisée par agents IA",
    description:
      "Une veille stratégique hebdomadaire, cadrée pour votre organisation, produite par des agents IA et relue par un humain. Ou une veille sur mesure, construite pour votre secteur.",
    path: "/signaux-faibles",
    keywords: [
      "veille automatisée",
      "veille stratégique IA",
      "agents de veille IA",
      "veille concurrentielle",
      "veille sur mesure",
    ],
    locale,
    noindex: locale === "en",
    alternateLocales: ["fr"],
  });
}

const PRODUIT = [
  {
    titre: "Cadrée sur votre organisation",
    corps:
      "Trois questions au départ : ce qui remplit votre carnet, qui décide, ce qui menacerait l'activité à douze mois.",
  },
  {
    titre: "Deux veilles, chaque axe scoré",
    corps:
      "L'écosystème et votre position concurrentielle, chaque axe noté à trois niveaux : fort, moyen, rien à signaler.",
  },
  {
    titre: "Un espace en ligne à vous",
    corps:
      "Vos éditions, les acteurs suivis et l'action de la semaine, sans mot de passe, lisibles hors ligne.",
  },
];

const ETAPES = [
  {
    titre: "Les agents lisent",
    corps: "Ils parcourent les sources utiles à votre organisation et repèrent ce qui a changé.",
  },
  {
    titre: "Ils scorent et rédigent",
    corps: "Chaque axe est noté, ce qu'ils n'ont pas pu vérifier est signalé, la note tient en 8 lignes.",
  },
  {
    titre: "Je relis avant l'envoi",
    corps: "Le cadrage, la première lettre et la synthèse envoyée restent validés par un humain.",
  },
];

const SUR_MESURE = [
  "Vos sources, vos acteurs et vos mots d'alerte, choisis avec vous",
  "Un rythme adapté : hebdomadaire, mensuel ou sur événement",
  "Le format qui sert vos décisions : note, tableau de bord ou alerte",
  "Relue par un humain avant chaque envoi",
];

export default async function SignauxFaiblesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (locale === "en") notFound();

  return (
    <main>
      <BreadcrumbJsonLd
        locale={locale}
        items={[
          { name: "Accueil", url: "/" },
          { name: "Signaux Faibles", url: "/signaux-faibles" },
        ]}
      />
      <ServiceJsonLd
        locale={locale}
        name="Signaux Faibles : la veille automatisée par agents IA"
        description="Une veille stratégique hebdomadaire cadrée pour une organisation, produite par des agents IA et relue par un humain, et une veille sur mesure construite pour un secteur."
        serviceType="Veille stratégique automatisée"
        url="/signaux-faibles"
      />

      {/* ── № 01 — Héros ──────────────────────────────────────────────── */}
      <PageHero
        index="№ 01"
        kicker="Veille automatisée"
        backdrop={
          <div className="absolute inset-y-0 right-0 w-2/3 opacity-25 lg:w-1/2">
            <Sonar className="h-full w-full" />
          </div>
        }
        title={
          <>
            Signaux Faibles, la veille{" "}
            <em className="font-normal not-italic text-accent-secondary">qui tient dans la durée</em>
          </>
        }
        description="Une fin de financement, un concurrent qui ouvre, une obligation qui tombe : ces signaux existent, mais dispersés. Des agents IA les lisent chaque semaine et vous disent ce que ça change pour vos décisions. Je relis avant chaque envoi."
        actions={
          <>
            <a href={CTA_ECHANGE.href} target="_blank" rel="noopener noreferrer" className={HERO_BTN_PRIMARY}>
              {CTA_ECHANGE.label.fr}
              <ArrowRight size={14} />
            </a>
            <a href="#offres" className={HERO_BTN_SECONDARY}>
              Voir les deux formules
            </a>
          </>
        }
        note="Une note par semaine · relue par un humain · espace en ligne sans mot de passe"
      />

      <Separator />

      {/* ── № 02 — Le produit ─────────────────────────────────────────── */}
      <BlueprintSection id="produit" innerClassName="px-6 py-14 lg:px-12 lg:py-20">
        <SectionHeading
          index="№ 02"
          kicker="Le produit"
          title="Une note scorée par semaine, pas un fil d'actualité"
          description="Un outil par mots-clés remonte des articles, pas un arbitrage. Signaux Faibles part du cadrage de votre organisation et relie chaque signal à une décision."
        />
        <div className="mt-10 grid gap-px border border-dark-gray bg-dark-gray md:grid-cols-3">
          {PRODUIT.map((bloc) => (
            <div key={bloc.titre} className="bg-obsidian p-6 lg:p-8">
              <h3 className="text-lg font-medium tracking-tight text-foreground">{bloc.titre}</h3>
              <p className="mt-2 font-inter-tight text-base leading-relaxed text-mid-gray">{bloc.corps}</p>
            </div>
          ))}
        </div>
        <figure className="mt-10 border border-dark-gray">
          <Image
            src="/img/desktop-screen-signaux-faibles.jpg"
            alt="Vue d'ensemble d'un espace Signaux Faibles : axes suivis, signal fort, acteurs suivis et action de la semaine"
            width={1280}
            height={720}
            sizes="(min-width: 1024px) 960px, 100vw"
            className="h-auto w-full"
          />
        </figure>
      </BlueprintSection>

      <Separator />

      {/* ── № 03 — Le fonctionnement ──────────────────────────────────── */}
      <BlueprintSection tone="jet" id="fonctionnement" innerClassName="px-6 py-14 lg:px-12 lg:py-20">
        <SectionHeading
          index="№ 03"
          kicker="Le fonctionnement"
          title="Les agents lisent, un humain valide"
        />
        <ol className="mt-10 grid gap-px border border-dark-gray bg-dark-gray md:grid-cols-3">
          {ETAPES.map((e, i) => (
            <li key={e.titre} className="bg-obsidian p-6 lg:p-8">
              <p className="font-mono text-2xs uppercase tracking-[0.14em] text-accent-secondary">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 text-lg font-medium tracking-tight text-foreground">{e.titre}</h3>
              <p className="mt-2 font-inter-tight text-base leading-relaxed text-mid-gray">{e.corps}</p>
            </li>
          ))}
        </ol>
      </BlueprintSection>

      <Separator />

      {/* ── № 04 — Les deux formules, côte à côte ─────────────────────── */}
      <BlueprintSection id="offres" innerClassName="px-6 py-14 lg:px-12 lg:py-20">
        <SectionHeading
          index="№ 04"
          kicker="Deux formules"
          title="Signaux Faibles, ou une veille sur mesure"
          description="Le tarif de chacune se fixe après l'échange gratuit, par écrit, avant de commencer."
        />
        <div className="mt-10 grid gap-6">
          <article className="grid gap-x-12 gap-y-4 border border-accent-secondary bg-jet p-6 lg:grid-cols-2 lg:p-8">
            <div className="flex flex-col gap-4">
              <p className="font-mono text-2xs uppercase tracking-[0.14em] text-accent-secondary">Le produit</p>
              <h3 className="text-2xl font-light tracking-tight text-foreground">Signaux Faibles</h3>
              <p className="font-inter-tight text-base leading-relaxed text-foreground/85">
                La veille stratégique hebdomadaire, prête à l&apos;emploi, cadrée sur votre organisation en
                trois questions.
              </p>
              <a
                href={CTA_ECHANGE.href}
                target="_blank"
                rel="noopener noreferrer"
                className={HERO_BTN_PRIMARY + " mt-2 self-start"}
              >
                {CTA_ECHANGE.label.fr}
                <ArrowRight size={14} />
              </a>
            </div>
            <ul className="flex flex-col gap-2 self-center font-inter-tight text-base leading-relaxed text-mid-gray">
              <li>Deux veilles : écosystème et position concurrentielle</li>
              <li>Une note scorée par semaine, « L&apos;essentiel » en 8 lignes</li>
              <li>Un espace en ligne sans mot de passe, lisible hors ligne</li>
            </ul>
          </article>

          <article className="grid gap-x-12 gap-y-4 border border-dark-gray bg-obsidian p-6 lg:grid-cols-2 lg:p-8">
            <div className="flex flex-col gap-4">
              <p className="font-mono text-2xs uppercase tracking-[0.14em] text-mid-gray">Sur devis</p>
              <h3 className="text-2xl font-light tracking-tight text-foreground">Veille sur mesure</h3>
              <p className="font-inter-tight text-base leading-relaxed text-foreground/85">
                Une veille construite pour votre secteur, vos sources et vos décisions, avec la même
                chaîne : des agents qui lisent, un humain qui valide.
              </p>
              <Link href="/contact" className={HERO_BTN_SECONDARY + " mt-2 self-start"}>
                Décrire mon besoin
                <ArrowRight size={14} />
              </Link>
            </div>
            <ul className="flex flex-col gap-2 self-center font-inter-tight text-base leading-relaxed text-mid-gray">
              {SUR_MESURE.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
        <p className="mt-8 max-w-2xl font-inter-tight text-sm leading-relaxed text-mid-gray">
          Signaux Faibles est aussi l&apos;outil sur lequel j&apos;appuie mes arbitrages techniques.{" "}
          <Link
            href="/etudes-de-cas/signaux-faibles"
            className="text-accent-secondary underline underline-offset-4 hover:text-foreground"
          >
            Lire l&apos;étude de cas
          </Link>
        </p>
      </BlueprintSection>
    </main>
  );
}
