import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { BlueprintSection, SectionHeading } from "@/components/aspect/section";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import {
  OFFER_PRICE_LABEL,
  sentinellePaymentLinkUrl,
} from "@/lib/sentinelle-offer";

// ─────────────────────────────────────────────────────────────────────────────
// Page d'offre du produit Sentinelle (19 €/mois, newsletter bimensuelle).
//
// Elle vit dans la vitrine — pas dans app/(sentinelle)/ — parce que c'est une
// page de vente : elle a besoin du header, du footer, de l'i18n et du SEO du
// site. Le groupe (sentinelle) est réservé au produit lui-même (scan, admin,
// espace client), qui est en noindex.
//
// ⚠️ AVANT_LANCEMENT : le produit n'est pas encore livré (scanner en phase 2,
// paiement en phase 5). Tant que ce drapeau est à true, la page est en noindex
// et le CTA principal renvoie vers /contact plutôt que vers un parcours qui
// n'aboutit pas.
//
// Le jour du lancement, trois gestes solidaires — les faire ensemble, sinon la
// page devient indexable sans être atteignable, ou l'inverse :
//   1. passer AVANT_LANCEMENT à false (rétablit /scan comme CTA froid) ;
//   2. ajouter l'entrée { path: "sentinelle", … } dans app/sitemap.xml/route.ts
//      (la liste y est tenue à la main, rien ne s'ajoute tout seul) ;
//   3. décider si la page entre dans la navigation du header — non fait ici,
//      cela toucherait des surfaces marketing existantes (règle 1 du pack).
// ─────────────────────────────────────────────────────────────────────────────
const AVANT_LANCEMENT = false;

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
      ? "Sentinelle — know when your website needs attention, for €19/month"
      : "Sentinelle — sachez quand votre site a besoin de vous, pour 19 €/mois",
    description: isEn
      ? "Sentinelle watches the components your WordPress site actually runs and warns you when one of them becomes a problem. Two newsletters a month, alerts when it matters, written in plain French. €19/month."
      : "Sentinelle surveille les composants que votre site utilise vraiment et vous prévient quand l'un d'eux devient un problème. Deux lettres par mois, des alertes quand ça compte, en français. 19 €/mois.",
    path: "/sentinelle",
    keywords: isEn
      ? [
          "WordPress monitoring",
          "website vulnerability alerts",
          "WordPress plugin security watch",
          "website maintenance alternative",
        ]
      : [
          "surveillance site WordPress",
          "alerte faille plugin WordPress",
          "veille sécurité site web",
          "maintenance WordPress alternative",
          "mise à jour WordPress prévenir",
        ],
    locale,
    // Contenu FR uniquement pour l'instant ; et noindex tant que le produit
    // n'est pas livrable (voir AVANT_LANCEMENT).
    noindex: isEn || AVANT_LANCEMENT,
  });
}

const CE_QUE_VOUS_RECEVEZ = [
  {
    index: "01",
    titre: "Une alerte quand ça vous concerne",
    corps:
      "Une faille est publiée chaque jour sur un plugin WordPress. La plupart ne vous concernent pas. Vous ne recevez que celles qui touchent un composant réellement installé chez vous, dans une version réellement affectée.",
  },
  {
    index: "02",
    titre: "Deux lettres par mois",
    corps:
      "Le 1er et le 15 : l'état de votre site, ce qui a changé depuis le numéro précédent, et ce qui arrive — une version qui cesse d'être maintenue, une échéance à anticiper. De quoi décider, pas de quoi s'inquiéter.",
  },
];

