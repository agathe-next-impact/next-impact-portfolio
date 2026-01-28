import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MagicCard } from "./magicui/magic-card";

export default function StrategiePrix() {
  const featuredAddons = [
    {
      image: "/img/delay.webp",
      title: "Délais raccourcis",
      description:
        "L'assistance de l'IA permet de réduire considérablement les délais de design, développement et optimisation SEO.",
      price: "$29",
      period: "/month",
      features: [
        "Maquettage accéléré",
        "Création de prototypes rapide",
        "Optimisation SEO instantanée",
      ],
    },
    {
      image: "/img/budget.webp",  
      title: "Budget réduit",
      description:
        "Le gain de temps généré par l'usage de l'IA permet une réduction directe du budget alloué au développement.",
      price: "$49",
      period: "/month",
      features: [
        "Moins de ressources nécessaires",
        "Réduction des coûts de maintenance",
        "Budget prévisible et maîtrisé",
      ],
    },
    {
      image: "/img/team.webp",   
      title: "Equipe restreinte",
      description:
        "Une équipe composée de 2 à 3 personnes suffit à présent pour réaliser des projets complexes.",
      price: "$39",
      period: "/month",
      features: [
        "Un designer",
        "Un développeur",
        "Un marketeur",
      ],
    },
  ];

  const otherAddons = [
    {
      title: "Site web WordPress",
      description: "Vitrine, Corporate, Institutionnel",
      price: "à partir de 900€",
      period: "",
      image: "/img/logo-wordpress-small.webp",
      link: "/services/wordpress#tarifs",
    },
    {
      title: "Site web Headless WordPress",
      description: "Communautaire, Intranet, Application web",
      price: "à partir de 1600€",
      period: "",
      image: "/img/logo-nextjs.webp",
      link: "/services/headless#tarifs",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto py-12">
      {/* Featured Add-ons Grid */}
      <div className="mb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredAddons.map((addon, index) => (
            <Card
              key={index}
              className={`relative ${addon.popular ? "border-extralightblue/30 rounded-2xl" : "border-extralightblue/30 rounded-2xl shadow-none"}`}
            >
              <CardHeader>
                <div className="flex flex-col items-end mb-6">
                    <Image
                      src={addon.image}
                      alt={addon.title}
                      width={100}
                      height={100}
                      className="rounded-lg h-36 w-36 mb-4 object-cover"
                    />
                </div>
                <CardTitle className="text-2xl font-heading text-regularblue pb-4">{addon.title}</CardTitle>
                <CardDescription className="text-mediumblue">{addon.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {addon.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-lightblue flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Other Add-ons List */}
      <div>
        <div className="space-y-4">
          {otherAddons.map((addon, index) => (
            <MagicCard className="rounded-2xl" key={index}>
            <Card key={index} className="rounded-2xl flex justify-between">
              <CardContent className="w-full p-6">
                <div className="flex md:flex-row flex-col justify-between md:gap-0 gap-4 items-center"> 
                    <Image
                    src={addon.image}
                    alt={addon.title}
                    width={50}
                    height={50}
                    className="h-18 w-18 object-contain"
                    />
                  <div className="flex-1 ml-8 md:text-left text-center">
                    <h4 className="text-2xl text-regularblue font-medium mb-1">
                      {addon.title}
                    </h4>
                    <p className="text-mediumblue text-sm">
                      {addon.description}
                    </p>
                  </div>
                  <div className="flex md:flex-row flex-col items-center gap-4">
                    <div className="text-right">
                      <span className="text-2xl font-heading text-regularblue">{addon.price}</span>
                      <span className="text-mediumblue text-sm">
                        {addon.period}
                      </span>
                    </div>
                    <Link href={addon.link}>
                      <Button size="sm" className="rounded-full border-regularblue text-regularblue bg-extralightblue/30 hover:bg-extralightblue/40 transition-colors">
                        Voir l'offre
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
            </MagicCard>
          ))}
        </div>
      </div>
    </div>
  );
}
