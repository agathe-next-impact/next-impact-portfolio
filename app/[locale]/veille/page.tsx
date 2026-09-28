import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd, ServiceJsonLd } from "@/components/json-ld";
import { BlueprintSection, SectionHeading } from "@/components/aspect/section";
import {
  PageHero,
  HERO_BTN_PRIMARY as BTN_PRIMARY,
  HERO_BTN_SECONDARY as BTN_SECONDARY,
} from "@/components/aspect/page-hero";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { OFFER_PRICE_LABEL } from "@/lib/sentinelle-offer";
import { NEWSLETTER_SUBSCRIBE_URL } from "@/lib/newsletter";
import { DerniereLettre } from "@/components/veille/derniere-lettre";
import { HeroNavCards, type HeroNavCard } from "@/components/aspect/hero-nav-cards";
import { Sonar } from "@/components/visuals/sonar";
import {
  Radar,
  Wrench,
  FileSearch,
  Compass,
  ScanSearch,
  GitCompare,
  ScrollText,
  ArrowRight,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Page « Veille techno » — la veille pour décideurs, sans le jargon.
//
// Page d'arrivée de l'entrée de nav « La veille ». Ordre voulu par Agathe :
//   1. Sentinelle, la veille personnalisée de votre site (payante) — en premier ;
//   2. la lettre gratuite « Quelle techno pour mon site web à l'heure de l'IA ? »
//      (Substack : une synthèse mensuelle + un focus hebdo sur le marché web & IA) ;
//   3. en secondaire : les ressources de fond, puis les outils de diagnostic.
//
// Sentinelle reste hors catalogue (ADR-013) : elle se présente ici comme la
// veille de votre site, pas comme une carte d'offre, et renvoie vers
// /sentinelle (CTA « La veille personnalisée »). La section comparatif est commentée plus bas et n'est pas rendue.
//
// Contenu FR uniquement (locale EN en noindex), comme /sentinelle.
// ─────────────────────────────────────────────────────────────────────────────

// Une heure, et non la journée des autres pages : le héros affiche le dernier
// numéro Substack, qui doit paraître ici le jour même de sa publication.
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  return generatePageMetadata({
    title: isEn
      ? "Tech watch for decision-makers: Sentinelle and the free newsletter"
      : "Veille techno pour décideurs : Sentinelle et la lettre gratuite",
    description: isEn
      ? "Sentinelle watches your site: its real components cross-checked with the news, two letters a month, an alert when it concerns you. Plus the free web & AI newsletter, resources and tools."
      : "Sentinelle veille sur votre site : ses composants réels croisés avec l'actualité, deux lettres par mois, une alerte quand ça vous concerne. Et la lettre gratuite web & IA, des ressources et des outils.",
    path: "/veille",
    keywords: isEn
      ? [
          "personalized website watch",
          "website vulnerability alerts",
          "web technology newsletter",
          "tech watch for decision-makers",
          "AI web trends newsletter",
          "free website diagnostic tools",
        ]
      : [
          "veille personnalisée site web",
          "alertes failles site WordPress",
          "newsletter techno web",
          "veille technologique",
          "newsletter web IA",
          "veille techno décideurs",
          "outils diagnostic site web",
        ],
    locale,
    // Contenu FR uniquement pour l'instant — même règle que /sentinelle.
    noindex: isEn,
    // Pas d'alternate hreflang EN : la locale EN est en noindex (cohérent
    // avec le sitemap, qui liste /veille sans alternates).
    alternateLocales: ["fr"],
  });
}

// Colonne droite du héros (page mère) : ses deux offres enfants, et elles
// seules, dans l'ordre de la page : Sentinelle d'abord, vers sa page, la
// lettre gratuite ensuite, qui n'a pas de page à elle : sa carte mène à la
// section où l'on s'abonne.
const HERO_CARDS: HeroNavCard[] = [
  {
    label: "Sentinelle",
    value: OFFER_PRICE_LABEL,
    detail: "Deux lettres par mois, une alerte quand votre site est concerné.",
    href: "/sentinelle",
  },
  {
    label: "Lettre gratuite",
    value: "0 €",
    detail: "Le marché web & IA : une synthèse par mois, un focus par semaine.",
    href: "#gratuite",
  },
];

