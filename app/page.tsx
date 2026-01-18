import Hero from "@/components/hero";
import ServicesSection from "@/components/services-section";
import Advantages from "@/components/advantages";
import Realisations from "@/components/case-studies/realisations";
import Testimonials from "@/components/testimonials";
import FaqSchema, { FaqItem } from "@/components/ui/FaqSchema";
import { CTASection } from "@/components/cta-section";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Logos } from "@/components/logos";
import { Main } from "next/document";
import MainVideo from "@/components/main-video";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Développeuse WordPress Freelance | Next Impact",
    description:
      "Développeuse WordPress freelance spécialisée en sites web corporate et applications web Headless. Création, refonte, audit et conseil pour des projets sur-mesure.",
    openGraph: {
      title: "Développeuse WordPress Freelance | Next Impact",
      url: "https://next-impact.digital",
      description:
        "Développeuse WordPress freelance spécialisée en sites web corporate et applications web Headless. Création, refonte, audit et conseil pour des projets sur-mesure.",
      type: "website",
      siteName: "Next Impact - Développeuse WordPress Freelance",
      images: [
        {
          url: "/img/avatar.png",
          width: 1200,
          height: 630,
          alt: "Next Impact - Développeuse WordPress Freelance",
        },
      ],
    },
  };
}

