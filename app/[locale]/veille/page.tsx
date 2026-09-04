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
import { NEWSLETTER_SUBSTACK_URL } from "@/lib/newsletter";
import { HeroOfferStrip, type HeroOffer } from "@/components/aspect/hero-offer-strip";
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
// Le héros et le corps présentent trois façons d'avancer, toutes gratuites :
//   – la lettre gratuite « Quelle techno pour mon site web à l'heure de l'IA ? »
//     (Substack : une synthèse mensuelle + un focus hebdo sur le marché web & IA) ;
//   – les ressources de fond (choisir sa techno, être trouvé par l'IA, lire un devis) ;
//   – les outils de diagnostic (techno, visibilité IA, réparer ou refaire, devis).
//
// Sentinelle (veille personnalisée payante) n'est PAS présentée ici : elle a sa
// propre page /sentinelle, accessible depuis la navigation. La section comparatif
// est commentée plus bas et n'est pas rendue — la métadonnée et le JSON-LD de
// cette page ne doivent donc décrire QUE la veille gratuite et les ressources.
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
      ? "Tech watch for decision-makers: the free newsletter, no jargon"
      : "Veille techno pour décideurs : la lettre gratuite, sans jargon",
    description: isEn
      ? "The free newsletter on the web & AI market: one digest a month, one focus a week. Plus resources and tools to help you decide, without becoming a developer."
      : "La lettre gratuite sur le marché web & IA : une synthèse par mois, un focus par semaine. Des ressources et des outils pour décider, sans devenir développeur.",
    path: "/veille",
    keywords: isEn
      ? [
          "web technology newsletter",
          "tech watch for decision-makers",
          "AI web trends newsletter",
          "free website diagnostic tools",
        ]
      : [
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

// Aperçu dans le héros : la lettre gratuite, les ressources et les outils —
// les trois façons d'avancer proposées par la page (ancres vers les sections).
const VEILLE_OFFERS: HeroOffer[] = [
  {
    name: "Lettre gratuite",
    price: "0 €",
    benefit: "Le marché web & IA : une synthèse par mois, un focus par semaine.",
    href: NEWSLETTER_SUBSTACK_URL,
    external: true,
  },
  {
    name: "Ressources",
    benefit: "Choisir sa techno, être trouvé par l'IA, lire un devis — sans jargon.",
    href: "#ressources",
  },
  {
    name: "Outils",
    benefit: "Diagnostiquez votre site en quelques minutes : techno, visibilité, devis.",
    href: "#outils",
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
      "Le 1er et le 15 : votre site croisé avec l'actualité de la période, lu selon douze axes — du socle technique à la visibilité, aux coûts et à la réversibilité. Et en synthèse : trois actions au plus, trois scénarios — consolider, faire évoluer par blocs, ou refondre.",
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
      <BreadcrumbJsonLd items={breadcrumbItems} />
      {/* Schéma Service aligné sur le contenu visible : la veille gratuite pour
          décideurs (lettre Substack, ressources et outils). Sentinelle a sa
          propre page /sentinelle et n'est pas décrite ici. */}
      <ServiceJsonLd
        name={
          isEn
            ? "Tech watch for decision-makers: free newsletter, resources and tools"
            : "Veille techno pour décideurs : lettre gratuite, ressources et outils"
        }
        description={
          isEn
            ? "A free newsletter on the web & AI market (one digest a month, one focus a week), plus free resources and tools to understand and decide, without jargon."
            : "La lettre gratuite sur le marché web & IA (une synthèse par mois, un focus par semaine), des ressources et des outils gratuits pour comprendre et décider, sans jargon."
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
            La veille techno,{" "}
            <em className="font-normal not-italic text-accent-secondary">
              pour décideurs
            </em>
          </>
        }
        description={
          <>
            La lettre gratuite suit le marché web & IA : une synthèse par mois, un
            focus par semaine. Et des ressources et des outils pour comprendre et
            trancher — sans devenir développeur.
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
              La lettre gratuite — Substack
            </a>
            <a href="#outils" className={BTN_SECONDARY}>
              Les outils gratuits
            </a>
          </>
        }
        note="Gratuit · désinscription en un clic"
      >
        <HeroOfferStrip offers={VEILLE_OFFERS} />
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

        {/* Preuve : qui tient la veille — le diplôme légitime l'offre, en ligne
            sobre près de la promesse, jamais en accroche (même logique AGEFIPH). */}
        <p className="mt-8 max-w-2xl border-l-2 border-accent-secondary/60 pl-4 font-inter-tight text-base leading-relaxed text-foreground/80">
          Derrière la lettre : une consultante formée à la discipline, master
          Veille technologique et innovation (Aix-Marseille), qui pratique la
          veille depuis 2012, du marché web aux modèles IA.
        </p>

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

{/* Sentinelle : la veille personnalisée, avec le comparatif des deux lettres. 
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
*/}

      {/* ── Ressources : comprendre avant de décider ─────────────────────── */}
      <BlueprintSection
        id="ressources"
        className="border-t border-dark-gray"
        innerClassName="px-6 py-14 lg:px-12 lg:py-20"
      >
        <SectionHeading
          index="№ 02"
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
                <p className="mt-3 flex-1 font-inter-tight text-base leading-relaxed text-mid-gray">
                  {bloc.corps}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-accent-secondary">
                  Lire
                  <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href="/documentation" className={BTN_PRIMARY}>
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
          index="№ 03"
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
                <p className="mt-3 flex-1 font-inter-tight text-base leading-relaxed text-mid-gray">
                  {bloc.corps}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-accent-secondary">
                  Ouvrir
                  <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href="/outils" className={BTN_PRIMARY}>
            Tous les outils
          </Link>
        </div>
      </BlueprintSection>

    </main>
  );
}