const CE_QUI_CHANGE = [
  {
    titre: "Un verdict, pas une liste",
    corps:
      "Vert, orange ou rouge. Vert veut dire « rien à faire » et je le dis sans détour : c'est aussi une information utile.",
  },
  {
    titre: "Écrit pour vous, pas pour un développeur",
    corps:
      "« Votre formulaire de contact », pas « le endpoint REST du plugin ». Chaque alerte dit ce que ça change concrètement chez vous.",
  },
  {
    titre: "Vous saurez si vous pouvez le faire seul",
    corps:
      "Deux clics, un quart d'heure, ou une intervention. C'est écrit à chaque fois — y compris quand la réponse est « vous n'avez besoin de personne ».",
  },
  {
    titre: "Rien ne part sans relecture",
    corps:
      "Aucune alerte n'est envoyée automatiquement. Je relis chacune avant qu'elle parte. C'est plus lent qu'un robot, et c'est le but.",
  },
];

const LIMITES = [
  "L'analyse se fonde sur les éléments publics de votre site. Elle voit ce qu'un visiteur voit, rien de plus : aucun test d'intrusion, aucune tentative d'accès.",
  "Un scan public détecte en général 50 à 70 % des extensions installées. Votre fiche est complétée avec vous à l'activation — c'est là que la surveillance devient exacte.",
  "Sentinelle prévient, elle n'intervient pas. Ce n'est ni un antivirus, ni un contrat de maintenance, ni une infogérance.",
];

