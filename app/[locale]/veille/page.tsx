import { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd, ServiceJsonLd } from "@/components/json-ld";
import { BlueprintSection, SectionHeading } from "@/components/aspect/section";
import {
  PageHero,
  HERO_BTN_PRIMARY as BTN_PRIMARY,
  HERO_BTN_SECONDARY as BTN_SECONDARY,
} from "@/components/aspect/page-hero";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
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
// Page « Agents de veille IA » (ADR-042, 2026-10-14).
//
// Page d'arrivée de l'entrée de nav « Agents de veille IA ». Deux agents de
// veille, et eux seuls (demande d'Agathe) :
//   1. Signaux Faibles, la veille stratégique de l'organisation (faits repris
//      de l'étude de cas `signaux-faibles`, lib/case-studies-data.ts ; aucun
//      prix publié, donc aucun montant affiché) ;
//   2. la lettre de veille techno gratuite « Quelle techno pour mon site web à
//      l'heure de l'IA ? » (Substack : une synthèse mensuelle + un focus hebdo
//      sur le marché web & IA).
// En secondaire : les ressources de fond, puis les outils de diagnostic.
//
// Sentinelle n'est plus présentée ici : elle garde sa fiche /sentinelle, se
// vend depuis l'analyse du site et reste incluse dans le suivi et maintenance.
//
// Contenu FR uniquement (locale EN en noindex), comme /sentinelle.
// ─────────────────────────────────────────────────────────────────────────────

// Une heure, et non la journée des autres pages : le héros affiche le dernier
// numéro Substack, qui doit paraître ici le jour même de sa publication.
export const revalidate = 3600;

// Page fermée le 2026-10-14 (ADR-043, demande d'Agathe) : 404, hors menu,
// footer, sitemap et llms. Le contenu reste pour une réouverture : repasser
// à true, puis remettre l'entrée du sitemap, du footer et du mega menu.
const VEILLE_PUBLISHED = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  return generatePageMetadata({
    title: isEn
      ? "AI watch agents: Signaux Faibles and the free tech letter"
      : "Agents de veille IA : Signaux Faibles et la lettre techno gratuite",
    description: isEn
      ? "Two AI watch agents, reviewed by a human: Signaux Faibles, a weekly strategic watch for your organisation, and the free web & AI tech letter."
      : "Deux agents de veille IA, relus par un humain : Signaux Faibles, la veille stratégique hebdomadaire de votre organisation, et la lettre techno web & IA gratuite.",
    path: "/veille",
    keywords: isEn
      ? [
          "AI watch agents",
          "strategic intelligence AI agents",
          "competitive intelligence weekly brief",
          "web technology newsletter",
          "AI web trends newsletter",
          "free website diagnostic tools",
        ]
      : [
          "agents de veille IA",
          "veille stratégique",
          "veille concurrentielle",
          "newsletter techno web",
          "newsletter web IA",
          "veille technologique",
          "outils diagnostic site web",
        ],
    locale,
    // Contenu FR uniquement pour l'instant — même règle que /sentinelle.
    noindex: isEn || !VEILLE_PUBLISHED,
    // Pas d'alternate hreflang EN : la locale EN est en noindex (cohérent
    // avec le sitemap, qui liste /veille sans alternates).
    alternateLocales: ["fr"],
  });
}

// Colonne droite du héros : les deux agents de veille, dans l'ordre de la
// page. Aucun n'a de page à lui : chaque carte mène à sa section. Signaux
// Faibles sans prix (aucun publié).
const HERO_CARDS: HeroNavCard[] = [
  {
    label: "Signaux Faibles",
    detail: "La veille stratégique de votre organisation : une note scorée par semaine.",
    href: "#signaux-faibles",
  },
  {
    label: "Lettre veille techno",
    value: "0 €",
    detail: "Le marché web & IA : une synthèse par mois, un focus par semaine.",
    href: "#gratuite",
  },
];

