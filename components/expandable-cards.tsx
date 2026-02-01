"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

export function ExpandableCardDemo() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative my-12 md:my-48 py-12 md:py-24 bg-mediumblue/60 backdrop-blur-lg border-y border-white/10 mb-12 px-4 md:px-8 lg:px-16">
      <div className="pb-12 md:pb-24">
        <h2 className="font-googletexte text-4xl tracking-tight text-center text-white mb-2">
          WordPress Headless :{" "}
          <span className="font-googletitre text-lightyellow text-4xl md:text-5xl font-medium">
            quelques explications ?
          </span>
        </h2>
        <p className="font-normal text-lg text-center text-white/80">
          Un site combinant performance et le back-office le plus utilisé.
        </p>
      </div>
      <ul className="max-w-6xl mx-auto w-full flex flex-col gap-12">
        {cards.map((card, idx) => (
          <li key={card.title} className="w-full">
            <button
              className="w-full p-4 flex flex-col md:flex-row justify-between items-center bg-darkblue/60 hover:bg-darkblue/50 backdrop-blur-xl rounded-xl cursor-pointer focus:outline-none border-1 border-white/20"
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              aria-expanded={openIndex === idx}
              aria-controls={`panel-${idx}`}
            >
              <div className="flex md:gap-4 flex-col md:flex-row justify-between items-center wrap w-full">
                <Image
                  width={100}
                  height={100}
                  src={card.src}
                  alt={card.title}
                  className="h-20 w-20 md:h-30 md:w-30 rounded-lg object-cover object-top hover:blur-sm transition-all duration-300"
                />
                <div className="flex flex-col items-center md:items-start justify-center flex-1">
                  <h3 className="font-medium text-lightyellow text-left text-3xl">
                    {card.title}
                  </h3>
                  <p className="text-white/70 text-base text-left">
                    {card.description}
                  </p>
                </div>
              </div>
            </button>
            <AnimatePresence initial={false}>
              {openIndex === idx && (
                <motion.div
                  id={`panel-${idx}`}
                  initial={{ height: 0, opacity: 0, scale: 0.98 }}
                  animate={{ height: "auto", opacity: 1, scale: 1 }}
                  exit={{ height: 0, opacity: 0, scale: 0.98 }}
                  transition={{
                    height: { duration: 0.35, ease: "easeInOut" },
                    opacity: { duration: 0.25 },
                    scale: { duration: 0.25 },
                  }}
                  style={{ originY: 0.1 }}
                  className="overflow-hidden bg-darkblue/50 rounded-xl shadow-inner mt-4"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="flex flex-col md:flex-row p-6 gap-6">
                      <div className="flex-1 flex flex-col justify-center min-w-0">
                        <div className="overflow-auto flex flex-col gap-4">
                          {typeof card.content === "function"
                            ? card.content()
                            : card.content}
                            {/*}
                          {card.ctaText && card.ctaLink && (
                            <a
                              href={card.ctaLink}
                              className="mt-4 self-start inline-block px-5 py-1 rounded-2xl bg-white text-lg text-darkblue font-medium shadow hover:bg-lightyellow/90 transition"
                            >
                              {card.ctaText}
                            </a>
                          )} */}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        ))}
      </ul>
    </section>
  );
}

export const ArrowTopRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 24 24"
    stroke="#021373"
    strokeWidth="2"
    className="inline-block"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7 17L17 7M7 7h10v10"
    />
  </svg>
);

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