// Deux sections volontairement courtes : un titre, une phrase, trois (ou deux)
// arguments d'une ligne, un CTA. Le détail vit sur /sentinelle et sur Substack.
const LETTRE_GRATUITE = [
  {
    titre: "Une synthèse par mois",
    corps:
      "Ce qui a compté le mois passé, trié selon une question : est-ce que ça change une décision pour votre site ?",
  },
  {
    titre: "Un focus par semaine",
    corps: "Un sujet d'actualité décrypté en cinq minutes, sans jargon.",
  },
];

const SENTINELLE = [
  {
    titre: "Des alertes ciblées",
    corps:
      "Seulement les failles qui touchent un composant installé chez vous, dans la version affectée.",
  },
  {
    titre: "Deux lettres par mois",
    corps: "Le 1er et le 15 : ce qui change pour votre site, en trois actions au plus.",
  },
  {
    titre: "Relue par un humain",
    corps: "Chaque alerte et chaque lettre passent par moi avant envoi.",
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
    cta: { libelle: "S'abonner — gratuit", href: NEWSLETTER_SUBSCRIBE_URL, externe: true },
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

// Les rubriques de fond à mettre en avant depuis la veille : comprendre avant
// de décider. Renvoient vers le hub /documentation (source : lib/hub-themes).
const RESSOURCES = [
  {
    icon: Compass,
    titre: "Choisir sa techno",
    corps:
      "WordPress, no-code, Headless ou sur-mesure : les critères pour trancher, sans devenir développeur.",
    href: "/documentation/choisir",
  },
  {
    icon: Radar,
    titre: "Être trouvé à l'heure de l'IA",
    corps:
      "Comment ChatGPT, Perplexity et les moteurs IA citent — ou ignorent — votre site, et quoi y changer.",
    href: "/documentation/etre-trouve",
  },
  {
    icon: Wrench,
    titre: "Réparer ou refaire",
    corps:
      "Reconnaître un site en bout de course, et savoir quand consolider plutôt que tout refondre.",
    href: "/documentation/reparer",
  },
  {
    icon: FileSearch,
    titre: "Avant de signer",
    corps:
      "Lire un devis web, poser les bonnes questions et éviter les pièges avant de vous engager.",
    href: "/documentation/avant-signer",
  },
];

// Les outils interactifs à mettre en avant : passer de la lecture à la décision.
// Renvoient vers /outils (source : components/outils/outils-bento-grid).
const OUTILS = [
  {
    icon: Compass,
    titre: "Sélecteur techno web & IA",
    corps: "8 critères, une recommandation : la bonne technologie pour votre projet.",
    href: "/outils/selecteur-techno",
  },
  {
    icon: ScanSearch,
    titre: "Visibilité dans les moteurs IA",
    corps: "10 questions, un score sur 4 axes et vos actions prioritaires pour être cité.",
    href: "/outils/visibilite-ia",
  },
  {
    icon: GitCompare,
    titre: "Réparer ou refaire ?",
    corps: "Un score de santé et un signal clair : réparer, optimiser ou refondre.",
    href: "/outils/reparer-ou-refaire",
  },
  {
    icon: ScrollText,
    titre: "Décrypteur de devis web",
    corps: "9 vérifications pour lire un devis et poser les bonnes questions avant de signer.",
    href: "/outils/decrypteur-devis",
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
      <BreadcrumbJsonLd locale={locale} items={breadcrumbItems} />
      {/* Schéma Service aligné sur le contenu visible, dans l'ordre de la page :
          Sentinelle, la lettre gratuite, puis les ressources et les outils. */}
      <ServiceJsonLd
        locale={locale}
        name={
          isEn
            ? "Tech watch for decision-makers: Sentinelle and the free newsletter"
            : "Veille techno pour décideurs : Sentinelle et la lettre gratuite"
        }
        description={
          isEn
            ? "Sentinelle, the personalised watch on your site (two letters a month, alerts when a component is affected), plus a free newsletter on the web & AI market, resources and tools to decide without jargon."
            : "Sentinelle, la veille personnalisée de votre site (deux lettres par mois, une alerte quand un composant est touché), plus la lettre gratuite sur le marché web & IA, des ressources et des outils pour décider sans jargon."
        }
        serviceType={isEn ? "Technology watch" : "Veille technologique"}
        url="/veille"
      />

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
            La veille techno de{" "}
            <em className="font-normal not-italic text-accent-secondary">votre site web</em>
          </>
        }
        description={
          <>
            Sentinelle veille sur votre site : ses composants réels croisés avec
            l'actualité, et une alerte quand ça vous concerne. La lettre gratuite
            suit le marché web & IA. Des ressources et des outils pour trancher —
            sans devenir développeur.
          </>
        }
        // Un seul bouton dans le héros (demande d'Agathe, 2026-09-28) : le
        // contact, comme sur /sentinelle.
        actions={
          <Link href="/contact" className={BTN_PRIMARY}>
            Contact
          </Link>
        }
        note={`Sentinelle ${OFFER_PRICE_LABEL}, sans engagement · lettre gratuite`}
        // Cartes à leur hauteur naturelle (sans `fill`) : colonne de droite
        // réduite, propre à ce héros.
        aside={<HeroNavCards label="Les offres" cards={HERO_CARDS} />}
        // Preuve que la lettre paraît vraiment — lue sur le flux Substack à
        // chaque régénération de la page (ISR, voir revalidate). Pleine
        // largeur, sous les deux colonnes.
        below={<DerniereLettre />}
      />

      {/* ── Sentinelle : la veille de votre site, en premier ─────────────── */}
      <BlueprintSection
        id="sentinelle"
        className="border-t border-dark-gray"
        innerClassName="px-6 py-14 lg:px-12 lg:py-20"
      >
        <SectionHeading
          index="№ 01"
          kicker={`Sentinelle — ${OFFER_PRICE_LABEL}`}
          title="La veille personnalisée de votre site"
          description="Sentinelle suit les composants réellement installés sur votre site, les croise avec l'actualité et vous dit quoi faire. Analyse externe, sans accès à votre administration."
        />

        <div className="mt-10 grid gap-px border border-dark-gray bg-dark-gray md:grid-cols-3">
          {SENTINELLE.map((bloc) => (
            <div key={bloc.titre} className="bg-obsidian p-6 lg:p-8">
              <h3 className="text-lg font-medium tracking-tight text-foreground">
                {bloc.titre}
              </h3>
              <p className="mt-2 font-inter-tight text-base leading-relaxed text-mid-gray">
                {bloc.corps}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href="/sentinelle" className={BTN_PRIMARY}>
            La veille personnalisée
          </Link>
          <p className="font-mono text-2xs uppercase tracking-[0.14em] text-mid-gray">
            {OFFER_PRICE_LABEL} · sans engagement
          </p>
        </div>
      </BlueprintSection>

      {/* ── La lettre gratuite : deux rendez-vous ────────────────────────── */}
      <BlueprintSection
        id="gratuite"
        tone="jet"
        className="border-t border-dark-gray"
        innerClassName="px-6 py-14 lg:px-12 lg:py-20"
      >
        <SectionHeading
          index="№ 02"
          kicker="La lettre gratuite"
          title="La newsletter techno web & IA"
          description="Le marché web & IA, trié pour les décideurs. Gratuite, sur Substack."
        />

        <div className="mt-10 grid gap-px border border-dark-gray bg-dark-gray md:grid-cols-2">
          {LETTRE_GRATUITE.map((bloc) => (
            <div key={bloc.titre} className="bg-jet p-6 lg:p-8">
              <h3 className="text-lg font-medium tracking-tight text-foreground">
                {bloc.titre}
              </h3>
              <p className="mt-2 font-inter-tight text-base leading-relaxed text-mid-gray">
                {bloc.corps}
              </p>
            </div>
          ))}
        </div>

        {/* Preuve : qui tient la veille — le diplôme légitime l'offre, en ligne
            sobre près de la promesse, jamais en accroche (même logique AGEFIPH). */}
        <p className="mt-8 max-w-2xl border-l-2 border-accent-secondary/60 pl-4 font-inter-tight text-base leading-relaxed text-foreground/80">
          Tenue par une consultante diplômée en veille technologique (master,
          Aix-Marseille), qui pratique la veille depuis 2012.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={NEWSLETTER_SUBSCRIBE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={BTN_PRIMARY}
          >
            S'abonner — gratuit
          </a>
          <p className="font-mono text-2xs uppercase tracking-[0.14em] text-mid-gray">
            Désinscription en un clic
          </p>
        </div>
      </BlueprintSection>

{/* Comparatif des deux lettres (Sentinelle est rendue plus haut, section № 01).
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
              <span className="font-mono text-2xs uppercase tracking-[0.14em] text-accent-secondary">
                {offre.badge}
              </span>
              <h3 className="mt-4 text-xl font-light tracking-tight text-foreground">
                {offre.nom}
              </h3>
              <dl className="mt-6 flex-1 space-y-5">
                {offre.lignes.map((ligne) => (
                  <div key={ligne.label}>
                    <dt className="font-mono text-2xs uppercase tracking-[0.12em] text-mid-gray">
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
*/}

      {/* ── Ressources : comprendre avant de décider ─────────────────────── */}
      <BlueprintSection
        id="ressources"
        className="border-t border-dark-gray"
        innerClassName="px-6 py-14 lg:px-12 lg:py-20"
      >
        <SectionHeading
          index="№ 03"
          kicker="Ressources"
          title="Documentation"
          description="Des repères clairs pour choisir votre techno, être trouvé par les moteurs IA et lire un devis — sans devenir développeur."
        />

        <div className="mt-12 grid gap-px border border-dark-gray bg-dark-gray sm:grid-cols-2">
          {RESSOURCES.map((bloc) => {
            const Icon = bloc.icon;
            return (
              <Link
                key={bloc.href}
                href={bloc.href}
                className="group flex flex-col bg-jet p-8 transition-colors hover:bg-obsidian"
              >
                <Icon
                  size={18}
                  className="text-mid-gray transition-colors group-hover:text-accent-secondary"
                />
                <h3 className="mt-5 text-lg font-medium tracking-tight text-foreground">
                  {bloc.titre}
                </h3>
                <p className="mt-3 flex-1 font-inter-tight text-base md:text-lg leading-relaxed text-mid-gray">
                  {bloc.corps}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-2xs uppercase tracking-[0.08em] text-accent-secondary">
                  Lire
                  <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href="/documentation" className={BTN_SECONDARY}>
            Toutes les ressources
          </Link>
        </div>
      </BlueprintSection>

      {/* ── Outils : passer de la lecture à la décision ──────────────────── */}
      <BlueprintSection
        id="outils"
        tone="jet"
        className="border-t border-dark-gray"
        innerClassName="px-6 py-14 lg:px-12 lg:py-20"
      >
        <SectionHeading
          index="№ 04"
          kicker="Outils"
          title="Outils en ligne"
          description="Des outils gratuits pour transformer un doute en décision : quelle techno, quelle visibilité, réparer ou refaire, quel devis."
        />

        <div className="mt-12 grid gap-px border border-dark-gray bg-dark-gray sm:grid-cols-2">
          {OUTILS.map((bloc) => {
            const Icon = bloc.icon;
            return (
              <Link
                key={bloc.href}
                href={bloc.href}
                className="group flex flex-col bg-obsidian p-8 transition-colors hover:bg-jet"
              >
                <Icon
                  size={18}
                  className="text-mid-gray transition-colors group-hover:text-accent-secondary"
                />
                <h3 className="mt-5 text-lg font-medium tracking-tight text-foreground">
                  {bloc.titre}
                </h3>
                <p className="mt-3 flex-1 font-inter-tight text-base md:text-lg leading-relaxed text-mid-gray">
                  {bloc.corps}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-2xs uppercase tracking-[0.08em] text-accent-secondary">
                  Ouvrir
                  <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href="/outils" className={BTN_SECONDARY}>
            Tous les outils
          </Link>
        </div>
      </BlueprintSection>

    </main>
  );
}
