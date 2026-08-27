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
import { Sonar } from "@/components/visuals/sonar";

// ─────────────────────────────────────────────────────────────────────────────
// Page d'offre « Veille techno » — la composante veille de l'offre globale.
//
// Elle met en regard les deux lettres :
//   – la gratuite « Quelle techno pour mon site web à l'heure de l'IA ? »
//     (Substack : une synthèse mensuelle + un focus hebdo) — le CTA froid ;
//   – Sentinelle (19 €/mois) : veille personnalisée du site ou de l'application
//     du client + aide à la décision (maintenir, refondre, créer). La page ne
//     re-vend pas tout le produit : elle renvoie vers /sentinelle (détail) et
//     /scan (entrée froide).
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
      ? "Tech watch: a free newsletter, and a personalized watch on your site"
      : "Veille techno : la lettre gratuite et la veille personnalisée de votre site",
    description: isEn
      ? "Two watch letters: a free newsletter on the web & AI market (monthly digest, weekly focus), and Sentinelle, the personalized watch on your own site. €19/month, human-reviewed before sending."
      : "Deux lettres de veille : la newsletter gratuite sur le marché web & IA (synthèse mensuelle, focus hebdo) et Sentinelle, la veille personnalisée de votre site. 19 €/mois, relue par un humain avant envoi.",
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

// Les douze axes de lecture de la lettre personnalisée, regroupés en cinq
// grands thèmes pour le héros (détail des axes : prompt actif,
// src/sentinelle/redaction/lettre-redaction-system-prompt.md).
const AXES_LETTRE = [
  "Socle technique & sécurité",
  "Visibilité & contenu",
  "Performance & expérience",
  "IA, données & conformité",
  "Coûts, prestataires & réversibilité",
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
      {/* Schéma Service aligné sur le contenu visible : les deux lettres de
          veille (gratuite + Sentinelle, tarif unique dans lib/sentinelle-offer). */}
      <ServiceJsonLd
        name={
          isEn
            ? "Tech watch: free newsletter and personalized site watch"
            : "Veille techno : lettre gratuite et veille personnalisée de votre site"
        }
        description={
          isEn
            ? "Two watch letters: a free newsletter on the web & AI market (monthly digest, weekly focus) and Sentinelle, the personalized watch on your own site (€19/month, human-reviewed before sending)."
            : "Deux lettres de veille : la newsletter gratuite sur le marché web & IA (synthèse mensuelle, focus hebdo) et Sentinelle, la veille personnalisée de votre site (19 €/mois, relue par un humain avant envoi)."
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
              personnalisée pour votre site
            </em>
          </>
        }
        description={
          <>
            Sentinelle surveille votre site et vous aide à décider — consolider,
            faire évoluer, ou refondre. La lettre gratuite suit le marché : une
            synthèse par mois, un focus par semaine.
          </>
        }
        actions={
          <>
            <Link href="/scan" className={BTN_PRIMARY}>
              Analyser mon site
            </Link>
            <a
              href={NEWSLETTER_SUBSTACK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={BTN_SECONDARY}
            >
              La lettre gratuite — Substack
            </a>
          </>
        }
        note="Sans engagement · Relu par un humain avant envoi"
      >
        {/* Les grands axes de la lettre personnalisée, en badges. */}
        <div className="mt-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-mid-gray">
            Douze axes de lecture, cinq grands thèmes
          </p>
          <ul className="mt-3 flex max-w-3xl flex-wrap gap-1.5">
            {AXES_LETTRE.map((axe) => (
              <li
                key={axe}
                className="border border-dark-gray px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-mid-gray"
              >
                {axe}
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
    </main>
  );
}
