import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { BlueprintSection, SectionHeading } from "@/components/aspect/section";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

// Page utilitaire (E-E-A-T / RGPD) — noindex comme les mentions légales. Corps en
// français (juridiction FR), méta/en-têtes localisés. Politique SPÉCIFIQUE au site :
// formulaires (contact/audit) + mesure d'audience GA4 & Microsoft Clarity.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return generatePageMetadata({
    title: isEn ? "Privacy policy" : "Politique de confidentialité",
    description: isEn
      ? "How Next Impact Digital collects and processes your personal data (contact and audit forms, audience measurement, Sentinelle monitoring service), and your GDPR rights."
      : "Comment Next Impact Digital collecte et traite vos données personnelles (formulaires de contact et d'audit, mesure d'audience, service de veille Sentinelle) et vos droits RGPD.",
    path: "/confidentialite",
    noindex: true,
    locale,
  });
}

const PROSE = [
  "max-w-3xl font-inter-tight text-base leading-relaxed text-mid-gray",
  "[&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:font-sans [&_h2]:text-2xl [&_h2]:font-light [&_h2]:tracking-tight [&_h2]:text-foreground md:[&_h2]:text-3xl",
  "[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-sans [&_h3]:text-lg [&_h3]:font-medium [&_h3]:tracking-tight [&_h3]:text-foreground md:[&_h3]:text-xl",
  "[&_p]:my-4 [&_p]:leading-relaxed",
  "[&_strong]:text-foreground [&_b]:text-foreground",
  "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_li]:leading-relaxed",
  "[&_a]:text-accent-secondary [&_a]:underline-offset-4 hover:[&_a]:underline [&_a]:break-words",
].join(" ");

