"use client";

import { ExpandableCardNIP } from "@/components/conseil/expandable-cards";
import Image from "next/image";

export default function Tools() {
  const ConseilSkills = [
    {
      title: "Accompagnement",
      description: (
        <>
          <span className="uppercase font-googletitre text-xl">
            CREATION ET REFONTE
          </span>
          <br />
          <br />
          <div className="col-span-6 flex flex-col justify-center gap-3 pt-4">
            <div className="flex items-center">
              <Image
                src="/img/meet.gif"
                alt="Meeting animation"
                width={20}
                height={20}
                className="mr-3 text-primary"
              />
              <span className="font-googletitre text-lg">
                4 sessions vidéo de 30 minutes
              </span>
            </div>
            <div className="flex items-center">
              <Image
                src="/img/settings.gif"
                alt="Analyse du besoin animation"
                width={20}
                height={20}
                className="mr-3 text-primary"
              />
              <span className="font-googletitre text-lg">
                Analyse approfondie du besoin
              </span>
            </div>
            <div className="flex items-center">
              <Image
                src="/img/tools.gif"
                alt="Audit animation"
                width={20}
                height={20}
                className="mr-3 text-primary"
              />
              <span className="font-googletitre text-lg">
                Audit du site actuel
              </span>
            </div>
            <div className="flex items-center">
              <Image
                src="/img/folder.gif"
                alt="Cahier des charges animation"
                width={20}
                height={20}
                className="mr-3 text-primary"
              />
              <span className="font-googletitre text-lg">
                Formalisation d'un cahier des charges
              </span>
            </div>
            <div className="flex items-center">
              <Image
                src="/img/code.gif"
                alt="Solution technique animation"
                width={20}
                height={20}
                className="mr-3 text-primary"
              />
              <span className="font-googletitre text-lg">
                Conseil sur la solution technique
              </span>
            </div>
          </div>
        </>
      ),
    },
  ];
  const cards = [
    {
      description: "TEST EN LIGNE",
      title: "Choisir entre WordPress CMS et Headless ?",
      lottie: "/img/quiz-cms.webp",
      ctaText: "Test en ligne",
      ctaLink: "/documentation/wordpress-headless",
      content: `
      <p>
        Outil diagnostique en ligne gratuit qui analyse votre projet de site web
        dans ses aspects techniques, ergonomiques et marketing pour déterminer
        si la solution la plus appropriée est un WordPress natif ou un WordPress
        Headless.
      </p>
      `, // Using template literals for multiline content
    },
    {
      description: "GENERER GRATUITEMENT",
      title: "Rédiger mon cahier des charges",
      lottie: "/img/cdc.webp",
      ctaText: "Générateur en ligne",
      ctaLink: "/cahier-des-charges",
      content: `
      <p>
        Solution de génération de livrable gratuite et en ligne pour structurer
        et formaliser méthodiquement votre projet digital de leur conception à
        leur livraison <br />
        <br />
        En guidant l'utilisateur à travers des questions ciblées et
        personnalisables, il transforme vos besoins métiers en spécifications
        techniques précises, complètes et exploitables par tous les acteurs du
        projet.
      </p>`,
    },
    {
      description: "SIMULER MON BUDGET",
      title: "Tarifs courants selon projet et prestataire ?",
      lottie: "/img/simulateur-tarifs.webp",
      ctaText: "Simulateur",
      ctaLink: "/tarifs",
      content: `
      <p>
        Simulateur en ligne et gratuit qui calcule instantanément le coût précis
        de votre projet digital en fonction de vos besoins.
        <br />
        <br />
        Cet outil stratégique aide les décideurs à optimiser leur budget en
        visualisant l'impact financier de chaque choix technique..
      </p>
      `, // Using template literals for multiline content
    },
  ];

  return (
    <>
      {/* Tools section */}
      <section className="py-12 md:px-16 px-0 md:py-12 lg:py-24">
        <div className="pb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-regularblue mb-6">
            Outils gratuits en ligne
                      </h2>
          <p className="text-xl text-regularblue/70 max-w-3xl mx-auto">
            Pour savoir, décider et agir sereinement
          </p>
        </div>
        <div className="flex justify-center align-center px-4 md:px-6 my-16">
          <ExpandableCardNIP cards={cards} />
        </div>
      </section>
    </>
  );
}

export function CMSQuizCard() {
  const tool = [
    {
      description: "TESTER EN LIGNE",
      title: "Choisir entre WordPress CMS et Headless ?",
      lottie: "/img/quiz-cms.webp",
      ctaText: "Test en ligne",
      ctaLink: "/documentation/wordpress-headless",
      content: `
      <p>
        Outil diagnostique en ligne gratuit qui analyse votre projet de site web
        dans ses aspects techniques, ergonomiques et marketing pour déterminer
        si la solution la plus appropriée est un WordPress natif ou un WordPress
        Headless.
      </p>
      `, // Using template literals for multiline content
    },
  ];
  return (
    <div className="flex justify-center align-center px-4 md:px-6 mb-24">
      <ExpandableCardNIP cards={tool} />
    </div>
  );
}

export function PriceQuizCard() {
  const tool = [
       {
      description: "SIMULER MON BUDGET",
      title: "Tarifs courants selon projet et prestataire ?",
      lottie: "/img/simulateur-tarifs.webp",
      ctaText: "Simulateur",
      ctaLink: "/tarifs",
      content: `
      <p>
        Simulateur en ligne et gratuit qui calcule instantanément le coût précis
        de votre projet digital en fonction de vos besoins.
        <br />
        <br />
        Cet outil stratégique aide les décideurs à optimiser leur budget en
        visualisant l'impact financier de chaque choix technique..
      </p>
      `, // Using template literals for multiline content
    },
  ];
  return (
    <div className="flex justify-center align-center px-4 md:px-6 my-16">
      <ExpandableCardNIP cards={tool} />
    </div>
  );
}

export function CDCCard() {
  const tool = [
          {
      description: "GENERER GRATUITEMENT",
      title: "Rédiger mon cahier des charges",
      lottie: "/img/cdc.webp",
      ctaText: "Générer",
      ctaLink: "/cahier-des-charges",
      content: `
      <p>
        Solution de génération de livrable gratuite et en ligne pour structurer
        et formaliser méthodiquement votre projet digital de leur conception à
        leur livraison <br />
        <br />
        En guidant l'utilisateur à travers des questions ciblées et
        personnalisables, il transforme vos besoins métiers en spécifications
        techniques précises, complètes et exploitables par tous les acteurs du
        projet.
      </p>`,
    },
  ];
  return (
    <div className="flex justify-center align-center px-4 md:px-6 my-16">
      <ExpandableCardNIP cards={tool} />
    </div>
  );
}
