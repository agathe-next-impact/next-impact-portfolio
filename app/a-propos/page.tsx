import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import PageLayout from "@/components/page-layout";
import Image from "next/image";
import {
  CheckCircle,
  Zap,
  Shield,
  Leaf,
  ArrowRight,
  Brain,
  Heart,
  Code,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/ui/count-up";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "À propos - L'alliance performance technologique & engagement durable",
    description:
      "Découvrez Next Impact : 15 ans d'engagement associatif, 8 ans de développement web. L'architecture Headless au service de l'ESS et de l'impact social.",
    path: "/a-propos",
    keywords: [
      "à propos",
      "Next Impact",
      "ESS",
      "engagement durable",
      "headless",
      "Agathe Karinthi-Martin",
    ],
  });
}

export default function AProposPage() {
  return (
    <PageLayout
      titre="A propos"
      sousTitre="L'architecture Headless au service de l'ESS et de l'impact social."
    >

      {/* Manifeste Section */}
      <section className="bg-mediumblue/60 w-full mx-auto mt-20 flex flex-col backdrop-blur-xl border-y border-white/10 md:px-6 py-16 relative">
        <div className="max-w-4xl mx-auto px-4 mb-16">
          <p className="text-lg text-white/80 font-googletexte leading-relaxed">
            Nous vivons une époque où l&apos;urgence n&apos;est plus une figure
            de style, mais une réalité quotidienne pour les acteurs de
            l&apos;environnement et de l&apos;humain. Pourtant, un fossé
            technologique absurde persiste : d&apos;un côté, des entreprises
            privées sur-équipées ; de l&apos;autre, des associations et des
            structures de l&apos;ESS qui luttent avec des outils web lents,
            vulnérables ou obsolètes.
          </p>
          <p className="text-2xl text-lightyellow font-googletitre font-medium mt-6">
            Next Impact est né pour donner à l'ESS son indispensable impact.
          </p>
        </div>

        {/* 3 Piliers du Manifeste */}
        <div className="grid grid-cols-1 gap-8 max-w-5xl mx-auto px-4">

          {/* Pilier 2 - Crédibilité */}
          <div className="flex flex-col md:flex-row border border-white/10 rounded-2xl p-8 bg-mediumblue/20 backdrop-blur-md">
            <div className="basis-1/3 flex items-center gap-3 mb-4">
              <Image
                src="/icons/brand-reach-icon.svg"
                alt="Crédibilité pour les acteurs de l'ESS"
                width={72}
                height={72}
                className="w-1/2 h-full md:w-full text-lightyellow"
              />
            </div>
            <div className="flex flex-col md:ml-12">
              <h3 className="text-xl font-googletitre font-medium text-white">
                La crédibilité, arme de survie de l'ESS
              </h3>
            <p className="text-white/70 font-googletexte leading-relaxed mb-4">
              Pour convaincre un mécène, sécuriser un partenariat ou lever des
              fonds, la robustesse technique n&apos;est pas une option. Un site
              qui crash est un don perdu.
            </p>
            <ul className="space-y-3 ml-12">
              <li className="flex items-start gap-3 text-white/80 font-googletexte">
                <CheckCircle className="h-5 w-5 text-lightyellow mt-0.5 shrink-0" />
                <span className="text-white/70">Vitesse de chargement instantanée</span>
              </li>
              <li className="flex items-start gap-3 text-white/80 font-googletexte">
                <CheckCircle className="h-5 w-5 text-lightyellow mt-0.5 shrink-0" />
                <span className="text-white/70">Sécurité inviolable pour les données des donateurs</span>
              </li>
              <li className="flex items-start gap-3 text-white/80 font-googletexte">
                <CheckCircle className="h-5 w-5 text-lightyellow mt-0.5 shrink-0" />
                <span className="text-white/70">
                  Crédibilité immédiate auprès des interlocuteurs exigeants
                </span>
              </li>
            </ul>
            </div>
          </div>

          {/* Pilier 1 - IA */}
          <div className="flex flex-col md:flex-row border border-white/10 rounded-2xl p-8 bg-darkblue/40 backdrop-blur-sm">
            <div className="basis-1/3 flex items-center gap-3 mb-4">
              <Image
                src="/icons/globe-network-icon.svg"
                alt="Crédibilité pour les acteurs de l'ESS"
                width={64}
                height={64}
                className="w-1/2 h-full md:w-full text-lightyellow"
              />
            </div>
            <div className="flex flex-col md:ml-12">
              <h3 className="text-xl font-googletitre font-medium text-white">
                Offrir l'expérience utilisateur du web actuel à l'ESS
              </h3>
            <p className="text-white/70 font-googletexte leading-relaxed mb-4">
              En automatisant le code
              répétitif et les micro-tâches, nous réduisons drastiquement les
              temps de production.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-white/80 font-googletexte">
                <CheckCircle className="h-5 w-5 text-lightyellow mt-0.5 shrink-0" />
                <span className="text-white/70">
                  Technologies &ldquo;Premium&rdquo; financièrement accessibles
                  au secteur associatif
                </span>
              </li>
              <li className="flex items-start gap-3 text-white/80 font-googletexte">
                <CheckCircle className="h-5 w-5 text-lightyellow mt-0.5 shrink-0" />
                <span className="text-white/70">
                  Un site digne des plus grands groupes, livré dans un calendrier
                  compatible avec l&apos;urgence de vos missions
                </span>
              </li>
            </ul>
            </div>
          </div>



          {/* Pilier 3 - Numérique responsable */}
          <div className="flex flex-col md:flex-row border border-white/10 rounded-2xl p-8 bg-darkblue/40 backdrop-blur-sm">
            <div className="flex basis-1/3 items-center gap-3 mb-4">
              <Image
                src="/icons/eco-design-icon.svg"
                alt="Crédibilité pour les acteurs de l'ESS"
                width={64}
                height={64}
                className="w-1/2 h-full md:w-full text-lightyellow"
              />
            </div>
            <div className="flex flex-col md:ml-12">
              <h3 className="text-xl font-googletitre font-medium text-white">
                Numérique responsable by design
              </h3>
            <p className="text-white/70 font-googletexte leading-relaxed mb-4">
              La performance business doit servir la performance écologique.
              Chaque ligne de code et chaque choix d&apos;hébergement est pensé
              pour réduire l&apos;empreinte carbone numérique.
            </p>
            <ul className="space-y-3 ml-12">
              <li className="flex items-start gap-3 text-white/80 font-googletexte">
                <CheckCircle className="h-5 w-5 text-lightyellow mt-0.5 shrink-0" />
                <span className="text-white/70">Code optimisé et léger</span>
              </li>
              <li className="flex items-start gap-3 text-white/80 font-googletexte">
                <CheckCircle className="h-5 w-5 text-lightyellow mt-0.5 shrink-0" />
                <span className="text-white/70">Hébergement éco-responsable</span>
              </li>
            </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Parcours / Histoire Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-5xl mx-auto">
          <p className="text-white/60 font-googletexte uppercase tracking-widest mb-4 text-center">
            Le parcours
          </p>
          <h2 className="text-3xl md:text-4xl font-googletitre font-medium text-white mb-4 text-center">
            De l&apos;engagement de terrain à l&apos;architecture web
          </h2>
          <p className="text-lg text-white/70 text-center mb-16 font-googletexte">
            Une boucle bouclée, entre conviction et code.
          </p>

          {/* Timeline-style parcours */}
          <div className="relative">
            {/* Ligne verticale */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-regularblue/60 via-coral/60 to-lightyellow/60" />

            {/* Étape 1 - 2005 */}
            <div className="absolute right-0 top-10 md:w-1/2 md:h-64 hidden md:flex items-center">
              <Image
                src="/img/about-nb-asso.jpg"
                alt="Engagement associatif de Next Impact"
                width={200}
                height={200}
                className="h-full w-full object-cover rounded-2xl border border-white/10"
              />              
              </div>
            <div className="relative flex flex-col md:flex-row md:items-start mb-16">
              <div className="md:w-1/2 md:pr-12 bg-mediumblue/20 backdrop-blur-md md:text-right p-4 md:pl-12 md:pl-0 border md:ml-8 border-white/10 rounded-2xl">
                <span className="inline-block text-2xl font-googletitre text-lightyellow font-medium mb-2">
                  2005 — L&apos;engagement
                </span>
                <hr className="border-white/10 my-4" />
                <h3 className="text-xl font-googletitre font-medium text-white mb-3">
                  Le choix du terrain
                </h3>
                <p className="text-white/70 font-googletexte leading-relaxed">
                  Mettre de côté une passion pour le développement
                  informatique pour plonger au cœur de l&apos;action. Pendant 15
                  ans, œuvrer dans la communication pour le secteur associatif.
                  Apprendre ce que signifie réellement &ldquo;l&apos;impact&rdquo; :
                  gestion des bénévoles, urgence des collectes de fonds, lutte
                  permanente pour la visibilité.
                </p>
              </div>
            </div>            

              

            {/* Étape 2 - Le retour au code */}
            <div className="relative flex flex-col md:flex-row md:items-start mb-16">
            <div className="absolute left-0 top-10 md:w-1/2 md:h-64 hidden md:flex items-center">
              <Image
                src="/img/about-code.jpg"
                alt="Engagement associatif de Next Impact"
                width={200}
                height={200}
                className="h-full w-full object-cover rounded-2xl border border-white/10"
              />              
              </div>
              <div className="md:w-1/2 md:pr-12 hidden md:flex md:justify-end items-center">
                <Code className="h-12 w-12 text-lightyellow/40" />
              </div>
              <div className="absolute left-2 md:left-1/2 md:-translate-x-1/2 top-0">
                <div className="h-5 w-5 rounded-full bg-regularblue border-4" />
              </div>
              <div className="md:w-1/2 md:pl-12 border md:mr-8 border-white/10 rounded-2xl bg-mediumblue/20 backdrop-blur-md p-4">
                <span className="inline-block text-2xl font-googletitre text-lightyellow font-medium mb-2">
                  2020 — Le code comme contribution
                </span>
                <hr className="border-white/10 my-4" />
                <h3 className="text-xl font-googletitre font-medium text-white mb-3">
                  De WordPress au développement sur-mesure
                </h3>
                <p className="text-white/70 font-googletexte leading-relaxed">
                  C&apos;est le terrain qui a ramené au réel de mes compétences. Face
                  aux besoins croissants des associations pour des outils web
                  performants, bâtir des solutions sur mesure. D&apos;abord au
                  coup par coup, puis de façon structurelle. De la
                  personnalisation WordPress au développement complexe de thèmes
                  et plugins.
                </p>
              </div>
            </div>

            {/* Étape 3 - Next Impact */}
            <div className="relative flex flex-col md:flex-row md:items-start">
            <div className="absolute right-0 top-10 md:w-1/2 md:h-64 hidden md:flex items-center">
              <Image
                src="/img/about-agathe.jpg"
                alt="Engagement associatif de Next Impact"
                width={200}
                height={200}
                className="h-full w-full object-cover rounded-2xl border border-white/10"
              />              
              </div>
              <div className="md:w-1/2 md:text-right md:pr-12 pl-4 border md:ml-8 border-white/10 rounded-2xl bg-mediumblue/20 backdrop-blur-md p-4">
                <span className="inline-block text-2xl font-googletitre text-lightyellow font-medium mb-2">
                  Aujourd&apos;hui — Next Impact
                </span>
                <hr className="border-white/10 my-4" />
                <h3 className="text-xl font-googletitre font-medium text-white mb-3">
                  La fusion de trois piliers
                </h3>
                <ul className="space-y-4 text-white/70 font-googletexte">
                  <li className="flex items-start gap-3 md:flex-row-reverse">
                    <span className="text-white/70">
                      <strong className="text-white">L&apos;expertise métier :</strong>{" "}
                      15 ans de com&apos; asso pour comprendre vos enjeux
                      nativement
                    </span>
                  </li>
                  <li className="flex items-start gap-3 md:flex-row-reverse">
                    <span className="text-white/70">
                      <strong className="text-white">
                        La pointe technologique :
                      </strong>{" "}
                      Architecture Headless pour offrir les performances du privé
                      au secteur de l&apos;impact
                    </span>
                  </li>
                  <li className="flex items-start gap-3 md:flex-row-reverse">
                    <span className="text-white/70">
                      <strong className="text-white">
                        L&apos;accélération par l&apos;IA :
                      </strong>{" "}
                      Solutions haut de gamme plus rapides et accessibles à ceux
                      qui en ont un besoin vital
                    </span>
                  </li>
                </ul>
              </div>
              <div className="absolute left-2 md:left-1/2 md:-translate-x-1/2 top-0">
              </div>
              <div className="md:w-1/2 md:pl-12 hidden md:flex items-center">
                <Zap className="h-12 w-12 text-lightyellow/40" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Citation */}
      <section className="bg-mediumblue/60 w-full mx-auto flex flex-col backdrop-blur-xl border-y border-white/10 md:px-6 py-16 relative">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Quote className="h-10 w-10 text-lightyellow/60 mx-auto mb-6" />
          <blockquote className="text-2xl md:text-3xl font-googletitre font-medium text-white leading-relaxed mb-6">
            &ldquo;Je ne construis pas seulement des sites web. Je forge les
            outils de survie et de développement des acteurs qui réparent le
            monde.&rdquo;
          </blockquote>
          <p className="text-lg text-white/60 font-googletexte">
            — Agathe Karinthi-Martin, Fondatrice de Next Impact
          </p>
        </div>
      </section>

      {/* Chiffres clés */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <p className="text-white/60 font-googletexte uppercase tracking-widest mb-4">
            En chiffres
          </p>
          <h2 className="text-3xl md:text-4xl font-googletitre font-medium text-white">
            Preuve par l&apos;engagement
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="border border-white/10 rounded-2xl p-8 bg-darkblue/40 backdrop-blur-sm text-center">
            <p className="text-5xl font-googletitre font-medium text-coral mb-2">
              <CountUp end={15} prefix="+" className="text-coral"/>
            </p>
            <p className="text-lg text-white/60 font-googletexte">
              ans d&apos;engagement
            </p>
          </div>
          <div className="border border-white/10 rounded-2xl p-8 bg-darkblue/40 backdrop-blur-sm text-center">
            <p className="text-5xl font-googletitre font-medium text-white/80 mb-2">
              <CountUp end={8} prefix="+" className="text-white" />
            </p>
            <p className="text-lg text-white/60 font-googletexte">
              ans de développement
            </p>
          </div>

          <div className="border border-white/10 rounded-2xl p-8 bg-darkblue/40 backdrop-blur-sm text-center">
            <p className="text-5xl font-googletitre font-medium text-lightyellow mb-2">
              <CountUp end={25} prefix="+" className="text-lightyellow"/>
            </p>
            <p className="text-lg text-white/60 font-googletexte">
              projets web livrés
            </p>
          </div>
        </div>
      </section>


    </PageLayout>
  );
}
