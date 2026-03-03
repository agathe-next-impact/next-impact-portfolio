import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import {
  ServiceJsonLd,
  FAQJsonLd,
  BreadcrumbJsonLd,
} from "@/components/json-ld";
import AvantageOethClient from "@/components/avantage-oeth/AvantageOethClient";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title:
      "Réduisez votre contribution AGEFIPH avec un site web performant | Next Impact",
    description:
      "Prestataire TIH WordPress Headless : 30% du coût de main-d'œuvre déductible de votre contribution AGEFIPH. Simulateur de déduction inclus.",
    path: "/avantage-oeth",
    keywords: [
      "réduire contribution AGEFIPH sous-traitance",
      "prestataire TIH développement web",
      "déduction OETH prestation informatique",
      "sous-traitance handicap numérique",
      "TIH WordPress Headless",
      "obligation emploi travailleurs handicapés",
      "attestation déductibilité TIH",
      "AGEFIPH déduction",
    ],
  });
}

export const revalidate = 86400;

export default function AvantageOethPage() {
  const faqs = [
    {
      question: "Qu'est-ce qu'un prestataire TIH ?",
      answer:
        "Un TIH (Travailleur Indépendant Handicapé) est un indépendant disposant d'une RQTH et exerçant en Entreprise Individuelle. Depuis la loi Macron de 2016, aucun agrément n'est nécessaire.",
    },
    {
      question: "Combien puis-je déduire de ma contribution AGEFIPH ?",
      answer:
        "Vous pouvez déduire 30% du coût de main-d'œuvre des prestations facturées par un TIH, plafonné à 50% ou 75% de votre contribution brute selon votre taux d'emploi TH.",
    },
    {
      question: "Comment fonctionne l'attestation de déductibilité ?",
      answer:
        "Next Impact vous fournit une attestation annuelle conforme à l'article D.5212-7 du Code du travail, à joindre à votre déclaration OETH auprès de l'URSSAF.",
    },
    {
      question:
        "Mon entreprise a moins de 20 salariés, suis-je concerné ?",
      answer:
        "L'obligation d'emploi de 6% ne concerne que les entreprises de 20 salariés et plus. En dessous de ce seuil, la déduction TIH ne s'applique pas, mais vous bénéficiez de la même qualité de prestation.",
    },
    {
      question:
        "La déduction TIH est-elle cumulable avec d'autres actions OETH ?",
      answer:
        "Oui. La sous-traitance TIH est un levier parmi d'autres : emploi direct de TH, accueil de stagiaires handicapés, achats auprès d'EA/ESAT.",
    },
  ];

  const breadcrumbItems = [
    { name: "Accueil", url: "/" },
    { name: "Avantage OETH", url: "/avantage-oeth" },
  ];

  return (
    <main>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ServiceJsonLd
        name="Prestataire TIH — Déduction AGEFIPH sur votre site web"
        description="Next Impact est un prestataire TIH spécialisé WordPress Headless. 30% du coût de main-d'œuvre est déductible de votre contribution AGEFIPH. Attestation de déductibilité fournie."
        serviceType="Développement web — Prestataire TIH"
        url="/avantage-oeth"
      />
      <FAQJsonLd
        questions={faqs.map((faq) => ({
          question: faq.question,
          answer: faq.answer,
        }))}
      />
      <AvantageOethClient />
    </main>
  );
}
