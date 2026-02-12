"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
const slides = [
  {
    id: 1,
    badge: "L'Excellence Technique pour la Solidarité",
    title: "Pour tous être acteurs de l'impact",
    content: (
      <div className="space-y-6">
        <p className="text-base sm:text-lg text-white/70 font-googletexte leading-relaxed">
          Dans un contexte de raréfaction des financements, la crédibilité de
          l'ESS et des associations devient un enjeu de survie.
        </p>
          <p className="text-base sm:text-lg font-googletexte text-white/80">
            Nous créons des{" "}
            <span className="text-lightyellow">
              Web Apps et plateformes Headless
            </span>{" "}
            qui allient éthique sociale et standards de performance des géants
            de la Tech.
          </p>
        <div className="bg-white/5 p-4 sm:p-6 rounded-2xl border-l-4 border-lightyellow text-lightyellow md:text-lg">
            Acteurs de l'ESS :<span className="text-white"> Tarifs solidaires</span>
        </div>
        <div className="bg-white/5 p-4 sm:p-6 rounded-2xl border-l-4 border-lightyellow text-lightyellow md:text-lg">
          Entreprises :<span className="text-white"> Soutien à l'impact social, solidaire et environnemental pour les entreprises</span>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    badge: "La Technologie comme Rempart à la Crise",
    title: "Le « petit site associatif » est devenu un risque",
    content: (
      <div>
        <div className="space-y-3 text-base sm:text-lg text-white/70 font-googletexte leading-relaxed">
          <p className="text-white/70">
            Face à la crise des financements,{" "}
            un site lent, buggé ou daté est un frein majeur.
          </p>
        </div>
        <div className="bg-white/5 p-4 sm:p-6 rounded-2xl mt-4 sm:mt-6">
          <h4 className="text-lg sm:text-xl font-googletitre font-medium text-lightyellow mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-coral" /> La Solution
          </h4>
          <p className="text-base sm:text-lg text-white/80 font-googletexte leading-relaxed">
            Le passage au{" "}
            <span className="text-lightyellow">
              WordPress Headless
            </span>{" "}
            n&apos;est pas qu&apos;un choix technique,
            <strong className="text-white">
              {" "}
              c&apos;est un choix politique
            </strong>
            .
          </p>
          <p className="text-white/60 font-googletexte">
            C&apos;est offrir à vos partenaires une preuve tangible de votre
            professionnalisme, de votre transparence et de votre capacité à
            innover.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    badge: "Digitaliser vos Services",
    title: "De la vitrine à la Web app",
    content: (
      <div className="space-y-6">
        <div className="grid gap-4">
          <div className="bg-white/5 p-3 sm:p-5 rounded-2xl border-l-4 border-lightyellow hover:scale-[1.02] transition-transform">
            <h4 className="font-googletitre font-medium text-lightyellow mb-1 sm:mb-2 flex items-center gap-2 md:text-lg">
              Interface répondant aux standards de la Tech
            </h4>
            <p className="text-white/70 font-googletexte md:text-lg">
              Design moderne, navigation fluide, et intégration d&apos;APItierces pour enrichir l&apos;expérience utilisateur
            </p>
          </div>
          <div className="bg-white/5 p-3 sm:p-5 rounded-2xl border-l-4 border-lightblue hover:scale-[1.02] transition-transform">
            <h4 className="font-googletitre font-medium text-lightyellow mb-1 sm:mb-2 flex items-center gap-2 md:text-lg">
              Services en ligne à forte valeur ajoutée
            </h4>
            <p className="text-white/70 font-googletexte md:text-lg">
              Espaces membres, services en ligne sur-mesure et fonctionnalités dynamiques
            </p>
          </div>
          <div className="bg-white/5 p-3 sm:p-5 rounded-2xl border-l-4 border-lightblue hover:scale-[1.02] transition-transform">
            <h4 className="font-googletitre font-medium text-lightyellow mb-1 sm:mb-2 flex items-center gap-2 md:text-lg">
              Expérience « App »
            </h4>
            <p className="text-white/70 font-googletexte md:text-lg">
              Rapidité, Fluidité totale (Next.js), mode hors-ligne pour le terrain, et
              sécurité absolue des données sensibles
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    badge: "Pourquoi le Headless sauve votre budget ?",
    title: "Comparatif",
    content: (
      <div className="space-y-4">
        {/* Table desktop/tablette */}
        <div className="hidden sm:block overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-darkblue/60 text-lightyellow">
                <th className="p-3 md:p-4 text-left font-googletitre font-medium text-base">
                  Enjeu
                </th>
                <th className="p-3 md:p-4 text-left font-googletitre font-medium text-base">
                  WordPress Classique
                </th>
                <th className="p-3 md:p-4 text-left font-googletitre font-medium text-base">
                  Web App Headless
                </th>
              </tr>
            </thead>
            <tbody className="font-googletexte text-white/80 text-base">
              <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                <td className="p-3 md:p-4 text-lightyellow">
                  Crédibilité
                </td>
                <td className="p-3 md:p-4 text-white/70">
                  Image « bricolée », lenteurs
                </td>
                <td className="p-3 md:p-4 text-white/90">
                  Image innovante, fluidité « Premium »
                </td>
              </tr>
              <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                <td className="p-3 md:p-4 text-lightyellow">
                  Évolutivité
                </td>
                <td className="p-3 md:p-4 text-white/70">Limité par les plugins</td>
                <td className="p-3 md:p-4 text-white/90">
                  Possibilités infinies (Web App métier)
                </td>
              </tr>
              <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                <td className="p-3 md:p-4 text-lightyellow">
                  Coût Long Terme
                </td>
                <td className="p-3 md:p-4 text-white/70">
                  Maintenance lourde et refontes fréquentes
                </td>
                <td className="p-3 md:p-4 text-white/90">
                  Architecture pérenne et ultra-sécurisée
                </td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-3 md:p-4 text-lightyellow">
                  Impact Éco
                </td>
                <td className="p-3 md:p-4 text-white/70">
                  Consommation serveur élevée
                </td>
                <td className="p-3 md:p-4 text-white/90">
                  Sobriété numérique (Statique/Edge)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* Cards mobile */}
        <div className="sm:hidden space-y-3">
          {[
            { enjeu: "Crédibilité", wp: "Image « bricolée », lenteurs", headless: "Image innovante, fluidité « Premium »" },
            { enjeu: "Évolutivité", wp: "Limité par les plugins", headless: "Possibilités infinies (Web App métier)" },
            { enjeu: "Coût Long Terme", wp: "Maintenance lourde et refontes fréquentes", headless: "Architecture pérenne et ultra-sécurisée" },
            { enjeu: "Impact Éco", wp: "Consommation serveur élevée", headless: "Sobriété numérique (Statique/Edge)" },
          ].map((row) => (
            <div key={row.enjeu} className="bg-white/5 rounded-xl p-4 space-y-2">
              <p className="text-lightyellow font-googletitre font-medium text-base">{row.enjeu}</p>
              <div className="flex items-start gap-2">
                <span className="text-white/40 text-xs w-14 shrink-0 mt-0.5">WP</span>
                <p className="text-white/60 font-googletexte text-base">{row.wp}</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-lightyellow/70 text-xs w-14 shrink-0 mt-0.5">Headless</span>
                <p className="text-white/90 font-googletexte text-base">{row.headless}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 5,
    badge: "Preuves d'Impact Mesurables",
    title: "Quelques exemples de résultats concrets",
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-mediumblue/80 p-4 sm:p-6 rounded-2xl text-white shadow-lg transition-transform border border-white/10">
            <Image 
              src="/img/desktop-screen-lesdoleances.png"
              alt="Les Doléances"
              width={1600}
              height={900}
              className="aspect-video w-full h-auto rounded-lg mb-4 object-cover"
              />            
            <h4 className="text-lightyellow font-googletitre font-medium text-lg sm:text-xl mb-2">
              <Link
                href="/etudes-de-cas/doleances"
                className="text-lightyellow hover:underline transition-colors"
                  >
              Les Doléances
              </Link>
            </h4>
            <p className="text-white/80 font-googletexte text-sm sm:text-base">
              Gain en légitimité et reconnaissance comme acteur principal de la démarche de publicisation nationale des cahiers de doléances de 2018.
            </p>
          </div>
          <div className="bg-mediumblue/80 p-4 sm:p-6 rounded-2xl text-white shadow-lg hover:scale-105 transition-transform border border-white/10">
            <Image 
              src="/img/desktop-screen-cdf.jpg"
              alt="Comme des fous"
              width={1600}
              height={900}
              className="aspect-video w-full h-auto rounded-lg mb-4 object-cover"
              />     
            <h4 className="font-googletitre font-medium text-lg sm:text-xl mb-2">
              <Link
                href="/etudes-de-cas/comme-des-fous"
                className="text-lightyellow hover:underline transition-colors"
                  >
              Comme des fous
              </Link>
            </h4>
            <p className="text-white/80 font-googletexte text-sm sm:text-base">
              Repositionnement en leader des médias santé mentale et hausse du trafic et de l'audience sur les réseaux sociaux.
            </p>
          </div>
        </div>
      </div>
    ),
  },
];

export default function TarifsESSCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slides on a loop
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="bg-white/10 h-1 sm:h-1.5 rounded-full max-w-5xl mx-auto mb-4 sm:mb-6">
        <motion.div
          className="bg-lightyellow h-1 sm:h-1.5 rounded-full"
          initial={false}
          animate={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 flex flex-col min-h-0 w-full">
        <div className="bg-mediumblue/60 backdrop-blur-lg rounded-2xl border border-white/10 p-4 sm:p-6 md:p-8 lg:p-12 relative">
          <div className="grid [&>*]:col-start-1 [&>*]:row-start-1">
            {slides.map((s, index) => {
              const isActive = index === currentSlide;
              return (
                <motion.div
                  key={s.id}
                  animate={{ opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className={!isActive ? "pointer-events-none" : ""}
                  drag={isActive ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.3}
                  onDragEnd={(_e, { offset, velocity }) => {
                    const swipe = Math.abs(offset.x) * velocity.x;
                    if (swipe < -3000 || offset.x < -50) {
                      nextSlide();
                    } else if (swipe > 3000 || offset.x > 50) {
                      prevSlide();
                    }
                  }}
                  style={{ touchAction: "pan-y" }}
                >
                  <div className="mb-4 sm:mb-6 md:mb-8">
                    <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-googletitre font-medium text-white mb-3 sm:mb-4">
                      {s.title}
                    </h3>
                    <div className="h-1 w-16 sm:w-24 bg-lightyellow rounded-full" />
                  </div>
                  {s.content}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="shrink-0 pt-6 pb-2">
          <div className="flex items-center justify-center">
            <div className="flex gap-2 sm:gap-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2.5 sm:h-3.5 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-lightyellow w-8 sm:w-12"
                      : "bg-white/30 hover:bg-white/50 w-2.5 sm:w-3.5"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Slide Counter */}
          <div className="text-center mt-3 text-white/40 font-googletexte text-sm">
            {currentSlide + 1} / {slides.length}
          </div>
        </div>
      </div>
    </div>
  );
}
