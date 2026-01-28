
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  CheckCircle,
  ArrowRight,
  Clock,
  Users,
  Shield,
  ArrowLeft,
} from "lucide-react";
import { CTASection } from "@/components/cta-section";
import { CMSQuizCard, PriceQuizCard } from "@/components/tools";
import Process from "@/components/process";
import { DecisionHelper } from "@/components/decision-helper";
import { ApplicationsTabs } from "@/components/applications-tabs";
import { FeaturesTabs } from "@/components/services/features";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Service de création de site web WordPress | Next Impact",
    description: "Service de création de site web WordPress pour les entreprises. Solutions adaptées aux sites corporate, institutionnels et portails d'information.",
    openGraph: {
      title: "Service de création de site web WordPress | Next Impact",
      url: "https://next-impact.digital/simulateur-tarifs",
      description: "Service de création de site web WordPress pour les entreprises. Solutions adaptées aux sites corporate, institutionnels et portails d'information.",
      type: "website",
      siteName: "Next Impact - Développeuse WordPress Freelance",
      images: [
        {
          url: "/img/avatar.webp",
          width: 1200,
          height: 630,
          alt: "Next Impact - Développeuse WordPress Freelance",
        },
      ],
    },
  };
}

const applications = [
  {
    key: "corporate",
    image: "/img/pme-homepage.webp",
    title: "Sites corporate",
    description: "Présentation d'entreprise, services, équipes",
    examples: ["Groupes industriels", "PME", "Artisans"],
  },
  {
    key: "institutionnel",
    image: "/img/tourisme.webp",
    title: "Sites institutionnels",
    description: "Collectivités, associations, fondations",
    examples: ["Mairies", "ESS", "Associations"],
  },
  {
    key: "services",
    image: "/img/rh.webp",
    title: "Sites de société de services",
    description: "Cabinets, consultants, professions libérales",
    examples: ["Avocats", "Consultants", "Médecins"],
  },
  {
    key: "portail",
    image: "/img/portail-infos.webp",
    title: "Portails d'information",
    description: "Actualités, documentation, ressources",
    examples: ["Centres de formation", "Médias", "Écoles"],
  },
];

const features = [
    {
      title: "Design sur-mesure",
      description: "Avoir un site unique sans les coûts d'un développement from scratch",
      detailedDescription:
        "Un design personnalisé qui respecte votre charte graphique et vos valeurs. Chaque site est conçu pour refléter l'identité de votre marque tout en offrant une expérience utilisateur optimale.",
      benefits: [
        "Thème personnalisé respectant votre charte graphique",
        "Responsive natif avec adaptation automatique",
        "Composants modulaires réutilisables",
      ],
      metrics: {
        improvement: "300%",
        metric: "faster load times",
      },
      color: "from-blue-500/10 to-blue-600/5",
    },
    {
      title: "Organisation des contenus dédiée",
      description: "Structurer l'information pour vos utilisateurs et les moteurs de recherche",
      detailedDescription:
        "Une architecture de site optimisée pour une navigation fluide et intuitive. La structuration personnalisée des contenus permet aux utilisateurs de trouver rapidement l'information recherchée, tout en simplifiant grandement le travail d'administration du site.",
      benefits: [
        "Architecture de l'information pensée UX et SEO",
        "Types de contenus personnalisés",
        "Gestion des contenus facilitée",
      ],
      color: "from-green-500/10 to-green-600/5",
    },
    {
      title: "Fonctionnalités personnalisées",
      description: "Intégrer des outils et services adaptés à vos besoins",
      detailedDescription:
        "Des fonctionnalités sur-mesure pour répondre aux besoins spécifiques de votre entreprise. Que ce soit des formulaires avancés, des intégrations tierces ou des outils internes, chaque site est conçu pour être fonctionnel et efficace.",
      benefits: [
        "Intégrations tierces (CRM, ERP, etc.)",
        "Formulaires avancés et automatisation",
        "Modules spécifiques à votre secteur",
      ],
      color: "from-purple-500/10 to-purple-600/5",
    },
    {
      title: "Gestion des utilisateurs",
      description: "Gérer les accès et les rôles de vos équipes",
      detailedDescription:
        "Un système de gestion des utilisateurs flexible qui permet de définir des rôles et des permissions spécifiques. Idéal pour les sites avec plusieurs contributeurs ou pour les organisations nécessitant un contrôle d'accès granulaire.",
      benefits: [
        "Rôles personnalisables (administrateurs, éditeurs, contributeurs)",
        "Accès restreint aux contenus sensibles",
        "Support multi-utilisateurs",
      ],
      color: "from-yellow-500/10 to-yellow-600/5",
    },
  ]

