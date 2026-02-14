import HeroLanding from "@/components/ui/hero-landing";
import SolutionLanding from "@/components/ui/solution-landing";
import GainsLanding from "@/components/ui/gains-landing";
import { TarifsLanding } from "@/components/ui/tarifs-landing";
import { FaqLanding } from "@/components/ui/faq-landing";
import { CTASection } from "@/components/cta-section";

export default function LandingTourisme() {
  const Hero = {
    badgeText: "Acteurs du tourisme",
    title: "Site vitrine pour le tourisme",
    subtitle:
      "Vous êtes un musée, un parc d’activités, un lieu culturel, un camping, une base nautique ou un site patrimonial, créez la vitrine qui vous apportera une visibilité nationale",
    buttonText: "Faire une estimation",
    buttonLink: "/simulateur-tarifs",
    buttonVariant: "primary",
    button2Link:
      "https://calendly.com/agat-dev/brief-de-creation-de-site-web-wordpress",
    button2Text: "Prendre rendez-vous",
    button2Variant: "secondary",
  };

  const solution = {
    title: "Pourquoi un site web est essentiel pour les lieux touristiques ?",
    subtitle:
      "Une vitrine pour attirer avant et pendant les séjours de vacances et les week-ends dans votre région.",
    imageUrl: "/img/tourisme.webp",
    features: [
      "Visibilité locale, nationale et internationale",
      "Prévisites et histoires captivantes de votre lieu",
      "Réservation en ligne et informations pratiques",
      "Design moderne, responsive et optimisé pour le SEO local",
    ],
  };

  const gains = {
    title: "Ce que vous obtenez",
    subtitle:
      "Attirer plus de visiteurs, valoriser votre savoir-faire et développer votre activité avec un site web bien pensé",
    landingCards: [
      {
        imageUrl: "/img/tourisme-ferme.webp",
        title: "Être visible sur Google",
        text: "Être trouvé par des visiteurs potentiels avant et pendant leur séjour",
      },
      {
        imageUrl: "/img/tourisme-valeur.webp",
        title: "Mettre en valeur pour convaincre",
        text: "Permettre aux futurs visiteurs de se projeter et de choisir votre lieu",
      },
      {
        imageUrl: "/img/tourisme-infos-pratiques.webp",
        title: "Rendre les informations pratiques accessibles",
        text: "Horaires, tarifs, accès, activités proposées, tout est à portée de clic",
      },
      {
        imageUrl: "/img/tourisme-blog.webp",
        title: "Créer un lien durable",
        text: "Newsletter, réseaux, fidélisation pour créer une communauté autour de votre lieu",
      },
    ],
  };

  const tarifs = {
    sectionTitle: "Tarifs pour un site vitrine d'acteur du tourisme",
    sectionSubtitle: "Des formules adaptées à vos besoins et à votre budget.",
    offers: [
      {
        badge: "Essentiel",
        title: "Vitrine touristique",
        description:
          "Pour les acteurs du tourisme qui souhaitent une présence en ligne essentielle à leur activité.",
        price: "À partir de 1190€",
        features: [
          "Site vitrine 5 pages",
          "Infos pratiques",
          "Galerie",
          "Formulaire de contact",
          "Optimisation SEO local",
        ],
        button: {
          label: "Choisir cette formule",
          href: "/devis/wordpress",
        },
        highlighted: false,
      },
      {
        badge: "Communication",
        title: "Site Vitrine Communication",
        description:
          "Pour les acteurs du tourisme qui veulent plus de lien avec leurs visteurs.",
        price: "À partir de 1590€",
        features: [
          "Site vitrine de 5 pages",
          "Infos pratiques, galerie et localisation",
          "Détail des activités et services",
          "Blog, Newsletter et réseaux sociaux",
          "Optimisation SEO",
        ],
        button: {
          label: "Choisir cette formule",
          href: "/devis/wordpress",
        },
        highlighted: true,
      },
      {
        badge: "Premium",
        title: "Site Vitrine Premium",
        description:
          "Pour les lieux et acteurs du tourisme qui veulent un site complet et sur-mesure.",
        price: "Sur devis",
        features: [
          "Site vitrine de 10 pages",
          "Billeterie et réservation en ligne",
          "Visite virtuelle et galerie",
          "Blog, Newsletter et réseaux sociaux",
          "Optimisation SEO complète",
        ],
        button: {
          label: "Prendre rendez-vous",
          href: "https://calendly.com/agat-dev/brief-de-creation-de-site-web-wordpress",
        },
        highlighted: false,
      },
    ],
  };

  const Faq = {
    title: "Foire aux questions",
    image: "/img/tourisme-mobile.webp",
    imageAlt: "Foire aux questions pour acteurs du tourisme",
    questions: [
      {
        question: "Est-ce que je peux mettre à jour le site moi-même ?",
        answer:
          "Oui, tous les sites sont conçus avec WordPress, une interface simple vous permettant de modifier textes, images ou horaires vous-même. Une formation est incluse.",
      },
      {
        question: "Peut-on intégrer un système de réservation ou de billetterie ?",
        answer:
          "Oui. Selon votre besoin, je peux intégrer un système de réservation externe (Camping.com, OpenAgenda, BilletWeb, etc.) ou développer un formulaire sur mesure avec agenda.",
      },
      {
        question: "Est-ce que le site m'appartient ?",
        answer:
          "Oui. Vous avez 100 % de propriété sur votre site et son contenu.",
      },
      {
        question: "Mon lieu est ouvert uniquement en saison, est-ce pertinent d’avoir un site web ?",
        answer:
          "Oui. Un site vitrine bien référencé permet d’attirer des visiteurs toute l’année, préparer les visites hors saison, répondre aux journalistes ou partenaires, et améliorer votre image.",
      },
      {
        question: "Le site sera-t-il visible sur Google ?",
        answer:
          "Oui. Tous nos sites sont optimisés pour le référencement local. Vous serez visible sur Google Maps, dans les résultats de recherche (ex. : activité enfants + nom de commune), et sur mobile.",
      },
        {
            question: "Le site sera-t-il adapté aux téléphones ?",
            answer:
            "Oui, absolument. Nos sites sont responsive, c’est-à-dire qu’ils s’affichent parfaitement sur téléphone, tablette et ordinateur.",
        },
            
    ],
  };

  const cta = {
    title: "Prêt à créer votre site d'artisan ?",
    description:
      "Obtenez une estimation ou réservez un rendez-vous pour discuter de votre projet.",
    buttonText: "Faire une estimation",
    buttonLink: "/devis/wordpress",
    buttonVariant: "primary",
    button2Text: "Prendre rendez-vous",
    button2Link:
      "https://calendly.com/agat-dev/brief-de-creation-de-site-web-wordpress",
    button2Variant: "secondary",
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <HeroLanding
        badgeText={Hero.badgeText}
        title={Hero.title}
        subtitle={Hero.subtitle}
        buttonText={Hero.buttonText}
        buttonLink={Hero.buttonLink}
        buttonVariant={Hero.buttonVariant}
      />

      {/* Pourquoi un site vitrine */}
      <SolutionLanding
        title={solution.title}
        subtitle={solution.subtitle}
        imageUrl={solution.imageUrl}
        features={solution.features}
      />

      {/* Solution*/}

      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[1000px] left-0 h-[600px] w-[50vw] rounded-full bg-gradient-to-r from-pink-200 to-blue-200 opacity-20 blur-3xl"></div>
        <div className="absolute top-[1600px] right-0 h-[600px] w-[50vw] rounded-full bg-gradient-to-r from-blue-200 to-pink-200 opacity-10 blur-3xl"></div>
      </div>
      <GainsLanding
        title={gains.title}
        subtitle={gains.subtitle}
        landingCards={gains.landingCards}
      />

      {/* Tarifs */}
      <TarifsLanding
        sectionTitle={tarifs.sectionTitle}
        sectionSubtitle={tarifs.sectionSubtitle}
        offers={tarifs.offers}
      />

      {/* FAQ */}

      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[2000px] left-0 h-[600px] w-[50vw] rounded-full bg-gradient-to-r from-pink-200 to-blue-200 opacity-20 blur-3xl"></div>
        <div className="absolute top-[2600px] right-0 h-[600px] w-[50vw] rounded-full bg-gradient-to-r from-blue-200 to-pink-200 opacity-10 blur-3xl"></div>
      </div>
      <FaqLanding
        title={Faq.title}
        image={Faq.image}
        imageAlt={Faq.imageAlt}
        items={Faq.questions}
      />

      {/* CTA */}
      <CTASection />
    </div>
  );
}