export default async function SentinellePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";

  const breadcrumbItems = [
    { name: isEn ? "Home" : "Accueil", url: "/" },
    { name: "Sentinelle", url: "/sentinelle" },
  ];

  // Le bouton d'abonnement n'apparaît que si le Payment Link est réellement
  // configuré. Sinon la page bascule sur son parcours d'attente : mieux vaut
  // pas de bouton qu'un bouton mort.
  const lienPaiement = sentinellePaymentLinkUrl();

  // TODO lancement : repointer le CTA froid sur /scan quand le scanner existe
  // (phase 2). D'ici là, /contact est le seul parcours qui aboutit.
  const ctaFroid = AVANT_LANCEMENT ? "/contact" : "/scan";
  const ctaFroidLibelle = AVANT_LANCEMENT
    ? "Être prévenu du lancement"
    : "Analyser mon site — gratuit, 2 min";

  return (
    <main>
      <BreadcrumbJsonLd items={breadcrumbItems} />

      {/* ── Héros : la douleur avant le produit ─────────────────────────── */}
      <BlueprintSection ticks innerClassName="px-6 py-16 lg:px-12 lg:py-24">
        <SectionHeading
          index="№ 00"
          kicker="Sentinelle"
          title={
            <>
              Votre site vieillit{" "}
              <em className="font-normal not-italic text-accent-secondary">
                sans vous prévenir
              </em>
            </>
          }
          description="Une extension cesse d'être maintenue, une faille est publiée, une version arrive en fin de vie. Rien ne change à l'écran — jusqu'au jour où si. Sentinelle surveille les composants que votre site utilise vraiment et vous prévient quand l'un d'eux devient un problème."
        />

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href={ctaFroid}
            className="inline-flex items-center justify-center border border-accent-secondary bg-accent-secondary px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-obsidian transition-opacity hover:opacity-90"
          >
            {ctaFroidLibelle}
          </Link>
          <Link
            href="#ce-que-vous-recevez"
            className="inline-flex items-center justify-center border border-dark-gray px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-mid-gray transition-colors hover:text-foreground"
          >
            Voir ce que je reçois
          </Link>
        </div>

        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">
          19 €/mois · sans engagement · relu par un humain avant envoi
        </p>
      </BlueprintSection>

      {/* ── Ce que vous recevez : deux choses, pas dix ───────────────────── */}
      <BlueprintSection
        id="ce-que-vous-recevez"
        tone="jet"
        className="border-t border-dark-gray"
        innerClassName="px-6 py-14 lg:px-12 lg:py-20"
      >
        <SectionHeading
          index="№ 01"
          kicker="Ce que vous recevez"
          title="Deux choses, et rien d'autre"
          description="Sentinelle ne cherche pas à remplacer votre prestataire ni à remplir votre boîte mail."
        />

        <div className="mt-12 grid gap-px border border-dark-gray bg-dark-gray md:grid-cols-2">
          {CE_QUE_VOUS_RECEVEZ.map((bloc) => (
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
      </BlueprintSection>

      {/* ── La preuve : pourquoi une alerte Sentinelle est lisible ───────── */}
      <BlueprintSection
        className="border-t border-dark-gray"
        innerClassName="px-6 py-14 lg:px-12 lg:py-20"
      >
        <SectionHeading
          index="№ 02"
          kicker="Ce qui change"
          title="Une alerte qu'on peut lire sans être développeur"
          description="La plupart des outils de veille produisent une liste de CVE. Une liste de CVE ne dit pas quoi faire."
        />

        <div className="mt-12 grid gap-px border border-dark-gray bg-dark-gray sm:grid-cols-2">
          {CE_QUI_CHANGE.map((bloc) => (
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

        <p className="mt-8 max-w-2xl border-l-2 border-accent-secondary/60 pl-4 font-inter-tight text-base leading-relaxed text-foreground/80">
          En cas de doute, Sentinelle se tait. Un verdict rouge n'est envoyé que
          si votre version est réellement dans la plage affectée et que la source
          qualifie la faille de sévère. Un service de veille qui crie au loup ne
          sert plus à rien au troisième message.
        </p>
      </BlueprintSection>

      {/* ── Prix : une décision, une ligne ───────────────────────────────── */}
      <BlueprintSection
        tone="jet"
        className="border-t border-dark-gray"
        innerClassName="px-6 py-14 lg:px-12 lg:py-20"
      >
        <SectionHeading
          index="№ 03"
          kicker="Tarif"
          title="19 € par mois"
          description="Un seul tarif. Les alertes et les deux lettres mensuelles sont comprises — il n'y a pas de version supérieure à vous vendre ensuite. Résiliable à tout moment, sans préavis."
        />

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          {lienPaiement ? (
            // Lien externe vers la page de paiement Stripe : <a> et non <Link>,
            // il ne s'agit pas d'une route localisée du site.
            <a
              href={lienPaiement}
              className="inline-flex items-center justify-center border border-accent-secondary bg-accent-secondary px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-obsidian transition-opacity hover:opacity-90"
            >
              S'abonner — {OFFER_PRICE_LABEL}
            </a>
          ) : (
            <Link
              href={ctaFroid}
              className="inline-flex items-center justify-center border border-accent-secondary bg-accent-secondary px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-obsidian transition-opacity hover:opacity-90"
            >
              {ctaFroidLibelle}
            </Link>
          )}
          <Link
            href="/contact"
            className="inline-flex items-center justify-center border border-dark-gray px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-mid-gray transition-colors hover:text-foreground"
          >
            Poser une question
          </Link>
        </div>

        {lienPaiement && (
          <p className="mt-6 max-w-2xl font-inter-tight text-sm leading-relaxed text-mid-gray">
            Paiement sécurisé par Stripe. Carte bancaire ou paiement en un clic
            avec Link. L'adresse de votre site vous est demandée au moment du
            règlement : c'est elle qui déclenche la surveillance.
          </p>
        )}
      </BlueprintSection>

      {/* ── Limites : dites avant, pas après ─────────────────────────────── */}
      <BlueprintSection
        className="border-t border-dark-gray"
        innerClassName="px-6 py-14 lg:px-12 lg:py-20"
      >
        <SectionHeading
          index="№ 04"
          kicker="Ce que ce n'est pas"
          title="Les limites, dites avant"
          description="Mieux vaut les lire maintenant que les découvrir dans trois mois."
        />

        <ul className="mt-10 max-w-3xl space-y-6">
          {LIMITES.map((limite) => (
            <li
              key={limite}
              className="border-l border-dark-gray pl-5 font-inter-tight text-base leading-relaxed text-mid-gray"
            >
              {limite}
            </li>
          ))}
        </ul>
      </BlueprintSection>
    </main>
  );
}