export default function Home() {
  const wordpressFeatures = [
    {
      id: "1",
      title: "Sites Vitrine",
      description:
        "Présentation de l'entreprise, services, équipes et réalisations.",
      image: "/img/tourisme-valeur.jpg?height=400&width=400",
      badge: "WordPress",
      details: [
        "Artisans et professions libérales",
        "PME et TPE",
        "Associations et ESS",
      ],
    },
    {
      id: "2",
      title: "Sites Institutionnels",
      description: "Collectivités, associations, fondations.",
      image: "/img/asso-solidarite.jpg?height=400&width=400",
      badge: "WordPress",
      details: ["Mairies", "ONG", "Établissements publics"],
    },
    {
      id: "3",
      title: "Sites Corporate",
      description: "Site vitrine et fonctionnalités complémentaires.",
      image: "/img/pme-indus-homepage.jpg",
      badge: "WordPress",
      details: [
        "PME commerciales",
        "PME industrielles",
        "Sociétés de services",
      ],
    },
    {
      id: "4",
      title: "Portails d'Information",
      description: "Actualités, documentation, ressources",
      image: "/img/portail-infos.jpg?height=400&width=600",
      badge: "WordPress",
      details: ["Centres de formation", "Médias locaux", "Portails RH"],
    },
    {
      id: "5",
      title: "Plateformes collaboratives",
      description: "Wikis, forums, intranets et extranets.",
      image: "/img/intranet.jpg?height=400&width=600",
      badge: "Headless WordPress",
      details: ["Wikis", "Forums", "Intranets et Extranets"],
    },
  ];

  {
  }

  return (
    <>
      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Logos Section */}
        <Logos className="max-w-6xl mx-auto grid gap-8" />

        {/* Détails offre */}
        <ServicesSection />

        {/* Advantages Section */}
        <section className="w-full mx-auto px-6 py-24 mt-24 mb-36 backdrop-blur-lg border-y border-yellow-100/70 bg-yellow-100/5">
          <div className="pb-12 text-center">
            <h2 className="text-4xl md:text-5xl text-regularblue mb-6 font-medium">
              Pourquoi choisir WordPress Headless ?
            </h2>
            <p className="text-xl text-regularblue/70 max-w-3xl mx-auto">
              Bénéficiez de la puissance de WordPress pour la gestion de contenu
              avec la flexibilité et la performance d'un front-end moderne en
              Next.js.
            </p>
          </div>
          <div className="max-w-5xl mx-auto">
            <MainVideo
              url="https://youtu.be/I1qi5o31Lnk"
              title="Présentation complète de la plateforme"
              poster="/modern-dashboard.png"
              infoTitle="WordPress Headless & Next.js"
              infoDescription="Découvrez le fonctionnement de WordPress Headless avec Next.js sur le cas d'une billeterie en ligne."
              ctaLink="https://calendar.app.google/HuwRpoVGoKBj2PkX8"
              ctaText="Prendre RDV en visio"
              websiteLink="https://next-event.fr"
            />
          </div>
        </section>

        {/* Realisation Section */}

        <div className="w-full mx-auto px-6 py-24 my-24 bg-white/5 backdrop-blur-lg border-y border-extralightblue/30">
          <div className="pb-12 text-center">
            <h2 className="text-4xl md:text-5xl text-regularblue mb-6 font-medium">
              Etudes de cas
            </h2>
            <p className="text-xl text-regularblue/70 max-w-3xl mx-auto">
              Chaque projet est unique et conçu pour répondre aux besoins
              spécifiques de mes clients.
            </p>
          </div>
          <Realisations count={6} />
        </div>

        {/* Testimonials Section */}
        <Testimonials />

        {/* FAQ Section */}

        <div className="w-full mx-auto px-6 py-24 my-24 bg-white/10 backdrop-blur-lg border-y border-extralightblue/30">
          <FaqSchema
            faqs={[
              {
                question:
                  "Quelle différence entre WordPress classique et WordPress Headless ?",
                answer: (
                  <>
                    WordPress classique est une solution complète avec interface
                    d'administration et affichage intégrés, idéale pour la
                    plupart des sites web traditionnels. <br />
                    <br />
                    WordPress Headless sépare le back-end (gestion de contenu)
                    du front-end (affichage), offrant plus de flexibilité et de
                    performance pour des projets complexes ou multi-plateformes.{" "}
                    <br />
                    <br />
                    Le choix dépend de vos besoins : WordPress classique pour la
                    simplicité et les coûts maîtrisés, Headless pour des
                    performances optimales et une expérience utilisateur
                    sur-mesure. Nous analyserons votre projet pour trouver
                    l'approche la plus adaptée.
                    <br />
                    <br />
                    Quizz en ligne :{" "}
                    <a
                      href="/cms-headless"
                      className="text-regularblue font-medium hover:underline"
                    >
                      {" "}
                      Choisir mon CMS
                    </a>
                    .
                  </>
                ),
              },
              {
                question: "Quels tarifs et quels délais ?",
                answer: (
                  <>
                    Les délais s'échelonnent de 3-4 semaines pour un site
                    basique à 8-12 semaines pour des projets complexes. Chaque
                    devis est personnalisé après analyse de vos besoins
                    spécifiques, du nombre de pages, des fonctionnalités
                    requises et du niveau de personnalisation. <br />
                    <br />
                    Nos tarifs varient selon la complexité :{" "}
                    <a
                      href="/simulateur-tarifs"
                      className="text-regularblue font-medium hover:underline"
                    >
                      {" "}
                      Simuler le tarif de mon site web
                    </a>
                    .
                  </>
                ),
              },
              {
                question:
                  "Comment se passe la migration vers WordPress Headless ?",
                answer: (
                  <>
                    Oui, nous réalisons des migrations complètes en préservant
                    votre SEO grâce aux redirections 301, à la conservation de
                    vos URLs et métadonnées. Toutes vos données (contenus,
                    images, utilisateurs) sont transférées et vérifiées
                    minutieusement. <br />
                    <br />
                    Nous metterons en place un plan de migration détaillé avec
                    sauvegarde complète de l'existant et tests approfondis avant
                    la mise en ligne. Le référencement est généralement
                    maintenu, voire amélioré grâce à l'optimisation technique de
                    WordPress.
                  </>
                ),
              },
              {
                question:
                  "Le site est-il optimisé pour les mobiles et le SEO ?",
                answer: (
                  <>
                    Absolument, tous nos sites sont conçus mobile-first et
                    s'adaptent parfaitement à tous les écrans (smartphones,
                    tablettes, ordinateurs). <br />
                    <br />
                    L'optimisation SEO est intégrée dès la conception :
                    structure technique optimisée, vitesse de chargement,
                    balises sémantiques, et respect des bonnes pratiques Google.
                    En utilisant des thèmes performants et du code propre pour
                    garantir une expérience utilisateur fluide sur tous les
                    appareils et en testant chaque site sur différents
                    navigateurs tout est garanti avant mise en ligne.
                  </>
                ),
              },
              {
                question:
                  "Comment modifier le contenu de mon site une fois terminé ?",
                answer: (
                  <>
                    WordPress est reconnu pour sa facilité d'utilisation : vous
                    pourrez modifier textes, images et pages via une interface
                    intuitive, sans connaissances techniques.
                    <br />
                    <br />
                    Une formation personnalisée (1h à 2h selon la complexité)
                    pour vous rendre autonome sur la gestion quotidienne est
                    incluse automatiquement. Un guide d'utilisation sur-mesure
                    vous est également fourni avec captures d'écran et vidéos.{" "}
                    <br />
                    <br />
                    Des forfaits d'heures mobilisables à la demande sont
                    disponibles pour toute assistance technique ou mise à jour
                    future.
                  </>
                ),
              },
            ]}
          />
        </div>
      </main>
    </>
  );
}