export default async function PrivacyPolicy({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";

  const breadcrumbItems = [
    { name: isEn ? "Home" : "Accueil", url: "/" },
    {
      name: isEn ? "Privacy policy" : "Politique de confidentialité",
      url: "/confidentialite",
    },
  ];

  return (
    <main>
      <BreadcrumbJsonLd items={breadcrumbItems} />

      <BlueprintSection ticks innerClassName="px-6 py-14 lg:px-12 lg:py-20">
        <SectionHeading
          index="№ 00"
          kicker={isEn ? "Privacy" : "Confidentialité"}
          title={isEn ? "Privacy policy" : "Politique de confidentialité"}
        />
      </BlueprintSection>

      <BlueprintSection
        className="border-t border-dark-gray"
        innerClassName="px-6 py-12 lg:px-12 lg:py-16"
      >
        <div id="confidentialite" className={PROSE}>
          <p className="mb-8 border-l-2 border-accent-secondary/60 pl-4 italic text-foreground/80">
            Cette politique décrit quelles données personnelles Next Impact Digital
            (EI Agathe Karinthi-Martin) collecte sur ce site, pourquoi, et comment
            exercer vos droits. Elle complète les{" "}
            <Link href="/mentions-legales">mentions légales</Link>.
          </p>

          <h2>1. Responsable du traitement</h2>
          <p>
            Le responsable du traitement est <strong>Agathe Karinthi-Martin</strong>{" "}
            (entreprise individuelle, SIREN 532 675 386), 4 rue du centre, 15400 Trizac,
            France. Contact / délégué à la protection des données :{" "}
            <a href="mailto:agathe@next-impact.digital">agathe@next-impact.digital</a>.
          </p>

          <h2>2. Données collectées et finalités</h2>
          <p>Je collecte uniquement les données nécessaires aux finalités suivantes :</p>
          <ul>
            <li>
              <strong>Formulaire de contact et demande d'audit gratuit</strong> : nom,
              adresse email, entreprise (facultatif), URL de votre site et message. Ces
              données servent à vous répondre, réaliser l'audit demandé et, le cas
              échéant, établir un devis.
            </li>
            <li>
              <strong>Mesure d'audience</strong> : statistiques de visite (pages vues,
              parcours, type d'appareil) via <strong>Google Analytics 4</strong> et{" "}
              <strong>Microsoft Clarity</strong>, pour comprendre et améliorer le site.
            </li>
          </ul>

          <h2>3. Base légale</h2>
          <p>
            Les données des formulaires sont traitées sur la base de votre demande
            (mesures précontractuelles) et de mon intérêt légitime à répondre aux
            prospects. La mesure d'audience repose sur l'intérêt légitime à améliorer le
            site, et le cas échéant sur votre consentement.
          </p>

          <h2>4. Destinataires et sous-traitants</h2>
          <p>
            Vos données ne sont <strong>ni vendues ni cédées</strong>. Elles sont
            traitées par moi seule et par des sous-traitants techniques présentant des
            garanties conformes au RGPD : <strong>Vercel</strong> (hébergement),{" "}
            <strong>Google</strong> (Analytics) et <strong>Microsoft</strong> (Clarity).
            Certains de ces prestataires peuvent traiter des données hors UE, avec les
            garanties appropriées (clauses contractuelles types). Le service Sentinelle a
            ses propres sous-traitants, listés au §8.3.
          </p>

          <h2>5. Durée de conservation</h2>
          <ul>
            <li>Données de prospect / contact : jusqu'à 3 ans après le dernier échange.</li>
            <li>Mesure d'audience : durée limitée, de l'ordre de 14 mois.</li>
          </ul>

          <h2>6. Vos droits</h2>
          <p>
            Conformément au RGPD, vous disposez des droits d'accès, de rectification,
            d'effacement, d'opposition, de limitation, de portabilité et de retrait du
            consentement à tout moment. Pour les exercer, écrivez à{" "}
            <a href="mailto:agathe@next-impact.digital">agathe@next-impact.digital</a>.
            Vous pouvez également introduire une réclamation auprès de la{" "}
            <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer">
              CNIL
            </a>
            .
          </p>

          <h2>7. Cookies et mesure d'audience</h2>
          <p>
            Le site dépose des cookies de mesure d'audience (Google Analytics 4,
            Microsoft Clarity). Vous pouvez à tout moment refuser ou supprimer ces
            cookies via les réglages de votre navigateur. Le détail de la gestion des
            cookies figure dans les{" "}
            <Link href="/mentions-legales">mentions légales</Link>.
          </p>

          <h2>8. Sentinelle — diagnostic technique et surveillance</h2>
          <p>
            <strong>Sentinelle</strong> est le service de veille technique de Next Impact
            Digital. Il donne lieu à deux traitements distincts, décrits ici parce qu'ils
            ne relèvent ni des formulaires ni de la mesure d'audience.
          </p>

          <h3>8.1 Diagnostic à la demande (page d'analyse)</h3>
          <p>
            Quand vous demandez l'analyse d'un site, j'enregistre l'adresse analysée, le
            résultat technique (composants publiquement détectables et leurs versions), la
            date, ainsi qu'une <strong>empreinte de votre adresse IP</strong> et votre
            navigateur — uniquement pour empêcher l'usage abusif de l'outil. L'adresse IP
            elle-même n'est jamais stockée : seul un condensé irréversible l'est. Si vous
            laissez votre adresse e-mail pour recevoir le rapport, elle est conservée avec
            l'analyse. <strong>Base légale</strong> : mesure précontractuelle, à votre
            demande, et intérêt légitime à protéger l'outil des abus. L'analyse ne lit que
            ce que votre site sert publiquement : aucun test d'intrusion, aucune tentative
            d'accès.
          </p>

          <h3>8.2 Surveillance contractuelle (abonnement)</h3>
          <p>
            Pour un abonné, je conserve la fiche client (nom, e-mail, société, adresse du
            site, secteur, notes d'échange) et l'inventaire technique du site surveillé,
            ainsi que les alertes et les lettres d'information produites.{" "}
            <strong>Base légale</strong> : exécution du contrat. L'inventaire technique
            d'un site est une donnée sensible en soi — c'est ce qu'un attaquant voudrait :
            il ne sort jamais de la base, n'est jamais archivé « au cas où », et il est
            supprimé à la résiliation dans le délai indiqué ci-dessous.
          </p>

          <h3>8.3 Accès à votre espace abonné</h3>
          <p>
            L'espace abonné n'utilise <strong>pas de mot de passe</strong> : vous demandez
            un lien de connexion, il vous est envoyé à l'adresse de votre abonnement. Ce
            lien est valable <strong>quinze minutes</strong>, ne fonctionne{" "}
            <strong>qu'une seule fois</strong>, et n'est pas conservé tel quel : seule une
            empreinte irréversible est stockée, supprimée dès que le lien a servi ou qu'il
            a expiré. Une fois connecté, un cookie technique garde votre session ouverte
            30 jours ; il ne sert qu'à ça et ne mesure rien.{" "}
            <strong>Base légale</strong> : exécution du contrat.
          </p>

          <h3>8.4 Sous-traitants propres à Sentinelle</h3>
          <p>
            <strong>Neon</strong> (base de données, UE), <strong>Inngest</strong>{" "}
            (exécution des tâches planifiées), <strong>Google</strong> (envoi des e-mails
            de veille), <strong>Anthropic</strong> (rédaction assistée des alertes) et{" "}
            <strong>Stripe</strong> (paiement et facturation). Deux précisions qui me
            semblent devoir être écrites plutôt que sous-entendues : le modèle de langage
            qui aide à rédiger une alerte <strong>ne reçoit jamais votre nom ni votre
            adresse e-mail</strong> — il travaille sur le fait technique, le secteur et le
            contexte du site ; et aucune donnée de facturation ne descend dans la base
            Sentinelle, elle reste chez Stripe.
          </p>

          <h3>8.5 Durées de conservation</h3>
          <ul>
            <li>Empreinte d'IP et navigateur d'une analyse : <strong>24 heures</strong>.</li>
            <li>
              Analyse sans adresse e-mail laissée : <strong>30 jours</strong>, puis
              suppression complète.
            </li>
            <li>
              Résultat technique d'une analyse identifiée : <strong>12 mois</strong> ; un
              état technique d'il y a un an n'a plus de valeur.
            </li>
            <li>
              Adresse e-mail laissée sur un rapport : <strong>3 ans</strong> après le
              dernier échange — même régime que le formulaire de contact.
            </li>
            <li>
              Fiche client et inventaire technique : <strong>3 mois</strong> après la
              résiliation (fenêtre de réactivation), puis effacement.
            </li>
            <li>
              Textes des alertes et des lettres d'information : <strong>12 mois</strong>{" "}
              après la résiliation, comme preuve de la prestation rendue, puis effacement.
              Ne subsistent alors que des données sans lien avec une personne.
            </li>
            <li>
              Liens de connexion à l'espace abonné : <strong>15 minutes</strong>, stockés
              sous forme d'empreinte, supprimés dès l'usage.
            </li>
            <li>Facturation : <strong>10 ans</strong>, chez Stripe (obligation comptable).</li>
          </ul>
          <p>
            Ces durées sont appliquées par une purge automatique quotidienne, pas
            seulement annoncées ici. Un point d'honnêteté : les sauvegardes de la base
            survivent quelques jours à une suppression, l'effacement est donc{" "}
            <strong>effectif sous 7 jours</strong>. Pour demander l'effacement de vos
            données avant l'échéance, écrivez à{" "}
            <a href="mailto:agathe@next-impact.digital">agathe@next-impact.digital</a> : la
            suppression est faite à réception.
          </p>
          <p>
            Enfin, les pages de Sentinelle (analyse, espace abonné) ne chargent{" "}
            <strong>ni Google Analytics ni Microsoft Clarity</strong> : vous n'y êtes pas
            mesuré.
          </p>

          <h2>9. Contact</h2>
          <p>
            Pour toute question relative à vos données :{" "}
            <a href="mailto:agathe@next-impact.digital">agathe@next-impact.digital</a>.
          </p>
        </div>
      </BlueprintSection>
    </main>
  );
}
