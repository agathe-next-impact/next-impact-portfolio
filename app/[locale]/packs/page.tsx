import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/json-ld";
import { BlueprintSection, SectionHeading, Separator } from "@/components/aspect/section";
import { PageHero, HERO_BTN_PRIMARY, HERO_BTN_SECONDARY } from "@/components/aspect/page-hero";
import { CtaPaire, SituationRow, VeilleBloc } from "@/components/packs/pack-parts";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { MAINTENANCE_PRIX_VALIDES } from "@/lib/maintenance-offer";
import { BESOINS, PACKS_PATH, SITUATIONS, packHref, packNom, situationsDuBesoin } from "@/lib/situations";
import { CTA_ECHANGE } from "@/lib/visio-conseil";

// Titre et description de l'index : la page et son schéma CollectionPage
// disent la même chose. La requête visée est celle de l'INDEX (« packs »,
// « budget de refonte ») : les requêtes de situation (« site WordPress lent »…)
// appartiennent à chaque page de pack.
const META_TITLE = "Offres par situation : décider, faire évoluer, agir dans la durée";
const META_DESCRIPTION =
  "Partez de votre besoin, reconnaissez votre situation : chaque parcours dit ce qui vient avant, pendant et après, avec son budget et sa veille.";

// ─────────────────────────────────────────────────────────────────────────────
// /packs : l'offre par situation (charte v1.6, ADR-014). Le visiteur part de
// son besoin, reconnaît sa situation, arrive au pack qui y répond. Trois
// besoins, sept situations, un pack par situation.
//
// Le catalogue et ses paliers restent sur /tarifs. Ici, aucune offre n'est
// nommée en titre : le titre d'une ligne est une situation. Tout vient de
// lib/situations.ts.
//
// Contenu FR uniquement (locale EN en noindex).
// ─────────────────────────────────────────────────────────────────────────────

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return generatePageMetadata({
    title: META_TITLE,
    description: META_DESCRIPTION,
    path: PACKS_PATH,
    eyebrow: "Par situation",
    keywords: [
      "offre refonte site WordPress",
      "budget refonte site internet première année",
      "refonte et maintenance site web",
      "offre site web par situation",
    ],
    locale,
    noindex: locale === "en" || !MAINTENANCE_PRIX_VALIDES,
    alternateLocales: ["fr"],
  });
}

export default async function PacksPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <BreadcrumbJsonLd
        locale={locale}
        items={[
          { name: "Accueil", url: "/" },
          { name: "Packs", url: PACKS_PATH },
        ]}
      />
      {/* La liste des six pages de pack, dans l'ordre affiché. Contenu en
          français dans les deux locales : le schéma pointe les URL françaises,
          seules indexables. Un item est une page, pas une offre : aucun prix
          n'est déclaré ici. */}
      <CollectionPageJsonLd
        locale="fr"
        name={META_TITLE}
        description={META_DESCRIPTION}
        url={PACKS_PATH}
        items={SITUATIONS.filter((s) => !s.lienExterne).map((s) => ({
          name: packNom(s, "fr"),
          url: packHref(s.slug),
          description: s.resultat.fr,
        }))}
      />

      <PageHero
        index="№ 00"
        kicker="Par situation"
        title={
          <>
            Partez de votre besoin.{" "}
            <em className="font-normal not-italic text-accent-secondary">L'offre suit votre situation</em>.
          </>
        }
        description="Trois besoins. Pour chacun, reconnaissez votre situation : elle mène au parcours qui y répond, avec ce qui vient avant, pendant et après, et son budget."
        actions={
          <>
            {/* L'échange gratuit en premier (Calendly, nouvel onglet) ; /scan vit
                hors de app/[locale]/ : balise <a>, pas le Link i18n. */}
            <a href={CTA_ECHANGE.href} target="_blank" rel="noopener noreferrer" className={HERO_BTN_PRIMARY}>
              {CTA_ECHANGE.label.fr}
              <ArrowRight size={14} />
            </a>
            <a href="/scan" className={HERO_BTN_SECONDARY}>
              Analysez votre site en 2 minutes
            </a>
          </>
        }
        note="Prix publics · Budget calculé · Veille à chaque étape"
      />

      {BESOINS.map((besoin, i) => (
        <div key={besoin.key}>
          <Separator />
          <BlueprintSection tone={i % 2 === 1 ? "jet" : undefined} id={besoin.key}>
            <div className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-14">
              <SectionHeading
                index={`№ ${besoin.index}`}
                kicker={besoin.moment.fr}
                title={<>« {besoin.phrase.fr} »</>}
                description="Laquelle de ces situations est la vôtre ?"
              />
            </div>
            {situationsDuBesoin(besoin.key).map((s) => (
              <SituationRow key={s.slug} situation={s} lang="fr" />
            ))}
          </BlueprintSection>
        </div>
      ))}

      <Separator />
      <VeilleBloc lang="fr" index="№ 04" />
      <Separator />
      <CtaPaire lang="fr" index="№ 05" />
    </main>
  );
}