const cards = [
  {
    description:
      "Comprendre les principes fondamentaux du Headless et comment cette architecture révolutionne la manière dont les sites web sont conçus et gérés.",
    title: "Fonctionnement du Headless",
    src: "/icons/desktop-headless-icon.svg",
    ctaText: "En savoir plus",
    ctaLink: "/wp-headless-fonctionnement",
    content: () => {
      return (
        <div className="flex flex-col gap-12">
          <div className="mb-2 text-lg text-white/80">
            Le "Headless" (ou "sans tête") est une manière moderne de concevoir
            un site web en séparant totalement deux éléments qui, auparavant,
            étaient soudés ensemble :
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            {/* Carte Backoffice */}
            <div className="flex flex-col items-center bg-darkblue/70 rounded-xl p-4 w-60 shadow-md">
              <Image
                src="/icons/dashboard-icon.svg"
                alt="Backoffice"
                width={40}
                height={40}
                className="mb-2"
              />
              <span className="font-medium text-white font-googletitre text-2xl mb-1">
                Admin WordPress
              </span>
              <span className="text-base text-white/80 text-center">
                Gestion des contenus, médias, utilisateurs...
              </span>
            </div>
            {/* Icône plugin */}
            <Image
              src="/icons/plugin-icon.svg"
              alt="Plugin"
              width={40}
              height={40}
            />
            {/* Carte Interface Visiteur */}
            <div className="flex flex-col items-center bg-darkblue/70 rounded-xl p-4 w-60 shadow-md">
              <Image
                src="/icons/desktop-headless-icon.svg"
                alt="Interface web"
                width={40}
                height={40}
                className="mb-2"
              />
              <span className="font-medium text-white font-googletitre text-2xl mb-1">
                Interface web
              </span>
              <span className="text-base text-white/80 text-center">
                Site, application, affichage public...
              </span>
            </div>
          </div>
          <div className="text-lg text-white/80">
            <div className="mb-2 font-medium text-white font-googletitre text-3xl">
              Le principe clé
            </div>
            Au lieu d'avoir un outil rigide qui fait tout, vous avez deux
            systèmes spécialisés qui communiquent entre eux. Cela permet de
            changer le design de votre site sans jamais toucher à vos données,
            ou de diffuser le même contenu sur plusieurs écrans différents
            simultanément.
          </div>
        </div>
      );
    },
  },
  {
    description:
      "Voir si le Headless est adapté à votre projet et comprendre les avantages concrets qu'il peut offrir à votre site web.",
    title: "Pourquoi choisir le Headless ?",
    src: "/icons/scan-icon.svg",
    ctaText: "En savoir plus",
    ctaLink: "/wp-headless-advantages",
    content: () => {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-lg text-white/80">
            <div className="font-googletitre text-3xl font-medium text-white">
              Le principe clé
            </div>
            <br />
            Bénéficier de l'administration de WordPress tout en offrant une
            flexibilité maximale pour l'interface client, des performances, des
            normes SEO et un sécurité optimisées.
          </div>
          {/* Carte 1 */}
          <div className="flex flex-col md:flex-row items-center bg-darkblue/70 rounded-xl p-6 shadow-md h-full">
            <Image
              src="/icons/dashboard-icon.svg"
              alt="Admin WordPress"
              width={144}
              height={144}
              className="object-contain mb-2 w-20 md:w-36"
            />
            <div className="md:ml-6 flex flex-col">
            <span className="font-medium text-white font-googletitre text-2xl mb-4">
              Admin WordPress
            </span>
            <span className="text-sm text-white/80">
              Une interface familière garantissant une adoption immédiate et
              sans coût de formation supplémentaire.
            </span>
            </div>
          </div>
          {/* Carte 2 */}
          <div className="flex flex-col md:flex-row items-center bg-darkblue/70 rounded-xl p-6 shadow-md h-full">
            <Image
              src="/icons/desktop-headless-icon.svg"
              alt="Liberté de design"
              width={144}
              height={144}
              className="object-contain mb-2 w-20 md:w-36"
            />
            <div className="md:ml-6 flex flex-col">
            <span className="font-medium text-white font-googletitre text-2xl mb-4">
              Liberté de design
            </span>
            <span className="text-sm text-white/80">
              Interface développée sur mesure, totalement libre, sans les
              limites ni la lourdeur des "page builders".
            </span>
            </div>
          </div>
          {/* Carte 5 */}
          <div className="flex flex-col md:flex-row items-center bg-darkblue/70 rounded-xl p-6 shadow-md h-full">
            <Image
              src="/icons/shield-icon.svg"
              alt="Sécurité totale"
              width={144}
              height={144}
              className="mb-4 w-20 md:w-36"
            />
            <div className="md:ml-6 flex flex-col">
            <span className="font-medium text-white font-googletitre text-2xl mb-1">
              Sécurité totale
            </span>
            <span className="text-sm text-white/80">
              Votre base de données devient invisible et inaccessible rendant
              les attaques traditionnelles impossibles.
            </span>
            </div>
          </div>
          {/* Carte 3 */}
          <div className="flex flex-col md:flex-row items-center bg-darkblue/70 rounded-xl p-6 shadow-md h-full">
            <Image
              src="/icons/speed-icon.svg"
              alt="Vitesse fulgurante"
              width={144}
              height={144}
              className="mb-4 w-20 md:w-36"
            />
            <div className="md:ml-6 flex flex-col">
            <span className="font-medium text-white font-googletitre text-2xl mb-1">
              Vitesse fulgurante
            </span>
            <span className="text-sm text-white/80">
              Chargement des pages instantané, garantissant des indicateurs de
              performance (Core Web Vitals) au vert.
            </span>
            </div>
          </div>
          {/* Carte 4 */}
          <div className="flex flex-col md:flex-row items-center bg-darkblue/70 rounded-xl p-6 shadow-md h-full">
            <Image
              src="/icons/globe-network-icon.svg"
              alt="SEO de haut niveau"
              width={144}
              height={144}
              className="mb-2 w-20 md:w-36"
            />
            <div className="md:ml-6 flex flex-col">
            <span className="font-medium text-white font-googletitre text-2xl mb-1">
              SEO de haut niveau
            </span>
            <span className="text-sm text-white/80">
              Grâce aux techniques de rendu moderne, les moteurs de recherche
              indexent votre contenu plus efficacement.
            </span>
            </div>
          </div>
        </div>
      );
    },
  },

  {
    description:
      "Voir si le Headless est adapté à votre projet et comprendre les avantages concrets qu'il peut offrir à votre site web.",
    title: "Pour quels objectifs ?",
    src: "/icons/analytics-icon.svg",
    ctaText: "Play",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => {
      return (
        <div className="flex flex-col gap-12">
          <div className="mb-2 text-lg text-white/80">
            L'architecture Headless WordPress est puissante, mais elle n'est pas
            nécessaire pour tous. Elle s'adresse aux projets où le site web est
            un moteur de croissance critique et non une simple carte de visite.
          </div>
          <div className="grid md:grid-cols-2 gap-6 place-items-center items-start">
            {/* Cartes pme */}
            <div className="col-span-1 space-y-12">
            <div className="flex flex-col gap-2 bg-mediumblue/10 rounded-xl w-full max-w-96 h-max shadow-md border border-lightyellow/20">
              <div className="w-full mb-2 px-2 py-1 rounded-t-xl bg-lightyellow text-darkblue font-googletitre font-semibold text-xl">
                PME
              </div>
              <div className="flex flex-col gap-2 px-4 pb-6">
              <div className="flex justify-end">
                <Image 
                  src="/icons/growth-icon.svg"
                  alt="Passer à l'échelle"
                  width={60}
                  height={60}
                />
              </div>
              <h4 className="font-medium text-white font-googletitre text-2xl -mt-2 mb-1">
                Passer à l'échelle
              </h4>
              <span className="text-base text-white/80 border-t-2 border-lightyellow pt-2">
                Pour répondre ou provoquer une croissance de l'activité en alignant le site web avec les objectifs commerciaux.
              </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 bg-mediumblue/10 rounded-xl w-full max-w-96 h-max shadow-md border border-lightyellow/20">
              <div className="w-full mb-2 px-2 py-1 rounded-t-xl bg-lightyellow text-darkblue font-googletitre font-semibold text-xl ">
                PME
              </div>
              <div className="flex flex-col gap-2 px-4 pb-6">
              <div className="flex justify-end">
                <Image 
                  src="/icons/saas-features-icon.svg"
                  alt="Proposer des services en ligne"
                  width={60}
                  height={60}
                />
              </div>
              <h4 className="font-medium text-white font-googletitre text-2xl -mt-2 mb-1">
                Proposer des services en ligne
              </h4>
              <span className="text-base text-white/80 border-t-2 border-lightyellow pt-2">
                Pour créer des offres en ligne ou des services associés, et renforcer l'expérience client.
              </span>
              </div>
            </div>
            </div>
            {/* Cartes ess */}
            <div className="col-span-1 space-y-12">
            <div className="flex flex-col bg-mediumblue rounded-xl w-full max-w-96 shadow-md border border-lightyellow/20">
              <div className="w-full mb-2 px-2 py-1 rounded-t-xl bg-coral text-darkblue font-googletitre font-semibold text-xl">
                ESS
              </div>
              <div className="flex flex-col gap-2 px-4 pb-6">
              <div className="flex justify-end">
                <Image 
                  src="/icons/brand-reach-icon.svg"
                  alt="Gagner en autorité"
                  width={60}
                  height={60}
                />
              </div>
              <h4 className="font-medium text-coral font-googletitre text-2xl mb-1">
                Gagner en autorité
              </h4>
              <span className="text-base text-white/80 border-t-2 border-coral pt-2">
                Développer une image forte et crédible pour attirer des soutiens, partenaires et financements.
              </span>
              </div>
            </div>
            <div className="flex flex-col bg-mediumblue rounded-xl w-full max-w-96 shadow-md border border-lightyellow/20">
              <div className="w-full mb-2 px-2 py-1 rounded-t-xl bg-coral text-darkblue font-googletitre font-semibold text-xl">
                ESS
              </div>
              <div className="flex flex-col gap-2 px-4 pb-6">
              <div className="flex justify-end">
                <Image 
                  src="/icons/eco-design-icon.svg"
                  alt="Montrer son engagement écologique"
                  width={60}
                  height={60}
                />
              </div>
              <h4 className="font-medium text-coral font-googletitre text-2xl mb-1">
                Montrer son engagement
              </h4>
              <span className="text-base text-white/80 border-t-2 border-coral pt-2">
                Réduire l'empreinte environnementale numérique avec l'écoconception.
              </span>
              </div>
            </div>
            </div>
          </div>
          <div className="text-lg text-white/80">
            <div className="mb-2 font-medium text-white font-googletitre text-3xl">
              Le principe clé
            </div>
            Idéal pour les PME et les organisations de l'ESS cherchant à
            maximiser leur impact en ligne avec un budget maîtrisé. Lié à des
            besoins de performance, sécurité et flexibilité élevés pour
            développer et soutenir la croissance et l'engagement.
          </div>
        </div>
      );
    },
  },
];
