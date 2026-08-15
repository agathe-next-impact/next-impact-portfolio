import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { BlueprintSection, SectionHeading } from "@/components/aspect/section";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { OFFER_PRICE_LABEL } from "@/lib/sentinelle-offer";
import { NEWSLETTER_NAME, NEWSLETTER_SUBSTACK_URL } from "@/lib/newsletter";

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

const BTN_PRIMARY =
  "inline-flex items-center justify-center border border-accent-secondary bg-accent-secondary px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-obsidian transition-opacity hover:opacity-90";
const BTN_SECONDARY =
  "inline-flex items-center justify-center border border-dark-gray px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-mid-gray transition-colors hover:text-foreground";

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
      ? "Two complementary letters: a free monthly digest and weekly focus on web & AI technology, and Sentinelle, the personalized watch that helps you decide — maintain, rebuild or create — €19/month."
      : "Deux lettres complémentaires : « Quelle techno pour mon site web à l'heure de l'IA ? », gratuite — une synthèse mensuelle et un focus hebdo — et Sentinelle, la veille personnalisée qui vous aide à décider : maintenir, refondre ou créer. 19 €/mois.",
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
      "Le 1er et le 15 : l'état de votre site, ce qui a changé depuis le numéro précédent, ce qui arrive — et un avis de trajectoire : maintenir en l'état, provisionner une refonte, ou créer.",
  },
  {
    titre: "Un verdict, pas une liste",
    corps:
      "Vert, orange ou rouge, écrit pour vous : « votre formulaire de contact », pas « le endpoint REST du plugin ». Vert veut dire « rien à faire » — c'est aussi une information utile.",
  },
  {
    titre: "Relu par un humain",
    corps:
      "Aucune alerte ne part automatiquement. Je relis chacune avant l'envoi — c'est plus lent qu'un robot, et c'est le but.",
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
        valeur: "« Maintenir, refondre ou créer : que faire, et quand ? »",
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
      <BlueprintSection ticks innerClassName="px-6 py-16 lg:px-12 lg:py-24">
        <SectionHeading
          index="№ 00"
          kicker="Veille techno"
          title={
            <>
              La veille techno,{" "}
              <em className="font-normal not-italic text-accent-secondary">
                projet web et IA
              </em>
            </>
          }
          description="Les modèles IA changent tous les trimestres, les composants de votre site vieillissent, les failles se publient chaque jour. Deux lettres s'en chargent pour vous : une gratuite qui suit le marché, une personnalisée qui surveille votre site ou votre application et vous aide à décider de la suite — maintenir, refondre, ou créer. La veille n'est pas un à-côté : c'est ma formation d'origine — master Veille technologique et innovation."
        />

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={NEWSLETTER_SUBSTACK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={BTN_PRIMARY}
          >
            S'abonner à la lettre gratuite
          </a>
          <Link href="#sentinelle" className={BTN_SECONDARY}>
            Découvrir Sentinelle
          </Link>
        </div>

        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">
          La gratuite : sur Substack · Sentinelle : {OFFER_PRICE_LABEL}, sans
          engagement
        </p>
      </BlueprintSection>

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
          description="La lettre gratuite suit le marché ; Sentinelle le croise avec votre site. Vous indiquez l'adresse de votre site ou de votre application : elle identifie les composants réellement utilisés, vous prévient quand l'un d'eux devient un problème, et vous dit ce que ça change — maintenir, refondre, ou créer."
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