// Deux sections volontairement courtes : un titre, une phrase, trois (ou deux)
// arguments d'une ligne, un CTA. Le détail vit dans l'étude de cas Signaux
// Faibles et sur Substack.
const SIGNAUX_FAIBLES = [
  {
    titre: "Cadrée sur votre organisation",
    corps:
      "Trois questions au départ : ce qui remplit votre carnet, qui décide, ce qui menacerait l'activité à douze mois.",
  },
  {
    titre: "Une note scorée par semaine",
    corps:
      "L'écosystème et votre position concurrentielle, chaque axe noté fort, moyen ou rien à signaler.",
  },
  {
    titre: "Un espace en ligne à vous",
    corps:
      "Vos éditions, les acteurs suivis et les recommandations, sans mot de passe, lisibles hors ligne.",
  },
];

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
      "Comment ChatGPT, Perplexity et les moteurs IA citent, ou ignorent, votre site, et quoi y changer.",
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
  if (!VEILLE_PUBLISHED) notFound();
  const isEn = locale === "en";

  const breadcrumbItems = [
    { name: isEn ? "Home" : "Accueil", url: "/" },
    { name: isEn ? "AI watch agents" : "Agents de veille IA", url: "/veille" },
  ];

  return (
    <main>
      <BreadcrumbJsonLd locale={locale} items={breadcrumbItems} />
      {/* Schéma Service aligné sur le contenu visible, dans l'ordre de la page :
          Signaux Faibles, la lettre gratuite, puis les ressources et les outils. */}
      <ServiceJsonLd
        locale={locale}
        name={
          isEn
            ? "AI watch agents: Signaux Faibles and the free tech letter"
            : "Agents de veille IA : Signaux Faibles et la lettre techno gratuite"
        }
        description={
          isEn
            ? "Signaux Faibles, a weekly strategic watch scoped for your organisation (ecosystem and competitive position, each axis scored), and a free newsletter on the web & AI market. Prepared by AI agents, reviewed by a human."
            : "Signaux Faibles, une veille stratégique hebdomadaire cadrée sur votre organisation (écosystème et position concurrentielle, chaque axe scoré), et une lettre gratuite sur le marché web & IA. Préparées par des agents IA, relues par un humain."
        }
        serviceType={isEn ? "Strategic and technology watch" : "Veille stratégique et technologique"}
        url="/veille"
      />

      {/* ── Héros : les deux agents de veille ────────────────────────────── */}
      <PageHero
        index="№ 00"
        kicker="Agents de veille IA"
        backdrop={
          /* Sonar : la métaphore de la veille — balayage discret, côté droit. */
          <div className="absolute inset-y-0 right-0 w-2/3 opacity-25 lg:w-1/2">
            <Sonar className="h-full w-full" />
          </div>
        }
        title={
          <>
            Des agents de veille IA,{" "}
            <em className="font-normal not-italic text-accent-secondary">relus par un humain</em>
          </>
        }
        description={
          <>
            Signaux Faibles suit ce qui change autour de votre organisation et
            vous dit, chaque semaine, ce que ça change pour vos décisions. La
            lettre de veille techno, gratuite, suit le marché web & IA. Les agents
            lisent, je relis avant chaque envoi.
          </>
        }
        // Un seul bouton dans le héros (demande d'Agathe, 2026-09-28).
        actions={
          <Link href="/contact" className={BTN_PRIMARY}>
            Contact
          </Link>
        }
        note="Signaux Faibles, une note par semaine · lettre de veille techno gratuite"
        // Cartes à leur hauteur naturelle (sans `fill`) : colonne de droite
        // réduite, propre à ce héros.
        aside={<HeroNavCards label="Les agents de veille" cards={HERO_CARDS} />}
        // Preuve que la lettre paraît vraiment — lue sur le flux Substack à
        // chaque régénération de la page (ISR, voir revalidate). Pleine
        // largeur, sous les deux colonnes.
        below={<DerniereLettre />}
      />

      {/* ── Signaux Faibles : la veille stratégique ──────────────────────── */}
      <BlueprintSection
        id="signaux-faibles"
        className="border-t border-dark-gray"
        innerClassName="px-6 py-14 lg:px-12 lg:py-20"
      >
        <SectionHeading
          index="№ 01"
          kicker="Veille stratégique · Signaux Faibles"
          title="La veille stratégique de votre organisation"
          description="Signaux Faibles suit ce qui s'impose à votre organisation et ce que font les autres : fins de financement, obligations, concurrents, technos. Chaque semaine, une note vous dit ce qui a changé pour vos décisions."
        />

        <div className="mt-10 grid gap-px border border-dark-gray bg-dark-gray md:grid-cols-3">
          {SIGNAUX_FAIBLES.map((bloc) => (
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

        {/* Preuve : l'espace réel d'une organisation (capture de l'étude de cas). */}
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

        <p className="mt-8 max-w-2xl border-l-2 border-accent-secondary/60 pl-4 font-inter-tight text-base leading-relaxed text-foreground/80">
          Des agents IA lisent, scorent et rédigent. La première note d'une
          organisation n'atteint personne avant d'avoir été relue.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href="/contact" className={BTN_PRIMARY}>
            En parler
          </Link>
          <Link href="/etudes-de-cas/signaux-faibles" className={BTN_SECONDARY}>
            Voir l'étude de cas
          </Link>
        </div>
      </BlueprintSection>

      {/* ── La lettre de veille techno gratuite : deux rendez-vous ───────── */}
      <BlueprintSection
        id="gratuite"
        tone="jet"
        className="border-t border-dark-gray"
        innerClassName="px-6 py-14 lg:px-12 lg:py-20"
      >
        <SectionHeading
          index="№ 02"
          kicker="Lettre de veille techno · gratuite"
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

        {/* Preuve : qui tient la veille, le diplôme légitime l'offre, en ligne
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
            S'abonner, gratuit
          </a>
          <p className="font-mono text-2xs uppercase tracking-[0.14em] text-mid-gray">
            Désinscription en un clic
          </p>
        </div>
      </BlueprintSection>

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
          description="Des repères clairs pour choisir votre techno, être trouvé par les moteurs IA et lire un devis, sans devenir développeur."
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