export default function SitesCorporate() {

  return (
    <>
      <div className="min-h-screen">

        {/* Hero Section */}
        <section className="container mx-auto px-4 md:py-16 pt-16 text-center">
          <Badge
            variant="outline"
            className="mb-4 border-regularblue/20 text-regularblue"
          >
            Solution recommandée pour 90% des projets
          </Badge>
          <h1 className="text-5xl md:text-6xl font-medium tracking-tight mb-6">
            Sites web <span className="text-regularblue">WordPress</span>
          </h1>
          <p className="text-xl text-regularblue/80 max-w-3xl mx-auto mb-8">
            WordPress traditionnel unit la gestion de contenu et
            l'affichage dans une solution intégrée et globale.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#services">
              <Button
                size="lg"
                className="gap-1 rounded-full text-white bg-regularblue/90 hover:bg-regularblue/80"
              >
                Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#tarifs">
              <Button
                size="lg"
                className="gap-1 rounded-full text-regularblue bg-extralightblue/40 hover:bg-extralightblue/30"
              >
                Tarifs
              </Button>
            </Link>
          </div>
        </section>


        {/* Applications en Tabs */}
          <section className="container mx-auto px-4 py-24">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-medium text-regularblue mb-4">
                Offre de sites web WordPress
               </h2>
              <p className="text-lg text-regularblue/80">
                Des solutions éprouvées pour tous les secteurs d'activité
              </p>
            </div>

            <ApplicationsTabs applications={applications} />
        </section>

        {/* Services Details */} 
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[1600px] left-0 h-[600px] w-[50vw] rounded-full bg-gradient-to-r from-pink-200 to-blue-200 opacity-20 blur-3xl"></div>
          <div className="absolute top-[2200px] right-0 h-[600px] w-[50vw] rounded-full bg-gradient-to-r from-blue-200 to-pink-200 opacity-10 blur-3xl"></div>
        </div>
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[1700px] left-0 h-[400px] w-[50vw] rounded-full bg-gradient-to-r from-pink-200 to-blue-200 opacity-20 blur-3xl"></div>
          <div className="absolute top-[2200px] right-0 h-[400px] w-[50vw] rounded-full bg-gradient-to-r from-blue-200 to-pink-200 opacity-10 blur-3xl"></div>
        </div>
        <section id="services" className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-medium text-regularblue mb-4">
              Nos services détaillés
            </h2>
            <p className="text-lg text-regularblue/80">
              Une approche complète pour votre réussite web
            </p>
          </div>
            <FeaturesTabs features={features} />

        </section>

        {/* Pricing */}
        <div id="pricing" className="absolute inset-0 -z-10">
          <div className="absolute top-[2600px] left-0 h-[400px] w-[50vw] rounded-full bg-gradient-to-r from-pink-400 to-blue-400 opacity-5 blur-3xl"></div>
          <div className="absolute top-[3100px] right-0 h-[400px] w-[50vw] rounded-full bg-gradient-to-r from-blue-400 to-pink-400 opacity-5 blur-3xl"></div>
        </div>
        <section id="tarifs" className="md:py-16 py-4">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-medium text-regularblue mb-4">
                Investissement transparent
              </h2>
              <p className="text-lg text-regularblue/80">
                Budgétisation claire sans surprise
              </p>
            </div>

			      <PriceQuizCard />

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="relative">
                <CardHeader>
                  <CardTitle className="text-2xl font-googletitre font-medium text-regularblue">
                    Site Vitrine
                  </CardTitle>
                  <CardDescription className="text-mediumblue">
                    Solution complète pour PME
                  </CardDescription>
                  <div className="text-3xl font-medium font-googletitre text-regularblue">
                     900€ - 1 400€
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-mediumblue">
                    {[
                      "5-10 pages optimisées",
                      "Formulaire de contact",
                      "SEO de base",
                      "Formation incluse",
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-regularblue" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href="/devis/wordpress" className="w-full">
                <Button className="w-full mt-6 rounded-full bg-regularblue hover:bg-regularblue/80">Demander un devis</Button>
                </Link>
                </CardContent>
              </Card>

              <Card className="relative border-lightblue/30 shadow-lg">
                <div className="absolute top-0 left-0 w-full h-1 bg-regularblue"></div>
                <CardHeader>
                  <Badge className="w-fit mb-4 font-medium uppercase bg-lightblue/10 text-mediumblue">
                    Populaire
                  </Badge>
                  <CardTitle className="text-2xl font-googletitre font-medium text-regularblue">
                    Site Corporate
                  </CardTitle>
                  <CardDescription className=" text-mediumblue">
                    Solution avancée pour entreprises
                  </CardDescription>
                  <div className="text-3xl font-medium text-regularblue font-googletitre">
                    1 600€ - 2 500€
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2  text-mediumblue">
                    {[
                      "Design premium personnalisé",
                      "15-30 pages structurées",
                      "Blog et actualités",
                      "SEO avancé",
                      "Intégrations tierces",
                      "Formation équipe complète",
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-regularblue" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href="/contact" className="w-full">
                <Button className="w-full mt-6 rounded-full bg-regularblue hover:bg-regularblue/80">Demander un devis</Button>
                </Link>
                </CardContent>
              </Card>

              <Card className="relative">
                <CardHeader>
                  <CardTitle className="text-2xl font-googletitre font-medium text-regularblue">
                    Portail Institutionnel
                  </CardTitle>
                  <CardDescription className="text-mediumblue">
                    Solution complète multi-niveaux
                  </CardDescription>
                  <div className="text-3xl font-medium text-regularblue font-googletitre">
                    1 800€ - 3 000€
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-mediumblue">
                    {[
                      "Architecture complexe",
                      "Multi-langues",
                      "Gestion utilisateurs",
                      "Modules spécialisés",
                      "Intégrations avancées",
                      "Support 12 mois",
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-regularblue" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href="/contact" className="w-full">
                <Button className="w-full mt-6 rounded-full bg-regularblue hover:bg-regularblue/80">Demander un devis</Button>
                </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Process */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[3000px] left-0 h-[400px] w-[50vw] rounded-full bg-gradient-to-r from-pink-400 to-blue-400 opacity-5 blur-3xl"></div>
          <div className="absolute top-[3500px] right-0 h-[400px] w-[50vw] rounded-full bg-gradient-to-r from-blue-400 to-pink-400 opacity-5 blur-3xl"></div>
        </div>
        <Process />

        {/* Decision Helper */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-[4400px] left-0 h-[400px] w-[50vw] rounded-full bg-gradient-to-r from-pink-400 to-blue-400 opacity-5 blur-3xl"></div>
            <div className="absolute top-[4900px] right-0 h-[400px] w-[50vw] rounded-full bg-gradient-to-r from-blue-400 to-pink-400 opacity-5 blur-3xl"></div>
          </div>
        <DecisionHelper />
        <CMSQuizCard />

        {/* CTA Section */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[4800px] left-0 h-[400px] w-[50vw] rounded-full bg-gradient-to-r from-pink-400 to-blue-400 opacity-5 blur-3xl"></div>
          <div className="absolute top-[5000px] right-0 h-[200px] w-[50vw] rounded-full bg-gradient-to-r from-blue-400 to-pink-400 opacity-10 blur-3xl"></div>
        </div>
        <CTASection />


      {/* Navigation */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center">
          <Link
            href="/cms-headless"
            className="inline-flex items-center text-regularblue hover:text-regularblue/80"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Choisir entre WordPress CMS et Headless
          </Link>
          <Link href="/services/headless" className="inline-flex items-center text-regularblue hover:text-regularblue/80">
            Découvrir le Headless
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>


      </div>
    </>
  );
}
