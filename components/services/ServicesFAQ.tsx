import FaqSchema from "./FaqSchema";

export default function ServicesFAQ({ faqs }: { faqs: { question: string; answer: React.ReactNode }[] }) {
  return (
    <main className="w-full">
    <FaqSchema
      faqs={faqs}
      title="Questions fréquentes"
      description="Quelques réponses aux questions les plus courantes sur les solutions."
      sectionId="solutions-faq"
    />
    </main>
  );
}
