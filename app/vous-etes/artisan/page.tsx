
import HeroLanding from "@/components/ui/hero-landing";
import SolutionLanding from "@/components/ui/solution-landing";
import GainsLanding from "@/components/ui/gains-landing";
import { TarifsLanding } from "@/components/ui/tarifs-landing";
import { FaqLanding } from "@/components/ui/faq-landing";
import { CTASection } from "@/components/cta-section";

export default function LandingArtisans() {

const Hero =
    {
      badgeText: "Spécial Artisans & TPE locales",
      title: "Site vitrine pour artisans",
      subtitle: "Artisans, valorisez votre savoir-faire, gagnez en visibilité et élargissez votre potentiel client.",
      buttonText: "Faire une estimation",
      buttonLink: "/devis/wordpress",
      buttonVariant: "primary",
      button2Link: "https://calendly.com/agat-dev/brief-de-creation-de-site-web-wordpress",
        button2Text: "Prendre rendez-vous",
        button2Variant: "secondary",
    }

const solution = {
    title: "Pourquoi un site vitrine quand on est artisan ?",
    subtitle: "Une vitrine de démonstration de votre savoir-faire pour attirer et convaincre de nouveaux clients.",
    imageUrl: "/img/artisan-plombier.webp",
    features: [
        "Un site professionnel qui démontre votre savoir-faire",
        "Un formulaire de contact efficace",
        "Design moderne, responsive, SEO local",
    ],
}

const gains = {
    title: "Ce que vous obtenez",
    subtitle: "Une véritable démonstration de votre savoir-faire pour attirer et convaincre de nouveaux clients.",
    landingCards: [
        {
            imageUrl: "/img/artisan-paysagiste.webp",
            title: "Démontrer la qualité de votre travail",
            text: "Mettre en avant ses réalisations pour convaincre plus rapidement",
        },
        {
            imageUrl: "/img/artisan-coiffeur.webp",
            title: "Toucher de nouveaux clients",
            text: "Elargir sa clientèle potentielle et être découvert par de nouveaux types de clients",
        },
        {
            imageUrl: "/img/artisan-ebeniste.webp",
            title: "Être visible localement sur Google",
            text: "Etre trouvé rapidement par des clients locaux ou distants",
        },
        {
            imageUrl: "/img/desktop-screen-artisan.webp",
            title: "Être contacté facilement",
            text: "Donner la possibilité à vos clients de demander vos services immédiatement",
        },
    ],
    }

const tarifs = {
    sectionTitle: "Tarifs pour un site vitrine d'artisan",
    sectionSubtitle: "Des formules adaptées à vos besoins et à votre budget.",
    offers: [
        {
            badge: "Essentiel",
            title: "Site Vitrine Essentiel",
            description: "Pour les artisans qui souhaitent une présence en ligne simple et efficace.",
            price: "À partir de 990€",
            features: [
                "Site vitrine de 3 pages",
                "Formulaire de contact",
                "Design moderne et responsive",
                "Optimisation SEO local",
            ],
            button: {
                label: "Choisir cette formule",
                href: "/devis/wordpress",
            },
            highlighted: false,
        },
        {
            badge: "Avancé",
            title: "Site Vitrine Avancé",
            description: "Pour les artisans qui veulent plus de fonctionnalités et de personnalisation.",
            price: "À partir de 1390€",
            features: [
                "Site vitrine de 5 pages",
                "Formulaire de devis",
                "Portfolio de réalisations",
                "Optimisation SEO local avancée",
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
            description: "Pour les artisans qui veulent un site complet et sur-mesure.",
            price: "À partir de 1990€",
            features: [
                "Portfolio des réalisations et pages projet",
                "Formulaire de contact personnalisé",
                "Demande de devis en ligne",
                "Optimisation SEO local complète",
            ],
            button: {
                label: "Choisir cette formule",
                href: "/devis/wordpress",
            },
            highlighted: false,
        },
    ],
}

const Faq = {
    title: "Foire aux questions",
    image: "/img/artisan-mobile.webp",
    imageAlt: "Foire aux questions pour artisans",
    questions: [
        {
            question: "Combien de temps pour créer mon site ?",
            answer: "En moyenne 2 semaines, selon la formule choisie et la disponibilité des contenus.",
        },
        {
            question: "Dois-je avoir un logo ou des textes ?",
            answer: "Si vous n’en avez pas, nous pouvons vous aider à les créer ou les améliorer.",
        },
        {
            question: "Est-ce que le site m'appartient ?",
            answer: "Oui. Vous avez 100 % de propriété sur votre site et son contenu.",
        },
        {
            question: "Est-ce que c’est bien référencé ?",
            answer: "Oui. Nous appliquons les bonnes pratiques SEO local pour que vous soyez trouvable.",
        },
        {
            question: "Puis-je modifier le site moi-même ?",
            answer: "Bien sûr. Vous aurez un accès total avec un outil simple et une formation incluse.",
        },
    ],
    }

const cta = {
    title: "Prêt à créer votre site d'artisan ?",
    description: "Obtenez une estimation ou réservez un rendez-vous pour discuter de votre projet.",
    buttonText: "Faire une estimation",
    buttonLink: "/devis/wordpress",
    buttonVariant: "primary",
    button2Text: "Prendre rendez-vous",
    button2Link: "https://calendly.com/agat-dev/brief-de-creation-de-site-web-wordpress",
    button2Variant: "secondary",
    }

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

        {/* CTA final */}
        <CTASection/>
    </div>
  );
}
