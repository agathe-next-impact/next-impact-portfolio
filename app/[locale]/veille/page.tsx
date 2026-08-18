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
import { OFFER_PRICE_LABEL } from "@/lib/sentinelle-offer";
import { NEWSLETTER_SUBSTACK_URL } from "@/lib/newsletter";
import { Sonar } from "@/components/visuals/sonar";

// ─────────────────────────────────────────────────────────────────────────────
// Page « Veille techno » — hiérarchie : la newsletter d'abord, les ressources ensuite.
//
// Ordre de priorité (décidé le 2026-08-18) :
//   1. PRIMAIRE — la lettre gratuite « Quelle techno pour mon site web à l'heure
//      de l'IA ? » (Substack : une synthèse mensuelle + un focus hebdo). C'est
//      l'accès mis en avant : héros et premier bloc, CTA principal « S'abonner ».
//   2. Puis Sentinelle (19 €/mois) : veille personnalisée du site + aide à la
//      décision. Renvoie vers /sentinelle (détail) et /scan (entrée froide).
//   3. SECONDAIRE — les ressources : le hub /documentation et les outils /outils,
//      en fin de page.
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
      ? "Tech watch — a free newsletter, and a personalized watch on your site"
      : "Veille techno — la lettre gratuite et la veille personnalisée de votre site",
    description: isEn
      ? "Two complementary letters: a free monthly digest and weekly focus on web & AI technology, and Sentinelle, the personalized watch that helps you decide — consolidate, evolve or rebuild — €19/month, human-reviewed before sending."
      : "Deux lettres complémentaires : « Quelle techno pour mon site web à l'heure de l'IA ? », gratuite — une synthèse mensuelle et un focus hebdo — et Sentinelle, la veille personnalisée qui vous aide à décider : consolider, faire évoluer ou refondre. 19 €/mois, relue par un humain avant envoi.",
    path: "/veille",
    keywords: isEn
      ? [
          "web technology newsletter",
          "tech watch website",
          "AI web trends newsletter",
          "website monitoring newsletter",
        ]
      : [
          "newsletter techno web",
          "veille technologique site web",
          "newsletter web IA",
          "veille site WordPress",
          "lettre de veille personnalisée",
        ],
    locale,
    // Contenu FR uniquement pour l'instant — même règle que /sentinelle.
    noindex: isEn,
  });
}

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

const SENTINELLE = [
  {
    titre: "Des alertes qui vous concernent",
    corps:
      "Une faille est publiée chaque jour sur un plugin WordPress. Vous ne recevez que celles qui touchent un composant réellement installé chez vous, dans une version réellement affectée.",
  },
  {
    titre: "Deux lettres par mois",
    corps:
      "Le 1er et le 15 : votre site croisé avec l'actualité de la période, lu selon cinq axes — commercial, marketing, visibilité (SEO/GEO), expérience (UI/UX) et technique. Et en synthèse : trois actions au plus, trois scénarios — consolider, faire évoluer par blocs, ou refondre.",
  },
  {
    titre: "Un statut, pas du jargon",
    corps:
      "Chaque axe conclut : agir, surveiller, ou non concerné. Écrit pour un décideur, pas pour un développeur — chaque enjeu technique est traduit en argent, risque, délai ou visibilité. « Non concerné » est aussi une information, souvent la plus rassurante.",
  },
  {
    titre: "Relu par un humain",
    corps:
      "Rien ne part automatiquement. La lettre n'affirme que des faits datés et sourcés — le code le vérifie — et le modèle consigne ses hypothèses dans des notes de production que je relis. Je vérifie, je corrige, puis j'envoie : chaque alerte et chaque numéro passent par moi.",
  },
];

const COMPARATIF = [
  {
    nom: "La lettre gratuite",
    badge: "0 € · Substack",
    lignes: [
      {
        label: "Elle couvre",
        valeur:
          "Le marché : IA, CMS, outils, tendances — ce qui bouge dans l'écosystème web.",
      },
      {
        label: "Vous recevez",
        valeur: "Une synthèse par mois + un focus par semaine.",
      },
      {
        label: "Elle répond à",
        valeur:
          "« Qu'est-ce qui change, et qu'est-ce que ça change pour mes choix ? »",
      },
    ],
    cta: { libelle: "S'abonner — gratuit", href: NEWSLETTER_SUBSTACK_URL, externe: true },
  },
  {
    nom: "Sentinelle",
    badge: `${OFFER_PRICE_LABEL} · sans engagement`,
    lignes: [
      {
        label: "Elle couvre",
        valeur:
          "Votre site ou votre application : ses composants réels, croisés avec l'actualité techno.",
      },
      {
        label: "Vous recevez",
        valeur:
          "Deux lettres par mois (le 1er et le 15) + des alertes quand ça vous concerne.",
      },
      {
        label: "Elle répond à",
        valeur: "« Consolider, faire évoluer ou refondre : que faire, et quand ? »",
      },
    ],
    cta: { libelle: "Découvrir Sentinelle", href: "/sentinelle", externe: false },
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

      {/* ── Héros : le bénéfice, puis les deux niveaux ───────────────────── */}
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
            semaine. Gratuite. Pour une veille sur votre site précis, Sentinelle
            prend le relais.
          </>
        }
        actions={
          <>
            <a
              href={NEWSLETTER_SUBSTACK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={BTN_PRIMARY}
            >
              S'abonner — gratuit
            </a>
            <Link href="/sentinelle" className={BTN_SECONDARY}>
              Découvrir Sentinelle
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

      {/* ── La lettre gratuite : deux rendez-vous ────────────────────────── */}
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
          description="La lettre des décideurs qui doivent choisir la bonne technologie web, sans devenir développeur. Deux rendez-vous, gratuits, sur Substack."
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
            href={NEWSLETTER_SUBSTACK_URL}
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

      {/* ── Sentinelle : la veille qui porte VOTRE nom de domaine ────────── */}
      <BlueprintSection
        id="sentinelle"
        className="border-t border-dark-gray"
        innerClassName="px-6 py-14 lg:px-12 lg:py-20"
      >
        <SectionHeading
          index="№ 02"
          kicker={`Sentinelle — ${OFFER_PRICE_LABEL}`}
          title="La veille personnalisée qui aide à décider"
          description="Vous indiquez l'adresse de votre site ou de votre application. Sentinelle identifie les composants réellement utilisés — analyse externe, sans accès à votre administration — les croise avec l'actualité, et conclut : consolider, faire évoluer, ou refondre. Ce qu'elle ne peut pas observer devient une question à poser à votre prestataire, jamais une affirmation."
        />

        <div className="mt-12 grid gap-px border border-dark-gray bg-dark-gray sm:grid-cols-2">
          {SENTINELLE.map((bloc) => (
            <div key={bloc.titre} className="bg-obsidian p-8">
              <h3 className="text-lg font-medium tracking-tight text-foreground">
                {bloc.titre}
              </h3>
              <p className="mt-3 font-inter-tight text-base leading-relaxed text-mid-gray">
                {bloc.corps}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href="/scan" className={BTN_PRIMARY}>
            Analyser mon site — gratuit, 2 min
          </Link>
          <Link href="/sentinelle" className={BTN_SECONDARY}>
            Découvrir Sentinelle en détail
          </Link>
        </div>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">
          {OFFER_PRICE_LABEL} · sans engagement · relu par un humain avant envoi
        </p>
      </BlueprintSection>

      {/* ── Comparatif : une décision, deux colonnes ─────────────────────── */}
      <BlueprintSection
        tone="jet"
        className="border-t border-dark-gray"
        innerClassName="px-6 py-14 lg:px-12 lg:py-20"
      >
        <SectionHeading
          index="№ 03"
          kicker="Pour décider"
          title="Laquelle est pour vous ?"
          description="Les deux se complètent : l'une éclaire les décisions à venir, l'autre veille sur l'existant."
        />

        <div className="mt-12 grid gap-px border border-dark-gray bg-dark-gray md:grid-cols-2">
          {COMPARATIF.map((offre) => (
            <div key={offre.nom} className="flex flex-col bg-jet p-8">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
                {offre.badge}
              </span>
              <h3 className="mt-4 text-xl font-light tracking-tight text-foreground">
                {offre.nom}
              </h3>
              <dl className="mt-6 flex-1 space-y-5">
                {offre.lignes.map((ligne) => (
                  <div key={ligne.label}>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray">
                      {ligne.label}
                    </dt>
                    <dd className="mt-1 font-inter-tight text-base leading-relaxed text-foreground/80">
                      {ligne.valeur}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8">
                {offre.cta.externe ? (
                  <a
                    href={offre.cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={BTN_SECONDARY}
                  >
                    {offre.cta.libelle}
                  </a>
                ) : (
                  <Link href={offre.cta.href} className={BTN_SECONDARY}>
                    {offre.cta.libelle}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 max-w-2xl border-l-2 border-accent-secondary/60 pl-4 font-inter-tight text-base leading-relaxed text-foreground/80">
          Vous hésitez ? Commencez par la lettre gratuite. Le jour où votre site
          fait tourner votre activité — prises de contact, ventes, réservations —
          Sentinelle prend le relais sur ce qui vous appartient.
        </p>
      </BlueprintSection>

      {/* ── Ressources : documentation & outils (accès secondaire) ───────── */}
      <BlueprintSection
        id="ressources"
        className="border-t border-dark-gray"
        innerClassName="px-6 py-14 lg:px-12 lg:py-20"
      >
        <SectionHeading
          index="№ 04"
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
